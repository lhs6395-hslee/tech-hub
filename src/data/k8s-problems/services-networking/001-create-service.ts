import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'services-networking-001',
  domain: 'services-networking',
  order: 1,
  title: {
    ko: 'ClusterIP Service 생성하기',
    en: 'Create a ClusterIP Service',
  },
  description: {
    ko: `## 시나리오

이미 배포된 \`web-app\` Deployment에 대한 내부 서비스를 생성해야 합니다.

### 요구사항

1. \`web-svc\`라는 이름의 ClusterIP Service를 생성하세요.
2. 포트 **80**을 타겟 포트 **80**으로 매핑하세요.
3. 셀렉터는 \`app=web-app\`으로 설정하세요.

### 참고
- 이 문제의 환경에는 \`web-app\` Deployment가 이미 배포되어 있습니다.
- \`kubectl expose\` 또는 \`kubectl create service\` 명령을 사용할 수 있습니다.`,
    en: `## Scenario

You need to create an internal service for the existing \`web-app\` Deployment.

### Requirements

1. Create a ClusterIP Service named \`web-svc\`.
2. Map port **80** to target port **80**.
3. Set the selector to \`app=web-app\`.

### Notes
- The \`web-app\` Deployment is already deployed in this lab environment.
- You can use \`kubectl expose\` or \`kubectl create service\` commands.`,
  },
  category: 'Service',
  difficulty: 1,
  hints: {
    ko: [
      'kubectl expose deployment 명령으로 Service를 생성할 수 있습니다.',
      'kubectl expose deployment web-app --name=web-svc --port=80 --target-port=80',
      '또는 kubectl create service clusterip web-svc --tcp=80:80을 사용한 후 셀렉터를 수정하세요.',
    ],
    en: [
      'You can create a Service using kubectl expose deployment.',
      'kubectl expose deployment web-app --name=web-svc --port=80 --target-port=80',
      'Or use kubectl create service clusterip web-svc --tcp=80:80 and modify the selector.',
    ],
  },
  explanation: {
    ko: `## ClusterIP Service 생성

\`\`\`bash
kubectl expose deployment web-app --name=web-svc --port=80 --target-port=80
\`\`\`

### 주요 개념
- **ClusterIP**는 기본 Service 타입으로, 클러스터 내부에서만 접근 가능합니다.
- **Service**는 Pod 집합에 대한 안정적인 네트워크 엔드포인트를 제공합니다.
- 셀렉터(selector)를 사용하여 어떤 Pod에 트래픽을 라우팅할지 결정합니다.
- Pod의 IP는 변할 수 있지만, Service의 ClusterIP는 고정됩니다.`,
    en: `## Creating a ClusterIP Service

\`\`\`bash
kubectl expose deployment web-app --name=web-svc --port=80 --target-port=80
\`\`\`

### Key Concepts
- **ClusterIP** is the default Service type, accessible only within the cluster.
- A **Service** provides a stable network endpoint for a set of Pods.
- Selectors determine which Pods receive traffic.
- Pod IPs can change, but a Service's ClusterIP remains fixed.`,
  },
  setupCommands: [
    'create deployment web-app --image=nginx:1.24 --replicas=2',
  ],
  verificationSteps: [
    {
      command: 'get service web-svc -o jsonpath={.metadata.name}',
      expected: 'web-svc',
      description: {
        ko: 'web-svc Service가 존재하는지 확인',
        en: 'Verify web-svc Service exists',
      },
    },
    {
      command: 'get service web-svc -o jsonpath={.spec.type}',
      expected: 'ClusterIP',
      description: {
        ko: 'Service 타입이 ClusterIP인지 확인',
        en: 'Verify Service type is ClusterIP',
      },
    },
    {
      command: 'get service web-svc -o jsonpath={.spec.ports[0].port}',
      expected: '80',
      description: {
        ko: '포트가 80인지 확인',
        en: 'Verify port is 80',
      },
    },
  ],
  cleanupCommands: [
    'delete service web-svc --ignore-not-found',
    'delete deployment web-app --ignore-not-found',
  ],
  namespace: 'lab-networking-001',
  editorMode: 'both',
  expectedAnswer: 'kubectl expose deployment web-app --name=web-svc --port=80 --target-port=80',
};
