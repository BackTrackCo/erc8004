import type {
  AgentRegistrationFile,
  CreateRegistrationFileParameters,
} from './types.js'
import { REGISTRATION_TYPE } from './types.js'

/**
 * Build a valid Agent Registration File with the spec `type` set automatically.
 */
export function createRegistrationFile(
  parameters: CreateRegistrationFileParameters,
): AgentRegistrationFile {
  return { type: REGISTRATION_TYPE, ...parameters } as AgentRegistrationFile
}
