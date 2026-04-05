import type { PublicClient, WalletClient } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import { isRegistered } from '../src/identity/isRegistered.js'
import { registerAgent } from '../src/identity/register.js'

describe('isRegistered', () => {
  it('returns true when balanceOf > 0', async () => {
    const client = {
      readContract: vi.fn().mockResolvedValue(1n),
    } as unknown as PublicClient

    const result = await isRegistered(client, {
      registryAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      address: '0x1234567890123456789012345678901234567890',
    })

    expect(result).toBe(true)
  })

  it('returns false when balanceOf is 0', async () => {
    const client = {
      readContract: vi.fn().mockResolvedValue(0n),
    } as unknown as PublicClient

    const result = await isRegistered(client, {
      registryAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      address: '0x1234567890123456789012345678901234567890',
    })

    expect(result).toBe(false)
  })
})

describe('registerAgent', () => {
  it('throws when walletClient has no account', async () => {
    const client = {
      account: undefined,
    } as unknown as WalletClient

    await expect(
      registerAgent(client, {
        registryAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
        agentURI: 'https://example.com/agent.json',
      }),
    ).rejects.toThrow('walletClient must have an account')
  })

  it('propagates writeContract rejection', async () => {
    const client = {
      writeContract: vi.fn().mockRejectedValue(new Error('execution reverted')),
      chain: { id: 8453 },
      account: { address: '0x1234567890123456789012345678901234567890' },
    } as unknown as WalletClient

    await expect(
      registerAgent(client, {
        registryAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
        agentURI: 'https://example.com/agent.json',
      }),
    ).rejects.toThrow('execution reverted')
  })

  it('maps metadata key/value fields correctly', async () => {
    const txHash = '0xdef456' as `0x${string}`
    const client = {
      writeContract: vi.fn().mockResolvedValue(txHash),
      chain: { id: 8453 },
      account: { address: '0x1234567890123456789012345678901234567890' },
    } as unknown as WalletClient

    const result = await registerAgent(client, {
      registryAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      agentURI: 'https://example.com/agent.json',
      metadata: [{ key: 'x402r.operators', value: '0xabcd' }],
    })

    expect(result).toBe(txHash)
    expect(client.writeContract).toHaveBeenCalledWith(
      expect.objectContaining({
        args: [
          'https://example.com/agent.json',
          [{ metadataKey: 'x402r.operators', metadataValue: '0xabcd' }],
        ],
      }),
    )
  })

  it('uses no-metadata overload when metadata is empty array', async () => {
    const txHash = '0xabc123' as `0x${string}`
    const client = {
      writeContract: vi.fn().mockResolvedValue(txHash),
      chain: { id: 8453 },
      account: { address: '0x1234567890123456789012345678901234567890' },
    } as unknown as WalletClient

    await registerAgent(client, {
      registryAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      agentURI: 'https://example.com/agent.json',
      metadata: [],
    })

    expect(client.writeContract).toHaveBeenCalledWith(
      expect.objectContaining({
        args: ['https://example.com/agent.json'],
      }),
    )
  })
})
