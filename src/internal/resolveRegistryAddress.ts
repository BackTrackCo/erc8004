import type { Address, Chain } from 'viem'
import { getErc8004Addresses } from '../addresses.js'
import type { Erc8004Addresses } from '../types.js'

/**
 * Resolve a registry address: explicit override → chain auto-resolve → throw.
 * Follows viem's ENS pattern (optional address with chain-based fallback).
 */
function resolveRegistry(
  client: { chain?: Chain | undefined },
  field: keyof Erc8004Addresses,
  registryAddress?: Address,
): Address {
  if (registryAddress) return registryAddress
  if (!client.chain) {
    throw new Error(
      'client chain not configured: registryAddress is required when client has no chain',
    )
  }
  return getErc8004Addresses(client.chain.id)[field]
}

export function resolveIdentityRegistry(
  client: { chain?: Chain | undefined },
  registryAddress?: Address,
): Address {
  return resolveRegistry(client, 'identityRegistry', registryAddress)
}
