/**
 * Builder-specific types: repeatable entries with stable ids for React keys.
 */
import type { Experience, Education, Project, Certification } from '@resume-types/resume.types';

export type ExperienceEntry = Experience & { id: string };
export type EducationEntry = Education & { id: string };
export type ProjectEntry = Project & { id: string };
export type CertificationEntry = Certification & { id: string };

export type TemplateId = 'classic' | 'modern' | 'minimal';

export const SECTION_IDS = [
  'contact',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export const DEFAULT_SECTION_OPEN: Record<SectionId, boolean> = {
  contact: true,
  summary: true,
  experience: true,
  education: true,
  skills: true,
  projects: false,
  certifications: false,
};
