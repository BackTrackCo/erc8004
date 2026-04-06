# @x402r/erc8004

TypeScript SDK for [ERC-8004](https://eips.ethereum.org/EIPS/eip-8004) Identity and Reputation registries. Built on [viem](https://viem.sh).

## Install

```bash
npm install @x402r/erc8004
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
| `signAgentWalletConsent` | Sign EIP-712 consent for `setAgentWallet` |
| `unsetAgentWallet` | Clear agent wallet |
| `getMetadata` | Read on-chain metadata by key |
| `setMetadata` | Write on-chain metadata |
| `parseMetadataSetReceipt` | Extract fields from `setMetadata` tx receipt |
| `setAgentURI` | Update agent URI |
| `parseURIUpdatedReceipt` | Extract fields from `setAgentURI` tx receipt |
| `getVersion` | Read contract version string |

### Reputation

| Function | Description |
|---|---|
| `giveFeedback` | Submit feedback for an agent |
| `parseGiveFeedbackReceipt` | Extract fields from `giveFeedback` tx receipt |
| `revokeFeedback` | Revoke previously given feedback |
| `parseFeedbackRevokedReceipt` | Extract fields from `revokeFeedback` tx receipt |
| `appendResponse` | Append a response to feedback |
| `parseResponseAppendedReceipt` | Extract fields from `appendResponse` tx receipt |
| `readFeedback` | Read a single feedback entry |
| `readAllFeedback` | Read all feedback (filtered by reviewers and tags, optional `batchSize`) |
| `getSummary` | Aggregated reputation summary |
| `getClients` | All addresses that have given feedback |
| `getLastIndex` | Latest feedback index for an agent-client pair |
| `getResponseCount` | Count responses to a feedback entry |
| `getIdentityRegistry` | Get linked Identity Registry address |
| `getVersion` | Read contract version string |

## Chains

| Chain | ID |
|---|---|
| Ethereum | 1 |
| Base | 8453 |
| Polygon | 137 |
| Arbitrum | 42161 |
| Optimism | 10 |
| Avalanche | 43114 |
| BSC | 56 |
| Scroll | 534352 |
| Linea | 59144 |
| Mantle | 5000 |
| Gnosis | 100 |
| Celo | 42220 |
| Base Sepolia | 84532 |
| Ethereum Sepolia | 11155111 |

Registry addresses auto-resolve from `client.chain`. Pass `registryAddress` to override.

## Exports

| Path | Contents |
|---|---|
| `@x402r/erc8004` | Everything |
| `@x402r/erc8004/identity` | Identity registry functions and types |
| `@x402r/erc8004/reputation` | Reputation registry functions and types |
| `@x402r/erc8004/abis` | Raw contract ABIs |

## License

[Apache-2.0](./LICENSE)
