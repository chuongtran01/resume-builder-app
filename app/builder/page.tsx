'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { Resume, Experience, Education, Project, Certification, SkillCategory } from '@resume-types/resume.types';
import type { ExperienceEntry, EducationEntry, ProjectEntry, CertificationEntry, SectionId } from '@/types/builder.types';
import { DEFAULT_SECTION_OPEN } from '@/types/builder.types';
import { generateResume } from '@/lib/api-client';
import { BuilderFormPanel } from '@/components/builder/builder-form-panel';
import { ResumePreviewPanel } from '@/components/builder/resume-preview-panel';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';

const DRAFT_STORAGE_KEY = 'resume-builder-draft';

function newExp(): ExperienceEntry {
  return {
    id: crypto.randomUUID(),
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    location: '',
    bulletPoints: [''],
  };
}

function newEdu(): EducationEntry {
  return {
    id: crypto.randomUUID(),
    institution: '',
    degree: '',
    field: '',
    graduationDate: '',
    gpa: '',
  };
}

function newProj(): ProjectEntry {
  return {
    id: crypto.randomUUID(),
    name: '',
    bulletPoints: [''],
    url: '',
    technologies: [],
  };
}

function newCert(): CertificationEntry {
  return {
    id: crypto.randomUUID(),
    name: '',
    issuer: '',
    date: '',
  };
}

type DraftData = {
  resume: Partial<Resume>;
  skillCategories: SkillCategory[];
};

function resumeToExportResume(
  resume: Partial<Resume>,
  skillCategories: SkillCategory[]
): Partial<Resume> {
  const out = { ...resume } as Partial<Resume> & { experience?: (Experience & { id?: string })[]; education?: (Education & { id?: string })[]; projects?: (Project & { id?: string })[]; certifications?: (Certification & { id?: string })[] };
  if (out.experience?.length) {
    out.experience = (out.experience as (Experience & { id?: string })[]).map((entry) => {
      const { id: _id, ...e } = entry;
      return e;
    });
  }
  if (out.education && Array.isArray(out.education)) {
    out.education = (out.education as (Education & { id?: string })[]).map((entry) => {
      const { id: _id, ...e } = entry;
      return e;
    });
  }
  if (out.projects?.length) {
    out.projects = (out.projects as (Project & { id?: string })[]).map((entry) => {
      const { id: _id, ...p } = entry;
      return p;
    });
  }
  if (out.certifications?.length) {
    out.certifications = (out.certifications as (Certification & { id?: string })[]).map((entry) => {
      const { id: _id, ...c } = entry;
      return c;
    });
  }
  const nonEmpty = skillCategories.filter((c) => c.items.length > 0);
  if (nonEmpty.length > 0) {
    out.skills = { categories: nonEmpty };
  }
  return out;
}

export default function BuilderPage() {
  const [resume, setResume] = useState<Partial<Resume>>({});
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([{ name: 'Skills', items: [] }]);
  const [sectionOpen, setSectionOpen] = useState<Record<string, boolean>>(DEFAULT_SECTION_OPEN);
  const [savedVisible, setSavedVisible] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<'edit' | 'preview'>('edit');
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSavedIndicator = useCallback(() => {
    setSavedVisible(false);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setSavedVisible(true);
      saveTimeoutRef.current = null;
    }, 1000);
  }, []);

  const setResumeAndMarkSave = useCallback((updater: (prev: Partial<Resume>) => Partial<Resume>) => {
    setResume(updater);
    scheduleSavedIndicator();
  }, [scheduleSavedIndicator]);

  const experience = (resume.experience || []) as ExperienceEntry[];
  const education = (resume.education as EducationEntry[] | undefined) ?? [];
  const projects = (resume.projects as ProjectEntry[] | undefined) ?? [];
  const certifications = (resume.certifications as CertificationEntry[] | undefined) ?? [];

  const hasData =
    !!resume.personalInfo?.name ||
    !!resume.personalInfo?.email ||
    !!resume.personalInfo?.phone ||
    !!resume.personalInfo?.location ||
    !!resume.summary ||
    (experience.length > 0 && (experience[0]?.company || experience[0]?.role)) ||
    education.length > 0 ||
    skillCategories.some((c) => c.items.length > 0) ||
    projects.length > 0 ||
    certifications.length > 0;

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(DRAFT_STORAGE_KEY) : null;
    if (raw) {
      try {
        const draft: DraftData = JSON.parse(raw);
        if (draft.resume) {
          const r = { ...draft.resume };
          if (Array.isArray(r.experience)) {
            (r as { experience: (Experience & { id?: string })[] }).experience = r.experience.map((e) => ({ ...e, id: (e as ExperienceEntry).id ?? crypto.randomUUID() }));
          }
          if (Array.isArray(r.education)) {
            (r as { education: (Education & { id?: string })[] }).education = r.education.map((e) => ({ ...e, id: (e as EducationEntry).id ?? crypto.randomUUID() }));
          }
          if (Array.isArray(r.projects)) {
            (r as { projects: (Project & { id?: string })[] }).projects = r.projects.map((p) => ({
              ...p,
              id: (p as ProjectEntry).id ?? crypto.randomUUID(),
              bulletPoints: p.bulletPoints ?? ((p as unknown as { description?: string }).description ? [(p as unknown as { description: string }).description] : ['']),
            }));
          }
          if (Array.isArray(r.certifications)) {
            (r as { certifications: (Certification & { id?: string })[] }).certifications = r.certifications.map((c) => ({ ...c, id: (c as CertificationEntry).id ?? crypto.randomUUID() }));
          }
          setResume(r);
        }
        if (Array.isArray(draft.skillCategories) && draft.skillCategories.length > 0) {
          setSkillCategories(draft.skillCategories);
        } else {
          const legacy = draft as unknown as { skills?: string[] };
          if (Array.isArray(legacy.skills)) {
            setSkillCategories([{ name: 'Skills', items: legacy.skills }]);
          }
        }
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    if (!hasData && !resume.personalInfo && !resume.summary && experience.length === 0) return;
    const t = setTimeout(() => {
      const draft: DraftData = { resume, skillCategories };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }, 1000);
    return () => clearTimeout(t);
  }, [resume, skillCategories, hasData]);

  const toggleSection = (id: SectionId) => {
    setSectionOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePersonal = (field: string, value: string) => {
    setResumeAndMarkSave((prev) => ({
      ...prev,
      personalInfo: { ...(prev.personalInfo as object), [field]: value } as unknown as Resume['personalInfo'],
    }));
  };

  const pi = resume.personalInfo;

  const setExperienceAt = (index: number, updater: (e: ExperienceEntry) => ExperienceEntry) => {
    const list = [...experience];
    if (!list[index]) return;
    list[index] = updater(list[index] as ExperienceEntry);
    setResumeAndMarkSave((prev) => ({ ...prev, experience: list }));
  };

  const addExperience = () => {
    setResumeAndMarkSave((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), newExp()],
    }));
  };

  const removeExperience = (index: number) => {
    const list = experience.filter((_, i) => i !== index);
    setResumeAndMarkSave((prev) => ({ ...prev, experience: list }));
  };

  const setEducationAt = (index: number, updater: (e: EducationEntry) => EducationEntry) => {
    const list = [...education];
    if (!list[index]) return;
    list[index] = updater(list[index] as EducationEntry);
    setResumeAndMarkSave((prev) => ({ ...prev, education: list }));
  };

  const addEducation = () => {
    setResumeAndMarkSave((prev) => ({
      ...prev,
      education: [...education, newEdu()],
    }));
  };

  const removeEducation = (index: number) => {
    const list = education.filter((_, i) => i !== index);
    setResumeAndMarkSave((prev) => ({ ...prev, education: list }));
  };

  const setProjectAt = (index: number, updater: (p: ProjectEntry) => ProjectEntry) => {
    const list = [...projects];
    if (!list[index]) return;
    list[index] = updater(list[index] as ProjectEntry);
    setResumeAndMarkSave((prev) => ({ ...prev, projects: list }));
  };

  const addProject = () => {
    setResumeAndMarkSave((prev) => ({
      ...prev,
      projects: [...projects, newProj()],
    }));
  };

  const removeProject = (index: number) => {
    const list = projects.filter((_, i) => i !== index);
    setResumeAndMarkSave((prev) => ({ ...prev, projects: list }));
  };

  const setCertAt = (index: number, updater: (c: CertificationEntry) => CertificationEntry) => {
    const list = [...certifications];
    if (!list[index]) return;
    list[index] = updater(list[index] as CertificationEntry);
    setResumeAndMarkSave((prev) => ({ ...prev, certifications: list }));
  };

  const addCertification = () => {
    setResumeAndMarkSave((prev) => ({
      ...prev,
      certifications: [...certifications, newCert()],
    }));
  };

  const removeCertification = (index: number) => {
    const list = certifications.filter((_, i) => i !== index);
    setResumeAndMarkSave((prev) => ({ ...prev, certifications: list }));
  };

  const addCategory = () => {
    setSkillCategories((prev) => [...prev, { name: 'New Category', items: [] }]);
    scheduleSavedIndicator();
  };

  const removeCategory = (index: number) => {
    setSkillCategories((prev) => prev.filter((_, i) => i !== index));
    scheduleSavedIndicator();
  };

  const setCategoryAt = (index: number, updater: (c: SkillCategory) => SkillCategory) => {
    const list = [...skillCategories];
    if (!list[index]) return;
    list[index] = updater(list[index]);
    setSkillCategories(list);
    scheduleSavedIndicator();
  };

  const addSkillInCategory = (categoryIndex: number, skill: string) => {
    const t = skill.trim();
    if (!t) return;
    setCategoryAt(categoryIndex, (cat) =>
      cat.items.includes(t) ? cat : { ...cat, items: [...cat.items, t] }
    );
  };

  const removeSkillInCategory = (categoryIndex: number, itemIndex: number) => {
    setCategoryAt(categoryIndex, (cat) => ({
      ...cat,
      items: cat.items.filter((_, i) => i !== itemIndex),
    }));
  };

  const handleExportPdf = async () => {
    const payload = resumeToExportResume(resume, skillCategories);
    if (!payload.experience?.length) {
      toast.error('Add at least one experience to download PDF.');
      return;
    }
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      const blob = await generateResume(payload as Resume, { template: 'classic', format: 'pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Resume downloaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate PDF');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportDocx = () => {
    toast.info('DOCX export coming soon.');
  };

  const formPanelProps = {
    personalInfo: pi,
    summary: resume.summary ?? '',
    skillCategories,
    experience,
    education,
    projects,
    certifications,
    sectionOpen,
    savedVisible,
    toggleSection,
    onPersonalChange: handlePersonal,
    onSummaryChange: (value: string) => setResumeAndMarkSave((p) => ({ ...p, summary: value })),
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
  };

  const previewPanelProps = {
    personalInfo: pi,
    summary: resume.summary ?? '',
    experience,
    education,
    skillCategories,
    projects,
    certifications,
    onExportPdf: handleExportPdf,
    onExportDocx: handleExportDocx,
    isExportingPdf,
  };

  return (
    <TooltipProvider>
      <div className="bg-background min-h-screen lg:h-screen flex flex-col lg:flex-row">
        {/* Desktop: two panels */}
        <div className="hidden lg:flex lg:w-[40%] lg:min-w-0 lg:h-screen lg:sticky lg:top-0 lg:border-r border-[#D6D0C8] lg:flex-col lg:px-6 lg:py-6">
          <BuilderFormPanel {...formPanelProps} />
        </div>
        <div className="hidden lg:block lg:w-[1px] lg:shrink-0 lg:h-screen lg:bg-[#D6D0C8]" aria-hidden />
        <div className="hidden lg:flex lg:w-[60%] lg:min-w-0 lg:h-screen lg:sticky lg:top-0 lg:flex-col lg:px-6 lg:py-6">
          <ResumePreviewPanel {...previewPanelProps} />
        </div>

        {/* Mobile: single column with Edit | Preview tabs */}
        <div className="lg:hidden flex flex-col flex-1 min-h-screen">
          <AnimatePresence mode="wait">
            {mobilePanel === 'edit' ? (
              <motion.div key="edit" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1 px-4 py-4">
                <BuilderFormPanel {...formPanelProps} />
              </motion.div>
            ) : (
              <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 overflow-hidden">
                <ResumePreviewPanel {...previewPanelProps} />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="sticky bottom-0 border-t border-[#D6D0C8] bg-[#FAF9F6] flex">
            <Button variant="ghost" className={mobilePanel === 'edit' ? 'border-b-2 border-primary' : ''} onClick={() => setMobilePanel('edit')}>Edit</Button>
            <Button variant="ghost" className={mobilePanel === 'preview' ? 'border-b-2 border-primary' : ''} onClick={() => setMobilePanel('preview')}>Preview</Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
