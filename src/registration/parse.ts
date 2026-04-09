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

  let obj = json as Record<string, unknown>

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

  // Coerce registrations[].agentId to bigint without mutating the input
  if (obj.registrations) {
    obj = {
      ...obj,
      registrations: (obj.registrations as Array<Record<string, unknown>>).map(
        (b) => ({
          ...b,
          agentId: BigInt(b.agentId as string | number | bigint),
        }),
      ),
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
    typeof binding.agentId !== 'number' &&
    typeof binding.agentId !== 'string'
  ) {
    throw new Error(
      `registrations[${index}].agentId must be a string, number, or bigint`,
    )
  }
  if (typeof binding.agentId === 'string' && !/^\d+$/.test(binding.agentId)) {
    throw new Error(
      `registrations[${index}].agentId string must be a non-negative integer, got "${binding.agentId}"`,
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
