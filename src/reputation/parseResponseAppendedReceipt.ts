import {
  type Address,
  type Hex,
  parseEventLogs,
  type TransactionReceipt,
} from 'viem'
import { reputationRegistryAbi } from '../abis/index.js'

export interface ResponseAppendedResult {
  agentId: bigint
  clientAddress: Address
  feedbackIndex: bigint
  responder: Address
  responseURI: string
  responseHash: Hex
}

/** Extract fields from an `appendResponse` transaction receipt. */
export function parseResponseAppendedReceipt(
  receipt: TransactionReceipt,
): ResponseAppendedResult {
  const logs = parseEventLogs({
    abi: reputationRegistryAbi,
    logs: receipt.logs,
    eventName: 'ResponseAppended',
  })
  if (logs.length === 0) {
    throw new Error('No ResponseAppended event found in receipt')
  }
  const args = logs[0].args
  return {
    agentId: args.agentId,
    clientAddress: args.clientAddress,
    feedbackIndex: args.feedbackIndex,
    responder: args.responder,
    responseURI: args.responseURI,
    responseHash: args.responseHash,
  }
}
