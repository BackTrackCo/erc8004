import type { Address, Hex } from 'viem'

export interface RegisterAgentParameters {
  registryAddress: Address
  agentURI: string
  metadata?: Array<{ key: string; value: Hex }>
}

export interface IsRegisteredParameters {
  registryAddress: Address
  address: Address
}
