import { type Address, parseEventLogs, type TransactionReceipt } from 'viem'
import { reputationRegistryAbi } from '../abis/index.js'

export interface GiveFeedbackResult {
  agentId: bigint
  clientAddress: Address
  feedbackIndex: bigint
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
  const { agentId, clientAddress, feedbackIndex } = logs[0].args
  return { agentId, clientAddress, feedbackIndex }
}
