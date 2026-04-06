import type { Hash, WalletClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import { requireAccount } from '../internal/requireAccount.js'
import { resolveIdentityRegistry } from '../internal/resolveRegistryAddress.js'
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
  const { agentURI, metadata } = parameters
  const account = requireAccount(walletClient)
  const registry = resolveIdentityRegistry(
    walletClient,
    parameters.registryAddress,
  )

  if (agentURI !== undefined && metadata && metadata.length > 0) {
    return walletClient.writeContract({
      address: registry,
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
      account,
    })
  }

  if (agentURI !== undefined) {
    return walletClient.writeContract({
      address: registry,
      abi: identityRegistryAbi,
      functionName: 'register',
      args: [agentURI],
      chain: walletClient.chain,
      account,
    })
  }

  return walletClient.writeContract({
    address: registry,
    abi: identityRegistryAbi,
    functionName: 'register',
    args: [],
    chain: walletClient.chain,
    account,
  })
}
