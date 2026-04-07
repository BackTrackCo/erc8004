import type { PublicClient } from 'viem'
import { describe, expect, it, vi } from 'vitest'
import { createRegistrationFile } from '../src/registration/build.js'
import { fetchRegistrationFile } from '../src/registration/fetch.js'
import { parseRegistrationFile } from '../src/registration/parse.js'
import { resolveServiceEndpoint } from '../src/registration/resolve.js'
import { findService, findServices } from '../src/registration/services.js'
import type { AgentRegistrationFile } from '../src/registration/types.js'
import { REGISTRY } from './setup/mocks.js'

const SPEC_TYPE = 'https://eips.ethereum.org/EIPS/eip-8004#registration-v1'

function validPayload(): Record<string, unknown> {
  return {
    type: SPEC_TYPE,
    name: 'My Agent',
    description: 'A test agent',
    image: 'https://example.com/icon.png',
    services: [
      { name: 'web', endpoint: 'https://example.com' },
      { name: 'A2A', endpoint: 'https://example.com/a2a' },
    ],
  }
}

// --- parseRegistrationFile ---

describe('parseRegistrationFile', () => {
  it('accepts a valid registration file', () => {
    const result = parseRegistrationFile(validPayload())
    expect(result.type).toBe(SPEC_TYPE)
    expect(result.name).toBe('My Agent')
    expect(result.services).toHaveLength(2)
  })

  it('throws when type is missing', () => {
    const payload = validPayload()
    delete payload.type
    expect(() => parseRegistrationFile(payload)).toThrow(
      'Invalid registration type',
    )
  })

  it('throws when type is wrong', () => {
    const payload = validPayload()
    payload.type = 'wrong'
    expect(() => parseRegistrationFile(payload)).toThrow(
      'Invalid registration type',
    )
  })

  it('throws when services is missing', () => {
    const payload = validPayload()
    delete payload.services
    expect(() => parseRegistrationFile(payload)).toThrow(
      '"services" must be an array',
    )
  })

  it('throws when services is empty', () => {
    const payload = validPayload()
    payload.services = []
    expect(() => parseRegistrationFile(payload)).toThrow(
      '"services" must contain at least one entry',
    )
  })

  it('throws when a service entry lacks name', () => {
    const payload = validPayload()
    payload.services = [{ endpoint: 'https://example.com' }]
    expect(() => parseRegistrationFile(payload)).toThrow(
      'services[0].name must be a string',
    )
  })

  it('throws when a service entry lacks endpoint', () => {
    const payload = validPayload()
    payload.services = [{ name: 'web' }]
    expect(() => parseRegistrationFile(payload)).toThrow(
      'services[0].endpoint must be a string',
    )
  })

  it('throws on non-object input', () => {
    expect(() => parseRegistrationFile('string')).toThrow(
      'must be a JSON object',
    )
    expect(() => parseRegistrationFile(null)).toThrow('must be a JSON object')
    expect(() => parseRegistrationFile([1])).toThrow('must be a JSON object')
  })

  it('throws when required string fields are missing', () => {
    for (const field of ['name', 'description', 'image']) {
      const payload = validPayload()
      delete payload[field]
      expect(() => parseRegistrationFile(payload)).toThrow(
        `"${field}" must be a string`,
      )
    }
  })
})

// --- createRegistrationFile ---

describe('createRegistrationFile', () => {
  it('sets type automatically', () => {
    const file = createRegistrationFile({
      name: 'My Agent',
      description: 'An agent',
      image: 'https://example.com/icon.png',
      services: [{ name: 'web', endpoint: 'https://example.com' }],
    })
    expect(file.type).toBe(SPEC_TYPE)
  })

  it('passes through optional fields', () => {
    const file = createRegistrationFile({
      name: 'My Agent',
      description: 'An agent',
      image: 'https://example.com/icon.png',
      services: [{ name: 'web', endpoint: 'https://example.com' }],
      x402Support: true,
      active: false,
      registrations: [{ agentId: 42, agentRegistry: 'eip155:8453:0xabc' }],
      supportedTrust: ['ERC-8004'],
    })
    expect(file.x402Support).toBe(true)
    expect(file.active).toBe(false)
    expect(file.registrations).toHaveLength(1)
    expect(file.supportedTrust).toEqual(['ERC-8004'])
  })

  it('omits optional fields when not provided', () => {
    const file = createRegistrationFile({
      name: 'My Agent',
      description: 'An agent',
      image: 'https://example.com/icon.png',
      services: [{ name: 'web', endpoint: 'https://example.com' }],
    })
    expect(file.x402Support).toBeUndefined()
    expect(file.active).toBeUndefined()
    expect(file.registrations).toBeUndefined()
    expect(file.supportedTrust).toBeUndefined()
  })
})

// --- findService / findServices ---

describe('findService', () => {
  const file: AgentRegistrationFile = {
    type: SPEC_TYPE,
    name: 'My Agent',
    description: 'An agent',
    image: 'https://example.com/icon.png',
    services: [
      { name: 'web', endpoint: 'https://example.com' },
      { name: 'A2A', endpoint: 'https://example.com/a2a' },
      { name: 'web', endpoint: 'https://example.com/v2' },
    ],
  }

  it('returns the first matching service', () => {
    const svc = findService(file, 'web')
    expect(svc?.endpoint).toBe('https://example.com')
  })

  it('returns undefined for a missing service', () => {
    expect(findService(file, 'nonexistent')).toBeUndefined()
  })
})

describe('findServices', () => {
  const file: AgentRegistrationFile = {
    type: SPEC_TYPE,
    name: 'My Agent',
    description: 'An agent',
    image: 'https://example.com/icon.png',
    services: [
      { name: 'web', endpoint: 'https://example.com' },
      { name: 'A2A', endpoint: 'https://example.com/a2a' },
      { name: 'web', endpoint: 'https://example.com/v2' },
    ],
  }

  it('returns all matching services', () => {
    const svcs = findServices(file, 'web')
    expect(svcs).toHaveLength(2)
    expect(svcs[0].endpoint).toBe('https://example.com')
    expect(svcs[1].endpoint).toBe('https://example.com/v2')
  })

  it('returns empty array for no matches', () => {
    expect(findServices(file, 'nonexistent')).toEqual([])
  })
})

// --- fetchRegistrationFile ---

describe('fetchRegistrationFile', () => {
  it('fetches and parses a valid registration file', async () => {
    const payload = validPayload()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(payload),
      }),
    )

    const result = await fetchRegistrationFile('https://example.com/agent.json')
    expect(result.name).toBe('My Agent')

    vi.unstubAllGlobals()
  })

  it('throws on non-HTTPS URL', async () => {
    await expect(
      fetchRegistrationFile('http://example.com/agent.json'),
    ).rejects.toThrow('Only HTTPS URIs are supported')
  })

  it('throws on non-200 response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    )

    await expect(
      fetchRegistrationFile('https://example.com/agent.json'),
    ).rejects.toThrow('HTTP 404')

    vi.unstubAllGlobals()
  })

  it('throws on invalid JSON response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error('Unexpected token')),
      }),
    )

    await expect(
      fetchRegistrationFile('https://example.com/agent.json'),
    ).rejects.toThrow('not valid JSON')

    vi.unstubAllGlobals()
  })
})

// --- resolveServiceEndpoint ---

describe('resolveServiceEndpoint', () => {
  const registrationPayload = validPayload()

  it('resolves an endpoint through the full pipeline', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(registrationPayload),
      }),
    )

    const publicClient = {
      chain: { id: 8453 },
      readContract: vi.fn(({ functionName }: { functionName: string }) => {
        if (functionName === 'ownerOf')
          return Promise.resolve('0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
        if (functionName === 'getAgentWallet')
          return Promise.resolve('0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
        if (functionName === 'tokenURI')
          return Promise.resolve('https://example.com/agent.json')
        return Promise.reject(new Error(`unexpected: ${functionName}`))
      }),
    } as unknown as PublicClient

    const endpoint = await resolveServiceEndpoint(publicClient, {
      agentId: 42n,
      serviceName: 'web',
      registryAddress: REGISTRY,
    })

    expect(endpoint).toBe('https://example.com')

    vi.unstubAllGlobals()
  })

  it('throws when the service is not found', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(registrationPayload),
      }),
    )

    const publicClient = {
      chain: { id: 8453 },
      readContract: vi.fn(({ functionName }: { functionName: string }) => {
        if (functionName === 'ownerOf')
          return Promise.resolve('0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
        if (functionName === 'getAgentWallet')
          return Promise.resolve('0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
        if (functionName === 'tokenURI')
          return Promise.resolve('https://example.com/agent.json')
        return Promise.reject(new Error(`unexpected: ${functionName}`))
      }),
    } as unknown as PublicClient

    await expect(
      resolveServiceEndpoint(publicClient, {
        agentId: 42n,
        serviceName: 'nonexistent',
        registryAddress: REGISTRY,
      }),
    ).rejects.toThrow('Service "nonexistent" not found')

    vi.unstubAllGlobals()
  })
})
