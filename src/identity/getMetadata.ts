import type { Hex, PublicClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
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
  const { registryAddress, agentId, key } = parameters

  return publicClient.readContract({
    address: registryAddress,
    abi: identityRegistryAbi,
    functionName: 'getMetadata',
    args: [agentId, key],
  })
}
