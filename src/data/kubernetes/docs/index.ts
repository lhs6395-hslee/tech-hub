import { ch1Sections } from './ch1-cluster-architecture';
import { ch2Sections } from './ch2-workloads-scheduling';
import { ch3Sections } from './ch3-services-networking';
import { ch4Sections } from './ch4-storage';
import { ch5Sections } from './ch5-troubleshooting';

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
    title: { ko: '클러스터 아키텍처 (25%)', en: 'Cluster Architecture (25%)' },
    level: 'cluster-architecture',
    icon: '🖥️',
    sections: ch1Sections,
  },
  {
    id: 'workloads-scheduling',
    title: { ko: '워크로드 & 스케줄링 (15%)', en: 'Workloads & Scheduling (15%)' },
    level: 'workloads-scheduling',
    icon: '📦',
    sections: ch2Sections,
  },
  {
    id: 'services-networking',
    title: { ko: '서비스 & 네트워킹 (20%)', en: 'Services & Networking (20%)' },
    level: 'services-networking',
    icon: '🌐',
    sections: ch3Sections,
  },
  {
    id: 'storage',
    title: { ko: '스토리지 (10%)', en: 'Storage (10%)' },
    level: 'storage',
    icon: '💾',
    sections: ch4Sections,
  },
  {
    id: 'troubleshooting',
    title: { ko: '트러블슈팅 (30%)', en: 'Troubleshooting (30%)' },
    level: 'troubleshooting',
    icon: '🔍',
    sections: ch5Sections,
  },
];
