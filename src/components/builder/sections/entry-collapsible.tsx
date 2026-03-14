'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface EntryCollapsibleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  triggerSlot?: ReactNode;
  children: ReactNode;
}

export function EntryCollapsible({
  open,
  onOpenChange,
  title,
  triggerSlot,
  children,
}: EntryCollapsibleProps) {
  return (
    <div className="rounded-md border border-input bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Collapsible open={open} onOpenChange={(o) => onOpenChange(o)}>
        <CollapsibleTrigger asChild>
          <div className="w-full flex items-center justify-between gap-2 py-4 px-4 text-left cursor-pointer bg-muted/40 hover:bg-muted/60 transition-colors">
            <span className="font-semibold text-base tracking-tight text-foreground truncate">
              {title}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {triggerSlot && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!open) onOpenChange(true);
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
            className="px-4 pb-4 overflow-hidden"
          >
            {children}
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
