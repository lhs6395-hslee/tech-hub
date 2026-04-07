'use client';

import DiagramEmbed from './DiagramEmbed';

interface Props {
  locale: 'ko' | 'en';
}

export default function K8sArchitectureDiagram({ locale }: Props) {
  return (
    <DiagramEmbed
      locale={locale}
      src="/diagrams/k8s-architecture.drawio"
      title={{
        ko: 'Kubernetes 클러스터 아키텍처',
        en: 'Kubernetes Cluster Architecture',
      }}
      description={{
        ko: 'Control Plane과 Worker Node의 구성 요소 — 드래그 이동, 스크롤 확대/축소',
        en: 'Control Plane and Worker Node components — drag to pan, scroll to zoom',
      }}
      defaultHeight={450}
      expandedHeight={700}
    />
  );
}
