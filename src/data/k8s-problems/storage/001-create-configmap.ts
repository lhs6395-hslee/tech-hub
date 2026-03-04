import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'storage-001',
  domain: 'storage',
  order: 1,
  title: {
    ko: 'ConfigMap 생성하기',
    en: 'Create a ConfigMap',
  },
  description: {
    ko: `## 시나리오

애플리케이션의 설정값을 ConfigMap으로 관리해야 합니다.

### 요구사항

1. \`app-config\`라는 이름의 ConfigMap을 생성하세요.
2. 다음 키-값 쌍을 포함하세요:
   - \`APP_ENV=production\`
   - \`LOG_LEVEL=info\`

### 참고
- \`kubectl create configmap\` 명령에서 \`--from-literal\` 플래그를 사용합니다.
- ConfigMap은 환경 설정 데이터를 Pod에 주입할 때 사용합니다.`,
    en: `## Scenario

You need to manage application configuration values using a ConfigMap.

### Requirements

1. Create a ConfigMap named \`app-config\`.
2. Include the following key-value pairs:
   - \`APP_ENV=production\`
   - \`LOG_LEVEL=info\`

### Notes
- Use the \`--from-literal\` flag with \`kubectl create configmap\`.
- ConfigMaps are used to inject configuration data into Pods.`,
  },
  category: 'ConfigMap',
  difficulty: 1,
  hints: {
    ko: [
      'kubectl create configmap 명령에 --from-literal 플래그를 여러 번 사용할 수 있습니다.',
      'kubectl create configmap app-config --from-literal=APP_ENV=production --from-literal=LOG_LEVEL=info',
      '또는 YAML에서 data 필드에 키-값 쌍을 지정하세요.',
    ],
    en: [
      'You can use --from-literal flag multiple times with kubectl create configmap.',
      'kubectl create configmap app-config --from-literal=APP_ENV=production --from-literal=LOG_LEVEL=info',
      'Or specify key-value pairs in the data field of a YAML manifest.',
    ],
  },
  explanation: {
    ko: `## ConfigMap 생성

\`\`\`bash
kubectl create configmap app-config \\
  --from-literal=APP_ENV=production \\
  --from-literal=LOG_LEVEL=info
\`\`\`

### 주요 개념
- **ConfigMap**은 비밀이 아닌 설정 데이터를 키-값 쌍으로 저장합니다.
- 환경 변수, 명령줄 인수, 설정 파일로 Pod에 주입할 수 있습니다.
- 비밀 데이터는 ConfigMap 대신 **Secret**을 사용해야 합니다.
- ConfigMap 변경 시 Pod를 재시작해야 적용됩니다 (볼륨 마운트 제외).`,
    en: `## Creating a ConfigMap

\`\`\`bash
kubectl create configmap app-config \\
  --from-literal=APP_ENV=production \\
  --from-literal=LOG_LEVEL=info
\`\`\`

### Key Concepts
- A **ConfigMap** stores non-confidential configuration data as key-value pairs.
- It can be injected into Pods as environment variables, command-line args, or config files.
- For sensitive data, use a **Secret** instead of a ConfigMap.
- Changes to ConfigMaps require Pod restart to take effect (except volume mounts).`,
  },
  setupCommands: [],
  verificationSteps: [
    {
      command: 'get configmap app-config -o jsonpath={.metadata.name}',
      expected: 'app-config',
      description: {
        ko: 'app-config ConfigMap이 존재하는지 확인',
        en: 'Verify app-config ConfigMap exists',
      },
    },
    {
      command: 'get configmap app-config -o jsonpath={.data.APP_ENV}',
      expected: 'production',
      description: {
        ko: 'APP_ENV 값이 production인지 확인',
        en: 'Verify APP_ENV value is production',
      },
    },
    {
      command: 'get configmap app-config -o jsonpath={.data.LOG_LEVEL}',
      expected: 'info',
      description: {
        ko: 'LOG_LEVEL 값이 info인지 확인',
        en: 'Verify LOG_LEVEL value is info',
      },
    },
  ],
  cleanupCommands: ['delete configmap app-config --ignore-not-found'],
  namespace: 'lab-storage-001',
  editorMode: 'both',
  expectedAnswer: 'kubectl create configmap app-config --from-literal=APP_ENV=production --from-literal=LOG_LEVEL=info',
};
