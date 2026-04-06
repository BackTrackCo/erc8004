import type { PublicClient, WalletClient } from 'viem'
import { parseEventLogs } from 'viem'
import { beforeAll, describe, expect, it } from 'vitest'
import { identityRegistryAbi } from '../../src/abis/index.js'
import { getAgentWallet } from '../../src/identity/getAgentWallet.js'
import { getMetadata } from '../../src/identity/getMetadata.js'
import { isRegistered } from '../../src/identity/isRegistered.js'
import { registerAgent } from '../../src/identity/register.js'
import { resolveAgent } from '../../src/identity/resolveAgent.js'
import { setAgentURI } from '../../src/identity/setAgentURI.js'
import { setMetadata } from '../../src/identity/setMetadata.js'
import { verifyAgentId } from '../../src/identity/verifyAgentId.js'
import { anvilBaseSepolia } from '../setup/anvil.js'
import { accounts } from '../setup/constants.js'

describe('Identity Registry (fork)', () => {
  let publicClient: PublicClient
  let walletClient: WalletClient
  let agentId: bigint

  beforeAll(async () => {
    publicClient = anvilBaseSepolia.getPublicClient()
    walletClient = anvilBaseSepolia.getWalletClient(accounts[0].address)
  })

  it('registers an agent and extracts agentId', async () => {
    const hash = await registerAgent(walletClient, {
      agentURI: 'https://test.example.com/agent.json',
    })

    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    const logs = parseEventLogs({
      abi: identityRegistryAbi,
      logs: receipt.logs,
      eventName: 'Registered',
    })

    expect(logs).toHaveLength(1)
    agentId = logs[0].args.agentId
    expect(agentId).toBeGreaterThan(0n)
  })

  it('isRegistered returns true for registered address', async () => {
    const result = await isRegistered(publicClient, {
      address: accounts[0].address,
    })
    expect(result).toBe(true)
  })

  it('verifyAgentId returns true for correct owner', async () => {
    const result = await verifyAgentId(publicClient, {
      agentId,
      claimedAddress: accounts[0].address,
    })
    expect(result).toBe(true)
  })

  it('verifyAgentId returns false for wrong address', async () => {
    const result = await verifyAgentId(publicClient, {
      agentId,
      claimedAddress: accounts[1].address,
    })
    expect(result).toBe(false)
  })

  it('resolveAgent returns full agent info', async () => {
    const agent = await resolveAgent(publicClient, { agentId })

    expect(agent.agentId).toBe(agentId)
    expect(agent.owner).toBe(accounts[0].address)
    expect(agent.agentURI).toBe('https://test.example.com/agent.json')
    expect(agent.ownerMismatch).toBe(false)
  })

  it('setMetadata and getMetadata round-trip', async () => {
    const hash = await setMetadata(walletClient, {
      agentId,
      key: 'x402r.test',
      value: '0x1234',
    })
    await publicClient.waitForTransactionReceipt({ hash })

    const result = await getMetadata(publicClient, {
      agentId,
      key: 'x402r.test',
    })
    expect(result).toBe('0x1234')
  })

  it('setAgentURI updates the URI', async () => {
    const hash = await setAgentURI(walletClient, {
      agentId,
      newURI: 'https://updated.example.com/agent.json',
    })
    await publicClient.waitForTransactionReceipt({ hash })

    const agent = await resolveAgent(publicClient, { agentId })
    expect(agent.agentURI).toBe('https://updated.example.com/agent.json')
  })

  it('getAgentWallet returns the agent wallet', async () => {
    const wallet = await getAgentWallet(publicClient, { agentId })
    expect(wallet).toBe(accounts[0].address)
  })
})
