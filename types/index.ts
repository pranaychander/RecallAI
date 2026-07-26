// ============================================================================
// User & Auth
// ============================================================================

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  level: number
  streak: number
  currentStreak: number
  longestStreak: number
  xp: number
  totalXp: number
  joinedAt: Date
  lastActiveAt: Date
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

// ============================================================================
// Stats & Analytics
// ============================================================================

export interface Stats {
  knowledge: number
  mastery: { current: number; total: number }
  retentionRate: number
  dailyGoal: { target: number; completed: number }
  weeklyStats: { day: string; completed: number; xpGained: number }[]
}

export interface UserStats {
  totalChallenges: number
  totalQuizzes: number
  totalFlashcards: number
  averageScore: number
  accuracyRate: number
  timeSpentMinutes: number
  lastReviewDate: Date
}

// ============================================================================
// Learning Items & Challenges
// ============================================================================

export interface LearningItem {
  id: string
  title: string
  description: string
  icon: string
  color?: string
  badge?: string
  cta?: string
}

export enum ChallengeSourceType {
  URL = 'url',
  PDF = 'pdf',
  GITHUB = 'github',
  YOUTUBE = 'youtube',
  MANUAL = 'manual',
}

export enum ChallengeStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  READY = 'ready',
  COMPLETED = 'completed',
}

export interface Challenge {
  id: string
  userId: string
  title: string
  description: string
  sourceType: ChallengeSourceType
  sourceUrl?: string
  content: string
  summary: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  status: ChallengeStatus
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  questionsCount: number
  averageScore?: number
  timeSpentSeconds?: number
}

// ============================================================================
// Quiz & Questions
// ============================================================================

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SHORT_ANSWER = 'short_answer',
  TRUE_FALSE = 'true_false',
  FILL_BLANK = 'fill_blank',
}

export interface Question {
  id: string
  challengeId: string
  quizId: string
  type: QuestionType
  text: string
  options?: string[]
  correctAnswer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  category?: string
  tags?: string[]
  createdAt: Date
}

export interface Quiz {
  id: string
  challengeId: string
  title: string
  description: string
  questionsCount: number
  questions: Question[]
  totalTimeMinutes: number
  passingScore: number
  createdAt: Date
  updatedAt: Date
}

export enum ConfidenceLevel {
  NOT_SURE = 1,
  SOMEWHAT_SURE = 2,
  VERY_SURE = 3,
}

export interface QuizAnswer {
  questionId: string
  answer: string
  confidence: ConfidenceLevel
  timeSpentSeconds: number
  isCorrect: boolean
}

export interface QuizSession {
  id: string
  userId: string
  quizId: string
  challengeId: string
  startedAt: Date
  completedAt?: Date
  answers: QuizAnswer[]
  score: number
  timeSpentSeconds: number
}

export interface QuizSummary {
  id: string
  title: string
  questionsCount: number
}

export interface QuizResult {
  sessionId: string
  score: number
  percentage: number
  totalQuestions: number
  correctAnswers: number
  timeSpentSeconds: number
  breakdown: {
    category: string
    correct: number
    total: number
  }[]
}

// ============================================================================
// Flashcards & Spaced Repetition
// ============================================================================

export enum CardStatus {
  NEW = 'new',
  LEARNING = 'learning',
  REVIEW = 'review',
  MASTERED = 'mastered',
}

export interface Flashcard {
  id: string
  userId: string
  challengeId?: string
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  status: CardStatus
  createdAt: Date
  updatedAt: Date
  nextReviewAt: Date
  easeFactor: number
  interval: number
  repetitions: number
}

export interface FlashcardReview {
  id: string
  flashcardId: string
  userId: string
  quality: number // 0-5
  ease: number
  interval: number
  nextReviewAt: Date
  reviewedAt: Date
}

// ============================================================================
// Knowledge Graph
// ============================================================================

export interface KnowledgeNode {
  id: string
  title: string
  description: string
  category: string
  masteryPercentage: number
  relatedNodes: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  resources: Resource[]
  prerequisites?: string[]
}

export interface Resource {
  id: string
  title: string
  type: 'article' | 'video' | 'quiz' | 'flashcard' | 'course'
  url: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[]
  edges: { from: string; to: string; weight: number }[]
}

// ============================================================================
// Achievements & Gamification
// ============================================================================

export enum AchievementType {
  STREAK = 'streak',
  CHALLENGE_COMPLETED = 'challenge_completed',
  QUIZ_MASTERY = 'quiz_mastery',
  FIRST_CHALLENGE = 'first_challenge',
  KNOWLEDGE_MILESTONE = 'knowledge_milestone',
  PERFECT_SCORE = 'perfect_score',
  LEADERBOARD_TOP = 'leaderboard_top',
  CONSISTENCY = 'consistency',
}

export interface Achievement {
  id: string
  userId: string
  type: AchievementType
  title: string
  description: string
  icon: string
  unlockedAt: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xpReward: number
}

// ============================================================================
// Notifications
// ============================================================================

export enum NotificationType {
  REVISION_REMINDER = 'revision_reminder',
  CHALLENGE_SHARED = 'challenge_shared',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  DAILY_STREAK = 'daily_streak',
  FRIEND_FOLLOWED = 'friend_followed',
  LEADERBOARD_RANK = 'leaderboard_rank',
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: Date
}

// ============================================================================
// Leaderboard
// ============================================================================

export interface LeaderboardEntry {
  userId: string
  userName: string
  avatar: string
  rank: number
  xp: number
  level: number
  streak: number
  challenges: number
  previousRank?: number
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[]
  userEntry: LeaderboardEntry & { ranking: 'up' | 'down' | 'stable' }
}

// ============================================================================
// Settings & Profile
// ============================================================================

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    enabled: boolean
    dailyReminder: boolean
    achievementNotifications: boolean
    leaderboardUpdates: boolean
  }
  privacy: {
    profilePublic: boolean
    showOnLeaderboard: boolean
  }
  preferences: {
    dailyGoalMinutes: number
    difficulty: 'easy' | 'medium' | 'hard'
    language: string
  }
}

export interface UserProfile {
  user: User
  stats: UserStats
  settings: UserSettings
  achievements: Achievement[]
  learningTimeline: LearningEvent[]
}

export interface LearningEvent {
  id: string
  userId: string
  type: 'challenge_completed' | 'quiz_completed' | 'flashcard_mastered' | 'level_up'
  title: string
  description: string
  xpGained: number
  timestamp: Date
}

// ============================================================================
// Tutor & Chat
// ============================================================================

export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  followUpSuggestions?: string[]
}

export interface TutorSession {
  id: string
  userId: string
  topicId: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

// ============================================================================
// API Response Wrappers
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: Date
}
