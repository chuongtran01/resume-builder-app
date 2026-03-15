'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { AuthForm } from '@/components/auth/auth-form';

export default function AuthPage(): React.ReactElement {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-4">
      <motion.div
        className="w-full max-w-[420px]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AuthForm />
      </motion.div>
    </div>
  );
}
