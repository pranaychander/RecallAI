// ============================================================================
// Utility Functions
// ============================================================================

const MIN_DELAY = 500
const MAX_DELAY = 1500

/**
 * Simulates API latency with optional jitter
 */
export const simulateDelay = (min: number = MIN_DELAY, max: number = MAX_DELAY): Promise<void> => {
  const delay = Math.random() * (max - min) + min
  return new Promise((resolve) => setTimeout(resolve, delay))
}

/**
 * Simulates random failure (5% chance by default)
 */
export const simulateRandomFailure = (failureRate: number = 0.05): void => {
  if (Math.random() < failureRate) {
    throw new Error('Simulated API error. Please try again.')
  }
}

/**
 * Generates realistic error messages
 */
export const getRandomErrorMessage = (): string => {
  const errors = [
    'Network error. Please check your connection.',
    'Server error. Please try again later.',
    'Request timeout. Please try again.',
    'Failed to process request. Please try again.',
    'An unexpected error occurred.',
  ]
  return errors[Math.floor(Math.random() * errors.length)]
}

/**
 * Creates a delay with simulated failure
 */
export const simulateApiCall = async <T>(fn: () => T, failureRate: number = 0.05): Promise<T> => {
  await simulateDelay()
  simulateRandomFailure(failureRate)
  return fn()
}

/**
 * Generates a random ID
 */
export const generateId = (): string => {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Deep clones an object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}
