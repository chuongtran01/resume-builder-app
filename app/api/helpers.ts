/**
 * Next.js API route helpers
 */

import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { logger } from '@utils/logger';

/**
 * Validation error response
 */
export interface ValidationErrorResponse {
  error: 'Validation Error';
  message: string;
  details: Array<{
    path: string;
    message: string;
  }>;
}

/**
 * Format Zod error for API response
 */
function formatZodError(error: ZodError): ValidationErrorResponse {
  return {
    error: 'Validation Error',
    message: 'Request validation failed',
    details: error.issues.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    })),
  };
}

/**
 * Validate request body against a Zod schema
 * Returns validated data or throws a NextResponse with validation error
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    return validatedData;
  } catch (error) {
    if (error instanceof ZodError) {
      const errorResponse = formatZodError(error);
      logger.warn(`Validation error: ${errorResponse.message}`);
      if (logger.isVerbose()) {
        logger.debug(`Validation details: ${JSON.stringify(errorResponse.details, null, 2)}`);
      }
      throw NextResponse.json(errorResponse, { status: 400 });
    }
    throw NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred during validation',
      },
      { status: 500 }
    );
  }
}

/**
 * Create error response
 */
export function createErrorResponse(
  status: number,
  error: string,
  message: string,
  additionalData?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    {
      error,
      message,
      ...additionalData,
    },
    { status }
  );
}

/**
 * Create success response with file
 */
export function createFileResponse(
  fileBuffer: Buffer,
  contentType: string,
  filename: string,
  headers?: Record<string, string>
): NextResponse {
  const response = new NextResponse(fileBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': fileBuffer.length.toString(),
      ...headers,
    },
  });
  return response;
}
