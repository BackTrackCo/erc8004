export { identityRegistryAbi, reputationRegistryAbi } from './abis/index.js'
export {
  getErc8004Addresses,
  MAINNET_ADDRESSES,
  supportedChainIds,
  TESTNET_ADDRESSES,
} from './addresses.js'
export type {
  IsRegisteredParameters,
  RegisterAgentParameters,
  RegisterAgentWithMetadataParameters,
} from './identity/index.js'
export { isRegistered, registerAgent } from './identity/index.js'
export type { Erc8004Addresses } from './types.js'
