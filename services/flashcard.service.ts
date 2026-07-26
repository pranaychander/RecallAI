import { Flashcard, CardStatus, FlashcardReview } from '../types'
import { mockFlashcards } from '../mock/data'
import { simulateApiCall, generateId, deepClone } from '../utils/helpers'

// ============================================================================
// Flashcard Mock Database
// ============================================================================

let flashcardDatabase: Map<string, Flashcard> = new Map(mockFlashcards.map((f) => [f.id, deepClone(f)]))
let reviewDatabase: Map<string, FlashcardReview> = new Map()

// ============================================================================
// Spaced Repetition Algorithm (SM-2)
// ============================================================================

interface SpacedRepetitionResult {
  easeFactor: number
  interval: number
  nextReviewAt: Date
}

/**
 * Implements SM-2 spaced repetition algorithm
 * quality: 0-5 (0=complete blackout, 5=perfect response)
 */
function calculateNextReview(easeFactor: number, interval: number, quality: number, repetitions: number): SpacedRepetitionResult {
  let newEaseFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  let newInterval: number
  if (quality < 3) {
    newInterval = 1
  } else if (repetitions === 0) {
    newInterval = 1
  } else if (repetitions === 1) {
    newInterval = 3
  } else {
    newInterval = Math.round(interval * newEaseFactor)
  }
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval)
  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    nextReviewAt: nextReviewDate,
  }
}

// ============================================================================
// Flashcard Service
// ============================================================================

/**
 * Gets all flashcards for a user
 */
export async function getFlashcards(userId: string, filters?: { status?: CardStatus; challengeId?: string }): Promise<Flashcard[]> {
  return simulateApiCall(() => {
    let cards = Array.from(flashcardDatabase.values()).filter((f) => f.userId === userId)
    if (filters?.status) {
      cards = cards.filter((f) => f.status === filters.status)
    }
    if (filters?.challengeId) {
      cards = cards.filter((f) => f.challengeId === filters.challengeId)
    }
    return cards.map((c) => deepClone(c))
  }, 0)
}

/**
 * Gets flashcard by ID
 */
export async function getFlashcardById(id: string): Promise<Flashcard | null> {
  return simulateApiCall(() => {
    const card = flashcardDatabase.get(id)
    return card ? deepClone(card) : null
  }, 0)
}

/**
 * Gets due flashcards for today
 */
export async function getDueFlashcards(userId: string): Promise<Flashcard[]> {
  return simulateApiCall(() => {
    const now = new Date()
    const cards = Array.from(flashcardDatabase.values())
      .filter((f) => f.userId === userId && f.nextReviewAt <= now)
      .sort((a, b) => a.nextReviewAt.getTime() - b.nextReviewAt.getTime())
    return cards.map((c) => deepClone(c))
  }, 0)
}

/**
 * Gets completed flashcards for today
 */
export async function getTodayCompletedFlashcards(userId: string): Promise<Flashcard[]> {
  return simulateApiCall(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const completedCards: Flashcard[] = []
    reviewDatabase.forEach((review) => {
      if (review.reviewedAt >= today && review.reviewedAt < tomorrow) {
        const card = flashcardDatabase.get(review.flashcardId)
        if (card && card.userId === userId) {
          completedCards.push(deepClone(card))
        }
      }
    })
    return completedCards
  }, 0)
}

/**
 * Creates a new flashcard
 */
export async function createFlashcard(
  userId: string,
  front: string,
  back: string,
  category: string,
  difficulty: 'easy' | 'medium' | 'hard',
  challengeId?: string
): Promise<Flashcard> {
  return simulateApiCall(() => {
    const now = new Date()
    const card: Flashcard = {
      id: generateId(),
      userId,
      challengeId,
      front,
      back,
      category,
      difficulty,
      status: CardStatus.NEW,
      createdAt: now,
      updatedAt: now,
      nextReviewAt: now,
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
    }
    flashcardDatabase.set(card.id, card)
    return deepClone(card)
  }, 0.05)
}

/**
 * Creates multiple flashcards at once
 */
export async function createFlashcardBatch(
  userId: string,
  cards: Array<{
    front: string
    back: string
    category: string
    difficulty: 'easy' | 'medium' | 'hard'
    challengeId?: string
  }>
): Promise<Flashcard[]> {
  return simulateApiCall(() => {
    const created: Flashcard[] = []
    cards.forEach((card) => {
      const now = new Date()
      const newCard: Flashcard = {
        id: generateId(),
        userId,
        challengeId: card.challengeId,
        front: card.front,
        back: card.back,
        category: card.category,
        difficulty: card.difficulty,
        status: CardStatus.NEW,
        createdAt: now,
        updatedAt: now,
        nextReviewAt: now,
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
      }
      flashcardDatabase.set(newCard.id, newCard)
      created.push(deepClone(newCard))
    })
    return created
  }, 0.08)
}

/**
 * Updates a flashcard
 */
export async function updateFlashcard(userId: string, cardId: string, updates: Partial<Flashcard>): Promise<Flashcard> {
  return simulateApiCall(() => {
    const card = flashcardDatabase.get(cardId)
    if (!card) {
      throw new Error('Flashcard not found')
    }
    if (card.userId !== userId) {
      throw new Error('Unauthorized')
    }
    const updated = { ...card, ...updates, id: card.id, userId: card.userId, createdAt: card.createdAt }
    updated.updatedAt = new Date()
    flashcardDatabase.set(cardId, updated)
    return deepClone(updated)
  })
}

/**
 * Reviews a flashcard and updates its schedule
 */
export async function reviewFlashcard(userId: string, cardId: string, quality: number): Promise<FlashcardReview> {
  return simulateApiCall(() => {
    const card = flashcardDatabase.get(cardId)
    if (!card) {
      throw new Error('Flashcard not found')
    }
    if (card.userId !== userId) {
      throw new Error('Unauthorized')
    }
    const { easeFactor, interval, nextReviewAt } = calculateNextReview(card.easeFactor, card.interval, quality, card.repetitions)
    card.easeFactor = easeFactor
    card.interval = interval
    card.nextReviewAt = nextReviewAt
    card.repetitions++
    // Update status based on quality
    if (quality >= 4) {
      card.status = card.repetitions > 8 ? CardStatus.MASTERED : CardStatus.REVIEW
    } else if (quality >= 3) {
      card.status = CardStatus.LEARNING
    } else {
      card.status = CardStatus.NEW
    }
    card.updatedAt = new Date()
    flashcardDatabase.set(cardId, card)
    const review: FlashcardReview = {
      id: generateId(),
      flashcardId: cardId,
      userId,
      quality,
      ease: easeFactor,
      interval,
      nextReviewAt,
      reviewedAt: new Date(),
    }
    reviewDatabase.set(review.id, review)
    return review
  })
}

/**
 * Marks a flashcard as known (moves to mastered)
 */
export async function markAsKnown(userId: string, cardId: string): Promise<Flashcard> {
  return simulateApiCall(() => {
    const card = flashcardDatabase.get(cardId)
    if (!card) {
      throw new Error('Flashcard not found')
    }
    if (card.userId !== userId) {
      throw new Error('Unauthorized')
    }
    card.status = CardStatus.MASTERED
    card.repetitions = 10
    card.easeFactor = 2.8
    card.interval = 30
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    card.nextReviewAt = futureDate
    card.updatedAt = new Date()
    flashcardDatabase.set(cardId, card)
    const review: FlashcardReview = {
      id: generateId(),
      flashcardId: cardId,
      userId,
      quality: 5,
      ease: card.easeFactor,
      interval: card.interval,
      nextReviewAt: card.nextReviewAt,
      reviewedAt: new Date(),
    }
    reviewDatabase.set(review.id, review)
    return deepClone(card)
  })
}

/**
 * Marks a flashcard as difficult (resets progress)
 */
export async function markAsDifficult(userId: string, cardId: string): Promise<Flashcard> {
  return simulateApiCall(() => {
    const card = flashcardDatabase.get(cardId)
    if (!card) {
      throw new Error('Flashcard not found')
    }
    if (card.userId !== userId) {
      throw new Error('Unauthorized')
    }
    card.status = CardStatus.NEW
    card.easeFactor = Math.max(1.3, card.easeFactor - 0.2)
    card.interval = 1
    card.nextReviewAt = new Date()
    card.updatedAt = new Date()
    flashcardDatabase.set(cardId, card)
    const review: FlashcardReview = {
      id: generateId(),
      flashcardId: cardId,
      userId,
      quality: 1,
      ease: card.easeFactor,
      interval: 1,
      nextReviewAt: card.nextReviewAt,
      reviewedAt: new Date(),
    }
    reviewDatabase.set(review.id, review)
    return deepClone(card)
  })
}

/**
 * Deletes a flashcard
 */
export async function deleteFlashcard(userId: string, cardId: string): Promise<void> {
  return simulateApiCall(() => {
    const card = flashcardDatabase.get(cardId)
    if (!card) {
      throw new Error('Flashcard not found')
    }
    if (card.userId !== userId) {
      throw new Error('Unauthorized')
    }
    flashcardDatabase.delete(cardId)
  })
}

/**
 * Searches flashcards by content
 */
export async function searchFlashcards(userId: string, query: string): Promise<Flashcard[]> {
  return simulateApiCall(() => {
    const lowerQuery = query.toLowerCase()
    const cards = Array.from(flashcardDatabase.values()).filter(
      (f) => f.userId === userId && (f.front.toLowerCase().includes(lowerQuery) || f.back.toLowerCase().includes(lowerQuery))
    )
    return cards.map((c) => deepClone(c))
  }, 0)
}

/**
 * Gets flashcard statistics
 */
export async function getFlashcardStats(userId: string): Promise<{
  total: number
  new: number
  learning: number
  review: number
  mastered: number
  dueToday: number
}> {
  return simulateApiCall(() => {
    const cards = Array.from(flashcardDatabase.values()).filter((f) => f.userId === userId)
    const now = new Date()
    return {
      total: cards.length,
      new: cards.filter((c) => c.status === CardStatus.NEW).length,
      learning: cards.filter((c) => c.status === CardStatus.LEARNING).length,
      review: cards.filter((c) => c.status === CardStatus.REVIEW).length,
      mastered: cards.filter((c) => c.status === CardStatus.MASTERED).length,
      dueToday: cards.filter((c) => c.nextReviewAt <= now).length,
    }
  }, 0)
}
