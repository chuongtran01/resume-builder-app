'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ResumeMockup } from '@/components/resume-mockup';
import { fadeInUp } from '@/components/landing/animations';

export function HeroSection() {
  return (
    <section className="pt-20 pb-section-mobile lg:pb-section">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center lg:items-start">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="space-y-8"
          >
            <h1 className="text-hero-mobile lg:text-hero font-serif font-normal text-foreground leading-tight">
              Your resume,
              <br />
              written with intention.
            </h1>
            <p className="text-lg text-foreground/70 font-sans max-w-[480px] leading-relaxed">
              Craft uses AI to translate your experience into clear, compelling language — tailored to every role you apply for.
            </p>
            <div className="space-y-3">
              <Link
                href="/builder"
                className="inline-block bg-accent text-white px-8 py-3 rounded-sm font-sans text-sm hover:opacity-90 transition-opacity"
              >
                Build Your Resume
              </Link>
              <p className="text-sm text-foreground/50 font-sans">
                Free to start. No credit card required.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            <ResumeMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
