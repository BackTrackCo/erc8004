import { parseRegistrationFile } from './parse.js'
import type { AgentRegistrationFile } from './types.js'

const DEFAULT_IPFS_GATEWAY = 'https://ipfs.io'

export interface FetchRegistrationFileOptions {
  /** IPFS gateway base URL. Default: `https://ipfs.io`. */
  ipfsGateway?: string
}

/**
 * Fetch and validate an Agent Registration File from a URI.
 *
 * Supported schemes:
 * - `https://` — fetched via `globalThis.fetch`
 * - `data:application/json;base64,...` — decoded inline (fully on-chain storage)
 * - `data:application/json,...` — URL-decoded inline
 * - `ipfs://<cid>` — resolved via public IPFS gateway (configurable)
 *
 * @throws on unsupported scheme, non-200 response, non-JSON body, or invalid schema
 */
export async function fetchRegistrationFile(
  uri: string,
  options?: FetchRegistrationFileOptions,
): Promise<AgentRegistrationFile> {
  if (uri.startsWith('data:')) {
    return parseDataUri(uri)
  }

  let fetchUrl: string
  if (uri.startsWith('ipfs://')) {
    const gateway = options?.ipfsGateway ?? DEFAULT_IPFS_GATEWAY
    const base = gateway.endsWith('/') ? gateway.slice(0, -1) : gateway
    const path = uri.slice(7) // strip "ipfs://"
    fetchUrl = `${base}/ipfs/${path}`
  } else if (uri.startsWith('https://')) {
    fetchUrl = uri
  } else {
    throw new Error(
      `Unsupported URI scheme (expected https, data, or ipfs): ${uri.slice(0, 40)}`,
    )
  }

  const response = await globalThis.fetch(fetchUrl, {
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch registration file: HTTP ${response.status}`,
    )
  }

  const text = await response.text()
  if (text.length > 1_048_576) {
    throw new Error('Registration file exceeds 1 MB size limit')
  }

  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error('Response is not valid JSON')
  }

  return parseRegistrationFile(json)
}

// ---------------------------------------------------------------------------
// data: URI parsing
// ---------------------------------------------------------------------------

function parseDataUri(uri: string): AgentRegistrationFile {
  const commaIndex = uri.indexOf(',')
  if (commaIndex === -1) {
    throw new Error('Malformed data URI: missing comma separator')
  }

  const header = uri.slice(5, commaIndex) // strip "data:" prefix
  const payload = uri.slice(commaIndex + 1)

  // Validate MIME type — accept application/json with optional charset
  const mimeEnd = header.indexOf(';')
  const mime = mimeEnd === -1 ? header : header.slice(0, mimeEnd)
  if (mime !== 'application/json') {
    throw new Error(
      `data URI must have application/json MIME type, got: ${mime}`,
    )
  }

  const isBase64 = header.endsWith(';base64')

  let decoded: string
  try {
    decoded = isBase64 ? atob(payload) : decodeURIComponent(payload)
  } catch {
    throw new Error(
      `Failed to decode data URI (${isBase64 ? 'base64' : 'percent-encoded'})`,
    )
  }

  if (decoded.length > 1_048_576) {
    throw new Error('Registration file exceeds 1 MB size limit')
  }

  let json: unknown
  try {
    json = JSON.parse(decoded)
  } catch {
    throw new Error('data URI content is not valid JSON')
  }

  return parseRegistrationFile(json)
}
