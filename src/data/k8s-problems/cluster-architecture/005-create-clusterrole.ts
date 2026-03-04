import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'cluster-architecture-005',
  domain: 'cluster-architecture',
  order: 5,
  title: {
    ko: 'ClusterRole 생성하기',
    en: 'Create a ClusterRole',
  },
  description: {
    ko: `## 시나리오

클러스터 전체에서 노드 정보를 조회할 수 있는 권한을 정의해야 합니다.

### 요구사항

1. \`node-viewer\`라는 이름의 ClusterRole을 생성하세요.
2. 이 ClusterRole은 \`nodes\` 리소스에 대해 \`get\`, \`list\` 동작을 허용해야 합니다.

### 참고
- ClusterRole은 Role과 유사하지만 클러스터 범위에서 동작합니다.
- \`kubectl create clusterrole\` 명령을 사용하여 ClusterRole을 생성할 수 있습니다.
- ClusterRole은 클러스터 범위의 리소스(예: Node)에 대한 권한을 정의할 때 사용됩니다.`,
    en: `## Scenario

You need to define permissions to view node information across the entire cluster.

### Requirements

1. Create a ClusterRole named \`node-viewer\`.
2. This ClusterRole should allow the \`get\` and \`list\` verbs on \`nodes\` resources.

### Notes
- A ClusterRole is similar to a Role but operates at the cluster scope.
- You can use the \`kubectl create clusterrole\` command to create a ClusterRole.
- ClusterRoles are used to define permissions for cluster-scoped resources such as Nodes.`,
  },
  category: 'RBAC',
  difficulty: 2,
  hints: {
    ko: [
      'kubectl create clusterrole 명령으로 ClusterRole을 생성할 수 있습니다.',
      '--verb 플래그로 허용할 동작을, --resource 플래그로 대상 리소스를 지정합니다.',
      'kubectl create clusterrole node-viewer --verb=get,list --resource=nodes',
    ],
    en: [
      'You can create a ClusterRole using the kubectl create clusterrole command.',
      'Use the --verb flag to specify allowed actions and --resource flag for target resources.',
      'kubectl create clusterrole node-viewer --verb=get,list --resource=nodes',
    ],
  },
  explanation: {
    ko: `## ClusterRole 생성

\`\`\`bash
kubectl create clusterrole node-viewer --verb=get,list --resource=nodes
\`\`\`

또는 YAML로:

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-viewer
rules:
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["get", "list"]
\`\`\`

- ClusterRole은 클러스터 범위의 RBAC 리소스로, 모든 네임스페이스에서 유효합니다.
- Node, PersistentVolume 같은 클러스터 범위 리소스에 대한 권한은 ClusterRole로만 정의할 수 있습니다.
- ClusterRole은 ClusterRoleBinding을 통해 클러스터 전체에 권한을 부여하거나, RoleBinding을 통해 특정 네임스페이스에 권한을 부여할 수 있습니다.
- Role과 달리, ClusterRole은 네임스페이스에 속하지 않는 전역 리소스입니다.`,
    en: `## Creating a ClusterRole

\`\`\`bash
kubectl create clusterrole node-viewer --verb=get,list --resource=nodes
\`\`\`

Or using YAML:

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-viewer
rules:
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["get", "list"]
\`\`\`

- A ClusterRole is a cluster-scoped RBAC resource, valid across all namespaces.
- Permissions for cluster-scoped resources like Nodes and PersistentVolumes can only be defined using ClusterRoles.
- A ClusterRole can grant permissions cluster-wide through a ClusterRoleBinding, or within a specific namespace through a RoleBinding.
- Unlike a Role, a ClusterRole is a global resource that does not belong to any namespace.`,
  },
  setupCommands: [],
  verificationSteps: [
    {
      command: 'get clusterrole node-viewer -o jsonpath={.metadata.name}',
      expected: 'node-viewer',
      description: {
        ko: 'node-viewer ClusterRole이 존재하는지 확인',
        en: 'Verify node-viewer ClusterRole exists',
      },
    },
    {
      command: 'get clusterrole node-viewer -o jsonpath={.rules[0].resources[0]}',
      expected: 'nodes',
      description: {
        ko: 'ClusterRole이 nodes 리소스를 대상으로 하는지 확인',
        en: 'Verify ClusterRole targets nodes resource',
      },
    },
  ],
  cleanupCommands: ['delete clusterrole node-viewer --ignore-not-found'],
  namespace: 'lab-cluster-005',
  editorMode: 'both',
  expectedAnswer: 'kubectl create clusterrole node-viewer --verb=get,list --resource=nodes',
};
