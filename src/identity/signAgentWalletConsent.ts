import type { Address, Hex, PublicClient, WalletClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import { resolveIdentityRegistry } from '../internal/resolveRegistryAddress.js'
import type { SignAgentWalletConsentParameters } from './types.js'

const AGENT_WALLET_SET_TYPES = {
  AgentWalletSet: [
    { name: 'agentId', type: 'uint256' },
    { name: 'newWallet', type: 'address' },
    { name: 'owner', type: 'address' },
    { name: 'deadline', type: 'uint256' },
  ],
} as const

/**
 * Sign EIP-712 typed data proving consent from `newWallet` for `setAgentWallet`.
 *
 * The walletClient must be the `newWallet` signer. The returned signature
 * is passed to `setAgentWallet` along with the same `agentId` and `deadline`.
 *
 * The contract enforces a max deadline of 5 minutes from `block.timestamp`.
 */
export async function signAgentWalletConsent(
  walletClient: WalletClient,
  publicClient: PublicClient,
  parameters: SignAgentWalletConsentParameters,
): Promise<Hex> {
  const registry = resolveIdentityRegistry(
    publicClient,
    parameters.registryAddress,
  )

  const owner = await publicClient.readContract({
    address: registry,
    abi: identityRegistryAbi,
    functionName: 'ownerOf',
    args: [parameters.agentId],
  })

  const chainId = publicClient.chain?.id
  if (!chainId) {
    throw new Error('publicClient chain not configured')
  }

  return walletClient.signTypedData({
    account: walletClient.account!,
    domain: {
      name: 'ERC8004IdentityRegistry',
      version: '1',
      chainId: BigInt(chainId),
      verifyingContract: registry,
    },
    types: AGENT_WALLET_SET_TYPES,
    primaryType: 'AgentWalletSet',
    message: {
      agentId: parameters.agentId,
      newWallet: parameters.newWallet,
      owner: owner as Address,
      deadline: parameters.deadline,
    },
  })
}
