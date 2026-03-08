/**
 * Document parser utility for extracting resume data from PDF and DOCX files
 * This is a basic implementation that can be enhanced with more sophisticated parsing
 */

import type { Resume, PersonalInfo, Experience } from '@resume-types/resume.types';

/**
 * Error thrown when document parsing fails
 */
export class DocumentParseError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'DocumentParseError';
  }
}

/**
 * Options for parsing documents
 */
export interface ParseDocumentOptions {
  /** File to parse */
  file: File;
  /** Callback for progress updates */
  onProgress?: (progress: number) => void;
}

/**
 * Parse PDF file and extract resume data
 * Note: This is a basic implementation. In production, you'd want more sophisticated parsing.
 */
export async function parsePDF(options: ParseDocumentOptions): Promise<Partial<Resume>> {
  const { file, onProgress } = options;

  try {
    // For now, we'll use a simple text extraction approach
    // In production, you'd use pdfjs-dist or a server-side API
    onProgress?.(10);

    // Read file as ArrayBuffer (required for future pdfjs-dist implementation)
    await file.arrayBuffer();
    onProgress?.(30);

    // Basic text extraction (this is a placeholder - real PDF parsing requires pdfjs-dist)
    // For now, we'll return a structure that indicates parsing is needed
    onProgress?.(100);

    // TODO: Implement actual PDF parsing using pdfjs-dist
    // This would extract text and structure it into resume sections

    throw new DocumentParseError(
      'PDF parsing is not yet fully implemented. Please use JSON format or DOCX for now.'
    );
  } catch (error) {
    if (error instanceof DocumentParseError) {
      throw error;
    }
    throw new DocumentParseError(
      `Failed to parse PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Parse DOCX file and extract resume data
 * Note: This is a basic implementation. In production, you'd want more sophisticated parsing.
 */
export async function parseDOCX(options: ParseDocumentOptions): Promise<Partial<Resume>> {
  const { file, onProgress } = options;

  try {
    onProgress?.(10);

    // Read file as ArrayBuffer (required for future mammoth implementation)
    await file.arrayBuffer();
    onProgress?.(30);

    // Basic text extraction (this is a placeholder - real DOCX parsing requires mammoth)
    // For now, we'll return a structure that indicates parsing is needed
    onProgress?.(100);

    // TODO: Implement actual DOCX parsing using mammoth
    // This would extract text and structure it into resume sections

    throw new DocumentParseError(
      'DOCX parsing is not yet fully implemented. Please use JSON format or PDF for now.'
    );
  } catch (error) {
    if (error instanceof DocumentParseError) {
      throw error;
    }
    throw new DocumentParseError(
      `Failed to parse DOCX file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Parse text content and attempt to extract resume data
 * This is a fallback for paste functionality
 */
export async function parseTextContent(text: string): Promise<Partial<Resume>> {
  try {
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(text);
      // Validate it looks like a resume
      if (parsed.personalInfo || parsed.experience) {
        return parsed as Partial<Resume>;
      }
    } catch {
      // Not JSON, continue with text parsing
    }

    // Basic text parsing - extract key information
    // This is a simplified implementation
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const resume = {
      personalInfo: extractPersonalInfo(lines),
      experience: extractExperience(lines),
      summary: extractSummary(lines),
    };

    return resume as Partial<Resume>;
  } catch (error) {
    throw new DocumentParseError(
      `Failed to parse text content: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Extract personal information from text lines
 */
function extractPersonalInfo(lines: string[]): Partial<PersonalInfo> {
  const personalInfo: Partial<PersonalInfo> = {};

  // Look for email
  const emailLine = lines.find(line => line.includes('@'));
  if (emailLine) {
    const emailMatch = emailLine.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) {
      personalInfo.email = emailMatch[0];
    }
  }

  // Look for phone
  const phoneLine = lines.find(line => /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(line));
  if (phoneLine) {
    const phoneMatch = phoneLine.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
      personalInfo.phone = phoneMatch[0];
    }
  }

  // First line is often the name
  const firstLine = lines[0];
  if (lines.length > 0 && firstLine !== undefined && !firstLine.includes('@') && !/\d/.test(firstLine)) {
    personalInfo.name = firstLine;
  }

  return personalInfo;
}

/**
 * Extract experience from text lines
 */
function extractExperience(_lines: string[]): Experience[] {
  const experience: Experience[] = [];

  // This is a very basic implementation
  // In production, you'd want more sophisticated parsing
  // Look for patterns like "Company Name - Role" or similar

  // For now, return empty array - user will need to fill in manually
  return experience;
}

/**
 * Extract summary from text lines
 */
function extractSummary(_lines: string[]): string | undefined {
  // Look for a summary section (usually near the top, after name/contact)
  // This is a simplified implementation
  return undefined;
}

/**
 * Main function to parse a document based on its type
 */
export async function parseDocument(options: ParseDocumentOptions): Promise<Partial<Resume>> {
  const { file } = options;
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return parsePDF(options);
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return parseDOCX(options);
  } else {
    throw new DocumentParseError(`Unsupported file type: ${fileType || 'unknown'}`);
  }
}
