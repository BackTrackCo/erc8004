import type { Hash, WalletClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import { requireAccount } from '../internal/requireAccount.js'
import { resolveIdentityRegistry } from '../internal/resolveRegistryAddress.js'
import type { SetMetadataParameters } from './types.js'

/**
 * Set on-chain metadata for an agent. Requires ownership of the agent NFT.
 * Key-value pairs are stored on-chain and indexed by the 8004 subgraph.
 */
export async function setMetadata(
  walletClient: WalletClient,
  parameters: SetMetadataParameters,
): Promise<Hash> {
  const account = requireAccount(walletClient)
  const registry = resolveIdentityRegistry(
    walletClient,
    parameters.registryAddress,
  )

  return walletClient.writeContract({
    address: registry,
    abi: identityRegistryAbi,
    functionName: 'setMetadata',
    args: [parameters.agentId, parameters.key, parameters.value],
    chain: walletClient.chain,
    account,
  })
}
