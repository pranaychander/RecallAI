import { ChatMessage, TutorSession } from '../types'
import { simulateApiCall, generateId, deepClone } from '../utils/helpers'

// ============================================================================
// Tutor Mock Database
// ============================================================================

let tutorSessionDatabase: Map<string, TutorSession> = new Map()

// ============================================================================
// Mock AI Responses
// ============================================================================

const mockAiResponses: Record<string, string[]> = {
  default: [
    "That's a great question! Let me break this down for you. Think about the fundamental principles...",
    "Excellent observation. This relates to a key concept. Consider the relationship between...",
    "You're on the right track! Here's how we can deepen your understanding...",
  ],
  coding: [
    "This is a common pattern in programming. Let me explain the syntax and logic behind it.",
    "Great question about that language feature! Here's how it works in practice...",
    "You can solve this using several approaches. The most efficient pattern is...",
  ],
  history: [
    "This historical event had significant consequences. The context was important because...",
    "That's an interesting historical parallel. Let me explain the connections...",
    "This period shaped modern society in several ways. Here's the broader context...",
  ],
  science: [
    "Excellent scientific question! The underlying mechanism involves...",
    "You're asking about a fundamental principle in science. Here's how it works...",
    "This concept connects several scientific principles. Let me explain the relationships...",
  ],
}

const mockFollowUpSuggestions: Record<string, string[]> = {
  default: [
    'Can you give me an example?',
    'How does this apply in practice?',
    'What are the exceptions to this rule?',
    'Can you dive deeper into this concept?',
  ],
  coding: [
    'Can you show me the code implementation?',
    'What are the performance implications?',
    'How does this work with other frameworks?',
    'What are common pitfalls with this pattern?',
  ],
  history: [
    'What were the long-term consequences?',
    'Who were the key figures involved?',
    'How does this compare to other periods?',
    'What sources document this event?',
  ],
  science: [
    'Can you explain the mechanism?',
    'What are real-world applications?',
    'How was this discovered?',
    'What are current research developments?',
  ],
}

// ============================================================================
// Tutor Service
// ============================================================================

/**
 * Creates a new tutor session
 */
export async function createTutorSession(userId: string, topicId: string): Promise<TutorSession> {
  return simulateApiCall(() => {
    const session: TutorSession = {
      id: generateId(),
      userId,
      topicId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    tutorSessionDatabase.set(session.id, session)
    return deepClone(session)
  })
}

/**
 * Gets a tutor session
 */
export async function getTutorSession(sessionId: string): Promise<TutorSession | null> {
  return simulateApiCall(() => {
    const session = tutorSessionDatabase.get(sessionId)
    return session ? deepClone(session) : null
  }, 0)
}

/**
 * Sends a message to the tutor
 */
export async function sendMessage(sessionId: string, userMessage: string): Promise<ChatMessage> {
  return simulateApiCall(async () => {
    const session = tutorSessionDatabase.get(sessionId)
    if (!session) {
      throw new Error('Session not found')
    }
    // Add user message
    const userChatMessage: ChatMessage = {
      id: generateId(),
      content: userMessage,
      sender: 'user',
      timestamp: new Date(),
    }
    session.messages.push(userChatMessage)
    // Generate AI response
    const category = detectCategory(userMessage)
    const responses = mockAiResponses[category] || mockAiResponses.default
    const aiResponse = responses[Math.floor(Math.random() * responses.length)]
    const followUpSuggestions = (mockFollowUpSuggestions[category] || mockFollowUpSuggestions.default).slice(
      0,
      Math.floor(Math.random() * 2) + 2
    )
    const aiMessage: ChatMessage = {
      id: generateId(),
      content: aiResponse,
      sender: 'ai',
      timestamp: new Date(),
      followUpSuggestions,
    }
    session.messages.push(aiMessage)
    session.updatedAt = new Date()
    tutorSessionDatabase.set(sessionId, session)
    return deepClone(aiMessage)
  }, 0.05)
}

/**
 * Gets all messages in a session
 */
export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  return simulateApiCall(() => {
    const session = tutorSessionDatabase.get(sessionId)
    if (!session) return []
    return deepClone(session.messages)
  }, 0)
}

/**
 * Generates practice questions based on the topic
 */
export async function generatePracticeQuestions(topicId: string): Promise<string[]> {
  return simulateApiCall(() => {
    const questions = [
      `Can you explain a practical application of ${topicId}?`,
      `What are the key concepts in ${topicId}?`,
      `How would you approach learning ${topicId}?`,
      `What are common misconceptions about ${topicId}?`,
      `Can you describe the historical context of ${topicId}?`,
    ]
    return questions.map((q) => q.replace(topicId, '[Topic]'))
  }, 0)
}

/**
 * Gets user's tutor sessions
 */
export async function getUserTutorSessions(userId: string): Promise<TutorSession[]> {
  return simulateApiCall(() => {
    const sessions = Array.from(tutorSessionDatabase.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    return sessions.map((s) => deepClone(s))
  }, 0)
}

/**
 * Closes a tutor session
 */
export async function closeTutorSession(sessionId: string): Promise<void> {
  return simulateApiCall(() => {
    tutorSessionDatabase.delete(sessionId)
  })
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Detects the category of the user's message
 */
function detectCategory(message: string): string {
  const lowerMessage = message.toLowerCase()
  if (lowerMessage.match(/code|programming|javascript|python|function|class|variable|syntax|algorithm/)) {
    return 'coding'
  }
  if (lowerMessage.match(/history|war|revolution|ancient|era|period|century|historical/)) {
    return 'history'
  }
  if (lowerMessage.match(/science|physics|chemistry|biology|experiment|atom|molecule|reaction/)) {
    return 'science'
  }
  return 'default'
}
