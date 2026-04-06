import type { PublicClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import { resolveIdentityRegistry } from '../internal/resolveRegistryAddress.js'
import type { GetVersionParameters } from './types.js'

/** Read the contract version string from the Identity Registry. */
export async function getVersion(
  publicClient: PublicClient,
  parameters: GetVersionParameters = {},
): Promise<string> {
  const registry = resolveIdentityRegistry(
    publicClient,
    parameters.registryAddress,
  )

  return publicClient.readContract({
    address: registry,
    abi: identityRegistryAbi,
    functionName: 'getVersion',
  })
}
