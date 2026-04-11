import type { PublicClient } from 'viem'
import { resolveAgent } from '../identity/index.js'
import { fetchRegistrationFile } from './fetch.js'
import { findService } from './services.js'
import type {
  AgentRegistrationFile,
  ResolvedServiceEndpoint,
  ResolveServiceEndpointParameters,
} from './types.js'

/**
 * Resolve a service endpoint for an on-chain agent in one call.
 *
 * Pipeline: `resolveAgent(agentId)` → `fetchRegistrationFile(agentURI)`
 * → `findService(file, serviceName)` → return endpoint + metadata.
 *
 * @throws if the agent doesn't exist, the URI fetch fails, or the service is not found
 */
export async function resolveServiceEndpoint(
  publicClient: PublicClient,
  parameters: ResolveServiceEndpointParameters,
): Promise<ResolvedServiceEndpoint> {
  const agent = await resolveAgent(publicClient, {
    agentId: parameters.agentId,
    registryAddress: parameters.registryAddress,
  })

  if (!agent.agentURI) {
    throw new Error(`Agent ${parameters.agentId} has no URI set`)
  }

  let file: AgentRegistrationFile
  try {
    file = await fetchRegistrationFile(agent.agentURI, {
      ipfsGateway: parameters.ipfsGateway,
    })
  } catch (error) {
    throw new Error(
      `Agent ${parameters.agentId}: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  const service = findService(file, parameters.serviceName)
  if (!service) {
    throw new Error(
      `Service "${parameters.serviceName}" not found in agent ${parameters.agentId} registration file`,
    )
  }

  return {
    endpoint: service.endpoint,
    service,
    agentURI: agent.agentURI,
  }
}
