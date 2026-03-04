import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'workloads-scheduling-005',
  domain: 'workloads-scheduling',
  order: 5,
  title: {
    ko: 'DaemonSet 생성하기',
    en: 'Create a DaemonSet',
  },
  description: {
    ko: `## 시나리오

클러스터의 모든 노드에서 로그 수집 에이전트를 실행해야 합니다.

### 요구사항

1. \`log-collector\`라는 이름의 DaemonSet을 생성하세요.
2. 이미지는 \`busybox:1.36\`을 사용하세요.
3. 컨테이너에서 \`sleep 3600\` 명령을 실행하세요.

### 참고
- DaemonSet은 \`kubectl create\`로 직접 생성할 수 없으므로 YAML 매니페스트를 작성해야 합니다.
- DaemonSet은 클러스터의 모든 (또는 일부) 노드에서 Pod 복사본을 실행합니다.
- \`spec.template.spec.containers[0].command\`에 실행할 명령을 배열로 지정합니다.`,
    en: `## Scenario

You need to run a log collection agent on every node in the cluster.

### Requirements

1. Create a DaemonSet named \`log-collector\`.
2. Use the \`busybox:1.36\` image.
3. Run the \`sleep 3600\` command in the container.

### Notes
- DaemonSets cannot be created directly with \`kubectl create\`, so you must write a YAML manifest.
- A DaemonSet ensures that a copy of a Pod runs on all (or some) nodes in the cluster.
- Specify the command to run as an array in \`spec.template.spec.containers[0].command\`.`,
  },
  category: 'DaemonSet',
  difficulty: 2,
  hints: {
    ko: [
      'DaemonSet은 kubectl create로 생성할 수 없습니다. YAML 매니페스트를 작성하세요.',
      'apiVersion은 apps/v1을 사용하고, kind는 DaemonSet으로 지정하세요.',
      'spec.selector.matchLabels와 spec.template.metadata.labels가 일치해야 합니다. command는 ["sleep", "3600"]으로 지정하세요.',
    ],
    en: [
      'DaemonSets cannot be created with kubectl create. Write a YAML manifest instead.',
      'Use apiVersion apps/v1 and kind DaemonSet.',
      'spec.selector.matchLabels must match spec.template.metadata.labels. Set command to ["sleep", "3600"].',
    ],
  },
  explanation: {
    ko: `## DaemonSet 생성

\`\`\`yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-collector
spec:
  selector:
    matchLabels:
      app: log-collector
  template:
    metadata:
      labels:
        app: log-collector
    spec:
      containers:
      - name: log-collector
        image: busybox:1.36
        command: ["sleep", "3600"]
\`\`\`

### 주요 개념
- **DaemonSet**은 클러스터의 모든 노드(또는 특정 노드)에서 Pod를 실행합니다.
- 새 노드가 추가되면 자동으로 Pod가 배포되고, 노드가 제거되면 Pod도 정리됩니다.
- 로그 수집, 모니터링 에이전트, 네트워크 플러그인 등에 주로 사용됩니다.
- \`nodeSelector\`나 \`tolerations\`를 사용하여 특정 노드에서만 실행할 수도 있습니다.`,
    en: `## Creating a DaemonSet

\`\`\`yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-collector
spec:
  selector:
    matchLabels:
      app: log-collector
  template:
    metadata:
      labels:
        app: log-collector
    spec:
      containers:
      - name: log-collector
        image: busybox:1.36
        command: ["sleep", "3600"]
\`\`\`

### Key Concepts
- A **DaemonSet** ensures a Pod runs on all (or selected) nodes in the cluster.
- When a new node is added, a Pod is automatically deployed; when a node is removed, the Pod is cleaned up.
- Commonly used for log collectors, monitoring agents, and network plugins.
- Use \`nodeSelector\` or \`tolerations\` to limit execution to specific nodes.`,
  },
  setupCommands: [],
  verificationSteps: [
    {
      command: 'get daemonset log-collector -o jsonpath={.metadata.name}',
      expected: 'log-collector',
      description: {
        ko: 'log-collector DaemonSet이 존재하는지 확인',
        en: 'Verify log-collector DaemonSet exists',
      },
    },
    {
      command: 'get daemonset log-collector -o jsonpath={.spec.template.spec.containers[0].image}',
      expected: 'busybox:1.36',
      description: {
        ko: '이미지가 busybox:1.36인지 확인',
        en: 'Verify image is busybox:1.36',
      },
    },
  ],
  cleanupCommands: ['delete daemonset log-collector --ignore-not-found'],
  namespace: 'lab-workloads-005',
  editorMode: 'yaml',
  expectedAnswer: `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-collector
spec:
  selector:
    matchLabels:
      app: log-collector
  template:
    metadata:
      labels:
        app: log-collector
    spec:
      containers:
      - name: log-collector
        image: busybox:1.36
        command: ["sleep", "3600"]`,
};
