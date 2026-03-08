/**
 * POST /api/enhance-resume - Enhance resume based on job description
 */

import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { logger } from '@utils/logger';
import { validateRequestBody, createErrorResponse } from '@/app/api/helpers';
import { enhanceResumeRequestSchema } from '@/app/api/schemas';
import { generateResumeFromObject } from '@services/resumeGenerator';
import type { Resume } from '@resume-types/resume.types';
import { z } from 'zod';

/**
 * Type for validated request body (inferred from schema)
 */
type EnhanceResumeRequestBody = z.infer<typeof enhanceResumeRequestSchema>;

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Temporary provider name for this request (will be cleaned up)
  const tempProviderName = `gemini-${requestId}`;
  let providerRegistered = false;

  try {
    logger.info(`[${requestId}] POST /api/enhance-resume - Starting resume enhancement`);

    // Validate request body
    const body = await validateRequestBody<EnhanceResumeRequestBody>(
      request,
      enhanceResumeRequestSchema
    );

    const { resume, jobDescription, options, aiProvider, aiModel, aiOptions } = body;

    logger.debug(`[${requestId}] Enhancing resume with ${jobDescription.length} character job description`);

    // Load AI configuration and set up provider
    const { loadAIConfig, getGeminiConfig } = await import('@services/ai/config');
    const { GeminiProvider } = await import('@services/ai/gemini');
    const { registerProvider, unregisterProvider } = await import('@services/ai/providerRegistry');

    // Load base AI config
    const aiConfig = await loadAIConfig({ loadFromEnv: true });
    const baseGeminiConfig = getGeminiConfig(aiConfig);

    if (!baseGeminiConfig || !baseGeminiConfig.apiKey) {
      return createErrorResponse(
        400,
        'Configuration error',
        'Gemini API key not configured. Please set GEMINI_API_KEY in .env file.'
      );
    }

    // Determine provider to use (default to 'gemini' if not specified)
    const providerToUse = aiProvider || 'gemini';

    if (providerToUse !== 'gemini') {
      return createErrorResponse(
        400,
        'Invalid provider',
        `Provider "${providerToUse}" is not supported. Only "gemini" is currently supported.`
      );
    }

    // Merge base config with request overrides
    const finalGeminiConfig = {
      ...baseGeminiConfig,
      model: aiModel || baseGeminiConfig.model || 'gemini-3-flash-preview',
      temperature: aiOptions?.temperature !== undefined ? aiOptions.temperature : (baseGeminiConfig.temperature ?? 0.7),
      maxTokens: aiOptions?.maxTokens !== undefined ? aiOptions.maxTokens : baseGeminiConfig.maxTokens,
      timeout: aiOptions?.timeout !== undefined ? aiOptions.timeout : baseGeminiConfig.timeout,
      maxRetries: aiOptions?.maxRetries !== undefined ? aiOptions.maxRetries : baseGeminiConfig.maxRetries,
    };

    // Create and register provider with request-specific config
    const geminiProvider = new GeminiProvider(finalGeminiConfig);
    registerProvider(tempProviderName, geminiProvider);
    providerRegistered = true;

    logger.info(`[${requestId}] Using AI provider: ${providerToUse}, model: ${finalGeminiConfig.model}, temperature: ${finalGeminiConfig.temperature}`);

    // Create enhancement service with the temporary provider
    const { AIResumeEnhancementService } = await import('@services/aiResumeEnhancementService');
    const enhancementService = new AIResumeEnhancementService(tempProviderName);

    // Enhance resume
    // Cast to Resume type - schema validation ensures compatibility
    const enhancementResult = await enhancementService.enhanceResume(
      resume as Resume,
      jobDescription,
      options
    );

    // Get provider info for response
    const providerInfo = geminiProvider.getProviderInfo();

    logger.info(`[${requestId}] Resume enhanced - ATS Score: ${enhancementResult.atsScore.before} → ${enhancementResult.atsScore.after} (+${enhancementResult.atsScore.improvement})`);

    // Create temporary output directory
    const tempDir = os.tmpdir();
    const outputDir = path.join(tempDir, `enhanced-${requestId}`);
    await fs.ensureDir(outputDir);

    // Generate enhanced JSON
    const { generateEnhancedResumeOutput, generateAndWriteEnhancedResume } = await import('@services/enhancedResumeGenerator');
    const baseName = 'enhanced-resume';
    await generateAndWriteEnhancedResume(enhancementResult, {
      outputDir,
      baseName,
    });

    // Generate PDF
    const pdfPath = path.join(outputDir, `${baseName}.pdf`);
    await generateResumeFromObject(
      enhancementResult.enhancedResume,
      pdfPath,
      {
        template: 'classic',
        format: 'pdf',
        validate: false,
      }
    );

    // Generate Markdown report
    const { generateAndWriteMarkdownReport } = await import('@services/mdGenerator');
    const enhancedOutput = generateEnhancedResumeOutput(enhancementResult, {
      outputDir,
      baseName,
    });
    const mdPath = path.join(outputDir, `${baseName}.md`);
    await generateAndWriteMarkdownReport(enhancedOutput, mdPath);

    logger.info(`[${requestId}] All outputs generated successfully`);

    // Read PDF file for base64 encoding
    const pdfBuffer = await fs.readFile(pdfPath);
    const pdfBase64 = pdfBuffer.toString('base64');

    // Read Markdown file
    const mdContent = await fs.readFile(mdPath, 'utf8');

    // Clean up temporary files after reading (fire and forget)
    fs.remove(outputDir).catch((err) => {
      logger.warn(`[${requestId}] Failed to clean up temporary files: ${err.message}`);
    });

    // Clean up temporary provider
    if (providerRegistered) {
      try {
        unregisterProvider(tempProviderName);
        logger.debug(`[${requestId}] Cleaned up temporary provider: ${tempProviderName}`);
      } catch (cleanupError) {
        logger.warn(`[${requestId}] Failed to clean up temporary provider: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`);
      }
    }

    // Return enhanced resume output with all metadata
    return Response.json({
      success: true,
      enhancedResume: {
        ...enhancedOutput,
        pdfPath: undefined, // Don't include file paths in response
        mdPath: undefined,
      },
      atsScore: enhancementResult.atsScore,
      provider: {
        name: providerInfo.name,
        displayName: providerInfo.displayName,
        model: finalGeminiConfig.model,
        temperature: finalGeminiConfig.temperature,
      },
      pdf: {
        base64: pdfBase64,
        contentType: 'application/pdf',
        filename: 'enhanced-resume.pdf',
        size: pdfBuffer.length,
      },
      markdown: {
        content: mdContent,
        filename: 'enhanced-resume.md',
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`[${requestId}] Error enhancing resume (${duration}ms): ${error instanceof Error ? error.message : String(error)}`);

    // Clean up temporary provider on error
    if (providerRegistered) {
      try {
        const { unregisterProvider } = await import('@services/ai/providerRegistry');
        unregisterProvider(tempProviderName);
      } catch (cleanupError) {
        logger.warn(`[${requestId}] Failed to clean up temporary provider on error: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`);
      }
    }

    // If it's already a NextResponse (from validation), re-throw it
    if (error instanceof NextResponse) {
      throw error;
    }

    // Import error types for proper error handling
    const { PdfGenerationError } = await import('@utils/pdfGenerator');
    const { JsonWriteError } = await import('@services/enhancedResumeGenerator');
    const { MarkdownWriteError } = await import('@services/mdGenerator');
    const { AIProviderError, RateLimitError, NetworkError, TimeoutError } = await import('@services/ai/provider.types');

    if (error instanceof PdfGenerationError) {
      return createErrorResponse(500, 'PDF generation failed', error.message);
    } else if (error instanceof JsonWriteError || error instanceof MarkdownWriteError) {
      return createErrorResponse(500, 'File generation failed', error.message);
    } else if (error instanceof AIProviderError) {
      // Handle AI provider errors
      if (error instanceof RateLimitError) {
        return createErrorResponse(
          429,
          'Rate limit exceeded',
          error.message,
          { retryAfter: error.retryAfter }
        );
      } else if (error instanceof NetworkError) {
        return createErrorResponse(503, 'Network error', error.message);
      } else if (error instanceof TimeoutError) {
        return createErrorResponse(504, 'Request timeout', error.message);
      } else {
        return createErrorResponse(500, 'AI provider error', error.message);
      }
    } else {
      return createErrorResponse(
        500,
        'Internal server error',
        error instanceof Error ? error.message : 'An error occurred while enhancing the resume'
      );
    }
  }
}
