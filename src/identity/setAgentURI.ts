import type { Hash, WalletClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import { requireAccount } from '../internal/requireAccount.js'
import { resolveIdentityRegistry } from '../internal/resolveRegistryAddress.js'
import type { SetAgentURIParameters } from './types.js'

/**
 * Update the agent URI. Requires ownership of the agent NFT.
 * The URI points to a JSON registration file with contact endpoints.
 */
export async function setAgentURI(
  walletClient: WalletClient,
  parameters: SetAgentURIParameters,
): Promise<Hash> {
  const account = requireAccount(walletClient)
  const registry = resolveIdentityRegistry(
    walletClient,
    parameters.registryAddress,
  )

  return walletClient.writeContract({
    address: registry,
    abi: identityRegistryAbi,
    functionName: 'setAgentURI',
    args: [parameters.agentId, parameters.newURI],
    chain: walletClient.chain,
    account,
  })
}
