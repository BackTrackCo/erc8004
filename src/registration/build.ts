import type {
  AgentRegistrationFile,
  RegistrationBinding,
  ServiceEntry,
} from './types.js'

const REGISTRATION_TYPE =
  'https://eips.ethereum.org/EIPS/eip-8004#registration-v1' as const

export interface CreateRegistrationFileParameters {
  name: string
  description: string
  image: string
  services: ServiceEntry[]
  x402Support?: boolean
  active?: boolean
  registrations?: RegistrationBinding[]
  supportedTrust?: string[]
}

/**
 * Build a valid Agent Registration File with the spec `type` set automatically.
 */
export function createRegistrationFile(
  params: CreateRegistrationFileParameters,
): AgentRegistrationFile {
  return {
    type: REGISTRATION_TYPE,
    name: params.name,
    description: params.description,
    image: params.image,
    services: params.services,
    ...(params.x402Support !== undefined && {
      x402Support: params.x402Support,
    }),
    ...(params.active !== undefined && { active: params.active }),
    ...(params.registrations !== undefined && {
      registrations: params.registrations,
    }),
    ...(params.supportedTrust !== undefined && {
      supportedTrust: params.supportedTrust,
    }),
  }
}
