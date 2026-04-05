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
 * Sources: Basescan/Etherscan contract verification, agent0-sdk DEFAULT_REGISTRIES,
 * erc-8004-contracts repo README.
 */
const ERC8004_REGISTRIES: Record<number, Erc8004Addresses> = {
  // Mainnets — verified via block explorer + erc-8004-contracts repo
  1: MAINNET_ADDRESSES, // Ethereum (Etherscan verified, 15K+ txns)
  8453: MAINNET_ADDRESSES, // Base (Basescan verified)
  137: MAINNET_ADDRESSES, // Polygon (Polygonscan verified)
  42161: MAINNET_ADDRESSES, // Arbitrum (RPC verified, 8004scan indexes)
  10: MAINNET_ADDRESSES, // Optimism (RPC verified, erc-8004 repo)
  // Testnets — verified via agent0-sdk + RPC
  84532: TESTNET_ADDRESSES, // Base Sepolia
  11155111: TESTNET_ADDRESSES, // Ethereum Sepolia
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
