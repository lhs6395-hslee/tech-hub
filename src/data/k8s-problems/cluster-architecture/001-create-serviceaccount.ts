import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'cluster-architecture-001',
  domain: 'cluster-architecture',
  order: 1,
  title: {
    ko: 'ServiceAccount 생성하기',
    en: 'Create a ServiceAccount',
  },
  description: {
    ko: `## 시나리오

새로운 애플리케이션을 배포하기 위해 전용 ServiceAccount가 필요합니다.

### 요구사항

1. \`app-sa\`라는 이름의 ServiceAccount를 생성하세요.

### 참고
- ServiceAccount는 Pod에서 Kubernetes API에 접근할 때 사용하는 ID입니다.
- \`kubectl create serviceaccount\` 명령을 사용할 수 있습니다.`,
    en: `## Scenario

A dedicated ServiceAccount is needed to deploy a new application.

### Requirements

1. Create a ServiceAccount named \`app-sa\`.

### Notes
- A ServiceAccount is an identity used by Pods to access the Kubernetes API.
- You can use the \`kubectl create serviceaccount\` command.`,
  },
  category: 'ServiceAccount',
  difficulty: 1,
  hints: {
    ko: [
      'kubectl create 명령으로 ServiceAccount를 생성할 수 있습니다.',
      'kubectl create serviceaccount <이름>',
      'kubectl create serviceaccount app-sa',
    ],
    en: [
      'You can create a ServiceAccount using kubectl create.',
      'kubectl create serviceaccount <name>',
      'kubectl create serviceaccount app-sa',
    ],
  },
  explanation: {
    ko: `## ServiceAccount 생성

\`\`\`bash
kubectl create serviceaccount app-sa
\`\`\`

또는 YAML로:

\`\`\`yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-sa
\`\`\`

- ServiceAccount는 Pod가 Kubernetes API 서버와 통신할 때 사용하는 인증 수단입니다.
- 모든 네임스페이스에는 기본적으로 \`default\` ServiceAccount가 있습니다.
- 보안 모범 사례로, 애플리케이션마다 전용 ServiceAccount를 사용하는 것이 권장됩니다.`,
    en: `## Creating a ServiceAccount

\`\`\`bash
kubectl create serviceaccount app-sa
\`\`\`

Or using YAML:

\`\`\`yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-sa
\`\`\`

- A ServiceAccount is the authentication mechanism Pods use to communicate with the Kubernetes API server.
- Every namespace has a \`default\` ServiceAccount by default.
- As a security best practice, it's recommended to use dedicated ServiceAccounts for each application.`,
  },
  setupCommands: [],
  verificationSteps: [
    {
      command: 'get serviceaccount app-sa -o jsonpath={.metadata.name}',
      expected: 'app-sa',
      description: {
        ko: 'app-sa ServiceAccount가 존재하는지 확인',
        en: 'Verify app-sa ServiceAccount exists',
      },
    },
  ],
  cleanupCommands: ['delete serviceaccount app-sa --ignore-not-found'],
  namespace: 'lab-cluster-001',
  editorMode: 'both',
  expectedAnswer: 'kubectl create serviceaccount app-sa',
};
