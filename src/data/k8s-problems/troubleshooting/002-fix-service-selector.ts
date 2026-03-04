import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'troubleshooting-002',
  domain: 'troubleshooting',
  order: 2,
  title: {
    ko: 'Service 셀렉터 수정하기',
    en: 'Fix Service Selector',
  },
  description: {
    ko: `## 시나리오

\`web-svc\` Service가 \`web-app\` Pod에 트래픽을 전달하지 못하고 있습니다. Service의 셀렉터가 잘못 설정되어 있습니다.

### 요구사항

1. \`web-svc\` Service의 현재 셀렉터를 확인하세요.
2. \`web-app\` Deployment의 Pod 라벨을 확인하세요.
3. Service의 셀렉터를 \`app=web-app\`으로 수정하여 Pod와 올바르게 연결하세요.

### 참고
- \`kubectl describe service\`로 Service의 셀렉터를 확인할 수 있습니다.
- \`kubectl get pods --show-labels\`로 Pod의 라벨을 확인할 수 있습니다.
- \`kubectl patch\` 또는 \`kubectl edit\`으로 Service를 수정할 수 있습니다.`,
    en: `## Scenario

The \`web-svc\` Service is unable to route traffic to the \`web-app\` Pods. The Service selector is incorrectly configured.

### Requirements

1. Check the current selector of the \`web-svc\` Service.
2. Verify the Pod labels of the \`web-app\` Deployment.
3. Fix the Service selector to \`app=web-app\` so it correctly targets the Pods.

### Notes
- Use \`kubectl describe service\` to inspect the Service selector.
- Use \`kubectl get pods --show-labels\` to check Pod labels.
- Use \`kubectl patch\` or \`kubectl edit\` to modify the Service.`,
  },
  category: 'Troubleshooting',
  difficulty: 2,
  hints: {
    ko: [
      'kubectl describe service web-svc 명령으로 현재 셀렉터를 확인하세요.',
      'kubectl get pods --show-labels로 Pod의 라벨을 확인하고 Service 셀렉터와 비교하세요.',
      "kubectl patch service web-svc -p '{\"spec\":{\"selector\":{\"app\":\"web-app\"}}}'",
    ],
    en: [
      'Check the current selector with kubectl describe service web-svc.',
      'Compare Pod labels (kubectl get pods --show-labels) with the Service selector.',
      "kubectl patch service web-svc -p '{\"spec\":{\"selector\":{\"app\":\"web-app\"}}}'",
    ],
  },
  explanation: {
    ko: `## Service 셀렉터 수정

### 1. 문제 확인
\`\`\`bash
kubectl describe service web-svc
kubectl get pods --show-labels
\`\`\`
Service의 셀렉터가 Pod의 라벨과 일치하지 않으면 트래픽이 전달되지 않습니다.

### 2. 수정
\`\`\`bash
kubectl patch service web-svc -p '{"spec":{"selector":{"app":"web-app"}}}'
\`\`\`

### 주요 개념
- **Service 셀렉터**는 트래픽을 수신할 Pod를 결정합니다.
- 셀렉터와 Pod 라벨이 정확히 일치해야 Endpoints가 생성됩니다.
- \`kubectl get endpoints web-svc\`로 Service에 연결된 Pod를 확인할 수 있습니다.
- Service 문제의 대부분은 셀렉터와 라벨 불일치에서 발생합니다.`,
    en: `## Fixing Service Selector

### 1. Diagnose the issue
\`\`\`bash
kubectl describe service web-svc
kubectl get pods --show-labels
\`\`\`
If the Service selector does not match the Pod labels, no traffic will be routed.

### 2. Fix
\`\`\`bash
kubectl patch service web-svc -p '{"spec":{"selector":{"app":"web-app"}}}'
\`\`\`

### Key Concepts
- The **Service selector** determines which Pods receive traffic.
- The selector must exactly match Pod labels for Endpoints to be created.
- Use \`kubectl get endpoints web-svc\` to verify which Pods are connected to the Service.
- Most Service issues stem from selector-label mismatches.`,
  },
  setupCommands: [
    'create deployment web-app --image=nginx:1.24 --replicas=2',
    'create service clusterip web-svc --tcp=80:80',
  ],
  verificationSteps: [
    {
      command: 'get service web-svc -o jsonpath={.spec.selector.app}',
      expected: 'web-app',
      description: {
        ko: 'Service 셀렉터가 app=web-app으로 설정되었는지 확인',
        en: 'Verify Service selector is set to app=web-app',
      },
    },
  ],
  cleanupCommands: [
    'delete service web-svc --ignore-not-found',
    'delete deployment web-app --ignore-not-found',
  ],
  namespace: 'lab-troubleshooting-002',
  editorMode: 'kubectl',
  expectedAnswer: `kubectl patch service web-svc -p '{"spec":{"selector":{"app":"web-app"}}}'`,
};
