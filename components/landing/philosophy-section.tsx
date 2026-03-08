'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, animationViewport } from './animations';

interface PhilosophySectionProps {
  quote?: string;
  paragraphs?: string[];
}

const defaultQuote = "We believe everyone deserves to tell their story clearly.";

const defaultParagraphs = [
  "Most resume builders focus on templates and formatting. We start with something more fundamental: the words themselves. How you describe your work matters. The right language can open doors; generic phrasing closes them.",
  "Craft uses AI to help you articulate your experience in ways that resonate with both hiring managers and ATS systems. We don't write for you—we help you write better. Every suggestion is tailored to the specific role you're applying for, ensuring your resume speaks directly to what employers are looking for.",
  "This isn't about gaming the system. It's about clarity, precision, and making sure your professional story gets the attention it deserves."
];

export function PhilosophySection({
  quote = defaultQuote,
  paragraphs = defaultParagraphs
}: PhilosophySectionProps) {
  return (
    <section id="product" className="py-section-mobile lg:py-section bg-background">
      <div className="max-w-narrow mx-auto px-6 lg:px-12 text-center space-y-8">
        <motion.h2
          initial="initial"
          whileInView="animate"
          viewport={animationViewport}
          variants={fadeInUp}
          className="text-quote font-serif font-normal text-foreground leading-relaxed"
        >
          {quote}
        </motion.h2>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={animationViewport}
          variants={staggerContainer}
          className="space-y-6 text-foreground/70 font-sans leading-relaxed"
        >
          {paragraphs.map((paragraph, index) => (
            <motion.p key={index} variants={fadeInUp}>
              {paragraph}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
