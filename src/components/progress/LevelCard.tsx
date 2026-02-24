'use client';

import Link from 'next/link';
import type { LevelConfig } from '@/types/problem';
import { useLocaleStore } from '@/stores/locale-store';
import { useProgressStore } from '@/stores/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Sprout, Flame, Zap, Crown, Database } from 'lucide-react';

const ICONS = {
  Sprout,
  Flame,
  Zap,
  Crown,
  Database,
};

const GRADIENTS = {
  emerald: 'from-emerald-500/20 to-emerald-600/5 hover:from-emerald-500/30 hover:to-emerald-600/10',
  blue: 'from-blue-500/20 to-blue-600/5 hover:from-blue-500/30 hover:to-blue-600/10',
  purple: 'from-purple-500/20 to-purple-600/5 hover:from-purple-500/30 hover:to-purple-600/10',
  amber: 'from-amber-500/20 to-amber-600/5 hover:from-amber-500/30 hover:to-amber-600/10',
  cyan: 'from-cyan-500/20 to-cyan-600/5 hover:from-cyan-500/30 hover:to-cyan-600/10',
};

const ICON_COLORS = {
  emerald: 'text-emerald-500',
  blue: 'text-blue-500',
  purple: 'text-purple-500',
  amber: 'text-amber-500',
  cyan: 'text-cyan-500',
};

const PROGRESS_COLORS = {
  emerald: '[&>div]:bg-emerald-500',
  blue: '[&>div]:bg-blue-500',
  purple: '[&>div]:bg-purple-500',
  amber: '[&>div]:bg-amber-500',
  cyan: '[&>div]:bg-cyan-500',
};

interface LevelCardProps {
  config: LevelConfig;
}

export default function LevelCard({ config }: LevelCardProps) {
  const locale = useLocaleStore((s) => s.locale);
  const isLevelUnlocked = useProgressStore((s) => s.isLevelUnlocked);
  const getLevelProgress = useProgressStore((s) => s.getLevelProgress);

  const unlocked = isLevelUnlocked(config.id);
  const progress = getLevelProgress(config.id);
  const Icon = ICONS[config.icon as keyof typeof ICONS] || Sprout;
  const gradient = GRADIENTS[config.color as keyof typeof GRADIENTS] || GRADIENTS.emerald;
  const iconColor = ICON_COLORS[config.color as keyof typeof ICON_COLORS] || ICON_COLORS.emerald;
  const progressColor = PROGRESS_COLORS[config.color as keyof typeof PROGRESS_COLORS] || PROGRESS_COLORS.emerald;

  if (!unlocked) {
    return (
      <Card className="relative overflow-hidden opacity-60">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        <CardContent className="relative p-6 flex flex-col items-center text-center space-y-3">
          <Lock className="h-10 w-10 text-muted-foreground" />
          <h3 className="font-bold text-lg">{config.label[locale]}</h3>
          <p className="text-xs text-muted-foreground">
            {locale === 'ko'
              ? '이전 레벨을 80% 이상 완료하면 잠금 해제됩니다'
              : 'Complete 80% of the previous level to unlock'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={`/levels/${config.id}`}>
      <Card className="relative overflow-hidden group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all`} />
        <CardContent className="relative p-6 flex flex-col items-center text-center space-y-3">
          <Icon className={`h-10 w-10 ${iconColor}`} />
          <div>
            <h3 className="font-bold text-lg">{config.label[locale]}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {config.description[locale]}
            </p>
          </div>
          <div className="w-full space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {config.problemCount > 0
                  ? `${progress.completedProblems}/${config.problemCount}`
                  : locale === 'ko' ? '준비 중' : 'Coming soon'}
              </span>
              {config.problemCount > 0 && (
                <Badge variant="secondary" className="text-[10px] h-4">
                  {progress.percentage}%
                </Badge>
              )}
            </div>
            {config.problemCount > 0 && (
              <Progress value={progress.percentage} className={`h-1.5 ${progressColor}`} />
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
