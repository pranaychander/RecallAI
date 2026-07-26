import { Challenge } from '../types'
import { createChallengeFromPdf, createChallengeFromUrl } from './challenge.service'
import { simulateApiCall, generateId } from '../utils/helpers'

// ============================================================================
// Upload/Import Service
// ============================================================================

/**
 * Processes file upload
 */
export async function uploadFile(
  userId: string,
  file: { name: string; type: string; size: number; content: string }
): Promise<{ success: boolean; message: string; challengeId?: string }> {
  return simulateApiCall(async () => {
    // Validate file
    if (file.size > 100 * 1024 * 1024) {
      throw new Error('File too large. Maximum size is 100MB.')
    }
    if (file.type === 'application/pdf') {
      const challenge = await createChallengeFromPdf(userId, file.name, file.content)
      return {
        success: true,
        message: `PDF "${file.name}" has been processed successfully.`,
        challengeId: challenge.id,
      }
    }
    throw new Error('Unsupported file type. Supported types: PDF')
  }, 0.08)
}

/**
 * Processes URL import
 */
export async function importFromUrl(userId: string, url: string, title?: string): Promise<{ success: boolean; message: string; challengeId?: string }> {
  return simulateApiCall(async () => {
    if (!isValidUrl(url)) {
      throw new Error('Invalid URL format')
    }
    const challenge = await createChallengeFromUrl(userId, url, title)
    return {
      success: true,
      message: `Content from "${url}" has been extracted and processed.`,
      challengeId: challenge.id,
    }
  }, 0.1)
}

/**
 * Processes GitHub repository import
 */
export async function importFromGithub(userId: string, repoUrl: string, topic?: string): Promise<{ success: boolean; message: string; challengeId?: string }> {
  return simulateApiCall(async () => {
    if (!repoUrl.includes('github.com')) {
      throw new Error('Invalid GitHub URL')
    }
    const { createChallengeFromGithub } = await import('./challenge.service')
    const challenge = await createChallengeFromGithub(userId, repoUrl, topic)
    return {
      success: true,
      message: `GitHub repository has been analyzed and imported.`,
      challengeId: challenge.id,
    }
  }, 0.15)
}

/**
 * Processes YouTube video import
 */
export async function importFromYoutube(userId: string, videoUrl: string, title?: string): Promise<{ success: boolean; message: string; challengeId?: string }> {
  return simulateApiCall(async () => {
    if (!isYoutubeUrl(videoUrl)) {
      throw new Error('Invalid YouTube URL')
    }
    const { createChallengeFromYoutube } = await import('./challenge.service')
    const challenge = await createChallengeFromYoutube(userId, videoUrl, title)
    return {
      success: true,
      message: `YouTube video transcript has been extracted and processed.`,
      challengeId: challenge.id,
    }
  }, 0.12)
}

/**
 * Generates preview of content before import
 */
export async function generatePreview(
  source: 'url' | 'pdf' | 'github' | 'youtube',
  sourceUrl: string
): Promise<{ title: string; description: string; preview: string }> {
  return simulateApiCall(() => {
    const mockPreviews: Record<string, { title: string; description: string; preview: string }> = {
      url: {
        title: 'Web Article',
        description: 'Content extracted from web article',
        preview: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      },
      pdf: {
        title: 'PDF Document',
        description: 'Content extracted from PDF',
        preview: 'This document contains comprehensive information about...',
      },
      github: {
        title: 'GitHub Repository',
        description: 'Code and documentation from repository',
        preview: 'Repository contains implementations of advanced algorithms...',
      },
      youtube: {
        title: 'YouTube Video',
        description: 'Transcript and key points from video',
        preview: 'In this video, we explore the fundamentals of...',
      },
    }
    return mockPreviews[source] || mockPreviews.url
  }, 0.05)
}

/**
 * Extracts content from various sources
 */
export async function extractContent(source: 'url' | 'pdf' | 'github' | 'youtube', sourceUrl: string): Promise<string> {
  return simulateApiCall(() => {
    const mockContent: Record<string, string> = {
      url: `Content extracted from: ${sourceUrl}\n\nThis is the main content of the webpage with key information...`,
      pdf: `Content extracted from PDF: ${sourceUrl}\n\nPage 1: Introduction\nPage 2: Main Content\nPage 3: Conclusion`,
      github: `Repository Analysis: ${sourceUrl}\n\nKey files and structure analyzed. Documentation extracted.`,
      youtube: `Video Transcript from: ${sourceUrl}\n\n[00:00] Introduction\n[01:30] Main Topic\n[15:00] Conclusion`,
    }
    return mockContent[source] || mockContent.url
  }, 0.1)
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Validates URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Checks if URL is a YouTube URL
 */
function isYoutubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/.test(url)
}
