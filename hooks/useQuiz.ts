'use client'

import { useState, useCallback } from 'react'
import { Quiz, QuizSession, QuizResult, ConfidenceLevel } from '../types'
import * as quizService from '../services/quiz.service'

interface UseQuizResult {
  quiz: Quiz | null
  session: QuizSession | null
  result: QuizResult | null
  isLoading: boolean
  error: string | null
  loadQuiz: (quizId: string) => Promise<void>
  startQuiz: (userId: string, quizId: string, challengeId: string) => Promise<void>
  submitAnswer: (questionId: string, answer: string, confidence: ConfidenceLevel, timeSpent: number) => Promise<boolean>
  completeQuiz: (timeSpent: number) => Promise<void>
}

export function useQuiz(): UseQuizResult {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [session, setSession] = useState<QuizSession | null>(null)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadQuiz = useCallback(async (quizId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const loadedQuiz = await quizService.getQuizById(quizId)
      if (!loadedQuiz) throw new Error('Quiz not found')
      setQuiz(loadedQuiz)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load quiz'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const startQuiz = useCallback(async (userId: string, quizId: string, challengeId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const newSession = await quizService.createQuizSession(userId, quizId, challengeId)
      setSession(newSession)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start quiz'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const submitAnswer = useCallback(
    async (questionId: string, answer: string, confidence: ConfidenceLevel, timeSpent: number): Promise<boolean> => {
      if (!session) throw new Error('No active session')
      try {
        setError(null)
        const { isCorrect } = await quizService.submitAnswer(session.id, questionId, answer, confidence, timeSpent)
        return isCorrect
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to submit answer'
        setError(message)
        throw err
      }
    },
    [session]
  )

  const completeQuiz = useCallback(
    async (timeSpent: number) => {
      if (!session) throw new Error('No active session')
      try {
        setIsLoading(true)
        setError(null)
        const quizResult = await quizService.completeQuizSession(session.id, timeSpent)
        setResult(quizResult)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to complete quiz'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    },
    [session]
  )

  return {
    quiz,
    session,
    result,
    isLoading,
    error,
    loadQuiz,
    startQuiz,
    submitAnswer,
    completeQuiz,
  }
}
