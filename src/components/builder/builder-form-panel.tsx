'use client';

import { motion } from 'framer-motion';
import type { PersonalInfo, SkillCategory } from '@resume-types/resume.types';
import type { ExperienceEntry, EducationEntry, ProjectEntry, CertificationEntry, SectionId } from '@/types/builder.types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ContactSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  ProjectsSection,
  CertificationsSection,
} from '@/components/builder/sections';

export interface BuilderFormPanelProps {
  personalInfo: PersonalInfo | undefined;
  summary: string;
  skillCategories: SkillCategory[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  sectionOpen: Record<string, boolean>;
  hasData: boolean;
  savedVisible: boolean;
  onRequestClearAll: () => void;
  toggleSection: (id: SectionId) => void;
  onPersonalChange: (field: string, value: string) => void;
  onSummaryChange: (value: string) => void;
  setExperienceAt: (index: number, updater: (e: ExperienceEntry) => ExperienceEntry) => void;
  addExperience: () => void;
  removeExperience: (index: number) => void;
  setEducationAt: (index: number, updater: (e: EducationEntry) => EducationEntry) => void;
  addEducation: () => void;
  removeEducation: (index: number) => void;
  setProjectAt: (index: number, updater: (p: ProjectEntry) => ProjectEntry) => void;
  addProject: () => void;
  removeProject: (index: number) => void;
  setCertAt: (index: number, updater: (c: CertificationEntry) => CertificationEntry) => void;
  addCertification: () => void;
  removeCertification: (index: number) => void;
  addCategory: () => void;
  removeCategory: (index: number) => void;
  setCategoryAt: (index: number, updater: (c: SkillCategory) => SkillCategory) => void;
  addSkillInCategory: (categoryIndex: number, skill: string) => void;
  removeSkillInCategory: (categoryIndex: number, itemIndex: number) => void;
}

export function BuilderFormPanel({
  personalInfo: pi,
  summary,
  skillCategories,
  experience,
  education,
  projects,
  certifications,
  sectionOpen,
  hasData,
  savedVisible,
  onRequestClearAll,
  toggleSection,
  onPersonalChange,
  onSummaryChange,
  setExperienceAt,
  addExperience,
  removeExperience,
  setEducationAt,
  addEducation,
  removeEducation,
  setProjectAt,
  addProject,
  removeProject,
  setCertAt,
  addCertification,
  removeCertification,
  addCategory,
  removeCategory,
  setCategoryAt,
  addSkillInCategory,
  removeSkillInCategory,
}: BuilderFormPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <p className="text-[11px] uppercase tracking-widest font-sans text-foreground/50 mb-3">
        YOUR INFORMATION
      </p>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex gap-2">
          {hasData && (
            <Button variant="ghost" size="sm" className="text-foreground/60" onClick={onRequestClearAll}>
              Clear All
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {savedVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 text-foreground/50 text-sm font-sans"
            >
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Saved
            </motion.div>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1 pr-3 -mr-3">
        <div className="space-y-4 pb-24">
          <ContactSection
            personalInfo={pi}
            open={!!sectionOpen.contact}
            onToggle={() => toggleSection('contact')}
            onChange={onPersonalChange}
          />
          <SummarySection
            summary={summary}
            open={!!sectionOpen.summary}
            onToggle={() => toggleSection('summary')}
            onSummaryChange={onSummaryChange}
          />
          <ExperienceSection
            experience={experience}
            open={!!sectionOpen.experience}
            onToggle={() => toggleSection('experience')}
            setExperienceAt={setExperienceAt}
            addExperience={addExperience}
            removeExperience={removeExperience}
          />
          <EducationSection
            education={education}
            open={!!sectionOpen.education}
            onToggle={() => toggleSection('education')}
            setEducationAt={setEducationAt}
            addEducation={addEducation}
            removeEducation={removeEducation}
          />
          <SkillsSection
            skillCategories={skillCategories}
            open={!!sectionOpen.skills}
            onToggle={() => toggleSection('skills')}
            addCategory={addCategory}
            removeCategory={removeCategory}
            setCategoryAt={setCategoryAt}
            addSkillInCategory={addSkillInCategory}
            removeSkillInCategory={removeSkillInCategory}
          />
          <ProjectsSection
            projects={projects}
            open={!!sectionOpen.projects}
            onToggle={() => toggleSection('projects')}
            setProjectAt={setProjectAt}
            addProject={addProject}
            removeProject={removeProject}
          />
          <CertificationsSection
            certifications={certifications}
            open={!!sectionOpen.certifications}
            onToggle={() => toggleSection('certifications')}
            setCertAt={setCertAt}
            addCertification={addCertification}
            removeCertification={removeCertification}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
