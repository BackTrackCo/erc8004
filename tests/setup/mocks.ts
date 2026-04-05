import type { Address, PublicClient, WalletClient } from 'viem'
import { vi } from 'vitest'

export const REGISTRY = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432' as Address
export const ADDR_A = '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' as Address
export const ADDR_B = '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB' as Address

export function mockPublic(impl: Record<string, unknown>): PublicClient {
  return {
    chain: { id: 8453 },
    readContract: vi.fn(({ functionName }: { functionName: string }) => {
      if (functionName in impl) return Promise.resolve(impl[functionName])
      return Promise.reject(new Error(`unexpected call: ${functionName}`))
    }),
  } as unknown as PublicClient
}

export function mockWallet(
  opts: { account?: { address: Address } } = {
    account: { address: ADDR_A },
  },
): WalletClient {
  return {
    writeContract: vi.fn().mockResolvedValue('0xabc' as `0x${string}`),
    chain: { id: 8453 },
    ...opts,
  } as unknown as WalletClient
}
