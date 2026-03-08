'use client';

import { ResumeMockup } from '@/components/resume-mockup';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
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
                <button className="bg-accent text-white px-8 py-3 rounded-sm font-sans text-sm hover:opacity-90 transition-opacity">
                  Build Your Resume
                </button>
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

      {/* Stats Row */}
      <section className="py-12 border-y border-border">
        <div className="max-w-editorial mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center"
            >
              <p className="text-xs font-sans uppercase tracking-wider text-foreground/50 mb-2">Users</p>
              <p className="text-3xl font-serif text-foreground">50,000+</p>
              <p className="text-sm font-sans text-foreground/60 mt-1">resumes built</p>
            </motion.div>

            <div className="hidden md:block w-px h-12 bg-border"></div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center"
            >
              <p className="text-xs font-sans uppercase tracking-wider text-foreground/50 mb-2">Impact</p>
              <p className="text-3xl font-serif text-foreground">3x</p>
              <p className="text-sm font-sans text-foreground/60 mt-1">more interviews on average</p>
            </motion.div>

            <div className="hidden md:block w-px h-12 bg-border"></div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center"
            >
              <p className="text-xs font-sans uppercase tracking-wider text-foreground/50 mb-2">Speed</p>
              <p className="text-3xl font-serif text-foreground">2 min</p>
              <p className="text-sm font-sans text-foreground/60 mt-1">to first draft</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="product" className="py-section-mobile lg:py-section bg-background">
        <div className="max-w-narrow mx-auto px-6 lg:px-12 text-center space-y-8">
          <motion.h2
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-quote font-serif font-normal text-foreground leading-relaxed"
          >
            We believe everyone deserves to tell their story clearly.
          </motion.h2>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-6 text-foreground/70 font-sans leading-relaxed"
          >
            <motion.p variants={fadeInUp}>
              Most resume builders focus on templates and formatting. We start with something more fundamental: the words themselves. How you describe your work matters. The right language can open doors; generic phrasing closes them.
            </motion.p>
            <motion.p variants={fadeInUp}>
              Craft uses AI to help you articulate your experience in ways that resonate with both hiring managers and ATS systems. We don't write for you—we help you write better. Every suggestion is tailored to the specific role you're applying for, ensuring your resume speaks directly to what employers are looking for.
            </motion.p>
            <motion.p variants={fadeInUp}>
              This isn't about gaming the system. It's about clarity, precision, and making sure your professional story gets the attention it deserves.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-section-mobile lg:py-section bg-background">
        <div className="max-w-editorial mx-auto px-6 lg:px-12">
          <div className="space-y-16">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="flex gap-8 items-start"
            >
              <span className="text-6xl lg:text-7xl font-serif font-light text-foreground/30">01</span>
              <div className="flex-1 pt-4">
                <h3 className="text-2xl font-serif font-medium text-foreground mb-3">Paste your experience</h3>
                <p className="text-foreground/70 font-sans leading-relaxed">
                  Start with your existing resume or a simple list of your roles and accomplishments. No formatting required.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="flex gap-8 items-start"
            >
              <span className="text-6xl lg:text-7xl font-serif font-light text-foreground/30">02</span>
              <div className="flex-1 pt-4">
                <h3 className="text-2xl font-serif font-medium text-foreground mb-3">Add the job description</h3>
                <p className="text-foreground/70 font-sans leading-relaxed">
                  Paste the job posting you're applying for. Craft analyzes what matters most and suggests language that aligns with their needs.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="flex gap-8 items-start"
            >
              <span className="text-6xl lg:text-7xl font-serif font-light text-foreground/30">03</span>
              <div className="flex-1 pt-4">
                <h3 className="text-2xl font-serif font-medium text-foreground mb-3">Get a tailored, polished resume</h3>
                <p className="text-foreground/70 font-sans leading-relaxed">
                  Review AI-suggested improvements, accept what works, and export a professional resume in PDF or Word format.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-section-mobile lg:py-section bg-background border-y border-border">
        <div className="max-w-editorial mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="pb-8 border-b border-border"
            >
              <h3 className="text-xl font-serif font-medium text-foreground mb-3">AI Tailoring</h3>
              <p className="text-foreground/70 font-sans leading-relaxed">
                Every resume is customized for the specific role you're applying to. Our AI identifies key requirements and suggests language that matches what employers are looking for.
              </p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="pb-8 border-b border-border"
            >
              <h3 className="text-xl font-serif font-medium text-foreground mb-3">ATS Optimization</h3>
              <p className="text-foreground/70 font-sans leading-relaxed">
                Built-in ATS compliance checking ensures your resume passes automated screening systems. We flag issues before you submit.
              </p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="pb-8 border-b border-border"
            >
              <h3 className="text-xl font-serif font-medium text-foreground mb-3">Cover Letter</h3>
              <p className="text-foreground/70 font-sans leading-relaxed">
                Generate matching cover letters that complement your resume. Same AI-powered tailoring, same attention to detail.
              </p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="pb-8 border-b border-border"
            >
              <h3 className="text-xl font-serif font-medium text-foreground mb-3">Multiple Formats</h3>
              <p className="text-foreground/70 font-sans leading-relaxed">
                Export to PDF, Word, or HTML. All formats maintain ATS compatibility and professional formatting.
              </p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="pb-8 border-b border-border"
            >
              <h3 className="text-xl font-serif font-medium text-foreground mb-3">Collaboration</h3>
              <p className="text-foreground/70 font-sans leading-relaxed">
                Share drafts with mentors, career counselors, or colleagues. Get feedback without losing your work.
              </p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="pb-8 border-b border-border"
            >
              <h3 className="text-xl font-serif font-medium text-foreground mb-3">Version History</h3>
              <p className="text-foreground/70 font-sans leading-relaxed">
                Keep track of all your resume versions. Compare changes, revert if needed, and maintain different versions for different roles.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-section-mobile lg:py-section bg-background-secondary">
        <div className="max-w-editorial mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center lg:text-left pb-8 md:pb-0 border-b md:border-b-0 md:border-r border-border"
            >
              <p className="text-5xl font-serif text-foreground/20 mb-4">"</p>
              <p className="text-lg font-serif text-foreground mb-6 leading-relaxed">
                Craft helped me land three interviews in one week. The AI suggestions were spot-on.
              </p>
              <p className="text-xs font-sans uppercase tracking-wider text-foreground/50">
                Sarah Chen
              </p>
              <p className="text-xs font-sans text-foreground/40 mt-1">
                Software Engineer
              </p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center lg:text-left pb-8 md:pb-0 md:border-r border-border md:px-8 lg:px-12"
            >
              <p className="text-5xl font-serif text-foreground/20 mb-4">"</p>
              <p className="text-lg font-serif text-foreground mb-6 leading-relaxed">
                Finally, a tool that understands how to write for both humans and machines.
              </p>
              <p className="text-xs font-sans uppercase tracking-wider text-foreground/50">
                Marcus Johnson
              </p>
              <p className="text-xs font-sans text-foreground/40 mt-1">
                Product Manager
              </p>
            </motion.div>

            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center lg:text-left"
            >
              <p className="text-5xl font-serif text-foreground/20 mb-4">"</p>
              <p className="text-lg font-serif text-foreground mb-6 leading-relaxed">
                The quality of the writing suggestions is remarkable. It feels like having a career coach in your pocket.
              </p>
              <p className="text-xs font-sans uppercase tracking-wider text-foreground/50">
                Emily Rodriguez
              </p>
              <p className="text-xs font-sans text-foreground/40 mt-1">
                Marketing Director
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-section-mobile lg:py-section bg-background">
        <div className="max-w-editorial mx-auto px-6 lg:px-12">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-4 mb-6">
              <span className="text-sm font-sans text-foreground/70">Monthly</span>
              <button className="relative w-12 h-6 bg-foreground/10 rounded-full">
                <span className="absolute left-1 top-1 w-4 h-4 bg-accent rounded-full transition-transform"></span>
              </button>
              <span className="text-sm font-sans text-foreground">
                Annual <span className="text-accent">(20% off)</span>
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Free Plan */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="border border-border p-8"
            >
              <h3 className="text-xl font-serif font-medium text-foreground mb-2">Free</h3>
              <div className="mb-6">
                <span className="text-3xl font-serif text-foreground">$0</span>
                <span className="text-sm font-sans text-foreground/50">/month</span>
              </div>
              <ul className="space-y-3 text-sm font-sans text-foreground/70">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                  <span>1 resume</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                  <span>Basic AI suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                  <span>PDF export</span>
                </li>
              </ul>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="border-l-4 border-l-accent border-t border-r border-b border-border p-8"
            >
              <h3 className="text-xl font-serif font-medium text-foreground mb-2">Pro</h3>
              <div className="mb-6">
                <span className="text-3xl font-serif text-foreground">$12</span>
                <span className="text-sm font-sans text-foreground/50">/month</span>
              </div>
              <ul className="space-y-3 text-sm font-sans text-foreground/70">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                  <span>Unlimited resumes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                  <span>Advanced AI tailoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                  <span>Cover letter generation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                  <span>All export formats</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                  <span>Version history</span>
                </li>
              </ul>
            </motion.div>

            {/* Teams Plan */}
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="border border-border p-8"
            >
              <h3 className="text-xl font-serif font-medium text-foreground mb-2">Teams</h3>
              <div className="mb-6">
                <span className="text-3xl font-serif text-foreground">$29</span>
                <span className="text-sm font-sans text-foreground/50">/month</span>
              </div>
              <ul className="space-y-3 text-sm font-sans text-foreground/70">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                  <span>Shared templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section id="get-started" className="py-section-mobile lg:py-section bg-background">
        <div className="max-w-narrow mx-auto px-6 lg:px-12 text-center space-y-8">
          <motion.h2
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-display font-serif font-normal text-foreground"
          >
            Start with your story.
          </motion.h2>
          <motion.p
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-lg text-foreground/70 font-sans max-w-md mx-auto"
          >
            Build your first tailored resume in minutes.
          </motion.p>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <button className="bg-accent text-white px-8 py-3 rounded-sm font-sans text-sm hover:opacity-90 transition-opacity">
              Build Your Resume
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="max-w-editorial mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-sm font-serif font-medium text-foreground mb-2">Craft</h4>
              <p className="text-xs font-sans text-foreground/50">
                Your resume, written with intention.
              </p>
            </div>

            <div>
              <h5 className="text-xs font-sans uppercase tracking-wider text-foreground/50 mb-4">Product</h5>
              <ul className="space-y-2 text-xs font-sans text-foreground/70">
                <li><a href="#product" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-sans uppercase tracking-wider text-foreground/50 mb-4">Company</h5>
              <ul className="space-y-2 text-xs font-sans text-foreground/70">
                <li><a href="#blog" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-sans uppercase tracking-wider text-foreground/50 mb-4">Legal</h5>
              <ul className="space-y-2 text-xs font-sans text-foreground/70">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-sans text-foreground/50">
              © 2024 Craft. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-xs font-sans text-foreground/50 hover:text-foreground transition-colors">Twitter</a>
              <a href="#" className="text-xs font-sans text-foreground/50 hover:text-foreground transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
