import type { AgentRegistrationFile, ServiceEntry } from './types.js'

/** Return the first service whose name matches, or `undefined`. */
export function findService(
  file: AgentRegistrationFile,
  name: string,
): ServiceEntry | undefined {
  return file.services.find((s) => s.name === name)
}

/** Return all services whose name matches. */
export function findServices(
  file: AgentRegistrationFile,
  name: string,
): ServiceEntry[] {
  return file.services.filter((s) => s.name === name)
}
