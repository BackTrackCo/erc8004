import type { Address, PublicClient } from 'viem'
import { reputationRegistryAbi } from '../abis/index.js'
import { resolveReputationRegistry } from '../internal/resolveRegistryAddress.js'
import type { GetIdentityRegistryParameters } from './types.js'

/** Get the Identity Registry address linked to this Reputation Registry. */
export async function getIdentityRegistry(
  publicClient: PublicClient,
  parameters: GetIdentityRegistryParameters = {},
): Promise<Address> {
  const registry = resolveReputationRegistry(
    publicClient,
    parameters.registryAddress,
  )

  return publicClient.readContract({
    address: registry,
    abi: reputationRegistryAbi,
    functionName: 'getIdentityRegistry',
  }) as Promise<Address>
}
