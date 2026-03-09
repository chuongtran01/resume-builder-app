'use client';

import { Plus, Trash2, X } from 'lucide-react';
import type { SkillCategory } from '@resume-types/resume.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FormSectionCollapsible } from './form-section-collapsible';

export interface SkillsSectionProps {
  skillCategories: SkillCategory[];
  open: boolean;
  onToggle: () => void;
  addCategory: () => void;
  removeCategory: (index: number) => void;
  setCategoryAt: (index: number, updater: (c: SkillCategory) => SkillCategory) => void;
  addSkillInCategory: (categoryIndex: number, skill: string) => void;
  removeSkillInCategory: (categoryIndex: number, itemIndex: number) => void;
}

export function SkillsSection({
  skillCategories,
  open,
  onToggle,
  addCategory,
  removeCategory,
  setCategoryAt,
  addSkillInCategory,
  removeSkillInCategory,
}: SkillsSectionProps) {
  const triggerSlot = (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); addCategory(); }}>
      <Plus className="h-4 w-4" />
    </Button>
  );

  return (
    <FormSectionCollapsible open={open} onOpenChange={onToggle} title="Skills" triggerSlot={triggerSlot} contentClassName="overflow-hidden space-y-6">
      {skillCategories.length === 0 ? (
        <p className="text-sm text-foreground/50 font-sans">No categories yet. Add one below.</p>
      ) : (
        skillCategories.map((cat, catIndex) => (
          <div key={catIndex} className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                value={cat.name}
                onChange={(e) => setCategoryAt(catIndex, (c) => ({ ...c, name: e.target.value }))}
                placeholder="e.g. Programming Languages"
                className="flex-1 font-medium"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => removeCategory(catIndex)}
                title="Remove category"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Type a skill and press Enter"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  addSkillInCategory(catIndex, input.value);
                  input.value = '';
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {cat.items.map((s, i) => (
                <Badge key={`${s}-${i}`} variant="outline" className="gap-1">
                  {s}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={() => removeSkillInCategory(catIndex, i)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        ))
      )}
      <Button variant="ghost" size="sm" onClick={addCategory}>
        <Plus className="h-4 w-4 mr-1" /> Add category
      </Button>
      <p className="text-xs text-foreground/50 font-sans">Add categories like Programming Languages, Frameworks, then add skills in each with Enter.</p>
    </FormSectionCollapsible>
  );
}
