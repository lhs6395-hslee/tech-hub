import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'services-networking-002',
  domain: 'services-networking',
  order: 2,
  title: {
    ko: 'NodePort Service 생성하기',
    en: 'Create a NodePort Service',
  },
  description: {
    ko: `## 시나리오

클러스터 외부에서 웹 애플리케이션에 접근할 수 있도록 NodePort Service를 생성해야 합니다.

### 요구사항

1. \`web-nodeport\`라는 이름의 **NodePort** Service를 생성하세요.
2. 포트 **80**을 타겟 포트 **80**으로 매핑하세요.
3. NodePort는 **30080**으로 설정하세요.
4. 셀렉터는 \`app=web-app\`으로 설정하세요.

### 참고
- 이 문제의 환경에는 \`web-app\` Deployment가 이미 배포되어 있습니다.
- \`kubectl create service nodeport\` 또는 YAML 매니페스트를 사용할 수 있습니다.
- NodePort의 유효 범위는 **30000-32767**입니다.`,
    en: `## Scenario

You need to create a NodePort Service to allow external access to the web application from outside the cluster.

### Requirements

1. Create a **NodePort** Service named \`web-nodeport\`.
2. Map port **80** to target port **80**.
3. Set the NodePort to **30080**.
4. Set the selector to \`app=web-app\`.

### Notes
- The \`web-app\` Deployment is already deployed in this lab environment.
- You can use \`kubectl create service nodeport\` or a YAML manifest.
- The valid NodePort range is **30000-32767**.`,
  },
  category: 'Service',
  difficulty: 2,
  hints: {
    ko: [
      'NodePort Service는 ClusterIP 위에 외부 포트를 추가로 노출합니다.',
      'kubectl create service nodeport web-nodeport --tcp=80:80 --node-port=30080 명령을 사용할 수 있습니다.',
      'YAML에서 spec.type: NodePort, spec.ports[0].nodePort: 30080을 설정하고, selector에 app: web-app을 지정하세요.',
    ],
    en: [
      'A NodePort Service exposes an additional external port on top of ClusterIP.',
      'You can use kubectl create service nodeport web-nodeport --tcp=80:80 --node-port=30080.',
      'In YAML, set spec.type: NodePort, spec.ports[0].nodePort: 30080, and specify app: web-app in the selector.',
    ],
  },
  explanation: {
    ko: `## NodePort Service 생성

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: web-nodeport
spec:
  type: NodePort
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080
\`\`\`

또는 kubectl 명령:

\`\`\`bash
kubectl create service nodeport web-nodeport --tcp=80:80 --node-port=30080
\`\`\`

### 주요 개념
- **NodePort**는 클러스터의 각 노드에서 고정 포트로 Service를 노출합니다.
- NodePort 범위는 기본적으로 **30000-32767**입니다.
- 외부에서 \`<NodeIP>:<NodePort>\`로 접근할 수 있습니다.
- NodePort Service는 자동으로 ClusterIP도 생성합니다.`,
    en: `## Creating a NodePort Service

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: web-nodeport
spec:
  type: NodePort
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080
\`\`\`

Or using kubectl:

\`\`\`bash
kubectl create service nodeport web-nodeport --tcp=80:80 --node-port=30080
\`\`\`

### Key Concepts
- **NodePort** exposes the Service on a fixed port on each node in the cluster.
- The default NodePort range is **30000-32767**.
- External access is available via \`<NodeIP>:<NodePort>\`.
- A NodePort Service automatically creates a ClusterIP as well.`,
  },
  setupCommands: [
    'create deployment web-app --image=nginx:1.24 --replicas=2',
  ],
  verificationSteps: [
    {
      command: 'get service web-nodeport -o jsonpath={.metadata.name}',
      expected: 'web-nodeport',
      description: {
        ko: 'web-nodeport Service가 존재하는지 확인',
        en: 'Verify web-nodeport Service exists',
      },
    },
    {
      command: 'get service web-nodeport -o jsonpath={.spec.type}',
      expected: 'NodePort',
      description: {
        ko: 'Service 타입이 NodePort인지 확인',
        en: 'Verify Service type is NodePort',
      },
    },
    {
      command: 'get service web-nodeport -o jsonpath={.spec.ports[0].port}',
      expected: '80',
      description: {
        ko: '포트가 80인지 확인',
        en: 'Verify port is 80',
      },
    },
  ],
  cleanupCommands: [
    'delete service web-nodeport --ignore-not-found',
    'delete deployment web-app --ignore-not-found',
  ],
  namespace: 'lab-networking-002',
  editorMode: 'both',
  expectedAnswer: `apiVersion: v1
kind: Service
metadata:
  name: web-nodeport
spec:
  type: NodePort
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30080`,
};
