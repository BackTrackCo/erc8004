import { type Hash, type WalletClient, zeroHash } from 'viem'
import { reputationRegistryAbi } from '../abis/index.js'
import { requireAccount } from '../internal/requireAccount.js'
import { resolveReputationRegistry } from '../internal/resolveRegistryAddress.js'
import type { GiveFeedbackParameters } from './types.js'

/**
 * Give feedback to an agent. The caller (msg.sender) is recorded as the
 * reviewer (client). `value` is `int128` on-chain — negative values
 * represent negative feedback. Two category tags and optional off-chain
 * data (endpoint, URI, hash) can be attached.
 */
export async function giveFeedback(
  walletClient: WalletClient,
  parameters: GiveFeedbackParameters,
): Promise<Hash> {
  const account = requireAccount(walletClient)
  const registry = resolveReputationRegistry(
    walletClient,
    parameters.registryAddress,
  )

  return walletClient.writeContract({
    address: registry,
    abi: reputationRegistryAbi,
    functionName: 'giveFeedback',
    args: [
      parameters.agentId,
      parameters.value,
      parameters.valueDecimals,
      parameters.tag1,
      parameters.tag2,
      parameters.endpoint ?? '',
      parameters.feedbackURI ?? '',
      parameters.feedbackHash ?? zeroHash,
    ],
    chain: walletClient.chain,
    account,
  })
}
