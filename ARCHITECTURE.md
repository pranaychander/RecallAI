# RecallAI - Production-Ready Mock SaaS Architecture

This document outlines the complete architecture of the RecallAI mock application, designed for easy migration to production backends.

## Overview

The application follows a clean, layered architecture that separates concerns and enables backend independence:

```
┌─────────────────────────────────────┐
│   React Components (UI Layer)       │
├─────────────────────────────────────┤
│   Custom Hooks (State Management)   │
├─────────────────────────────────────┤
│   Services (Business Logic)         │
├─────────────────────────────────────┤
│   Mock Repositories (Data Access)   │
├─────────────────────────────────────┤
│   Mock Data & Database Simulation   │
└─────────────────────────────────────┘
```

## Architecture Layers

### 1. UI Components (`/components`)
- Pure, reusable React components
- No direct API calls
- No business logic
- Props-based data flow

### 2. Custom Hooks (`/hooks`)
- `useAuth`: Manages authentication state and operations
- `useFetchAsync`: Generic async data fetching with retry logic
- `useQuiz`: Quiz-specific state management

**Usage Pattern:**
```typescript
const { user, login, logout } = useAuth()
const { data, isLoading, error, refetch } = useFetchAsync(() => getChallenges('u1'))
```

### 3. Services (`/services`)

Each service encapsulates business logic and API interactions:

- **auth.service.ts**: Authentication, user management, localStorage persistence
- **challenge.service.ts**: Challenge CRUD, content import (URL, PDF, GitHub, YouTube)
- **quiz.service.ts**: Quiz sessions, questions, scoring, results
- **flashcard.service.ts**: Spaced repetition (SM-2 algorithm), flashcard CRUD
- **knowledge.service.ts**: Knowledge graph, node management, learning paths
- **leaderboard.service.ts**: Global/friends/weekly/monthly rankings
- **profile.service.ts**: User profile, stats, achievements, learning timeline
- **tutor.service.ts**: AI tutor sessions, mock responses, follow-up suggestions
- **notification.service.ts**: All notification types
- **upload.service.ts**: File uploads and imports

**Key Service Features:**
- Simulated API latency (500-1500ms)
- 5% random failure rate
- Realistic error messages
- Full type safety with TypeScript
- Promise-based interface

**Service Usage:**
```typescript
// All services are async
const user = await getCurrentUser()
const quiz = await createQuizSession(userId, quizId, challengeId)
const flashcards = await getFlashcards(userId, { status: CardStatus.DUE })
```

### 4. Mock Repositories
Embedded within each service, these simulate database operations:

- In-memory databases using `Map<string, Entity>`
- CRUD operations with validation
- Relationship management
- Referential integrity checks
- Realistic mock data initialization

### 5. Mock Data (`/mock/data.ts`)
- Realistic datasets for all entities
- Multiple user accounts (u1, u2, u3, u4, u5)
- Complete challenge library
- Quiz questions with explanations
- Flashcard collections
- Knowledge graph with prerequisites
- Achievement definitions
- Notification templates

## Data Flow Example: Taking a Quiz

```
1. Component calls useQuiz()
2. useQuiz calls quizService.createQuizSession()
3. Service validates and creates session in mock DB
4. Service returns session to hook
5. Hook updates state
6. Component re-renders with session data
7. User submits answer
8. Component calls submitAnswer()
9. Hook calls quizService.submitAnswer()
10. Service checks answer correctness and returns result
11. Service updates session in mock DB
```

## Authentication & Session Persistence

The authentication system uses localStorage for session persistence:

```typescript
// Login stores user and token
localStorage.setItem('recallai_user', JSON.stringify(user))
localStorage.setItem('recallai_token', token)

// Logout clears session
localStorage.removeItem('recallai_user')
localStorage.removeItem('recallai_token')

// getCurrentUser() restores session on page reload
```

## Type Safety

All types are defined in `/types/index.ts`:

- User management types
- Challenge and quiz types
- Flashcard and spaced repetition types
- Knowledge graph types
- Achievement and notification types
- API response wrappers

**Strict TypeScript mode** ensures type safety throughout the application.

## Error Handling

All services implement consistent error handling:

```typescript
try {
  const result = await service.operation()
  // Handle success
} catch (error) {
  // Error contains realistic message
  // Retry logic available in hooks
}
```

## Simulated Features

### API Latency
- Random delay between 500-1500ms
- Simulates network conditions
- Configurable per operation

### Random Failures
- 5% failure rate (configurable)
- Realistic error messages
- Enables retry testing

### Content Extraction
- URL parsing and mock content generation
- PDF text simulation
- GitHub repository analysis
- YouTube transcript extraction

## Migration to Real Backend

To migrate to a real backend, replace the service implementations **only**. The architecture ensures minimal changes:

### Step 1: Create API Client
```typescript
// utils/api.ts
const apiClient = {
  get: async (url: string) => { /* fetch implementation */ },
  post: async (url: string, data: any) => { /* fetch implementation */ },
}
```

### Step 2: Update Service
```typescript
// Before (mock)
export async function getQuizzes(challengeId?: string): Promise<Quiz[]> {
  return simulateApiCall(() => quizzes.map(q => deepClone(q)), 0)
}

// After (real API)
export async function getQuizzes(challengeId?: string): Promise<Quiz[]> {
  const response = await apiClient.get(`/api/quizzes?challengeId=${challengeId}`)
  return response.data
}
```

### Step 3: No Component Changes Required
All components continue working with the same service interface.

## Supported Real Backends

The architecture is backend-agnostic. Recommended options:

### REST APIs
- NestJS
- Express
- FastAPI
- Django REST Framework

### Headless CMS
- Supabase (PostgreSQL + Auth)
- Firebase (Realtime DB + Auth)
- Hasura (GraphQL)

### GraphQL
- Apollo Server
- PostGraphile
- Hasura

## Database Schema Reference

### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR,
  email VARCHAR UNIQUE,
  avatar VARCHAR,
  level INTEGER,
  streak INTEGER,
  xp INTEGER,
  joined_at TIMESTAMP,
  last_active TIMESTAMP
)
```

### Challenges
```sql
CREATE TABLE challenges (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  title VARCHAR,
  description TEXT,
  source_type ENUM('url', 'pdf', 'github', 'youtube', 'manual'),
  content TEXT,
  summary TEXT,
  status ENUM('draft', 'processing', 'ready', 'completed'),
  created_at TIMESTAMP
)
```

### Quizzes & Questions
```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY,
  challenge_id UUID REFERENCES challenges,
  title VARCHAR,
  description TEXT,
  total_time_minutes INTEGER,
  created_at TIMESTAMP
)

CREATE TABLE questions (
  id UUID PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes,
  text TEXT,
  type ENUM('multiple_choice', 'true_false', 'short_answer', 'fill_blank'),
  correct_answer VARCHAR,
  explanation TEXT
)
```

### Flashcards
```sql
CREATE TABLE flashcards (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  front TEXT,
  back TEXT,
  status ENUM('new', 'learning', 'review', 'mastered'),
  ease_factor FLOAT,
  interval INTEGER,
  next_review_at TIMESTAMP
)
```

## Hooks Documentation

### useAuth
```typescript
const {
  user,           // Current user
  isLoading,      // Loading state
  error,          // Error message
  login,          // Async login function
  signup,         // Async signup function
  logout,         // Async logout function
  isAuthenticated // Boolean check
} = useAuth()
```

### useFetchAsync
```typescript
const {
  data,    // Loaded data
  isLoading,
  error,
  refetch  // Manual refetch function
} = useFetchAsync(
  () => getChallenges('u1'),
  ['u1'],  // Dependencies
  {
    onSuccess: (data) => console.log('Loaded', data),
    onError: (error) => console.error(error),
    retry: 3  // Retry count
  }
)
```

### useQuiz
```typescript
const {
  quiz,           // Current quiz
  session,        // Active session
  result,         // Quiz result
  isLoading,
  error,
  loadQuiz,       // Load quiz by ID
  startQuiz,      // Start new session
  submitAnswer,   // Submit answer
  completeQuiz    // Finish quiz
} = useQuiz()
```

## Best Practices

1. **Always use services** - Never call mock data directly
2. **Type everything** - Use strict TypeScript mode
3. **Handle loading/error states** - Show UX feedback
4. **Retry failed operations** - Use built-in retry logic
5. **Clean up resources** - Unsubscribe from real-time events
6. **Test service layers** - Mock services are testable
7. **Document API contracts** - Align with real backend

## Performance Considerations

- Mock data is loaded in-memory for instant access
- Services simulate realistic API latency
- localStorage provides instant session persistence
- No actual network calls (faster than real API)
- Perfect for development and testing

## Security Notes

### Current (Mock)
- No real authentication
- localStorage stores unencrypted session
- For development only

### Production Readiness
- Replace with proper JWT implementation
- Use secure HTTP-only cookies
- Implement CSRF protection
- Add rate limiting
- Validate all inputs
- Use HTTPS only

## Testing

Services are designed for testing:

```typescript
// Mock service in tests
jest.mock('../services/quiz.service', () => ({
  createQuizSession: jest.fn()
}))

// Test components with mocked services
const result = render(<QuizComponent />)
expect(screen.getByText('Loading...')).toBeInTheDocument()
```

## Extending the Architecture

To add new features:

1. **Add types** in `/types/index.ts`
2. **Add mock data** in `/mock/data.ts`
3. **Create service** in `/services/[feature].service.ts`
4. **Create hook** (optional) in `/hooks/use[Feature].ts`
5. **Update exports** in `/services/index.ts` and `/hooks/index.ts`
6. **Build components** using the service
7. **No UI changes needed** when migrating backend

## Common Tasks

### Add a new quiz question type
1. Add to `QuestionType` enum in types
2. Update `checkAnswer()` in quiz.service
3. No component changes needed

### Add a new achievement
1. Add to mock achievements in data.ts
2. Add unlock condition in profile.service
3. Create notification in notification.service
4. Components automatically display new achievement

### Add a new leaderboard filter
1. Add filtering logic to leaderboard.service
2. Create new component prop for filter
3. Call updated service from component

## Monitoring & Debugging

Enable debug logging in development:

```typescript
// utils/debug.ts
const DEBUG = process.env.NODE_ENV === 'development'

export const log = (action: string, data?: any) => {
  if (DEBUG) console.log(`[Service] ${action}`, data)
}
```

Update services to use debug logging:
```typescript
export async function getQuizzes() {
  log('GET_QUIZZES')
  return simulateApiCall(() => { ... })
}
```

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

All services work identically in production builds - no backend required.

## Support & Maintenance

- Services are self-contained and independently testable
- Mock data can be updated without touching components
- Service interfaces are stable and versioned
- Easy rollback if needed

---

**Next Steps:**
1. Explore `/mock/data.ts` for available data
2. Check `/services` for available operations
3. Use hooks in components for state management
4. When ready, replace service implementations with real APIs
