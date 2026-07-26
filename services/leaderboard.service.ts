import { LeaderboardEntry, LeaderboardResponse } from '../types'
import { mockLeaderboardEntries, mockUsers } from '../mock/data'
import { simulateApiCall, deepClone } from '../utils/helpers'

// ============================================================================
// Leaderboard Mock Database
// ============================================================================

let leaderboardDatabase: Map<string, LeaderboardEntry> = new Map(mockLeaderboardEntries.map((e) => [e.userId, deepClone(e)]))
let friendships: Map<string, Set<string>> = new Map() // userId -> set of friend userIds

// Initialize some friendships for demo
function initializeFriendships() {
  friendships.set('u1', new Set(['u2', 'u3']))
  friendships.set('u2', new Set(['u1', 'u3', 'u4']))
  friendships.set('u3', new Set(['u1', 'u2']))
}

initializeFriendships()

// ============================================================================
// Leaderboard Service
// ============================================================================

/**
 * Gets global leaderboard
 */
export async function getGlobalLeaderboard(limit: number = 20, offset: number = 0): Promise<LeaderboardEntry[]> {
  return simulateApiCall(() => {
    const sorted = Array.from(leaderboardDatabase.values())
      .sort((a, b) => b.xp - a.xp)
      .map((entry, index) => ({
        ...deepClone(entry),
        rank: index + 1,
      }))
      .slice(offset, offset + limit)
    return sorted
  }, 0)
}

/**
 * Gets friends leaderboard
 */
export async function getFriendsLeaderboard(userId: string): Promise<LeaderboardEntry[]> {
  return simulateApiCall(() => {
    const userFriends = friendships.get(userId) || new Set()
    const friendIds = Array.from(userFriends)
    const friendEntries = friendIds
      .map((id) => leaderboardDatabase.get(id))
      .filter((e): e is LeaderboardEntry => e !== undefined)
      .sort((a, b) => b.xp - a.xp)
      .map((entry, index) => ({
        ...deepClone(entry),
        rank: index + 1,
      }))
    return friendEntries
  }, 0)
}

/**
 * Gets weekly leaderboard (based on streak/recent activity)
 */
export async function getWeeklyLeaderboard(limit: number = 20): Promise<LeaderboardEntry[]> {
  return simulateApiCall(() => {
    const sorted = Array.from(leaderboardDatabase.values())
      .sort((a, b) => b.streak - a.streak)
      .map((entry, index) => ({
        ...deepClone(entry),
        rank: index + 1,
      }))
      .slice(0, limit)
    return sorted
  }, 0)
}

/**
 * Gets monthly leaderboard (based on total XP gained this month)
 */
export async function getMonthlyLeaderboard(limit: number = 20): Promise<LeaderboardEntry[]> {
  return simulateApiCall(() => {
    // In a real app, this would track XP gained only in the current month
    // For now, we'll simulate by adjusting based on rank variations
    const sorted = Array.from(leaderboardDatabase.values())
      .map((entry) => {
        const monthlyXpVariance = Math.floor(Math.random() * 2000) - 1000
        return {
          ...deepClone(entry),
          xp: Math.max(0, entry.xp + monthlyXpVariance),
        }
      })
      .sort((a, b) => b.xp - a.xp)
      .map((entry, index) => ({
        ...deepClone(entry),
        rank: index + 1,
      }))
      .slice(0, limit)
    return sorted
  }, 0)
}

/**
 * Gets user's rank and surrounding entries
 */
export async function getUserRank(userId: string): Promise<LeaderboardResponse> {
  return simulateApiCall(() => {
    const sorted = Array.from(leaderboardDatabase.values())
      .sort((a, b) => b.xp - a.xp)
      .map((entry, index) => ({
        ...deepClone(entry),
        rank: index + 1,
      }))
    const userEntry = sorted.find((e) => e.userId === userId)
    if (!userEntry) {
      throw new Error('User not found on leaderboard')
    }
    const ranking = userEntry.previousRank ? (userEntry.rank < userEntry.previousRank ? 'up' : userEntry.rank > userEntry.previousRank ? 'down' : 'stable') : 'stable'
    return {
      entries: sorted.slice(Math.max(0, userEntry.rank - 3), userEntry.rank + 2),
      userEntry: {
        ...userEntry,
        ranking: ranking as 'up' | 'down' | 'stable',
      },
    }
  }, 0)
}

/**
 * Updates user XP on leaderboard
 */
export async function updateUserXp(userId: string, xpDelta: number): Promise<LeaderboardEntry> {
  return simulateApiCall(() => {
    const entry = leaderboardDatabase.get(userId)
    if (!entry) {
      throw new Error('User not found on leaderboard')
    }
    const previousRank = entry.rank
    entry.xp += xpDelta
    entry.xp = Math.max(0, entry.xp)
    // Recalculate rank
    const allEntries = Array.from(leaderboardDatabase.values()).sort((a, b) => b.xp - a.xp)
    entry.rank = allEntries.findIndex((e) => e.userId === userId) + 1
    entry.previousRank = previousRank
    leaderboardDatabase.set(userId, entry)
    return deepClone(entry)
  })
}

/**
 * Updates user streak
 */
export async function updateUserStreak(userId: string, streakDelta: number): Promise<LeaderboardEntry> {
  return simulateApiCall(() => {
    const entry = leaderboardDatabase.get(userId)
    if (!entry) {
      throw new Error('User not found on leaderboard')
    }
    entry.streak += streakDelta
    entry.streak = Math.max(0, entry.streak)
    leaderboardDatabase.set(userId, entry)
    return deepClone(entry)
  })
}

/**
 * Updates user level
 */
export async function updateUserLevel(userId: string, newLevel: number): Promise<LeaderboardEntry> {
  return simulateApiCall(() => {
    const entry = leaderboardDatabase.get(userId)
    if (!entry) {
      throw new Error('User not found on leaderboard')
    }
    entry.level = newLevel
    leaderboardDatabase.set(userId, entry)
    return deepClone(entry)
  })
}

/**
 * Updates user challenges completed
 */
export async function updateUserChallengesCompleted(userId: string, delta: number): Promise<LeaderboardEntry> {
  return simulateApiCall(() => {
    const entry = leaderboardDatabase.get(userId)
    if (!entry) {
      throw new Error('User not found on leaderboard')
    }
    entry.challenges += delta
    leaderboardDatabase.set(userId, entry)
    return deepClone(entry)
  })
}

/**
 * Follows a user (adds friendship)
 */
export async function followUser(userId: string, targetUserId: string): Promise<boolean> {
  return simulateApiCall(() => {
    if (!friendships.has(userId)) {
      friendships.set(userId, new Set())
    }
    friendships.get(userId)!.add(targetUserId)
    return true
  })
}

/**
 * Unfollows a user (removes friendship)
 */
export async function unfollowUser(userId: string, targetUserId: string): Promise<boolean> {
  return simulateApiCall(() => {
    if (friendships.has(userId)) {
      friendships.get(userId)!.delete(targetUserId)
    }
    return true
  })
}

/**
 * Checks if users are friends
 */
export async function isFriend(userId: string, targetUserId: string): Promise<boolean> {
  return simulateApiCall(() => {
    const friends = friendships.get(userId) || new Set()
    return friends.has(targetUserId)
  }, 0)
}

/**
 * Gets user's friends list
 */
export async function getUserFriends(userId: string): Promise<LeaderboardEntry[]> {
  return simulateApiCall(() => {
    const friendIds: string[] = Array.from(friendships.get(userId) || new Set())
    const friends = friendIds
      .map((id: string) => leaderboardDatabase.get(id))
      .filter((e): e is LeaderboardEntry => e !== undefined)
      .sort((a, b) => b.xp - a.xp)
    return friends.map((f) => deepClone(f))
  }, 0)
}

/**
 * Gets leaderboard statistics
 */
export async function getLeaderboardStats(): Promise<{
  totalUsers: number
  topUserXp: number
  averageXp: number
  medianXp: number
}> {
  return simulateApiCall(() => {
    const entries = Array.from(leaderboardDatabase.values())
    const xpValues = entries.map((e) => e.xp).sort((a, b) => a - b)
    return {
      totalUsers: entries.length,
      topUserXp: Math.max(...xpValues),
      averageXp: Math.round(xpValues.reduce((a, b) => a + b, 0) / xpValues.length),
      medianXp: xpValues[Math.floor(xpValues.length / 2)],
    }
  }, 0)
}
