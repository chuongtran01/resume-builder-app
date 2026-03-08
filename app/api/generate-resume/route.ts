/**
 * POST /api/generate-resume - Generate resume from JSON
 */

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { logger } from '@utils/logger';
import { generateResumeFromObject, TemplateNotFoundError } from '@services/resumeGenerator';
import { PdfGenerationError } from '@utils/pdfGenerator';
import { validateRequestBody, createErrorResponse, createFileResponse } from '@/src/lib/api-helpers';
import { generateResumeRequestSchema } from '@/app/api/schemas';
import type { Resume } from '@resume-types/resume.types';

/**
 * Type for validated generate resume request body
 */
type GenerateResumeRequestBody = {
  resume: Resume;
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
  };
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    logger.info(`[${requestId}] POST /api/generate-resume - Starting resume generation`);

    // Validate request body
    const body = await validateRequestBody<GenerateResumeRequestBody>(
      request,
      generateResumeRequestSchema
    );
    const { resume, options = {} } = body;

    // Extract options with defaults
    const template = options.template || 'classic';
    const format = options.format || 'pdf';
    const runValidation = options.validate || false;
    const templateOptions = options.templateOptions;

    logger.debug(`[${requestId}] Template: ${template}, Format: ${format}, Validate: ${runValidation}`);

    // Create temporary output file
    const tempDir = os.tmpdir();
    const outputFileName = `resume-${requestId}.${format}`;
    const outputPath = path.join(tempDir, outputFileName);

    // Generate resume
    const result = await generateResumeFromObject(resume, outputPath, {
      template,
      format,
      validate: runValidation,
      templateOptions,
    });

    logger.info(`[${requestId}] Resume generated successfully: ${result.outputPath} (${(result.fileSize / 1024).toFixed(2)} KB)`);

    // Read the generated file
    const fileBuffer = await fs.readFile(result.outputPath);

    // Set appropriate content-type headers
    const contentType = format === 'pdf' ? 'application/pdf' : 'text/html';
    const filename = `resume.${format}`;

    // Build response headers
    const headers: Record<string, string> = {
      'X-Resume-Template': result.template,
      'X-Resume-Format': result.format,
      'X-Resume-Size': result.fileSize.toString(),
    };

    // Include ATS validation results in headers if available
    if (result.atsValidation) {
      headers['X-ATS-Score'] = result.atsValidation.score.toString();
      headers['X-ATS-Compliant'] = result.atsValidation.isCompliant ? 'true' : 'false';
    }

    // Create file response
    const response = createFileResponse(fileBuffer, contentType, filename, headers);

    // Clean up temporary file after sending (fire and forget)
    fs.remove(result.outputPath).catch((err) => {
      logger.warn(`[${requestId}] Failed to clean up temporary file: ${err.message}`);
    });

    const duration = Date.now() - startTime;
    logger.info(`[${requestId}] Request completed in ${duration}ms`);

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`[${requestId}] Error generating resume (${duration}ms): ${error instanceof Error ? error.message : String(error)}`);

    // If it's already a NextResponse (from validation), re-throw it
    if (error instanceof NextResponse) {
      throw error;
    }

    if (error instanceof TemplateNotFoundError) {
      // Get available templates for error response
      try {
        const { getTemplateNames } = await import('@templates/templateRegistry');
        const availableTemplates = getTemplateNames();

        return createErrorResponse(
          400,
          'Invalid template',
          error.message,
          { availableTemplates }
        );
      } catch (importError) {
        return createErrorResponse(400, 'Invalid template', error.message);
      }
    } else if (error instanceof PdfGenerationError) {
      return createErrorResponse(500, 'PDF generation failed', error.message);
    } else {
      return createErrorResponse(
        500,
        'Internal server error',
        error instanceof Error ? error.message : 'An error occurred while generating the resume'
      );
    }
  }
}
