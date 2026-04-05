import { defineConfig } from '@wagmi/cli'
import { etherscan } from '@wagmi/cli/plugins'
import { base } from 'viem/chains'

export default defineConfig({
  out: 'src/abis/generated.ts',
  plugins: [
    etherscan({
      apiKey: process.env.BASESCAN_API_KEY ?? '',
      chainId: base.id,
      contracts: [
        {
          name: 'IdentityRegistry',
          address: '0x8004A169FB4a3325136EB29fA0ceB6D2e539a432',
        },
        {
          name: 'ReputationRegistry',
          address: '0x8004BAa17C55a88189AE136b182e5fdA19dE9b63',
        },
      ],
    }),
  ],
})
