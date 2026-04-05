import type { PublicClient } from 'viem'
import { reputationRegistryAbi } from '../abis/index.js'
import { resolveReputationRegistry } from '../internal/resolveRegistryAddress.js'
import type { GetSummaryParameters, ReputationSummary } from './types.js'

/**
 * Get an aggregated reputation summary for an agent, filtered by
 * reviewer addresses and tag pair.
 */
export async function getSummary(
  publicClient: PublicClient,
  parameters: GetSummaryParameters,
): Promise<ReputationSummary> {
  const registry = resolveReputationRegistry(
    publicClient,
    parameters.registryAddress,
  )

  const [count, summaryValue, summaryValueDecimals] =
    await publicClient.readContract({
      address: registry,
      abi: reputationRegistryAbi,
      functionName: 'getSummary',
      args: [
        parameters.agentId,
        parameters.clientAddresses,
        parameters.tag1,
        parameters.tag2,
      ],
    })

  return { count, summaryValue, summaryValueDecimals }
}
