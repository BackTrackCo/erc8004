import { type Hex, parseEventLogs, type TransactionReceipt } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'

export interface MetadataSetResult {
  agentId: bigint
  metadataKey: string
  metadataValue: Hex
}

/** Extract agentId, metadataKey, and metadataValue from a `setMetadata` transaction receipt. */
export function parseMetadataSetReceipt(
  receipt: TransactionReceipt,
): MetadataSetResult {
  const logs = parseEventLogs({
    abi: identityRegistryAbi,
    logs: receipt.logs,
    eventName: 'MetadataSet',
  })
  if (logs.length === 0) {
    throw new Error('No MetadataSet event found in receipt')
  }
  const { agentId, metadataKey, metadataValue } = logs[0].args
  return { agentId, metadataKey, metadataValue }
}
