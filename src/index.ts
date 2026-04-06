export { identityRegistryAbi, reputationRegistryAbi } from './abis/index.js'
export {
  getErc8004Addresses,
  MAINNET_ADDRESSES,
  supportedChainIds,
  TESTNET_ADDRESSES,
} from './addresses.js'
export type {
  GetAgentWalletParameters,
  GetMetadataParameters,
  IsRegisteredParameters,
  RegisterAgentParameters,
  ResolveAgentParameters,
  ResolvedAgent,
  SetAgentURIParameters,
  SetMetadataParameters,
  VerifyAgentIdParameters,
} from './identity/index.js'
export {
  getAgentWallet,
  getMetadata,
  isRegistered,
  registerAgent,
  resolveAgent,
  setAgentURI,
  setMetadata,
  verifyAgentId,
} from './identity/index.js'
export type {
  AppendResponseParameters,
  Feedback,
  FeedbackEntry,
  GetClientsParameters,
  GetLastIndexParameters,
  GetResponseCountParameters,
  GetSummaryParameters,
  GiveFeedbackParameters,
  ReadAllFeedbackParameters,
  ReadFeedbackParameters,
  ReputationSummary,
  RevokeFeedbackParameters,
} from './reputation/index.js'
export {
  appendResponse,
  getClients,
  getLastIndex,
  getResponseCount,
  getSummary,
  giveFeedback,
  readAllFeedback,
  readFeedback,
  revokeFeedback,
} from './reputation/index.js'
export type { Erc8004Addresses } from './types.js'
