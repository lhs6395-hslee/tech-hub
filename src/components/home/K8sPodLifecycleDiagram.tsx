'use client';

import DiagramEmbed from './DiagramEmbed';

interface Props {
  locale: 'ko' | 'en';
}

export default function K8sPodLifecycleDiagram({ locale }: Props) {
  return (
    <DiagramEmbed
      locale={locale}
      src="/diagrams/k8s-pod-lifecycle.drawio"
      title={{
        ko: 'Pod 라이프사이클 & 상태',
        en: 'Pod Lifecycle & States',
      }}
      description={{
        ko: 'Pod의 생성부터 종료까지의 상태 전이와 Probe 동작 원리',
        en: 'Pod state transitions from creation to termination, and Probe mechanics',
      }}
      defaultHeight={400}
      expandedHeight={650}
    />
  );
}
