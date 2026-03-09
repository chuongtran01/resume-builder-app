'use client';

import { Plus, Trash2, X } from 'lucide-react';
import type { ProjectEntry } from '@/types/builder.types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FormSectionCollapsible } from './form-section-collapsible';
import { LABEL_CLASS } from './constants';

export interface ProjectsSectionProps {
  projects: ProjectEntry[];
  open: boolean;
  onToggle: () => void;
  setProjectAt: (index: number, updater: (p: ProjectEntry) => ProjectEntry) => void;
  addProject: () => void;
  removeProject: (index: number) => void;
}

export function ProjectsSection({
  projects,
  open,
  onToggle,
  setProjectAt,
  addProject,
  removeProject,
}: ProjectsSectionProps) {
  const triggerSlot = (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); addProject(); }}>
      <Plus className="h-4 w-4" />
    </Button>
  );

  return (
    <FormSectionCollapsible
      open={open}
      onOpenChange={onToggle}
      title="Projects"
      optionalBadge
      triggerSlot={triggerSlot}
      defaultOpen={false}
      contentClassName="overflow-hidden space-y-6"
    >
      {projects.map((proj, idx) => (
        <div key={proj.id ?? idx} className="relative space-y-3">
          <div className="absolute top-0 right-0">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeProject(idx)}>
              <Trash2 className="h-4 w-4" />
            </Button>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={() => setProjectAt(idx, (p) => ({ ...p, technologies: (p.technologies || []).filter((_, j) => j !== i) }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
      <Button variant="ghost" size="sm" onClick={addProject}>
        <Plus className="h-4 w-4 mr-1" /> Add project
      </Button>
    </FormSectionCollapsible>
  );
}
