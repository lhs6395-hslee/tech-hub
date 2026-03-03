'use client';

import Link from 'next/link';
import { useLocaleStore } from '@/stores/locale-store';
import { K8S_LEVEL_CONFIGS } from '@/types/kubernetes';
import { Container, Server, Network, HardDrive, Search, BookOpen, GraduationCap, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
          {locale === 'ko' ? 'CKA 시험 준비' : 'CKA Exam Preparation'}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {locale === 'ko'
            ? 'Certified Kubernetes Administrator(CKA) 시험 커리큘럼 기반으로 Kubernetes를 체계적으로 학습합니다'
            : 'Master Kubernetes systematically based on the CKA exam curriculum'}
        </p>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link href="/kubernetes/docs" className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30 space-y-3 hover:bg-muted/50 transition-colors">
          <BookOpen className="h-8 w-8 text-blue-500" />
          <h3 className="font-semibold">
            {locale === 'ko' ? 'CKA 이론 학습' : 'CKA Theory'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locale === 'ko'
              ? '5개 CKA 도메인에 대한 상세한 이론 문서를 학습합니다'
              : 'Study detailed theory documents for 5 CKA domains'}
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
        <div className="flex flex-col items-center text-center p-6 rounded-xl bg-muted/30 space-y-3">
          <MessageSquare className="h-8 w-8 text-purple-500" />
          <h3 className="font-semibold">
            {locale === 'ko' ? 'AI 챗봇' : 'AI Chatbot'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {locale === 'ko'
              ? 'Kubernetes 전문 AI 어시스턴트에게 자유롭게 질문합니다'
              : 'Ask the Kubernetes AI assistant anything freely'}
          </p>
        </div>
      </section>

      {/* CKA Domain Cards */}
      <section className="space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">
            {locale === 'ko' ? 'CKA 시험 도메인' : 'CKA Exam Domains'}
          </h2>
          <p className="text-muted-foreground">
            {locale === 'ko'
              ? 'CKA 시험은 5개 도메인으로 구성되어 있습니다'
              : 'The CKA exam consists of 5 domains'}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {K8S_LEVEL_CONFIGS.map((config) => {
            const Icon = DOMAIN_ICONS[config.icon] || Server;
            const gradient = DOMAIN_GRADIENTS[config.color] || DOMAIN_GRADIENTS.blue;
            const cardGradient = CARD_GRADIENTS[config.color] || CARD_GRADIENTS.blue;
            const iconColor = ICON_COLORS[config.color] || ICON_COLORS.blue;

            return (
              <Link key={config.id} href="/kubernetes/docs">
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
                    {/* Weight Badge */}
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">
                        CKA {config.weight}%
                      </Badge>
                      <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                          style={{ width: `${config.weight * 3.3}%` }}
                        />
                      </div>
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
