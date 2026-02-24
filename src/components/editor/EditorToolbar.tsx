'use client';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n';
import { Play, RotateCcw, Lightbulb, CheckCircle2 } from 'lucide-react';

interface EditorToolbarProps {
  onRun: () => void;
  onReset: () => void;
  onHint: () => void;
  onCheckAnswer: () => void;
  isRunning: boolean;
  hasResult: boolean;
}

export default function EditorToolbar({
  onRun,
  onReset,
  onHint,
  onCheckAnswer,
  isRunning,
  hasResult,
}: EditorToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 py-2">
      <Button
        onClick={onRun}
        disabled={isRunning}
        size="sm"
        className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        <Play className="h-3.5 w-3.5" />
        {t('problem.run')}
        <kbd className="ml-1 hidden sm:inline-flex items-center rounded border border-emerald-400/30 bg-emerald-500/20 px-1 text-[10px] font-mono">
          {navigator?.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+↵
        </kbd>
      </Button>

      <Button onClick={onCheckAnswer} disabled={!hasResult} size="sm" variant="default" className="gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {t('problem.checkAnswer')}
      </Button>

      <div className="flex-1" />

      <Button onClick={onHint} size="sm" variant="outline" className="gap-1.5">
        <Lightbulb className="h-3.5 w-3.5" />
        {t('problem.hint')}
      </Button>

      <Button onClick={onReset} size="sm" variant="ghost" className="gap-1.5 text-muted-foreground">
        <RotateCcw className="h-3.5 w-3.5" />
        {t('common.reset')}
      </Button>
    </div>
  );
}
