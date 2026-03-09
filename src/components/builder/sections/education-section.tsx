'use client';

import { Plus, Trash2 } from 'lucide-react';
import type { EducationEntry } from '@/types/builder.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FormSectionCollapsible } from './form-section-collapsible';
import { LABEL_CLASS } from './constants';

export interface EducationSectionProps {
  education: EducationEntry[];
  open: boolean;
  onToggle: () => void;
  setEducationAt: (index: number, updater: (e: EducationEntry) => EducationEntry) => void;
  addEducation: () => void;
  removeEducation: (index: number) => void;
}

export function EducationSection({
  education,
  open,
  onToggle,
  setEducationAt,
  addEducation,
  removeEducation,
}: EducationSectionProps) {
  const triggerSlot = (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); addEducation(); }}>
      <Plus className="h-4 w-4" />
    </Button>
  );

  return (
    <FormSectionCollapsible open={open} onOpenChange={onToggle} title="Education" triggerSlot={triggerSlot} contentClassName="overflow-hidden space-y-6">
      {education.length === 0 ? (
        <p className="text-sm text-foreground/50 font-sans">No education yet. Click + to add.</p>
      ) : (
        education.map((edu, idx) => (
          <div key={edu.id ?? idx} className="relative space-y-3">
            <div className="absolute top-0 right-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeEducation(idx)}>
                <Trash2 className="h-4 w-4" />
              </Button>
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
      <Button variant="ghost" size="sm" onClick={addEducation}>
        <Plus className="h-4 w-4 mr-1" /> Add education
      </Button>
    </FormSectionCollapsible>
  );
}
