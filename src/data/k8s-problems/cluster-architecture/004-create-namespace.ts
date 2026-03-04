import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'cluster-architecture-004',
  domain: 'cluster-architecture',
  order: 4,
  title: {
    ko: 'Namespace 생성하기',
    en: 'Create a Namespace',
  },
  description: {
    ko: `## 시나리오

개발팀을 위한 별도의 작업 공간을 만들기 위해 새로운 Namespace를 생성해야 합니다.

### 요구사항

1. \`dev-team\`이라는 이름의 Namespace를 생성하세요.

### 참고
- Namespace는 클러스터 내에서 리소스를 논리적으로 분리하는 방법입니다.
- \`kubectl create namespace\` 명령을 사용하여 Namespace를 생성할 수 있습니다.
- Namespace는 클러스터 범위의 리소스이므로, 특정 네임스페이스 안에 존재하지 않습니다.`,
    en: `## Scenario

You need to create a new Namespace to provide a separate workspace for the development team.

### Requirements

1. Create a Namespace named \`dev-team\`.

### Notes
- A Namespace is a way to logically partition resources within a cluster.
- You can use the \`kubectl create namespace\` command to create a Namespace.
- Namespaces are cluster-scoped resources, meaning they do not exist within another namespace.`,
  },
  category: 'Namespace',
  difficulty: 1,
  hints: {
    ko: [
      'kubectl create namespace 명령으로 Namespace를 생성할 수 있습니다.',
      'kubectl create namespace <이름>',
      'kubectl create namespace dev-team',
    ],
    en: [
      'You can create a Namespace using the kubectl create namespace command.',
      'kubectl create namespace <name>',
      'kubectl create namespace dev-team',
    ],
  },
  explanation: {
    ko: `## Namespace 생성

\`\`\`bash
kubectl create namespace dev-team
\`\`\`

또는 YAML로:

\`\`\`yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev-team
\`\`\`

- Namespace는 클러스터 내에서 리소스를 논리적으로 격리하는 가상의 클러스터입니다.
- 팀별, 환경별(dev/staging/prod), 프로젝트별로 Namespace를 분리하는 것이 일반적입니다.
- \`kubectl create ns\`는 \`kubectl create namespace\`의 축약형입니다.
- 기본적으로 \`default\`, \`kube-system\`, \`kube-public\`, \`kube-node-lease\` Namespace가 존재합니다.`,
    en: `## Creating a Namespace

\`\`\`bash
kubectl create namespace dev-team
\`\`\`

Or using YAML:

\`\`\`yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev-team
\`\`\`

- A Namespace is a virtual cluster that logically isolates resources within a cluster.
- It is common practice to separate Namespaces by team, environment (dev/staging/prod), or project.
- \`kubectl create ns\` is a shorthand for \`kubectl create namespace\`.
- By default, the \`default\`, \`kube-system\`, \`kube-public\`, and \`kube-node-lease\` Namespaces exist.`,
  },
  setupCommands: [],
  verificationSteps: [
    {
      command: 'get namespace dev-team -o jsonpath={.metadata.name}',
      expected: 'dev-team',
      description: {
        ko: 'dev-team Namespace가 존재하는지 확인',
        en: 'Verify dev-team Namespace exists',
      },
    },
  ],
  cleanupCommands: ['delete namespace dev-team --ignore-not-found'],
  namespace: 'lab-cluster-004',
  editorMode: 'both',
  expectedAnswer: 'kubectl create namespace dev-team',
};
