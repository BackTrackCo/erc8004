import type { Hash, WalletClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import type { SetMetadataParameters } from './types.js'

/**
 * Set on-chain metadata for an agent. Requires ownership of the agent NFT.
 * Key-value pairs are stored on-chain and indexed by the 8004 subgraph.
 */
export async function setMetadata(
  walletClient: WalletClient,
  parameters: SetMetadataParameters,
): Promise<Hash> {
  const { registryAddress, agentId, key, value } = parameters

  if (!walletClient.account) {
    throw new Error(
      'walletClient must have an account — use a walletClient with a connected account',
    )
  }

  return walletClient.writeContract({
    address: registryAddress,
    abi: identityRegistryAbi,
    functionName: 'setMetadata',
    args: [agentId, key, value],
    chain: walletClient.chain,
    account: walletClient.account,
  })
}
