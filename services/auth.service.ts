import { User, AuthCredentials, AuthResponse } from '../types'
import { mockUsers } from '../mock/data'
import { simulateApiCall, generateId, deepClone } from '../utils/helpers'

// ============================================================================
// Mock User Database (simulates backend storage)
// ============================================================================

const STORAGE_KEY_USER = 'recallai_user'
const STORAGE_KEY_TOKEN = 'recallai_token'
const STORAGE_KEY_SESSION = 'recallai_session_id'

// Mock database for all users
const mockUserDatabase: Record<string, { user: User; password: string }> = {
  'alex@example.com': {
    user: deepClone(mockUsers['u1']),
    password: 'password123', // mock password
  },
  'jordan@example.com': {
    user: deepClone(mockUsers['u2']),
    password: 'password123',
  },
  'taylor@example.com': {
    user: deepClone(mockUsers['u3']),
    password: 'password123',
  },
}

// ============================================================================
// LocalStorage Utilities
// ============================================================================

const isClient = typeof window !== 'undefined'

const getFromStorage = (key: string): string | null => {
  if (!isClient) return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const setInStorage = (key: string, value: string): void => {
  if (!isClient) return
  try {
    localStorage.setItem(key, value)
  } catch {
    // Handle storage quota exceeded or other errors silently
  }
}

const removeFromStorage = (key: string): void => {
  if (!isClient) return
  try {
    localStorage.removeItem(key)
  } catch {
    // Handle errors silently
  }
}

// ============================================================================
// Session Management
// ============================================================================

/**
 * Generates a mock JWT token
 */
const generateMockToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ sub: userId, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86400 }))
  const signature = btoa('mock_signature')
  return `${header}.${payload}.${signature}`
}

/**
 * Validates a mock JWT token
 */
const validateMockToken = (token: string): { userId: string; valid: boolean } => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return { userId: '', valid: false }
    const payload = JSON.parse(atob(parts[1]))
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return { userId: '', valid: false }
    }
    return { userId: payload.sub, valid: true }
  } catch {
    return { userId: '', valid: false }
  }
}

// ============================================================================
// Authentication Service
// ============================================================================

/**
 * Gets the current logged-in user from localStorage
 */
export async function getCurrentUser(): Promise<User> {
  return simulateApiCall(() => {
    const userJson = getFromStorage(STORAGE_KEY_USER)
    if (!userJson) {
      // For demo purposes, return the default mock user if no user is logged in
      return deepClone(mockUsers['u1'])
    }
    const token = getFromStorage(STORAGE_KEY_TOKEN)
    if (!token) {
      // No token, return default user
      return deepClone(mockUsers['u1'])
    }
    const { valid } = validateMockToken(token)
    if (!valid) {
      removeFromStorage(STORAGE_KEY_USER)
      removeFromStorage(STORAGE_KEY_TOKEN)
      // Token expired, return default user
      return deepClone(mockUsers['u1'])
    }
    return JSON.parse(userJson)
  }, 0) // No random failures for getting current user
}

/**
 * Logs in a user with email and password
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  return simulateApiCall(() => {
    const userRecord = mockUserDatabase[email]
    if (!userRecord || userRecord.password !== password) {
      throw new Error('Invalid email or password')
    }
    const user = deepClone(userRecord.user)
    user.lastActiveAt = new Date()
    const token = generateMockToken(user.id)
    setInStorage(STORAGE_KEY_USER, JSON.stringify(user))
    setInStorage(STORAGE_KEY_TOKEN, token)
    setInStorage(STORAGE_KEY_SESSION, generateId())
    return { user, token }
  })
}

/**
 * Signs up a new user
 */
export async function signup(name: string, email: string, password: string): Promise<AuthResponse> {
  return simulateApiCall(() => {
    if (mockUserDatabase[email]) {
      throw new Error('Email already registered')
    }
    if (!email.includes('@')) {
      throw new Error('Invalid email format')
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }
    const newUser: User = {
      id: generateId(),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      level: 1,
      streak: 0,
      currentStreak: 0,
      longestStreak: 0,
      xp: 0,
      totalXp: 0,
      joinedAt: new Date(),
      lastActiveAt: new Date(),
    }
    mockUserDatabase[email] = {
      user: deepClone(newUser),
      password,
    }
    const token = generateMockToken(newUser.id)
    setInStorage(STORAGE_KEY_USER, JSON.stringify(newUser))
    setInStorage(STORAGE_KEY_TOKEN, token)
    setInStorage(STORAGE_KEY_SESSION, generateId())
    return { user: newUser, token }
  })
}

/**
 * Logs out the current user
 */
export async function logout(): Promise<void> {
  return simulateApiCall(() => {
    removeFromStorage(STORAGE_KEY_USER)
    removeFromStorage(STORAGE_KEY_TOKEN)
    removeFromStorage(STORAGE_KEY_SESSION)
  }, 0) // No random failures for logout
}

/**
 * Initiates a forgot password flow
 */
export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
  return simulateApiCall(() => {
    if (!mockUserDatabase[email]) {
      throw new Error('Email not found')
    }
    return {
      success: true,
      message: 'Password reset link sent to your email. (Mock: In production, check your inbox)',
    }
  })
}

/**
 * Resets password with token
 */
export async function resetPassword(email: string, newPassword: string): Promise<{ success: boolean }> {
  return simulateApiCall(() => {
    if (!mockUserDatabase[email]) {
      throw new Error('Email not found')
    }
    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }
    mockUserDatabase[email].password = newPassword
    return { success: true }
  })
}

/**
 * Updates user profile
 */
export async function updateProfile(userId: string, updates: Partial<User>): Promise<User> {
  return simulateApiCall(() => {
    const currentUser = getFromStorage(STORAGE_KEY_USER)
    if (!currentUser) {
      throw new Error('Not authenticated')
    }
    const user = JSON.parse(currentUser)
    if (user.id !== userId) {
      throw new Error('Unauthorized')
    }
    const updated = { ...user, ...updates, id: user.id, email: user.email } // Prevent ID and email changes
    setInStorage(STORAGE_KEY_USER, JSON.stringify(updated))
    return updated
  })
}

/**
 * Validates if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  return simulateApiCall(() => {
    const token = getFromStorage(STORAGE_KEY_TOKEN)
    if (!token) return false
    const { valid } = validateMockToken(token)
    return valid
  }, 0)
}

/**
 * Gets user by ID (for admin/system purposes)
 */
export async function getUserById(userId: string): Promise<User | null> {
  return simulateApiCall(() => {
    for (const record of Object.values(mockUserDatabase)) {
      if (record.user.id === userId) {
        return deepClone(record.user)
      }
    }
    return null
  }, 0)
}
