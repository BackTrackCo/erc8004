import type { Hash, WalletClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import type { RegisterAgentParameters } from './types.js'

/**
 * Register as an ERC-8004 agent. Mints an agent NFT (ERC-721) to the caller.
 * Returns the transaction hash — use receipt to extract the agentId from
 * the `Registered` event.
 */
export async function registerAgent(
  walletClient: WalletClient,
  parameters: RegisterAgentParameters,
): Promise<Hash> {
  const { registryAddress, agentURI, metadata } = parameters

  if (!walletClient.account) {
    throw new Error(
      'walletClient must have an account — use a walletClient with a connected account',
    )
  }

  if (metadata && metadata.length > 0) {
    return walletClient.writeContract({
      address: registryAddress,
      abi: identityRegistryAbi,
      functionName: 'register',
      args: [
        agentURI,
        metadata.map((m) => ({
          metadataKey: m.key,
          metadataValue: m.value,
        })),
      ],
      chain: walletClient.chain,
      account: walletClient.account,
    })
  }

  return walletClient.writeContract({
    address: registryAddress,
    abi: identityRegistryAbi,
    functionName: 'register',
    args: [agentURI],
    chain: walletClient.chain,
    account: walletClient.account,
  })
}
