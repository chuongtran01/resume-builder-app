'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { Resume } from '@resume-types/resume.types';
import { FileUpload } from '@/components/builder/file-upload';
import { parseDocument } from '@/utils/documentParser';

const IMPORT_STORAGE_KEY = 'imported-resume';

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [resume, setResume] = useState<Partial<Resume>>({});
  const [showImportModal, setShowImportModal] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Load imported resume from sessionStorage when ?imported=true
  useEffect(() => {
    const isImported = searchParams.get('imported') === 'true';
    if (!isImported) return;

    try {
      const stored = typeof window !== 'undefined' ? sessionStorage.getItem(IMPORT_STORAGE_KEY) : null;
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<Resume>;
        setResume(parsed);
        sessionStorage.removeItem(IMPORT_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to load imported resume:', error);
    }
    // Remove query param from URL
    router.replace('/builder');
  }, [searchParams, router]);

  const handleInputChange = (section: keyof Resume, field: string, value: unknown) => {
    setResume(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value
      }
    }));
  };

  const isFormEmpty =
    !resume.personalInfo?.name &&
    !resume.personalInfo?.email &&
    !resume.summary &&
    (!resume.experience || resume.experience.length === 0);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-section-mobile lg:py-section">
        <div className="mb-8">
          <h1 className="text-display font-serif font-normal text-foreground mb-2">
            Build Your Resume
          </h1>
          <p className="text-lg text-foreground/70 font-sans">
            {!isFormEmpty
              ? 'Review and edit your resume information.'
              : 'Fill in your information to create your resume, or import an existing one.'}
          </p>
        </div>

        {/* Import Resume section - shown when form is empty */}
        {isFormEmpty && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-4 border border-border rounded-sm bg-foreground/[0.02]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-serif font-normal text-foreground mb-1">
                  Import existing resume
                </h2>
                <p className="text-sm text-foreground/70 font-sans">
                  Upload a PDF or DOCX and we'll extract the information for you.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(true);
                  setImportError(null);
                }}
                className="shrink-0 border border-border text-foreground px-6 py-2.5 rounded-sm font-sans text-sm hover:bg-foreground/5 transition-colors"
              >
                Choose File
              </button>
            </div>
          </motion.section>
        )}

        <div className="space-y-12">
          {/* Personal Information Section */}
          <section className="border-b border-border pb-8">
            <h2 className="text-2xl font-serif font-normal text-foreground mb-6">
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-sans text-foreground/70 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={resume.personalInfo?.name || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-border bg-background text-foreground font-sans rounded-sm focus:outline-none focus:border-accent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-sans text-foreground/70 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={resume.personalInfo?.email || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  className="w-full px-4 py-2 border border-border bg-background text-foreground font-sans rounded-sm focus:outline-none focus:border-accent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-sans text-foreground/70 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={resume.personalInfo?.phone || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  className="w-full px-4 py-2 border border-border bg-background text-foreground font-sans rounded-sm focus:outline-none focus:border-accent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-sans text-foreground/70 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={resume.personalInfo?.location || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                  className="w-full px-4 py-2 border border-border bg-background text-foreground font-sans rounded-sm focus:outline-none focus:border-accent"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>
          </section>

          {/* Summary Section */}
          <section className="border-b border-border pb-8">
            <h2 className="text-2xl font-serif font-normal text-foreground mb-6">
              Professional Summary
            </h2>
            <textarea
              value={resume.summary || ''}
              onChange={(e) => setResume(prev => ({ ...prev, summary: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-border bg-background text-foreground font-sans rounded-sm focus:outline-none focus:border-accent"
              placeholder="Write a brief summary of your professional background..."
            />
          </section>

          {/* Experience Section */}
          <section className="border-b border-border pb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-normal text-foreground">
                Work Experience
              </h2>
              <button
                type="button"
                onClick={() => {
                  setResume(prev => ({
                    ...prev,
                    experience: [
                      ...(prev.experience || []),
                      {
                        company: '',
                        role: '',
                        startDate: '',
                        endDate: '',
                        location: '',
                        bulletPoints: ['']
                      }
                    ]
                  }));
                }}
                className="text-sm font-sans text-accent hover:opacity-80"
              >
                + Add Experience
              </button>
            </div>
            {(!resume.experience || resume.experience.length === 0) ? (
              <p className="text-foreground/50 font-sans text-sm">
                No experience entries yet. Click "Add Experience" to get started.
              </p>
            ) : (
              <div className="space-y-8">
                {resume.experience.map((exp, index) => (
                  <div key={index} className="border border-border p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-sans text-foreground/70 mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const newExp = [...(resume.experience || [])];
                            newExp[index] = { ...exp, company: e.target.value };
                            setResume(prev => ({ ...prev, experience: newExp }));
                          }}
                          className="w-full px-4 py-2 border border-border bg-background text-foreground font-sans rounded-sm focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-sans text-foreground/70 mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const newExp = [...(resume.experience || [])];
                            newExp[index] = { ...exp, role: e.target.value };
                            setResume(prev => ({ ...prev, experience: newExp }));
                          }}
                          className="w-full px-4 py-2 border border-border bg-background text-foreground font-sans rounded-sm focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                localStorage.setItem('resume-draft', JSON.stringify(resume));
                alert('Draft saved!');
              }}
              className="px-8 py-3 border border-border text-foreground font-sans text-sm rounded-sm hover:bg-foreground/5 transition-colors"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => {
                alert('Generate resume functionality coming soon!');
              }}
              className="px-8 py-3 bg-accent text-white font-sans text-sm rounded-sm hover:opacity-90 transition-opacity"
            >
              Generate Resume
            </button>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => {
            setShowImportModal(false);
            setImportError(null);
          }}
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border border-border p-8 max-w-md w-full space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif font-normal text-foreground">
                Import Resume
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setImportError(null);
                }}
                className="text-foreground/50 hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {importError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-sm">
                <p className="text-sm font-sans text-red-600">{importError}</p>
              </div>
            )}

            <FileUpload
              onFileSelect={async (file) => {
                setImportError(null);
                try {
                  const parsedResume = await parseDocument({
                    file,
                    onProgress: (progress) => {
                      console.log(`Parsing progress: ${progress}%`);
                    }
                  });
                  sessionStorage.setItem(IMPORT_STORAGE_KEY, JSON.stringify(parsedResume));
                  setShowImportModal(false);
                  setImportError(null);
                  router.push('/builder?imported=true');
                } catch (error) {
                  console.error('Import error:', error);
                  setImportError(
                    error instanceof Error
                      ? error.message
                      : 'Failed to import resume. Please try again or create from scratch.'
                  );
                }
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
