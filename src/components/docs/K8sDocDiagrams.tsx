'use client';

import { useState } from 'react';

interface DiagramProps {
  locale: 'ko' | 'en';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. Kubernetes Cluster Architecture
//    Section: k8s-overview (ch1)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface K8sComponent {
  name: string;
  label: { ko: string; en: string };
  description: { ko: string; en: string };
  color: string;
}

const CONTROL_PLANE_COMPONENTS: K8sComponent[] = [
  { name: 'api-server', label: { ko: 'API Server', en: 'API Server' }, description: { ko: '모든 요청의 진입점, REST API 제공', en: 'Entry point for all requests, provides REST API' }, color: 'blue' },
  { name: 'etcd', label: { ko: 'etcd', en: 'etcd' }, description: { ko: '클러스터 상태 저장소 (Key-Value)', en: 'Cluster state store (Key-Value)' }, color: 'violet' },
  { name: 'scheduler', label: { ko: 'Scheduler', en: 'Scheduler' }, description: { ko: 'Pod를 적절한 노드에 배치', en: 'Places Pods on appropriate nodes' }, color: 'cyan' },
  { name: 'controller', label: { ko: 'Controller Manager', en: 'Controller Manager' }, description: { ko: '상태를 원하는 상태로 유지', en: 'Maintains desired state' }, color: 'emerald' },
];

const WORKER_COMPONENTS: K8sComponent[] = [
  { name: 'kubelet', label: { ko: 'kubelet', en: 'kubelet' }, description: { ko: '노드의 Pod 관리 에이전트', en: 'Node agent managing Pods' }, color: 'amber' },
  { name: 'kube-proxy', label: { ko: 'kube-proxy', en: 'kube-proxy' }, description: { ko: '네트워크 규칙 및 서비스 라우팅', en: 'Network rules and service routing' }, color: 'rose' },
  { name: 'runtime', label: { ko: 'Container Runtime', en: 'Container Runtime' }, description: { ko: '컨테이너 실행 (containerd)', en: 'Runs containers (containerd)' }, color: 'purple' },
];

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-600 dark:text-violet-400', dot: 'bg-violet-500' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-600 dark:text-cyan-400', dot: 'bg-cyan-500' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-500' },
};

function ClusterArchitectureDiagram({ locale }: DiagramProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const all = [...CONTROL_PLANE_COMPONENTS, ...WORKER_COMPONENTS];
  const active = all.find((c) => c.name === selected);

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4">
      <h3 className="text-sm font-bold text-center">
        {locale === 'ko' ? 'Kubernetes 클러스터 아키텍처' : 'Kubernetes Cluster Architecture'}
      </h3>

      {/* Control Plane */}
      <div className="rounded-lg border-2 border-blue-500/40 bg-blue-500/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Control Plane</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CONTROL_PLANE_COMPONENTS.map((comp) => {
            const c = colorMap[comp.color];
            return (
              <button
                key={comp.name}
                onClick={() => setSelected(selected === comp.name ? null : comp.name)}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  selected === comp.name
                    ? `${c.bg} ${c.border} ring-2 ring-offset-1 ring-${comp.color}-500/30`
                    : `bg-background/80 border-border/50 hover:${c.bg}`
                }`}
              >
                <div className={`text-xs font-bold ${c.text}`}>{comp.label[locale]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <svg width="24" height="28" viewBox="0 0 24 28" className="text-muted-foreground">
          <path d="M12 0 L12 20 M6 16 L12 24 L18 16" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Worker Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[1, 2].map((nodeNum) => (
          <div key={nodeNum} className="rounded-lg border-2 border-amber-500/40 bg-amber-500/5 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Worker Node {nodeNum}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {WORKER_COMPONENTS.map((comp) => {
                const c = colorMap[comp.color];
                return (
                  <button
                    key={`${nodeNum}-${comp.name}`}
                    onClick={() => setSelected(selected === comp.name ? null : comp.name)}
                    className={`p-1.5 rounded-md border text-center transition-all ${
                      selected === comp.name
                        ? `${c.bg} ${c.border}`
                        : 'bg-background/80 border-border/50 hover:bg-muted/60'
                    }`}
                  >
                    <div className={`text-[10px] font-semibold ${c.text}`}>{comp.label[locale]}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      {active && (
        <div className={`p-3 rounded-lg border ${colorMap[active.color].bg} ${colorMap[active.color].border}`}>
          <span className={`text-xs font-bold ${colorMap[active.color].text}`}>{active.label[locale]}</span>
          <p className="text-xs text-muted-foreground mt-1">{active.description[locale]}</p>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. API Request Flow
//    Section: api-server-etcd (ch1)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface FlowStep {
  label: { ko: string; en: string };
  description: { ko: string; en: string };
  color: string;
}

const API_FLOW_STEPS: FlowStep[] = [
  { label: { ko: 'Client 요청', en: 'Client Request' }, description: { ko: 'kubectl, API 호출 등', en: 'kubectl, API calls, etc.' }, color: 'blue' },
  { label: { ko: '인증 (Authentication)', en: 'Authentication' }, description: { ko: '사용자 신원 확인 (인증서, 토큰)', en: 'Verify identity (certificates, tokens)' }, color: 'violet' },
  { label: { ko: '인가 (Authorization)', en: 'Authorization' }, description: { ko: 'RBAC 권한 확인', en: 'RBAC permission check' }, color: 'cyan' },
  { label: { ko: 'Admission Control', en: 'Admission Control' }, description: { ko: '정책 검증 및 변형', en: 'Policy validation and mutation' }, color: 'emerald' },
  { label: { ko: '객체 유효성 검증', en: 'Object Validation' }, description: { ko: 'API 스키마 검증', en: 'API schema validation' }, color: 'amber' },
  { label: { ko: 'etcd 저장', en: 'etcd Persist' }, description: { ko: '클러스터 상태 영구 저장', en: 'Persist cluster state' }, color: 'rose' },
];

function ApiRequestFlowDiagram({ locale }: DiagramProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-3">
      <h3 className="text-sm font-bold text-center">
        {locale === 'ko' ? 'API 요청 처리 흐름' : 'API Request Processing Flow'}
      </h3>
      <div className="flex flex-col items-center gap-1">
        {API_FLOW_STEPS.map((step, idx) => {
          const c = colorMap[step.color];
          const isHovered = hoveredIdx === idx;
          return (
            <div key={idx} className="flex flex-col items-center w-full max-w-xs">
              <button
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`w-full p-2.5 rounded-lg border-2 text-center transition-all ${
                  isHovered ? `${c.bg} ${c.border} scale-105` : `bg-background/80 ${c.border}`
                }`}
              >
                <div className={`text-xs font-bold ${c.text}`}>
                  {idx + 1}. {step.label[locale]}
                </div>
                {isHovered && (
                  <p className="text-[10px] text-muted-foreground mt-1">{step.description[locale]}</p>
                )}
              </button>
              {idx < API_FLOW_STEPS.length - 1 && (
                <svg width="16" height="16" viewBox="0 0 16 16" className="text-muted-foreground my-0.5">
                  <path d="M8 0 L8 10 M4 7 L8 13 L12 7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. Cron Schedule Syntax
//    Section: jobs-cronjobs (ch2)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CronField {
  symbol: string;
  label: { ko: string; en: string };
  range: string;
  color: string;
}

const CRON_FIELDS: CronField[] = [
  { symbol: '*', label: { ko: '분', en: 'Minute' }, range: '0-59', color: 'blue' },
  { symbol: '*', label: { ko: '시', en: 'Hour' }, range: '0-23', color: 'violet' },
  { symbol: '*', label: { ko: '일', en: 'Day of Month' }, range: '1-31', color: 'cyan' },
  { symbol: '*', label: { ko: '월', en: 'Month' }, range: '1-12', color: 'emerald' },
  { symbol: '*', label: { ko: '요일', en: 'Day of Week' }, range: '0-6', color: 'amber' },
];

const CRON_EXAMPLES = [
  { expr: '*/5 * * * *', label: { ko: '5분마다', en: 'Every 5 minutes' } },
  { expr: '0 */2 * * *', label: { ko: '2시간마다', en: 'Every 2 hours' } },
  { expr: '0 9 * * 1-5', label: { ko: '평일 9시', en: 'Weekdays at 9 AM' } },
  { expr: '0 0 1 * *', label: { ko: '매월 1일 자정', en: '1st of each month' } },
];

function CronScheduleDiagram({ locale }: DiagramProps) {
  const [activeField, setActiveField] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4">
      <h3 className="text-sm font-bold text-center">
        {locale === 'ko' ? 'Cron 스케줄 문법' : 'Cron Schedule Syntax'}
      </h3>

      {/* Cron expression visualization */}
      <div className="flex justify-center items-end gap-3 py-4">
        {CRON_FIELDS.map((field, idx) => {
          const c = colorMap[field.color];
          return (
            <button
              key={idx}
              onClick={() => setActiveField(activeField === idx ? null : idx)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center font-mono text-lg font-bold transition-all ${
                activeField === idx
                  ? `${c.bg} ${c.border} ${c.text} scale-110`
                  : `bg-background ${c.border} ${c.text} group-hover:scale-105`
              }`}>
                {field.symbol}
              </div>
              <div className="text-center">
                <div className={`text-[10px] font-bold ${c.text}`}>{field.label[locale]}</div>
                <div className="text-[9px] text-muted-foreground">{field.range}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Examples */}
      <div className="grid grid-cols-2 gap-2">
        {CRON_EXAMPLES.map((ex, idx) => (
          <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-background/80 border border-border/50">
            <code className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{ex.expr}</code>
            <span className="text-[10px] text-muted-foreground">{ex.label[locale]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. CSI Driver Architecture
//    Section: csi-drivers (ch4)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface CsiPlugin {
  name: string;
  label: { ko: string; en: string };
  type: { ko: string; en: string };
  functions: { ko: string[]; en: string[] };
  color: string;
}

const CSI_PLUGINS: CsiPlugin[] = [
  {
    name: 'controller',
    label: { ko: 'Controller Plugin', en: 'Controller Plugin' },
    type: { ko: 'Deployment / StatefulSet', en: 'Deployment / StatefulSet' },
    functions: {
      ko: ['볼륨 생성/삭제', '스냅샷 생성', '볼륨 확장', '볼륨 Attach/Detach'],
      en: ['Create/Delete volumes', 'Create snapshots', 'Expand volumes', 'Attach/Detach volumes'],
    },
    color: 'blue',
  },
  {
    name: 'node',
    label: { ko: 'Node Plugin', en: 'Node Plugin' },
    type: { ko: 'DaemonSet', en: 'DaemonSet' },
    functions: {
      ko: ['볼륨 Mount/Unmount', '볼륨 포맷', '노드 상태 보고', '디바이스 스캔'],
      en: ['Mount/Unmount volumes', 'Format volumes', 'Report node status', 'Scan devices'],
    },
    color: 'emerald',
  },
];

const CSI_SIDECARS = [
  { ko: 'external-provisioner', en: 'external-provisioner' },
  { ko: 'external-attacher', en: 'external-attacher' },
  { ko: 'external-snapshotter', en: 'external-snapshotter' },
  { ko: 'external-resizer', en: 'external-resizer' },
  { ko: 'node-driver-registrar', en: 'node-driver-registrar' },
];

function CsiArchitectureDiagram({ locale }: DiagramProps) {
  const [activePlugin, setActivePlugin] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4">
      <h3 className="text-sm font-bold text-center">
        {locale === 'ko' ? 'CSI 드라이버 아키텍처' : 'CSI Driver Architecture'}
      </h3>

      <div className="rounded-lg border-2 border-slate-500/30 bg-slate-500/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-500" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Kubernetes Cluster</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CSI_PLUGINS.map((plugin) => {
            const c = colorMap[plugin.color];
            const isActive = activePlugin === plugin.name;
            return (
              <button
                key={plugin.name}
                onClick={() => setActivePlugin(isActive ? null : plugin.name)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  isActive ? `${c.bg} ${c.border} scale-[1.02]` : `bg-background/80 ${c.border} hover:${c.bg}`
                }`}
              >
                <div className={`text-xs font-bold ${c.text}`}>{plugin.label[locale]}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{plugin.type[locale]}</div>
                {isActive && (
                  <ul className="mt-2 space-y-1">
                    {plugin.functions[locale].map((fn, idx) => (
                      <li key={idx} className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                        <div className={`w-1 h-1 rounded-full ${c.dot}`} />
                        {fn}
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidecars */}
        <div className="p-3 rounded-lg border border-purple-500/30 bg-purple-500/5">
          <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 mb-2">
            Sidecar Containers
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CSI_SIDECARS.map((sidecar, idx) => (
              <span key={idx} className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 font-mono">
                {sidecar[locale]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. k3s Architecture
//    Section: k3s-introduction (ch6)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface K3sNodeComponent {
  name: string;
  label: string;
  color: string;
}

const K3S_SERVER_COMPONENTS: K3sNodeComponent[] = [
  { name: 'api-server', label: 'API Server', color: 'blue' },
  { name: 'scheduler', label: 'Scheduler', color: 'cyan' },
  { name: 'controller', label: 'Controller Manager', color: 'emerald' },
  { name: 'sqlite', label: 'SQLite / etcd', color: 'violet' },
  { name: 'kubelet', label: 'Kubelet', color: 'amber' },
  { name: 'containerd', label: 'containerd', color: 'purple' },
];

const K3S_AGENT_COMPONENTS: K3sNodeComponent[] = [
  { name: 'kubelet', label: 'Kubelet', color: 'amber' },
  { name: 'containerd', label: 'containerd', color: 'purple' },
];

function K3sArchitectureDiagram({ locale }: DiagramProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4">
      <h3 className="text-sm font-bold text-center">
        {locale === 'ko' ? 'k3s 아키텍처' : 'k3s Architecture'}
      </h3>

      {/* k3s Server */}
      <div className="rounded-lg border-2 border-blue-500/40 bg-blue-500/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">k3s server</span>
          <span className="text-[9px] text-muted-foreground ml-auto">
            {locale === 'ko' ? 'Control Plane + Kubelet' : 'Control Plane + Kubelet'}
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {K3S_SERVER_COMPONENTS.map((comp) => {
            const c = colorMap[comp.color];
            return (
              <div key={comp.name} className={`p-2 rounded-md border ${c.border} ${c.bg} text-center`}>
                <div className={`text-[10px] font-semibold ${c.text}`}>{comp.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" className="text-muted-foreground">
          <path d="M12 0 L12 16 M7 12 L12 20 L17 12" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* k3s Agent */}
      <div className="rounded-lg border-2 border-amber-500/40 bg-amber-500/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">k3s agent</span>
          <span className="text-[9px] text-muted-foreground ml-auto">
            {locale === 'ko' ? 'Kubelet만 실행' : 'Kubelet only'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 max-w-xs">
          {K3S_AGENT_COMPONENTS.map((comp) => {
            const c = colorMap[comp.color];
            return (
              <div key={`agent-${comp.name}`} className={`p-2 rounded-md border ${c.border} ${c.bg} text-center`}>
                <div className={`text-[10px] font-semibold ${c.text}`}>{comp.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground text-center">
        {locale === 'ko'
          ? 'k3s server는 단일 바이너리(~70MB)로 모든 Control Plane 컴포넌트를 실행합니다'
          : 'k3s server runs all Control Plane components in a single binary (~70MB)'}
      </p>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. Pod Lifecycle
//    Section: pods-basics (ch2)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface PodPhase {
  name: string;
  label: { ko: string; en: string };
  description: { ko: string; en: string };
  color: string;
}

const POD_PHASES: PodPhase[] = [
  { name: 'pending', label: { ko: 'Pending', en: 'Pending' }, description: { ko: '스케줄링 대기 / 이미지 다운로드', en: 'Waiting to be scheduled / pulling image' }, color: 'amber' },
  { name: 'running', label: { ko: 'Running', en: 'Running' }, description: { ko: '하나 이상의 컨테이너 실행 중', en: 'At least one container is running' }, color: 'emerald' },
  { name: 'succeeded', label: { ko: 'Succeeded', en: 'Succeeded' }, description: { ko: '모든 컨테이너 정상 종료 (exit 0)', en: 'All containers terminated successfully (exit 0)' }, color: 'blue' },
  { name: 'failed', label: { ko: 'Failed', en: 'Failed' }, description: { ko: '컨테이너 비정상 종료', en: 'Container terminated with error' }, color: 'rose' },
  { name: 'unknown', label: { ko: 'Unknown', en: 'Unknown' }, description: { ko: '노드 통신 불가', en: 'Cannot communicate with node' }, color: 'purple' },
];

function PodLifecycleDiagram({ locale }: DiagramProps) {
  const [activePhase, setActivePhase] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4">
      <h3 className="text-sm font-bold text-center">
        {locale === 'ko' ? 'Pod 생명주기 (Phase)' : 'Pod Lifecycle (Phase)'}
      </h3>

      <div className="flex flex-wrap justify-center gap-2">
        {POD_PHASES.map((phase, idx) => {
          const c = colorMap[phase.color];
          const isActive = activePhase === phase.name;
          return (
            <div key={phase.name} className="flex items-center gap-1.5">
              <button
                onClick={() => setActivePhase(isActive ? null : phase.name)}
                className={`px-3 py-2 rounded-lg border-2 transition-all ${
                  isActive ? `${c.bg} ${c.border} scale-105` : `bg-background/80 ${c.border} hover:${c.bg}`
                }`}
              >
                <div className={`text-xs font-bold ${c.text}`}>{phase.label[locale]}</div>
              </button>
              {idx < POD_PHASES.length - 1 && idx < 2 && (
                <svg width="16" height="12" viewBox="0 0 16 12" className="text-muted-foreground">
                  <path d="M0 6 L10 6 M7 2 L13 6 L7 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {activePhase && (() => {
        const phase = POD_PHASES.find((p) => p.name === activePhase)!;
        const c = colorMap[phase.color];
        return (
          <div className={`p-3 rounded-lg border ${c.bg} ${c.border}`}>
            <span className={`text-xs font-bold ${c.text}`}>{phase.label[locale]}</span>
            <p className="text-xs text-muted-foreground mt-1">{phase.description[locale]}</p>
          </div>
        );
      })()}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Section → Diagram Mapping
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const k8sSectionDiagrams: Record<string, React.ComponentType<DiagramProps>> = {
  'k8s-overview': ClusterArchitectureDiagram,
  'api-server-etcd': ApiRequestFlowDiagram,
  'pods-basics': PodLifecycleDiagram,
  'jobs-cronjobs': CronScheduleDiagram,
  'csi-drivers': CsiArchitectureDiagram,
  'k3s-introduction': K3sArchitectureDiagram,
};
