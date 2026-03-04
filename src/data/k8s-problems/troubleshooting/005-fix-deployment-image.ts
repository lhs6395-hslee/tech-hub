import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'troubleshooting-005',
  domain: 'troubleshooting',
  order: 5,
  title: {
    ko: 'Deployment 이미지 수정하기',
    en: 'Fix Deployment Image',
  },
  description: {
    ko: `## 시나리오

\`web-deploy\` Deployment가 존재하지 않는 이미지 \`nginx:broken\`을 사용하고 있어 Pod가 정상적으로 실행되지 않습니다.

### 요구사항

1. \`web-deploy\` Deployment의 현재 이미지를 확인하세요.
2. 이미지를 \`nginx:1.24\`로 업데이트하세요.

### 참고
- \`kubectl describe deployment\`로 현재 이미지를 확인할 수 있습니다.
- \`kubectl set image\` 명령으로 Deployment의 이미지를 변경할 수 있습니다.
- Deployment는 Pod와 달리 이미지를 직접 업데이트할 수 있습니다 (삭제 후 재생성 불필요).`,
    en: `## Scenario

The \`web-deploy\` Deployment is using a non-existent image \`nginx:broken\`, causing Pods to fail.

### Requirements

1. Check the current image of the \`web-deploy\` Deployment.
2. Update the image to \`nginx:1.24\`.

### Notes
- Use \`kubectl describe deployment\` to check the current image.
- Use \`kubectl set image\` to change the Deployment image.
- Unlike Pods, Deployments can be updated in-place without deleting and recreating.`,
  },
  category: 'Troubleshooting',
  difficulty: 1,
  hints: {
    ko: [
      'kubectl describe deployment web-deploy 명령으로 현재 이미지와 Pod 상태를 확인하세요.',
      'kubectl set image 명령을 사용하면 Deployment의 컨테이너 이미지를 변경할 수 있습니다.',
      'kubectl set image deployment/web-deploy nginx=nginx:1.24',
    ],
    en: [
      'Check the current image and Pod status with kubectl describe deployment web-deploy.',
      'Use kubectl set image to change the container image of a Deployment.',
      'kubectl set image deployment/web-deploy nginx=nginx:1.24',
    ],
  },
  explanation: {
    ko: `## Deployment 이미지 수정

### 1. 문제 확인
\`\`\`bash
kubectl describe deployment web-deploy
kubectl get pods
\`\`\`
Pod가 \`ImagePullBackOff\` 또는 \`ErrImagePull\` 상태인 것을 확인합니다.

### 2. 수정
\`\`\`bash
kubectl set image deployment/web-deploy nginx=nginx:1.24
\`\`\`

### 주요 개념
- **kubectl set image**: Deployment, DaemonSet, StatefulSet 등의 컨테이너 이미지를 업데이트합니다.
- Deployment는 업데이트 시 자동으로 롤링 업데이트를 수행합니다.
- 이전 버전으로 되돌리려면 \`kubectl rollout undo deployment/web-deploy\`를 사용합니다.
- \`kubectl rollout status deployment/web-deploy\`로 업데이트 진행 상태를 확인할 수 있습니다.
- Pod는 이미지 변경이 불가능하지만, Deployment는 선언적으로 이미지를 변경할 수 있는 것이 큰 장점입니다.`,
    en: `## Fixing Deployment Image

### 1. Diagnose the issue
\`\`\`bash
kubectl describe deployment web-deploy
kubectl get pods
\`\`\`
Observe that Pods are in \`ImagePullBackOff\` or \`ErrImagePull\` state.

### 2. Fix
\`\`\`bash
kubectl set image deployment/web-deploy nginx=nginx:1.24
\`\`\`

### Key Concepts
- **kubectl set image**: Updates the container image for Deployments, DaemonSets, StatefulSets, etc.
- Deployments automatically perform a rolling update when updated.
- To roll back to a previous version, use \`kubectl rollout undo deployment/web-deploy\`.
- Use \`kubectl rollout status deployment/web-deploy\` to monitor update progress.
- Unlike Pods, Deployments can declaratively update images in-place, which is a major advantage.`,
  },
  setupCommands: [
    'create deployment web-deploy --image=nginx:broken',
  ],
  verificationSteps: [
    {
      command: 'get deployment web-deploy -o jsonpath={.spec.template.spec.containers[0].image}',
      expected: 'nginx:1.24',
      description: {
        ko: 'Deployment 이미지가 nginx:1.24로 수정되었는지 확인',
        en: 'Verify Deployment image is updated to nginx:1.24',
      },
    },
  ],
  cleanupCommands: ['delete deployment web-deploy --ignore-not-found'],
  namespace: 'lab-troubleshooting-005',
  editorMode: 'kubectl',
  expectedAnswer: 'kubectl set image deployment/web-deploy nginx=nginx:1.24',
};
