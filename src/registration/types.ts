import type { Address } from 'viem'

export const REGISTRATION_TYPE =
  'https://eips.ethereum.org/EIPS/eip-8004#registration-v1' as const

export interface AgentRegistrationFile {
  type: typeof REGISTRATION_TYPE
  name: string
  description: string
  image: string
  services: ServiceEntry[]
  active?: boolean
  registrations?: RegistrationBinding[]
  [key: string]: unknown
}

export interface ServiceEntry {
  name: string
  endpoint: string
  version?: string
  [key: string]: unknown
}

export interface RegistrationBinding {
  agentId: bigint
  agentRegistry: `eip155:${number}:0x${string}`
}

export type CreateRegistrationFileParameters = Omit<
  AgentRegistrationFile,
  'type'
>

export interface ResolveServiceEndpointParameters {
  agentId: bigint
  serviceName: string
  registryAddress?: Address
}

export interface ResolvedServiceEndpoint {
  endpoint: string
  service: ServiceEntry
  agentURI: string
}
