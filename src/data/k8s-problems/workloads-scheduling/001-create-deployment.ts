import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'workloads-scheduling-001',
  domain: 'workloads-scheduling',
  order: 1,
  title: {
    ko: 'Deployment 생성하기',
    en: 'Create a Deployment',
  },
  description: {
    ko: `## 시나리오

nginx 웹 서버를 Kubernetes에 배포해야 합니다.

### 요구사항

1. \`web-app\`이라는 이름의 Deployment를 생성하세요.
2. 이미지는 \`nginx:1.24\`를 사용하세요.
3. 레플리카 수는 **3**으로 설정하세요.

### 참고
- \`kubectl create deployment\` 명령을 사용할 수 있습니다.
- \`--replicas\` 플래그로 레플리카 수를 지정할 수 있습니다.`,
    en: `## Scenario

You need to deploy an nginx web server to Kubernetes.

### Requirements

1. Create a Deployment named \`web-app\`.
2. Use the \`nginx:1.24\` image.
3. Set the number of replicas to **3**.

### Notes
- You can use the \`kubectl create deployment\` command.
- Use the \`--replicas\` flag to specify the replica count.`,
  },
  category: 'Deployment',
  difficulty: 1,
  hints: {
    ko: [
      'kubectl create deployment 명령에 --image와 --replicas 플래그를 사용하세요.',
      'kubectl create deployment web-app --image=nginx:1.24 --replicas=3',
      '또는 YAML에서 spec.replicas: 3, spec.template.spec.containers[0].image: nginx:1.24를 설정하세요.',
    ],
    en: [
      'Use --image and --replicas flags with kubectl create deployment.',
      'kubectl create deployment web-app --image=nginx:1.24 --replicas=3',
      'Or in YAML, set spec.replicas: 3 and spec.template.spec.containers[0].image: nginx:1.24.',
    ],
  },
  explanation: {
    ko: `## Deployment 생성

\`\`\`bash
kubectl create deployment web-app --image=nginx:1.24 --replicas=3
\`\`\`

### 주요 개념
- **Deployment**는 Pod의 선언적 업데이트를 관리합니다.
- **replicas**는 동시에 실행될 Pod의 수를 지정합니다.
- Deployment는 내부적으로 ReplicaSet을 생성하여 Pod 수를 유지합니다.
- 롤링 업데이트와 롤백을 자동으로 관리합니다.`,
    en: `## Creating a Deployment

\`\`\`bash
kubectl create deployment web-app --image=nginx:1.24 --replicas=3
\`\`\`

### Key Concepts
- A **Deployment** manages declarative updates to Pods.
- **replicas** specifies the number of Pods to run simultaneously.
- Deployments internally create ReplicaSets to maintain the Pod count.
- Rolling updates and rollbacks are managed automatically.`,
  },
  setupCommands: [],
  verificationSteps: [
    {
      command: 'get deployment web-app -o jsonpath={.metadata.name}',
      expected: 'web-app',
      description: {
        ko: 'web-app Deployment가 존재하는지 확인',
        en: 'Verify web-app Deployment exists',
      },
    },
    {
      command: 'get deployment web-app -o jsonpath={.spec.replicas}',
      expected: '3',
      description: {
        ko: '레플리카 수가 3인지 확인',
        en: 'Verify replica count is 3',
      },
    },
    {
      command: 'get deployment web-app -o jsonpath={.spec.template.spec.containers[0].image}',
      expected: 'nginx:1.24',
      description: {
        ko: '이미지가 nginx:1.24인지 확인',
        en: 'Verify image is nginx:1.24',
      },
    },
  ],
  cleanupCommands: ['delete deployment web-app --ignore-not-found'],
  namespace: 'lab-workloads-001',
  editorMode: 'both',
  expectedAnswer: 'kubectl create deployment web-app --image=nginx:1.24 --replicas=3',
};
