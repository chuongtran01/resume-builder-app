'use client';

import { Plus, Trash2 } from 'lucide-react';
import type { CertificationEntry } from '@/types/builder.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FormSectionCollapsible } from './form-section-collapsible';
import { LABEL_CLASS } from './constants';

export interface CertificationsSectionProps {
  certifications: CertificationEntry[];
  open: boolean;
  onToggle: () => void;
  setCertAt: (index: number, updater: (c: CertificationEntry) => CertificationEntry) => void;
  addCertification: () => void;
  removeCertification: (index: number) => void;
}

export function CertificationsSection({
  certifications,
  open,
  onToggle,
  setCertAt,
  addCertification,
  removeCertification,
}: CertificationsSectionProps) {
  const triggerSlot = (
    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.preventDefault(); addCertification(); }}>
      <Plus className="h-4 w-4" />
    </Button>
  );

  return (
    <FormSectionCollapsible
      open={open}
      onOpenChange={onToggle}
      title="Certifications"
      optionalBadge
      triggerSlot={triggerSlot}
      defaultOpen={false}
      contentClassName="overflow-hidden space-y-6"
    >
      {certifications.map((cert, idx) => (
        <div key={cert.id ?? idx} className="relative grid grid-cols-2 gap-3">
          <div className="absolute top-0 right-0">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeCertification(idx)}>
              <Trash2 className="h-4 w-4" />
            </Button>
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
      <Button variant="ghost" size="sm" onClick={addCertification}>
        <Plus className="h-4 w-4 mr-1" /> Add certification
      </Button>
    </FormSectionCollapsible>
  );
}
