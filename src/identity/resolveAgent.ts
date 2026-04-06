import { isAddressEqual, type PublicClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import { resolveIdentityRegistry } from '../internal/resolveRegistryAddress.js'
import type { ResolveAgentParameters, ResolvedAgent } from './types.js'

/**
 * Resolve an agent by ID — returns owner, wallet, and URI in one call.
 *
 * Throws if the agentId does not exist (ERC-721 reverts on non-existent tokens).
 * Use `verifyAgentId` first if you need a safe boolean check.
 *
 * `agentWallet` is `address(0)` after NFT transfer or explicit `unsetAgentWallet()`.
 * When `ownerMismatch` is true, use `owner` for the canonical address.
 */
export async function resolveAgent(
  publicClient: PublicClient,
  parameters: ResolveAgentParameters,
): Promise<ResolvedAgent> {
  const registry = resolveIdentityRegistry(
    publicClient,
    parameters.registryAddress,
  )

  const [owner, agentWallet, agentURI] = await Promise.all([
    publicClient.readContract({
      address: registry,
      abi: identityRegistryAbi,
      functionName: 'ownerOf',
      args: [parameters.agentId],
    }),
    publicClient.readContract({
      address: registry,
      abi: identityRegistryAbi,
      functionName: 'getAgentWallet',
      args: [parameters.agentId],
    }),
    publicClient.readContract({
      address: registry,
      abi: identityRegistryAbi,
      functionName: 'tokenURI',
      args: [parameters.agentId],
    }),
  ])

  return {
    agentId: parameters.agentId,
    owner,
    agentWallet,
    agentURI,
    ownerMismatch: !isAddressEqual(owner, agentWallet),
  }
}
