/**
 * POST /api/validate - Validate resume for ATS compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@utils/logger';
import { validateRequestBody, createErrorResponse } from '@/app/api/helpers';
import { validateResumeRequestSchema } from '@/app/api/schemas';
import { validateAtsCompliance } from '@services/atsValidator';
import type { Resume } from '@resume-types/resume.types';
import { z } from 'zod';

/**
 * Type for validated request body (inferred from schema)
 */
type ValidateResumeRequestBody = z.infer<typeof validateResumeRequestSchema>;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    logger.info(`[${requestId}] POST /api/validate - Starting resume validation`);

    // Validate request body
    const body = await validateRequestBody<ValidateResumeRequestBody>(
      request,
      validateResumeRequestSchema
    );
    const { resume } = body;

    // Run ATS validation
    // Cast to Resume type - schema validation ensures compatibility
    const validationResult = validateAtsCompliance(resume as Resume);

    logger.info(`[${requestId}] Validation completed - Score: ${validationResult.score}/100, Compliant: ${validationResult.isCompliant}`);

    // Return validation results
    return NextResponse.json({
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
    if (error instanceof NextResponse) {
      throw error;
    }

    return createErrorResponse(
      500,
      'Internal server error',
      error instanceof Error ? error.message : 'An error occurred while validating the resume'
    );
  }
}
