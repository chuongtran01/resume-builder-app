'use client';

import type { PersonalInfo } from '@resume-types/resume.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormSectionCollapsible } from './form-section-collapsible';
import { LABEL_CLASS } from './constants';

export interface ContactSectionProps {
  personalInfo: PersonalInfo | undefined;
  importJustDone: boolean;
  open: boolean;
  onToggle: () => void;
  onChange: (field: string, value: string) => void;
}

export function ContactSection({
  personalInfo: pi,
  importJustDone,
  open,
  onToggle,
  onChange,
}: ContactSectionProps) {
  return (
    <FormSectionCollapsible open={open} onOpenChange={onToggle} title="Contact" contentClassName="grid grid-cols-2 gap-3 overflow-hidden">
      <div className="col-span-2">
        <Label className={LABEL_CLASS}>Full Name</Label>
        <Input
          value={pi?.name ?? ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="John Doe"
          className={importJustDone ? 'bg-[#FDF3EC]' : ''}
        />
      </div>
      <div>
        <Label className={LABEL_CLASS}>Email</Label>
        <Input
          type="email"
          value={pi?.email ?? ''}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="john@example.com"
        />
      </div>
      <div>
        <Label className={LABEL_CLASS}>Phone</Label>
        <Input
          value={pi?.phone ?? ''}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      <div className="col-span-2">
        <Label className={LABEL_CLASS}>Location</Label>
        <Input
          value={pi?.location ?? ''}
          onChange={(e) => onChange('location', e.target.value)}
          placeholder="San Francisco, CA"
        />
      </div>
      <div>
        <Label className={LABEL_CLASS}>LinkedIn</Label>
        <Input
          value={pi?.linkedin ?? ''}
          onChange={(e) => onChange('linkedin', e.target.value)}
          placeholder="https://linkedin.com/in/..."
        />
      </div>
      <div>
        <Label className={LABEL_CLASS}>Portfolio</Label>
        <Input
          value={pi?.website ?? pi?.github ?? ''}
          onChange={(e) => onChange('website', e.target.value)}
          placeholder="https://..."
        />
      </div>
    </FormSectionCollapsible>
  );
}
