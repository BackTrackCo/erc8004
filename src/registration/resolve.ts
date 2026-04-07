import type { Address, PublicClient } from 'viem'
import { resolveAgent } from '../identity/index.js'
import { fetchRegistrationFile } from './fetch.js'
import { findService } from './services.js'

export interface ResolveServiceEndpointParameters {
  agentId: bigint
  serviceName: string
  registryAddress?: Address
}

/**
 * Resolve a service endpoint for an on-chain agent in one call.
 *
 * Pipeline: `resolveAgent(agentId)` → `fetchRegistrationFile(agentURI)`
 * → `findService(file, serviceName)` → return endpoint.
 *
 * @throws if the agent doesn't exist, the URI fetch fails, or the service is not found
 */
export async function resolveServiceEndpoint(
  publicClient: PublicClient,
  parameters: ResolveServiceEndpointParameters,
): Promise<string> {
  const agent = await resolveAgent(publicClient, {
    agentId: parameters.agentId,
    registryAddress: parameters.registryAddress,
  })

  if (!agent.agentURI) {
    throw new Error(`Agent ${parameters.agentId} has no URI set`)
  }

  const file = await fetchRegistrationFile(agent.agentURI)

  const service = findService(file, parameters.serviceName)
  if (!service) {
    throw new Error(
      `Service "${parameters.serviceName}" not found in agent ${parameters.agentId} registration file`,
    )
  }

  return service.endpoint
}
