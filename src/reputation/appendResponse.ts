import type { Hash, WalletClient } from 'viem'
import { reputationRegistryAbi } from '../abis/index.js'
import { requireAccount } from '../internal/requireAccount.js'
import { resolveReputationRegistry } from '../internal/resolveRegistryAddress.js'
import type { AppendResponseParameters } from './types.js'

/**
 * Append a response to existing feedback. Typically called by the agent
 * owner to respond to a reviewer's feedback.
 */
export async function appendResponse(
  walletClient: WalletClient,
  parameters: AppendResponseParameters,
): Promise<Hash> {
  const account = requireAccount(walletClient)
  const registry = resolveReputationRegistry(
    walletClient,
    parameters.registryAddress,
  )

  return walletClient.writeContract({
    address: registry,
    abi: reputationRegistryAbi,
    functionName: 'appendResponse',
    args: [
      parameters.agentId,
      parameters.clientAddress,
      parameters.feedbackIndex,
      parameters.responseURI,
      parameters.responseHash,
    ],
    chain: walletClient.chain,
    account,
  })
}
