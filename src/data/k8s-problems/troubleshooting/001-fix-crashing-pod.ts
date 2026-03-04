import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'troubleshooting-001',
  domain: 'troubleshooting',
  order: 1,
  title: {
    ko: '잘못된 이미지 수정하기',
    en: 'Fix Incorrect Image',
  },
  description: {
    ko: `## 시나리오

\`broken-app\`이라는 Pod가 실행에 실패하고 있습니다. 이미지 이름이 잘못 설정된 것으로 보입니다.

### 요구사항

1. \`broken-app\` Pod의 상태를 확인하세요.
2. 문제를 진단하세요.
3. 올바른 이미지(\`nginx:1.24\`)를 사용하는 \`broken-app\` Pod를 다시 생성하세요.

### 참고
- \`kubectl describe pod\`로 상세 정보를 확인할 수 있습니다.
- \`kubectl get events\`로 이벤트를 확인할 수 있습니다.
- 기존 Pod를 삭제하고 올바른 이미지로 새로 생성해야 합니다.`,
    en: `## Scenario

A Pod named \`broken-app\` is failing to run. It appears the image name is incorrectly set.

### Requirements

1. Check the status of the \`broken-app\` Pod.
2. Diagnose the problem.
3. Recreate the \`broken-app\` Pod with the correct image (\`nginx:1.24\`).

### Notes
- Use \`kubectl describe pod\` to view detailed information.
- Use \`kubectl get events\` to check events.
- You need to delete the existing Pod and create a new one with the correct image.`,
  },
  category: 'Troubleshooting',
  difficulty: 1,
  hints: {
    ko: [
      'kubectl describe pod broken-app 명령으로 이벤트를 확인하세요.',
      '이미지를 pull할 수 없다면 이미지 이름이 잘못된 것입니다. 먼저 기존 Pod를 삭제하세요.',
      'kubectl delete pod broken-app 후 kubectl run broken-app --image=nginx:1.24',
    ],
    en: [
      'Check events with kubectl describe pod broken-app.',
      'If the image cannot be pulled, the image name is wrong. Delete the existing Pod first.',
      'kubectl delete pod broken-app then kubectl run broken-app --image=nginx:1.24',
    ],
  },
  explanation: {
    ko: `## Pod 이미지 문제 해결

### 1. 상태 확인
\`\`\`bash
kubectl describe pod broken-app
\`\`\`
Events 섹션에서 \`ImagePullBackOff\` 또는 \`ErrImagePull\` 에러를 확인합니다.

### 2. 수정
\`\`\`bash
kubectl delete pod broken-app
kubectl run broken-app --image=nginx:1.24
\`\`\`

### 주요 개념
- **ImagePullBackOff**: 이미지를 다운로드할 수 없을 때 발생하는 에러
- Pod의 이미지를 직접 수정하는 것은 불가능하므로, Pod를 삭제하고 새로 생성해야 합니다.
- \`kubectl describe\`는 트러블슈팅의 핵심 도구입니다.`,
    en: `## Fixing Pod Image Issues

### 1. Check status
\`\`\`bash
kubectl describe pod broken-app
\`\`\`
Look for \`ImagePullBackOff\` or \`ErrImagePull\` errors in the Events section.

### 2. Fix
\`\`\`bash
kubectl delete pod broken-app
kubectl run broken-app --image=nginx:1.24
\`\`\`

### Key Concepts
- **ImagePullBackOff**: Error when the image cannot be downloaded.
- A Pod's image cannot be directly modified, so you need to delete and recreate it.
- \`kubectl describe\` is a critical troubleshooting tool.`,
  },
  setupCommands: [
    'run broken-app --image=nginx:nonexistent-tag-999',
  ],
  verificationSteps: [
    {
      command: 'get pod broken-app -o jsonpath={.metadata.name}',
      expected: 'broken-app',
      description: {
        ko: 'broken-app Pod가 존재하는지 확인',
        en: 'Verify broken-app Pod exists',
      },
    },
    {
      command: 'get pod broken-app -o jsonpath={.spec.containers[0].image}',
      expected: 'nginx:1.24',
      description: {
        ko: '이미지가 nginx:1.24로 수정되었는지 확인',
        en: 'Verify image is corrected to nginx:1.24',
      },
    },
  ],
  cleanupCommands: ['delete pod broken-app --ignore-not-found'],
  namespace: 'lab-troubleshooting-001',
  editorMode: 'kubectl',
  expectedAnswer: `kubectl delete pod broken-app
kubectl run broken-app --image=nginx:1.24`,
};
