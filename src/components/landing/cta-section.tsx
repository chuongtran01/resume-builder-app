'use client';

import { motion } from 'framer-motion';
import { fadeInUp, animationViewport } from '@/components/landing/animations';

interface CTASectionProps {
  headline?: string;
  text?: string;
  buttonText?: string;
}

const defaultHeadline = 'Start with your story.';
const defaultText = 'Build your first tailored resume in minutes.';
const defaultButtonText = 'Build Your Resume';

export function CTASection({
  headline = defaultHeadline,
  text = defaultText,
  buttonText = defaultButtonText
}: CTASectionProps) {
  return (
    <section id="get-started" className="py-section-mobile lg:py-section bg-background">
      <div className="max-w-narrow mx-auto px-6 lg:px-12 text-center space-y-8">
        <motion.h2
          initial="initial"
          whileInView="animate"
          viewport={animationViewport}
          variants={fadeInUp}
          className="text-display font-serif font-normal text-foreground"
        >
          {headline}
        </motion.h2>
        <motion.p
          initial="initial"
          whileInView="animate"
          viewport={animationViewport}
          variants={fadeInUp}
          className="text-lg text-foreground/70 font-sans max-w-md mx-auto"
        >
          {text}
        </motion.p>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={animationViewport}
          variants={fadeInUp}
        >
          <button className="bg-accent text-white px-8 py-3 rounded-sm font-sans text-sm hover:opacity-90 transition-opacity">
            {buttonText}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
