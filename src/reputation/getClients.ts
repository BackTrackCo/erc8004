import type { Address, PublicClient } from 'viem'
import { reputationRegistryAbi } from '../abis/index.js'
import { resolveReputationRegistry } from '../internal/resolveRegistryAddress.js'
import type { GetClientsParameters } from './types.js'

/**
 * Get all addresses that have given feedback to an agent.
 */
export async function getClients(
  publicClient: PublicClient,
  parameters: GetClientsParameters,
): Promise<readonly Address[]> {
  const registry = resolveReputationRegistry(
    publicClient,
    parameters.registryAddress,
  )

  return publicClient.readContract({
    address: registry,
    abi: reputationRegistryAbi,
    functionName: 'getClients',
    args: [parameters.agentId],
  })
}
