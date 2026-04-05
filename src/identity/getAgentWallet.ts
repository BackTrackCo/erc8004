import type { Address, PublicClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import type { GetAgentWalletParameters } from './types.js'

/**
 * Get the wallet address associated with an agent.
 * Note: `agentWallet` clears on NFT transfer — check `ownerOf` too
 * if the agent may have transferred their NFT.
 */
export async function getAgentWallet(
  publicClient: PublicClient,
  parameters: GetAgentWalletParameters,
): Promise<Address> {
  const { registryAddress, agentId } = parameters

  return publicClient.readContract({
    address: registryAddress,
    abi: identityRegistryAbi,
    functionName: 'getAgentWallet',
    args: [agentId],
  })
}
