import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'services-networking-005',
  domain: 'services-networking',
  order: 5,
  title: {
    ko: 'Headless Service 생성하기',
    en: 'Create a Headless Service',
  },
  description: {
    ko: `## 시나리오

StatefulSet이나 데이터베이스 Pod에 직접 DNS 조회가 가능하도록 Headless Service를 생성해야 합니다.

### 요구사항

1. \`db-headless\`라는 이름의 **Headless Service**를 생성하세요.
2. \`clusterIP\`를 \`None\`으로 설정하세요.
3. 셀렉터는 \`app=database\`로 설정하세요.
4. 포트 **5432**를 매핑하세요.

### 참고
- 이 문제의 환경에는 \`database\` Pod가 이미 배포되어 있습니다.
- Headless Service는 YAML 매니페스트로 작성해야 합니다.
- Headless Service는 \`clusterIP: None\`을 설정하여 생성합니다.`,
    en: `## Scenario

You need to create a Headless Service to enable direct DNS lookups to StatefulSet or database Pods.

### Requirements

1. Create a **Headless Service** named \`db-headless\`.
2. Set \`clusterIP\` to \`None\`.
3. Set the selector to \`app=database\`.
4. Map port **5432**.

### Notes
- The \`database\` Pod is already deployed in this lab environment.
- Headless Service must be written as a YAML manifest.
- A Headless Service is created by setting \`clusterIP: None\`.`,
  },
  category: 'Service',
  difficulty: 2,
  hints: {
    ko: [
      'Headless Service는 일반 Service와 동일하지만 clusterIP를 None으로 설정합니다.',
      'spec.clusterIP: None을 명시적으로 설정하세요.',
      'spec.selector에 app: database, spec.ports에 port: 5432를 설정하세요.',
    ],
    en: [
      'A Headless Service is the same as a regular Service but with clusterIP set to None.',
      'Explicitly set spec.clusterIP: None.',
      'Set app: database in spec.selector and port: 5432 in spec.ports.',
    ],
  },
  explanation: {
    ko: `## Headless Service 생성

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: db-headless
spec:
  clusterIP: None
  selector:
    app: database
  ports:
    - port: 5432
      targetPort: 5432
\`\`\`

### 주요 개념
- **Headless Service**는 \`clusterIP: None\`을 설정하여 로드밸런싱 없이 개별 Pod에 직접 접근합니다.
- DNS 조회 시 Service의 단일 IP 대신 각 Pod의 IP가 반환됩니다.
- **StatefulSet**과 함께 사용하면 \`<pod-name>.<service-name>\` 형식으로 개별 Pod에 접근할 수 있습니다.
- 데이터베이스 클러스터링이나 서비스 디스커버리에 유용합니다.
- 일반 Service와 달리 kube-proxy가 트래픽을 라우팅하지 않습니다.`,
    en: `## Creating a Headless Service

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: db-headless
spec:
  clusterIP: None
  selector:
    app: database
  ports:
    - port: 5432
      targetPort: 5432
\`\`\`

### Key Concepts
- A **Headless Service** sets \`clusterIP: None\` to allow direct access to individual Pods without load balancing.
- DNS lookups return individual Pod IPs instead of a single Service IP.
- When used with a **StatefulSet**, individual Pods are accessible via \`<pod-name>.<service-name>\`.
- Useful for database clustering and service discovery.
- Unlike regular Services, kube-proxy does not route traffic for Headless Services.`,
  },
  setupCommands: [
    'run database --image=postgres:15 --labels=app=database',
  ],
  verificationSteps: [
    {
      command: 'get service db-headless -o jsonpath={.metadata.name}',
      expected: 'db-headless',
      description: {
        ko: 'db-headless Service가 존재하는지 확인',
        en: 'Verify db-headless Service exists',
      },
    },
    {
      command: 'get service db-headless -o jsonpath={.spec.clusterIP}',
      expected: 'None',
      description: {
        ko: 'clusterIP가 None인지 확인',
        en: 'Verify clusterIP is None',
      },
    },
    {
      command: 'get service db-headless -o jsonpath={.spec.ports[0].port}',
      expected: '5432',
      description: {
        ko: '포트가 5432인지 확인',
        en: 'Verify port is 5432',
      },
    },
  ],
  cleanupCommands: [
    'delete service db-headless --ignore-not-found',
    'delete pod database --ignore-not-found',
  ],
  namespace: 'lab-networking-005',
  editorMode: 'yaml',
  expectedAnswer: `apiVersion: v1
kind: Service
metadata:
  name: db-headless
spec:
  clusterIP: None
  selector:
    app: database
  ports:
    - port: 5432
      targetPort: 5432`,
};
