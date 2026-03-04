import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'storage-005',
  domain: 'storage',
  order: 5,
  title: {
    ko: 'ConfigMap을 Pod에 마운트하기',
    en: 'Mount ConfigMap to Pod',
  },
  description: {
    ko: `## 시나리오

애플리케이션 설정 파일을 ConfigMap으로 관리하고, Pod에 볼륨으로 마운트해야 합니다.

### 요구사항

1. \`config-pod\`라는 이름의 Pod를 생성하세요.
2. 이미지는 \`nginx:1.24\`를 사용하세요.
3. 이미 생성되어 있는 \`app-config\` ConfigMap을 볼륨으로 마운트하세요.
4. 마운트 경로는 \`/etc/config\`로 설정하세요.

### 참고
- \`app-config\` ConfigMap은 이미 클러스터에 생성되어 있습니다.
- \`spec.volumes\`에서 ConfigMap을 볼륨으로 정의하고, \`spec.containers[].volumeMounts\`에서 마운트합니다.
- ConfigMap을 볼륨으로 마운트하면 각 키가 파일 이름이 되고, 값이 파일 내용이 됩니다.`,
    en: `## Scenario

You need to manage application configuration files using a ConfigMap and mount it as a volume in a Pod.

### Requirements

1. Create a Pod named \`config-pod\`.
2. Use the \`nginx:1.24\` image.
3. Mount the existing \`app-config\` ConfigMap as a volume.
4. Set the mount path to \`/etc/config\`.

### Notes
- The \`app-config\` ConfigMap has already been created in the cluster.
- Define the ConfigMap as a volume in \`spec.volumes\` and mount it in \`spec.containers[].volumeMounts\`.
- When a ConfigMap is mounted as a volume, each key becomes a file name and the value becomes the file content.`,
  },
  category: 'ConfigMap',
  difficulty: 2,
  hints: {
    ko: [
      'spec.volumes에 configMap 타입의 볼륨을 정의하고, name과 configMap.name을 지정하세요.',
      'spec.containers[0].volumeMounts에 mountPath: /etc/config와 볼륨 이름을 지정하세요.',
      '전체 구조: volumes: [{name: config-volume, configMap: {name: app-config}}], containers[0].volumeMounts: [{name: config-volume, mountPath: /etc/config}]',
    ],
    en: [
      'Define a volume with configMap type in spec.volumes, specifying name and configMap.name.',
      'In spec.containers[0].volumeMounts, set mountPath: /etc/config and the volume name.',
      'Full structure: volumes: [{name: config-volume, configMap: {name: app-config}}], containers[0].volumeMounts: [{name: config-volume, mountPath: /etc/config}]',
    ],
  },
  explanation: {
    ko: `## ConfigMap을 Pod에 볼륨으로 마운트

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: config-pod
spec:
  containers:
    - name: nginx
      image: nginx:1.24
      volumeMounts:
        - name: config-volume
          mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: app-config
\`\`\`

### 주요 개념
- ConfigMap을 **볼륨**으로 마운트하면 키-값 쌍이 파일로 변환됩니다.
- 각 **키**가 파일 이름이 되고, **값**이 파일 내용이 됩니다.
- 환경 변수 방식과 달리, 볼륨 마운트는 ConfigMap 변경 시 자동으로 업데이트됩니다.
- \`subPath\`를 사용하면 특정 키만 개별 파일로 마운트할 수 있습니다.
- \`volumes[].name\`과 \`volumeMounts[].name\`이 일치해야 합니다.`,
    en: `## Mounting a ConfigMap as a Volume in a Pod

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: config-pod
spec:
  containers:
    - name: nginx
      image: nginx:1.24
      volumeMounts:
        - name: config-volume
          mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: app-config
\`\`\`

### Key Concepts
- Mounting a ConfigMap as a **volume** converts key-value pairs into files.
- Each **key** becomes a file name, and the **value** becomes the file content.
- Unlike environment variables, volume mounts automatically update when the ConfigMap changes.
- Use \`subPath\` to mount a specific key as an individual file.
- The \`volumes[].name\` and \`volumeMounts[].name\` must match.`,
  },
  setupCommands: [
    'create configmap app-config --from-literal=APP_ENV=production --from-literal=LOG_LEVEL=info',
  ],
  verificationSteps: [
    {
      command: 'get pod config-pod -o jsonpath={.metadata.name}',
      expected: 'config-pod',
      description: {
        ko: 'config-pod Pod가 존재하는지 확인',
        en: 'Verify config-pod Pod exists',
      },
    },
    {
      command: 'get pod config-pod -o jsonpath={.spec.containers[0].image}',
      expected: 'nginx:1.24',
      description: {
        ko: '이미지가 nginx:1.24인지 확인',
        en: 'Verify image is nginx:1.24',
      },
    },
    {
      command: 'get pod config-pod -o jsonpath={.spec.volumes[0].configMap.name}',
      expected: 'app-config',
      description: {
        ko: 'app-config ConfigMap이 볼륨으로 마운트되었는지 확인',
        en: 'Verify app-config ConfigMap is mounted as a volume',
      },
    },
  ],
  cleanupCommands: [
    'delete pod config-pod --ignore-not-found',
    'delete configmap app-config --ignore-not-found',
  ],
  namespace: 'lab-storage-005',
  editorMode: 'yaml',
  expectedAnswer: `apiVersion: v1
kind: Pod
metadata:
  name: config-pod
spec:
  containers:
    - name: nginx
      image: nginx:1.24
      volumeMounts:
        - name: config-volume
          mountPath: /etc/config
  volumes:
    - name: config-volume
      configMap:
        name: app-config`,
};
