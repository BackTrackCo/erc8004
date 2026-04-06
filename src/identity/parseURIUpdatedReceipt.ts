import { type Address, parseEventLogs, type TransactionReceipt } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'

export interface URIUpdatedResult {
  agentId: bigint
  newURI: string
  updatedBy: Address
}

/** Extract agentId, newURI, and updatedBy from a `setAgentURI` transaction receipt. */
export function parseURIUpdatedReceipt(
  receipt: TransactionReceipt,
): URIUpdatedResult {
  const logs = parseEventLogs({
    abi: identityRegistryAbi,
    logs: receipt.logs,
    eventName: 'URIUpdated',
  })
  if (logs.length === 0) {
    throw new Error('No URIUpdated event found in receipt')
  }
  const { agentId, newURI, updatedBy } = logs[0].args
  return { agentId, newURI, updatedBy }
}
