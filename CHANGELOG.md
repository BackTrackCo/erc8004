# Changelog

## 0.1.0-alpha.0

Initial alpha release.

### Identity

- `registerAgent` — register as an ERC-8004 agent (mints agent NFT)
- `parseRegisterReceipt` — extract agentId from register transaction receipt
- `isRegistered` — check if an address is a registered agent
- `verifyAgentId` — verify that an agentId belongs to a claimed address
- `resolveAgent` — resolve agent by ID (owner, wallet, URI, ownerMismatch flag)
- `getAgentWallet` / `setAgentWallet` / `unsetAgentWallet` — wallet management
- `signAgentWalletConsent` — sign EIP-712 typed data for `setAgentWallet`
- `getMetadata` / `setMetadata` — on-chain key-value metadata
- `parseMetadataSetReceipt` — extract fields from setMetadata transaction receipt
- `setAgentURI` — update agent URI
- `parseURIUpdatedReceipt` — extract fields from setAgentURI transaction receipt
- `getVersion` — read contract version string

### Reputation

- `giveFeedback` — submit feedback for an agent
- `parseGiveFeedbackReceipt` — extract fields from giveFeedback transaction receipt
- `revokeFeedback` — revoke previously given feedback
- `parseFeedbackRevokedReceipt` — extract fields from revokeFeedback transaction receipt
- `appendResponse` — append a response to existing feedback
- `parseResponseAppendedReceipt` — extract fields from appendResponse transaction receipt
- `readFeedback` / `readAllFeedback` — read feedback entries (optional `batchSize` for large reviewer sets)
- `getSummary` — aggregated reputation summary
- `getClients` — all reviewer addresses for an agent
- `getLastIndex` — latest feedback index for an agent-client pair
- `getResponseCount` — count responses to a feedback entry
- `getIdentityRegistry` — get linked Identity Registry address
- `getVersion` — read contract version string

### Infrastructure

- Registry addresses for 14 chains (Ethereum, Base, Polygon, Arbitrum, Optimism, Avalanche, BSC, Scroll, Linea, Mantle, Gnosis, Celo, Base Sepolia, Ethereum Sepolia)
- Auto-resolve registry address from `client.chain`
- Sub-path exports: `/identity`, `/reputation`, `/abis`
