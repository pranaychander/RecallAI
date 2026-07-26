import { Challenge, ChallengeSourceType, ChallengeStatus, LearningItem } from '../types'
import { mockChallenges, recentLearning as mockRecentLearning } from '../mock/data'
import { simulateApiCall, generateId, deepClone } from '../utils/helpers'

// ============================================================================
// Challenge Mock Database
// ============================================================================

let challengeDatabase: Map<string, Challenge> = new Map(mockChallenges.map((c) => [c.id, deepClone(c)]))

// ============================================================================
// Challenge Service
// ============================================================================

/**
 * Gets all challenges for a user
 */
export async function getChallenges(userId?: string): Promise<LearningItem[]> {
  return simulateApiCall(() => deepClone(mockRecentLearning), 0)
}

/**
 * Gets challenge by ID
 */
export async function getChallengeById(id: string): Promise<Challenge | null> {
  return simulateApiCall(() => {
    const challenge = challengeDatabase.get(id)
    return challenge ? deepClone(challenge) : null
  }, 0)
}

/**
 * Gets all challenges with optional filtering
 */
export async function getAllChallenges(userId: string, filters?: { status?: ChallengeStatus; category?: string }): Promise<Challenge[]> {
  return simulateApiCall(() => {
    let challenges = Array.from(challengeDatabase.values()).filter((c) => c.userId === userId)
    if (filters?.status) {
      challenges = challenges.filter((c) => c.status === filters.status)
    }
    if (filters?.category) {
      challenges = challenges.filter((c) => c.category === filters.category)
    }
    return challenges.map((c) => deepClone(c))
  }, 0)
}

/**
 * Creates a challenge from URL
 */
export async function createChallengeFromUrl(userId: string, url: string, title?: string): Promise<Challenge> {
  return simulateApiCall(() => {
    const challenge: Challenge = {
      id: generateId(),
      userId,
      title: title || `Challenge from ${new URL(url).hostname}`,
      description: 'Extracting content from URL...',
      sourceType: ChallengeSourceType.URL,
      sourceUrl: url,
      content: generateMockContent(`Content from: ${url}`),
      summary: 'Learning from URL content has been extracted and summarized.',
      difficulty: 'medium',
      category: 'Web Research',
      status: ChallengeStatus.READY,
      createdAt: new Date(),
      updatedAt: new Date(),
      questionsCount: Math.floor(Math.random() * 10) + 8,
    }
    challengeDatabase.set(challenge.id, challenge)
    return deepClone(challenge)
  }, 0.05)
}

/**
 * Creates a challenge from PDF upload
 */
export async function createChallengeFromPdf(userId: string, fileName: string, content: string): Promise<Challenge> {
  return simulateApiCall(() => {
    const title = fileName.replace(/\.pdf$/i, '')
    const challenge: Challenge = {
      id: generateId(),
      userId,
      title,
      description: `Extracted from PDF: ${fileName}`,
      sourceType: ChallengeSourceType.PDF,
      content: generateMockContent(content || `Content from: ${fileName}`),
      summary: 'PDF content has been processed and summarized.',
      difficulty: 'medium',
      category: 'Document Learning',
      status: ChallengeStatus.READY,
      createdAt: new Date(),
      updatedAt: new Date(),
      questionsCount: Math.floor(Math.random() * 12) + 10,
    }
    challengeDatabase.set(challenge.id, challenge)
    return deepClone(challenge)
  }, 0.05)
}

/**
 * Creates a challenge from GitHub repository
 */
export async function createChallengeFromGithub(userId: string, repoUrl: string, topic?: string): Promise<Challenge> {
  return simulateApiCall(() => {
    const repoName = repoUrl.split('/').pop() || 'GitHub Repository'
    const challenge: Challenge = {
      id: generateId(),
      userId,
      title: `Learning from ${repoName}`,
      description: `Extracted from GitHub repository: ${repoUrl}`,
      sourceType: ChallengeSourceType.GITHUB,
      sourceUrl: repoUrl,
      content: generateMockContent(`Repository: ${repoUrl}\nTopic: ${topic || 'General'}`),
      summary: 'Repository documentation and code patterns have been analyzed.',
      difficulty: topic?.includes('advanced') ? 'hard' : 'medium',
      category: 'Programming',
      status: ChallengeStatus.READY,
      createdAt: new Date(),
      updatedAt: new Date(),
      questionsCount: Math.floor(Math.random() * 15) + 12,
    }
    challengeDatabase.set(challenge.id, challenge)
    return deepClone(challenge)
  }, 0.08)
}

/**
 * Creates a challenge from YouTube video
 */
export async function createChallengeFromYoutube(userId: string, videoUrl: string, title?: string): Promise<Challenge> {
  return simulateApiCall(() => {
    const videoId = extractYoutubeId(videoUrl)
    const challenge: Challenge = {
      id: generateId(),
      userId,
      title: title || `Video Learning - ${videoId}`,
      description: `Extracted from YouTube video: ${videoUrl}`,
      sourceType: ChallengeSourceType.YOUTUBE,
      sourceUrl: videoUrl,
      content: generateMockContent(`Video transcript and key points from: ${videoUrl}`),
      summary: 'Video transcript has been processed into learning material.',
      difficulty: 'medium',
      category: 'Video Learning',
      status: ChallengeStatus.READY,
      createdAt: new Date(),
      updatedAt: new Date(),
      questionsCount: Math.floor(Math.random() * 8) + 6,
    }
    challengeDatabase.set(challenge.id, challenge)
    return deepClone(challenge)
  }, 0.1)
}

/**
 * Creates a manual challenge
 */
export async function createManualChallenge(userId: string, title: string, description: string, content: string, category: string): Promise<Challenge> {
  return simulateApiCall(() => {
    const challenge: Challenge = {
      id: generateId(),
      userId,
      title,
      description,
      sourceType: ChallengeSourceType.MANUAL,
      content,
      summary: `Summary of: ${title}`,
      difficulty: 'medium',
      category,
      status: ChallengeStatus.READY,
      createdAt: new Date(),
      updatedAt: new Date(),
      questionsCount: Math.floor(Math.random() * 8) + 5,
    }
    challengeDatabase.set(challenge.id, challenge)
    return deepClone(challenge)
  }, 0.05)
}

/**
 * Updates a challenge
 */
export async function updateChallenge(userId: string, challengeId: string, updates: Partial<Challenge>): Promise<Challenge> {
  return simulateApiCall(() => {
    const challenge = challengeDatabase.get(challengeId)
    if (!challenge) {
      throw new Error('Challenge not found')
    }
    if (challenge.userId !== userId) {
      throw new Error('Unauthorized')
    }
    const updated = { ...challenge, ...updates, id: challenge.id, userId: challenge.userId, createdAt: challenge.createdAt }
    updated.updatedAt = new Date()
    challengeDatabase.set(challengeId, updated)
    return deepClone(updated)
  })
}

/**
 * Deletes a challenge
 */
export async function deleteChallenge(userId: string, challengeId: string): Promise<void> {
  return simulateApiCall(() => {
    const challenge = challengeDatabase.get(challengeId)
    if (!challenge) {
      throw new Error('Challenge not found')
    }
    if (challenge.userId !== userId) {
      throw new Error('Unauthorized')
    }
    challengeDatabase.delete(challengeId)
  })
}

/**
 * Marks a challenge as completed
 */
export async function completeChallenge(userId: string, challengeId: string, timeSpentSeconds: number, score: number): Promise<Challenge> {
  return simulateApiCall(() => {
    const challenge = challengeDatabase.get(challengeId)
    if (!challenge) {
      throw new Error('Challenge not found')
    }
    const completed = deepClone(challenge)
    completed.status = ChallengeStatus.COMPLETED
    completed.completedAt = new Date()
    completed.timeSpentSeconds = timeSpentSeconds
    completed.averageScore = score
    challengeDatabase.set(challengeId, completed)
    return deepClone(completed)
  })
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Generates mock content based on source
 */
function generateMockContent(source: string): string {
  return `
    Content extracted from: ${source}
    
    This is mock content that simulates the extraction of learning material.
    In production, this would contain actual extracted text, code, or transcript.
    
    Key Topics:
    - Concept 1: Advanced understanding of the subject matter
    - Concept 2: Practical applications and use cases
    - Concept 3: Best practices and common pitfalls
    - Concept 4: Advanced techniques and optimization
    - Concept 5: Real-world examples and case studies
    
    The content would be further processed into quiz questions,
    flashcards, and interactive learning modules.
  `.trim()
}

/**
 * Extracts YouTube video ID from URL
 */
function extractYoutubeId(url: string): string {
  const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/, /(?:youtube\.com\/embed\/)([^&\n?#]+)/]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return url
}
