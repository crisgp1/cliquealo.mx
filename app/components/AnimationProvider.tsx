import { ReactNode } from 'react';

// This is a placeholder for the LazyMotion component from motion/react
// Since motion/react is not installed yet, we'll create a simple provider
// that can be replaced with the real implementation later
export function AnimationProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}

// When motion is installed, this can be updated to:
/*
import { LazyMotion, domAnimation } from "motion/react";

export function AnimationProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      {children}
    </LazyMotion>
  );
}
*/