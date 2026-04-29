/**
 * Authentication utility functions
 * Handles login and signup with localStorage-based session management
 */

export interface User {
  id: string
  email: string
  fullName?: string
  createdAt: Date
}

export interface AuthResponse {
  user: User
  token: string
}

const USERS_STORAGE_KEY = 'app_users'
const CURRENT_USER_KEY = 'current_user'
const TOKEN_KEY = 'auth_token'

/**
 * Hash a password (simple implementation - in production use proper bcrypt)
 */
function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16)
}

/**
 * Generate a simple token (in production use JWT)
 */
function generateToken(): string {
  return Math.random().toString(36).substr(2) + Date.now().toString(36)
}

/**
 * Sign up a new user
 */
export async function signup(email: string, password: string, fullName?: string): Promise<AuthResponse> {
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }

  // Check if user already exists
  const existingUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]')
  if (existingUsers.some((user: any) => user.email === email)) {
    throw new Error('Email already registered')
  }

  // Create new user
  const userId = `user_${Date.now()}`
  const hashedPassword = hashPassword(password)
  const token = generateToken()

  const newUser: User & { passwordHash: string } = {
    id: userId,
    email,
    fullName: fullName || email.split('@')[0],
    createdAt: new Date(),
    passwordHash: hashedPassword,
  }

  // Save user to storage
  existingUsers.push(newUser)
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers))

  // Set current user session
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
  localStorage.setItem(TOKEN_KEY, token)

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      createdAt: newUser.createdAt,
    },
    token,
  }
}

/**
 * Login an existing user
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  // Find user by email
  const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]')
  const user = users.find((u: any) => u.email === email)

  if (!user) {
    throw new Error('Invalid email or password')
  }

  // Verify password
  const hashedPassword = hashPassword(password)
  if (user.passwordHash !== hashedPassword) {
    throw new Error('Invalid email or password')
  }

  // Generate token and set session
  const token = generateToken()
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  localStorage.setItem(TOKEN_KEY, token)

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt,
    },
    token,
  }
}

/**
 * Get current logged-in user
 */
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem(CURRENT_USER_KEY)
  if (!userStr) return null

  try {
    return JSON.parse(userStr) as User
  } catch {
    return null
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem(TOKEN_KEY) && !!getCurrentUser()
}

/**
 * Logout current user
 */
export function logout(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
  localStorage.removeItem(TOKEN_KEY)
}
