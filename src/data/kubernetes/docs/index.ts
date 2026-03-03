import { ch1Sections } from './ch1-cluster-architecture';
import { ch2Sections } from './ch2-workloads-scheduling';
import { ch3Sections } from './ch3-services-networking';
import { ch4Sections } from './ch4-storage';
import { ch5Sections } from './ch5-troubleshooting';
import { ch6Sections } from './ch6-k3s-hands-on';

export interface K8sDocSection {
  id: string;
  title: { ko: string; en: string };
  level: string;
  content: { ko: string; en: string };
}

export interface K8sDocChapter {
  id: string;
  title: { ko: string; en: string };
  level: string;
  icon: string;
  sections: K8sDocSection[];
}

export const k8sDocChapters: K8sDocChapter[] = [
  {
    id: 'cluster-architecture',
    title: { ko: '클러스터 아키텍처', en: 'Cluster Architecture' },
    level: 'cluster-architecture',
    icon: '🖥️',
    sections: ch1Sections,
  },
  {
    id: 'workloads-scheduling',
    title: { ko: '워크로드 & 스케줄링', en: 'Workloads & Scheduling' },
    level: 'workloads-scheduling',
    icon: '📦',
    sections: ch2Sections,
  },
  {
    id: 'services-networking',
    title: { ko: '서비스 & 네트워킹', en: 'Services & Networking' },
    level: 'services-networking',
    icon: '🌐',
    sections: ch3Sections,
  },
  {
    id: 'storage',
    title: { ko: '스토리지', en: 'Storage' },
    level: 'storage',
    icon: '💾',
    sections: ch4Sections,
  },
  {
    id: 'troubleshooting',
    title: { ko: '트러블슈팅', en: 'Troubleshooting' },
    level: 'troubleshooting',
    icon: '🔍',
    sections: ch5Sections,
  },
  {
    id: 'hands-on',
    title: { ko: 'k3s 실습', en: 'k3s Hands-On' },
    level: 'hands-on',
    icon: '🛠️',
    sections: ch6Sections,
  },
];
