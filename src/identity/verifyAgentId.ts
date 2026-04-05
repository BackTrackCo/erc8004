import {
  BaseError,
  ContractFunctionRevertedError,
  isAddressEqual,
  type PublicClient,
} from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import { resolveIdentityRegistry } from '../internal/resolveRegistryAddress.js'
import type { VerifyAgentIdParameters } from './types.js'

/**
 * Verify that an agentId belongs to the claimed address.
 * Checks `ownerOf(agentId) == claimedAddress`.
 *
 * Returns `false` if the agentId does not exist (ERC-721 contract revert).
 * Re-throws infrastructure errors (network failures, RPC timeouts) — these
 * should not be silently treated as "not verified".
 *
 * This is the mandatory first step before trusting any agentId received
 * from protocol touchpoints (attestation, 402 response, payment payload).
 * An unverified agentId must never be used for reputation reads or writes.
 */
export async function verifyAgentId(
  publicClient: PublicClient,
  parameters: VerifyAgentIdParameters,
): Promise<boolean> {
  const registry = resolveIdentityRegistry(
    publicClient,
    parameters.registryAddress,
  )

  try {
    const owner = await publicClient.readContract({
      address: registry,
      abi: identityRegistryAbi,
      functionName: 'ownerOf',
      args: [parameters.agentId],
    })

    return isAddressEqual(owner, parameters.claimedAddress)
  } catch (error) {
    if (error instanceof BaseError) {
      const revert = error.walk(
        (e) => e instanceof ContractFunctionRevertedError,
      )
      if (revert) return false
    }
    throw error
  }
}
