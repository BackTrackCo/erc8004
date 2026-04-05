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
export type { Erc8004Addresses } from './types.js'
