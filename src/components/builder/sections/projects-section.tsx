'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ProjectEntry } from '@/types/builder.types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
            <div className="space-y-2">
              <Label className={LABEL_CLASS}>Bullet points</Label>
              {(proj.bulletPoints ?? ['']).map((bullet, bulletIdx) => (
                <div key={bulletIdx} className="flex gap-2 items-start">
                  <Textarea
                    className="min-h-[60px] flex-1"
                    value={bullet}
                    onChange={(e) =>
                      setProjectAt(idx, (p) => {
                        const next = [...p.bulletPoints];
                        next[bulletIdx] = e.target.value;
                        return { ...p, bulletPoints: next };
                      })
                    }
                    placeholder={`Bullet ${bulletIdx + 1}`}
                  />
                  {(proj.bulletPoints ?? []).length > 1 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 mt-0.5"
                          onClick={() =>
                            setProjectAt(idx, (p) => ({
                              ...p,
                              bulletPoints: p.bulletPoints.filter((_, i) => i !== bulletIdx),
                            }))
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Remove bullet</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setProjectAt(idx, (p) => ({ ...p, bulletPoints: [...p.bulletPoints, ''] }))}
              >
                <Plus className="h-4 w-4 mr-1" /> Add bullet point
              </Button>
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
