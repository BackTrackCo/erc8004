import type { Address, Hex } from 'viem'

export interface RegisterAgentParameters {
  registryAddress?: Address
  agentURI: string
  metadata?: Array<{ key: string; value: Hex }>
}

export interface IsRegisteredParameters {
  registryAddress?: Address
  address: Address
}

export interface VerifyAgentIdParameters {
  registryAddress?: Address
  agentId: bigint
  claimedAddress: Address
}

export interface ResolveAgentParameters {
  registryAddress?: Address
  agentId: bigint
}

export interface ResolvedAgent {
  agentId: bigint
  owner: Address
  agentWallet: Address
  agentURI: string
  ownerMismatch: boolean
}

export interface GetAgentWalletParameters {
  registryAddress?: Address
  agentId: bigint
}

export interface GetMetadataParameters {
  registryAddress?: Address
  agentId: bigint
  key: string
}

export interface SetMetadataParameters {
  registryAddress?: Address
  agentId: bigint
  key: string
  value: Hex
}

export interface SetAgentURIParameters {
  registryAddress?: Address
  agentId: bigint
  newURI: string
}
