import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'services-networking-003',
  domain: 'services-networking',
  order: 3,
  title: {
    ko: 'NetworkPolicy 생성하기',
    en: 'Create a NetworkPolicy',
  },
  description: {
    ko: `## 시나리오

보안 강화를 위해 특정 Pod에 대한 모든 인그레스(수신) 트래픽을 차단하는 NetworkPolicy를 생성해야 합니다.

### 요구사항

1. \`deny-all-ingress\`라는 이름의 **NetworkPolicy**를 생성하세요.
2. \`app=secure-app\` 레이블을 가진 Pod를 대상으로 설정하세요.
3. 모든 인그레스(수신) 트래픽을 **차단**하세요.

### 참고
- 이 문제의 환경에는 \`secure-app\` Pod가 이미 배포되어 있습니다.
- NetworkPolicy는 YAML 매니페스트로 작성해야 합니다.
- \`spec.ingress\` 필드를 비워두면 모든 인그레스 트래픽이 차단됩니다.`,
    en: `## Scenario

For enhanced security, you need to create a NetworkPolicy that denies all ingress (incoming) traffic to specific Pods.

### Requirements

1. Create a **NetworkPolicy** named \`deny-all-ingress\`.
2. Target Pods with the label \`app=secure-app\`.
3. **Deny** all ingress (incoming) traffic.

### Notes
- The \`secure-app\` Pod is already deployed in this lab environment.
- NetworkPolicy must be written as a YAML manifest.
- Leaving the \`spec.ingress\` field empty denies all ingress traffic.`,
  },
  category: 'NetworkPolicy',
  difficulty: 3,
  hints: {
    ko: [
      'NetworkPolicy의 apiVersion은 networking.k8s.io/v1입니다.',
      'spec.podSelector에 matchLabels를 사용하여 대상 Pod를 지정하세요.',
      'policyTypes에 "Ingress"를 포함하고, spec.ingress 필드를 정의하지 않으면 모든 인그레스가 차단됩니다.',
    ],
    en: [
      'The apiVersion for NetworkPolicy is networking.k8s.io/v1.',
      'Use matchLabels in spec.podSelector to target the Pods.',
      'Include "Ingress" in policyTypes and omit the spec.ingress field to deny all ingress traffic.',
    ],
  },
  explanation: {
    ko: `## NetworkPolicy 생성

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
spec:
  podSelector:
    matchLabels:
      app: secure-app
  policyTypes:
    - Ingress
\`\`\`

### 주요 개념
- **NetworkPolicy**는 Pod 간 네트워크 트래픽을 제어합니다.
- \`podSelector\`는 정책이 적용되는 Pod를 선택합니다.
- \`policyTypes\`에 "Ingress"를 지정하고 \`ingress\` 규칙을 비워두면 모든 수신 트래픽이 차단됩니다.
- NetworkPolicy는 네트워크 플러그인(예: Calico, Cilium)이 지원해야 적용됩니다.
- 기본적으로 Kubernetes는 모든 트래픽을 허용하므로, 보안이 필요한 경우 명시적으로 차단해야 합니다.`,
    en: `## Creating a NetworkPolicy

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
spec:
  podSelector:
    matchLabels:
      app: secure-app
  policyTypes:
    - Ingress
\`\`\`

### Key Concepts
- **NetworkPolicy** controls network traffic between Pods.
- \`podSelector\` selects the Pods to which the policy applies.
- Specifying "Ingress" in \`policyTypes\` with no \`ingress\` rules denies all incoming traffic.
- NetworkPolicy requires a compatible network plugin (e.g., Calico, Cilium) to be enforced.
- By default, Kubernetes allows all traffic, so explicit blocking is needed for security.`,
  },
  setupCommands: [
    'run secure-app --image=nginx:1.24 --labels=app=secure-app',
  ],
  verificationSteps: [
    {
      command: 'get networkpolicy deny-all-ingress -o jsonpath={.metadata.name}',
      expected: 'deny-all-ingress',
      description: {
        ko: 'deny-all-ingress NetworkPolicy가 존재하는지 확인',
        en: 'Verify deny-all-ingress NetworkPolicy exists',
      },
    },
    {
      command: 'get networkpolicy deny-all-ingress -o jsonpath={.spec.podSelector.matchLabels.app}',
      expected: 'secure-app',
      description: {
        ko: 'podSelector가 app=secure-app인지 확인',
        en: 'Verify podSelector targets app=secure-app',
      },
    },
  ],
  cleanupCommands: [
    'delete networkpolicy deny-all-ingress --ignore-not-found',
    'delete pod secure-app --ignore-not-found',
  ],
  namespace: 'lab-networking-003',
  editorMode: 'yaml',
  expectedAnswer: `apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
spec:
  podSelector:
    matchLabels:
      app: secure-app
  policyTypes:
    - Ingress`,
};
