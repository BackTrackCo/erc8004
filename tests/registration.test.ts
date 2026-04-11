import { afterEach, describe, expect, it, vi } from 'vitest'
import { createRegistrationFile } from '../src/registration/build.js'
import { fetchRegistrationFile } from '../src/registration/fetch.js'
import { parseRegistrationFile } from '../src/registration/parse.js'
import { resolveServiceEndpoint } from '../src/registration/resolve.js'
import { findService, findServices } from '../src/registration/services.js'
import type { AgentRegistrationFile } from '../src/registration/types.js'
import { REGISTRATION_TYPE } from '../src/registration/types.js'
import { ADDR_A, mockPublic, REGISTRY } from './setup/mocks.js'

function validPayload(): Record<string, unknown> {
  return {
    type: REGISTRATION_TYPE,
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
    expect(result.type).toBe(REGISTRATION_TYPE)
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

  it('throws when a registrations entry is a primitive', () => {
    const payload = validPayload()
    payload.registrations = [42]
    expect(() => parseRegistrationFile(payload)).toThrow(
      'registrations[0] must be an object',
    )
  })

  it('throws when agentRegistry is missing from registration binding', () => {
    const payload = validPayload()
    payload.registrations = [{ agentId: 1 }]
    expect(() => parseRegistrationFile(payload)).toThrow(
      'agentRegistry must be a string',
    )
  })

  it('throws when agentId has invalid type in registration binding', () => {
    const payload = validPayload()
    payload.registrations = [
      { agentId: true, agentRegistry: 'eip155:8453:0xabc' },
    ]
    expect(() => parseRegistrationFile(payload)).toThrow(
      'agentId must be a string, number, or bigint',
    )
  })

  it('throws when agentId string is non-numeric', () => {
    const payload = validPayload()
    payload.registrations = [
      { agentId: 'abc', agentRegistry: 'eip155:8453:0xabc' },
    ]
    expect(() => parseRegistrationFile(payload)).toThrow(
      'agentId string must be a non-negative integer',
    )
  })

  it('does not mutate the input object', () => {
    const payload = validPayload()
    payload.registrations = [
      { agentId: 42, agentRegistry: 'eip155:8453:0xabc' },
    ]
    parseRegistrationFile(payload)
    expect(
      (payload.registrations as Array<Record<string, unknown>>)[0].agentId,
    ).toBe(42)
  })

  it('passes through non-spec fields without validation', () => {
    const payload = validPayload()
    payload.x402Support = true
    payload.supportedTrust = ['ERC-8004']
    payload.customField = 42
    const result = parseRegistrationFile(payload)
    expect(result.x402Support).toBe(true)
    expect(result.supportedTrust).toEqual(['ERC-8004'])
    expect(result.customField).toBe(42)
  })

  it('coerces registrations agentId from number to bigint', () => {
    const payload = validPayload()
    payload.registrations = [
      { agentId: 42, agentRegistry: 'eip155:8453:0xabc' },
    ]
    const result = parseRegistrationFile(payload)
    expect(result.registrations![0].agentId).toBe(42n)
  })

  it('coerces registrations agentId from string to bigint (spec format)', () => {
    const payload = validPayload()
    payload.registrations = [
      { agentId: '42', agentRegistry: 'eip155:8453:0xabc' },
    ]
    const result = parseRegistrationFile(payload)
    expect(result.registrations![0].agentId).toBe(42n)
  })

  it('preserves registrations agentId already a bigint', () => {
    const payload = validPayload()
    payload.registrations = [
      { agentId: 42n, agentRegistry: 'eip155:8453:0xabc' },
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
    expect(file.type).toBe(REGISTRATION_TYPE)
  })

  it('passes through optional and extension fields', () => {
    const file = createRegistrationFile({
      name: 'My Agent',
      description: 'An agent',
      image: 'https://example.com/icon.png',
      services: [{ name: 'web', endpoint: 'https://example.com' }],
      active: false,
      registrations: [{ agentId: 42n, agentRegistry: 'eip155:8453:0xabc' }],
      x402Support: true,
      supportedTrust: ['ERC-8004'],
    })
    expect(file.active).toBe(false)
    expect(file.registrations).toHaveLength(1)
    expect(file.x402Support).toBe(true)
    expect(file.supportedTrust).toEqual(['ERC-8004'])
  })

  it('omits optional fields when not provided', () => {
    const file = createRegistrationFile({
      name: 'My Agent',
      description: 'An agent',
      image: 'https://example.com/icon.png',
      services: [{ name: 'web', endpoint: 'https://example.com' }],
    })
    expect(file.active).toBeUndefined()
    expect(file.registrations).toBeUndefined()
  })
})

// --- findService / findServices ---

describe('findService', () => {
  const file: AgentRegistrationFile = {
    type: REGISTRATION_TYPE,
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
    type: REGISTRATION_TYPE,
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

  function mockFetch(body: string, init?: { ok?: boolean; status?: number }) {
    return vi.fn().mockResolvedValue({
      ok: init?.ok ?? true,
      status: init?.status ?? 200,
      text: () => Promise.resolve(body),
    })
  }

  it('fetches and parses a valid registration file', async () => {
    vi.stubGlobal('fetch', mockFetch(JSON.stringify(validPayload())))

    const result = await fetchRegistrationFile('https://example.com/agent.json')
    expect(result.name).toBe('My Agent')
  })

  it('throws on unsupported URI scheme', async () => {
    await expect(
      fetchRegistrationFile('http://example.com/agent.json'),
    ).rejects.toThrow('Unsupported URI scheme')
    await expect(
      fetchRegistrationFile('ftp://example.com/file'),
    ).rejects.toThrow('Unsupported URI scheme')
  })

  // --- data: URIs ---

  it('parses base64-encoded data URI', async () => {
    const json = JSON.stringify(validPayload())
    const encoded = btoa(json)
    const result = await fetchRegistrationFile(
      `data:application/json;base64,${encoded}`,
    )
    expect(result.name).toBe('My Agent')
  })

  it('parses URL-encoded data URI', async () => {
    const json = JSON.stringify(validPayload())
    const encoded = encodeURIComponent(json)
    const result = await fetchRegistrationFile(
      `data:application/json,${encoded}`,
    )
    expect(result.name).toBe('My Agent')
  })

  it('parses data URI with charset parameter', async () => {
    const json = JSON.stringify(validPayload())
    const encoded = btoa(json)
    const result = await fetchRegistrationFile(
      `data:application/json;charset=utf-8;base64,${encoded}`,
    )
    expect(result.name).toBe('My Agent')
  })

  it('throws on data URI with wrong MIME type', async () => {
    await expect(
      fetchRegistrationFile('data:text/plain;base64,aGVsbG8='),
    ).rejects.toThrow('application/json MIME type')
  })

  it('throws on data URI with malformed base64', async () => {
    // Buffer.from silently ignores invalid base64 chars, so the decoded
    // garbage fails at JSON.parse rather than at the decode step.
    await expect(
      fetchRegistrationFile('data:application/json;base64,!!!invalid'),
    ).rejects.toThrow('not valid JSON')
  })

  it('throws on data URI with invalid JSON', async () => {
    const encoded = btoa('not json')
    await expect(
      fetchRegistrationFile(`data:application/json;base64,${encoded}`),
    ).rejects.toThrow('not valid JSON')
  })

  it('throws on data URI exceeding size limit', async () => {
    const big = JSON.stringify({
      ...validPayload(),
      pad: 'x'.repeat(1_048_577),
    })
    const encoded = btoa(big)
    await expect(
      fetchRegistrationFile(`data:application/json;base64,${encoded}`),
    ).rejects.toThrow('exceeds 1 MB')
  })

  it('throws on data URI missing comma', async () => {
    await expect(
      fetchRegistrationFile('data:application/json;base64'),
    ).rejects.toThrow('missing comma')
  })

  // --- ipfs:// URIs ---

  it('rewrites ipfs:// to default gateway', async () => {
    const fetchSpy = mockFetch(JSON.stringify(validPayload()))
    vi.stubGlobal('fetch', fetchSpy)

    await fetchRegistrationFile('ipfs://QmTest123')

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://ipfs.io/ipfs/QmTest123',
      expect.anything(),
    )
  })

  it('accepts custom ipfsGateway', async () => {
    const fetchSpy = mockFetch(JSON.stringify(validPayload()))
    vi.stubGlobal('fetch', fetchSpy)

    await fetchRegistrationFile('ipfs://QmTest123', {
      ipfsGateway: 'https://gateway.pinata.cloud',
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://gateway.pinata.cloud/ipfs/QmTest123',
      expect.anything(),
    )
  })

  it('handles ipfs:// with path after CID', async () => {
    const fetchSpy = mockFetch(JSON.stringify(validPayload()))
    vi.stubGlobal('fetch', fetchSpy)

    await fetchRegistrationFile('ipfs://QmTest123/metadata.json')

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://ipfs.io/ipfs/QmTest123/metadata.json',
      expect.anything(),
    )
  })

  it('handles ipfsGateway with trailing slash', async () => {
    const fetchSpy = mockFetch(JSON.stringify(validPayload()))
    vi.stubGlobal('fetch', fetchSpy)

    await fetchRegistrationFile('ipfs://QmTest123', {
      ipfsGateway: 'https://ipfs.io/',
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://ipfs.io/ipfs/QmTest123',
      expect.anything(),
    )
  })

  it('throws on non-200 response', async () => {
    vi.stubGlobal('fetch', mockFetch('', { ok: false, status: 404 }))

    await expect(
      fetchRegistrationFile('https://example.com/agent.json'),
    ).rejects.toThrow('HTTP 404')
  })

  it('throws on invalid JSON response', async () => {
    vi.stubGlobal('fetch', mockFetch('not json'))

    await expect(
      fetchRegistrationFile('https://example.com/agent.json'),
    ).rejects.toThrow('not valid JSON')
  })

  it('passes abort signal to fetch', async () => {
    const fetchSpy = mockFetch(JSON.stringify(validPayload()))
    vi.stubGlobal('fetch', fetchSpy)

    await fetchRegistrationFile('https://example.com/agent.json')

    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const callInit = fetchSpy.mock.calls[0][1] as RequestInit
    expect(callInit.signal).toBeInstanceOf(AbortSignal)
  })

  it('throws when response body exceeds size limit', async () => {
    vi.stubGlobal('fetch', mockFetch('x'.repeat(1_048_577)))

    await expect(
      fetchRegistrationFile('https://example.com/huge'),
    ).rejects.toThrow('exceeds 1 MB')
  })
})

// --- resolveServiceEndpoint ---

describe('resolveServiceEndpoint', () => {
  afterEach(() => vi.unstubAllGlobals())

  const registrationPayload = validPayload()

  function stubFetch(body: string, init?: { ok?: boolean; status?: number }) {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: init?.ok ?? true,
        status: init?.status ?? 200,
        text: () => Promise.resolve(body),
      }),
    )
  }

  it('resolves an endpoint through the full pipeline', async () => {
    stubFetch(JSON.stringify(registrationPayload))

    const client = mockPublic({
      ownerOf: ADDR_A,
      getAgentWallet: ADDR_A,
      tokenURI: 'https://example.com/agent.json',
    })

    const result = await resolveServiceEndpoint(client, {
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
    stubFetch(JSON.stringify(registrationPayload))

    const client = mockPublic({
      ownerOf: ADDR_A,
      getAgentWallet: ADDR_A,
      tokenURI: 'https://example.com/agent.json',
    })

    await expect(
      resolveServiceEndpoint(client, {
        agentId: 42n,
        serviceName: 'nonexistent',
        registryAddress: REGISTRY,
      }),
    ).rejects.toThrow('Service "nonexistent" not found')
  })

  it('throws when agent has no URI set', async () => {
    const client = mockPublic({
      ownerOf: ADDR_A,
      getAgentWallet: ADDR_A,
      tokenURI: '',
    })

    await expect(
      resolveServiceEndpoint(client, {
        agentId: 42n,
        serviceName: 'web',
        registryAddress: REGISTRY,
      }),
    ).rejects.toThrow('Agent 42 has no URI set')
  })

  it('passes ipfsGateway through to fetch for ipfs:// URIs', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(registrationPayload)),
    })
    vi.stubGlobal('fetch', fetchSpy)

    const client = mockPublic({
      ownerOf: ADDR_A,
      getAgentWallet: ADDR_A,
      tokenURI: 'ipfs://QmTest123',
    })

    await resolveServiceEndpoint(client, {
      agentId: 42n,
      serviceName: 'web',
      registryAddress: REGISTRY,
      ipfsGateway: 'https://gateway.pinata.cloud',
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://gateway.pinata.cloud/ipfs/QmTest123',
      expect.anything(),
    )
  })

  it('uses default IPFS gateway when ipfsGateway is omitted', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve(JSON.stringify(registrationPayload)),
    })
    vi.stubGlobal('fetch', fetchSpy)

    const client = mockPublic({
      ownerOf: ADDR_A,
      getAgentWallet: ADDR_A,
      tokenURI: 'ipfs://QmTest123',
    })

    await resolveServiceEndpoint(client, {
      agentId: 42n,
      serviceName: 'web',
      registryAddress: REGISTRY,
    })

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://ipfs.io/ipfs/QmTest123',
      expect.anything(),
    )
  })

  it('includes agent ID in fetch error messages', async () => {
    stubFetch('', { ok: false, status: 500 })

    const client = mockPublic({
      ownerOf: ADDR_A,
      getAgentWallet: ADDR_A,
      tokenURI: 'https://example.com/agent.json',
    })

    await expect(
      resolveServiceEndpoint(client, {
        agentId: 42n,
        serviceName: 'web',
        registryAddress: REGISTRY,
      }),
    ).rejects.toThrow('Agent 42')
  })
})
