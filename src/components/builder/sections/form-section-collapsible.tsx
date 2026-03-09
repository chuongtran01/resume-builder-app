'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
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
    <Collapsible open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      <CollapsibleTrigger asChild>
        <div className="w-full flex items-center justify-between py-3 text-left cursor-pointer">
          <span className="font-serif text-foreground">{title}</span>
          <div className="flex items-center gap-1">
            {optionalBadge && <Badge variant="outline">Optional</Badge>}
            {triggerSlot && <div onClick={(e) => e.stopPropagation()}>{triggerSlot}</div>}
            <motion.span animate={{ rotate: open ? 180 : 0 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </div>
        </div>
      </CollapsibleTrigger>
      <Separator className="mb-3" />
      <CollapsibleContent>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={contentClassName ?? 'overflow-hidden'}
        >
          {children}
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );
}
