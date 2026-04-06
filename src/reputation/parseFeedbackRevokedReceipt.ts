import { type Address, parseEventLogs, type TransactionReceipt } from 'viem'
import { reputationRegistryAbi } from '../abis/index.js'

export interface FeedbackRevokedResult {
  agentId: bigint
  clientAddress: Address
  feedbackIndex: bigint
}

/** Extract agentId, clientAddress, and feedbackIndex from a `revokeFeedback` transaction receipt. */
export function parseFeedbackRevokedReceipt(
  receipt: TransactionReceipt,
): FeedbackRevokedResult {
  const logs = parseEventLogs({
    abi: reputationRegistryAbi,
    logs: receipt.logs,
    eventName: 'FeedbackRevoked',
  })
  if (logs.length === 0) {
    throw new Error('No FeedbackRevoked event found in receipt')
  }
  const { agentId, clientAddress, feedbackIndex } = logs[0].args
  return { agentId, clientAddress, feedbackIndex }
}
