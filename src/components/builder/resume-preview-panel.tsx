'use client';

import { motion } from 'framer-motion';
import type { PersonalInfo } from '@resume-types/resume.types';
import type { ExperienceEntry, EducationEntry, ProjectEntry, CertificationEntry } from '@/types/builder.types';
import { formatDate } from '@/templates/templateHelpers';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

export interface ResumePreviewPanelProps {
  personalInfo: PersonalInfo | undefined;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  projects?: ProjectEntry[];
  certifications?: CertificationEntry[];
  onExportPdf: () => void;
  onExportDocx: () => void;
}

function buildContactParts(pi: PersonalInfo | undefined): string[] {
  if (!pi) return [];
  const parts: string[] = [];
  if (pi.email) parts.push(pi.email);
  if (pi.phone) parts.push(pi.phone);
  if (pi.location) parts.push(pi.location);
  if (pi.linkedin) parts.push(pi.linkedin);
  if (pi.github) parts.push(pi.github);
  if (pi.website) parts.push(pi.website);
  return parts;
}

export function ResumePreviewPanel({
  personalInfo: pi,
  summary,
  experience,
  education,
  skills,
  projects = [],
  certifications = [],
  onExportPdf,
  onExportDocx,
}: ResumePreviewPanelProps) {
  const contactParts = buildContactParts(pi);
  const contactLine = contactParts.join(' | ');
  const hasContent =
    pi?.name ||
    contactLine ||
    summary ||
    experience.length > 0 ||
    education.length > 0 ||
    skills.length > 0 ||
    projects.length > 0 ||
    certifications.length > 0;

  const sectionTitleClass = 'text-[11px] uppercase tracking-widest font-sans font-bold text-[#1A1714] border-b border-[#1A1714] pb-0.5 mb-2';

  return (
    <div className="flex flex-col h-full bg-[#F0EDE6]">
      <p className="text-[11px] uppercase tracking-widest font-sans text-foreground/50 mb-4">PREVIEW</p>
      <ScrollArea className="flex-1">
        <div className="max-w-[680px] mx-auto py-8 px-6 lg:px-14 bg-white shadow-[0_4px_32px_rgba(0,0,0,0.08)]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
          {hasContent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Header: centered, matches classic */}
              {(pi?.name || contactLine) && (
                <div className="text-center mb-6">
                  {pi?.name && (
                    <h1 className="text-[20px] font-serif font-bold text-[#1A1714] mb-0.5">{pi.name}</h1>
                  )}
                  {contactLine && (
                    <p className="text-[11px] font-sans text-[#1A1714]">
                      {contactParts.map((part, i) => (
                        <span key={i}>
                          {i > 0 && <span className="mx-1">|</span>}
                          {part}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              )}

              {/* Summary: no section title in classic */}
              {summary && (
                <div className="space-y-1">
                  <p className="text-[11px] font-sans leading-relaxed text-[#1A1714] text-justify">{summary}</p>
                </div>
              )}

              {/* Experience: company/dates then role/location then bullets */}
              {experience.length > 0 && (
                <div>
                  <h2 className={sectionTitleClass}>Experience</h2>
                  <div className="space-y-4">
                    {experience.map((exp, i) => (
                      <div key={i} className="space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <span className="font-serif font-bold text-[11px] text-[#1A1714]">{exp.company}</span>
                          <span className="font-serif font-bold text-[11px] text-[#1A1714]">
                            {formatDate(exp.startDate)}
                            {exp.endDate ? ` - ${formatDate(exp.endDate)}` : ''}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="font-serif italic text-[11px] text-[#1A1714]">{exp.role || '(Role)'}</span>
                          {exp.location && (
                            <span className="font-serif italic text-[11px] text-[#1A1714]">{exp.location}</span>
                          )}
                        </div>
                        {(exp.bulletPoints?.length && exp.bulletPoints[0]) ? (
                          <ul className="mt-1 ml-4 list-disc text-[11px] font-sans leading-relaxed text-[#1A1714] space-y-0.5">
                            {exp.bulletPoints.filter(Boolean).map((b, j) => (
                              <li key={j}>{b}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education: institution/dates then degree/GPA */}
              {education.length > 0 && (
                <div>
                  <h2 className={sectionTitleClass}>Education</h2>
                  <div className="space-y-3">
                    {education.map((edu, i) => (
                      <div key={i} className="space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <span className="font-serif font-bold text-[11px] text-[#1A1714]">{edu.institution}</span>
                          <span className="font-serif font-bold text-[11px] text-[#1A1714]">
                            {formatDate(edu.graduationDate)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="font-serif italic text-[11px] text-[#1A1714]">
                            {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                          </span>
                          {edu.gpa && (
                            <span className="text-[11px] font-sans text-[#1A1714]">GPA: {edu.gpa}</span>
                          )}
                        </div>
                        {edu.honors && edu.honors.length > 0 && (
                          <p className="text-[11px] font-sans text-[#1A1714]">
                            Honors: {edu.honors.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills: category style like classic "Skills: item1, item2" */}
              {skills.length > 0 && (
                <div>
                  <h2 className={sectionTitleClass}>Skills</h2>
                  <div className="text-[11px] font-sans text-[#1A1714]">
                    <span className="font-bold">Skills: </span>
                    <span>{skills.join(', ')}</span>
                  </div>
                </div>
              )}

              {/* Certifications: name then issuer | date */}
              {certifications.length > 0 && (
                <div>
                  <h2 className={sectionTitleClass}>Certifications</h2>
                  <div className="space-y-2">
                    {certifications.map((cert, i) => (
                      <div key={i}>
                        <p className="font-serif font-bold text-[11px] text-[#1A1714]">{cert.name}</p>
                        <p className="text-[11px] font-sans text-[#1A1714]">
                          {cert.issuer} | {formatDate(cert.date)}
                          {cert.credentialId ? ` | Credential ID: ${cert.credentialId}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects: name (+ link) then description and technologies */}
              {projects.length > 0 && (
                <div>
                  <h2 className={sectionTitleClass}>Projects</h2>
                  <div className="space-y-3">
                    {projects.map((proj, i) => (
                      <div key={i}>
                        <p className="font-serif font-bold text-[11px] text-[#1A1714]">
                          {proj.name}
                          {proj.url && (
                            <>
                              {' | '}
                              <a href={proj.url} className="underline" target="_blank" rel="noopener noreferrer">
                                Website
                              </a>
                            </>
                          )}
                          {proj.github && (
                            <>
                              {' | '}
                              <a href={proj.github} className="underline" target="_blank" rel="noopener noreferrer">
                                GitHub
                              </a>
                            </>
                          )}
                        </p>
                        <ul className="ml-4 list-disc text-[11px] font-sans leading-relaxed text-[#1A1714] space-y-0.5">
                          <li>{proj.description}</li>
                          {proj.technologies && proj.technologies.length > 0 && (
                            <li>Technologies: {proj.technologies.join(', ')}</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </ScrollArea>
      <div className="sticky bottom-0 border-t border-[#D6D0C8] bg-[#FAF9F6] px-4 py-3 flex items-center justify-end flex-wrap gap-2">
        <div className="flex gap-2">
          <Button variant="default" size="sm" onClick={onExportPdf}>
            Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={onExportDocx}>
            Download DOCX
          </Button>
        </div>
      </div>
    </div>
  );
}
