import type { K8sDocSection } from './index';

export const ch4Sections: K8sDocSection[] = [
  // ─── Section 1: Volume Basics ───
  {
    id: 'volumes-basics',
    title: { ko: '볼륨 기초', en: 'Volume Basics' },
    level: 'storage',
    content: {
      ko: `## 볼륨 기초

Kubernetes에서 **볼륨(Volume)**은 Pod 내 컨테이너가 데이터를 저장하고 공유할 수 있는 디렉토리입니다. 컨테이너의 파일 시스템은 기본적으로 **ephemeral**(임시)이며, 컨테이너가 재시작되면 모든 데이터가 손실됩니다. 볼륨은 이 문제를 해결합니다.

### 볼륨 vs 볼륨마운트

| 구성 요소 | 위치 | 역할 |
|-----------|------|------|
| \`spec.volumes\` | Pod 수준 | 볼륨을 정의 (타입, 소스 지정) |
| \`spec.containers[].volumeMounts\` | 컨테이너 수준 | 정의된 볼륨을 컨테이너 경로에 마운트 |

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-demo
spec:
  volumes:                    # Pod 수준에서 볼륨 정의
    - name: shared-data
      emptyDir: {}
  containers:
    - name: app
      image: nginx
      volumeMounts:           # 컨테이너 수준에서 마운트
        - name: shared-data
          mountPath: /usr/share/nginx/html
\`\`\`

### 임시(Ephemeral) vs 영구(Persistent) 볼륨

| 특성 | 임시 볼륨 | 영구 볼륨 |
|------|----------|----------|
| 수명 | Pod와 동일 | Pod보다 오래 지속 |
| 데이터 보존 | Pod 삭제 시 손실 | Pod 삭제 후에도 유지 |
| 예시 | emptyDir, configMap, secret | PersistentVolume (PV) |
| 사용 사례 | 캐시, 임시 파일 | 데이터베이스, 로그 보관 |

### 주요 볼륨 타입

#### 1. emptyDir

Pod가 노드에 할당될 때 생성되는 빈 디렉토리입니다. Pod 내 컨테이너 간 데이터 공유에 사용됩니다.

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: emptydir-pod
spec:
  containers:
    - name: writer
      image: busybox
      command: ["sh", "-c", "echo hello > /data/greeting; sleep 3600"]
      volumeMounts:
        - name: cache-vol
          mountPath: /data
    - name: reader
      image: busybox
      command: ["sh", "-c", "cat /data/greeting; sleep 3600"]
      volumeMounts:
        - name: cache-vol
          mountPath: /data
  volumes:
    - name: cache-vol
      emptyDir: {}            # 메모리 사용: emptyDir: { medium: Memory }
\`\`\`

- \`medium: Memory\` 설정 시 tmpfs(RAM 디스크)를 사용하여 빠르지만 노드 재부팅 시 손실
- \`sizeLimit\` 필드로 크기 제한 가능

#### 2. hostPath

노드의 파일 시스템에서 Pod로 파일 또는 디렉토리를 마운트합니다.

\`\`\`yaml
volumes:
  - name: host-vol
    hostPath:
      path: /var/log
      type: Directory         # DirectoryOrCreate, File, FileOrCreate 등
\`\`\`

> **핵심 포인트**: hostPath는 단일 노드 테스트에 유용하지만, 프로덕션에서는 보안 위험이 있어 권장하지 않습니다. DaemonSet에서 노드별 로그 수집에 사용될 수 있습니다.

| hostPath type | 설명 |
|---------------|------|
| \`""\` (빈 문자열) | 검사 없음 (기본값) |
| \`DirectoryOrCreate\` | 없으면 디렉토리 생성 (755) |
| \`Directory\` | 디렉토리가 반드시 존재해야 함 |
| \`FileOrCreate\` | 없으면 파일 생성 (644) |
| \`File\` | 파일이 반드시 존재해야 함 |

#### 3. configMap

ConfigMap 데이터를 파일로 마운트합니다.

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-vol-pod
spec:
  containers:
    - name: app
      image: nginx
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
          readOnly: true
  volumes:
    - name: config-vol
      configMap:
        name: app-config
        items:                # 선택적: 특정 키만 마운트
          - key: app.properties
            path: application.properties
\`\`\`

#### 4. secret

Secret 데이터를 파일로 마운트합니다. base64 디코딩된 값이 파일에 저장됩니다.

\`\`\`yaml
volumes:
  - name: secret-vol
    secret:
      secretName: db-credentials
      defaultMode: 0400      # 파일 권한 설정
\`\`\`

#### 5. downwardAPI

Pod 및 컨테이너 메타데이터를 파일로 노출합니다.

\`\`\`yaml
volumes:
  - name: podinfo
    downwardAPI:
      items:
        - path: "labels"
          fieldRef:
            fieldPath: metadata.labels
        - path: "cpu-limit"
          resourceFieldRef:
            containerName: app
            resource: limits.cpu
\`\`\`

### 실무 팁

- \`kubectl explain pod.spec.volumes\` 명령으로 볼륨 타입을 빠르게 확인
- emptyDir은 sidecar 패턴에서 로그 공유에 자주 사용됨
- configMap과 secret 볼륨은 업데이트 시 자동으로 갱신됨 (kubelet sync 주기에 따라)
- subPath를 사용하면 볼륨의 하위 디렉토리만 마운트 가능
`,
      en: `## Volume Basics

In Kubernetes, a **Volume** is a directory accessible to containers in a Pod for storing and sharing data. Container file systems are **ephemeral** by default — all data is lost when a container restarts. Volumes solve this problem.

### volume vs volumeMount

| Component | Scope | Purpose |
|-----------|-------|---------|
| \`spec.volumes\` | Pod level | Defines the volume (type, source) |
| \`spec.containers[].volumeMounts\` | Container level | Mounts a defined volume to a container path |

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: volume-demo
spec:
  volumes:                    # Define volume at Pod level
    - name: shared-data
      emptyDir: {}
  containers:
    - name: app
      image: nginx
      volumeMounts:           # Mount at container level
        - name: shared-data
          mountPath: /usr/share/nginx/html
\`\`\`

### Ephemeral vs Persistent Volumes

| Characteristic | Ephemeral Volumes | Persistent Volumes |
|----------------|-------------------|-------------------|
| Lifetime | Same as Pod | Outlives the Pod |
| Data retention | Lost on Pod deletion | Retained after Pod deletion |
| Examples | emptyDir, configMap, secret | PersistentVolume (PV) |
| Use cases | Caches, temp files | Databases, log archival |

### Key Volume Types

#### 1. emptyDir

An empty directory created when a Pod is assigned to a node. Used for sharing data between containers in the same Pod.

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: emptydir-pod
spec:
  containers:
    - name: writer
      image: busybox
      command: ["sh", "-c", "echo hello > /data/greeting; sleep 3600"]
      volumeMounts:
        - name: cache-vol
          mountPath: /data
    - name: reader
      image: busybox
      command: ["sh", "-c", "cat /data/greeting; sleep 3600"]
      volumeMounts:
        - name: cache-vol
          mountPath: /data
  volumes:
    - name: cache-vol
      emptyDir: {}            # For RAM disk: emptyDir: { medium: Memory }
\`\`\`

- Setting \`medium: Memory\` uses tmpfs (RAM-backed) — fast but lost on node reboot
- \`sizeLimit\` field can restrict volume size

#### 2. hostPath

Mounts a file or directory from the node's filesystem into the Pod.

\`\`\`yaml
volumes:
  - name: host-vol
    hostPath:
      path: /var/log
      type: Directory         # DirectoryOrCreate, File, FileOrCreate, etc.
\`\`\`

> **Key Point**: hostPath is useful for single-node testing but is a security risk in production. It can be used with DaemonSets for per-node log collection.

| hostPath type | Description |
|---------------|-------------|
| \`""\` (empty string) | No check performed (default) |
| \`DirectoryOrCreate\` | Creates directory if missing (755) |
| \`Directory\` | Directory must already exist |
| \`FileOrCreate\` | Creates file if missing (644) |
| \`File\` | File must already exist |

#### 3. configMap

Mounts ConfigMap data as files.

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-vol-pod
spec:
  containers:
    - name: app
      image: nginx
      volumeMounts:
        - name: config-vol
          mountPath: /etc/config
          readOnly: true
  volumes:
    - name: config-vol
      configMap:
        name: app-config
        items:                # Optional: mount specific keys only
          - key: app.properties
            path: application.properties
\`\`\`

#### 4. secret

Mounts Secret data as files. Values are base64-decoded before being written.

\`\`\`yaml
volumes:
  - name: secret-vol
    secret:
      secretName: db-credentials
      defaultMode: 0400      # Set file permissions
\`\`\`

#### 5. downwardAPI

Exposes Pod and container metadata as files.

\`\`\`yaml
volumes:
  - name: podinfo
    downwardAPI:
      items:
        - path: "labels"
          fieldRef:
            fieldPath: metadata.labels
        - path: "cpu-limit"
          resourceFieldRef:
            containerName: app
            resource: limits.cpu
\`\`\`

### Practical Tips

- Use \`kubectl explain pod.spec.volumes\` to quickly review volume types
- emptyDir is commonly used in the sidecar pattern for sharing logs
- configMap and secret volumes auto-update when the source changes (based on kubelet sync period)
- Use subPath to mount only a subdirectory of a volume
`,
    },
  },

  // ─── Section 2: PersistentVolume & PVC ───
  {
    id: 'pv-pvc',
    title: { ko: 'PersistentVolume과 PVC', en: 'PersistentVolume & PVC' },
    level: 'storage',
    content: {
      ko: `## PersistentVolume과 PVC

**PersistentVolume(PV)**은 클러스터 관리자가 프로비저닝하는 스토리지 리소스이며, **PersistentVolumeClaim(PVC)**은 사용자가 스토리지를 요청하는 방법입니다. PV와 PVC는 Pod에서 스토리지 구현 세부사항을 추상화합니다.

### PV/PVC 라이프사이클

\`\`\`
프로비저닝 → 바인딩 → 사용 → 회수(Reclaim)
\`\`\`

| 단계 | 설명 |
|------|------|
| **프로비저닝** | 정적(Static) — 관리자가 PV 수동 생성 / 동적(Dynamic) — StorageClass로 자동 생성 |
| **바인딩** | PVC가 조건에 맞는 PV를 찾아 1:1 바인딩 |
| **사용** | Pod가 PVC를 볼륨으로 마운트하여 사용 |
| **회수** | PVC 삭제 후 PV의 reclaimPolicy에 따라 처리 |

### PersistentVolume 정의

\`\`\`yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-example
  labels:
    type: local
spec:
  capacity:
    storage: 10Gi
  volumeMode: Filesystem       # Filesystem (기본값) 또는 Block
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual
  hostPath:                    # 테스트용 — 프로덕션에서는 NFS, iSCSI, 클라우드 볼륨 사용
    path: /mnt/data
\`\`\`

### PersistentVolumeClaim 정의

\`\`\`yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-example
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: manual
  selector:                    # 선택적: 레이블로 특정 PV 선택
    matchLabels:
      type: local
\`\`\`

### Pod에서 PVC 사용

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: pvc-pod
spec:
  containers:
    - name: app
      image: nginx
      volumeMounts:
        - name: storage
          mountPath: /usr/share/nginx/html
  volumes:
    - name: storage
      persistentVolumeClaim:
        claimName: pvc-example
\`\`\`

### 접근 모드 (Access Modes)

| 약어 | 이름 | 설명 |
|------|------|------|
| **RWO** | ReadWriteOnce | 단일 노드에서 읽기/쓰기 마운트 |
| **ROX** | ReadOnlyMany | 여러 노드에서 읽기 전용 마운트 |
| **RWX** | ReadWriteMany | 여러 노드에서 읽기/쓰기 마운트 |
| **RWOP** | ReadWriteOncePod | 단일 Pod에서만 읽기/쓰기 (K8s 1.22+) |

> **핵심 포인트**: 모든 스토리지 백엔드가 모든 접근 모드를 지원하는 것은 아닙니다. 예를 들어 AWS EBS는 RWO만 지원하고, NFS는 RWX를 지원합니다.

### 회수 정책 (Reclaim Policy)

| 정책 | 동작 | 사용 사례 |
|------|------|----------|
| **Retain** | PVC 삭제 후 PV 보존 (수동 정리 필요) | 중요한 데이터 보존 |
| **Delete** | PVC 삭제 시 PV와 외부 스토리지 자동 삭제 | 동적 프로비저닝 기본값 |
| **Recycle** | 기본 데이터 삭제 (\`rm -rf /volume/*\`) 후 재사용 | 더 이상 사용되지 않음 (deprecated) |

### PV 상태 (Status)

| 상태 | 설명 |
|------|------|
| \`Available\` | 아직 PVC에 바인딩되지 않은 상태 |
| \`Bound\` | PVC에 바인딩된 상태 |
| \`Released\` | PVC가 삭제되었지만 아직 회수되지 않은 상태 |
| \`Failed\` | 자동 회수 실패 |

### 바인딩 규칙

PVC가 PV에 바인딩되려면 다음 조건이 충족되어야 합니다:

1. **용량**: PV의 capacity >= PVC의 request
2. **접근 모드**: PV가 PVC의 접근 모드를 지원
3. **StorageClass**: PV와 PVC의 storageClassName이 일치
4. **셀렉터**: PVC에 selector가 있으면 PV의 label과 일치해야 함

### 유용한 명령어

\`\`\`bash
# PV 목록 확인
kubectl get pv

# PVC 목록 확인
kubectl get pvc

# PV 상세 정보
kubectl describe pv pv-example

# PVC 바인딩 상태 확인
kubectl get pvc pvc-example -o jsonpath='{.status.phase}'

# Released PV를 Available로 되돌리기 (수동)
kubectl patch pv pv-example -p '{"spec":{"claimRef": null}}'
\`\`\`

### 실무 팁

- PVC가 \`Pending\` 상태이면 조건에 맞는 PV가 없거나 StorageClass가 틀린 것
- \`storageClassName: ""\`은 동적 프로비저닝을 비활성화하고 정적 PV만 바인딩
- PV는 네임스페이스에 속하지 않지만(클러스터 리소스), PVC는 네임스페이스에 속함
- StatefulSet은 \`volumeClaimTemplates\`를 사용하여 각 Pod마다 고유한 PVC를 자동 생성
`,
      en: `## PersistentVolume & PVC

A **PersistentVolume (PV)** is a storage resource provisioned by a cluster administrator, and a **PersistentVolumeClaim (PVC)** is a user's request for storage. PV and PVC abstract storage implementation details away from Pods.

### PV/PVC Lifecycle

\`\`\`
Provisioning → Binding → Using → Reclaiming
\`\`\`

| Phase | Description |
|-------|-------------|
| **Provisioning** | Static — admin creates PV manually / Dynamic — auto-created via StorageClass |
| **Binding** | PVC finds a matching PV and binds 1:1 |
| **Using** | Pod mounts the PVC as a volume |
| **Reclaiming** | After PVC deletion, PV is handled per its reclaimPolicy |

### PersistentVolume Definition

\`\`\`yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-example
  labels:
    type: local
spec:
  capacity:
    storage: 10Gi
  volumeMode: Filesystem       # Filesystem (default) or Block
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: manual
  hostPath:                    # For testing — use NFS, iSCSI, cloud volumes in production
    path: /mnt/data
\`\`\`

### PersistentVolumeClaim Definition

\`\`\`yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-example
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: manual
  selector:                    # Optional: select specific PV by label
    matchLabels:
      type: local
\`\`\`

### Using PVC in a Pod

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: pvc-pod
spec:
  containers:
    - name: app
      image: nginx
      volumeMounts:
        - name: storage
          mountPath: /usr/share/nginx/html
  volumes:
    - name: storage
      persistentVolumeClaim:
        claimName: pvc-example
\`\`\`

### Access Modes

| Short | Name | Description |
|-------|------|-------------|
| **RWO** | ReadWriteOnce | Read/write by a single node |
| **ROX** | ReadOnlyMany | Read-only by many nodes |
| **RWX** | ReadWriteMany | Read/write by many nodes |
| **RWOP** | ReadWriteOncePod | Read/write by a single Pod (K8s 1.22+) |

> **Key Point**: Not all storage backends support all access modes. For example, AWS EBS supports only RWO, while NFS supports RWX.

### Reclaim Policies

| Policy | Behavior | Use Case |
|--------|----------|----------|
| **Retain** | PV preserved after PVC deletion (manual cleanup needed) | Critical data preservation |
| **Delete** | PV and external storage automatically deleted | Default for dynamic provisioning |
| **Recycle** | Basic data scrub (\`rm -rf /volume/*\`) and reuse | Deprecated — no longer recommended |

### PV Status

| Status | Description |
|--------|-------------|
| \`Available\` | Not yet bound to a PVC |
| \`Bound\` | Bound to a PVC |
| \`Released\` | PVC deleted but not yet reclaimed |
| \`Failed\` | Automatic reclamation failed |

### Binding Rules

For a PVC to bind to a PV, the following must match:

1. **Capacity**: PV capacity >= PVC request
2. **Access Modes**: PV supports the PVC's access modes
3. **StorageClass**: storageClassName must match between PV and PVC
4. **Selector**: If PVC has a selector, PV labels must match

### Useful Commands

\`\`\`bash
# List PersistentVolumes
kubectl get pv

# List PersistentVolumeClaims
kubectl get pvc

# PV details
kubectl describe pv pv-example

# Check PVC binding status
kubectl get pvc pvc-example -o jsonpath='{.status.phase}'

# Manually make a Released PV Available again
kubectl patch pv pv-example -p '{"spec":{"claimRef": null}}'
\`\`\`

### Practical Tips

- If a PVC is \`Pending\`, no matching PV exists or the StorageClass is wrong
- \`storageClassName: ""\` disables dynamic provisioning and binds only to static PVs
- PVs are cluster-scoped (not namespaced), but PVCs are namespaced
- StatefulSets use \`volumeClaimTemplates\` to automatically create a unique PVC per Pod
`,
    },
  },

  // ─── Section 3: StorageClass ───
  {
    id: 'storage-class',
    title: { ko: 'StorageClass', en: 'StorageClass' },
    level: 'storage',
    content: {
      ko: `## StorageClass

**StorageClass**는 관리자가 제공하는 스토리지의 "클래스"를 정의합니다. 동적 프로비저닝을 통해 PVC가 생성될 때 자동으로 PV를 생성할 수 있습니다.

### StorageClass 정의

\`\`\`yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-storage
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"  # 기본 StorageClass 지정
provisioner: kubernetes.io/aws-ebs    # 프로비저너
parameters:
  type: gp3
  iopsPerGB: "10"
  encrypted: "true"
reclaimPolicy: Delete
allowVolumeExpansion: true
mountOptions:
  - debug
volumeBindingMode: WaitForFirstConsumer
\`\`\`

### 주요 필드 설명

| 필드 | 설명 |
|------|------|
| \`provisioner\` | 스토리지를 프로비저닝하는 플러그인 (필수) |
| \`parameters\` | 프로비저너별 설정 파라미터 |
| \`reclaimPolicy\` | 동적 프로비저닝된 PV의 회수 정책 (\`Delete\` 기본값, \`Retain\`) |
| \`allowVolumeExpansion\` | PVC 크기 확장 허용 여부 |
| \`mountOptions\` | 볼륨 마운트 시 추가 옵션 |
| \`volumeBindingMode\` | PV 바인딩 시점 결정 |

### 동적 프로비저닝 (Dynamic Provisioning)

동적 프로비저닝을 사용하면 PV를 미리 생성할 필요가 없습니다. PVC가 StorageClass를 참조하면 자동으로 PV가 생성됩니다.

\`\`\`yaml
# StorageClass 생성
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
---
# PVC — StorageClass 참조 시 PV 자동 생성
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dynamic-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
  storageClassName: standard    # 이 StorageClass를 사용하여 PV 자동 생성
\`\`\`

### volumeBindingMode

| 모드 | 동작 | 사용 사례 |
|------|------|----------|
| \`Immediate\` | PVC 생성 즉시 PV 바인딩/프로비저닝 | 기본값. 존 제약이 없는 스토리지 |
| \`WaitForFirstConsumer\` | Pod가 스케줄링될 때까지 대기 후 바인딩 | 토폴로지 인식 스토리지 (EBS, 로컬) |

> **핵심 포인트**: \`WaitForFirstConsumer\`는 Pod가 스케줄링되는 노드의 토폴로지(존, 리전)에 맞는 PV를 프로비저닝합니다. 이는 EBS와 같이 특정 AZ에 종속되는 스토리지에 중요합니다.

\`\`\`yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: topology-aware
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
  type: gp3
\`\`\`

### 주요 프로비저너

| 프로비저너 | 스토리지 유형 | 비고 |
|-----------|-------------|------|
| \`kubernetes.io/aws-ebs\` | AWS EBS | 인트리(In-tree), CSI 마이그레이션 권장 |
| \`ebs.csi.aws.com\` | AWS EBS | CSI 드라이버 (권장) |
| \`kubernetes.io/gce-pd\` | GCE Persistent Disk | 인트리 |
| \`pd.csi.storage.gke.io\` | GCE PD | CSI 드라이버 (권장) |
| \`kubernetes.io/azure-disk\` | Azure Disk | 인트리 |
| \`disk.csi.azure.com\` | Azure Disk | CSI 드라이버 (권장) |
| \`kubernetes.io/no-provisioner\` | 로컬 스토리지 | 동적 프로비저닝 미지원, 수동 PV 필요 |

### 기본 StorageClass

\`\`\`bash
# 기본 StorageClass 확인
kubectl get storageclass

# 기본 StorageClass 설정
kubectl patch storageclass standard -p \\
  '{"metadata": {"annotations": {"storageclass.kubernetes.io/is-default-class": "true"}}}'

# 기본 StorageClass 해제
kubectl patch storageclass standard -p \\
  '{"metadata": {"annotations": {"storageclass.kubernetes.io/is-default-class": "false"}}}'
\`\`\`

- PVC에 \`storageClassName\`을 지정하지 않으면 기본 StorageClass가 사용됨
- \`storageClassName: ""\`을 명시하면 동적 프로비저닝을 비활성화
- 클러스터에 기본 StorageClass가 여러 개이면 PVC 생성 실패

### 볼륨 확장 (Volume Expansion)

\`allowVolumeExpansion: true\`인 StorageClass에서 PVC 크기를 늘릴 수 있습니다.

\`\`\`bash
# PVC 크기 확장
kubectl patch pvc dynamic-pvc -p '{"spec": {"resources": {"requests": {"storage": "30Gi"}}}}'
\`\`\`

> 볼륨 축소는 지원되지 않습니다. 파일 시스템 확장이 필요한 경우 Pod 재시작이 필요할 수 있습니다.

### 실무 팁

- \`kubectl get sc\`는 \`kubectl get storageclass\`의 축약형
- 기본 StorageClass가 없으면 \`storageClassName\`이 없는 PVC는 Pending 상태 유지
- \`WaitForFirstConsumer\`는 StatefulSet과 함께 자주 사용됨
- StorageClass는 클러스터 리소스 (네임스페이스에 속하지 않음)
`,
      en: `## StorageClass

A **StorageClass** defines a "class" of storage offered by administrators. Through dynamic provisioning, PVs are automatically created when PVCs are submitted.

### StorageClass Definition

\`\`\`yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-storage
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"  # Mark as default
provisioner: kubernetes.io/aws-ebs    # Provisioner plugin
parameters:
  type: gp3
  iopsPerGB: "10"
  encrypted: "true"
reclaimPolicy: Delete
allowVolumeExpansion: true
mountOptions:
  - debug
volumeBindingMode: WaitForFirstConsumer
\`\`\`

### Key Fields

| Field | Description |
|-------|-------------|
| \`provisioner\` | Plugin that provisions storage (required) |
| \`parameters\` | Provisioner-specific configuration |
| \`reclaimPolicy\` | Reclaim policy for dynamically provisioned PVs (\`Delete\` default, \`Retain\`) |
| \`allowVolumeExpansion\` | Whether PVC resizing is allowed |
| \`mountOptions\` | Additional options when mounting volumes |
| \`volumeBindingMode\` | When PV binding/provisioning occurs |

### Dynamic Provisioning

With dynamic provisioning, no need to pre-create PVs. When a PVC references a StorageClass, a PV is automatically created.

\`\`\`yaml
# StorageClass
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: standard
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
---
# PVC — PV auto-created via StorageClass
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dynamic-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
  storageClassName: standard    # Uses this StorageClass to auto-provision PV
\`\`\`

### volumeBindingMode

| Mode | Behavior | Use Case |
|------|----------|----------|
| \`Immediate\` | PV bound/provisioned as soon as PVC is created | Default. For storage with no zone constraints |
| \`WaitForFirstConsumer\` | Waits until a Pod is scheduled before binding | Topology-aware storage (EBS, local) |

> **Key Point**: \`WaitForFirstConsumer\` provisions the PV in the topology (zone, region) where the Pod is scheduled. This is critical for storage like EBS that is AZ-specific.

\`\`\`yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: topology-aware
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
  type: gp3
\`\`\`

### Common Provisioners

| Provisioner | Storage Type | Notes |
|-------------|-------------|-------|
| \`kubernetes.io/aws-ebs\` | AWS EBS | In-tree, CSI migration recommended |
| \`ebs.csi.aws.com\` | AWS EBS | CSI driver (recommended) |
| \`kubernetes.io/gce-pd\` | GCE Persistent Disk | In-tree |
| \`pd.csi.storage.gke.io\` | GCE PD | CSI driver (recommended) |
| \`kubernetes.io/azure-disk\` | Azure Disk | In-tree |
| \`disk.csi.azure.com\` | Azure Disk | CSI driver (recommended) |
| \`kubernetes.io/no-provisioner\` | Local storage | No dynamic provisioning, manual PV required |

### Default StorageClass

\`\`\`bash
# Check default StorageClass
kubectl get storageclass

# Set default StorageClass
kubectl patch storageclass standard -p \\
  '{"metadata": {"annotations": {"storageclass.kubernetes.io/is-default-class": "true"}}}'

# Unset default StorageClass
kubectl patch storageclass standard -p \\
  '{"metadata": {"annotations": {"storageclass.kubernetes.io/is-default-class": "false"}}}'
\`\`\`

- If a PVC omits \`storageClassName\`, the default StorageClass is used
- Setting \`storageClassName: ""\` explicitly disables dynamic provisioning
- Multiple default StorageClasses in a cluster will cause PVC creation to fail

### Volume Expansion

PVCs can be resized when \`allowVolumeExpansion: true\` is set on the StorageClass.

\`\`\`bash
# Expand PVC size
kubectl patch pvc dynamic-pvc -p '{"spec": {"resources": {"requests": {"storage": "30Gi"}}}}'
\`\`\`

> Volume shrinking is not supported. A Pod restart may be required for filesystem expansion.

### Practical Tips

- \`kubectl get sc\` is shorthand for \`kubectl get storageclass\`
- Without a default StorageClass, PVCs missing \`storageClassName\` stay Pending
- \`WaitForFirstConsumer\` is commonly used with StatefulSets
- StorageClass is a cluster-scoped resource (not namespaced)
`,
    },
  },

  // ─── Section 4: CSI Drivers ───
  {
    id: 'csi-drivers',
    title: { ko: 'CSI 드라이버', en: 'CSI Drivers' },
    level: 'storage',
    content: {
      ko: `## CSI 드라이버

**CSI(Container Storage Interface)**는 Kubernetes와 같은 컨테이너 오케스트레이터가 스토리지 시스템과 상호작용하기 위한 표준 인터페이스입니다. CSI를 통해 스토리지 벤더는 Kubernetes 코어 코드를 수정하지 않고도 드라이버를 개발하고 배포할 수 있습니다.

### 왜 CSI인가?

| 특성 | In-tree 볼륨 플러그인 | CSI 드라이버 |
|------|---------------------|-------------|
| 코드 위치 | Kubernetes 코어에 포함 | 독립적으로 개발/배포 |
| 업데이트 | K8s 릴리스 주기에 종속 | 독립적 릴리스 가능 |
| 벤더 지원 | K8s 팀 승인 필요 | 벤더가 자유롭게 개발 |
| 유지보수 | K8s 팀 부담 | 벤더가 유지보수 |
| 미래 | 더 이상 새 플러그인 추가 안 됨 | 권장 방식 |

### CSI 아키텍처

CSI 드라이버는 두 가지 주요 컴포넌트로 구성됩니다:

\`\`\`
┌─────────────────────────────────────────────────┐
│                 Kubernetes Cluster               │
│                                                  │
│  ┌──────────────────┐   ┌─────────────────────┐ │
│  │  Controller Plugin │   │    Node Plugin       │ │
│  │  (Deployment/      │   │    (DaemonSet)       │ │
│  │   StatefulSet)     │   │                      │ │
│  │                    │   │  - NodeStageVolume   │ │
│  │  - CreateVolume    │   │  - NodePublishVolume │ │
│  │  - DeleteVolume    │   │  - NodeGetInfo       │ │
│  │  - ControllerPublish│  │                      │ │
│  │  - CreateSnapshot   │  │  모든 노드에서 실행    │ │
│  │                    │   │                      │ │
│  └──────────────────┘   └─────────────────────┘ │
│                                                  │
│  Sidecar 컨테이너:                                │
│  - external-provisioner   - external-attacher    │
│  - external-snapshotter   - external-resizer     │
│  - node-driver-registrar  - livenessprobe        │
└─────────────────────────────────────────────────┘
\`\`\`

| 컴포넌트 | 배포 방식 | 역할 |
|----------|----------|------|
| **Controller Plugin** | Deployment/StatefulSet | 볼륨 생성/삭제, 스냅샷 관리 |
| **Node Plugin** | DaemonSet | 볼륨을 노드에 마운트/언마운트 |
| **Sidecar 컨테이너** | Controller/Node Pod에 포함 | K8s API와 CSI 드라이버 간 중개 |

### 주요 CSI Sidecar 컨테이너

| Sidecar | 역할 |
|---------|------|
| \`external-provisioner\` | PVC 감시 → CreateVolume 호출 |
| \`external-attacher\` | VolumeAttachment 감시 → ControllerPublishVolume 호출 |
| \`external-snapshotter\` | VolumeSnapshot 감시 → CreateSnapshot 호출 |
| \`external-resizer\` | PVC 크기 변경 감시 → ControllerExpandVolume 호출 |
| \`node-driver-registrar\` | CSI 드라이버를 kubelet에 등록 |

### 주요 CSI 드라이버

| 드라이버 | 스토리지 | 접근 모드 |
|---------|---------|----------|
| \`ebs.csi.aws.com\` | AWS EBS | RWO |
| \`efs.csi.aws.com\` | AWS EFS | RWX |
| \`pd.csi.storage.gke.io\` | GCE Persistent Disk | RWO, ROX |
| \`disk.csi.azure.com\` | Azure Disk | RWO |
| \`file.csi.azure.com\` | Azure File | RWX |
| \`csi.vsphere.vmware.com\` | vSphere | RWO |
| \`nfs.csi.k8s.io\` | NFS | RWX |

### CSI 드라이버 확인

\`\`\`bash
# 설치된 CSI 드라이버 목록
kubectl get csidrivers

# CSI 드라이버 상세 정보
kubectl describe csidriver ebs.csi.aws.com

# CSI 노드 정보 확인
kubectl get csinodes
\`\`\`

### VolumeSnapshot

CSI는 볼륨 스냅샷 기능을 지원합니다. 스냅샷을 통해 PV의 특정 시점 복사본을 생성할 수 있습니다.

#### VolumeSnapshotClass 정의

\`\`\`yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: csi-snapshot-class
driver: ebs.csi.aws.com
deletionPolicy: Delete          # Delete 또는 Retain
\`\`\`

#### VolumeSnapshot 생성

\`\`\`yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: my-snapshot
spec:
  volumeSnapshotClassName: csi-snapshot-class
  source:
    persistentVolumeClaimName: my-pvc    # 스냅샷 대상 PVC
\`\`\`

#### 스냅샷에서 PVC 복원

\`\`\`yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: restored-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: fast-storage
  dataSource:
    name: my-snapshot
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
\`\`\`

### CSI 마이그레이션

Kubernetes는 인트리(in-tree) 볼륨 플러그인에서 CSI 드라이버로의 마이그레이션을 진행 중입니다.

| 기능 | 설명 |
|------|------|
| **CSIMigration** | in-tree API를 CSI 호출로 자동 변환 |
| **CSIMigrationAWS** | AWS EBS in-tree → ebs.csi.aws.com |
| **CSIMigrationGCE** | GCE PD in-tree → pd.csi.storage.gke.io |
| **CSIMigrationAzureDisk** | Azure Disk in-tree → disk.csi.azure.com |

> CSI 마이그레이션이 활성화되면 기존 in-tree StorageClass와 PV가 자동으로 CSI 드라이버를 통해 작동합니다. 사용자가 매니페스트를 수정할 필요가 없습니다.

\`\`\`bash
# 노드의 CSI 마이그레이션 상태 확인
kubectl get csinodes -o yaml
\`\`\`

### 실무 팁

- CSI 드라이버는 일반적으로 \`kube-system\` 네임스페이스에 설치됨
- \`kubectl get csidrivers\`로 설치된 드라이버를 빠르게 확인
- VolumeSnapshot은 별도의 CRD 설치가 필요 (snapshot-controller)
- CSI 마이그레이션은 K8s 1.25+에서 여러 클라우드 드라이버에 대해 GA
- 시험에서는 CSI의 개념적 이해가 중요하며, 드라이버 설치 자체는 출제되지 않을 가능성이 높음
`,
      en: `## CSI Drivers

**CSI (Container Storage Interface)** is a standard interface for container orchestrators like Kubernetes to interact with storage systems. CSI allows storage vendors to develop and deploy drivers without modifying the Kubernetes core codebase.

### Why CSI?

| Aspect | In-tree Volume Plugins | CSI Drivers |
|--------|----------------------|-------------|
| Code location | Inside Kubernetes core | Independently developed/deployed |
| Updates | Tied to K8s release cycle | Independent release cycle |
| Vendor support | Requires K8s team approval | Vendors develop freely |
| Maintenance | K8s team burden | Vendor maintained |
| Future | No new plugins accepted | Recommended approach |

### CSI Architecture

CSI drivers consist of two main components:

\`\`\`
┌─────────────────────────────────────────────────┐
│                 Kubernetes Cluster               │
│                                                  │
│  ┌──────────────────┐   ┌─────────────────────┐ │
│  │  Controller Plugin │   │    Node Plugin       │ │
│  │  (Deployment/      │   │    (DaemonSet)       │ │
│  │   StatefulSet)     │   │                      │ │
│  │                    │   │  - NodeStageVolume   │ │
│  │  - CreateVolume    │   │  - NodePublishVolume │ │
│  │  - DeleteVolume    │   │  - NodeGetInfo       │ │
│  │  - ControllerPublish│  │                      │ │
│  │  - CreateSnapshot   │  │  Runs on every node  │ │
│  │                    │   │                      │ │
│  └──────────────────┘   └─────────────────────┘ │
│                                                  │
│  Sidecar Containers:                             │
│  - external-provisioner   - external-attacher    │
│  - external-snapshotter   - external-resizer     │
│  - node-driver-registrar  - livenessprobe        │
└─────────────────────────────────────────────────┘
\`\`\`

| Component | Deployment | Purpose |
|-----------|-----------|---------|
| **Controller Plugin** | Deployment/StatefulSet | Volume creation/deletion, snapshot management |
| **Node Plugin** | DaemonSet | Mount/unmount volumes on nodes |
| **Sidecar Containers** | Included in Controller/Node Pods | Bridge between K8s API and CSI driver |

### Key CSI Sidecar Containers

| Sidecar | Purpose |
|---------|---------|
| \`external-provisioner\` | Watches PVCs → calls CreateVolume |
| \`external-attacher\` | Watches VolumeAttachments → calls ControllerPublishVolume |
| \`external-snapshotter\` | Watches VolumeSnapshots → calls CreateSnapshot |
| \`external-resizer\` | Watches PVC size changes → calls ControllerExpandVolume |
| \`node-driver-registrar\` | Registers CSI driver with kubelet |

### Common CSI Drivers

| Driver | Storage | Access Modes |
|--------|---------|-------------|
| \`ebs.csi.aws.com\` | AWS EBS | RWO |
| \`efs.csi.aws.com\` | AWS EFS | RWX |
| \`pd.csi.storage.gke.io\` | GCE Persistent Disk | RWO, ROX |
| \`disk.csi.azure.com\` | Azure Disk | RWO |
| \`file.csi.azure.com\` | Azure File | RWX |
| \`csi.vsphere.vmware.com\` | vSphere | RWO |
| \`nfs.csi.k8s.io\` | NFS | RWX |

### Checking CSI Drivers

\`\`\`bash
# List installed CSI drivers
kubectl get csidrivers

# CSI driver details
kubectl describe csidriver ebs.csi.aws.com

# CSI node information
kubectl get csinodes
\`\`\`

### VolumeSnapshot

CSI supports volume snapshot functionality. Snapshots create point-in-time copies of PVs.

#### VolumeSnapshotClass Definition

\`\`\`yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: csi-snapshot-class
driver: ebs.csi.aws.com
deletionPolicy: Delete          # Delete or Retain
\`\`\`

#### Creating a VolumeSnapshot

\`\`\`yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: my-snapshot
spec:
  volumeSnapshotClassName: csi-snapshot-class
  source:
    persistentVolumeClaimName: my-pvc    # PVC to snapshot
\`\`\`

#### Restoring PVC from Snapshot

\`\`\`yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: restored-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: fast-storage
  dataSource:
    name: my-snapshot
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
\`\`\`

### CSI Migration

Kubernetes is migrating from in-tree volume plugins to CSI drivers.

| Feature | Description |
|---------|-------------|
| **CSIMigration** | Automatically translates in-tree API calls to CSI calls |
| **CSIMigrationAWS** | AWS EBS in-tree → ebs.csi.aws.com |
| **CSIMigrationGCE** | GCE PD in-tree → pd.csi.storage.gke.io |
| **CSIMigrationAzureDisk** | Azure Disk in-tree → disk.csi.azure.com |

> When CSI migration is enabled, existing in-tree StorageClasses and PVs automatically work through CSI drivers. Users do not need to modify their manifests.

\`\`\`bash
# Check CSI migration status on nodes
kubectl get csinodes -o yaml
\`\`\`

### Practical Tips

- CSI drivers are typically installed in the \`kube-system\` namespace
- Use \`kubectl get csidrivers\` to quickly list installed drivers
- VolumeSnapshot requires separate CRD installation (snapshot-controller)
- CSI migration is GA for several cloud drivers in K8s 1.25+
- The exam focuses on conceptual understanding of CSI; driver installation is unlikely to be tested directly
`,
    },
  },
];
