'use client';

import { motion } from 'framer-motion';
import { fadeInUp, animationViewport } from './animations';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    quote: "Craft helped me land three interviews in one week. The AI suggestions were spot-on.",
    name: 'Sarah Chen',
    role: 'Software Engineer'
  },
  {
    quote: "Finally, a tool that understands how to write for both humans and machines.",
    name: 'Marcus Johnson',
    role: 'Product Manager'
  },
  {
    quote: "The quality of the writing suggestions is remarkable. It feels like having a career coach in your pocket.",
    name: 'Emily Rodriguez',
    role: 'Marketing Director'
  }
];

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export function TestimonialsSection({ testimonials = defaultTestimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-section-mobile lg:py-section bg-background-secondary">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial="initial"
              whileInView="animate"
              viewport={animationViewport}
              variants={fadeInUp}
              className={`text-center lg:text-left ${index === 0
                  ? 'pb-8 md:pb-0 border-b md:border-b-0 md:border-r border-border'
                  : index === 1
                    ? 'pb-8 md:pb-0 md:border-r border-border md:px-8 lg:px-12'
                    : ''
                }`}
            >
              <p className="text-5xl font-serif text-foreground/20 mb-4">"</p>
              <p className="text-lg font-serif text-foreground mb-6 leading-relaxed">
                {testimonial.quote}
              </p>
              <p className="text-xs font-sans uppercase tracking-wider text-foreground/50">
                {testimonial.name}
              </p>
              <p className="text-xs font-sans text-foreground/40 mt-1">
                {testimonial.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
