import { type Address, parseEventLogs, type TransactionReceipt } from 'viem'
import { reputationRegistryAbi } from '../abis/index.js'

export interface GiveFeedbackResult {
  agentId: bigint
  clientAddress: Address
  feedbackIndex: bigint
  value: bigint
  valueDecimals: number
  tag1: string
  tag2: string
  endpoint: string
  feedbackURI: string
  feedbackHash: `0x${string}`
}

/**
 * Extract the agentId, clientAddress, and feedbackIndex from a `giveFeedback` transaction receipt.
 * Parses the `NewFeedback` event emitted by the Reputation Registry.
 */
export function parseGiveFeedbackReceipt(
  receipt: TransactionReceipt,
): GiveFeedbackResult {
  const logs = parseEventLogs({
    abi: reputationRegistryAbi,
    logs: receipt.logs,
    eventName: 'NewFeedback',
  })
  if (logs.length === 0) {
    throw new Error('No NewFeedback event found in receipt')
  }
  const args = logs[0].args
  return {
    agentId: args.agentId,
    clientAddress: args.clientAddress,
    feedbackIndex: args.feedbackIndex,
    value: args.value,
    valueDecimals: args.valueDecimals,
    tag1: args.tag1,
    tag2: args.tag2,
    endpoint: args.endpoint,
    feedbackURI: args.feedbackURI,
    feedbackHash: args.feedbackHash,
  }
}
