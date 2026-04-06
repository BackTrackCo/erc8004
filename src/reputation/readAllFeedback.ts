import type { PublicClient } from 'viem'
import { reputationRegistryAbi } from '../abis/index.js'
import { resolveReputationRegistry } from '../internal/resolveRegistryAddress.js'
import type { FeedbackEntry, ReadAllFeedbackParameters } from './types.js'

/**
 * Read all feedback for an agent, filtered by reviewer addresses, tags,
 * and revocation status.
 *
 * The contract returns 7 parallel arrays — this function transforms them
 * into an array of structured objects for better DX.
 */
export async function readAllFeedback(
  publicClient: PublicClient,
  parameters: ReadAllFeedbackParameters,
): Promise<readonly FeedbackEntry[]> {
  const registry = resolveReputationRegistry(
    publicClient,
    parameters.registryAddress,
  )

  const [
    clients,
    feedbackIndexes,
    values,
    valueDecimals,
    tag1s,
    tag2s,
    revokedStatuses,
  ] = await publicClient.readContract({
    address: registry,
    abi: reputationRegistryAbi,
    functionName: 'readAllFeedback',
    args: [
      parameters.agentId,
      parameters.clientAddresses,
      parameters.tag1,
      parameters.tag2,
      parameters.includeRevoked ?? false,
    ],
  })

  return clients.map((client, i) => ({
    client,
    feedbackIndex: feedbackIndexes[i],
    value: values[i],
    valueDecimals: valueDecimals[i],
    tag1: tag1s[i],
    tag2: tag2s[i],
    isRevoked: revokedStatuses[i],
  }))
}
