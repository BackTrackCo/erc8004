import type { Address, Hex } from 'viem'

// ---------------------------------------------------------------------------
// Write parameters
// ---------------------------------------------------------------------------

export interface GiveFeedbackParameters {
  registryAddress?: Address
  agentId: bigint
  value: bigint
  valueDecimals: number
  tag1: string
  tag2: string
  endpoint?: string
  feedbackURI?: string
  feedbackHash?: Hex
}

export interface RevokeFeedbackParameters {
  registryAddress?: Address
  agentId: bigint
  feedbackIndex: bigint
}

export interface AppendResponseParameters {
  registryAddress?: Address
  agentId: bigint
  clientAddress: Address
  feedbackIndex: bigint
  responseURI: string
  responseHash?: Hex
}

// ---------------------------------------------------------------------------
// Read parameters
// ---------------------------------------------------------------------------

export interface GetSummaryParameters {
  registryAddress?: Address
  agentId: bigint
  clientAddresses: readonly Address[]
  tag1: string
  tag2: string
}

export interface ReputationSummary {
  count: bigint
  summaryValue: bigint
  summaryValueDecimals: number
}

export interface GetClientsParameters {
  registryAddress?: Address
  agentId: bigint
}

export interface ReadAllFeedbackParameters {
  registryAddress?: Address
  agentId: bigint
  clientAddresses: readonly Address[]
  tag1: string
  tag2: string
  includeRevoked?: boolean
}

export interface ReadAllFeedbackBatchedParameters
  extends ReadAllFeedbackParameters {
  batchSize?: number
}

export interface FeedbackEntry {
  client: Address
  feedbackIndex: bigint
  value: bigint
  valueDecimals: number
  tag1: string
  tag2: string
  isRevoked: boolean
}

export interface ReadFeedbackParameters {
  registryAddress?: Address
  agentId: bigint
  clientAddress: Address
  feedbackIndex: bigint
}

export interface Feedback {
  value: bigint
  valueDecimals: number
  tag1: string
  tag2: string
  isRevoked: boolean
}

export interface GetLastIndexParameters {
  registryAddress?: Address
  agentId: bigint
  clientAddress: Address
}

export interface GetResponseCountParameters {
  registryAddress?: Address
  agentId: bigint
  clientAddress: Address
  feedbackIndex: bigint
  responders: readonly Address[]
}
