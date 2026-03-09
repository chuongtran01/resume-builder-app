'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormSectionCollapsible } from './form-section-collapsible';
import { LABEL_CLASS } from './constants';

export interface SummarySectionProps {
  summary: string;
  open: boolean;
  onToggle: () => void;
  onSummaryChange: (value: string) => void;
}

export function SummarySection({
  summary,
  open,
  onToggle,
  onSummaryChange,
}: SummarySectionProps) {
  return (
    <FormSectionCollapsible open={open} onOpenChange={onToggle} title="Summary" optionalBadge contentClassName="overflow-hidden space-y-2">
      <Label className={LABEL_CLASS}>Professional summary</Label>
      <Textarea
        className="min-h-[96px]"
        value={summary}
        onChange={(e) => onSummaryChange(e.target.value)}
        placeholder="A brief professional summary in your own words..."
      />
      <p className="text-xs text-foreground/50 font-sans">2–3 sentences works best.</p>
    </FormSectionCollapsible>
  );
}
