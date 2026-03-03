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
  weight: number; // CKA exam weight percentage
}

export const K8S_LEVEL_CONFIGS: K8sLevelConfig[] = [
  {
    id: 'cluster-architecture',
    label: { ko: '클러스터 아키텍처', en: 'Cluster Architecture' },
    description: {
      ko: '클러스터 설치, 구성, RBAC, 인증서 관리 (CKA 25%)',
      en: 'Cluster installation, configuration, RBAC, certificates (CKA 25%)',
    },
    icon: 'Server',
    color: 'blue',
    weight: 25,
  },
  {
    id: 'workloads-scheduling',
    label: { ko: '워크로드 & 스케줄링', en: 'Workloads & Scheduling' },
    description: {
      ko: 'Pod, Deployment, DaemonSet, Job 관리와 스케줄링 (CKA 15%)',
      en: 'Manage Pod, Deployment, DaemonSet, Job and scheduling (CKA 15%)',
    },
    icon: 'Container',
    color: 'emerald',
    weight: 15,
  },
  {
    id: 'services-networking',
    label: { ko: '서비스 & 네트워킹', en: 'Services & Networking' },
    description: {
      ko: 'Service, Ingress, NetworkPolicy, DNS 네트워크 구성 (CKA 20%)',
      en: 'Service, Ingress, NetworkPolicy, DNS networking (CKA 20%)',
    },
    icon: 'Network',
    color: 'cyan',
    weight: 20,
  },
  {
    id: 'storage',
    label: { ko: '스토리지', en: 'Storage' },
    description: {
      ko: 'PersistentVolume, PVC, StorageClass 데이터 관리 (CKA 10%)',
      en: 'PersistentVolume, PVC, StorageClass data management (CKA 10%)',
    },
    icon: 'HardDrive',
    color: 'amber',
    weight: 10,
  },
  {
    id: 'troubleshooting',
    label: { ko: '트러블슈팅', en: 'Troubleshooting' },
    description: {
      ko: '클러스터, 노드, Pod 문제 진단과 해결 (CKA 30%)',
      en: 'Diagnose and resolve cluster, node, pod issues (CKA 30%)',
    },
    icon: 'Search',
    color: 'purple',
    weight: 30,
  },
];
