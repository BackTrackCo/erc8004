import type { PublicClient } from 'viem'
import { reputationRegistryAbi } from '../abis/index.js'
import { resolveReputationRegistry } from '../internal/resolveRegistryAddress.js'
import type { GetVersionParameters } from './types.js'

/** Read the contract version string from the Reputation Registry. */
export async function getVersion(
  publicClient: PublicClient,
  parameters: GetVersionParameters = {},
): Promise<string> {
  const registry = resolveReputationRegistry(
    publicClient,
    parameters.registryAddress,
  )

  return publicClient.readContract({
    address: registry,
    abi: reputationRegistryAbi,
    functionName: 'getVersion',
  })
}
