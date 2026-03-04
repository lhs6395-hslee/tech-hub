import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'cluster-architecture-002',
  domain: 'cluster-architecture',
  order: 2,
  title: {
    ko: 'Role 생성하기',
    en: 'Create a Role',
  },
  description: {
    ko: `## 시나리오

팀에서 특정 네임스페이스의 Pod를 조회할 수 있는 권한을 정의해야 합니다.

### 요구사항

1. \`pod-reader\`라는 이름의 Role을 생성하세요.
2. 이 Role은 \`pods\` 리소스에 대해 \`get\`, \`list\`, \`watch\` 동작을 허용해야 합니다.

### 참고
- Role은 특정 네임스페이스 내에서 리소스에 대한 접근 권한을 정의하는 RBAC 객체입니다.
- \`kubectl create role\` 명령을 사용하여 Role을 생성할 수 있습니다.`,
    en: `## Scenario

Your team needs to define permissions to view Pods in a specific namespace.

### Requirements

1. Create a Role named \`pod-reader\`.
2. This Role should allow the \`get\`, \`list\`, and \`watch\` verbs on \`pods\` resources.

### Notes
- A Role is an RBAC object that defines access permissions for resources within a specific namespace.
- You can use the \`kubectl create role\` command to create a Role.`,
  },
  category: 'RBAC',
  difficulty: 1,
  hints: {
    ko: [
      'kubectl create role 명령으로 Role을 생성할 수 있습니다.',
      '--verb 플래그로 허용할 동작을, --resource 플래그로 대상 리소스를 지정합니다.',
      'kubectl create role pod-reader --verb=get,list,watch --resource=pods',
    ],
    en: [
      'You can create a Role using the kubectl create role command.',
      'Use the --verb flag to specify allowed actions and --resource flag for target resources.',
      'kubectl create role pod-reader --verb=get,list,watch --resource=pods',
    ],
  },
  explanation: {
    ko: `## Role 생성

\`\`\`bash
kubectl create role pod-reader --verb=get,list,watch --resource=pods
\`\`\`

또는 YAML로:

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "watch"]
\`\`\`

- Role은 네임스페이스 범위의 RBAC 리소스로, 특정 네임스페이스 내에서만 유효합니다.
- \`apiGroups: [""]\`은 코어 API 그룹을 의미하며, Pod는 코어 API 그룹에 속합니다.
- Role 자체만으로는 권한이 부여되지 않으며, RoleBinding을 통해 사용자나 ServiceAccount에 연결해야 합니다.`,
    en: `## Creating a Role

\`\`\`bash
kubectl create role pod-reader --verb=get,list,watch --resource=pods
\`\`\`

Or using YAML:

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "watch"]
\`\`\`

- A Role is a namespace-scoped RBAC resource, valid only within a specific namespace.
- \`apiGroups: [""]\` refers to the core API group, which includes Pods.
- A Role alone does not grant permissions; it must be bound to a user or ServiceAccount through a RoleBinding.`,
  },
  setupCommands: [],
  verificationSteps: [
    {
      command: 'get role pod-reader -o jsonpath={.metadata.name}',
      expected: 'pod-reader',
      description: {
        ko: 'pod-reader Role이 존재하는지 확인',
        en: 'Verify pod-reader Role exists',
      },
    },
    {
      command: 'get role pod-reader -o jsonpath={.rules[0].resources[0]}',
      expected: 'pods',
      description: {
        ko: 'Role이 pods 리소스를 대상으로 하는지 확인',
        en: 'Verify Role targets pods resource',
      },
    },
    {
      command: 'get role pod-reader -o jsonpath={.rules[0].verbs}',
      expected: 'get',
      description: {
        ko: 'Role에 get 동작이 포함되어 있는지 확인',
        en: 'Verify Role includes get verb',
      },
    },
  ],
  cleanupCommands: ['delete role pod-reader --ignore-not-found'],
  namespace: 'lab-cluster-002',
  editorMode: 'both',
  expectedAnswer: 'kubectl create role pod-reader --verb=get,list,watch --resource=pods',
};
