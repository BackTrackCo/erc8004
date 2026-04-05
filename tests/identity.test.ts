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

  it('throws on empty address', async () => {
    const client = {} as unknown as PublicClient

    await expect(
      isRegistered(client, {
        registryAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
        address: '' as `0x${string}`,
      }),
    ).rejects.toThrow('address is required')
  })

  it('throws on empty registryAddress', async () => {
    const client = {} as unknown as PublicClient

    await expect(
      isRegistered(client, {
        registryAddress: '' as `0x${string}`,
        address: '0x1234567890123456789012345678901234567890',
      }),
    ).rejects.toThrow('registryAddress is required')
  })
})

describe('registerAgent', () => {
  it('throws on empty agentURI', async () => {
    const client = {} as unknown as WalletClient

    await expect(
      registerAgent(client, {
        registryAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
        agentURI: '',
      }),
    ).rejects.toThrow('agentURI is required')
  })

  it('throws on empty registryAddress', async () => {
    const client = {} as unknown as WalletClient

    await expect(
      registerAgent(client, {
        registryAddress: '' as `0x${string}`,
        agentURI: 'https://example.com/agent.json',
      }),
    ).rejects.toThrow('registryAddress is required')
  })

  it('calls writeContract with correct args for simple register', async () => {
    const txHash = '0xabc123' as `0x${string}`
    const client = {
      writeContract: vi.fn().mockResolvedValue(txHash),
      chain: { id: 8453 },
      account: { address: '0x1234567890123456789012345678901234567890' },
    } as unknown as WalletClient

    const result = await registerAgent(client, {
      registryAddress: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
      agentURI: 'https://example.com/agent.json',
    })

    expect(result).toBe(txHash)
    expect(client.writeContract).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'register',
        args: ['https://example.com/agent.json'],
      }),
    )
  })

  it('calls writeContract with metadata when provided', async () => {
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
        functionName: 'register',
        args: [
          'https://example.com/agent.json',
          [{ metadataKey: 'x402r.operators', metadataValue: '0xabcd' }],
        ],
      }),
    )
  })
})
