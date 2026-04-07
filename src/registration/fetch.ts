import { parseRegistrationFile } from './parse.js'
import type { AgentRegistrationFile } from './types.js'

/**
 * Fetch and validate an Agent Registration File from an HTTPS URL.
 *
 * Uses `globalThis.fetch` — no external HTTP dependencies required.
 *
 * @throws on non-HTTPS URL, non-200 response, non-JSON body, or invalid schema
 */
export async function fetchRegistrationFile(
  uri: string,
): Promise<AgentRegistrationFile> {
  if (!uri.startsWith('https://')) {
    throw new Error(`Only HTTPS URIs are supported, got: ${uri.slice(0, 40)}`)
  }

  const response = await globalThis.fetch(uri)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch registration file: HTTP ${response.status}`,
    )
  }

  let json: unknown
  try {
    json = await response.json()
  } catch {
    throw new Error('Response is not valid JSON')
  }

  return parseRegistrationFile(json)
}
