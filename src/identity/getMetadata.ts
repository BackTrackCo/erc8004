import type { Hex, PublicClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import { resolveIdentityRegistry } from '../internal/resolveRegistryAddress.js'
import type { GetMetadataParameters } from './types.js'

/**
 * Read on-chain metadata for an agent by key.
 * Returns raw bytes — caller is responsible for decoding
 * (e.g., `abi.decode` for structured data like operator associations).
 */
export async function getMetadata(
  publicClient: PublicClient,
  parameters: GetMetadataParameters,
): Promise<Hex> {
  const registry = resolveIdentityRegistry(
    publicClient,
    parameters.registryAddress,
  )

  return publicClient.readContract({
    address: registry,
    abi: identityRegistryAbi,
    functionName: 'getMetadata',
    args: [parameters.agentId, parameters.key],
  })
}
