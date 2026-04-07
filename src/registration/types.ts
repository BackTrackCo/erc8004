export interface AgentRegistrationFile {
  type: 'https://eips.ethereum.org/EIPS/eip-8004#registration-v1'
  name: string
  description: string
  image: string
  services: ServiceEntry[]
  x402Support?: boolean
  active?: boolean
  registrations?: RegistrationBinding[]
  supportedTrust?: string[]
}

export interface ServiceEntry {
  name: string
  endpoint: string
  version?: string
  [key: string]: unknown
}

export interface RegistrationBinding {
  agentId: number
  agentRegistry: string // "eip155:{chainId}:{registryAddress}"
}
