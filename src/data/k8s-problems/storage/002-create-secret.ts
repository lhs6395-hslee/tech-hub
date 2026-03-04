import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'storage-002',
  domain: 'storage',
  order: 2,
  title: {
    ko: 'Secret 생성하기',
    en: 'Create a Secret',
  },
  description: {
    ko: `## 시나리오

데이터베이스 연결에 필요한 자격 증명을 안전하게 관리해야 합니다.

### 요구사항

1. \`db-credentials\`라는 이름의 **generic** Secret을 생성하세요.
2. 다음 키-값 쌍을 포함하세요:
   - \`username=admin\`
   - \`password=secret123\`

### 참고
- \`kubectl create secret generic\` 명령에서 \`--from-literal\` 플래그를 사용합니다.
- Secret의 값은 자동으로 **Base64**로 인코딩되어 저장됩니다.
- 민감한 데이터는 ConfigMap 대신 Secret을 사용해야 합니다.`,
    en: `## Scenario

You need to securely manage credentials required for a database connection.

### Requirements

1. Create a **generic** Secret named \`db-credentials\`.
2. Include the following key-value pairs:
   - \`username=admin\`
   - \`password=secret123\`

### Notes
- Use the \`--from-literal\` flag with \`kubectl create secret generic\`.
- Secret values are automatically **Base64**-encoded when stored.
- Use Secrets instead of ConfigMaps for sensitive data.`,
  },
  category: 'Secret',
  difficulty: 1,
  hints: {
    ko: [
      'kubectl create secret generic 명령에 --from-literal 플래그를 여러 번 사용할 수 있습니다.',
      'kubectl create secret generic db-credentials --from-literal=username=admin --from-literal=password=secret123',
      'Secret의 data 필드 값은 Base64로 인코딩됩니다. kubectl get secret -o yaml로 확인할 수 있습니다.',
    ],
    en: [
      'You can use the --from-literal flag multiple times with kubectl create secret generic.',
      'kubectl create secret generic db-credentials --from-literal=username=admin --from-literal=password=secret123',
      'Secret data values are Base64-encoded. You can verify with kubectl get secret -o yaml.',
    ],
  },
  explanation: {
    ko: `## Secret 생성

\`\`\`bash
kubectl create secret generic db-credentials \\
  --from-literal=username=admin \\
  --from-literal=password=secret123
\`\`\`

### 주요 개념
- **Secret**은 비밀번호, 토큰, 키 등 민감한 데이터를 저장합니다.
- \`generic\` 타입은 임의의 키-값 쌍을 저장할 때 사용합니다.
- Secret의 값은 **Base64**로 인코딩되지만, 이는 암호화가 아닙니다.
- Pod에서 환경 변수 또는 볼륨 마운트로 Secret을 사용할 수 있습니다.
- RBAC을 통해 Secret 접근을 제한하는 것이 권장됩니다.`,
    en: `## Creating a Secret

\`\`\`bash
kubectl create secret generic db-credentials \\
  --from-literal=username=admin \\
  --from-literal=password=secret123
\`\`\`

### Key Concepts
- A **Secret** stores sensitive data such as passwords, tokens, and keys.
- The \`generic\` type is used to store arbitrary key-value pairs.
- Secret values are **Base64**-encoded, but this is not encryption.
- Secrets can be consumed in Pods as environment variables or volume mounts.
- It is recommended to restrict Secret access through RBAC.`,
  },
  setupCommands: [],
  verificationSteps: [
    {
      command: 'get secret db-credentials -o jsonpath={.metadata.name}',
      expected: 'db-credentials',
      description: {
        ko: 'db-credentials Secret이 존재하는지 확인',
        en: 'Verify db-credentials Secret exists',
      },
    },
    {
      command: 'get secret db-credentials -o jsonpath={.data.username}',
      expected: 'YWRtaW4=',
      description: {
        ko: 'username 키가 올바른 값으로 존재하는지 확인',
        en: 'Verify username key exists with correct value',
      },
    },
    {
      command: 'get secret db-credentials -o jsonpath={.data.password}',
      expected: 'c2VjcmV0MTIz',
      description: {
        ko: 'password 키가 올바른 값으로 존재하는지 확인',
        en: 'Verify password key exists with correct value',
      },
    },
  ],
  cleanupCommands: ['delete secret db-credentials --ignore-not-found'],
  namespace: 'lab-storage-002',
  editorMode: 'both',
  expectedAnswer: 'kubectl create secret generic db-credentials --from-literal=username=admin --from-literal=password=secret123',
};
