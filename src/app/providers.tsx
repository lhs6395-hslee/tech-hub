'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useProgressStore } from '@/stores/progress-store';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const recalculateProgress = useProgressStore((s) => s.recalculateProgress);

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
    recalculateProgress();
  }, [recalculateProgress]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        {mounted ? children : (
          <div className="min-h-screen bg-background" />
        )}
      </TooltipProvider>
    </ThemeProvider>
  );
}
