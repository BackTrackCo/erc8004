import {
  type Address,
  type Chain,
  createPublicClient,
  createTestClient,
  createWalletClient,
  http,
  type PublicClient,
  type TestClient,
  type WalletClient,
} from 'viem'
import { baseSepolia } from 'viem/chains'
import { poolId } from './constants.js'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AnvilInstance {
  start(): Promise<void>
  stop(): Promise<void>
  rpcUrl: string
  chain: Chain
  getPublicClient(): PublicClient
  getWalletClient(account: Address): WalletClient
  getTestClient(): TestClient
}

// ---------------------------------------------------------------------------
// defineAnvil — creates a lazily-started Anvil fork managed by prool
// ---------------------------------------------------------------------------

function defineAnvil(options: {
  chain: Chain
  forkUrl: string
  port: number
  forkBlockNumber?: bigint
}): AnvilInstance {
  const { chain, forkUrl, port, forkBlockNumber } = options

  // Pool-isolated RPC URL — each vitest worker gets its own Anvil instance
  const rpcUrl = `http://127.0.0.1:${port}/${poolId}`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- prool's CreateServerReturnType
  let server: any

  const transport = http(rpcUrl)

  return {
    rpcUrl,
    chain,

    async start() {
      const { Instance, Server } = await import('prool')
      const srv = Server.create({
        instance: Instance.anvil({
          chainId: chain.id,
          forkUrl,
          forkBlockNumber,
        }),
        port,
      })
      await srv.start()
      server = srv
    },

    async stop() {
      await server?.stop()
    },

    getPublicClient(): PublicClient {
      return createPublicClient({
        chain,
        transport,
        cacheTime: 0,
        pollingInterval: 100,
      })
    },

    getWalletClient(account: Address): WalletClient {
      return createWalletClient({
        account,
        chain,
        transport,
      })
    },

    getTestClient(): TestClient {
      return createTestClient({
        chain,
        transport,
        mode: 'anvil',
      })
    },
  }
}

// ---------------------------------------------------------------------------
// Pre-configured instance for Base Sepolia fork
// ---------------------------------------------------------------------------

const forkUrl = process.env.FORK_URL ?? 'https://sepolia.base.org'
if (!process.env.FORK_URL) {
  console.warn('FORK_URL not set, using public RPC (rate-limited)')
}

export const anvilBaseSepolia = defineAnvil({
  chain: baseSepolia,
  forkUrl,
  port: 8745,
})
