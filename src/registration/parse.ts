import type { AgentRegistrationFile } from './types.js'

const REGISTRATION_TYPE =
  'https://eips.ethereum.org/EIPS/eip-8004#registration-v1' as const

/**
 * Parse and validate a JSON value as an ERC-8004 Agent Registration File.
 *
 * Validates required fields (`type`, `name`, `description`, `image`, `services`)
 * and ensures each service entry has at least `name` and `endpoint`.
 *
 * @throws on missing or invalid fields
 */
export function parseRegistrationFile(json: unknown): AgentRegistrationFile {
  if (typeof json !== 'object' || json === null || Array.isArray(json)) {
    throw new Error('Agent Registration File must be a JSON object')
  }

  const obj = json as Record<string, unknown>

  if (obj.type !== REGISTRATION_TYPE) {
    throw new Error(
      `Invalid registration type: expected "${REGISTRATION_TYPE}", got ${JSON.stringify(obj.type)}`,
    )
  }

  for (const field of ['name', 'description', 'image'] as const) {
    if (typeof obj[field] !== 'string') {
      throw new Error(`"${field}" must be a string, got ${typeof obj[field]}`)
    }
  }

  if (!Array.isArray(obj.services)) {
    throw new Error('"services" must be an array')
  }

  if (obj.services.length === 0) {
    throw new Error('"services" must contain at least one entry')
  }

  for (let i = 0; i < obj.services.length; i++) {
    validateServiceEntry(obj.services[i], i)
  }

  return obj as unknown as AgentRegistrationFile
}

function validateServiceEntry(entry: unknown, index: number): void {
  if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
    throw new Error(`services[${index}] must be an object`)
  }
  const svc = entry as Record<string, unknown>
  if (typeof svc.name !== 'string') {
    throw new Error(`services[${index}].name must be a string`)
  }
  if (typeof svc.endpoint !== 'string') {
    throw new Error(`services[${index}].endpoint must be a string`)
  }
}
