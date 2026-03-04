import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'troubleshooting-003',
  domain: 'troubleshooting',
  order: 3,
  title: {
    ko: '리소스 제한 문제 해결하기',
    en: 'Fix Pod with Insufficient Resources',
  },
  description: {
    ko: `## 시나리오

\`resource-pod\`라는 Pod가 과도한 메모리 요청(100Gi)으로 인해 Pending 상태에 머물러 있었습니다. 이 Pod는 이미 삭제되었습니다.

적절한 리소스 제한을 설정하여 Pod를 새로 생성해야 합니다.

### 요구사항

1. \`resource-pod\`라는 이름의 Pod를 생성하세요.
2. 이미지는 \`nginx:1.24\`를 사용하세요.
3. 메모리 요청(request)을 \`128Mi\`로 설정하세요.
4. CPU 요청(request)을 \`250m\`으로 설정하세요.

### 참고
- \`kubectl run\` 명령에는 리소스를 직접 설정하는 옵션이 없으므로, YAML을 생성하여 수정 후 적용하거나 \`--overrides\` 플래그를 사용하세요.
- \`kubectl run --dry-run=client -o yaml\`로 YAML 템플릿을 생성할 수 있습니다.`,
    en: `## Scenario

A Pod named \`resource-pod\` was stuck in Pending state due to an excessive memory request (100Gi). The Pod has already been deleted.

You need to create a new Pod with reasonable resource limits.

### Requirements

1. Create a Pod named \`resource-pod\`.
2. Use the image \`nginx:1.24\`.
3. Set the memory request to \`128Mi\`.
4. Set the CPU request to \`250m\`.

### Notes
- The \`kubectl run\` command does not have direct options for setting resources, so generate a YAML manifest and modify it, or use the \`--overrides\` flag.
- Use \`kubectl run --dry-run=client -o yaml\` to generate a YAML template.`,
  },
  category: 'Troubleshooting',
  difficulty: 2,
  hints: {
    ko: [
      'kubectl run resource-pod --image=nginx:1.24 --dry-run=client -o yaml 명령으로 YAML 템플릿을 생성하세요.',
      'YAML의 containers 섹션에 resources.requests를 추가하세요: memory: "128Mi", cpu: "250m"',
      'kubectl run resource-pod --image=nginx:1.24 --overrides=\'{"spec":{"containers":[{"name":"resource-pod","image":"nginx:1.24","resources":{"requests":{"memory":"128Mi","cpu":"250m"}}}]}}\' 명령을 사용할 수도 있습니다.',
    ],
    en: [
      'Generate a YAML template with kubectl run resource-pod --image=nginx:1.24 --dry-run=client -o yaml.',
      'Add resources.requests to the containers section: memory: "128Mi", cpu: "250m".',
      'You can also use kubectl run resource-pod --image=nginx:1.24 --overrides=\'{"spec":{"containers":[{"name":"resource-pod","image":"nginx:1.24","resources":{"requests":{"memory":"128Mi","cpu":"250m"}}}]}}\'',
    ],
  },
  explanation: {
    ko: `## 리소스 제한이 있는 Pod 생성

### YAML 방식
\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-pod
spec:
  containers:
  - name: nginx
    image: nginx:1.24
    resources:
      requests:
        memory: "128Mi"
        cpu: "250m"
\`\`\`

\`\`\`bash
kubectl apply -f resource-pod.yaml
\`\`\`

### 주요 개념
- **Resource Requests**: Pod가 스케줄링될 때 노드에 필요한 최소 리소스양입니다.
- **Resource Limits**: Pod가 사용할 수 있는 최대 리소스양입니다.
- 요청량이 클러스터의 가용 리소스를 초과하면 Pod는 \`Pending\` 상태가 됩니다.
- \`kubectl describe pod\`의 Events에서 \`Insufficient memory\` 등의 메시지로 원인을 확인할 수 있습니다.
- 적절한 리소스 설정은 클러스터 안정성에 매우 중요합니다.`,
    en: `## Creating a Pod with Resource Limits

### YAML approach
\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-pod
spec:
  containers:
  - name: nginx
    image: nginx:1.24
    resources:
      requests:
        memory: "128Mi"
        cpu: "250m"
\`\`\`

\`\`\`bash
kubectl apply -f resource-pod.yaml
\`\`\`

### Key Concepts
- **Resource Requests**: The minimum amount of resources a node must have for the Pod to be scheduled.
- **Resource Limits**: The maximum amount of resources a Pod can use.
- If the request exceeds available cluster resources, the Pod stays in \`Pending\` state.
- Check \`kubectl describe pod\` Events for messages like \`Insufficient memory\` to diagnose the issue.
- Proper resource configuration is critical for cluster stability.`,
  },
  setupCommands: [],
  verificationSteps: [
    {
      command: 'get pod resource-pod -o jsonpath={.spec.containers[0].resources.requests.memory}',
      expected: '128Mi',
      description: {
        ko: '메모리 요청이 128Mi로 설정되었는지 확인',
        en: 'Verify memory request is set to 128Mi',
      },
    },
    {
      command: 'get pod resource-pod -o jsonpath={.spec.containers[0].resources.requests.cpu}',
      expected: '250m',
      description: {
        ko: 'CPU 요청이 250m으로 설정되었는지 확인',
        en: 'Verify CPU request is set to 250m',
      },
    },
  ],
  cleanupCommands: ['delete pod resource-pod --ignore-not-found'],
  namespace: 'lab-troubleshooting-003',
  editorMode: 'both',
  expectedAnswer: `apiVersion: v1
kind: Pod
metadata:
  name: resource-pod
spec:
  containers:
  - name: nginx
    image: nginx:1.24
    resources:
      requests:
        memory: "128Mi"
        cpu: "250m"`,
};
