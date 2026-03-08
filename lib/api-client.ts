/**
 * Client-side API utilities for calling Next.js API routes
 */

import type { Resume } from '@resume-types/resume.types';

/**
 * API base URL (empty string for same-origin requests)
 */
const API_BASE = '';

/**
 * Generate resume from JSON
 */
export async function generateResume(
  resume: Resume,
  options?: {
    template?: string;
    format?: 'pdf' | 'html';
    validate?: boolean;
    templateOptions?: {
      pageBreaks?: boolean;
      customCss?: string;
      printStyles?: boolean;
      multiplier?: number;
    };
  }
): Promise<Blob> {
  const response = await fetch(`${API_BASE}/api/generate-resume`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resume,
      options,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.blob();
}

/**
 * Validate resume for ATS compliance
 */
export async function validateResume(resume: Resume) {
  const response = await fetch(`${API_BASE}/api/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ resume }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Enhance resume based on job description
 */
export async function enhanceResume(
  resume: Resume,
  jobDescription: string,
  options?: {
    focusAreas?: Array<'keywords' | 'bulletPoints' | 'skills' | 'summary'>;
    tone?: 'professional' | 'technical' | 'leadership';
    maxSuggestions?: number;
    aiProvider?: 'gemini';
    aiModel?: 'gemini-3-flash-preview' | 'gemini-2.5-pro';
    aiOptions?: {
      temperature?: number;
      maxTokens?: number;
      timeout?: number;
      maxRetries?: number;
    };
  }
) {
  const response = await fetch(`${API_BASE}/api/enhance-resume`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resume,
      jobDescription,
      options,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Health check
 */
export async function healthCheck() {
  const response = await fetch(`${API_BASE}/api/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  return response.json();
}
