import type { AgentRegistrationFile } from './types.js'
import { REGISTRATION_TYPE } from './types.js'

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

  if (obj.x402Support !== undefined && typeof obj.x402Support !== 'boolean') {
    throw new Error('"x402Support" must be a boolean when present')
  }

  if (obj.active !== undefined && typeof obj.active !== 'boolean') {
    throw new Error('"active" must be a boolean when present')
  }

  if (obj.registrations !== undefined) {
    if (!Array.isArray(obj.registrations)) {
      throw new Error('"registrations" must be an array when present')
    }
    for (let i = 0; i < obj.registrations.length; i++) {
      validateRegistrationBinding(obj.registrations[i], i)
    }
  }

  if (obj.supportedTrust !== undefined) {
    if (!Array.isArray(obj.supportedTrust)) {
      throw new Error('"supportedTrust" must be an array when present')
    }
    for (let i = 0; i < obj.supportedTrust.length; i++) {
      if (typeof obj.supportedTrust[i] !== 'string') {
        throw new Error(`supportedTrust[${i}] must be a string`)
      }
    }
  }

  // Coerce registrations[].agentId to bigint (JSON.parse produces number)
  if (obj.registrations) {
    for (const binding of obj.registrations as Array<Record<string, unknown>>) {
      binding.agentId = BigInt(binding.agentId as number)
    }
  }

  return obj as unknown as AgentRegistrationFile
}

function validateRegistrationBinding(entry: unknown, index: number): void {
  if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
    throw new Error(`registrations[${index}] must be an object`)
  }
  const binding = entry as Record<string, unknown>
  if (
    typeof binding.agentId !== 'bigint' &&
    typeof binding.agentId !== 'number'
  ) {
    throw new Error(
      `registrations[${index}].agentId must be a number or bigint`,
    )
  }
  if (typeof binding.agentRegistry !== 'string') {
    throw new Error(`registrations[${index}].agentRegistry must be a string`)
  }
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
