'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Plus,
  Upload,
  Trash2,
  X,
} from 'lucide-react';
import type { Resume, Experience, Education, Project, Certification } from '@resume-types/resume.types';
import type { ExperienceEntry, EducationEntry, ProjectEntry, CertificationEntry, SectionId } from '@/types/builder.types';
import { DEFAULT_SECTION_OPEN } from '@/types/builder.types';
import { parseDocument } from '@/utils/documentParser';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

const IMPORT_STORAGE_KEY = 'imported-resume';
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
    description: '',
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
  skills: string[];
};

function resumeToExportResume(
  resume: Partial<Resume>,
  skills: string[]
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
  if (skills.length > 0) {
    out.skills = { categories: [{ name: 'Skills', items: skills }] };
  }
  return out;
}

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [resume, setResume] = useState<Partial<Resume>>({});
  const [skills, setSkills] = useState<string[]>([]);
  const [sectionOpen, setSectionOpen] = useState<Record<string, boolean>>(DEFAULT_SECTION_OPEN);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importJustDone, setImportJustDone] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [savedVisible, setSavedVisible] = useState(false);
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
    skills.length > 0 ||
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
            (r as { projects: (Project & { id?: string })[] }).projects = r.projects.map((p) => ({ ...p, id: (p as ProjectEntry).id ?? crypto.randomUUID() }));
          }
          if (Array.isArray(r.certifications)) {
            (r as { certifications: (Certification & { id?: string })[] }).certifications = r.certifications.map((c) => ({ ...c, id: (c as CertificationEntry).id ?? crypto.randomUUID() }));
          }
          setResume(r);
        }
        if (Array.isArray(draft.skills)) setSkills(draft.skills);
      } catch (_) {}
    }
  }, []);

  useEffect(() => {
    const isImported = searchParams.get('imported') === 'true';
    if (!isImported) return;
    try {
      const stored = typeof window !== 'undefined' ? sessionStorage.getItem(IMPORT_STORAGE_KEY) : null;
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<Resume>;
        setResume(parsed);
        sessionStorage.removeItem(IMPORT_STORAGE_KEY);
        setImportJustDone(true);
        setTimeout(() => setImportJustDone(false), 2000);
      }
    } catch (e) {
      console.error(e);
    }
    router.replace('/builder');
  }, [searchParams, router]);

  useEffect(() => {
    if (!hasData && !resume.personalInfo && !resume.summary && experience.length === 0) return;
    const t = setTimeout(() => {
      const draft: DraftData = { resume, skills };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }, 1000);
    return () => clearTimeout(t);
  }, [resume, skills, hasData]);

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

  const addSkill = (skill: string) => {
    const t = skill.trim();
    if (!t) return;
    setSkills((prev) => (prev.includes(t) ? prev : [...prev, t]));
    scheduleSavedIndicator();
  };

  const removeSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
    scheduleSavedIndicator();
  };

  const clearAll = () => {
    setResume({});
    setSkills([]);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setShowClearConfirm(false);
  };

  const handleImportSuccess = (parsed: Partial<Resume>) => {
    setResume(parsed);
    setShowImportDialog(false);
    setImportError(null);
    setImportProgress(0);
    setImportJustDone(true);
    setTimeout(() => setImportJustDone(false), 2000);
  };

  const handleExportPdf = () => {
    // Export API to be implemented later
    alert('PDF export coming soon.');
  };

  const handleExportDocx = () => {
    // Export API to be implemented later
    alert('DOCX export coming soon.');
  };

  const labelClass = 'text-[10px] uppercase tracking-widest font-sans text-foreground/70 mb-1.5 block';

  const leftPanel = (
    <div className="flex flex-col h-full">
      <p className="text-[11px] uppercase tracking-widest font-sans text-foreground/50 mb-3">
        YOUR INFORMATION
      </p>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setShowImportDialog(true); setImportError(null); }}>
            <Upload className="h-4 w-4 mr-1.5" />
            Import Resume
          </Button>
          {hasData && (
            <Button variant="ghost" size="sm" className="text-foreground/60" onClick={() => setShowClearConfirm(true)}>
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
      {showClearConfirm && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="text-foreground/70 font-sans">Are you sure?</span>
          <Button variant="ghost" size="sm" onClick={clearAll}>Confirm</Button>
          <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
        </div>
      )}
      <ScrollArea className="flex-1 pr-3 -mr-3">
        <div className="space-y-1 pb-24">
          {/* CONTACT */}
          <Collapsible open={sectionOpen.contact} onOpenChange={() => toggleSection('contact')}>
            <CollapsibleTrigger className="w-full flex items-center justify-between py-3 text-left">
              <span className="font-serif text-foreground">Contact</span>
              <motion.span animate={{ rotate: sectionOpen.contact ? 180 : 0 }}><ChevronDown className="h-4 w-4" /></motion.span>
            </CollapsibleTrigger>
            <Separator className="mb-3" />
            <CollapsibleContent>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-2 gap-3 overflow-hidden"
              >
                <div className="col-span-2">
                  <Label className={labelClass}>Full Name</Label>
                  <Input
                    value={pi?.name ?? ''}
                    onChange={(e) => handlePersonal('name', e.target.value)}
                    placeholder="John Doe"
                    className={importJustDone ? 'bg-[#FDF3EC]' : ''}
                  />
                </div>
                <div>
                  <Label className={labelClass}>Email</Label>
                  <Input
                    type="email"
                    value={pi?.email ?? ''}
                    onChange={(e) => handlePersonal('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label className={labelClass}>Phone</Label>
                  <Input
                    value={pi?.phone ?? ''}
                    onChange={(e) => handlePersonal('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="col-span-2">
                  <Label className={labelClass}>Location</Label>
                  <Input
                    value={pi?.location ?? ''}
                    onChange={(e) => handlePersonal('location', e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <Label className={labelClass}>LinkedIn</Label>
                  <Input
                    value={pi?.linkedin ?? ''}
                    onChange={(e) => handlePersonal('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <Label className={labelClass}>Portfolio</Label>
                  <Input
                    value={pi?.website ?? pi?.github ?? ''}
                    onChange={(e) => handlePersonal('website', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* SUMMARY */}
          <Collapsible open={sectionOpen.summary} onOpenChange={() => toggleSection('summary')}>
            <CollapsibleTrigger className="w-full flex items-center justify-between py-3 text-left">
              <span className="font-serif text-foreground">Summary</span>
              <motion.span animate={{ rotate: sectionOpen.summary ? 180 : 0 }}><ChevronDown className="h-4 w-4" /></motion.span>
            </CollapsibleTrigger>
            <Separator className="mb-3" />
            <CollapsibleContent>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden space-y-2">
                <Label className={labelClass}>Professional summary</Label>
                <Textarea
                  className="min-h-[96px]"
                  value={resume.summary ?? ''}
                  onChange={(e) => setResumeAndMarkSave((p) => ({ ...p, summary: e.target.value }))}
                  placeholder="A brief professional summary in your own words..."
                />
                <p className="text-xs text-foreground/50 font-sans">2–3 sentences works best.</p>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* EXPERIENCE */}
          <Collapsible open={sectionOpen.experience} onOpenChange={() => toggleSection('experience')}>
            <CollapsibleTrigger className="w-full flex items-center justify-between py-3 text-left">
              <span className="font-serif text-foreground">Experience</span>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); addExperience(); }}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add position</TooltipContent>
                </Tooltip>
                <motion.span animate={{ rotate: sectionOpen.experience ? 180 : 0 }}><ChevronDown className="h-4 w-4" /></motion.span>
              </div>
            </CollapsibleTrigger>
            <Separator className="mb-3" />
            <CollapsibleContent>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden space-y-6">
                {experience.length === 0 ? (
                  <p className="text-sm text-foreground/50 font-sans">No experience yet. Click + to add.</p>
                ) : (
                  experience.map((exp, idx) => (
                    <div key={'id' in exp ? (exp as ExperienceEntry).id : idx} className="relative space-y-3">
                      <div className="absolute top-0 right-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeExperience(idx)}><Trash2 className="h-4 w-4" /></Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove</TooltipContent>
                        </Tooltip>
                      </div>
                      <Separator className="mb-3" />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <Label className={labelClass}>Job Title</Label>
                          <Input value={exp.role} onChange={(e) => setExperienceAt(idx, (entry) => ({ ...entry, role: e.target.value }))} />
                        </div>
                        <div>
                          <Label className={labelClass}>Company</Label>
                          <Input value={exp.company} onChange={(e) => setExperienceAt(idx, (entry) => ({ ...entry, company: e.target.value }))} />
                        </div>
                        <div>
                          <Label className={labelClass}>Location</Label>
                          <Input
                            value={exp.location ?? ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              setExperienceAt(idx, (entry) => ({ ...entry, location: value }));
                            }}
                            placeholder="e.g. San Francisco, CA"
                          />
                        </div>
                        <div>
                          <Label className={labelClass}>Start Date</Label>
                          <Input value={exp.startDate} onChange={(e) => setExperienceAt(idx, (entry) => ({ ...entry, startDate: e.target.value }))} placeholder="YYYY-MM" />
                        </div>
                        <div>
                          {exp.endDate !== 'Present' && (
                            <>
                              <Label className={labelClass}>End Date</Label>
                              <Input value={exp.endDate} onChange={(e) => setExperienceAt(idx, (entry) => ({ ...entry, endDate: e.target.value }))} placeholder="YYYY-MM" />
                            </>
                          )}
                          <div className="flex items-center gap-2 pt-6">
                            <Checkbox
                              id={`current-role-${idx}`}
                              checked={exp.endDate === 'Present'}
                              onCheckedChange={(checked) => setExperienceAt(idx, (entry) => ({ ...entry, endDate: checked ? 'Present' : '' }))}
                            />
                            <Label htmlFor={`current-role-${idx}`} className="text-sm font-sans">Current role</Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className={labelClass}>Bullet points (one per line)</Label>
                        <Textarea
                          className="min-h-[80px]"
                          value={(exp.bulletPoints || []).join('\n')}
                          onChange={(e) => setExperienceAt(idx, (entry) => ({ ...entry, bulletPoints: e.target.value.split('\n').filter(Boolean).length ? e.target.value.split('\n') : [''] }))}
                        />
                      </div>
                    </div>
                  ))
                )}
                <Button variant="ghost" size="sm" onClick={addExperience}><Plus className="h-4 w-4 mr-1" /> Add position</Button>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* EDUCATION */}
          <Collapsible open={sectionOpen.education} onOpenChange={() => toggleSection('education')}>
            <CollapsibleTrigger className="w-full flex items-center justify-between py-3 text-left">
              <span className="font-serif text-foreground">Education</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); addEducation(); }}><Plus className="h-4 w-4" /></Button>
                <motion.span animate={{ rotate: sectionOpen.education ? 180 : 0 }}><ChevronDown className="h-4 w-4" /></motion.span>
              </div>
            </CollapsibleTrigger>
            <Separator className="mb-3" />
            <CollapsibleContent>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden space-y-6">
                {education.length === 0 ? (
                  <p className="text-sm text-foreground/50 font-sans">No education yet. Click + to add.</p>
                ) : (
                  education.map((edu, idx) => (
                    <div key={(edu as EducationEntry).id ?? idx} className="relative space-y-3">
                      <div className="absolute top-0 right-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeEducation(idx)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                      <Separator className="mb-3" />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <Label className={labelClass}>Degree</Label>
                          <Input value={edu.degree} onChange={(e) => setEducationAt(idx, (eduEntry) => ({ ...eduEntry, degree: e.target.value }))} />
                        </div>
                        <div className="col-span-2">
                          <Label className={labelClass}>Institution</Label>
                          <Input value={edu.institution} onChange={(e) => setEducationAt(idx, (eduEntry) => ({ ...eduEntry, institution: e.target.value }))} />
                        </div>
                        <div>
                          <Label className={labelClass}>Graduation Year</Label>
                          <Input value={edu.graduationDate} onChange={(e) => setEducationAt(idx, (eduEntry) => ({ ...eduEntry, graduationDate: e.target.value }))} placeholder="YYYY" />
                        </div>
                        <div>
                          <Label className={labelClass}>GPA</Label>
                          <Input value={edu.gpa ?? ''} onChange={(e) => setEducationAt(idx, (eduEntry) => ({ ...eduEntry, gpa: e.target.value }))} placeholder="Optional" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <Button variant="ghost" size="sm" onClick={addEducation}><Plus className="h-4 w-4 mr-1" /> Add education</Button>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* SKILLS */}
          <Collapsible open={sectionOpen.skills} onOpenChange={() => toggleSection('skills')}>
            <CollapsibleTrigger className="w-full flex items-center justify-between py-3 text-left">
              <span className="font-serif text-foreground">Skills</span>
              <motion.span animate={{ rotate: sectionOpen.skills ? 180 : 0 }}><ChevronDown className="h-4 w-4" /></motion.span>
            </CollapsibleTrigger>
            <Separator className="mb-3" />
            <CollapsibleContent>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden space-y-2">
                <Input
                  placeholder="Type a skill and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      addSkill(input.value);
                      input.value = '';
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <Badge key={s} variant="outline" className="gap-1">
                      {s}
                      <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => removeSkill(i)}><X className="h-3 w-3" /></Button>
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-foreground/50 font-sans">Press Enter to add each skill.</p>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* PROJECTS */}
          <Collapsible open={sectionOpen.projects} onOpenChange={() => toggleSection('projects')} defaultOpen={false}>
            <CollapsibleTrigger className="w-full flex items-center justify-between py-3 text-left">
              <span className="font-serif text-foreground">Projects</span>
              <div className="flex items-center gap-1">
                <Badge variant="outline">Optional</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); addProject(); }}><Plus className="h-4 w-4" /></Button>
                <motion.span animate={{ rotate: sectionOpen.projects ? 180 : 0 }}><ChevronDown className="h-4 w-4" /></motion.span>
              </div>
            </CollapsibleTrigger>
            <Separator className="mb-3" />
            <CollapsibleContent>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden space-y-6">
                {projects.map((proj, idx) => (
                  <div key={(proj as ProjectEntry).id ?? idx} className="relative space-y-3">
                    <div className="absolute top-0 right-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeProject(idx)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <Separator className="mb-3" />
                    <div className="space-y-3">
                      <Label className={labelClass}>Project Name</Label>
                      <Input value={proj.name} onChange={(e) => setProjectAt(idx, (p) => ({ ...p, name: e.target.value }))} />
                      <Label className={labelClass}>URL</Label>
                      <Input value={proj.url ?? ''} onChange={(e) => setProjectAt(idx, (p) => ({ ...p, url: e.target.value }))} />
                      <Label className={labelClass}>Description</Label>
                      <Textarea value={proj.description} onChange={(e) => setProjectAt(idx, (p) => ({ ...p, description: e.target.value }))} className="min-h-[80px]" />
                      <Label className={labelClass}>Tech stack (Enter to add)</Label>
                      <Input
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const v = (e.target as HTMLInputElement).value.trim();
                            if (v) setProjectAt(idx, (p) => ({ ...p, technologies: [...(p.technologies || []), v] }));
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <div className="flex flex-wrap gap-2">
                        {(proj.technologies || []).map((t, i) => (
                          <Badge key={t} variant="outline" className="gap-1">
                            {t}
                            <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => setProjectAt(idx, (p) => ({ ...p, technologies: (p.technologies || []).filter((_, j) => j !== i) }))}><X className="h-3 w-3" /></Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={addProject}><Plus className="h-4 w-4 mr-1" /> Add project</Button>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* CERTIFICATIONS */}
          <Collapsible open={sectionOpen.certifications} onOpenChange={() => toggleSection('certifications')} defaultOpen={false}>
            <CollapsibleTrigger className="w-full flex items-center justify-between py-3 text-left">
              <span className="font-serif text-foreground">Certifications</span>
              <div className="flex items-center gap-1">
                <Badge variant="outline">Optional</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); addCertification(); }}><Plus className="h-4 w-4" /></Button>
                <motion.span animate={{ rotate: sectionOpen.certifications ? 180 : 0 }}><ChevronDown className="h-4 w-4" /></motion.span>
              </div>
            </CollapsibleTrigger>
            <Separator className="mb-3" />
            <CollapsibleContent>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden space-y-6">
                {certifications.map((cert, idx) => (
                  <div key={(cert as CertificationEntry).id ?? idx} className="relative grid grid-cols-2 gap-3">
                    <div className="absolute top-0 right-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeCertification(idx)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <Separator className="col-span-2 mb-3" />
                    <div className="col-span-2">
                      <Label className={labelClass}>Name</Label>
                      <Input value={cert.name} onChange={(e) => setCertAt(idx, (c) => ({ ...c, name: e.target.value }))} />
                    </div>
                    <div>
                      <Label className={labelClass}>Issuer</Label>
                      <Input value={cert.issuer} onChange={(e) => setCertAt(idx, (c) => ({ ...c, issuer: e.target.value }))} />
                    </div>
                    <div>
                      <Label className={labelClass}>Year</Label>
                      <Input value={cert.date} onChange={(e) => setCertAt(idx, (c) => ({ ...c, date: e.target.value }))} placeholder="YYYY" />
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={addCertification}><Plus className="h-4 w-4 mr-1" /> Add certification</Button>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );

  const contactLine = [pi?.email, pi?.phone, pi?.location].filter(Boolean).join(' · ');

  const rightPanel = (
    <div className="flex flex-col h-full bg-[#F0EDE6]">
      <p className="text-[11px] uppercase tracking-widest font-sans text-foreground/50 mb-4">PREVIEW</p>
      <ScrollArea className="flex-1">
        <div className="max-w-[680px] mx-auto py-8 px-6 lg:px-14 bg-white shadow-[0_4px_32px_rgba(0,0,0,0.08)]">
          {(pi?.name || contactLine || resume.summary || experience.length > 0 || education.length > 0 || skills.length > 0) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {pi?.name && <h1 className="text-[28px] font-serif font-normal text-[#1A1714]">{pi.name}</h1>}
              {contactLine && <p className="text-[12px] font-sans text-[#1A1714]/50">{contactLine}</p>}
              {resume.summary && (
                <>
                  <div className="mt-6">
                    <p className="text-[11px] uppercase tracking-widest font-sans text-[#1A1714]/70">Summary</p>
                    <Separator className="mt-1 mb-2" />
                    <p className="text-[13px] font-sans leading-relaxed text-[#1A1714]">{resume.summary}</p>
                  </div>
                </>
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
          <Button variant="default" size="sm" onClick={handleExportPdf}>
            Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportDocx}>
            Download DOCX
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="bg-background min-h-screen lg:h-screen flex flex-col lg:flex-row">
        {/* Desktop: two panels */}
        <div className="hidden lg:flex lg:w-[40%] lg:min-w-0 lg:h-screen lg:sticky lg:top-0 lg:border-r border-[#D6D0C8] lg:flex-col lg:px-6 lg:py-6">
          {leftPanel}
        </div>
        <div className="hidden lg:block lg:w-[1px] lg:shrink-0 lg:h-screen lg:bg-[#D6D0C8]" aria-hidden />
        <div className="hidden lg:flex lg:w-[60%] lg:min-w-0 lg:h-screen lg:sticky lg:top-0 lg:flex-col lg:px-6 lg:py-6">
          {rightPanel}
        </div>

        {/* Mobile: single column with Edit | Preview tabs */}
        <div className="lg:hidden flex flex-col flex-1 min-h-screen">
          <AnimatePresence mode="wait">
            {mobilePanel === 'edit' ? (
              <motion.div key="edit" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1 px-4 py-4">
                {leftPanel}
              </motion.div>
            ) : (
              <motion.div key="preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 overflow-hidden">
                {rightPanel}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="sticky bottom-0 border-t border-[#D6D0C8] bg-[#FAF9F6] flex">
            <Button variant="ghost" className={mobilePanel === 'edit' ? 'border-b-2 border-primary' : ''} onClick={() => setMobilePanel('edit')}>Edit</Button>
            <Button variant="ghost" className={mobilePanel === 'preview' ? 'border-b-2 border-primary' : ''} onClick={() => setMobilePanel('preview')}>Preview</Button>
          </div>
        </div>
      </div>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-[480px] bg-[#FAF9F6] border-[#D6D0C8]">
          <DialogHeader>
            <DialogTitle className="font-serif">Import your resume</DialogTitle>
            <DialogDescription>We'll extract your information and pre-fill the form.</DialogDescription>
          </DialogHeader>
          <div
            className="border border-dashed border-[#D6D0C8] rounded-sm p-8 text-center cursor-pointer"
            onClick={() => document.getElementById('import-file-input')?.click()}
          >
            <input
              id="import-file-input"
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImportError(null);
                setImportProgress(10);
                try {
                  const parsed = await parseDocument({
                    file,
                    onProgress: setImportProgress,
                  });
                  setImportProgress(100);
                  handleImportSuccess(parsed);
                } catch (err) {
                  setImportError(err instanceof Error ? err.message : 'Import failed.');
                }
                e.target.value = '';
              }}
            />
            <Upload className="h-10 w-10 mx-auto text-foreground/50 mb-2" />
            <p className="font-serif text-foreground mb-1">Drop PDF or DOCX here</p>
            <p className="text-sm font-sans text-foreground/50 mb-1">or click to browse</p>
            <p className="text-[10px] uppercase tracking-widest font-sans text-foreground/40">PDF or DOCX · Max 10MB</p>
            {importProgress > 0 && importProgress < 100 && (
              <div className="mt-4 h-1 bg-foreground/10 rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${importProgress}%` }} transition={{ duration: 0.2 }} />
              </div>
            )}
          </div>
          {importError && <p className="text-sm text-red-600 font-sans">{importError}</p>}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
