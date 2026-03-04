import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'troubleshooting-004',
  domain: 'troubleshooting',
  order: 4,
  title: {
    ko: 'Pod 실패 진단하기',
    en: 'Diagnose Pod Failure',
  },
  description: {
    ko: `## 시나리오

\`failing-app\`이라는 Pod가 계속 재시작되며 CrashLoopBackOff 상태에 빠져 있습니다. 원인을 파악하고 수정해야 합니다.

### 요구사항

1. \`failing-app\` Pod의 상태와 로그를 확인하세요.
2. Pod가 CrashLoopBackOff에 빠진 원인을 파악하세요.
3. 기존 Pod를 삭제하고, 올바른 명령어(\`sleep 3600\`)로 Pod를 다시 생성하세요.
   - 이미지: \`busybox:1.36\`
   - 이름: \`failing-app\`

### 참고
- \`kubectl logs\`로 Pod의 로그를 확인할 수 있습니다.
- \`kubectl describe pod\`로 재시작 횟수와 종료 코드를 확인할 수 있습니다.
- 현재 Pod는 \`exit 1\` 명령을 실행하여 즉시 종료됩니다.`,
    en: `## Scenario

A Pod named \`failing-app\` keeps restarting and is stuck in CrashLoopBackOff status. You need to identify the cause and fix it.

### Requirements

1. Check the status and logs of the \`failing-app\` Pod.
2. Determine why the Pod is in CrashLoopBackOff.
3. Delete the existing Pod and recreate it with the correct command (\`sleep 3600\`).
   - Image: \`busybox:1.36\`
   - Name: \`failing-app\`

### Notes
- Use \`kubectl logs\` to check the Pod logs.
- Use \`kubectl describe pod\` to check restart count and exit codes.
- The current Pod runs \`exit 1\` which causes it to terminate immediately.`,
  },
  category: 'Troubleshooting',
  difficulty: 2,
  hints: {
    ko: [
      'kubectl describe pod failing-app 명령으로 Last State와 Exit Code를 확인하세요.',
      'Exit Code 1은 컨테이너가 에러로 종료되었음을 의미합니다. 기존 Pod를 삭제하세요.',
      'kubectl delete pod failing-app 후 kubectl run failing-app --image=busybox:1.36 --command -- sleep 3600',
    ],
    en: [
      'Check Last State and Exit Code with kubectl describe pod failing-app.',
      'Exit Code 1 means the container terminated with an error. Delete the existing Pod.',
      'kubectl delete pod failing-app then kubectl run failing-app --image=busybox:1.36 --command -- sleep 3600',
    ],
  },
  explanation: {
    ko: `## Pod 실패 진단 및 수정

### 1. 상태 확인
\`\`\`bash
kubectl describe pod failing-app
kubectl logs failing-app
\`\`\`
\`describe\`의 Last State에서 Exit Code가 1인 것을 확인합니다.

### 2. 수정
\`\`\`bash
kubectl delete pod failing-app
kubectl run failing-app --image=busybox:1.36 --command -- sleep 3600
\`\`\`

### 주요 개념
- **CrashLoopBackOff**: 컨테이너가 반복적으로 시작 직후 종료될 때 발생합니다.
- **Exit Code 1**: 일반적인 에러로 인한 종료를 의미합니다.
- **Exit Code 0**: 정상 종료를 의미합니다.
- \`kubectl logs\`는 컨테이너의 stdout/stderr 출력을 보여줍니다.
- \`kubectl logs --previous\`로 이전에 종료된 컨테이너의 로그를 확인할 수 있습니다.
- busybox 같은 경량 이미지는 실행할 프로세스가 없으면 바로 종료되므로 \`sleep\` 등의 명령이 필요합니다.`,
    en: `## Diagnosing and Fixing Pod Failure

### 1. Check status
\`\`\`bash
kubectl describe pod failing-app
kubectl logs failing-app
\`\`\`
In the \`describe\` output, check Last State for Exit Code 1.

### 2. Fix
\`\`\`bash
kubectl delete pod failing-app
kubectl run failing-app --image=busybox:1.36 --command -- sleep 3600
\`\`\`

### Key Concepts
- **CrashLoopBackOff**: Occurs when a container repeatedly exits shortly after starting.
- **Exit Code 1**: Indicates the process terminated due to a general error.
- **Exit Code 0**: Indicates normal (successful) termination.
- \`kubectl logs\` shows the container's stdout/stderr output.
- \`kubectl logs --previous\` shows logs from the previously terminated container.
- Lightweight images like busybox terminate immediately without a long-running process, so commands like \`sleep\` are needed.`,
  },
  setupCommands: [
    'run failing-app --image=busybox:1.36 --command -- /bin/sh -c "exit 1"',
  ],
  verificationSteps: [
    {
      command: 'get pod failing-app -o jsonpath={.metadata.name}',
      expected: 'failing-app',
      description: {
        ko: 'failing-app Pod가 존재하는지 확인',
        en: 'Verify failing-app Pod exists',
      },
    },
    {
      command: 'get pod failing-app -o jsonpath={.spec.containers[0].image}',
      expected: 'busybox:1.36',
      description: {
        ko: '이미지가 busybox:1.36인지 확인',
        en: 'Verify image is busybox:1.36',
      },
    },
  ],
  cleanupCommands: ['delete pod failing-app --ignore-not-found'],
  namespace: 'lab-troubleshooting-004',
  editorMode: 'both',
  expectedAnswer: `kubectl delete pod failing-app
kubectl run failing-app --image=busybox:1.36 --command -- sleep 3600`,
};
