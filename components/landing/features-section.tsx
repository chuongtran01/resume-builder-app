'use client';

import { motion } from 'framer-motion';
import { fadeInUp, animationViewport } from './animations';

interface Feature {
  title: string;
  description: string;
}

const defaultFeatures: Feature[] = [
  {
    title: 'AI Tailoring',
    description: "Every resume is customized for the specific role you're applying to. Our AI identifies key requirements and suggests language that matches what employers are looking for."
  },
  {
    title: 'ATS Optimization',
    description: 'Built-in ATS compliance checking ensures your resume passes automated screening systems. We flag issues before you submit.'
  },
  {
    title: 'Cover Letter',
    description: 'Generate matching cover letters that complement your resume. Same AI-powered tailoring, same attention to detail.'
  },
  {
    title: 'Multiple Formats',
    description: 'Export to PDF, Word, or HTML. All formats maintain ATS compatibility and professional formatting.'
  },
  {
    title: 'Collaboration',
    description: 'Share drafts with mentors, career counselors, or colleagues. Get feedback without losing your work.'
  },
  {
    title: 'Version History',
    description: 'Keep track of all your resume versions. Compare changes, revert if needed, and maintain different versions for different roles.'
  }
];

interface FeaturesSectionProps {
  features?: Feature[];
}

export function FeaturesSection({ features = defaultFeatures }: FeaturesSectionProps) {
  return (
    <section className="py-section-mobile lg:py-section bg-background border-y border-border">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="initial"
              whileInView="animate"
              viewport={animationViewport}
              variants={fadeInUp}
              className="pb-8 border-b border-border"
            >
              <h3 className="text-xl font-serif font-medium text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-foreground/70 font-sans leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
