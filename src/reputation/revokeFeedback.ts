import type { Hash, WalletClient } from 'viem'
import { reputationRegistryAbi } from '../abis/index.js'
import { requireAccount } from '../internal/requireAccount.js'
import { resolveReputationRegistry } from '../internal/resolveRegistryAddress.js'
import type { RevokeFeedbackParameters } from './types.js'

/**
 * Revoke previously given feedback. Only the original feedback giver
 * (msg.sender at giveFeedback time) can revoke.
 */
export async function revokeFeedback(
  walletClient: WalletClient,
  parameters: RevokeFeedbackParameters,
): Promise<Hash> {
  const account = requireAccount(walletClient)
  const registry = resolveReputationRegistry(
    walletClient,
    parameters.registryAddress,
  )

  return walletClient.writeContract({
    address: registry,
    abi: reputationRegistryAbi,
    functionName: 'revokeFeedback',
    args: [parameters.agentId, parameters.feedbackIndex],
    chain: walletClient.chain,
    account,
  })
}
