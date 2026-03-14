'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

interface FormSectionCollapsibleProps {
  open: boolean;
  onOpenChange: () => void;
  title: string;
  optionalBadge?: boolean;
  triggerSlot?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  contentClassName?: string;
}

export function FormSectionCollapsible({
  open,
  onOpenChange,
  title,
  optionalBadge = false,
  triggerSlot,
  defaultOpen,
  children,
  contentClassName,
}: FormSectionCollapsibleProps) {
  return (
    <div className="rounded-sm border border-input bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Collapsible open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
        <CollapsibleTrigger asChild>
          <div className="w-full flex items-center justify-between gap-2 py-4 px-4 text-left cursor-pointer bg-muted/40 hover:bg-muted/60 transition-colors">
            <span className="font-semibold text-base tracking-tight text-foreground">{title}</span>
            <div className="flex items-center gap-1 shrink-0">
              {optionalBadge && <Badge variant="outline" className="text-xs">Optional</Badge>}
              {triggerSlot && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!open) onOpenChange();
                  }}
                >
                  {triggerSlot}
                </div>
              )}
              <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-muted-foreground">
                <ChevronDown className="h-5 w-5" />
              </motion.span>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`px-4 pb-4 ${contentClassName ?? 'overflow-hidden'}`}
          >
            {children}
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
