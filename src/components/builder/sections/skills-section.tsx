'use client';

import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormSectionCollapsible } from './form-section-collapsible';

export interface SkillsSectionProps {
  skills: string[];
  open: boolean;
  onToggle: () => void;
  addSkill: (skill: string) => void;
  removeSkill: (index: number) => void;
}

export function SkillsSection({
  skills,
  open,
  onToggle,
  addSkill,
  removeSkill,
}: SkillsSectionProps) {
  return (
    <FormSectionCollapsible open={open} onOpenChange={onToggle} title="Skills" contentClassName="overflow-hidden space-y-2">
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
            <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => removeSkill(i)}>
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <p className="text-xs text-foreground/50 font-sans">Press Enter to add each skill.</p>
    </FormSectionCollapsible>
  );
}
