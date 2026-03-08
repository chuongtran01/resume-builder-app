/**
 * POST /api/validate - Validate resume for ATS compliance
 */

import { NextRequest } from 'next/server';
import { logger } from '@utils/logger';
import { validateRequestBody, createErrorResponse } from '@/app/api/helpers';
import { validateResumeRequestSchema } from '@/app/api/schemas';
import { validateAtsCompliance } from '@services/atsValidator';
import type { Resume } from '@resume-types/resume.types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    logger.info(`[${requestId}] POST /api/validate - Starting resume validation`);

    // Validate request body
    const body = await validateRequestBody<{ resume: Resume }>(
      request,
      validateResumeRequestSchema
    );
    const { resume } = body;

    // Run ATS validation
    const validationResult = validateAtsCompliance(resume);

    logger.info(`[${requestId}] Validation completed - Score: ${validationResult.score}/100, Compliant: ${validationResult.isCompliant}`);

    // Return validation results
    return Response.json({
      score: validationResult.score,
      isCompliant: validationResult.isCompliant,
      errors: validationResult.errors,
      warnings: validationResult.warnings,
      suggestions: validationResult.suggestions,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`[${requestId}] Error validating resume (${duration}ms): ${error instanceof Error ? error.message : String(error)}`);

    // If it's already a NextResponse (from validation), re-throw it
    if (error instanceof Response) {
      throw error;
    }

    return createErrorResponse(
      500,
      'Internal server error',
      error instanceof Error ? error.message : 'An error occurred while validating the resume'
    );
  }
}
