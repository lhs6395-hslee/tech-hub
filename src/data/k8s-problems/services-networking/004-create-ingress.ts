import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'services-networking-004',
  domain: 'services-networking',
  order: 4,
  title: {
    ko: 'Ingress 생성하기',
    en: 'Create an Ingress',
  },
  description: {
    ko: `## 시나리오

도메인 기반 라우팅을 구성하기 위해 Ingress 리소스를 생성해야 합니다.

### 요구사항

1. \`web-ingress\`라는 이름의 **Ingress**를 생성하세요.
2. 호스트를 \`app.example.com\`으로 설정하세요.
3. \`/\` 경로의 트래픽을 \`web-svc\` Service의 포트 **80**으로 라우팅하세요.
4. pathType은 \`Prefix\`로 설정하세요.

### 참고
- 이 문제의 환경에는 \`web-app\` Deployment와 \`web-svc\` Service가 이미 배포되어 있습니다.
- Ingress는 YAML 매니페스트로 작성해야 합니다.
- \`kubectl create ingress\` 명령도 사용할 수 있습니다.`,
    en: `## Scenario

You need to create an Ingress resource to configure domain-based routing.

### Requirements

1. Create an **Ingress** named \`web-ingress\`.
2. Set the host to \`app.example.com\`.
3. Route traffic on path \`/\` to the \`web-svc\` Service on port **80**.
4. Set the pathType to \`Prefix\`.

### Notes
- The \`web-app\` Deployment and \`web-svc\` Service are already deployed in this lab environment.
- Ingress must be written as a YAML manifest.
- You can also use the \`kubectl create ingress\` command.`,
  },
  category: 'Ingress',
  difficulty: 2,
  hints: {
    ko: [
      'Ingress의 apiVersion은 networking.k8s.io/v1입니다.',
      'spec.rules에 host와 http.paths를 정의하세요.',
      'backend.service.name에 web-svc, backend.service.port.number에 80을 설정하세요.',
    ],
    en: [
      'The apiVersion for Ingress is networking.k8s.io/v1.',
      'Define host and http.paths under spec.rules.',
      'Set backend.service.name to web-svc and backend.service.port.number to 80.',
    ],
  },
  explanation: {
    ko: `## Ingress 생성

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-svc
                port:
                  number: 80
\`\`\`

또는 kubectl 명령:

\`\`\`bash
kubectl create ingress web-ingress --rule="app.example.com/=web-svc:80"
\`\`\`

### 주요 개념
- **Ingress**는 클러스터 외부에서 내부 Service로의 HTTP/HTTPS 라우팅을 관리합니다.
- \`host\` 필드를 사용하여 도메인 기반 라우팅을 구성합니다.
- \`pathType: Prefix\`는 경로 접두사 매칭을 의미합니다.
- Ingress가 작동하려면 클러스터에 Ingress Controller(예: NGINX Ingress Controller)가 설치되어 있어야 합니다.`,
    en: `## Creating an Ingress

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-svc
                port:
                  number: 80
\`\`\`

Or using kubectl:

\`\`\`bash
kubectl create ingress web-ingress --rule="app.example.com/=web-svc:80"
\`\`\`

### Key Concepts
- **Ingress** manages HTTP/HTTPS routing from outside the cluster to internal Services.
- The \`host\` field configures domain-based routing.
- \`pathType: Prefix\` means path prefix matching.
- An Ingress Controller (e.g., NGINX Ingress Controller) must be installed in the cluster for Ingress to work.`,
  },
  setupCommands: [
    'create deployment web-app --image=nginx:1.24',
    'expose deployment web-app --name=web-svc --port=80',
  ],
  verificationSteps: [
    {
      command: 'get ingress web-ingress -o jsonpath={.metadata.name}',
      expected: 'web-ingress',
      description: {
        ko: 'web-ingress Ingress가 존재하는지 확인',
        en: 'Verify web-ingress Ingress exists',
      },
    },
    {
      command: 'get ingress web-ingress -o jsonpath={.spec.rules[0].host}',
      expected: 'app.example.com',
      description: {
        ko: '호스트가 app.example.com인지 확인',
        en: 'Verify host is app.example.com',
      },
    },
  ],
  cleanupCommands: [
    'delete ingress web-ingress --ignore-not-found',
    'delete service web-svc --ignore-not-found',
    'delete deployment web-app --ignore-not-found',
  ],
  namespace: 'lab-networking-004',
  editorMode: 'yaml',
  expectedAnswer: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-svc
                port:
                  number: 80`,
};
