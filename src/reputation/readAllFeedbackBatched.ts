import type { PublicClient } from 'viem'
import { readAllFeedback } from './readAllFeedback.js'
import type {
  FeedbackEntry,
  ReadAllFeedbackBatchedParameters,
} from './types.js'

/**
 * Read all feedback for an agent, batching `clientAddresses` into chunks
 * to avoid RPC response size limits.
 *
 * Defaults to batches of 50 addresses. If `clientAddresses` fits within
 * a single batch, delegates directly to `readAllFeedback`.
 */
export async function readAllFeedbackBatched(
  publicClient: PublicClient,
  parameters: ReadAllFeedbackBatchedParameters,
): Promise<readonly FeedbackEntry[]> {
  const { batchSize = 50, ...rest } = parameters
  const { clientAddresses } = rest

  if (clientAddresses.length <= batchSize) {
    return readAllFeedback(publicClient, rest)
  }

  const results: FeedbackEntry[] = []
  for (let i = 0; i < clientAddresses.length; i += batchSize) {
    const chunk = clientAddresses.slice(i, i + batchSize)
    const batch = await readAllFeedback(publicClient, {
      ...rest,
      clientAddresses: chunk,
    })
    results.push(...batch)
  }
  return results
}
