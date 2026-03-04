'use client';

import { useState } from 'react';

interface DiagramProps {
  locale: 'ko' | 'en';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Shared color map
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-600 dark:text-violet-400', dot: 'bg-violet-500' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-600 dark:text-cyan-400', dot: 'bg-cyan-500' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-500' },
};

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
// 2. API Server & etcd (Tabbed)
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

interface CommFlowNode {
  label: { ko: string; en: string };
  description: { ko: string; en: string };
  color: string;
}

const COMM_FLOW_TOP: CommFlowNode[] = [
  { label: { ko: 'User', en: 'User' }, description: { ko: '사용자 (관리자, 개발자)', en: 'User (admin, developer)' }, color: 'blue' },
  { label: { ko: 'kubectl', en: 'kubectl' }, description: { ko: 'CLI 도구 → API 요청 변환', en: 'CLI tool → converts to API requests' }, color: 'violet' },
  { label: { ko: 'API Server', en: 'API Server' }, description: { ko: '모든 요청의 중앙 허브', en: 'Central hub for all requests' }, color: 'cyan' },
  { label: { ko: 'etcd', en: 'etcd' }, description: { ko: '상태 저장소 (Key-Value)', en: 'State storage (Key-Value)' }, color: 'emerald' },
];

const COMM_FLOW_BOTTOM: CommFlowNode[] = [
  { label: { ko: 'Scheduler', en: 'Scheduler' }, description: { ko: 'Pod 배치 결정', en: 'Pod placement decisions' }, color: 'amber' },
  { label: { ko: 'kubelet', en: 'kubelet' }, description: { ko: 'Pod 실행 관리', en: 'Pod execution management' }, color: 'rose' },
  { label: { ko: 'Container Runtime', en: 'Container Runtime' }, description: { ko: '컨테이너 실행 (containerd)', en: 'Runs containers (containerd)' }, color: 'purple' },
];

interface EtcdEntry {
  path: string;
  description: { ko: string; en: string };
  color: string;
}

const ETCD_ENTRIES: EtcdEntry[] = [
  { path: '/registry/pods/default/my-pod', description: { ko: 'Pod 오브젝트의 전체 스펙과 상태 정보', en: 'Full spec and status of the Pod object' }, color: 'blue' },
  { path: '/registry/services/default/my-service', description: { ko: 'Service의 ClusterIP, 포트, 셀렉터 정보', en: 'Service ClusterIP, ports, and selector info' }, color: 'violet' },
  { path: '/registry/deployments/default/my-deployment', description: { ko: 'Deployment의 replicas, 전략, 템플릿 정보', en: 'Deployment replicas, strategy, and template info' }, color: 'cyan' },
  { path: '/registry/secrets/default/my-secret', description: { ko: 'Secret 데이터 (base64 인코딩)', en: 'Secret data (base64 encoded)' }, color: 'emerald' },
];

function ApiServerEtcdDiagram({ locale }: DiagramProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const tabs = [
    { ko: '통신 흐름', en: 'Comm Flow' },
    { ko: '요청 파이프라인', en: 'Request Pipeline' },
    { ko: 'etcd 레지스트리', en: 'etcd Registry' },
  ];

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-3">
      <h3 className="text-sm font-bold text-center">
        {locale === 'ko' ? 'API Server & etcd' : 'API Server & etcd'}
      </h3>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted/40 border border-border/40">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`flex-1 px-2 py-1.5 rounded-md text-[10px] font-semibold transition-all ${
              activeTab === idx
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab[locale]}
          </button>
        ))}
      </div>

      {/* Tab 1: Communication Flow */}
      {activeTab === 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {COMM_FLOW_TOP.map((node, idx) => {
              const c = colorMap[node.color];
              const isSelected = selectedNode === `top-${idx}`;
              return (
                <div key={idx} className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedNode(isSelected ? null : `top-${idx}`)}
                    className={`px-2.5 py-2 rounded-lg border-2 text-center transition-all ${
                      isSelected ? `${c.bg} ${c.border} scale-105` : `bg-background/80 ${c.border} hover:${c.bg}`
                    }`}
                  >
                    <div className={`text-[10px] font-bold ${c.text}`}>{node.label[locale]}</div>
                  </button>
                  {idx < COMM_FLOW_TOP.length - 1 && (
                    <svg width="16" height="12" viewBox="0 0 16 12" className="text-muted-foreground flex-shrink-0">
                      <path d="M0 6 L10 6 M7 2 L13 6 L7 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center">
            <svg width="16" height="20" viewBox="0 0 16 20" className="text-muted-foreground">
              <path d="M8 0 L8 13 M4 10 L8 17 L12 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          <div className="flex items-center justify-center gap-1 flex-wrap">
            {COMM_FLOW_BOTTOM.map((node, idx) => {
              const c = colorMap[node.color];
              const isSelected = selectedNode === `btm-${idx}`;
              return (
                <div key={idx} className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedNode(isSelected ? null : `btm-${idx}`)}
                    className={`px-2.5 py-2 rounded-lg border-2 text-center transition-all ${
                      isSelected ? `${c.bg} ${c.border} scale-105` : `bg-background/80 ${c.border} hover:${c.bg}`
                    }`}
                  >
                    <div className={`text-[10px] font-bold ${c.text}`}>{node.label[locale]}</div>
                  </button>
                  {idx < COMM_FLOW_BOTTOM.length - 1 && (
                    <svg width="16" height="12" viewBox="0 0 16 12" className="text-muted-foreground flex-shrink-0">
                      <path d="M0 6 L10 6 M7 2 L13 6 L7 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>

          {selectedNode && (() => {
            const isTop = selectedNode.startsWith('top-');
            const idx = parseInt(selectedNode.split('-')[1]);
            const node = isTop ? COMM_FLOW_TOP[idx] : COMM_FLOW_BOTTOM[idx];
            const c = colorMap[node.color];
            return (
              <div className={`p-3 rounded-lg border ${c.bg} ${c.border}`}>
                <span className={`text-xs font-bold ${c.text}`}>{node.label[locale]}</span>
                <p className="text-xs text-muted-foreground mt-1">{node.description[locale]}</p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Tab 2: Request Pipeline */}
      {activeTab === 1 && (
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
      )}

      {/* Tab 3: etcd Registry */}
      {activeTab === 2 && (
        <div className="space-y-2">
          <div className="rounded-lg border border-violet-500/30 bg-violet-500/5 p-3">
            <div className="text-[10px] font-bold text-violet-600 dark:text-violet-400 mb-2 font-mono">/registry/</div>
            <div className="space-y-1 pl-2">
              {ETCD_ENTRIES.map((entry, idx) => {
                const c = colorMap[entry.color];
                const isSelected = selectedEntry === entry.path;
                const isLast = idx === ETCD_ENTRIES.length - 1;
                return (
                  <div key={entry.path}>
                    <button
                      onClick={() => setSelectedEntry(isSelected ? null : entry.path)}
                      className={`w-full text-left px-2 py-1.5 rounded-md transition-all font-mono text-[10px] ${
                        isSelected ? `${c.bg} ${c.border} border` : 'hover:bg-muted/40'
                      }`}
                    >
                      <span className="text-muted-foreground">{isLast ? '\u2514\u2500\u2500 ' : '\u251C\u2500\u2500 '}</span>
                      <span className={`font-semibold ${c.text}`}>{entry.path.replace('/registry/', '')}</span>
                    </button>
                    {isSelected && (
                      <div className={`ml-6 mt-1 mb-1 p-2 rounded-md border ${c.bg} ${c.border}`}>
                        <p className="text-[10px] text-muted-foreground">{entry.description[locale]}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground text-center">
            {locale === 'ko'
              ? 'etcd는 모든 클러스터 상태를 /registry/ 경로 아래 Key-Value로 저장합니다'
              : 'etcd stores all cluster state as Key-Value pairs under /registry/'}
          </p>
        </div>
      )}
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

      <div className="flex justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" className="text-muted-foreground">
          <path d="M12 0 L12 16 M7 12 L12 20 L17 12" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </div>

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
// 7. RBAC Authorization Flow
//    Section: rbac (ch1)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface RbacResource {
  name: string;
  label: { ko: string; en: string };
  scope: { ko: string; en: string };
  description: { ko: string; en: string };
  color: string;
}

const RBAC_RESOURCES: RbacResource[] = [
  { name: 'role', label: { ko: 'Role', en: 'Role' }, scope: { ko: '네임스페이스', en: 'Namespace' }, description: { ko: '특정 네임스페이스 내 권한 정의 (pods, services 등)', en: 'Defines permissions within a specific namespace (pods, services, etc.)' }, color: 'blue' },
  { name: 'clusterrole', label: { ko: 'ClusterRole', en: 'ClusterRole' }, scope: { ko: '클러스터 전체', en: 'Cluster-wide' }, description: { ko: '클러스터 범위 권한 정의 (nodes, PVs 등 포함)', en: 'Defines cluster-wide permissions (including nodes, PVs, etc.)' }, color: 'violet' },
  { name: 'rolebinding', label: { ko: 'RoleBinding', en: 'RoleBinding' }, scope: { ko: '네임스페이스', en: 'Namespace' }, description: { ko: 'Role/ClusterRole을 사용자에게 네임스페이스 범위로 바인딩', en: 'Binds Role/ClusterRole to users within namespace scope' }, color: 'cyan' },
  { name: 'clusterrolebinding', label: { ko: 'ClusterRoleBinding', en: 'ClusterRoleBinding' }, scope: { ko: '클러스터 전체', en: 'Cluster-wide' }, description: { ko: 'ClusterRole을 사용자에게 클러스터 범위로 바인딩', en: 'Binds ClusterRole to users cluster-wide' }, color: 'emerald' },
];

const RBAC_FLOW_STEPS = [
  { label: { ko: 'User / ServiceAccount', en: 'User / ServiceAccount' }, color: 'amber' },
  { label: { ko: 'RoleBinding', en: 'RoleBinding' }, color: 'cyan' },
  { label: { ko: 'Role', en: 'Role' }, color: 'blue' },
  { label: { ko: '리소스 접근 권한', en: 'Resource Access' }, color: 'emerald' },
];

function RbacFlowDiagram({ locale }: DiagramProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const active = RBAC_RESOURCES.find((r) => r.name === selected);

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4">
      <h3 className="text-sm font-bold text-center">
        {locale === 'ko' ? 'RBAC 인가 흐름' : 'RBAC Authorization Flow'}
      </h3>

      {/* Flow */}
      <div className="flex items-center justify-center gap-1 flex-wrap">
        {RBAC_FLOW_STEPS.map((step, idx) => {
          const c = colorMap[step.color];
          return (
            <div key={idx} className="flex items-center gap-1">
              <div className={`px-3 py-2 rounded-lg border-2 ${c.border} ${c.bg}`}>
                <div className={`text-[10px] font-bold ${c.text}`}>{step.label[locale]}</div>
              </div>
              {idx < RBAC_FLOW_STEPS.length - 1 && (
                <svg width="16" height="12" viewBox="0 0 16 12" className="text-muted-foreground flex-shrink-0">
                  <path d="M0 6 L10 6 M7 2 L13 6 L7 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* 4 RBAC Resources */}
      <div className="grid grid-cols-2 gap-2">
        {RBAC_RESOURCES.map((res) => {
          const c = colorMap[res.color];
          const isActive = selected === res.name;
          return (
            <button
              key={res.name}
              onClick={() => setSelected(isActive ? null : res.name)}
              className={`p-2.5 rounded-lg border-2 text-left transition-all ${
                isActive ? `${c.bg} ${c.border} scale-[1.02]` : `bg-background/80 ${c.border} hover:${c.bg}`
              }`}
            >
              <div className={`text-xs font-bold ${c.text}`}>{res.label[locale]}</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">{res.scope[locale]}</div>
            </button>
          );
        })}
      </div>

      {active && (
        <div className={`p-3 rounded-lg border ${colorMap[active.color].bg} ${colorMap[active.color].border}`}>
          <span className={`text-xs font-bold ${colorMap[active.color].text}`}>{active.label[locale]}</span>
          <span className="text-[9px] text-muted-foreground ml-2">({active.scope[locale]})</span>
          <p className="text-xs text-muted-foreground mt-1">{active.description[locale]}</p>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. Cluster Upgrade Order
//    Section: cluster-upgrade (ch1)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface UpgradePhase {
  id: string;
  label: { ko: string; en: string };
  color: string;
  steps: { ko: string; en: string }[];
}

const UPGRADE_PHASES: UpgradePhase[] = [
  {
    id: 'control-plane',
    label: { ko: '1. 컨트롤 플레인 노드 (순차적)', en: '1. Control Plane Nodes (sequential)' },
    color: 'blue',
    steps: [
      { ko: 'kubeadm 업그레이드', en: 'Upgrade kubeadm' },
      { ko: '컨트롤 플레인 컴포넌트 업그레이드', en: 'Upgrade control plane components' },
      { ko: 'kubelet, kubectl 업그레이드', en: 'Upgrade kubelet, kubectl' },
    ],
  },
  {
    id: 'worker',
    label: { ko: '2. 워커 노드 (순차적 또는 병렬)', en: '2. Worker Nodes (sequential or parallel)' },
    color: 'amber',
    steps: [
      { ko: 'drain (파드 이동)', en: 'drain (move pods)' },
      { ko: 'kubeadm, kubelet, kubectl 업그레이드', en: 'Upgrade kubeadm, kubelet, kubectl' },
      { ko: 'uncordon (노드 복귀)', en: 'uncordon (node returns)' },
    ],
  },
];

function ClusterUpgradeDiagram({ locale }: DiagramProps) {
  const [expanded, setExpanded] = useState<string | null>('control-plane');

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-3">
      <h3 className="text-sm font-bold text-center">
        {locale === 'ko' ? '클러스터 업그레이드 순서' : 'Cluster Upgrade Order'}
      </h3>

      <div className="space-y-2">
        {UPGRADE_PHASES.map((phase, phaseIdx) => {
          const c = colorMap[phase.color];
          const isExpanded = expanded === phase.id;
          return (
            <div key={phase.id}>
              <button
                onClick={() => setExpanded(isExpanded ? null : phase.id)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  isExpanded ? `${c.bg} ${c.border}` : `bg-background/80 ${c.border} hover:${c.bg}`
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`text-xs font-bold ${c.text}`}>{phase.label[locale]}</div>
                  <svg
                    width="14" height="14" viewBox="0 0 14 14"
                    className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <path d="M3 5 L7 9 L11 5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              </button>
              {isExpanded && (
                <div className="ml-4 mt-1 space-y-1 pl-3 border-l-2 border-border/40">
                  {phase.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 py-1">
                      <div className={`w-5 h-5 rounded-full ${c.bg} ${c.border} border flex items-center justify-center`}>
                        <span className={`text-[9px] font-bold ${c.text}`}>{idx + 1}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{step[locale]}</span>
                    </div>
                  ))}
                </div>
              )}
              {phaseIdx < UPGRADE_PHASES.length - 1 && (
                <div className="flex justify-center py-1">
                  <svg width="16" height="16" viewBox="0 0 16 16" className="text-muted-foreground">
                    <path d="M8 0 L8 10 M4 7 L8 13 L12 7" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[9px] text-muted-foreground text-center">
        {locale === 'ko'
          ? '한 번에 하나의 마이너 버전만 업그레이드 (예: 1.29 → 1.30)'
          : 'Upgrade only one minor version at a time (e.g., 1.29 → 1.30)'}
      </p>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 9. EndpointSlice Distribution
//    Section: endpoint-slices (ch3)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function EndpointSliceDiagram({ locale }: DiagramProps) {
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const sliceCount = 10;

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4">
      <h3 className="text-sm font-bold text-center">
        {locale === 'ko' ? 'EndpointSlice 분산 구조' : 'EndpointSlice Distribution'}
      </h3>

      {/* Service header */}
      <div className="rounded-lg border-2 border-blue-500/40 bg-blue-500/5 p-3 text-center">
        <div className="text-xs font-bold text-blue-600 dark:text-blue-400">Service</div>
        <div className="text-[9px] text-muted-foreground">
          {locale === 'ko' ? '1000 Pods' : '1000 Pods'}
        </div>
      </div>

      <div className="flex justify-center">
        <svg width="16" height="16" viewBox="0 0 16 16" className="text-muted-foreground">
          <path d="M8 0 L8 10 M4 7 L8 13 L12 7" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {/* EndpointSlice grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: sliceCount }, (_, i) => {
          const isHighlighted = highlighted === i;
          const isChanged = i === 3;
          return (
            <button
              key={i}
              onClick={() => setHighlighted(isHighlighted ? null : i)}
              className={`p-2 rounded-lg border-2 text-center transition-all ${
                isChanged && highlighted === null
                  ? 'border-amber-500/40 bg-amber-500/10 animate-pulse'
                  : isHighlighted
                    ? 'border-cyan-500/40 bg-cyan-500/10 scale-105'
                    : 'border-border/50 bg-background/80 hover:bg-muted/40'
              }`}
            >
              <div className={`text-[9px] font-bold ${
                isChanged && highlighted === null ? 'text-amber-600 dark:text-amber-400' : isHighlighted ? 'text-cyan-600 dark:text-cyan-400' : 'text-muted-foreground'
              }`}>
                Slice-{i + 1}
              </div>
              <div className="text-[8px] text-muted-foreground">100 ep</div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded border-2 border-amber-500/40 bg-amber-500/10" />
          <span className="text-[9px] text-muted-foreground">
            {locale === 'ko' ? '변경된 슬라이스만 업데이트' : 'Only changed slice updates'}
          </span>
        </div>
      </div>

      {highlighted !== null && (
        <div className="p-3 rounded-lg border border-cyan-500/30 bg-cyan-500/5">
          <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">EndpointSlice-{highlighted + 1}</span>
          <p className="text-[10px] text-muted-foreground mt-1">
            {locale === 'ko'
              ? `100개 엔드포인트 포함. Pod 변경 시 이 슬라이스만 업데이트되어 네트워크 트래픽 감소`
              : `Contains 100 endpoints. When a Pod changes, only this slice is updated, reducing network traffic`}
          </p>
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 10. PV/PVC Lifecycle
//     Section: pv-pvc (ch4)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface PvPvcPhase {
  name: string;
  label: { ko: string; en: string };
  description: { ko: string; en: string };
  color: string;
}

const PV_PVC_PHASES: PvPvcPhase[] = [
  { name: 'provisioning', label: { ko: '프로비저닝', en: 'Provisioning' }, description: { ko: '정적(Static): 관리자가 PV 수동 생성\n동적(Dynamic): StorageClass로 자동 생성', en: 'Static: Admin creates PV manually\nDynamic: Auto-created via StorageClass' }, color: 'blue' },
  { name: 'binding', label: { ko: '바인딩', en: 'Binding' }, description: { ko: 'PVC가 조건에 맞는 PV를 찾아 1:1 바인딩 (용량, 접근 모드, StorageClass 매칭)', en: 'PVC finds a matching PV for 1:1 binding (capacity, access modes, StorageClass match)' }, color: 'violet' },
  { name: 'using', label: { ko: '사용', en: 'Using' }, description: { ko: 'Pod가 PVC를 볼륨으로 마운트하여 데이터 읽기/쓰기', en: 'Pod mounts PVC as volume for data read/write' }, color: 'emerald' },
  { name: 'reclaiming', label: { ko: '회수 (Reclaim)', en: 'Reclaiming' }, description: { ko: 'PVC 삭제 후 reclaimPolicy에 따라:\nRetain: PV 유지\nDelete: PV + 스토리지 삭제\nRecycle: 데이터 삭제 후 재사용', en: 'After PVC deletion, per reclaimPolicy:\nRetain: Keep PV\nDelete: Remove PV + storage\nRecycle: Clear data and reuse' }, color: 'amber' },
];

function PvPvcLifecycleDiagram({ locale }: DiagramProps) {
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const active = PV_PVC_PHASES.find((p) => p.name === activePhase);

  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4">
      <h3 className="text-sm font-bold text-center">
        {locale === 'ko' ? 'PV/PVC 라이프사이클' : 'PV/PVC Lifecycle'}
      </h3>

      <div className="flex items-center justify-center gap-1 flex-wrap">
        {PV_PVC_PHASES.map((phase, idx) => {
          const c = colorMap[phase.color];
          const isActive = activePhase === phase.name;
          return (
            <div key={phase.name} className="flex items-center gap-1">
              <button
                onClick={() => setActivePhase(isActive ? null : phase.name)}
                className={`px-3 py-2 rounded-lg border-2 transition-all ${
                  isActive ? `${c.bg} ${c.border} scale-105` : `bg-background/80 ${c.border} hover:${c.bg}`
                }`}
              >
                <div className={`text-[10px] font-bold ${c.text}`}>{phase.label[locale]}</div>
              </button>
              {idx < PV_PVC_PHASES.length - 1 && (
                <svg width="16" height="12" viewBox="0 0 16 12" className="text-muted-foreground flex-shrink-0">
                  <path d="M0 6 L10 6 M7 2 L13 6 L7 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {active && (() => {
        const c = colorMap[active.color];
        return (
          <div className={`p-3 rounded-lg border ${c.bg} ${c.border}`}>
            <span className={`text-xs font-bold ${c.text}`}>{active.label[locale]}</span>
            <div className="text-xs text-muted-foreground mt-1 whitespace-pre-line">{active.description[locale]}</div>
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
  'api-server-etcd': ApiServerEtcdDiagram,
  'pods-basics': PodLifecycleDiagram,
  'jobs-cronjobs': CronScheduleDiagram,
  'csi-drivers': CsiArchitectureDiagram,
  'k3s-introduction': K3sArchitectureDiagram,
  'rbac': RbacFlowDiagram,
  'cluster-upgrade': ClusterUpgradeDiagram,
  'endpoint-slices': EndpointSliceDiagram,
  'pv-pvc': PvPvcLifecycleDiagram,
};
