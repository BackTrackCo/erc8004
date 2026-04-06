import type { Address, Log, PublicClient, TransactionReceipt } from 'viem'
import {
  encodeAbiParameters,
  encodeEventTopics,
  getAddress,
  zeroHash,
} from 'viem'
import { describe, expect, it, vi } from 'vitest'
import { reputationRegistryAbi } from '../src/abis/index.js'
import { appendResponse } from '../src/reputation/appendResponse.js'
import { getClients } from '../src/reputation/getClients.js'
import { getLastIndex } from '../src/reputation/getLastIndex.js'
import { getResponseCount } from '../src/reputation/getResponseCount.js'
import { getSummary } from '../src/reputation/getSummary.js'
import { giveFeedback } from '../src/reputation/giveFeedback.js'
import { parseGiveFeedbackReceipt } from '../src/reputation/parseGiveFeedbackReceipt.js'
import { readAllFeedback } from '../src/reputation/readAllFeedback.js'
import { readAllFeedbackBatched } from '../src/reputation/readAllFeedbackBatched.js'
import { readFeedback } from '../src/reputation/readFeedback.js'
import { revokeFeedback } from '../src/reputation/revokeFeedback.js'
import {
  ADDR_A,
  ADDR_B,
  mockPublic,
  mockWallet,
  REPUTATION_REGISTRY,
} from './setup/mocks.js'

// --- giveFeedback ---

describe('giveFeedback', () => {
  it('throws when walletClient has no account', async () => {
    await expect(
      giveFeedback(mockWallet({ account: undefined }), {
        registryAddress: REPUTATION_REGISTRY,
        agentId: 1n,
        value: 85n,
        valueDecimals: 0,
        tag1: 'x402r.resolution',
        tag2: 'quality',
        endpoint: '',
        feedbackURI: '',
        feedbackHash: zeroHash,
      }),
    ).rejects.toThrow('walletClient must have an account')
  })

  it('passes all 8 args in correct order', async () => {
    const client = mockWallet()
    await giveFeedback(client, {
      registryAddress: REPUTATION_REGISTRY,
      agentId: 42n,
      value: 85n,
      valueDecimals: 2,
      tag1: 'x402r.resolution',
      tag2: 'quality',
      endpoint: 'https://api.example.com',
      feedbackURI: 'https://feedback.example.com',
      feedbackHash: zeroHash,
    })

    expect(client.writeContract).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'giveFeedback',
        args: [
          42n,
          85n,
          2,
          'x402r.resolution',
          'quality',
          'https://api.example.com',
          'https://feedback.example.com',
          zeroHash,
        ],
      }),
    )
  })
})

// --- revokeFeedback ---

describe('revokeFeedback', () => {
  it('throws when walletClient has no account', async () => {
    await expect(
      revokeFeedback(mockWallet({ account: undefined }), {
        registryAddress: REPUTATION_REGISTRY,
        agentId: 1n,
        feedbackIndex: 1n,
      }),
    ).rejects.toThrow('walletClient must have an account')
  })

  it('passes args in correct order (agentId, feedbackIndex)', async () => {
    const client = mockWallet()
    await revokeFeedback(client, {
      registryAddress: REPUTATION_REGISTRY,
      agentId: 42n,
      feedbackIndex: 3n,
    })

    expect(client.writeContract).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'revokeFeedback',
        args: [42n, 3n],
      }),
    )
  })
})

// --- appendResponse ---

describe('appendResponse', () => {
  it('throws when walletClient has no account', async () => {
    await expect(
      appendResponse(mockWallet({ account: undefined }), {
        registryAddress: REPUTATION_REGISTRY,
        agentId: 1n,
        clientAddress: ADDR_B,
        feedbackIndex: 1n,
        responseURI: 'https://response.example.com',
        responseHash: zeroHash,
      }),
    ).rejects.toThrow('walletClient must have an account')
  })

  it('passes args in correct order', async () => {
    const client = mockWallet()
    await appendResponse(client, {
      registryAddress: REPUTATION_REGISTRY,
      agentId: 42n,
      clientAddress: ADDR_B,
      feedbackIndex: 1n,
      responseURI: 'https://response.example.com',
      responseHash: zeroHash,
    })

    expect(client.writeContract).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: 'appendResponse',
        args: [42n, ADDR_B, 1n, 'https://response.example.com', zeroHash],
      }),
    )
  })
})

// --- getSummary ---

describe('getSummary', () => {
  it('returns structured summary', async () => {
    const client = mockPublic({
      getSummary: [5n, 425n, 2],
    })

    const result = await getSummary(client, {
      registryAddress: REPUTATION_REGISTRY,
      agentId: 42n,
      clientAddresses: [ADDR_A],
      tag1: 'x402r.resolution',
      tag2: 'quality',
    })

    expect(result).toEqual({
      count: 5n,
      summaryValue: 425n,
      summaryValueDecimals: 2,
    })
  })
})

// --- getClients ---

describe('getClients', () => {
  it('returns array of addresses', async () => {
    const client = mockPublic({ getClients: [ADDR_A, ADDR_B] })

    const result = await getClients(client, {
      registryAddress: REPUTATION_REGISTRY,
      agentId: 42n,
    })

    expect(result).toEqual([ADDR_A, ADDR_B])
  })
})

// --- readFeedback ---

describe('readFeedback', () => {
  it('returns structured feedback', async () => {
    const client = mockPublic({
      readFeedback: [85n, 0, 'x402r.resolution', 'quality', false],
    })

    const result = await readFeedback(client, {
      registryAddress: REPUTATION_REGISTRY,
      agentId: 42n,
      clientAddress: ADDR_A,
      feedbackIndex: 1n,
    })

    expect(result).toEqual({
      value: 85n,
      valueDecimals: 0,
      tag1: 'x402r.resolution',
      tag2: 'quality',
      isRevoked: false,
    })
  })
})

// --- readAllFeedback ---

describe('readAllFeedback', () => {
  it('transforms parallel arrays to structured objects', async () => {
    const client = mockPublic({
      readAllFeedback: [
        [ADDR_A, ADDR_B], // clients
        [1n, 1n], // feedbackIndexes
        [85n, 90n], // values
        [0, 0], // valueDecimals
        ['x402r.resolution', 'x402r.resolution'], // tag1s
        ['quality', 'quality'], // tag2s
        [false, false], // revokedStatuses
      ],
    })

    const result = await readAllFeedback(client, {
      registryAddress: REPUTATION_REGISTRY,
      agentId: 42n,
      clientAddresses: [ADDR_A, ADDR_B],
      tag1: 'x402r.resolution',
      tag2: 'quality',
      includeRevoked: false,
    })

    expect(client.readContract).toHaveBeenCalledWith(
      expect.objectContaining({
        args: expect.arrayContaining([false]),
      }),
    )
    expect(result).toEqual([
      {
        client: ADDR_A,
        feedbackIndex: 1n,
        value: 85n,
        valueDecimals: 0,
        tag1: 'x402r.resolution',
        tag2: 'quality',
        isRevoked: false,
      },
      {
        client: ADDR_B,
        feedbackIndex: 1n,
        value: 90n,
        valueDecimals: 0,
        tag1: 'x402r.resolution',
        tag2: 'quality',
        isRevoked: false,
      },
    ])
  })

  it('includes revoked entries when includeRevoked is true', async () => {
    const client = mockPublic({
      readAllFeedback: [
        [ADDR_A],
        [1n],
        [85n],
        [0],
        ['x402r.resolution'],
        ['quality'],
        [true],
      ],
    })

    const result = await readAllFeedback(client, {
      registryAddress: REPUTATION_REGISTRY,
      agentId: 42n,
      clientAddresses: [ADDR_A],
      tag1: 'x402r.resolution',
      tag2: 'quality',
      includeRevoked: true,
    })

    expect(result).toEqual([
      {
        client: ADDR_A,
        feedbackIndex: 1n,
        value: 85n,
        valueDecimals: 0,
        tag1: 'x402r.resolution',
        tag2: 'quality',
        isRevoked: true,
      },
    ])
    expect(client.readContract).toHaveBeenCalledWith(
      expect.objectContaining({
        args: expect.arrayContaining([true]),
      }),
    )
  })

  it('returns empty array when no feedback exists', async () => {
    const client = mockPublic({
      readAllFeedback: [[], [], [], [], [], [], []],
    })

    const result = await readAllFeedback(client, {
      registryAddress: REPUTATION_REGISTRY,
      agentId: 42n,
      clientAddresses: [ADDR_A],
      tag1: 'x402r.resolution',
      tag2: 'quality',
      includeRevoked: false,
    })

    expect(result).toEqual([])
  })
})

// --- getLastIndex ---

describe('getLastIndex', () => {
  it('returns bigint index', async () => {
    const client = mockPublic({ getLastIndex: 3n })

    const result = await getLastIndex(client, {
      registryAddress: REPUTATION_REGISTRY,
      agentId: 42n,
      clientAddress: ADDR_A,
    })

    expect(result).toBe(3n)
  })
})

// --- getResponseCount ---

describe('getResponseCount', () => {
  it('returns bigint count', async () => {
    const client = mockPublic({ getResponseCount: 2n })

    const result = await getResponseCount(client, {
      registryAddress: REPUTATION_REGISTRY,
      agentId: 42n,
      clientAddress: ADDR_A,
      feedbackIndex: 1n,
      responders: [ADDR_B],
    })

    expect(result).toBe(2n)
  })
})

// --- readAllFeedbackBatched ---

describe('readAllFeedbackBatched', () => {
  it('delegates to readAllFeedback when within batch size', async () => {
    const client = mockPublic({
      readAllFeedback: [
        [ADDR_A],
        [1n],
        [85n],
        [0],
        ['tag1'],
        ['tag2'],
        [false],
      ],
    })

    const result = await readAllFeedbackBatched(client, {
      registryAddress: REPUTATION_REGISTRY,
      agentId: 42n,
      clientAddresses: [ADDR_A],
      tag1: 'tag1',
      tag2: 'tag2',
      batchSize: 50,
    })

    expect(result).toHaveLength(1)
    expect(client.readContract).toHaveBeenCalledTimes(1)
  })

  it('chunks addresses into batches', async () => {
    const addresses = Array.from(
      { length: 5 },
      (_, i) => `0x${String(i + 1).padStart(40, '0')}` as Address,
    )

    // Each batch returns one entry per address
    const client = {
      chain: { id: 8453 },
      readContract: vi.fn(({ args }: { args: readonly unknown[] }) => {
        const addrs = args[1] as Address[]
        return Promise.resolve([
          addrs,
          addrs.map(() => 1n),
          addrs.map(() => 85n),
          addrs.map(() => 0),
          addrs.map(() => 'tag1'),
          addrs.map(() => 'tag2'),
          addrs.map(() => false),
        ])
      }),
    } as unknown as PublicClient

    const result = await readAllFeedbackBatched(client, {
      registryAddress: REPUTATION_REGISTRY,
      agentId: 42n,
      clientAddresses: addresses,
      tag1: 'tag1',
      tag2: 'tag2',
      batchSize: 2,
    })

    // 5 addresses / batch size 2 = 3 RPC calls
    expect(client.readContract).toHaveBeenCalledTimes(3)
    expect(result).toHaveLength(5)
  })
})

// --- parseGiveFeedbackReceipt ---

describe('parseGiveFeedbackReceipt', () => {
  function makeNewFeedbackLog(
    agentId: bigint,
    clientAddress: Address,
    feedbackIndex: bigint,
  ): Log {
    const topics = encodeEventTopics({
      abi: reputationRegistryAbi,
      eventName: 'NewFeedback',
      args: {
        agentId,
        clientAddress: getAddress(clientAddress),
        indexedTag1: 'x402r.resolution',
      },
    })
    const data = encodeAbiParameters(
      [
        { type: 'uint64', name: 'feedbackIndex' },
        { type: 'int128', name: 'value' },
        { type: 'uint8', name: 'valueDecimals' },
        { type: 'string', name: 'tag1' },
        { type: 'string', name: 'tag2' },
        { type: 'string', name: 'endpoint' },
        { type: 'string', name: 'feedbackURI' },
        { type: 'bytes32', name: 'feedbackHash' },
      ],
      [feedbackIndex, 85n, 0, 'x402r.resolution', 'quality', '', '', zeroHash],
    )
    return {
      address: REPUTATION_REGISTRY,
      topics,
      data,
      blockHash: '0x0',
      blockNumber: 1n,
      logIndex: 0,
      transactionHash: '0x0',
      transactionIndex: 0,
      removed: false,
    } as unknown as Log
  }

  it('extracts agentId, clientAddress, and feedbackIndex', () => {
    const receipt = {
      logs: [makeNewFeedbackLog(42n, ADDR_A, 1n)],
    } as unknown as TransactionReceipt

    const result = parseGiveFeedbackReceipt(receipt)
    expect(result.agentId).toBe(42n)
    expect(result.clientAddress).toBe(getAddress(ADDR_A))
    expect(result.feedbackIndex).toBe(1n)
  })

  it('throws when no NewFeedback event in receipt', () => {
    const receipt = { logs: [] } as unknown as TransactionReceipt
    expect(() => parseGiveFeedbackReceipt(receipt)).toThrow(
      'No NewFeedback event found in receipt',
    )
  })
})

// --- registryAddress auto-resolve ---

describe('registryAddress auto-resolve', () => {
  it('resolves from client.chain when registryAddress omitted', async () => {
    const client = mockPublic({ getClients: [ADDR_A] })
    const result = await getClients(client, { agentId: 42n })
    expect(result).toEqual([ADDR_A])
  })

  it('throws when no chain and no registryAddress', async () => {
    const client = {
      readContract: vi.fn(),
      chain: undefined,
    } as unknown as PublicClient

    await expect(getClients(client, { agentId: 42n })).rejects.toThrow(
      'client chain not configured',
    )
  })
})
