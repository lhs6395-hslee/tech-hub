'use client';

import Link from 'next/link';
import { useLocaleStore } from '@/stores/locale-store';
import { K8S_LEVEL_CONFIGS } from '@/types/kubernetes';
import { Container, Server, Network, HardDrive, Search, BookOpen, GraduationCap, MessageSquare, Terminal, FlaskConical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const DOMAIN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Server,
  Container,
  Network,
  HardDrive,
  Search,
};

const DOMAIN_GRADIENTS: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  emerald: 'from-emerald-500 to-emerald-600',
  cyan: 'from-cyan-500 to-cyan-600',
  amber: 'from-amber-500 to-amber-600',
  purple: 'from-purple-500 to-purple-600',
};

const CARD_GRADIENTS: Record<string, string> = {
  blue: 'from-blue-500/20 to-blue-600/5 hover:from-blue-500/30 hover:to-blue-600/10',
  emerald: 'from-emerald-500/20 to-emerald-600/5 hover:from-emerald-500/30 hover:to-emerald-600/10',
  cyan: 'from-cyan-500/20 to-cyan-600/5 hover:from-cyan-500/30 hover:to-cyan-600/10',
  amber: 'from-amber-500/20 to-amber-600/5 hover:from-amber-500/30 hover:to-amber-600/10',
  purple: 'from-purple-500/20 to-purple-600/5 hover:from-purple-500/30 hover:to-purple-600/10',
};

const ICON_COLORS: Record<string, string> = {
  blue: 'text-blue-500',
  emerald: 'text-emerald-500',
  cyan: 'text-cyan-500',
  amber: 'text-amber-500',
  purple: 'text-purple-500',
};

export default function KubernetesPage() {
  const locale = useLocaleStore((s) => s.locale);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 py-12">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
            <Container className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {locale === 'ko' ? 'Kubernetes 학습' : 'Kubernetes Learning'}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {locale === 'ko'
            ? 'Kubernetes의 핵심 개념부터 실전 운영까지 체계적으로 학습합니다'
            : 'Master Kubernetes systematically from core concepts to production operations'}
        </p>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <Link href="/kubernetes/docs" className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30 space-y-3 hover:bg-muted/50 transition-colors">
          <BookOpen className="h-8 w-8 text-blue-500" />
          <h3 className="font-semibold">
            {locale === 'ko' ? 'Kubernetes 이론' : 'K8s Theory'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locale === 'ko'
              ? '5개 핵심 도메인에 대한 상세한 이론 문서를 학습합니다'
              : 'Study detailed theory documents for 5 Kubernetes domains'}
          </p>
        </Link>
        <Link href="/kubernetes/docs" className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30 space-y-3 hover:bg-muted/50 transition-colors">
          <Terminal className="h-8 w-8 text-rose-500" />
          <h3 className="font-semibold">
            {locale === 'ko' ? 'k3s 실습' : 'k3s Hands-On'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locale === 'ko'
              ? 'k3s로 Kubernetes를 직접 설치하고 실습합니다'
              : 'Install and practice with k3s lightweight Kubernetes'}
          </p>
        </Link>
        <Link href="/kubernetes/learn" className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30 space-y-3 hover:bg-muted/50 transition-colors">
          <GraduationCap className="h-8 w-8 text-emerald-500" />
          <h3 className="font-semibold">
            {locale === 'ko' ? '이론 퀴즈' : 'Theory Quizzes'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locale === 'ko'
              ? 'OX 퀴즈, 4지선다, 용어 매칭으로 개념을 복습합니다'
              : 'Review concepts with True/False, Multiple Choice, and Term Matching'}
          </p>
        </Link>
        <Link href="/kubernetes/labs" className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30 space-y-3 hover:bg-muted/50 transition-colors">
          <FlaskConical className="h-8 w-8 text-purple-500" />
          <h3 className="font-semibold">
            {locale === 'ko' ? 'K8s 실습 문제' : 'K8s Lab Problems'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locale === 'ko'
              ? 'k3s 클러스터에서 kubectl 명령으로 실전 문제를 풀어봅니다'
              : 'Solve hands-on problems with kubectl commands on a k3s cluster'}
          </p>
        </Link>
      </section>

      {/* Domain Cards */}
      <section className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">
            {locale === 'ko' ? 'Kubernetes 학습 도메인' : 'Kubernetes Learning Domains'}
          </h2>
          <p className="text-muted-foreground">
            {locale === 'ko'
              ? 'Kubernetes는 5개 핵심 도메인으로 구성되어 있습니다'
              : 'Kubernetes consists of 5 core domains'}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {K8S_LEVEL_CONFIGS.map((config) => {
            const Icon = DOMAIN_ICONS[config.icon] || Server;
            const gradient = DOMAIN_GRADIENTS[config.color] || DOMAIN_GRADIENTS.blue;
            const cardGradient = CARD_GRADIENTS[config.color] || CARD_GRADIENTS.blue;
            const iconColor = ICON_COLORS[config.color] || ICON_COLORS.blue;

            return (
              <Link key={config.id} href={`/kubernetes/labs/${config.id}`}>
                <Card className="relative overflow-hidden group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                  <div className={`absolute inset-0 bg-gradient-to-br ${cardGradient} transition-all`} />
                  <CardContent className="relative p-6 flex flex-col items-center text-center space-y-3">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} shadow-md`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{config.label[locale]}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {config.description[locale]}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
