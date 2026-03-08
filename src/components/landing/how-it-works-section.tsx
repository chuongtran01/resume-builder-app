'use client';

import { motion } from 'framer-motion';
import { fadeInUp, animationViewport } from '@/components/landing/animations';

interface Step {
  number: string;
  title: string;
  description: string;
}

const defaultSteps: Step[] = [
  {
    number: '01',
    title: 'Paste your experience',
    description: 'Start with your existing resume or a simple list of your roles and accomplishments. No formatting required.'
  },
  {
    number: '02',
    title: 'Add the job description',
    description: "Paste the job posting you're applying for. Craft analyzes what matters most and suggests language that aligns with their needs."
  },
  {
    number: '03',
    title: 'Get a tailored, polished resume',
    description: 'Review AI-suggested improvements, accept what works, and export a professional resume in PDF or Word format.'
  }
];

interface HowItWorksSectionProps {
  steps?: Step[];
}

export function HowItWorksSection({ steps = defaultSteps }: HowItWorksSectionProps) {
  return (
    <section id="how-it-works" className="py-section-mobile lg:py-section bg-background">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <div className="space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial="initial"
              whileInView="animate"
              viewport={animationViewport}
              variants={fadeInUp}
              className="flex gap-8 items-start"
            >
              <span className="text-6xl lg:text-7xl font-serif font-light text-foreground/30">
                {step.number}
              </span>
              <div className="flex-1 pt-4">
                <h3 className="text-2xl font-serif font-medium text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-foreground/70 font-sans leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
