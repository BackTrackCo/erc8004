import type { Address, PublicClient, WalletClient } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import { getAgentWallet } from '../src/identity/getAgentWallet.js'
import { getMetadata } from '../src/identity/getMetadata.js'
import { isRegistered } from '../src/identity/isRegistered.js'
import { registerAgent } from '../src/identity/register.js'
import { resolveAgent } from '../src/identity/resolveAgent.js'
import { setAgentURI } from '../src/identity/setAgentURI.js'
import { setMetadata } from '../src/identity/setMetadata.js'
import { verifyAgentId } from '../src/identity/verifyAgentId.js'

const REGISTRY = '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432' as Address
const ADDR_A = '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' as Address
const ADDR_B = '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB' as Address

function mockPublic(impl: Record<string, unknown>): PublicClient {
  return {
    readContract: vi.fn(({ functionName }: { functionName: string }) => {
      if (functionName in impl) return Promise.resolve(impl[functionName])
      return Promise.reject(new Error(`unexpected call: ${functionName}`))
    }),
  } as unknown as PublicClient
}

function mockWallet(
  opts: { account?: { address: Address } } = { account: { address: ADDR_A } },
): WalletClient {
  return {
    writeContract: vi.fn().mockResolvedValue('0xabc' as `0x${string}`),
    chain: { id: 8453 },
    ...opts,
  } as unknown as WalletClient
}

// --- isRegistered ---

describe('isRegistered', () => {
  it('returns true when balanceOf > 0', async () => {
    const result = await isRegistered(mockPublic({ balanceOf: 1n }), {
      registryAddress: REGISTRY,
      address: ADDR_A,
    })
    expect(result).toBe(true)
  })

  it('returns false when balanceOf is 0', async () => {
    const result = await isRegistered(mockPublic({ balanceOf: 0n }), {
      registryAddress: REGISTRY,
      address: ADDR_A,
    })
    expect(result).toBe(false)
  })
})

// --- registerAgent ---

describe('registerAgent', () => {
  it('throws when walletClient has no account', async () => {
    await expect(
      registerAgent(mockWallet({ account: undefined }), {
        registryAddress: REGISTRY,
        agentURI: 'https://example.com/agent.json',
      }),
    ).rejects.toThrow('walletClient must have an account')
  })

  it('maps metadata key/value fields correctly', async () => {
    const client = mockWallet()
    const result = await registerAgent(client, {
      registryAddress: REGISTRY,
      agentURI: 'https://example.com/agent.json',
      metadata: [{ key: 'x402r.operators', value: '0xabcd' }],
    })

    expect(result).toBe('0xabc')
    expect(client.writeContract).toHaveBeenCalledWith(
      expect.objectContaining({
        args: [
          'https://example.com/agent.json',
          [{ metadataKey: 'x402r.operators', metadataValue: '0xabcd' }],
        ],
      }),
    )
  })

  it('uses no-metadata overload when metadata is empty', async () => {
    const client = mockWallet()
    await registerAgent(client, {
      registryAddress: REGISTRY,
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

// --- verifyAgentId ---

describe('verifyAgentId', () => {
  it('returns true when ownerOf matches claimed address', async () => {
    const result = await verifyAgentId(mockPublic({ ownerOf: ADDR_A }), {
      registryAddress: REGISTRY,
      agentId: 1n,
      claimedAddress: ADDR_A,
    })
    expect(result).toBe(true)
  })

  it('returns false when ownerOf does not match', async () => {
    const result = await verifyAgentId(mockPublic({ ownerOf: ADDR_B }), {
      registryAddress: REGISTRY,
      agentId: 1n,
      claimedAddress: ADDR_A,
    })
    expect(result).toBe(false)
  })

  it('handles case-insensitive address comparison', async () => {
    const result = await verifyAgentId(
      mockPublic({ ownerOf: ADDR_A.toLowerCase() as Address }),
      {
        registryAddress: REGISTRY,
        agentId: 1n,
        claimedAddress: ADDR_A,
      },
    )
    expect(result).toBe(true)
  })
})

// --- resolveAgent ---

describe('resolveAgent', () => {
  it('merges ownerOf + getAgentWallet + tokenURI', async () => {
    const client = mockPublic({
      ownerOf: ADDR_A,
      getAgentWallet: ADDR_A,
      tokenURI: 'https://example.com/agent.json',
    })

    const agent = await resolveAgent(client, {
      registryAddress: REGISTRY,
      agentId: 42n,
    })

    expect(agent).toEqual({
      agentId: 42n,
      owner: ADDR_A,
      agentWallet: ADDR_A,
      agentURI: 'https://example.com/agent.json',
      ownerMismatch: false,
    })
  })

  it('sets ownerMismatch when owner differs from agentWallet', async () => {
    const client = mockPublic({
      ownerOf: ADDR_B,
      getAgentWallet: ADDR_A,
      tokenURI: 'https://example.com/agent.json',
    })

    const agent = await resolveAgent(client, {
      registryAddress: REGISTRY,
      agentId: 42n,
    })

    expect(agent.ownerMismatch).toBe(true)
    expect(agent.owner).toBe(ADDR_B)
    expect(agent.agentWallet).toBe(ADDR_A)
  })
})

// --- getAgentWallet ---

describe('getAgentWallet', () => {
  it('returns the agent wallet address', async () => {
    const result = await getAgentWallet(
      mockPublic({ getAgentWallet: ADDR_A }),
      { registryAddress: REGISTRY, agentId: 1n },
    )
    expect(result).toBe(ADDR_A)
  })
})

// --- getMetadata ---

describe('getMetadata', () => {
  it('returns raw bytes for a metadata key', async () => {
    const result = await getMetadata(
      mockPublic({ getMetadata: '0xdeadbeef' }),
      { registryAddress: REGISTRY, agentId: 1n, key: 'x402r.operators' },
    )
    expect(result).toBe('0xdeadbeef')
  })
})

// --- setMetadata ---

describe('setMetadata', () => {
  it('throws when walletClient has no account', async () => {
    await expect(
      setMetadata(mockWallet({ account: undefined }), {
        registryAddress: REGISTRY,
        agentId: 1n,
        key: 'x402r.operators',
        value: '0xabcd',
      }),
    ).rejects.toThrow('walletClient must have an account')
  })
})

// --- setAgentURI ---

describe('setAgentURI', () => {
  it('throws when walletClient has no account', async () => {
    await expect(
      setAgentURI(mockWallet({ account: undefined }), {
        registryAddress: REGISTRY,
        agentId: 1n,
        newURI: 'https://example.com/new.json',
      }),
    ).rejects.toThrow('walletClient must have an account')
  })
})
