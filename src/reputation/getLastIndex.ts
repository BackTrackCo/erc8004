import type { PublicClient } from 'viem'
import { reputationRegistryAbi } from '../abis/index.js'
import { resolveReputationRegistry } from '../internal/resolveRegistryAddress.js'
import type { GetLastIndexParameters } from './types.js'

/**
 * Get the latest feedback index for a specific agent-client pair.
 */
export async function getLastIndex(
  publicClient: PublicClient,
  parameters: GetLastIndexParameters,
): Promise<bigint> {
  const registry = resolveReputationRegistry(
    publicClient,
    parameters.registryAddress,
  )

  return publicClient.readContract({
    address: registry,
    abi: reputationRegistryAbi,
    functionName: 'getLastIndex',
    args: [parameters.agentId, parameters.clientAddress],
  })
}
