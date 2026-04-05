import type { PublicClient } from 'viem'
import { reputationRegistryAbi } from '../abis/index.js'
import { resolveReputationRegistry } from '../internal/resolveRegistryAddress.js'
import type { Feedback, ReadFeedbackParameters } from './types.js'

/**
 * Read a single feedback entry by agent, client address, and index.
 */
export async function readFeedback(
  publicClient: PublicClient,
  parameters: ReadFeedbackParameters,
): Promise<Feedback> {
  const registry = resolveReputationRegistry(
    publicClient,
    parameters.registryAddress,
  )

  const [value, valueDecimals, tag1, tag2, isRevoked] =
    await publicClient.readContract({
      address: registry,
      abi: reputationRegistryAbi,
      functionName: 'readFeedback',
      args: [
        parameters.agentId,
        parameters.clientAddress,
        parameters.feedbackIndex,
      ],
    })

  return { value, valueDecimals, tag1, tag2, isRevoked }
}
