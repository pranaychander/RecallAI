import { UserProfile, UserStats, UserSettings, Achievement, LearningEvent } from '../types'
import { mockUsers, mockAchievements, mockLearningEvents, defaultUserSettings } from '../mock/data'
import { simulateApiCall, generateId, deepClone } from '../utils/helpers'

// ============================================================================
// Profile Mock Database
// ============================================================================

let userStatsDatabase: Map<string, UserStats> = new Map()
let userSettingsDatabase: Map<string, UserSettings> = new Map()
let userAchievementsDatabase: Map<string, Achievement[]> = new Map()
let userLearningEventsDatabase: Map<string, LearningEvent[]> = new Map()

// Initialize with mock data
function initializeProfileData() {
  Object.keys(mockUsers).forEach((userId) => {
    userStatsDatabase.set(userId, {
      totalChallenges: Math.floor(Math.random() * 50) + 10,
      totalQuizzes: Math.floor(Math.random() * 100) + 20,
      totalFlashcards: Math.floor(Math.random() * 200) + 50,
      averageScore: Math.floor(Math.random() * 30) + 70,
      accuracyRate: Math.floor(Math.random() * 25) + 75,
      timeSpentMinutes: Math.floor(Math.random() * 5000) + 1000,
      lastReviewDate: new Date(Date.now() - Math.random() * 604800000),
    })
    userSettingsDatabase.set(userId, deepClone(defaultUserSettings))
    userAchievementsDatabase.set(userId, deepClone(mockAchievements))
    userLearningEventsDatabase.set(userId, deepClone(mockLearningEvents))
  })
}

initializeProfileData()

// ============================================================================
// Profile Service
// ============================================================================

/**
 * Gets user profile
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  return simulateApiCall(async () => {
    const user = mockUsers[userId as keyof typeof mockUsers]
    if (!user) {
      throw new Error('User not found')
    }
    const stats = userStatsDatabase.get(userId) || createDefaultStats()
    const settings = userSettingsDatabase.get(userId) || deepClone(defaultUserSettings)
    const achievements = userAchievementsDatabase.get(userId) || []
    const learningTimeline = userLearningEventsDatabase.get(userId) || []
    return {
      user: deepClone(user),
      stats,
      settings,
      achievements: deepClone(achievements),
      learningTimeline: deepClone(learningTimeline),
    }
  }, 0)
}

/**
 * Gets user stats
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  return simulateApiCall(() => {
    const stats = userStatsDatabase.get(userId)
    if (!stats) {
      throw new Error('Stats not found for user')
    }
    return deepClone(stats)
  }, 0)
}

/**
 * Updates user stats
 */
export async function updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats> {
  return simulateApiCall(() => {
    const currentStats = userStatsDatabase.get(userId) || createDefaultStats()
    const updated = { ...currentStats, ...updates }
    userStatsDatabase.set(userId, updated)
    return deepClone(updated)
  })
}

/**
 * Gets user settings
 */
export async function getUserSettings(userId: string): Promise<UserSettings> {
  return simulateApiCall(() => {
    const settings = userSettingsDatabase.get(userId)
    if (!settings) {
      throw new Error('Settings not found for user')
    }
    return deepClone(settings)
  }, 0)
}

/**
 * Updates user settings
 */
export async function updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings> {
  return simulateApiCall(() => {
    const currentSettings = userSettingsDatabase.get(userId) || deepClone(defaultUserSettings)
    const updated = { ...currentSettings, ...updates }
    userSettingsDatabase.set(userId, updated)
    return deepClone(updated)
  })
}

/**
 * Gets user achievements
 */
export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  return simulateApiCall(() => {
    const achievements = userAchievementsDatabase.get(userId) || []
    return deepClone(achievements)
  }, 0)
}

/**
 * Unlocks an achievement
 */
export async function unlockAchievement(userId: string, achievement: Omit<Achievement, 'userId' | 'unlockedAt'>): Promise<Achievement> {
  return simulateApiCall(() => {
    const achievements = userAchievementsDatabase.get(userId) || []
    const newAchievement: Achievement = {
      ...achievement,
      userId,
      id: generateId(),
      unlockedAt: new Date(),
    }
    achievements.push(newAchievement)
    userAchievementsDatabase.set(userId, achievements)
    return deepClone(newAchievement)
  })
}

/**
 * Gets user learning timeline
 */
export async function getUserLearningTimeline(userId: string, limit: number = 20): Promise<LearningEvent[]> {
  return simulateApiCall(() => {
    const events = userLearningEventsDatabase.get(userId) || []
    return deepClone(events).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit)
  }, 0)
}

/**
 * Adds a learning event
 */
export async function addLearningEvent(userId: string, event: Omit<LearningEvent, 'id' | 'userId'>): Promise<LearningEvent> {
  return simulateApiCall(() => {
    const events = userLearningEventsDatabase.get(userId) || []
    const newEvent: LearningEvent = {
      ...event,
      userId,
      id: generateId(),
    }
    events.push(newEvent)
    userLearningEventsDatabase.set(userId, events)
    return deepClone(newEvent)
  })
}

/**
 * Gets learning statistics over time
 */
export async function getLearningProgress(userId: string, days: number = 30): Promise<{ date: string; minutes: number; xpGained: number }[]> {
  return simulateApiCall(() => {
    const progress = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      progress.push({
        date: date.toISOString().split('T')[0],
        minutes: Math.floor(Math.random() * 120),
        xpGained: Math.floor(Math.random() * 500),
      })
    }
    return progress
  }, 0)
}

/**
 * Exports user data
 */
export async function exportUserData(userId: string): Promise<string> {
  return simulateApiCall(async () => {
    const profile = await getUserProfile(userId)
    return JSON.stringify(profile, null, 2)
  })
}

/**
 * Deletes user account
 */
export async function deleteUserAccount(userId: string): Promise<void> {
  return simulateApiCall(() => {
    userStatsDatabase.delete(userId)
    userSettingsDatabase.delete(userId)
    userAchievementsDatabase.delete(userId)
    userLearningEventsDatabase.delete(userId)
  })
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Creates default stats for a user
 */
function createDefaultStats(): UserStats {
  return {
    totalChallenges: 0,
    totalQuizzes: 0,
    totalFlashcards: 0,
    averageScore: 0,
    accuracyRate: 0,
    timeSpentMinutes: 0,
    lastReviewDate: new Date(),
  }
}
