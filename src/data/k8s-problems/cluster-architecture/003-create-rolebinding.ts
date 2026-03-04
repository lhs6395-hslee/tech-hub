import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'cluster-architecture-003',
  domain: 'cluster-architecture',
  order: 3,
  title: {
    ko: 'RoleBinding 생성하기',
    en: 'Create a RoleBinding',
  },
  description: {
    ko: `## 시나리오

이전에 생성한 \`pod-reader\` Role을 \`app-sa\` ServiceAccount에 바인딩하여 실제로 권한을 부여해야 합니다.

### 요구사항

1. \`read-pods-binding\`이라는 이름의 RoleBinding을 생성하세요.
2. 이 RoleBinding은 \`pod-reader\` Role을 \`app-sa\` ServiceAccount에 바인딩해야 합니다.

### 참고
- RoleBinding은 Role에 정의된 권한을 특정 사용자나 ServiceAccount에 부여하는 객체입니다.
- \`kubectl create rolebinding\` 명령을 사용할 수 있습니다.
- ServiceAccount를 지정할 때는 \`--serviceaccount=<네임스페이스>:<이름>\` 형식을 사용합니다.`,
    en: `## Scenario

You need to bind the previously created \`pod-reader\` Role to the \`app-sa\` ServiceAccount to actually grant permissions.

### Requirements

1. Create a RoleBinding named \`read-pods-binding\`.
2. This RoleBinding should bind the \`pod-reader\` Role to the \`app-sa\` ServiceAccount.

### Notes
- A RoleBinding is an object that grants the permissions defined in a Role to a specific user or ServiceAccount.
- You can use the \`kubectl create rolebinding\` command.
- When specifying a ServiceAccount, use the format \`--serviceaccount=<namespace>:<name>\`.`,
  },
  category: 'RBAC',
  difficulty: 2,
  hints: {
    ko: [
      'kubectl create rolebinding 명령으로 RoleBinding을 생성할 수 있습니다.',
      '--role 플래그로 바인딩할 Role을, --serviceaccount 플래그로 대상 ServiceAccount를 지정합니다.',
      'kubectl create rolebinding read-pods-binding --role=pod-reader --serviceaccount=lab-cluster-003:app-sa',
    ],
    en: [
      'You can create a RoleBinding using the kubectl create rolebinding command.',
      'Use the --role flag to specify the Role to bind and --serviceaccount for the target ServiceAccount.',
      'kubectl create rolebinding read-pods-binding --role=pod-reader --serviceaccount=lab-cluster-003:app-sa',
    ],
  },
  explanation: {
    ko: `## RoleBinding 생성

\`\`\`bash
kubectl create rolebinding read-pods-binding --role=pod-reader --serviceaccount=lab-cluster-003:app-sa
\`\`\`

또는 YAML로:

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods-binding
subjects:
  - kind: ServiceAccount
    name: app-sa
    namespace: lab-cluster-003
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
\`\`\`

- RoleBinding은 Role과 주체(Subject)를 연결하여 실제 권한을 부여합니다.
- \`--serviceaccount\` 플래그는 \`<네임스페이스>:<이름>\` 형식으로 ServiceAccount를 지정합니다.
- RoleBinding은 네임스페이스 범위이며, 같은 네임스페이스 내의 Role만 참조할 수 있습니다.
- 하나의 RoleBinding에 여러 주체(Subject)를 지정할 수도 있습니다.`,
    en: `## Creating a RoleBinding

\`\`\`bash
kubectl create rolebinding read-pods-binding --role=pod-reader --serviceaccount=lab-cluster-003:app-sa
\`\`\`

Or using YAML:

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods-binding
subjects:
  - kind: ServiceAccount
    name: app-sa
    namespace: lab-cluster-003
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
\`\`\`

- A RoleBinding connects a Role with subjects to actually grant permissions.
- The \`--serviceaccount\` flag specifies a ServiceAccount in the format \`<namespace>:<name>\`.
- A RoleBinding is namespace-scoped and can only reference Roles within the same namespace.
- A single RoleBinding can specify multiple subjects.`,
  },
  setupCommands: [
    'create serviceaccount app-sa',
    'create role pod-reader --verb=get,list,watch --resource=pods',
  ],
  verificationSteps: [
    {
      command: 'get rolebinding read-pods-binding -o jsonpath={.metadata.name}',
      expected: 'read-pods-binding',
      description: {
        ko: 'read-pods-binding RoleBinding이 존재하는지 확인',
        en: 'Verify read-pods-binding RoleBinding exists',
      },
    },
    {
      command: 'get rolebinding read-pods-binding -o jsonpath={.roleRef.name}',
      expected: 'pod-reader',
      description: {
        ko: 'RoleBinding이 pod-reader Role을 참조하는지 확인',
        en: 'Verify RoleBinding references pod-reader Role',
      },
    },
    {
      command: 'get rolebinding read-pods-binding -o jsonpath={.subjects[0].name}',
      expected: 'app-sa',
      description: {
        ko: 'RoleBinding이 app-sa ServiceAccount를 대상으로 하는지 확인',
        en: 'Verify RoleBinding targets app-sa ServiceAccount',
      },
    },
  ],
  cleanupCommands: [
    'delete rolebinding read-pods-binding --ignore-not-found',
    'delete role pod-reader --ignore-not-found',
    'delete serviceaccount app-sa --ignore-not-found',
  ],
  namespace: 'lab-cluster-003',
  editorMode: 'both',
  expectedAnswer:
    'kubectl create rolebinding read-pods-binding --role=pod-reader --serviceaccount=lab-cluster-003:app-sa',
};
