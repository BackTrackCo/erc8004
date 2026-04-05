import type { PublicClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import { resolveIdentityRegistry } from '../internal/resolveRegistryAddress.js'
import type { IsRegisteredParameters } from './types.js'

/**
 * Check if an address is a registered ERC-8004 agent.
 * Uses `balanceOf > 0` — this only gives a boolean, NOT the agentId.
 * To get the agentId, use protocol touchpoints (attestation, 402 response, payment payload).
 */
export async function isRegistered(
  publicClient: PublicClient,
  parameters: IsRegisteredParameters,
): Promise<boolean> {
  const registry = resolveIdentityRegistry(
    publicClient,
    parameters.registryAddress,
  )

  const balance = await publicClient.readContract({
    address: registry,
    abi: identityRegistryAbi,
    functionName: 'balanceOf',
    args: [parameters.address],
  })

  return balance > 0n
}
