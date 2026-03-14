'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { fadeInUp, animationViewport } from '@/components/landing/animations';
import { Label } from '@/components/ui/label';

interface PricingFeature {
  text: string;
}

interface PricingPlan {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: PricingFeature[];
  highlighted?: boolean;
}

const defaultPlans: PricingPlan[] = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      { text: '1 resume' },
      { text: 'Basic AI suggestions' },
      { text: 'PDF export' }
    ]
  },
  {
    name: 'Pro',
    monthlyPrice: 12,
    annualPrice: 10,
    highlighted: true,
    features: [
      { text: 'Unlimited resumes' },
      { text: 'Advanced AI tailoring' },
      { text: 'Cover letter generation' },
      { text: 'All export formats' },
      { text: 'Version history' }
    ]
  },
  {
    name: 'Teams',
    monthlyPrice: 29,
    annualPrice: 23,
    features: [
      { text: 'Everything in Pro' },
      { text: 'Team collaboration' },
      { text: 'Shared templates' },
      { text: 'Priority support' }
    ]
  }
];

interface PricingSectionProps {
  plans?: PricingPlan[];
}

export function PricingSection({ plans = defaultPlans }: PricingSectionProps) {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-section-mobile lg:py-section bg-background">
      <div className="max-w-editorial mx-auto px-6 lg:px-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-4 mb-6">
            <span className="text-sm font-sans text-foreground/70">Monthly</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label htmlFor="annual">
              Annual <span className="text-primary">(20% off)</span>
            </Label>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <motion.div
                key={index}
                initial="initial"
                whileInView="animate"
                viewport={animationViewport}
                variants={fadeInUp}
                className={`border p-8 ${plan.highlighted
                  ? 'border-l-4 border-l-primary border-t border-r border-b border-border'
                  : 'border-border'
                  }`}
              >
                <h3 className="text-xl font-serif font-medium text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-3xl font-serif text-foreground">${price}</span>
                  <span className="text-sm font-sans text-foreground/50">/month</span>
                </div>
                <ul className="space-y-3 text-sm font-sans text-foreground/70">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-foreground/40 mt-0.5 flex-shrink-0" />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
