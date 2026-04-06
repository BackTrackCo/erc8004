# @x402r/erc8004

TypeScript SDK for [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) Identity and Reputation registries. Pure [viem](https://viem.sh), zero additional dependencies.

## Install

```bash
pnpm add @x402r/erc8004 viem
```

## Usage

### Register an agent

```ts
import { registerAgent, parseRegisterReceipt } from '@x402r/erc8004/identity'

const hash = await registerAgent(walletClient, {
  agentURI: 'https://example.com/agent.json',
})

const receipt = await publicClient.waitForTransactionReceipt({ hash })
const { agentId } = parseRegisterReceipt(receipt)
```

### Verify identity

```ts
import { verifyAgentId, resolveAgent } from '@x402r/erc8004/identity'

const valid = await verifyAgentId(publicClient, {
  agentId: 42n,
  claimedAddress: '0x...',
})

const agent = await resolveAgent(publicClient, { agentId: 42n })
// { agentId, owner, agentWallet, agentURI, ownerMismatch }
```

### Give feedback

```ts
import { giveFeedback, getSummary } from '@x402r/erc8004/reputation'

await giveFeedback(walletClient, {
  agentId: 42n,
  value: 85n,
  valueDecimals: 0,
  tag1: 'service',
  tag2: 'quality',
})

const summary = await getSummary(publicClient, {
  agentId: 42n,
  clientAddresses: ['0x...'],
  tag1: 'service',
  tag2: 'quality',
})
```

## API

### Identity

| Function | Description |
|---|---|
| `registerAgent` | Register as an ERC-8004 agent (mints NFT) |
| `parseRegisterReceipt` | Extract `agentId` from register tx receipt |
| `isRegistered` | Check if an address is registered |
| `verifyAgentId` | Verify agentId belongs to a claimed address |
| `resolveAgent` | Resolve agent by ID (owner, wallet, URI) |
| `getAgentWallet` | Get wallet address for an agent |
| `setAgentWallet` | Set verified payment wallet (EIP-712 sig) |
| `unsetAgentWallet` | Clear agent wallet |
| `getMetadata` | Read on-chain metadata by key |
| `setMetadata` | Write on-chain metadata |
| `setAgentURI` | Update agent URI |

### Reputation

| Function | Description |
|---|---|
| `giveFeedback` | Submit feedback for an agent |
| `parseGiveFeedbackReceipt` | Extract `feedbackIndex` from feedback tx receipt |
| `revokeFeedback` | Revoke previously given feedback |
| `appendResponse` | Append a response to feedback |
| `readFeedback` | Read a single feedback entry |
| `readAllFeedback` | Read all feedback (filtered by reviewers and tags) |
| `readAllFeedbackBatched` | Batched version — chunks `clientAddresses` to avoid RPC limits |
| `getSummary` | Aggregated reputation summary |
| `getClients` | All addresses that have given feedback |
| `getLastIndex` | Latest feedback index for an agent-client pair |
| `getResponseCount` | Count responses to a feedback entry |

## Chains

| Chain | ID | Network |
|---|---|---|
| Ethereum | 1 | Mainnet |
| Base | 8453 | Mainnet |
| Polygon | 137 | Mainnet |
| Arbitrum | 42161 | Mainnet |
| Optimism | 10 | Mainnet |
| Base Sepolia | 84532 | Testnet |
| Ethereum Sepolia | 11155111 | Testnet |

Registry addresses auto-resolve from `client.chain`. Pass `registryAddress` to override.

## Exports

| Path | Contents |
|---|---|
| `@x402r/erc8004` | Everything |
| `@x402r/erc8004/identity` | Identity registry functions and types |
| `@x402r/erc8004/reputation` | Reputation registry functions and types |
| `@x402r/erc8004/abis` | Raw contract ABIs |

## Stability

ERC-8004 is Draft status. The on-chain contracts are UUPS upgradeable. At 0.x, minor version bumps may contain breaking changes.

## License

[Apache-2.0](./LICENSE)
