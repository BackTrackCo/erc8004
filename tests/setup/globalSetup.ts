import { anvilBaseSepolia } from './anvil.js'

export default async function globalSetup() {
  await anvilBaseSepolia.start()
  return () => anvilBaseSepolia.stop()
}
