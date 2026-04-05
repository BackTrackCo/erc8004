import type { Hash, WalletClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
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

  if (!walletClient.account) {
    throw new Error(
      'walletClient must have an account — use a walletClient with a connected account',
    )
  }

  return walletClient.writeContract({
    address: registryAddress,
    abi: identityRegistryAbi,
    functionName: 'setAgentURI',
    args: [agentId, newURI],
    chain: walletClient.chain,
    account: walletClient.account,
  })
}
