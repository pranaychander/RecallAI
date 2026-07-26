import {
  Quiz,
  Question,
  QuizSession,
  QuizAnswer,
  QuizResult,
  QuestionType,
  ConfidenceLevel,
} from '../types'
import { mockQuizzes, mockQuestions } from '../mock/data'
import { simulateApiCall, generateId, deepClone } from '../utils/helpers'

// ============================================================================
// Quiz Mock Database
// ============================================================================

let quizDatabase: Map<string, Quiz> = new Map(mockQuizzes.map((q) => [q.id, deepClone(q)]))
let questionDatabase: Map<string, Question> = new Map(mockQuestions.map((q) => [q.id, deepClone(q)]))
let sessionDatabase: Map<string, QuizSession> = new Map()

// ============================================================================
// Quiz Service
// ============================================================================

/**
 * Gets all quizzes for a challenge
 */
export async function getQuizzes(challengeId?: string): Promise<Quiz[]> {
  return simulateApiCall(() => {
    let quizzes = Array.from(quizDatabase.values())
    if (challengeId) {
      quizzes = quizzes.filter((q) => q.challengeId === challengeId)
    }
    return quizzes.map((q) => deepClone(q))
  }, 0)
}

/**
 * Gets quiz by ID
 */
export async function getQuizById(id: string): Promise<Quiz | null> {
  return simulateApiCall(() => {
    const quiz = quizDatabase.get(id)
    return quiz ? deepClone(quiz) : null
  }, 0)
}

/**
 * Gets a specific question by ID
 */
export async function getQuestion(questionId: string): Promise<Question | null> {
  return simulateApiCall(() => {
    const question = questionDatabase.get(questionId)
    return question ? deepClone(question) : null
  }, 0)
}

/**
 * Gets all questions for a quiz
 */
export async function getQuizQuestions(quizId: string): Promise<Question[]> {
  return simulateApiCall(() => {
    const quiz = quizDatabase.get(quizId)
    if (!quiz) return []
    return quiz.questions.map((q) => deepClone(q))
  }, 0)
}

/**
 * Creates a new quiz session
 */
export async function createQuizSession(userId: string, quizId: string, challengeId: string): Promise<QuizSession> {
  return simulateApiCall(() => {
    const quiz = quizDatabase.get(quizId)
    if (!quiz) {
      throw new Error('Quiz not found')
    }
    const session: QuizSession = {
      id: generateId(),
      userId,
      quizId,
      challengeId,
      startedAt: new Date(),
      answers: [],
      score: 0,
      timeSpentSeconds: 0,
    }
    sessionDatabase.set(session.id, session)
    return deepClone(session)
  })
}

/**
 * Gets an active quiz session
 */
export async function getQuizSession(sessionId: string): Promise<QuizSession | null> {
  return simulateApiCall(() => {
    const session = sessionDatabase.get(sessionId)
    return session ? deepClone(session) : null
  }, 0)
}

/**
 * Submits an answer to a question
 */
export async function submitAnswer(
  sessionId: string,
  questionId: string,
  answer: string,
  confidence: ConfidenceLevel,
  timeSpentSeconds: number
): Promise<{ isCorrect: boolean; explanation: string }> {
  return simulateApiCall(() => {
    const session = sessionDatabase.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }
    const question = questionDatabase.get(questionId)
    if (!question) {
      throw new Error('Question not found')
    }
    const isCorrect = checkAnswer(question, answer)
    const quizAnswer: QuizAnswer = {
      questionId,
      answer,
      confidence,
      timeSpentSeconds,
      isCorrect,
    }
    session.answers.push(quizAnswer)
    sessionDatabase.set(sessionId, session)
    return {
      isCorrect,
      explanation: question.explanation,
    }
  })
}

/**
 * Completes a quiz session and returns results
 */
export async function completeQuizSession(sessionId: string, timeSpentSeconds: number): Promise<QuizResult> {
  return simulateApiCall(() => {
    const session = sessionDatabase.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }
    const correctAnswers = session.answers.filter((a) => a.isCorrect).length
    const totalQuestions = session.answers.length
    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
    session.completedAt = new Date()
    session.score = percentage
    session.timeSpentSeconds = timeSpentSeconds
    sessionDatabase.set(sessionId, session)
    const result: QuizResult = {
      sessionId,
      score: Math.round(percentage),
      percentage: Math.round(percentage * 10) / 10,
      totalQuestions,
      correctAnswers,
      timeSpentSeconds,
      breakdown: generateBreakdown(session),
    }
    return result
  })
}

/**
 * Gets quiz results by session ID
 */
export async function getQuizResults(sessionId: string): Promise<QuizResult | null> {
  return simulateApiCall(() => {
    const session = sessionDatabase.get(sessionId)
    if (!session || !session.completedAt) return null
    const correctAnswers = session.answers.filter((a) => a.isCorrect).length
    const totalQuestions = session.answers.length
    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
    return {
      sessionId,
      score: Math.round(percentage),
      percentage: Math.round(percentage * 10) / 10,
      totalQuestions,
      correctAnswers,
      timeSpentSeconds: session.timeSpentSeconds || 0,
      breakdown: generateBreakdown(session),
    }
  }, 0)
}

/**
 * Gets user's quiz history
 */
export async function getUserQuizHistory(userId: string): Promise<QuizResult[]> {
  return simulateApiCall(() => {
    const results: QuizResult[] = []
    sessionDatabase.forEach((session) => {
      if (session.userId === userId && session.completedAt) {
        const correctAnswers = session.answers.filter((a) => a.isCorrect).length
        const totalQuestions = session.answers.length
        const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
        results.push({
          sessionId: session.id,
          score: Math.round(percentage),
          percentage: Math.round(percentage * 10) / 10,
          totalQuestions,
          correctAnswers,
          timeSpentSeconds: session.timeSpentSeconds || 0,
          breakdown: generateBreakdown(session),
        })
      }
    })
    return results
  }, 0)
}

/**
 * Creates a quiz from challenge content
 */
export async function createQuizFromChallenge(challengeId: string, title: string, questionCount: number): Promise<Quiz> {
  return simulateApiCall(() => {
    const questions: Question[] = []
    for (let i = 0; i < Math.min(questionCount, mockQuestions.length); i++) {
      const mockQuestion = mockQuestions[i % mockQuestions.length]
      const question: Question = {
        ...deepClone(mockQuestion),
        id: generateId(),
        challengeId,
      }
      questions.push(question)
      questionDatabase.set(question.id, question)
    }
    const quiz: Quiz = {
      id: generateId(),
      challengeId,
      title,
      description: `Generated quiz for ${title}`,
      questionsCount: questions.length,
      questions,
      totalTimeMinutes: Math.ceil(questions.length * 3),
      passingScore: 70,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    quizDatabase.set(quiz.id, quiz)
    return deepClone(quiz)
  }, 0.05)
}

/**
 * Gets quiz statistics
 */
export async function getQuizStats(quizId: string, userId?: string): Promise<{ averageScore: number; attemptCount: number; bestScore: number }> {
  return simulateApiCall(() => {
    let sessions = Array.from(sessionDatabase.values()).filter((s) => s.quizId === quizId && s.completedAt)
    if (userId) {
      sessions = sessions.filter((s) => s.userId === userId)
    }
    if (sessions.length === 0) {
      return { averageScore: 0, attemptCount: 0, bestScore: 0 }
    }
    const scores = sessions.map((s) => s.score)
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length
    return {
      averageScore: Math.round(averageScore),
      attemptCount: sessions.length,
      bestScore: Math.max(...scores),
    }
  }, 0)
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Checks if an answer is correct
 */
function checkAnswer(question: Question, userAnswer: string): boolean {
  const normalize = (str: string) => str.toLowerCase().trim()
  if (question.type === QuestionType.TRUE_FALSE) {
    return normalize(userAnswer) === normalize(question.correctAnswer)
  }
  if (question.type === QuestionType.MULTIPLE_CHOICE) {
    return normalize(userAnswer) === normalize(question.correctAnswer)
  }
  if (question.type === QuestionType.SHORT_ANSWER) {
    // Flexible matching for short answers
    const userWords = normalize(userAnswer).split(/\s+/)
    const correctWords = normalize(question.correctAnswer).split(/\s+/)
    const matches = userWords.filter((w) => correctWords.includes(w))
    return matches.length >= Math.ceil(correctWords.length * 0.7)
  }
  return normalize(userAnswer) === normalize(question.correctAnswer)
}

/**
 * Generates a category breakdown of quiz performance
 */
function generateBreakdown(
  session: QuizSession
): { category: string; correct: number; total: number }[] {
  const categories: Record<string, { correct: number; total: number }> = {}
  session.answers.forEach((answer) => {
    const question = questionDatabase.get(answer.questionId)
    if (question) {
      const category = question.category || 'General'
      if (!categories[category]) {
        categories[category] = { correct: 0, total: 0 }
      }
      categories[category].total++
      if (answer.isCorrect) {
        categories[category].correct++
      }
    }
  })
  return Object.entries(categories).map(([category, stats]) => ({
    category,
    ...stats,
  }))
}
