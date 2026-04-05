import type { PublicClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
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
  const { registryAddress, address } = parameters

  const balance = await publicClient.readContract({
    address: registryAddress,
    abi: identityRegistryAbi,
    functionName: 'balanceOf',
    args: [address],
  })

  return balance > 0n
}
