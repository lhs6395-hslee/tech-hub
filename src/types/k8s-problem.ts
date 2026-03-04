import type { KubeLevel } from './kubernetes';

export type K8sCategory =
  | 'Pod'
  | 'Deployment'
  | 'Service'
  | 'ConfigMap'
  | 'Secret'
  | 'ServiceAccount'
  | 'RBAC'
  | 'NetworkPolicy'
  | 'Ingress'
  | 'PV'
  | 'PVC'
  | 'StorageClass'
  | 'DaemonSet'
  | 'StatefulSet'
  | 'Job'
  | 'CronJob'
  | 'Node'
  | 'Namespace'
  | 'Troubleshooting';

export type K8sEditorMode = 'kubectl' | 'yaml' | 'both';

export interface VerificationStep {
  command: string;
  expected: string;
  description: { ko: string; en: string };
}

export interface K8sProblem {
  id: string;
  domain: KubeLevel;
  order: number;
  title: { ko: string; en: string };
  description: { ko: string; en: string };
  category: K8sCategory;
  difficulty: 1 | 2 | 3;
  hints: { ko: string[]; en: string[] };
  explanation: { ko: string; en: string };
  setupCommands: string[];
  verificationSteps: VerificationStep[];
  cleanupCommands: string[];
  namespace: string;
  editorMode: K8sEditorMode;
  expectedAnswer: string;
}

export interface K8sExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime: number;
}

export interface K8sExecutionResponse {
  success: boolean;
  results?: K8sExecutionResult[];
  error?: string;
  errorKo?: string;
}

export interface K8sVerificationDetail {
  description: { ko: string; en: string };
  passed: boolean;
  expected: string;
  actual: string;
}

export interface K8sGradingResult {
  correct: boolean;
  score: number;
  message: { ko: string; en: string };
  details: K8sVerificationDetail[];
}

export const K8S_CATEGORY_LABELS: Record<K8sCategory, { ko: string; en: string; color: string }> = {
  Pod: { ko: 'Pod', en: 'Pod', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  Deployment: { ko: 'Deployment', en: 'Deployment', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  Service: { ko: 'Service', en: 'Service', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' },
  ConfigMap: { ko: 'ConfigMap', en: 'ConfigMap', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400' },
  Secret: { ko: 'Secret', en: 'Secret', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  ServiceAccount: { ko: 'ServiceAccount', en: 'ServiceAccount', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  RBAC: { ko: 'RBAC', en: 'RBAC', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  NetworkPolicy: { ko: 'NetworkPolicy', en: 'NetworkPolicy', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  Ingress: { ko: 'Ingress', en: 'Ingress', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
  PV: { ko: 'PV', en: 'PV', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  PVC: { ko: 'PVC', en: 'PVC', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
  StorageClass: { ko: 'StorageClass', en: 'StorageClass', color: 'bg-lime-500/10 text-lime-600 dark:text-lime-400' },
  DaemonSet: { ko: 'DaemonSet', en: 'DaemonSet', color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400' },
  StatefulSet: { ko: 'StatefulSet', en: 'StatefulSet', color: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400' },
  Job: { ko: 'Job', en: 'Job', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  CronJob: { ko: 'CronJob', en: 'CronJob', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  Node: { ko: 'Node', en: 'Node', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' },
  Namespace: { ko: 'Namespace', en: 'Namespace', color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400' },
  Troubleshooting: { ko: '트러블슈팅', en: 'Troubleshooting', color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
};
