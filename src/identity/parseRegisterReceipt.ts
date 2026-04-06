import { type Address, parseEventLogs, type TransactionReceipt } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'

export interface RegisterResult {
  agentId: bigint
  owner: Address
  agentURI: string
}

/**
 * Extract the agentId, owner, and agentURI from a `registerAgent` transaction receipt.
 * Parses the `Registered` event emitted by the Identity Registry.
 */
export function parseRegisterReceipt(
  receipt: TransactionReceipt,
): RegisterResult {
  const logs = parseEventLogs({
    abi: identityRegistryAbi,
    logs: receipt.logs,
    eventName: 'Registered',
  })
  if (logs.length === 0) {
    throw new Error('No Registered event found in receipt')
  }
  const { agentId, owner, agentURI } = logs[0].args
  return { agentId, owner, agentURI }
}
