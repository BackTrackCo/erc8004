import type { PublicClient } from 'viem'
import { reputationRegistryAbi } from '../abis/index.js'
import { resolveReputationRegistry } from '../internal/resolveRegistryAddress.js'
import type { GetResponseCountParameters } from './types.js'

/**
 * Get the number of responses to a specific feedback entry from
 * a set of responder addresses.
 */
export async function getResponseCount(
  publicClient: PublicClient,
  parameters: GetResponseCountParameters,
): Promise<bigint> {
  const registry = resolveReputationRegistry(
    publicClient,
    parameters.registryAddress,
  )

  return publicClient.readContract({
    address: registry,
    abi: reputationRegistryAbi,
    functionName: 'getResponseCount',
    args: [
      parameters.agentId,
      parameters.clientAddress,
      parameters.feedbackIndex,
      parameters.responders,
    ],
  })
}
