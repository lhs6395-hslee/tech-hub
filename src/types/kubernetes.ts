export type KubeLevel =
  | 'cluster-architecture'
  | 'workloads-scheduling'
  | 'services-networking'
  | 'storage'
  | 'troubleshooting';

export interface K8sLevelConfig {
  id: KubeLevel;
  label: { ko: string; en: string };
  description: { ko: string; en: string };
  icon: string;
  color: string;
}

export const K8S_LEVEL_CONFIGS: K8sLevelConfig[] = [
  {
    id: 'cluster-architecture',
    label: { ko: '클러스터 아키텍처', en: 'Cluster Architecture' },
    description: {
      ko: '클러스터 설치, 구성, RBAC, 인증서 관리',
      en: 'Cluster installation, configuration, RBAC, certificates',
    },
    icon: 'Server',
    color: 'blue',
  },
  {
    id: 'workloads-scheduling',
    label: { ko: '워크로드 & 스케줄링', en: 'Workloads & Scheduling' },
    description: {
      ko: 'Pod, Deployment, DaemonSet, Job 관리와 스케줄링',
      en: 'Manage Pod, Deployment, DaemonSet, Job and scheduling',
    },
    icon: 'Container',
    color: 'emerald',
  },
  {
    id: 'services-networking',
    label: { ko: '서비스 & 네트워킹', en: 'Services & Networking' },
    description: {
      ko: 'Service, Ingress, NetworkPolicy, DNS 네트워크 구성',
      en: 'Service, Ingress, NetworkPolicy, DNS networking',
    },
    icon: 'Network',
    color: 'cyan',
  },
  {
    id: 'storage',
    label: { ko: '스토리지', en: 'Storage' },
    description: {
      ko: 'PersistentVolume, PVC, StorageClass 데이터 관리',
      en: 'PersistentVolume, PVC, StorageClass data management',
    },
    icon: 'HardDrive',
    color: 'amber',
  },
  {
    id: 'troubleshooting',
    label: { ko: '트러블슈팅', en: 'Troubleshooting' },
    description: {
      ko: '클러스터, 노드, Pod 문제 진단과 해결',
      en: 'Diagnose and resolve cluster, node, pod issues',
    },
    icon: 'Search',
    color: 'purple',
  },
];
