'use client';

import { motion } from 'framer-motion';
import { fadeInUp, animationViewport } from './animations';

interface Stat {
  label: string;
  value: string;
  description: string;
}

const defaultStats: Stat[] = [
  {
    label: 'Users',
    value: '50,000+',
    description: 'resumes built'
  },
  {
    label: 'Impact',
    value: '3x',
    description: 'more interviews on average'
  },
  {
    label: 'Speed',
    value: '2 min',
    description: 'to first draft'
  }
];

interface StatsSectionProps {
  stats?: Stat[];
}

export function StatsSection({ stats = defaultStats }: StatsSectionProps) {
  return (
    <section className="py-12 border-y border-border">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {stats.map((stat, index) => (
            <>
              <motion.div
                key={index}
                initial="initial"
                whileInView="animate"
                viewport={animationViewport}
                variants={fadeInUp}
                className="text-center"
              >
                <p className="text-xs font-sans uppercase tracking-wider text-foreground/50 mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-serif text-foreground">{stat.value}</p>
                <p className="text-sm font-sans text-foreground/60 mt-1">
                  {stat.description}
                </p>
              </motion.div>
              {index < stats.length - 1 && (
                <div key={`divider-${index}`} className="hidden md:block w-px h-12 bg-border"></div>
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}
