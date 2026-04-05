import type { Address, Chain } from 'viem'
import { getErc8004Addresses } from '../addresses.js'

/**
 * Resolve Identity Registry address: explicit override → chain auto-resolve → throw.
 * Follows viem's ENS pattern (optional address with chain-based fallback).
 */
export function resolveIdentityRegistry(
  client: { chain?: Chain | undefined },
  registryAddress?: Address,
): Address {
  if (registryAddress) return registryAddress
  if (!client.chain) {
    throw new Error(
      'client chain not configured: registryAddress is required when client has no chain',
    )
  }
  return getErc8004Addresses(client.chain.id).identityRegistry
}

/**
 * Resolve Reputation Registry address: explicit override → chain auto-resolve → throw.
 */
export function resolveReputationRegistry(
  client: { chain?: Chain | undefined },
  registryAddress?: Address,
): Address {
  if (registryAddress) return registryAddress
  if (!client.chain) {
    throw new Error(
      'client chain not configured: registryAddress is required when client has no chain',
    )
  }
  return getErc8004Addresses(client.chain.id).reputationRegistry
}
