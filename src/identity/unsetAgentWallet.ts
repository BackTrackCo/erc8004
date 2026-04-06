import type { Hash, WalletClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import { requireAccount } from '../internal/requireAccount.js'
import { resolveIdentityRegistry } from '../internal/resolveRegistryAddress.js'
import type { UnsetAgentWalletParameters } from './types.js'

/**
 * Clear the agent wallet, reverting to the NFT owner as the default.
 * Only the agent owner or an approved operator can call this.
 */
export async function unsetAgentWallet(
  walletClient: WalletClient,
  parameters: UnsetAgentWalletParameters,
): Promise<Hash> {
  const account = requireAccount(walletClient)
  const registry = resolveIdentityRegistry(
    walletClient,
    parameters.registryAddress,
  )

  return walletClient.writeContract({
    address: registry,
    abi: identityRegistryAbi,
    functionName: 'unsetAgentWallet',
    args: [parameters.agentId],
    chain: walletClient.chain,
    account,
  })
}
