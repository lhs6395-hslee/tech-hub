import type { K8sProblem } from '@/types/k8s-problem';
import type { KubeLevel } from '@/types/kubernetes';

// Cluster Architecture
import { problem as ca001 } from './cluster-architecture/001-create-serviceaccount';
import { problem as ca002 } from './cluster-architecture/002-create-role';
import { problem as ca003 } from './cluster-architecture/003-create-rolebinding';
import { problem as ca004 } from './cluster-architecture/004-create-namespace';
import { problem as ca005 } from './cluster-architecture/005-create-clusterrole';

// Workloads & Scheduling
import { problem as ws001 } from './workloads-scheduling/001-create-deployment';
import { problem as ws002 } from './workloads-scheduling/002-create-pod';
import { problem as ws003 } from './workloads-scheduling/003-scale-deployment';
import { problem as ws004 } from './workloads-scheduling/004-create-job';
import { problem as ws005 } from './workloads-scheduling/005-create-daemonset';

// Services & Networking
import { problem as sn001 } from './services-networking/001-create-service';
import { problem as sn002 } from './services-networking/002-create-nodeport';
import { problem as sn003 } from './services-networking/003-create-networkpolicy';
import { problem as sn004 } from './services-networking/004-create-ingress';
import { problem as sn005 } from './services-networking/005-create-headless-service';

// Storage
import { problem as st001 } from './storage/001-create-configmap';
import { problem as st002 } from './storage/002-create-secret';
import { problem as st003 } from './storage/003-create-pv';
import { problem as st004 } from './storage/004-create-pvc';
import { problem as st005 } from './storage/005-pod-with-configmap';

// Troubleshooting
import { problem as ts001 } from './troubleshooting/001-fix-crashing-pod';
import { problem as ts002 } from './troubleshooting/002-fix-service-selector';
import { problem as ts003 } from './troubleshooting/003-fix-resource-limits';
import { problem as ts004 } from './troubleshooting/004-check-pod-logs';
import { problem as ts005 } from './troubleshooting/005-fix-deployment-image';

const allK8sProblems: K8sProblem[] = [
  // Cluster Architecture
  ca001,
  ca002,
  ca003,
  ca004,
  ca005,
  // Workloads & Scheduling
  ws001,
  ws002,
  ws003,
  ws004,
  ws005,
  // Services & Networking
  sn001,
  sn002,
  sn003,
  sn004,
  sn005,
  // Storage
  st001,
  st002,
  st003,
  st004,
  st005,
  // Troubleshooting
  ts001,
  ts002,
  ts003,
  ts004,
  ts005,
];

export function getAllK8sProblems(): K8sProblem[] {
  return allK8sProblems;
}

export function getK8sProblemsByDomain(domain: KubeLevel): K8sProblem[] {
  return allK8sProblems.filter((p) => p.domain === domain);
}

export function getK8sProblemById(id: string): K8sProblem | undefined {
  return allK8sProblems.find((p) => p.id === id);
}

export function getNextK8sProblem(currentId: string): K8sProblem | undefined {
  const idx = allK8sProblems.findIndex((p) => p.id === currentId);
  return idx >= 0 && idx < allK8sProblems.length - 1
    ? allK8sProblems[idx + 1]
    : undefined;
}
