// Auto-generated from ERC-8004 deployed contracts on Base mainnet.
// Source: agent0-sdk v1.7.1 (cross-reference for ABI correctness).
// Regenerate with: pnpm generate (requires BASESCAN_API_KEY)

export const identityRegistryAbi = [
  // ERC-721 balanceOf (not in agent0-sdk export, but present on deployed contract)
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      {
        internalType: 'bytes1',
        name: 'fields',
        type: 'bytes1',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'version',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'chainId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'verifyingContract',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'salt',
        type: 'bytes32',
      },
      {
        internalType: 'uint256[]',
        name: 'extensions',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'register',
    outputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'agentURI',
        type: 'string',
      },
    ],
    name: 'register',
    outputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'agentURI',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'metadataKey',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'metadataValue',
            type: 'bytes',
          },
        ],
        internalType: 'struct IdentityRegistryUpgradeable.MetadataEntry[]',
        name: 'metadata',
        type: 'tuple[]',
      },
    ],
    name: 'register',
    outputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'key',
        type: 'string',
      },
    ],
    name: 'getMetadata',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'key',
        type: 'string',
      },
      {
        internalType: 'bytes',
        name: 'value',
        type: 'bytes',
      },
    ],
    name: 'setMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'newURI',
        type: 'string',
      },
    ],
    name: 'setAgentURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'newWallet',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    name: 'setAgentWallet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
    ],
    name: 'unsetAgentWallet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
    ],
    name: 'getAgentWallet',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'agentURI',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'Registered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'newURI',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'updatedBy',
        type: 'address',
      },
    ],
    name: 'URIUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'string',
        name: 'indexedMetadataKey',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'metadataKey',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'metadataValue',
        type: 'bytes',
      },
    ],
    name: 'MetadataSet',
    type: 'event',
  },
] as const

export const reputationRegistryAbi = [
  {
    inputs: [],
    name: 'getIdentityRegistry',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        internalType: 'int128',
        name: 'value',
        type: 'int128',
      },
      {
        internalType: 'uint8',
        name: 'valueDecimals',
        type: 'uint8',
      },
      {
        internalType: 'string',
        name: 'tag1',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'tag2',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'endpoint',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'feedbackURI',
        type: 'string',
      },
      {
        internalType: 'bytes32',
        name: 'feedbackHash',
        type: 'bytes32',
      },
    ],
    name: 'giveFeedback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        internalType: 'uint64',
        name: 'feedbackIndex',
        type: 'uint64',
      },
    ],
    name: 'revokeFeedback',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'clientAddress',
        type: 'address',
      },
      {
        internalType: 'uint64',
        name: 'feedbackIndex',
        type: 'uint64',
      },
      {
        internalType: 'string',
        name: 'responseURI',
        type: 'string',
      },
      {
        internalType: 'bytes32',
        name: 'responseHash',
        type: 'bytes32',
      },
    ],
    name: 'appendResponse',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'clientAddress',
        type: 'address',
      },
    ],
    name: 'getLastIndex',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'clientAddress',
        type: 'address',
      },
      {
        internalType: 'uint64',
        name: 'feedbackIndex',
        type: 'uint64',
      },
    ],
    name: 'readFeedback',
    outputs: [
      {
        internalType: 'int128',
        name: 'value',
        type: 'int128',
      },
      {
        internalType: 'uint8',
        name: 'valueDecimals',
        type: 'uint8',
      },
      {
        internalType: 'string',
        name: 'tag1',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'tag2',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'isRevoked',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'clientAddresses',
        type: 'address[]',
      },
      {
        internalType: 'string',
        name: 'tag1',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'tag2',
        type: 'string',
      },
    ],
    name: 'getSummary',
    outputs: [
      {
        internalType: 'uint64',
        name: 'count',
        type: 'uint64',
      },
      {
        internalType: 'int128',
        name: 'summaryValue',
        type: 'int128',
      },
      {
        internalType: 'uint8',
        name: 'summaryValueDecimals',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: 'clientAddresses',
        type: 'address[]',
      },
      {
        internalType: 'string',
        name: 'tag1',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'tag2',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'includeRevoked',
        type: 'bool',
      },
    ],
    name: 'readAllFeedback',
    outputs: [
      {
        internalType: 'address[]',
        name: 'clients',
        type: 'address[]',
      },
      {
        internalType: 'uint64[]',
        name: 'feedbackIndexes',
        type: 'uint64[]',
      },
      {
        internalType: 'int128[]',
        name: 'values',
        type: 'int128[]',
      },
      {
        internalType: 'uint8[]',
        name: 'valueDecimals',
        type: 'uint8[]',
      },
      {
        internalType: 'string[]',
        name: 'tag1s',
        type: 'string[]',
      },
      {
        internalType: 'string[]',
        name: 'tag2s',
        type: 'string[]',
      },
      {
        internalType: 'bool[]',
        name: 'revokedStatuses',
        type: 'bool[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
    ],
    name: 'getClients',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'clientAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'feedbackIndex',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'int128',
        name: 'value',
        type: 'int128',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'valueDecimals',
        type: 'uint8',
      },
      {
        indexed: true,
        internalType: 'string',
        name: 'indexedTag1',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'tag1',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'tag2',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'endpoint',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'feedbackURI',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'feedbackHash',
        type: 'bytes32',
      },
    ],
    name: 'NewFeedback',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'agentId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'clientAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint64',
        name: 'feedbackIndex',
        type: 'uint64',
      },
    ],
    name: 'FeedbackRevoked',
    type: 'event',
  },
] as const
