'use client';

import { motion } from 'framer-motion';
import type { PersonalInfo } from '@resume-types/resume.types';
import type { ExperienceEntry, EducationEntry } from '@/types/builder.types';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

export interface ResumePreviewPanelProps {
  personalInfo: PersonalInfo | undefined;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  onExportPdf: () => void;
  onExportDocx: () => void;
}

export function ResumePreviewPanel({
  personalInfo: pi,
  summary,
  experience,
  education,
  skills,
  onExportPdf,
  onExportDocx,
}: ResumePreviewPanelProps) {
  const contactLine = [pi?.email, pi?.phone, pi?.location].filter(Boolean).join(' · ');
  const hasContent = pi?.name || contactLine || summary || experience.length > 0 || education.length > 0 || skills.length > 0;

  return (
    <div className="flex flex-col h-full bg-[#F0EDE6]">
      <p className="text-[11px] uppercase tracking-widest font-sans text-foreground/50 mb-4">PREVIEW</p>
      <ScrollArea className="flex-1">
        <div className="max-w-[680px] mx-auto py-8 px-6 lg:px-14 bg-white shadow-[0_4px_32px_rgba(0,0,0,0.08)]">
          {hasContent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {pi?.name && <h1 className="text-[28px] font-serif font-normal text-[#1A1714]">{pi.name}</h1>}
              {contactLine && <p className="text-[12px] font-sans text-[#1A1714]/50">{contactLine}</p>}
              {summary && (
                <div className="mt-6">
                  <p className="text-[11px] uppercase tracking-widest font-sans text-[#1A1714]/70">Summary</p>
                  <Separator className="mt-1 mb-2" />
                  <p className="text-[13px] font-sans leading-relaxed text-[#1A1714]">{summary}</p>
                </div>
              )}
              {experience.length > 0 && (
                <div className="mt-6">
                  <p className="text-[11px] uppercase tracking-widest font-sans text-[#1A1714]/70">Experience</p>
                  <Separator className="mt-1 mb-3" />
                  <div className="space-y-4">
                    {experience.map((exp, i) => (
                      <div key={i}>
                        <p className="text-[14px] font-serif font-medium text-[#1A1714]">{exp.role || '(Role)'}</p>
                        <div className="flex justify-between text-[12px] font-sans text-[#1A1714]/50">
                          <span>{exp.company}</span>
                          <span>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</span>
                        </div>
                        {(exp.bulletPoints?.length && exp.bulletPoints[0]) ? (
                          <ul className="mt-1 text-[13px] font-sans leading-relaxed text-[#1A1714] list-none pl-0">
                            {exp.bulletPoints.filter(Boolean).map((b, j) => (
                              <li key={j}>– {b}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {education.length > 0 && (
                <div className="mt-6">
                  <p className="text-[11px] uppercase tracking-widest font-sans text-[#1A1714]/70">Education</p>
                  <Separator className="mt-1 mb-3" />
                  <div className="space-y-2">
                    {education.map((edu, i) => (
                      <div key={i}>
                        <p className="text-[14px] font-serif font-medium text-[#1A1714]">{edu.degree}{edu.institution ? `, ${edu.institution}` : ''}</p>
                        <p className="text-[12px] font-sans text-[#1A1714]/50">{edu.graduationDate}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {skills.length > 0 && (
                <div className="mt-6">
                  <p className="text-[11px] uppercase tracking-widest font-sans text-[#1A1714]/70">Skills</p>
                  <Separator className="mt-1 mb-2" />
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s, i) => (
                      <Badge key={i} variant="outline" className="text-[12px] font-sans">{s}</Badge>
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
