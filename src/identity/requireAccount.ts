import type { Account, WalletClient } from 'viem'

/**
 * Validate that a walletClient has a connected account.
 * Throws early with a clear message instead of letting viem fail
 * deep in the stack with a confusing error.
 */
export function requireAccount(walletClient: WalletClient): Account {
  if (!walletClient.account) {
    throw new Error(
      'walletClient must have an account — use a walletClient with a connected account',
    )
  }
  return walletClient.account
}
