# Changelog

## 0.1.0

Initial release.

### Identity

- `registerAgent` — register as an ERC-8004 agent (mints agent NFT)
- `parseRegisterReceipt` — extract agentId from register transaction receipt
- `isRegistered` — check if an address is a registered agent
- `verifyAgentId` — verify that an agentId belongs to a claimed address
- `resolveAgent` — resolve agent by ID (owner, wallet, URI, ownerMismatch flag)
- `getAgentWallet` / `setAgentWallet` / `unsetAgentWallet` — wallet management
- `getMetadata` / `setMetadata` — on-chain key-value metadata
- `setAgentURI` — update agent URI

### Reputation

- `giveFeedback` — submit feedback for an agent
- `parseGiveFeedbackReceipt` — extract feedbackIndex from feedback transaction receipt
- `revokeFeedback` — revoke previously given feedback
- `appendResponse` — append a response to existing feedback
- `readFeedback` / `readAllFeedback` / `readAllFeedbackBatched` — read feedback entries
- `getSummary` — aggregated reputation summary
- `getClients` — all reviewer addresses for an agent
- `getLastIndex` — latest feedback index for an agent-client pair
- `getResponseCount` — count responses to a feedback entry

### Infrastructure

- Registry addresses for 7 chains (Ethereum, Base, Polygon, Arbitrum, Optimism, Base Sepolia, Ethereum Sepolia)
- Auto-resolve registry address from `client.chain`
- Sub-path exports: `/identity`, `/reputation`, `/abis`
