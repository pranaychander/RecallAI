import { Notification, NotificationType, Achievement } from '../types'
import { mockNotifications } from '../mock/data'
import { simulateApiCall, generateId, deepClone } from '../utils/helpers'

// ============================================================================
// Notification Mock Database
// ============================================================================

let notificationDatabase: Map<string, Notification[]> = new Map()

// Initialize with mock notifications
function initializeNotifications() {
  notificationDatabase.set('u1', deepClone(mockNotifications))
}

initializeNotifications()

// ============================================================================
// Notification Service
// ============================================================================

/**
 * Gets all notifications for a user
 */
export async function getNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
  return simulateApiCall(() => {
    let notifications = notificationDatabase.get(userId) || []
    if (unreadOnly) {
      notifications = notifications.filter((n) => !n.read)
    }
    return deepClone(notifications).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }, 0)
}

/**
 * Gets count of unread notifications
 */
export async function getUnreadCount(userId: string): Promise<number> {
  return simulateApiCall(() => {
    const notifications = notificationDatabase.get(userId) || []
    return notifications.filter((n) => !n.read).length
  }, 0)
}

/**
 * Marks notification as read
 */
export async function markAsRead(userId: string, notificationId: string): Promise<Notification> {
  return simulateApiCall(() => {
    const notifications = notificationDatabase.get(userId) || []
    const notification = notifications.find((n) => n.id === notificationId)
    if (!notification) {
      throw new Error('Notification not found')
    }
    notification.read = true
    notificationDatabase.set(userId, notifications)
    return deepClone(notification)
  })
}

/**
 * Marks all notifications as read
 */
export async function markAllAsRead(userId: string): Promise<void> {
  return simulateApiCall(() => {
    const notifications = notificationDatabase.get(userId) || []
    notifications.forEach((n) => {
      n.read = true
    })
    notificationDatabase.set(userId, notifications)
  })
}

/**
 * Deletes a notification
 */
export async function deleteNotification(userId: string, notificationId: string): Promise<void> {
  return simulateApiCall(() => {
    const notifications = notificationDatabase.get(userId) || []
    const index = notifications.findIndex((n) => n.id === notificationId)
    if (index !== -1) {
      notifications.splice(index, 1)
      notificationDatabase.set(userId, notifications)
    }
  })
}

/**
 * Clears all notifications for a user
 */
export async function clearAllNotifications(userId: string): Promise<void> {
  return simulateApiCall(() => {
    notificationDatabase.set(userId, [])
  })
}

/**
 * Creates a revision reminder notification
 */
export async function createRevisionReminder(userId: string, cardCount: number): Promise<Notification> {
  return simulateApiCall(() => {
    const notification: Notification = {
      id: generateId(),
      userId,
      type: NotificationType.REVISION_REMINDER,
      title: 'Time to Review',
      message: `${cardCount} flashcards are due for review today.`,
      read: false,
      actionUrl: '/flashcards',
      createdAt: new Date(),
    }
    const notifications = notificationDatabase.get(userId) || []
    notifications.push(notification)
    notificationDatabase.set(userId, notifications)
    return deepClone(notification)
  })
}

/**
 * Creates a challenge shared notification
 */
export async function createChallengeSharedNotification(userId: string, challengeTitle: string, sharedByName: string): Promise<Notification> {
  return simulateApiCall(() => {
    const notification: Notification = {
      id: generateId(),
      userId,
      type: NotificationType.CHALLENGE_SHARED,
      title: 'Challenge Shared',
      message: `${sharedByName} shared "${challengeTitle}" with you.`,
      read: false,
      actionUrl: '/challenges',
      createdAt: new Date(),
    }
    const notifications = notificationDatabase.get(userId) || []
    notifications.push(notification)
    notificationDatabase.set(userId, notifications)
    return deepClone(notification)
  })
}

/**
 * Creates an achievement notification
 */
export async function createAchievementNotification(userId: string, achievement: Achievement): Promise<Notification> {
  return simulateApiCall(() => {
    const notification: Notification = {
      id: generateId(),
      userId,
      type: NotificationType.ACHIEVEMENT_UNLOCKED,
      title: 'Achievement Unlocked!',
      message: `You've earned the "${achievement.title}" achievement! +${achievement.xpReward} XP`,
      read: false,
      actionUrl: '/profile/achievements',
      createdAt: new Date(),
    }
    const notifications = notificationDatabase.get(userId) || []
    notifications.push(notification)
    notificationDatabase.set(userId, notifications)
    return deepClone(notification)
  })
}

/**
 * Creates a daily streak notification
 */
export async function createDailyStreakNotification(userId: string, streakDays: number): Promise<Notification> {
  return simulateApiCall(() => {
    const notification: Notification = {
      id: generateId(),
      userId,
      type: NotificationType.DAILY_STREAK,
      title: 'Keep Your Streak Going',
      message: `You're on a ${streakDays}-day streak! Complete a challenge today to maintain it.`,
      read: false,
      actionUrl: '/challenges',
      createdAt: new Date(),
    }
    const notifications = notificationDatabase.get(userId) || []
    notifications.push(notification)
    notificationDatabase.set(userId, notifications)
    return deepClone(notification)
  })
}

/**
 * Creates a friend followed notification
 */
export async function createFriendFollowedNotification(userId: string, friendName: string): Promise<Notification> {
  return simulateApiCall(() => {
    const notification: Notification = {
      id: generateId(),
      userId,
      type: NotificationType.FRIEND_FOLLOWED,
      title: 'New Friend',
      message: `${friendName} started following you!`,
      read: false,
      actionUrl: '/profile',
      createdAt: new Date(),
    }
    const notifications = notificationDatabase.get(userId) || []
    notifications.push(notification)
    notificationDatabase.set(userId, notifications)
    return deepClone(notification)
  })
}

/**
 * Creates a leaderboard rank notification
 */
export async function createLeaderboardRankNotification(userId: string, rankChange: number, newRank: number): Promise<Notification> {
  const direction = rankChange > 0 ? 'up' : rankChange < 0 ? 'down' : 'stable'
  const directionText = rankChange > 0 ? `up ${rankChange}` : rankChange < 0 ? `down ${Math.abs(rankChange)}` : 'stayed at'
  return simulateApiCall(() => {
    const notification: Notification = {
      id: generateId(),
      userId,
      type: NotificationType.LEADERBOARD_RANK,
      title: 'Rank Update',
      message: `You moved ${directionText} positions on the global leaderboard! New rank: #${newRank}`,
      read: false,
      createdAt: new Date(),
    }
    const notifications = notificationDatabase.get(userId) || []
    notifications.push(notification)
    notificationDatabase.set(userId, notifications)
    return deepClone(notification)
  })
}

/**
 * Sends a batch of notifications
 */
export async function sendBatchNotifications(notifications: Omit<Notification, 'id'>[]): Promise<void> {
  return simulateApiCall(() => {
    notifications.forEach((notif) => {
      const fullNotif: Notification = {
        ...notif,
        id: generateId(),
      }
      const userNotifs = notificationDatabase.get(notif.userId) || []
      userNotifs.push(fullNotif)
      notificationDatabase.set(notif.userId, userNotifs)
    })
  }, 0.05)
}
