# Quick Start Guide - RecallAI Mock SaaS

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Test Accounts
The app works with any credentials in development. Try:
- Email: `alex@example.com` / Password: `password123`
- Email: `jordan@example.com` / Password: `password123`
- Or sign up with any email

## Project Structure

```
RecallAI/
├── app/                    # Next.js pages
├── components/             # React components
├── services/              # Business logic (auth, quiz, flashcard, etc)
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── mock/                  # Mock data and database
├── utils/                 # Helpers and utilities
├── styles/                # CSS and Tailwind config
└── public/                # Static assets
```

## Key Services

### Authentication
```typescript
import { useAuth } from '@/hooks'

const { user, login, signup, logout, isAuthenticated } = useAuth()
```

### Challenges
```typescript
import * as challenge from '@/services/challenge.service'

// Create from URL
await challenge.createChallengeFromUrl(userId, 'https://example.com')

// Create from PDF
await challenge.createChallengeFromPdf(userId, 'file.pdf', content)

// Create from GitHub
await challenge.createChallengeFromGithub(userId, 'https://github.com/user/repo')

// Create from YouTube
await challenge.createChallengeFromYoutube(userId, 'https://youtube.com/watch?v=...')
```

### Quizzes
```typescript
import * as quiz from '@/services/quiz.service'

// Start quiz
const session = await quiz.createQuizSession(userId, quizId, challengeId)

// Submit answer
const { isCorrect, explanation } = await quiz.submitAnswer(
  sessionId,
  questionId,
  userAnswer,
  confidenceLevel,
  timeSpent
)

// Complete quiz
const result = await quiz.completeQuizSession(sessionId, totalTimeSpent)
```

### Flashcards
```typescript
import * as flashcard from '@/services/flashcard.service'

// Get flashcards
const cards = await flashcard.getFlashcards(userId)

// Get due cards
const dueCards = await flashcard.getDueFlashcards(userId)

// Review card (spaced repetition)
await flashcard.reviewFlashcard(userId, cardId, quality) // quality: 0-5

// Mark as known
await flashcard.markAsKnown(userId, cardId)

// Mark as difficult
await flashcard.markAsDifficult(userId, cardId)
```

### Knowledge Graph
```typescript
import * as knowledge from '@/services/knowledge.service'

// Get knowledge graph
const graph = await knowledge.getKnowledgeGraph(userId)

// Get learning recommendations
const recommendations = await knowledge.generatePracticeRecommendations(userId)

// Get learning path
const path = await knowledge.getLearningPath(userId, startNodeId, endNodeId)
```

### Leaderboard
```typescript
import * as leaderboard from '@/services/leaderboard.service'

// Global leaderboard
const global = await leaderboard.getGlobalLeaderboard(20, 0)

// Friends leaderboard
const friends = await leaderboard.getFriendsLeaderboard(userId)

// Weekly leaderboard
const weekly = await leaderboard.getWeeklyLeaderboard(20)

// User rank
const { entries, userEntry } = await leaderboard.getUserRank(userId)
```

### Notifications
```typescript
import * as notification from '@/services/notification.service'

// Get notifications
const notifs = await notification.getNotifications(userId)

// Get unread count
const count = await notification.getUnreadCount(userId)

// Mark as read
await notification.markAsRead(userId, notificationId)
```

### AI Tutor
```typescript
import * as tutor from '@/services/tutor.service'

// Create session
const session = await tutor.createTutorSession(userId, topicId)

// Send message
const response = await tutor.sendMessage(sessionId, userMessage)
// response includes: content, followUpSuggestions
```

## Component Usage Example

```typescript
'use client'

import { useAuth } from '@/hooks'
import { useEffect, useState } from 'react'
import * as quizService from '@/services/quiz.service'

export default function QuizPage() {
  const { user } = useAuth()
  const [quiz, setQuiz] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadQuiz = async () => {
      const loaded = await quizService.getQuizById('quiz1')
      setQuiz(loaded)
      setIsLoading(false)
    }
    loadQuiz()
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (!quiz) return <div>Quiz not found</div>

  return (
    <div>
      <h1>{quiz.title}</h1>
      <p>{quiz.description}</p>
      {/* Render quiz UI */}
    </div>
  )
}
```

## Simulated Features

All services include:
- **Realistic API latency**: 500-1500ms delay
- **Random failures**: 5% chance (test retry logic)
- **Error messages**: Realistic error descriptions
- **localStorage**: Session persistence

## Mock Data Available

The app comes with realistic mock data:
- **5 Users** with different levels and streaks
- **4 Challenges** across different categories
- **Multiple Quizzes** with 50+ questions
- **20 Flashcards** with spaced repetition state
- **6 Knowledge Nodes** with prerequisites
- **5 Achievements** to unlock
- **4 Notifications** to receive
- **5 Leaderboard entries**

## Spaced Repetition (SM-2 Algorithm)

Flashcards use the SM-2 algorithm:
```typescript
// Quality: 0 (complete blackout) to 5 (perfect response)
await flashcard.reviewFlashcard(userId, cardId, quality)

// Quality mapping:
// 0-2: Difficult - resets progress
// 3: Passing - continues with longer interval
// 4-5: Easy - accelerates to mastery
```

## Development Tips

### Type Safety
```bash
npm run type-check  # Check all TypeScript errors
```

### Linting
```bash
npm run lint        # Run ESLint
npm run lint:fix    # Auto-fix issues
```

### Formatting
```bash
npm run format      # Format all files
```

### Building
```bash
npm run build       # Build for production
npm start           # Start production server
```

## Extending the App

### Add a New Service

1. Create `/services/myfeature.service.ts`
2. Define types in `/types/index.ts`
3. Add mock data in `/mock/data.ts`
4. Export from `/services/index.ts`

Example:
```typescript
// services/rating.service.ts
import { simulateApiCall } from '../utils/helpers'

export async function rateChallenge(userId: string, challengeId: string, rating: number): Promise<{ success: boolean }> {
  return simulateApiCall(() => {
    // Implement rating logic
    return { success: true }
  })
}
```

### Add a New Hook

```typescript
// hooks/useRating.ts
'use client'
import { useState } from 'react'
import * as ratingService from '../services/rating.service'

export function useRating() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitRating = async (userId: string, challengeId: string, rating: number) => {
    try {
      setIsLoading(true)
      await ratingService.rateChallenge(userId, challengeId, rating)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rate')
    } finally {
      setIsLoading(false)
    }
  }

  return { submitRating, isLoading, error }
}
```

## Migration to Real Backend

When ready to use a real backend:

1. Create an API client in `utils/api.ts`
2. Update service functions to call real API
3. **No component changes required**

Example migration:
```typescript
// Before
export async function getQuizzes(challengeId?: string): Promise<Quiz[]> {
  return simulateApiCall(() => mockQuizzes)
}

// After
export async function getQuizzes(challengeId?: string): Promise<Quiz[]> {
  const response = await fetch(`/api/quizzes?challengeId=${challengeId}`)
  return response.json()
}
```

## Troubleshooting

### Components not updating?
- Check if using `'use client'` directive for client components
- Ensure useState/useEffect are in client components
- Use proper dependency arrays in useEffect

### Services returning null?
- Check userId is correct
- Verify data was added to mock database
- Check localStorage for auth tokens

### TypeScript errors?
- Run `npm run type-check`
- Check all prop types are defined
- Use strict null checks

## Performance

- **First load**: ~2 seconds (mock data + simulation)
- **Subsequent operations**: Instant (in-memory)
- **Simulated latency**: 500-1500ms per operation
- **No network requests**: All local

## Security Notes

This is a mock application for development only:
- No real authentication (localStorage stores unencrypted data)
- No real data protection
- For production, implement proper backend security

## Support

- Check `ARCHITECTURE.md` for detailed architecture
- Review service documentation in `/services`
- Check types in `/types/index.ts`
- Explore mock data in `/mock/data.ts`

---

**Ready to build? Start by checking out the services available in `/services`!**
