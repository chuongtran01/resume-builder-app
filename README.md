# Resume Builder App

A Next.js application for generating ATS-friendly resumes from structured JSON input. Produces professional, machine-readable resumes in PDF or HTML format with AI-powered enhancement capabilities.

## Features

- 📄 Generate ATS-compliant resumes from structured JSON
- 🤖 **AI-Powered Resume Enhancement** - Tailor your resume to specific job descriptions
- 🔗 Support for reusable resume sections via file references
- 🌐 REST API for programmatic access
- 🎨 Multiple ATS-safe resume templates
- ✅ Built-in ATS validation and compliance checking
- 📊 Change tracking and detailed enhancement reports
- 🎨 Modern UI built with Next.js, Tailwind CSS, and shadcn/ui

## Installation

```bash
npm install
```

## Quick Start

### Prerequisites

Before using AI enhancement features, set up your `.env.local` file:

```bash
# Create .env.local file
cp .env.local.example .env.local

# Edit .env.local and add your Gemini API key
GEMINI_API_KEY=your-api-key-here
```

See [AI_CONFIG.md](./AI_CONFIG.md) for detailed configuration options.

### Development

Start the development server:

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production

Build and start the production server:

```bash
npm run build
npm start
```

### API Usage

The API is available at `/api/*` endpoints when the Next.js server is running.

**Quick Examples:**

Generate a resume via API:
```bash
curl -X POST http://localhost:3000/api/generate-resume \
  -H "Content-Type: application/json" \
  -d @resume.json \
  --output resume.pdf
```

Validate a resume:
```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d @resume.json
```

Enhance a resume based on job description:
```bash
curl -X POST http://localhost:3000/api/enhance-resume \
  -H "Content-Type: application/json" \
  -d '{
    "resume": { ... },
    "jobDescription": "Full job description text...",
    "options": {
      "focusAreas": ["bulletPoints", "keywords"],
      "tone": "professional"
    }
  }'
```

For complete API documentation, see [API.md](./API.md).

## Project Structure

```
resume-builder/
├── src/
│   ├── templates/          # ATS-safe resume templates
│   ├── services/          # Core business logic
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── cli/               # CLI interface
│   └── api/               # REST API server
├── resume-sections/       # Reusable resume sections (JSON)
├── examples/              # Example files
└── tests/                 # Test files
```

## Resume JSON Schema

See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for detailed schema documentation.

## AI Enhancement Examples

Example AI-enhanced resumes are available in the `enhanced-examples/` directory:

- `mock-resume.json` - Original resume
- `mock-resume-enhanced.json` - Enhanced resume with change tracking
- `mock-resume-enhanced.pdf` - Enhanced resume PDF
- `mock-resume-enhanced.md` - Detailed markdown report of all changes

These examples demonstrate:
- Natural keyword integration
- Bullet point enhancements
- Skills reordering based on job relevance
- Summary improvements
- Complete change tracking

To generate your own enhanced examples:

```bash
npm run dev -- enhanceResume \
  --input enhanced-examples/mock-resume.json \
  --job enhanced-examples/mock-job-description.txt \
  --output enhanced-examples
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Troubleshooting

### AI Enhancement Issues

**Error: "Gemini API key not configured"**
- Make sure you have created a `.env` file in the project root
- Add `GEMINI_API_KEY=your-api-key-here` to the `.env` file
- See [AI_CONFIG.md](./AI_CONFIG.md) for detailed configuration instructions

**Error: "Rate limit exceeded"**
- The Gemini API has rate limits. Wait a few minutes and try again
- Consider using `gemini-3-flash-preview` model which has higher rate limits
- Check your API quota in Google AI Studio

**Error: "Request timeout"**
- The default timeout is 30 seconds. For large resumes, increase `GEMINI_TIMEOUT` in `.env`
- Try using `gemini-3-flash-preview` for faster responses
- Check your network connection

**Error: "Invalid response from Gemini"**
- This usually indicates the AI response didn't match the expected format
- Try running with `--verbose` flag to see detailed error messages
- The system will automatically retry on retryable errors

**AI enhancement produces unexpected results**
- Try adjusting the `--ai-temperature` value (lower = more conservative, higher = more creative)
- Use `gemini-3-flash-preview` for faster/cheaper (default), `gemini-2.5-pro` for better quality
- Review the enhanced resume and markdown report to see all changes

### General Issues

**Error: "Cannot find module '@utils/logger'"**
- Make sure you've installed all dependencies: `npm install`
- Check that TypeScript path aliases are configured correctly in `tsconfig.json`

**PDF generation fails**
- Ensure Puppeteer dependencies are installed: `npm install`
- Check that you have write permissions for the output directory
- Try generating HTML first to isolate PDF-specific issues

For more help, see [AI_CONFIG.md](./AI_CONFIG.md) or check the project issues on GitHub.

## License

MIT
