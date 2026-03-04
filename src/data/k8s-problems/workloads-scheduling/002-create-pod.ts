import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'workloads-scheduling-002',
  domain: 'workloads-scheduling',
  order: 2,
  title: {
    ko: 'Pod 생성하기',
    en: 'Create a Pod',
  },
  description: {
    ko: `## 시나리오

nginx 웹 서버를 단일 Pod로 실행해야 합니다.

### 요구사항

1. \`nginx-pod\`라는 이름의 Pod를 생성하세요.
2. 이미지는 \`nginx:1.24\`를 사용하세요.
3. 레이블 \`app=nginx\`를 설정하세요.

### 참고
- \`kubectl run\` 명령을 사용하면 Pod를 직접 생성할 수 있습니다.
- \`--labels\` 플래그로 레이블을 지정할 수 있습니다.`,
    en: `## Scenario

You need to run an nginx web server as a single Pod.

### Requirements

1. Create a Pod named \`nginx-pod\`.
2. Use the \`nginx:1.24\` image.
3. Set the label \`app=nginx\`.

### Notes
- You can use the \`kubectl run\` command to create a Pod directly.
- Use the \`--labels\` flag to specify labels.`,
  },
  category: 'Pod',
  difficulty: 1,
  hints: {
    ko: [
      'kubectl run 명령에 --image와 --labels 플래그를 사용하세요.',
      'kubectl run nginx-pod --image=nginx:1.24 --labels=app=nginx',
      '또는 YAML에서 metadata.labels에 app: nginx를 설정하고, spec.containers[0].image에 nginx:1.24를 지정하세요.',
    ],
    en: [
      'Use --image and --labels flags with the kubectl run command.',
      'kubectl run nginx-pod --image=nginx:1.24 --labels=app=nginx',
      'Or in YAML, set app: nginx under metadata.labels and nginx:1.24 for spec.containers[0].image.',
    ],
  },
  explanation: {
    ko: `## Pod 생성

\`\`\`bash
kubectl run nginx-pod --image=nginx:1.24 --labels=app=nginx
\`\`\`

### 주요 개념
- **Pod**는 Kubernetes에서 배포 가능한 가장 작은 단위입니다.
- \`kubectl run\`은 단일 Pod를 빠르게 생성하는 명령입니다.
- **Labels**는 키-값 쌍으로, 리소스를 조직하고 선택하는 데 사용됩니다.
- 레이블을 사용하면 \`kubectl get pods -l app=nginx\`처럼 필터링할 수 있습니다.`,
    en: `## Creating a Pod

\`\`\`bash
kubectl run nginx-pod --image=nginx:1.24 --labels=app=nginx
\`\`\`

### Key Concepts
- A **Pod** is the smallest deployable unit in Kubernetes.
- \`kubectl run\` is a command for quickly creating a single Pod.
- **Labels** are key-value pairs used to organize and select resources.
- Labels allow filtering, such as \`kubectl get pods -l app=nginx\`.`,
  },
  setupCommands: [],
  verificationSteps: [
    {
      command: 'get pod nginx-pod -o jsonpath={.metadata.name}',
      expected: 'nginx-pod',
      description: {
        ko: 'nginx-pod Pod가 존재하는지 확인',
        en: 'Verify nginx-pod Pod exists',
      },
    },
    {
      command: 'get pod nginx-pod -o jsonpath={.spec.containers[0].image}',
      expected: 'nginx:1.24',
      description: {
        ko: '이미지가 nginx:1.24인지 확인',
        en: 'Verify image is nginx:1.24',
      },
    },
    {
      command: 'get pod nginx-pod -o jsonpath={.metadata.labels.app}',
      expected: 'nginx',
      description: {
        ko: '레이블 app=nginx가 설정되었는지 확인',
        en: 'Verify label app=nginx is set',
      },
    },
  ],
  cleanupCommands: ['delete pod nginx-pod --ignore-not-found'],
  namespace: 'lab-workloads-002',
  editorMode: 'both',
  expectedAnswer: 'kubectl run nginx-pod --image=nginx:1.24 --labels=app=nginx',
};
