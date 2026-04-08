import type { PublicClient } from 'viem'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createRegistrationFile } from '../src/registration/build.js'
import { fetchRegistrationFile } from '../src/registration/fetch.js'
import { parseRegistrationFile } from '../src/registration/parse.js'
import { resolveServiceEndpoint } from '../src/registration/resolve.js'
import { findService, findServices } from '../src/registration/services.js'
import type { AgentRegistrationFile } from '../src/registration/types.js'
import { ADDR_A, REGISTRY } from './setup/mocks.js'

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

  it('throws when a service entry is a primitive', () => {
    const payload = validPayload()
    payload.services = ['https://example.com']
    expect(() => parseRegistrationFile(payload)).toThrow(
      'services[0] must be an object',
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

  it('throws when x402Support is present but not boolean', () => {
    const payload = validPayload()
    payload.x402Support = 'yes'
    expect(() => parseRegistrationFile(payload)).toThrow(
      '"x402Support" must be a boolean',
    )
  })

  it('throws when active is present but not boolean', () => {
    const payload = validPayload()
    payload.active = 1
    expect(() => parseRegistrationFile(payload)).toThrow(
      '"active" must be a boolean',
    )
  })

  it('throws when registrations is present but not an array', () => {
    const payload = validPayload()
    payload.registrations = 'invalid'
    expect(() => parseRegistrationFile(payload)).toThrow(
      '"registrations" must be an array',
    )
  })

  it('throws when supportedTrust contains non-strings', () => {
    const payload = validPayload()
    payload.supportedTrust = [123]
    expect(() => parseRegistrationFile(payload)).toThrow(
      'supportedTrust[0] must be a string',
    )
  })

  it('coerces registrations agentId to bigint', () => {
    const payload = validPayload()
    payload.registrations = [
      { agentId: 42, agentRegistry: 'eip155:8453:0xabc' },
    ]
    const result = parseRegistrationFile(payload)
    expect(result.registrations![0].agentId).toBe(42n)
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
      registrations: [{ agentId: 42n, agentRegistry: 'eip155:8453:0xabc' }],
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
  afterEach(() => vi.unstubAllGlobals())

  it('fetches and parses a valid registration file', async () => {
    const payload = validPayload()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers(),
        json: () => Promise.resolve(payload),
      }),
    )

    const result = await fetchRegistrationFile('https://example.com/agent.json')
    expect(result.name).toBe('My Agent')
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
  })

  it('throws on invalid JSON response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers(),
        json: () => Promise.reject(new Error('Unexpected token')),
      }),
    )

    await expect(
      fetchRegistrationFile('https://example.com/agent.json'),
    ).rejects.toThrow('not valid JSON')
  })

  it('passes abort signal to fetch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
        expect(init?.signal).toBeDefined()
        return Promise.resolve({
          ok: true,
          headers: new Headers(),
          json: () => Promise.resolve(validPayload()),
        })
      }),
    )

    await fetchRegistrationFile('https://example.com/agent.json')
  })

  it('throws when content-length exceeds limit', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-length': '2000000' }),
        json: () => Promise.resolve(validPayload()),
      }),
    )

    await expect(
      fetchRegistrationFile('https://example.com/huge'),
    ).rejects.toThrow('exceeds 1 MB')
  })
})

// --- resolveServiceEndpoint ---

describe('resolveServiceEndpoint', () => {
  afterEach(() => vi.unstubAllGlobals())

  const registrationPayload = validPayload()

  function mockReadContract(overrides: Partial<Record<string, unknown>> = {}) {
    const defaults: Record<string, unknown> = {
      ownerOf: ADDR_A,
      getAgentWallet: ADDR_A,
      tokenURI: 'https://example.com/agent.json',
      ...overrides,
    }
    return {
      chain: { id: 8453 },
      readContract: vi.fn(({ functionName }: { functionName: string }) => {
        if (functionName in defaults)
          return Promise.resolve(defaults[functionName])
        return Promise.reject(new Error(`unexpected: ${functionName}`))
      }),
    } as unknown as PublicClient
  }

  it('resolves an endpoint through the full pipeline', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers(),
        json: () => Promise.resolve(registrationPayload),
      }),
    )

    const result = await resolveServiceEndpoint(mockReadContract(), {
      agentId: 42n,
      serviceName: 'web',
      registryAddress: REGISTRY,
    })

    expect(result.endpoint).toBe('https://example.com')
    expect(result.service).toEqual({
      name: 'web',
      endpoint: 'https://example.com',
    })
    expect(result.agentURI).toBe('https://example.com/agent.json')
  })

  it('throws when the service is not found', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers(),
        json: () => Promise.resolve(registrationPayload),
      }),
    )

    await expect(
      resolveServiceEndpoint(mockReadContract(), {
        agentId: 42n,
        serviceName: 'nonexistent',
        registryAddress: REGISTRY,
      }),
    ).rejects.toThrow('Service "nonexistent" not found')
  })

  it('throws when agent has no URI set', async () => {
    await expect(
      resolveServiceEndpoint(mockReadContract({ tokenURI: '' }), {
        agentId: 42n,
        serviceName: 'web',
        registryAddress: REGISTRY,
      }),
    ).rejects.toThrow('Agent 42 has no URI set')
  })

  it('includes agent ID in fetch error messages', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    )

    await expect(
      resolveServiceEndpoint(mockReadContract(), {
        agentId: 42n,
        serviceName: 'web',
        registryAddress: REGISTRY,
      }),
    ).rejects.toThrow('Agent 42')
  })
})
