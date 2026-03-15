'use client';

import { motion } from 'framer-motion';
import { Download, FileText, ChevronDown } from 'lucide-react';
import type { PersonalInfo, SkillCategory } from '@resume-types/resume.types';
import type { ExperienceEntry, EducationEntry, ProjectEntry, CertificationEntry } from '@/types/builder.types';
import { formatDate } from '@/templates/templateHelpers';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface ResumePreviewPanelProps {
  personalInfo: PersonalInfo | undefined;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skillCategories: SkillCategory[];
  projects?: ProjectEntry[];
  certifications?: CertificationEntry[];
  onExportPdf: () => void;
  onExportDocx?: () => void;
  isExportingPdf?: boolean;
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
  skillCategories,
  projects = [],
  certifications = [],
  onExportPdf,
  onExportDocx,
  isExportingPdf = false,
}: ResumePreviewPanelProps) {
  const contactParts = buildContactParts(pi);
  const contactLine = contactParts.join(' | ');
  const hasSkills = skillCategories.some((c) => c.items.length > 0);
  const hasContent =
    pi?.name ||
    contactLine ||
    summary ||
    experience.length > 0 ||
    education.length > 0 ||
    hasSkills ||
    projects.length > 0 ||
    certifications.length > 0;

  const sectionTitleClass = 'text-[11px] uppercase tracking-widest font-bold text-[#000] border-b border-[#000] pb-0.5 mb-1';

  return (
    <div className="flex flex-col h-full bg-[#F0EDE6]">
      <div className="shrink-0 border-b border-border bg-background shadow-sm py-3.5 flex items-center justify-end flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isExportingPdf}>
              <Download className="h-4 w-4 mr-2" />
              {isExportingPdf ? 'Generating...' : 'Download'}
              <ChevronDown className="h-4 w-4 ml-1.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportPdf} disabled={isExportingPdf}>
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </DropdownMenuItem>
            {onExportDocx && (
              <DropdownMenuItem onClick={onExportDocx}>
                <FileText className="h-4 w-4 mr-2" />
                DOCX
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="flex-1 py-8" >
        <div className="max-w-[680px] mx-auto py-8 px-6 lg:px-14 bg-white shadow-[0_4px_32px_rgba(0,0,0,0.08)] text-[11px] leading-[1.35] text-[#000]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
          {hasContent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              {/* Header: centered, matches classic (header mb 8pt, h1 mb 2pt, contact 8pt) */}
              {(pi?.name || contactLine) && (
                <div className="text-center mb-2 pb-0.5">
                  {pi?.name && (
                    <h1 className="text-[20px] font-bold text-[#000] mb-0.5">{pi.name}</h1>
                  )}
                  {contactLine && (
                    <p className="text-[10px] text-[#000]">
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
                  <p className="text-justify">{summary}</p>
                </div>
              )}

              {/* Experience: company/dates then role/location then bullets */}
              {experience.length > 0 && (
                <div>
                  <h2 className={sectionTitleClass}>Experience</h2>
                  <div className="space-y-2">
                    {experience.map((exp, i) => (
                      <div key={i} className="space-y-0">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold">{exp.company}</span>
                          <span className="font-bold">
                            {formatDate(exp.startDate)}
                            {exp.endDate ? ` - ${formatDate(exp.endDate)}` : ''}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="italic">{exp.role || '(Role)'}</span>
                          {exp.location && (
                            <span className="italic">{exp.location}</span>
                          )}
                        </div>
                        {(exp.bulletPoints?.length && exp.bulletPoints[0]) ? (
                          <ul className="mt-0.5 ml-4 list-disc space-y-0">
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
                  <div className="space-y-1">
                    {education.map((edu, i) => (
                      <div key={i} className="space-y-0">
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold">{edu.institution}</span>
                          <span className="font-bold">
                            {formatDate(edu.graduationDate)}
                          </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                          <span className="italic">
                            {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                          </span>
                          {edu.gpa && (
                            <span>GPA: {edu.gpa}</span>
                          )}
                        </div>
                        {edu.honors && edu.honors.length > 0 && (
                          <p>
                            Honors: {edu.honors.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills: per-category "Category Name: item1, item2" */}
              {hasSkills && (
                <div>
                  <h2 className={sectionTitleClass}>Skills</h2>
                  <div className="space-y-0.5">
                    {skillCategories
                      .filter((c) => c.items.length > 0)
                      .map((cat, i) => (
                        <div key={i}>
                          <span className="font-bold">{cat.name}: </span>
                          <span>{cat.items.join(', ')}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Certifications: name then issuer | date */}
              {certifications.length > 0 && (
                <div>
                  <h2 className={sectionTitleClass}>Certifications</h2>
                  <div className="space-y-0.5">
                    {certifications.map((cert, i) => (
                      <div key={i}>
                        <p className="font-bold">{cert.name}</p>
                        <p>
                          {cert.issuer} | {formatDate(cert.date)}
                          {cert.credentialId ? ` | Credential ID: ${cert.credentialId}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects: name (+ link) then description and technologies (like exp: only show bullets when non-empty) */}
              {projects.length > 0 && (
                <div>
                  <h2 className={sectionTitleClass}>Projects</h2>
                  <div className="space-y-1">
                    {projects.map((proj, i) => {
                      const bulletPoints = (proj.bulletPoints ?? []).filter((point) => point.trim() !== '');
                      const hasTechnologies = proj.technologies && proj.technologies.length > 0;
                      const showBulletList = bulletPoints.length > 0 || hasTechnologies;
                      return (
                        <div key={i}>
                          <p className="font-bold">
                            {proj.name || '(Project)'}
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
                          {showBulletList ? (
                            <ul className="ml-4 list-disc space-y-0">
                              {bulletPoints.map((point, j) => (
                                <li key={j}>{point}</li>
                              ))}
                              {hasTechnologies && (
                                <li>Technologies: {proj.technologies!.join(', ')}</li>
                              )}
                            </ul>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
