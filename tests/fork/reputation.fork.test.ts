import type { PublicClient, WalletClient } from 'viem'
import { isAddressEqual, parseEventLogs, zeroHash } from 'viem'
import { beforeAll, describe, expect, it } from 'vitest'
import { identityRegistryAbi } from '../../src/abis/index.js'
import { registerAgent } from '../../src/identity/register.js'
import { appendResponse } from '../../src/reputation/appendResponse.js'
import { getClients } from '../../src/reputation/getClients.js'
import { getLastIndex } from '../../src/reputation/getLastIndex.js'
import { getResponseCount } from '../../src/reputation/getResponseCount.js'
import { getSummary } from '../../src/reputation/getSummary.js'
import { giveFeedback } from '../../src/reputation/giveFeedback.js'
import { readAllFeedback } from '../../src/reputation/readAllFeedback.js'
import { readFeedback } from '../../src/reputation/readFeedback.js'
import { revokeFeedback } from '../../src/reputation/revokeFeedback.js'
import { anvilBaseSepolia } from '../setup/anvil.js'
import { accounts } from '../setup/constants.js'

describe('Reputation Registry (fork)', () => {
  let publicClient: PublicClient
  let agentOwnerClient: WalletClient
  let feedbackGiverClient: WalletClient
  let agentId: bigint

  beforeAll(async () => {
    publicClient = anvilBaseSepolia.getPublicClient()
    agentOwnerClient = anvilBaseSepolia.getWalletClient(accounts[0].address)
    feedbackGiverClient = anvilBaseSepolia.getWalletClient(accounts[1].address)

    // Register an agent so we have a target for feedback
    const hash = await registerAgent(agentOwnerClient, {
      agentURI: 'https://reputation-test.example.com/agent.json',
    })
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    const logs = parseEventLogs({
      abi: identityRegistryAbi,
      logs: receipt.logs,
      eventName: 'Registered',
    })
    agentId = logs[0].args.agentId
  })

  it('giveFeedback submits feedback', async () => {
    const hash = await giveFeedback(feedbackGiverClient, {
      agentId,
      value: 85n,
      valueDecimals: 0,
      tag1: 'x402r.resolution',
      tag2: 'quality',
      endpoint: '',
      feedbackURI: '',
      feedbackHash: zeroHash,
    })
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    expect(receipt.status).toBe('success')
  })

  it('getClients includes the feedback giver', async () => {
    const clients = await getClients(publicClient, { agentId })
    expect(clients.some((c) => isAddressEqual(c, accounts[1].address))).toBe(
      true,
    )
  })

  it('getLastIndex returns the feedback index', async () => {
    const index = await getLastIndex(publicClient, {
      agentId,
      clientAddress: accounts[1].address,
    })
    expect(index).toBe(1n)
  })

  it('readFeedback returns the submitted feedback', async () => {
    const lastIndex = await getLastIndex(publicClient, {
      agentId,
      clientAddress: accounts[1].address,
    })

    const feedback = await readFeedback(publicClient, {
      agentId,
      clientAddress: accounts[1].address,
      feedbackIndex: lastIndex,
    })

    expect(feedback.value).toBe(85n)
    expect(feedback.tag1).toBe('x402r.resolution')
    expect(feedback.tag2).toBe('quality')
    expect(feedback.isRevoked).toBe(false)
  })

  it('getSummary aggregates feedback', async () => {
    const summary = await getSummary(publicClient, {
      agentId,
      clientAddresses: [accounts[1].address],
      tag1: 'x402r.resolution',
      tag2: 'quality',
    })

    expect(summary.count).toBe(1n)
    expect(summary.summaryValue).toBe(85n)
    expect(summary.summaryValueDecimals).toBe(0)
  })

  it('readAllFeedback returns structured entries', async () => {
    const entries = await readAllFeedback(publicClient, {
      agentId,
      clientAddresses: [accounts[1].address],
      tag1: 'x402r.resolution',
      tag2: 'quality',
      includeRevoked: false,
    })

    expect(entries).toHaveLength(1)
    expect(isAddressEqual(entries[0].client, accounts[1].address)).toBe(true)
    expect(entries[0].feedbackIndex).toBe(1n)
    expect(entries[0].value).toBe(85n)
    expect(entries[0].valueDecimals).toBe(0)
    expect(entries[0].tag1).toBe('x402r.resolution')
    expect(entries[0].tag2).toBe('quality')
    expect(entries[0].isRevoked).toBe(false)
  })

  it('appendResponse adds a response to feedback', async () => {
    const lastIndex = await getLastIndex(publicClient, {
      agentId,
      clientAddress: accounts[1].address,
    })

    const hash = await appendResponse(agentOwnerClient, {
      agentId,
      clientAddress: accounts[1].address,
      feedbackIndex: lastIndex,
      responseURI: 'https://response.example.com',
      responseHash: zeroHash,
    })
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    expect(receipt.status).toBe('success')
  })

  it('getResponseCount returns the response count', async () => {
    const lastIndex = await getLastIndex(publicClient, {
      agentId,
      clientAddress: accounts[1].address,
    })

    const count = await getResponseCount(publicClient, {
      agentId,
      clientAddress: accounts[1].address,
      feedbackIndex: lastIndex,
      responders: [accounts[0].address],
    })

    expect(count).toBe(1n)
  })

  it('revokeFeedback marks feedback as revoked', async () => {
    const lastIndex = await getLastIndex(publicClient, {
      agentId,
      clientAddress: accounts[1].address,
    })

    const hash = await revokeFeedback(feedbackGiverClient, {
      agentId,
      feedbackIndex: lastIndex,
    })
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    expect(receipt.status).toBe('success')

    const feedback = await readFeedback(publicClient, {
      agentId,
      clientAddress: accounts[1].address,
      feedbackIndex: lastIndex,
    })
    expect(feedback.isRevoked).toBe(true)
  })

  it('readAllFeedback excludes revoked when includeRevoked is false', async () => {
    const entries = await readAllFeedback(publicClient, {
      agentId,
      clientAddresses: [accounts[1].address],
      tag1: 'x402r.resolution',
      tag2: 'quality',
      includeRevoked: false,
    })

    expect(entries).toHaveLength(0)
  })

  it('readAllFeedback includes revoked when includeRevoked is true', async () => {
    const entries = await readAllFeedback(publicClient, {
      agentId,
      clientAddresses: [accounts[1].address],
      tag1: 'x402r.resolution',
      tag2: 'quality',
      includeRevoked: true,
    })

    expect(entries).toHaveLength(1)
    expect(entries[0].isRevoked).toBe(true)
  })
})
