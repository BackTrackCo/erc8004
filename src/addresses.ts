import type { Address } from 'viem'
import type { Erc8004Addresses } from './types.js'

// Mainnet CREATE2 addresses (same on all mainnet chains)
const MAINNET_ADDRESSES = {
  identityRegistry: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432' as Address,
  reputationRegistry: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63' as Address,
} as const satisfies Erc8004Addresses

// Testnet CREATE2 addresses (same on all testnet chains)
const TESTNET_ADDRESSES = {
  identityRegistry: '0x8004A818BFB912233c491871b3d84c89A494BD9e' as Address,
  reputationRegistry: '0x8004B663056A597Dffe9eCcC1965A193B7388713' as Address,
} as const satisfies Erc8004Addresses

/**
 * Explicit per-chain address map.
 * Only includes chains with verified ERC-8004 deployment.
 */
const ERC8004_REGISTRIES: Record<number, Erc8004Addresses> = {
  // Mainnets
  1: MAINNET_ADDRESSES, // Ethereum
  8453: MAINNET_ADDRESSES, // Base
  137: MAINNET_ADDRESSES, // Polygon
  42161: MAINNET_ADDRESSES, // Arbitrum One
  10: MAINNET_ADDRESSES, // Optimism
  42220: MAINNET_ADDRESSES, // Celo
  43114: MAINNET_ADDRESSES, // Avalanche
  143: MAINNET_ADDRESSES, // Monad
  59144: MAINNET_ADDRESSES, // Linea
  // Testnets
  84532: TESTNET_ADDRESSES, // Base Sepolia
  11155111: TESTNET_ADDRESSES, // Ethereum Sepolia
  421614: TESTNET_ADDRESSES, // Arbitrum Sepolia
}

/**
 * Get ERC-8004 registry addresses for a chain.
 * Throws on unsupported chains — fail loud rather than return
 * potentially invalid addresses.
 */
export function getErc8004Addresses(chainId: number): Erc8004Addresses {
  const addresses = ERC8004_REGISTRIES[chainId]
  if (!addresses) {
    throw new Error(
      `ERC-8004 registries not verified on chain ${chainId}. ` +
        `Supported chains: ${Object.keys(ERC8004_REGISTRIES).join(', ')}`,
    )
  }
  return addresses
}

/** All chain IDs with verified ERC-8004 deployment. */
export const supportedChainIds = Object.keys(ERC8004_REGISTRIES).map(Number)

export { MAINNET_ADDRESSES, TESTNET_ADDRESSES }
