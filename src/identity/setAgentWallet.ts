import type { Hash, WalletClient } from 'viem'
import { identityRegistryAbi } from '../abis/index.js'
import { requireAccount } from '../internal/requireAccount.js'
import { resolveIdentityRegistry } from '../internal/resolveRegistryAddress.js'
import type { SetAgentWalletParameters } from './types.js'

/**
 * Set the verified payment wallet for an agent.
 * Requires an EIP-712 signature from `newWallet` proving consent.
 * The wallet clears on NFT transfer — call this again after any transfer.
 */
export async function setAgentWallet(
  walletClient: WalletClient,
  parameters: SetAgentWalletParameters,
): Promise<Hash> {
  const account = requireAccount(walletClient)
  const registry = resolveIdentityRegistry(
    walletClient,
    parameters.registryAddress,
  )

  return walletClient.writeContract({
    address: registry,
    abi: identityRegistryAbi,
    functionName: 'setAgentWallet',
    args: [
      parameters.agentId,
      parameters.newWallet,
      parameters.deadline,
      parameters.signature,
    ],
    chain: walletClient.chain,
    account,
  })
}
