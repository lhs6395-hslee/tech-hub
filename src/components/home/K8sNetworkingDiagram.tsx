'use client';

import DiagramEmbed from './DiagramEmbed';

interface Props {
  locale: 'ko' | 'en';
}

export default function K8sNetworkingDiagram({ locale }: Props) {
  return (
    <DiagramEmbed
      locale={locale}
      src="/diagrams/k8s-networking.drawio"
      title={{
        ko: 'Kubernetes 네트워킹 모델',
        en: 'Kubernetes Networking Model',
      }}
      description={{
        ko: 'Service 타입, DNS, NetworkPolicy, CNI 플러그인 구조',
        en: 'Service types, DNS, NetworkPolicy, and CNI plugin architecture',
      }}
      defaultHeight={420}
      expandedHeight={650}
    />
  );
}
