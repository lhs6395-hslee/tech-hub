import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'storage-004',
  domain: 'storage',
  order: 4,
  title: {
    ko: 'PVC 생성하기',
    en: 'Create a PersistentVolumeClaim',
  },
  description: {
    ko: `## 시나리오

애플리케이션에서 사용할 영구 스토리지를 요청해야 합니다.

### 요구사항

1. \`data-pvc\`라는 이름의 PersistentVolumeClaim을 생성하세요.
2. 요청 용량은 **500Mi**로 설정하세요.
3. 접근 모드는 **ReadWriteOnce**로 설정하세요.

### 참고
- PVC는 YAML 매니페스트로 생성해야 합니다.
- PVC는 적절한 PV가 있으면 자동으로 바인딩됩니다.
- PVC는 네임스페이스 수준의 리소스입니다.`,
    en: `## Scenario

You need to request persistent storage for an application.

### Requirements

1. Create a PersistentVolumeClaim named \`data-pvc\`.
2. Set the requested storage to **500Mi**.
3. Set the access mode to **ReadWriteOnce**.

### Notes
- PVCs must be created using a YAML manifest.
- A PVC will automatically bind to a suitable PV if one is available.
- PVCs are namespace-scoped resources.`,
  },
  category: 'PVC',
  difficulty: 2,
  hints: {
    ko: [
      'apiVersion은 v1, kind는 PersistentVolumeClaim을 사용하세요.',
      'spec.resources.requests.storage에 500Mi를, spec.accessModes에 ReadWriteOnce를 지정하세요.',
      '전체 YAML 예시: apiVersion: v1, kind: PersistentVolumeClaim, metadata.name: data-pvc, spec.accessModes: [ReadWriteOnce], spec.resources.requests.storage: 500Mi',
    ],
    en: [
      'Use apiVersion: v1 and kind: PersistentVolumeClaim.',
      'Set spec.resources.requests.storage to 500Mi and spec.accessModes to ReadWriteOnce.',
      'Full YAML example: apiVersion: v1, kind: PersistentVolumeClaim, metadata.name: data-pvc, spec.accessModes: [ReadWriteOnce], spec.resources.requests.storage: 500Mi',
    ],
  },
  explanation: {
    ko: `## PersistentVolumeClaim 생성

\`\`\`yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 500Mi
\`\`\`

### 주요 개념
- **PersistentVolumeClaim (PVC)**은 사용자가 스토리지를 요청하는 방법입니다.
- PVC는 요청 조건에 맞는 PV에 자동으로 바인딩됩니다.
- **accessModes**: ReadWriteOnce, ReadOnlyMany, ReadWriteMany 중 선택합니다.
- PVC의 요청 용량은 PV의 용량 이하여야 바인딩됩니다.
- Pod에서 PVC를 참조하여 볼륨을 마운트할 수 있습니다.`,
    en: `## Creating a PersistentVolumeClaim

\`\`\`yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 500Mi
\`\`\`

### Key Concepts
- A **PersistentVolumeClaim (PVC)** is how users request storage.
- A PVC automatically binds to a PV that satisfies its requirements.
- **accessModes**: Choose from ReadWriteOnce, ReadOnlyMany, or ReadWriteMany.
- The PVC's requested capacity must be less than or equal to the PV's capacity for binding.
- Pods can reference a PVC to mount the volume.`,
  },
  setupCommands: [],
  verificationSteps: [
    {
      command: 'get pvc data-pvc -o jsonpath={.metadata.name}',
      expected: 'data-pvc',
      description: {
        ko: 'data-pvc PersistentVolumeClaim이 존재하는지 확인',
        en: 'Verify data-pvc PersistentVolumeClaim exists',
      },
    },
    {
      command: 'get pvc data-pvc -o jsonpath={.spec.resources.requests.storage}',
      expected: '500Mi',
      description: {
        ko: '요청 스토리지가 500Mi인지 확인',
        en: 'Verify requested storage is 500Mi',
      },
    },
    {
      command: 'get pvc data-pvc -o jsonpath={.spec.accessModes[0]}',
      expected: 'ReadWriteOnce',
      description: {
        ko: '접근 모드가 ReadWriteOnce인지 확인',
        en: 'Verify access mode is ReadWriteOnce',
      },
    },
  ],
  cleanupCommands: ['delete pvc data-pvc --ignore-not-found'],
  namespace: 'lab-storage-004',
  editorMode: 'yaml',
  expectedAnswer: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 500Mi`,
};
