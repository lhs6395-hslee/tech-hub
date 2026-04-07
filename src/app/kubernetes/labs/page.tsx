'use client';

import Link from 'next/link';
import { useLocaleStore } from '@/stores/locale-store';
import { useK8sProgressStore } from '@/stores/k8s-progress-store';
import { K8S_LEVEL_CONFIGS } from '@/types/kubernetes';
import { Server, Container as ContainerIcon, Network, HardDrive, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Server,
  Container: ContainerIcon,
  Network,
  HardDrive,
  Search,
};

const GRADIENTS: Record<string, string> = {
  blue: 'from-blue-500/20 to-blue-600/5 hover:from-blue-500/30 hover:to-blue-600/10',
  emerald: 'from-emerald-500/20 to-emerald-600/5 hover:from-emerald-500/30 hover:to-emerald-600/10',
  cyan: 'from-cyan-500/20 to-cyan-600/5 hover:from-cyan-500/30 hover:to-cyan-600/10',
  amber: 'from-amber-500/20 to-amber-600/5 hover:from-amber-500/30 hover:to-amber-600/10',
  purple: 'from-purple-500/20 to-purple-600/5 hover:from-purple-500/30 hover:to-purple-600/10',
};

const DOMAIN_GRADIENTS: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  emerald: 'from-emerald-500 to-emerald-600',
  cyan: 'from-cyan-500 to-cyan-600',
  amber: 'from-amber-500 to-amber-600',
  purple: 'from-purple-500 to-purple-600',
};

export default function K8sLabsPage() {
  const locale = useLocaleStore((s) => s.locale);
  const getDomainProgress = useK8sProgressStore((s) => s.getDomainProgress);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {locale === 'ko' ? 'Kubernetes 실습' : 'Kubernetes Labs'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {locale === 'ko'
            ? 'k3s 클러스터에서 실제 kubectl 명령과 YAML을 작성하여 문제를 풀어보세요.'
            : 'Solve problems by writing kubectl commands and YAML manifests on a real k3s cluster.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {K8S_LEVEL_CONFIGS.map((config) => {
          const Icon = ICONS[config.icon] || Server;
          const gradient = GRADIENTS[config.color] || GRADIENTS.blue;
          const domainGradient = DOMAIN_GRADIENTS[config.color] || DOMAIN_GRADIENTS.blue;
          const progress = getDomainProgress(config.id);

          return (
            <Link key={config.id} href={`/kubernetes/labs/${config.id}`}>
              <Card className="relative overflow-hidden group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all`} />
                <CardContent className="relative p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${domainGradient} shadow-md`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{config.label[locale]}</h3>
                      <p className="text-xs text-muted-foreground">
                        {config.description[locale]}
                      </p>
                    </div>
                  </div>

                  {progress.totalProblems > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {progress.completedProblems}/{progress.totalProblems}{' '}
                          {locale === 'ko' ? '완료' : 'completed'}
                        </span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${domainGradient} transition-all duration-500`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
