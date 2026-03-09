'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Plus, Trash2, Upload, X } from 'lucide-react';
import type { PersonalInfo } from '@resume-types/resume.types';
import type { ExperienceEntry, EducationEntry, ProjectEntry, CertificationEntry, SectionId } from '@/types/builder.types';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

const LABEL_CLASS = 'text-[10px] uppercase tracking-widest font-sans text-foreground/70 mb-1.5 block';

export interface BuilderFormPanelProps {
  personalInfo: PersonalInfo | undefined;
  summary: string;
  skills: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  sectionOpen: Record<string, boolean>;
  hasData: boolean;
  savedVisible: boolean;
  showClearConfirm: boolean;
  importJustDone: boolean;
  onImportClick: () => void;
  onRequestClearAll: () => void;
  onConfirmClearAll: () => void;
  onClearCancel: () => void;
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
  addSkill: (skill: string) => void;
  removeSkill: (index: number) => void;
}

export function BuilderFormPanel({
  personalInfo: pi,
  summary,
  skills,
  experience,
  education,
  projects,
  certifications,
  sectionOpen,
  hasData,
  savedVisible,
  showClearConfirm,
  importJustDone,
  onImportClick,
  onRequestClearAll,
  onConfirmClearAll,
  onClearCancel,
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
  addSkill,
  removeSkill,
}: BuilderFormPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <p className="text-[11px] uppercase tracking-widest font-sans text-foreground/50 mb-3">
        YOUR INFORMATION
      </p>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onImportClick}>
            <Upload className="h-4 w-4 mr-1.5" />
            Import Resume
          </Button>
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
      {showClearConfirm && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="text-foreground/70 font-sans">Are you sure?</span>
          <Button variant="ghost" size="sm" onClick={onConfirmClearAll}>Confirm</Button>
          <Button variant="ghost" size="sm" onClick={onClearCancel}>Cancel</Button>
        </div>
      )}
      <ScrollArea className="flex-1 pr-3 -mr-3">
        <div className="space-y-1 pb-24">
          {/* CONTACT */}
          <Collapsible open={sectionOpen.contact} onOpenChange={() => toggleSection('contact')}>
            <CollapsibleTrigger asChild>
              <div className="w-full flex items-center justify-between py-3 text-left cursor-pointer">
                <span className="font-serif text-foreground">Contact</span>
                <motion.span animate={{ rotate: sectionOpen.contact ? 180 : 0 }}><ChevronDown className="h-4 w-4" /></motion.span>
              </div>
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
                  <Label className={LABEL_CLASS}>Full Name</Label>
                  <Input
                    value={pi?.name ?? ''}
                    onChange={(e) => onPersonalChange('name', e.target.value)}
                    placeholder="John Doe"
                    className={importJustDone ? 'bg-[#FDF3EC]' : ''}
                  />
                </div>
                <div>
                  <Label className={LABEL_CLASS}>Email</Label>
                  <Input
                    type="email"
                    value={pi?.email ?? ''}
                    onChange={(e) => onPersonalChange('email', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label className={LABEL_CLASS}>Phone</Label>
                  <Input
                    value={pi?.phone ?? ''}
                    onChange={(e) => onPersonalChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="col-span-2">
                  <Label className={LABEL_CLASS}>Location</Label>
                  <Input
                    value={pi?.location ?? ''}
                    onChange={(e) => onPersonalChange('location', e.target.value)}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <Label className={LABEL_CLASS}>LinkedIn</Label>
                  <Input
                    value={pi?.linkedin ?? ''}
                    onChange={(e) => onPersonalChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <Label className={LABEL_CLASS}>Portfolio</Label>
                  <Input
                    value={pi?.website ?? pi?.github ?? ''}
                    onChange={(e) => onPersonalChange('website', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* SUMMARY */}
          <Collapsible open={sectionOpen.summary} onOpenChange={() => toggleSection('summary')}>
            <CollapsibleTrigger asChild>
              <div className="w-full flex items-center justify-between py-3 text-left cursor-pointer">
                <span className="font-serif text-foreground">Summary</span>
                <div className="flex items-center gap-1">
                  <Badge variant="outline">Optional</Badge>
                  <motion.span animate={{ rotate: sectionOpen.summary ? 180 : 0 }}><ChevronDown className="h-4 w-4" /></motion.span>
                </div>
              </div>
            </CollapsibleTrigger>
            <Separator className="mb-3" />
            <CollapsibleContent>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden space-y-2">
                <Label className={LABEL_CLASS}>Professional summary</Label>
                <Textarea
                  className="min-h-[96px]"
                  value={summary}
                  onChange={(e) => onSummaryChange(e.target.value)}
                  placeholder="A brief professional summary in your own words..."
                />
                <p className="text-xs text-foreground/50 font-sans">2–3 sentences works best.</p>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* EXPERIENCE */}
          <Collapsible open={sectionOpen.experience} onOpenChange={() => toggleSection('experience')}>
            <CollapsibleTrigger asChild>
              <div className="w-full flex items-center justify-between py-3 text-left cursor-pointer">
                <span className="font-serif text-foreground">Experience</span>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
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
              </div>
            </CollapsibleTrigger>
            <Separator className="mb-3" />
            <CollapsibleContent>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden space-y-6">
                {experience.length === 0 ? (
                  <p className="text-sm text-foreground/50 font-sans">No experience yet. Click + to add.</p>
                ) : (
                  experience.map((exp, idx) => (
                    <div key={'id' in exp ? exp.id : idx} className="relative space-y-3">
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
                          <Label className={LABEL_CLASS}>Job Title</Label>
                          <Input value={exp.role} onChange={(e) => setExperienceAt(idx, (entry) => ({ ...entry, role: e.target.value }))} />
                        </div>
                        <div>
                          <Label className={LABEL_CLASS}>Company</Label>
                          <Input value={exp.company} onChange={(e) => setExperienceAt(idx, (entry) => ({ ...entry, company: e.target.value }))} />
                        </div>
                        <div>
                          <Label className={LABEL_CLASS}>Location</Label>
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
                          <Label className={LABEL_CLASS}>Start Date</Label>
                          <Input value={exp.startDate} onChange={(e) => setExperienceAt(idx, (entry) => ({ ...entry, startDate: e.target.value }))} placeholder="YYYY-MM" />
                        </div>
                        <div>
                          {exp.endDate !== 'Present' && (
                            <>
                              <Label className={LABEL_CLASS}>End Date</Label>
                              <Input value={exp.endDate} onChange={(e) => setExperienceAt(idx, (entry) => ({ ...entry, endDate: e.target.value }))} placeholder="YYYY-MM" />
                            </>
                          )}
                          <div className="flex items-center gap-2 pt-6">
                            <Checkbox
                              id={`current-role-${idx}`}
                              checked={exp.endDate === 'Present'}
                              onCheckedChange={(checked) => setExperienceAt(idx, (entry) => ({ ...entry, endDate: checked === true ? 'Present' : '' }))}
                            />
                            <Label htmlFor={`current-role-${idx}`} className="text-sm font-sans">Current role</Label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className={LABEL_CLASS}>Bullet points (one per line)</Label>
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
            <CollapsibleTrigger asChild>
              <div className="w-full flex items-center justify-between py-3 text-left cursor-pointer">
                <span className="font-serif text-foreground">Education</span>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); addEducation(); }}><Plus className="h-4 w-4" /></Button>
                  <motion.span animate={{ rotate: sectionOpen.education ? 180 : 0 }}><ChevronDown className="h-4 w-4" /></motion.span>
                </div>
              </div>
            </CollapsibleTrigger>
            <Separator className="mb-3" />
            <CollapsibleContent>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden space-y-6">
                {education.length === 0 ? (
                  <p className="text-sm text-foreground/50 font-sans">No education yet. Click + to add.</p>
                ) : (
                  education.map((edu, idx) => (
                    <div key={edu.id ?? idx} className="relative space-y-3">
                      <div className="absolute top-0 right-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeEducation(idx)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                      <Separator className="mb-3" />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <Label className={LABEL_CLASS}>Degree</Label>
                          <Input value={edu.degree} onChange={(e) => setEducationAt(idx, (eduEntry) => ({ ...eduEntry, degree: e.target.value }))} />
                        </div>
                        <div className="col-span-2">
                          <Label className={LABEL_CLASS}>Institution</Label>
                          <Input value={edu.institution} onChange={(e) => setEducationAt(idx, (eduEntry) => ({ ...eduEntry, institution: e.target.value }))} />
                        </div>
                        <div>
                          <Label className={LABEL_CLASS}>Graduation Year</Label>
                          <Input value={edu.graduationDate} onChange={(e) => setEducationAt(idx, (eduEntry) => ({ ...eduEntry, graduationDate: e.target.value }))} placeholder="YYYY" />
                        </div>
                        <div>
                          <Label className={LABEL_CLASS}>GPA</Label>
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
            <CollapsibleTrigger asChild>
              <div className="w-full flex items-center justify-between py-3 text-left cursor-pointer">
                <span className="font-serif text-foreground">Skills</span>
                <motion.span animate={{ rotate: sectionOpen.skills ? 180 : 0 }}><ChevronDown className="h-4 w-4" /></motion.span>
              </div>
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
            <CollapsibleTrigger asChild>
              <div className="w-full flex items-center justify-between py-3 text-left cursor-pointer">
                <span className="font-serif text-foreground">Projects</span>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Badge variant="outline">Optional</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); addProject(); }}><Plus className="h-4 w-4" /></Button>
                  <motion.span animate={{ rotate: sectionOpen.projects ? 180 : 0 }}><ChevronDown className="h-4 w-4" /></motion.span>
                </div>
              </div>
            </CollapsibleTrigger>
            <Separator className="mb-3" />
            <CollapsibleContent>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden space-y-6">
                {projects.map((proj, idx) => (
                  <div key={proj.id ?? idx} className="relative space-y-3">
                    <div className="absolute top-0 right-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeProject(idx)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <Separator className="mb-3" />
                    <div className="space-y-3">
                      <Label className={LABEL_CLASS}>Project Name</Label>
                      <Input value={proj.name} onChange={(e) => setProjectAt(idx, (p) => ({ ...p, name: e.target.value }))} />
                      <Label className={LABEL_CLASS}>URL</Label>
                      <Input value={proj.url ?? ''} onChange={(e) => setProjectAt(idx, (p) => ({ ...p, url: e.target.value }))} />
                      <Label className={LABEL_CLASS}>Description</Label>
                      <Textarea value={proj.description} onChange={(e) => setProjectAt(idx, (p) => ({ ...p, description: e.target.value }))} className="min-h-[80px]" />
                      <Label className={LABEL_CLASS}>Tech stack (Enter to add)</Label>
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
            <CollapsibleTrigger asChild>
              <div className="w-full flex items-center justify-between py-3 text-left cursor-pointer">
                <span className="font-serif text-foreground">Certifications</span>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <Badge variant="outline">Optional</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); addCertification(); }}><Plus className="h-4 w-4" /></Button>
                  <motion.span animate={{ rotate: sectionOpen.certifications ? 180 : 0 }}><ChevronDown className="h-4 w-4" /></motion.span>
                </div>
              </div>
            </CollapsibleTrigger>
            <Separator className="mb-3" />
            <CollapsibleContent>
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden space-y-6">
                {certifications.map((cert, idx) => (
                  <div key={cert.id ?? idx} className="relative grid grid-cols-2 gap-3">
                    <div className="absolute top-0 right-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeCertification(idx)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <Separator className="col-span-2 mb-3" />
                    <div className="col-span-2">
                      <Label className={LABEL_CLASS}>Name</Label>
                      <Input value={cert.name} onChange={(e) => setCertAt(idx, (c) => ({ ...c, name: e.target.value }))} />
                    </div>
                    <div>
                      <Label className={LABEL_CLASS}>Issuer</Label>
                      <Input value={cert.issuer} onChange={(e) => setCertAt(idx, (c) => ({ ...c, issuer: e.target.value }))} />
                    </div>
                    <div>
                      <Label className={LABEL_CLASS}>Year</Label>
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
}
