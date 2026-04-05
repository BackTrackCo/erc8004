import type { Address, PublicClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import { resolveIdentityRegistry } from '../internal/resolveRegistryAddress.js'
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
  const registry = resolveIdentityRegistry(
    publicClient,
    parameters.registryAddress,
  )

  return publicClient.readContract({
    address: registry,
    abi: identityRegistryAbi,
    functionName: 'getAgentWallet',
    args: [parameters.agentId],
  })
}
