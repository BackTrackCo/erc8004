import type { Hash, WalletClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import { requireAccount } from '../internal/requireAccount.js'
import type { SetAgentURIParameters } from './types.js'

/**
 * Update the agent URI. Requires ownership of the agent NFT.
 * The URI points to a JSON registration file with contact endpoints.
 */
export async function setAgentURI(
  walletClient: WalletClient,
  parameters: SetAgentURIParameters,
): Promise<Hash> {
  const { registryAddress, agentId, newURI } = parameters
  const account = requireAccount(walletClient)

  return walletClient.writeContract({
    address: registryAddress,
    abi: identityRegistryAbi,
    functionName: 'setAgentURI',
    args: [agentId, newURI],
    chain: walletClient.chain,
    account,
  })
}
