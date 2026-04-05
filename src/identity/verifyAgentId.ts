import { isAddressEqual, type PublicClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import type { VerifyAgentIdParameters } from './types.js'

/**
 * Verify that an agentId belongs to the claimed address.
 * Checks `ownerOf(agentId) == claimedAddress`.
 *
 * Returns `false` if the agentId does not exist (ERC-721 reverts on
 * non-existent tokens — this is caught and treated as "not verified").
 *
 * This is the mandatory first step before trusting any agentId received
 * from protocol touchpoints (attestation, 402 response, payment payload).
 * An unverified agentId must never be used for reputation reads or writes.
 */
export async function verifyAgentId(
  publicClient: PublicClient,
  parameters: VerifyAgentIdParameters,
): Promise<boolean> {
  const { registryAddress, agentId, claimedAddress } = parameters

  try {
    const owner = await publicClient.readContract({
      address: registryAddress,
      abi: identityRegistryAbi,
      functionName: 'ownerOf',
      args: [agentId],
    })

    return isAddressEqual(owner, claimedAddress)
  } catch {
    return false
  }
}
