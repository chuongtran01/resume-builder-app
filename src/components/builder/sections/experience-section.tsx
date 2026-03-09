'use client';

import { Plus, Trash2 } from 'lucide-react';
import type { ExperienceEntry } from '@/types/builder.types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { FormSectionCollapsible } from './form-section-collapsible';
import { LABEL_CLASS } from './constants';

export interface ExperienceSectionProps {
  experience: ExperienceEntry[];
  open: boolean;
  onToggle: () => void;
  setExperienceAt: (index: number, updater: (e: ExperienceEntry) => ExperienceEntry) => void;
  addExperience: () => void;
  removeExperience: (index: number) => void;
}

export function ExperienceSection({
  experience,
  open,
  onToggle,
  setExperienceAt,
  addExperience,
  removeExperience,
}: ExperienceSectionProps) {
  const triggerSlot = (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); addExperience(); }}>
          <Plus className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Add position</TooltipContent>
    </Tooltip>
  );

  return (
    <FormSectionCollapsible open={open} onOpenChange={onToggle} title="Experience" triggerSlot={triggerSlot} contentClassName="overflow-hidden space-y-6">
      {experience.length === 0 ? (
        <p className="text-sm text-foreground/50 font-sans">No experience yet. Click + to add.</p>
      ) : (
        experience.map((exp, idx) => (
          <div key={'id' in exp ? exp.id : idx} className="relative space-y-3">
            <div className="absolute top-0 right-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeExperience(idx)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
                  <Label htmlFor={`current-role-${idx}`} className="text-sm font-sans">
                    Current role
                  </Label>
                </div>
              </div>
            </div>
            <div>
              <Label className={LABEL_CLASS}>Bullet points (one per line)</Label>
              <Textarea
                className="min-h-[80px]"
                value={(exp.bulletPoints || []).join('\n')}
                onChange={(e) =>
                  setExperienceAt(idx, (entry) => ({
                    ...entry,
                    bulletPoints: e.target.value.split('\n').filter(Boolean).length ? e.target.value.split('\n') : [''],
                  }))
                }
              />
            </div>
          </div>
        ))
      )}
      <Button variant="ghost" size="sm" onClick={addExperience}>
        <Plus className="h-4 w-4 mr-1" /> Add position
      </Button>
    </FormSectionCollapsible>
  );
}
