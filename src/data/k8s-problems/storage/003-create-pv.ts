import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'storage-003',
  domain: 'storage',
  order: 3,
  title: {
    ko: 'PersistentVolume 생성하기',
    en: 'Create a PersistentVolume',
  },
  description: {
    ko: `## 시나리오

클러스터에서 사용할 영구 스토리지를 프로비저닝해야 합니다.

### 요구사항

1. \`data-pv\`라는 이름의 PersistentVolume을 생성하세요.
2. 용량은 **1Gi**로 설정하세요.
3. 접근 모드는 **ReadWriteOnce**로 설정하세요.
4. hostPath는 \`/data/storage\`로 설정하세요.

### 참고
- PersistentVolume은 YAML 매니페스트로 생성해야 합니다.
- \`hostPath\` 타입은 단일 노드 환경에서 테스트 용도로 사용됩니다.
- PV는 네임스페이스에 속하지 않는 클러스터 수준 리소스입니다.`,
    en: `## Scenario

You need to provision persistent storage for use in the cluster.

### Requirements

1. Create a PersistentVolume named \`data-pv\`.
2. Set the capacity to **1Gi**.
3. Set the access mode to **ReadWriteOnce**.
4. Set the hostPath to \`/data/storage\`.

### Notes
- PersistentVolumes must be created using a YAML manifest.
- The \`hostPath\` type is used for testing purposes in single-node environments.
- A PV is a cluster-level resource and does not belong to any namespace.`,
  },
  category: 'PV',
  difficulty: 2,
  hints: {
    ko: [
      'apiVersion은 v1, kind는 PersistentVolume을 사용하세요.',
      'spec.capacity.storage에 1Gi를, spec.accessModes에 ReadWriteOnce를 지정하세요.',
      'spec.hostPath.path에 /data/storage를 지정하세요. 전체 YAML 예시: apiVersion: v1, kind: PersistentVolume, metadata.name: data-pv',
    ],
    en: [
      'Use apiVersion: v1 and kind: PersistentVolume.',
      'Set spec.capacity.storage to 1Gi and spec.accessModes to ReadWriteOnce.',
      'Set spec.hostPath.path to /data/storage. Full YAML example: apiVersion: v1, kind: PersistentVolume, metadata.name: data-pv',
    ],
  },
  explanation: {
    ko: `## PersistentVolume 생성

\`\`\`yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: data-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /data/storage
\`\`\`

### 주요 개념
- **PersistentVolume (PV)**은 클러스터 관리자가 프로비저닝하는 스토리지 리소스입니다.
- **ReadWriteOnce**: 하나의 노드에서 읽기/쓰기가 가능합니다.
- **hostPath**: 노드의 로컬 파일시스템을 사용하며, 프로덕션에서는 권장되지 않습니다.
- PV는 PVC(PersistentVolumeClaim)를 통해 Pod에 바인딩됩니다.
- PV의 라이프사이클은 Pod와 독립적입니다.`,
    en: `## Creating a PersistentVolume

\`\`\`yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: data-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /data/storage
\`\`\`

### Key Concepts
- A **PersistentVolume (PV)** is a storage resource provisioned by a cluster administrator.
- **ReadWriteOnce**: The volume can be mounted as read-write by a single node.
- **hostPath**: Uses the node's local filesystem and is not recommended for production.
- PVs are bound to Pods through PersistentVolumeClaims (PVCs).
- The PV lifecycle is independent of any Pod.`,
  },
  setupCommands: [],
  verificationSteps: [
    {
      command: 'get pv data-pv -o jsonpath={.metadata.name}',
      expected: 'data-pv',
      description: {
        ko: 'data-pv PersistentVolume이 존재하는지 확인',
        en: 'Verify data-pv PersistentVolume exists',
      },
    },
    {
      command: 'get pv data-pv -o jsonpath={.spec.capacity.storage}',
      expected: '1Gi',
      description: {
        ko: '스토리지 용량이 1Gi인지 확인',
        en: 'Verify storage capacity is 1Gi',
      },
    },
    {
      command: 'get pv data-pv -o jsonpath={.spec.accessModes[0]}',
      expected: 'ReadWriteOnce',
      description: {
        ko: '접근 모드가 ReadWriteOnce인지 확인',
        en: 'Verify access mode is ReadWriteOnce',
      },
    },
  ],
  cleanupCommands: ['delete pv data-pv --ignore-not-found'],
  namespace: 'lab-storage-003',
  editorMode: 'yaml',
  expectedAnswer: `apiVersion: v1
kind: PersistentVolume
metadata:
  name: data-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /data/storage`,
};
