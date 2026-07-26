import {
  User,
  Stats,
  LearningItem,
  Challenge,
  ChallengeSourceType,
  ChallengeStatus,
  Question,
  QuestionType,
  Quiz,
  Flashcard,
  CardStatus,
  KnowledgeNode,
  Achievement,
  AchievementType,
  Notification,
  NotificationType,
  LeaderboardEntry,
  UserSettings,
  LearningEvent,
} from '../types'

// ============================================================================
// Users
// ============================================================================

export const mockUsers: Record<string, User> = {
  'u1': {
    id: 'u1',
    name: 'Alex Chen',
    email: 'alex@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    level: 24,
    streak: 12,
    currentStreak: 12,
    longestStreak: 28,
    xp: 4240,
    totalXp: 12400,
    joinedAt: new Date('2023-06-15'),
    lastActiveAt: new Date(),
  },
  'u2': {
    id: 'u2',
    name: 'Jordan Smith',
    email: 'jordan@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    level: 31,
    streak: 18,
    currentStreak: 18,
    longestStreak: 31,
    xp: 6850,
    totalXp: 18500,
    joinedAt: new Date('2023-02-20'),
    lastActiveAt: new Date(),
  },
  'u3': {
    id: 'u3',
    name: 'Taylor Johnson',
    email: 'taylor@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
    level: 19,
    streak: 7,
    currentStreak: 7,
    longestStreak: 14,
    xp: 3100,
    totalXp: 8900,
    joinedAt: new Date('2023-09-10'),
    lastActiveAt: new Date(),
  },
}

export const user: User = mockUsers['u1']

// ============================================================================
// Stats
// ============================================================================

export const stats: Stats = {
  knowledge: 84,
  mastery: { current: 450, total: 600 },
  retentionRate: 84,
  dailyGoal: { target: 60, completed: 45 },
  weeklyStats: [
    { day: 'Mon', completed: 1, xpGained: 120 },
    { day: 'Tue', completed: 1, xpGained: 135 },
    { day: 'Wed', completed: 2, xpGained: 280 },
    { day: 'Thu', completed: 1, xpGained: 95 },
    { day: 'Fri', completed: 2, xpGained: 310 },
    { day: 'Sat', completed: 0, xpGained: 0 },
    { day: 'Sun', completed: 3, xpGained: 450 },
  ],
}

// ============================================================================
// Recent Learning Items
// ============================================================================

export const recentLearning: LearningItem[] = [
  {
    id: 'r1',
    title: 'Python Decorators',
    description: 'Mastering functional programming and closures in Python 3.10.',
    icon: 'code',
    color: 'primary',
    badge: '80% Mastery',
    cta: 'Continue',
  },
  {
    id: 'r2',
    title: 'World History',
    description: "The Age of Enlightenment and its impact on modern democracy.",
    icon: 'history_edu',
    color: 'tertiary',
    badge: '45% Mastery',
    cta: 'Continue',
  },
  {
    id: 'r3',
    title: 'CRISPR Editing',
    description: 'Foundational mechanisms of gene therapy and bioethics.',
    icon: 'biotech',
    color: 'secondary',
    badge: 'New Topic',
    cta: 'Start Learning',
  },
]

// ============================================================================
// Challenges
// ============================================================================

export const mockChallenges: Challenge[] = [
  {
    id: 'ch1',
    userId: 'u1',
    title: 'Python Decorators Deep Dive',
    description: 'Advanced patterns for functional programming in Python',
    sourceType: ChallengeSourceType.URL,
    sourceUrl: 'https://example.com/python-decorators',
    content: 'Decorators are functions that modify other functions or classes...',
    summary: 'Learn how decorators work, common patterns, and best practices.',
    difficulty: 'hard',
    category: 'Programming',
    status: ChallengeStatus.READY,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    completedAt: new Date('2024-01-20'),
    questionsCount: 12,
    averageScore: 92,
    timeSpentSeconds: 1840,
  },
  {
    id: 'ch2',
    userId: 'u1',
    title: 'Renaissance Art History',
    description: 'Understanding the artistic movements of the Renaissance',
    sourceType: ChallengeSourceType.PDF,
    content: 'The Renaissance was a period of great cultural change...',
    summary: 'Key movements, famous artists, and historical context.',
    difficulty: 'medium',
    category: 'History',
    status: ChallengeStatus.READY,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    questionsCount: 15,
    averageScore: 78,
    timeSpentSeconds: 2100,
  },
  {
    id: 'ch3',
    userId: 'u1',
    title: 'React Hooks Best Practices',
    description: 'Building efficient components with React Hooks',
    sourceType: ChallengeSourceType.GITHUB,
    sourceUrl: 'https://github.com/example/react-hooks',
    content: 'Hooks provide a way to use state and other React features...',
    summary: 'Master useState, useEffect, useContext, and custom hooks.',
    difficulty: 'medium',
    category: 'Web Development',
    status: ChallengeStatus.READY,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    questionsCount: 10,
    averageScore: 88,
    timeSpentSeconds: 1650,
  },
  {
    id: 'ch4',
    userId: 'u1',
    title: 'Quantum Computing Fundamentals',
    description: 'Introduction to quantum mechanics and qubits',
    sourceType: ChallengeSourceType.YOUTUBE,
    sourceUrl: 'https://youtube.com/watch?v=example',
    content: 'Quantum computers use quantum bits or qubits...',
    summary: 'Understand superposition, entanglement, and quantum gates.',
    difficulty: 'hard',
    category: 'Physics',
    status: ChallengeStatus.READY,
    createdAt: new Date('2023-12-28'),
    updatedAt: new Date('2023-12-28'),
    questionsCount: 14,
    averageScore: 72,
    timeSpentSeconds: 2340,
  },
]

// ============================================================================
// Questions
// ============================================================================

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    challengeId: 'ch1',
    quizId: 'quiz1',
    type: QuestionType.MULTIPLE_CHOICE,
    text: 'What is a decorator in Python?',
    options: [
      'A function that modifies another function or class',
      'A CSS framework',
      'A type of syntax error',
      'A design pattern for databases',
    ],
    correctAnswer: 'A function that modifies another function or class',
    explanation:
      'Decorators are functions that take another function or class and extend it without permanently modifying the source code.',
    difficulty: 'medium',
    category: 'Programming',
    tags: ['Python', 'Functions', 'Decorators'],
    createdAt: new Date(),
  },
  {
    id: 'q2',
    challengeId: 'ch1',
    quizId: 'quiz1',
    type: QuestionType.TRUE_FALSE,
    text: 'Decorators must return a function.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Decorators are typically functions that return a modified version of the decorated function.',
    difficulty: 'easy',
    category: 'Programming',
    tags: ['Python', 'Decorators'],
    createdAt: new Date(),
  },
  {
    id: 'q3',
    challengeId: 'ch1',
    quizId: 'quiz1',
    type: QuestionType.SHORT_ANSWER,
    text: 'What is the @ symbol used for in Python decorators?',
    correctAnswer: 'syntactic sugar',
    explanation: 'The @ symbol is syntactic sugar for function wrapping. @decorator is equivalent to func = decorator(func).',
    difficulty: 'hard',
    category: 'Programming',
    tags: ['Python', 'Syntax'],
    createdAt: new Date(),
  },
  {
    id: 'q4',
    challengeId: 'ch2',
    quizId: 'quiz2',
    type: QuestionType.MULTIPLE_CHOICE,
    text: 'Which period marks the beginning of the Renaissance?',
    options: ['12th century', '14th century', '16th century', '18th century'],
    correctAnswer: '14th century',
    explanation: 'The Renaissance began in Italy during the 14th century and gradually spread throughout Europe.',
    difficulty: 'medium',
    category: 'History',
    tags: ['Renaissance', 'History', 'Europe'],
    createdAt: new Date(),
  },
  {
    id: 'q5',
    challengeId: 'ch3',
    quizId: 'quiz3',
    type: QuestionType.MULTIPLE_CHOICE,
    text: 'Which hook is used to perform side effects in React?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correctAnswer: 'useEffect',
    explanation: 'useEffect is the hook that lets you perform side effects in function components.',
    difficulty: 'easy',
    category: 'Web Development',
    tags: ['React', 'Hooks', 'JavaScript'],
    createdAt: new Date(),
  },
]

// ============================================================================
// Quizzes
// ============================================================================

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz1',
    challengeId: 'ch1',
    title: 'Python Decorators Mastery',
    description: 'Test your knowledge on Python decorators',
    questionsCount: 12,
    questions: mockQuestions.filter((q) => q.quizId === 'quiz1'),
    totalTimeMinutes: 30,
    passingScore: 70,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'quiz2',
    challengeId: 'ch2',
    title: 'Renaissance Art History Quiz',
    description: 'Understanding Renaissance movements and artists',
    questionsCount: 15,
    questions: mockQuestions.filter((q) => q.quizId === 'quiz2'),
    totalTimeMinutes: 45,
    passingScore: 75,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'quiz3',
    challengeId: 'ch3',
    title: 'React Hooks Quiz',
    description: 'Test your React Hooks knowledge',
    questionsCount: 10,
    questions: mockQuestions.filter((q) => q.quizId === 'quiz3'),
    totalTimeMinutes: 25,
    passingScore: 70,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// ============================================================================
// Flashcards
// ============================================================================

export const mockFlashcards: Flashcard[] = [
  {
    id: 'fc1',
    userId: 'u1',
    challengeId: 'ch1',
    front: 'What are the three closure principles?',
    back: 'Scope, execution context, and lexical environment are the key principles of closures in JavaScript.',
    category: 'Programming',
    difficulty: 'hard',
    status: CardStatus.REVIEW,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20'),
    nextReviewAt: new Date(Date.now() + 86400000),
    easeFactor: 2.5,
    interval: 7,
    repetitions: 3,
  },
  {
    id: 'fc2',
    userId: 'u1',
    challengeId: 'ch2',
    front: 'Name three famous Renaissance painters.',
    back: 'Leonardo da Vinci, Michelangelo, and Raphael are three of the most famous Renaissance painters.',
    category: 'History',
    difficulty: 'easy',
    status: CardStatus.MASTERED,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18'),
    nextReviewAt: new Date(Date.now() + 604800000),
    easeFactor: 2.8,
    interval: 21,
    repetitions: 8,
  },
  {
    id: 'fc3',
    userId: 'u1',
    front: 'What does OOP stand for?',
    back: 'Object-Oriented Programming is a programming paradigm based on the concept of objects.',
    category: 'Programming',
    difficulty: 'easy',
    status: CardStatus.LEARNING,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-21'),
    nextReviewAt: new Date(Date.now() + 172800000),
    easeFactor: 2.3,
    interval: 2,
    repetitions: 2,
  },
  {
    id: 'fc4',
    userId: 'u1',
    front: 'Explain encapsulation in OOP.',
    back: 'Encapsulation is the bundling of data and methods that operate on that data within a single unit (class), hiding internal details.',
    category: 'Programming',
    difficulty: 'medium',
    status: CardStatus.REVIEW,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-19'),
    nextReviewAt: new Date(Date.now() + 345600000),
    easeFactor: 2.6,
    interval: 4,
    repetitions: 4,
  },
  {
    id: 'fc5',
    userId: 'u1',
    front: 'What is a DNA nucleotide?',
    back: 'A nucleotide is the basic building block of DNA, consisting of a sugar (deoxyribose), a phosphate group, and a nitrogenous base.',
    category: 'Biology',
    difficulty: 'medium',
    status: CardStatus.NEW,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
    nextReviewAt: new Date(Date.now() + 86400000),
    easeFactor: 2.0,
    interval: 1,
    repetitions: 0,
  },
]

// ============================================================================
// Knowledge Nodes
// ============================================================================

export const mockKnowledgeNodes: KnowledgeNode[] = [
  {
    id: 'kn1',
    title: 'Python Basics',
    description: 'Fundamental concepts of Python programming',
    category: 'Programming',
    masteryPercentage: 95,
    difficulty: 'beginner',
    relatedNodes: ['kn2', 'kn3', 'kn5'],
    resources: [
      { id: 'r1', title: 'Python Basics Course', type: 'video', url: '#', difficulty: 'beginner' },
      { id: 'r2', title: 'Python Quiz', type: 'quiz', url: '#', difficulty: 'beginner' },
    ],
  },
  {
    id: 'kn2',
    title: 'Advanced Functions',
    description: 'Deep dive into function programming, closures, and decorators',
    category: 'Programming',
    masteryPercentage: 82,
    difficulty: 'advanced',
    prerequisites: ['kn1'],
    relatedNodes: ['kn1', 'kn3', 'kn4'],
    resources: [
      { id: 'r3', title: 'Functions Deep Dive', type: 'article', url: '#', difficulty: 'intermediate' },
      { id: 'r4', title: 'Decorators Mastery', type: 'quiz', url: '#', difficulty: 'advanced' },
    ],
  },
  {
    id: 'kn3',
    title: 'Object-Oriented Programming',
    description: 'Classes, inheritance, polymorphism, and encapsulation',
    category: 'Programming',
    masteryPercentage: 78,
    difficulty: 'intermediate',
    prerequisites: ['kn1'],
    relatedNodes: ['kn1', 'kn2', 'kn5'],
    resources: [
      { id: 'r5', title: 'OOP Concepts', type: 'video', url: '#', difficulty: 'intermediate' },
    ],
  },
  {
    id: 'kn4',
    title: 'Web Development',
    description: 'HTML, CSS, JavaScript, and modern frameworks',
    category: 'Web Development',
    masteryPercentage: 88,
    difficulty: 'intermediate',
    relatedNodes: ['kn5', 'kn6'],
    resources: [
      { id: 'r6', title: 'React Fundamentals', type: 'course', url: '#', difficulty: 'intermediate' },
    ],
  },
  {
    id: 'kn5',
    title: 'Data Structures',
    description: 'Arrays, linked lists, trees, graphs, and algorithms',
    category: 'Computer Science',
    masteryPercentage: 71,
    difficulty: 'advanced',
    prerequisites: ['kn1'],
    relatedNodes: ['kn1', 'kn3'],
    resources: [
      { id: 'r7', title: 'Data Structures Course', type: 'video', url: '#', difficulty: 'advanced' },
    ],
  },
  {
    id: 'kn6',
    title: 'Databases',
    description: 'SQL, NoSQL, design patterns, and optimization',
    category: 'Backend',
    masteryPercentage: 65,
    difficulty: 'intermediate',
    relatedNodes: ['kn4', 'kn5'],
    resources: [
      { id: 'r8', title: 'SQL Basics', type: 'article', url: '#', difficulty: 'intermediate' },
    ],
  },
]

// ============================================================================
// Achievements
// ============================================================================

export const mockAchievements: Achievement[] = [
  {
    id: 'a1',
    userId: 'u1',
    type: AchievementType.FIRST_CHALLENGE,
    title: 'First Step',
    description: 'Complete your first challenge',
    icon: 'rocket_launch',
    unlockedAt: new Date('2024-01-01'),
    rarity: 'common',
    xpReward: 50,
  },
  {
    id: 'a2',
    userId: 'u1',
    type: AchievementType.STREAK,
    title: '7-Day Streak',
    description: 'Maintain a 7-day learning streak',
    icon: 'local_fire_department',
    unlockedAt: new Date('2024-01-08'),
    rarity: 'common',
    xpReward: 100,
  },
  {
    id: 'a3',
    userId: 'u1',
    type: AchievementType.PERFECT_SCORE,
    title: 'Perfect Score',
    description: 'Complete a quiz with 100% accuracy',
    icon: 'star',
    unlockedAt: new Date('2024-01-15'),
    rarity: 'rare',
    xpReward: 250,
  },
  {
    id: 'a4',
    userId: 'u1',
    type: AchievementType.CHALLENGE_COMPLETED,
    title: 'Challenge Master',
    description: 'Complete 5 challenges',
    icon: 'military_tech',
    unlockedAt: new Date('2024-01-18'),
    rarity: 'rare',
    xpReward: 300,
  },
  {
    id: 'a5',
    userId: 'u1',
    type: AchievementType.KNOWLEDGE_MILESTONE,
    title: 'Knowledge Pioneer',
    description: 'Master 3 knowledge nodes',
    icon: 'psychology',
    unlockedAt: new Date('2024-01-20'),
    rarity: 'epic',
    xpReward: 500,
  },
]

// ============================================================================
// Notifications
// ============================================================================

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    type: NotificationType.ACHIEVEMENT_UNLOCKED,
    title: 'Achievement Unlocked!',
    message: "You've earned the 'Challenge Master' achievement!",
    read: false,
    actionUrl: '/profile/achievements',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'n2',
    userId: 'u1',
    type: NotificationType.REVISION_REMINDER,
    title: 'Time to Review',
    message: '3 flashcards are due for review today.',
    read: false,
    actionUrl: '/flashcards',
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: 'n3',
    userId: 'u1',
    type: NotificationType.DAILY_STREAK,
    title: 'Keep Your Streak Going',
    message: "You're on a 12-day streak! Complete a challenge to maintain it.",
    read: true,
    actionUrl: '/challenges',
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'n4',
    userId: 'u1',
    type: NotificationType.LEADERBOARD_RANK,
    title: 'Rank Update',
    message: 'You moved up 3 positions on the global leaderboard!',
    read: true,
    createdAt: new Date(Date.now() - 172800000),
  },
]

// ============================================================================
// Leaderboard
// ============================================================================

export const mockLeaderboardEntries: LeaderboardEntry[] = [
  {
    userId: 'u2',
    userName: 'Jordan Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    rank: 1,
    xp: 6850,
    level: 31,
    streak: 18,
    challenges: 24,
    previousRank: 1,
  },
  {
    userId: 'u1',
    userName: 'Alex Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    rank: 2,
    xp: 4240,
    level: 24,
    streak: 12,
    challenges: 18,
    previousRank: 3,
  },
  {
    userId: 'u3',
    userName: 'Taylor Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
    rank: 3,
    xp: 3100,
    level: 19,
    streak: 7,
    challenges: 12,
    previousRank: 3,
  },
  {
    userId: 'u4',
    userName: 'Morgan Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
    rank: 4,
    xp: 2850,
    level: 18,
    streak: 5,
    challenges: 10,
    previousRank: 4,
  },
  {
    userId: 'u5',
    userName: 'Casey Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
    rank: 5,
    xp: 2450,
    level: 16,
    streak: 8,
    challenges: 9,
    previousRank: 2,
  },
]

// ============================================================================
// User Settings
// ============================================================================

export const defaultUserSettings: UserSettings = {
  theme: 'dark',
  notifications: {
    enabled: true,
    dailyReminder: true,
    achievementNotifications: true,
    leaderboardUpdates: false,
  },
  privacy: {
    profilePublic: true,
    showOnLeaderboard: true,
  },
  preferences: {
    dailyGoalMinutes: 60,
    difficulty: 'medium',
    language: 'en',
  },
}

// ============================================================================
// Learning Events
// ============================================================================

export const mockLearningEvents: LearningEvent[] = [
  {
    id: 'le1',
    userId: 'u1',
    type: 'challenge_completed',
    title: 'Python Decorators Challenge',
    description: 'Completed with 92% accuracy',
    xpGained: 250,
    timestamp: new Date('2024-01-20'),
  },
  {
    id: 'le2',
    userId: 'u1',
    type: 'level_up',
    title: 'Reached Level 24',
    description: 'You advanced to Level 24!',
    xpGained: 0,
    timestamp: new Date('2024-01-18'),
  },
  {
    id: 'le3',
    userId: 'u1',
    type: 'quiz_completed',
    title: 'Completed Renaissance Art History Quiz',
    description: 'Scored 78%',
    xpGained: 180,
    timestamp: new Date('2024-01-15'),
  },
  {
    id: 'le4',
    userId: 'u1',
    type: 'flashcard_mastered',
    title: 'Mastered Leonardo da Vinci',
    description: 'Card moved to mastered',
    xpGained: 50,
    timestamp: new Date('2024-01-10'),
  },
  {
    id: 'le5',
    userId: 'u1',
    type: 'challenge_completed',
    title: 'React Hooks Challenge',
    description: 'Completed with 88% accuracy',
    xpGained: 220,
    timestamp: new Date('2024-01-05'),
  },
]
