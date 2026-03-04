import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'workloads-scheduling-003',
  domain: 'workloads-scheduling',
  order: 3,
  title: {
    ko: 'Deployment 스케일링',
    en: 'Scale a Deployment',
  },
  description: {
    ko: `## 시나리오

트래픽 증가에 대응하기 위해 기존 \`api-server\` Deployment의 레플리카 수를 늘려야 합니다.

### 요구사항

1. 현재 **2개**의 레플리카로 실행 중인 \`api-server\` Deployment를 확인하세요.
2. 레플리카 수를 **5개**로 스케일 업하세요.

### 참고
- \`kubectl scale\` 명령을 사용하여 Deployment의 레플리카 수를 변경할 수 있습니다.
- \`--replicas\` 플래그로 원하는 레플리카 수를 지정합니다.`,
    en: `## Scenario

You need to scale up the existing \`api-server\` Deployment to handle increased traffic.

### Requirements

1. Verify the \`api-server\` Deployment is currently running with **2** replicas.
2. Scale it up to **5** replicas.

### Notes
- You can use the \`kubectl scale\` command to change the replica count of a Deployment.
- Use the \`--replicas\` flag to specify the desired number of replicas.`,
  },
  category: 'Deployment',
  difficulty: 1,
  hints: {
    ko: [
      'kubectl scale deployment 명령에 --replicas 플래그를 사용하세요.',
      'kubectl scale deployment api-server --replicas=5',
      'kubectl get deployment api-server 명령으로 현재 레플리카 수를 확인할 수 있습니다.',
    ],
    en: [
      'Use the --replicas flag with the kubectl scale deployment command.',
      'kubectl scale deployment api-server --replicas=5',
      'You can check the current replica count with kubectl get deployment api-server.',
    ],
  },
  explanation: {
    ko: `## Deployment 스케일링

\`\`\`bash
kubectl scale deployment api-server --replicas=5
\`\`\`

### 주요 개념
- **스케일링**은 실행 중인 Pod의 수를 조정하는 것입니다.
- \`kubectl scale\`은 Deployment, ReplicaSet, StatefulSet의 레플리카 수를 변경합니다.
- 스케일 업하면 더 많은 트래픽을 처리할 수 있고, 스케일 다운하면 리소스를 절약할 수 있습니다.
- HPA(Horizontal Pod Autoscaler)를 사용하면 자동 스케일링도 가능합니다.`,
    en: `## Scaling a Deployment

\`\`\`bash
kubectl scale deployment api-server --replicas=5
\`\`\`

### Key Concepts
- **Scaling** adjusts the number of running Pods.
- \`kubectl scale\` changes the replica count of Deployments, ReplicaSets, and StatefulSets.
- Scaling up handles more traffic, while scaling down saves resources.
- You can also use HPA (Horizontal Pod Autoscaler) for automatic scaling.`,
  },
  setupCommands: ['create deployment api-server --image=nginx:1.24 --replicas=2'],
  verificationSteps: [
    {
      command: 'get deployment api-server -o jsonpath={.spec.replicas}',
      expected: '5',
      description: {
        ko: '레플리카 수가 5인지 확인',
        en: 'Verify replica count is 5',
      },
    },
  ],
  cleanupCommands: ['delete deployment api-server --ignore-not-found'],
  namespace: 'lab-workloads-003',
  editorMode: 'kubectl',
  expectedAnswer: 'kubectl scale deployment api-server --replicas=5',
};
