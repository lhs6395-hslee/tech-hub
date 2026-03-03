import type { K8sDocSection } from './index';

export const ch2Sections: K8sDocSection[] = [
  // ── Section 1: Pod Basics ──
  {
    id: 'pods-basics',
    title: { ko: 'Pod 기초', en: 'Pod Basics' },
    level: 'workloads-scheduling',
    content: {
      ko: `## Pod 기초

### Pod란?

**Pod**는 Kubernetes에서 배포할 수 있는 **가장 작은 단위**입니다. 하나 이상의 컨테이너를 포함하며, 같은 Pod 내의 컨테이너들은 **네트워크 네임스페이스**와 **스토리지**를 공유합니다.

### Pod 생명주기 (Lifecycle)

| 단계 | 설명 |
|------|------|
| **Pending** | Pod가 스케줄링 대기 중이거나 이미지를 다운로드 중 |
| **Running** | 최소 하나의 컨테이너가 실행 중 |
| **Succeeded** | 모든 컨테이너가 성공적으로 종료 (exit 0) |
| **Failed** | 하나 이상의 컨테이너가 실패로 종료 |
| **Unknown** | 노드와의 통신 장애로 상태 확인 불가 |

### 기본 Pod YAML 명세

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  containers:
  - name: app
    image: nginx:1.25
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
    livenessProbe:
      httpGet:
        path: /healthz
        port: 80
      initialDelaySeconds: 5
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 80
      initialDelaySeconds: 3
      periodSeconds: 5
  restartPolicy: Always
\`\`\`

### 멀티 컨테이너 패턴

#### 1. Sidecar 패턴

메인 컨테이너를 **보조**하는 컨테이너를 함께 배치합니다 (로그 수집, 프록시 등).

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: sidecar-example
spec:
  containers:
  - name: app
    image: my-app:1.0
    volumeMounts:
    - name: logs
      mountPath: /var/log/app
  - name: log-shipper
    image: fluentd:latest
    volumeMounts:
    - name: logs
      mountPath: /var/log/app
  volumes:
  - name: logs
    emptyDir: {}
\`\`\`

#### 2. Init 컨테이너

메인 컨테이너가 시작되기 **전에** 실행되어 초기화 작업을 수행합니다. Init 컨테이너는 **순서대로** 하나씩 실행됩니다.

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: init-example
spec:
  initContainers:
  - name: wait-for-db
    image: busybox:1.36
    command: ['sh', '-c', 'until nslookup mydb-service; do echo waiting; sleep 2; done']
  - name: init-schema
    image: my-migration:1.0
    command: ['./migrate', '--up']
  containers:
  - name: app
    image: my-app:1.0
\`\`\`

### 주요 kubectl 명령어

\`\`\`bash
# Pod 생성 (명령형)
kubectl run nginx --image=nginx:1.25 --port=80

# YAML로 Pod 생성
kubectl apply -f pod.yaml

# Pod 상세 정보
kubectl describe pod my-app

# Pod 로그 확인
kubectl logs my-app
kubectl logs my-app -c log-shipper  # 특정 컨테이너 로그

# Pod 내부 접속
kubectl exec -it my-app -- /bin/bash

# Pod 삭제
kubectl delete pod my-app

# 드라이런으로 YAML 생성 (CKA 시험 팁!)
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml
\`\`\`

### 컨테이너 재시작 정책 (restartPolicy)

| 정책 | 설명 | 사용 사례 |
|------|------|-----------|
| **Always** | 항상 재시작 (기본값) | 장기 실행 서비스 |
| **OnFailure** | 실패 시에만 재시작 | Job, 배치 작업 |
| **Never** | 재시작하지 않음 | 디버깅, 일회성 작업 |

### CKA 시험 포인트

- Pod는 **일시적(ephemeral)** 리소스 — 직접 생성보다 Deployment를 사용
- \`kubectl run\`으로 빠르게 Pod 생성 가능
- \`--dry-run=client -o yaml\`을 활용하여 시간 절약
- Init 컨테이너가 실패하면 Pod 전체가 재시작됨
- 같은 Pod 내 컨테이너는 \`localhost\`로 통신 가능`,
      en: `## Pod Basics

### What is a Pod?

A **Pod** is the **smallest deployable unit** in Kubernetes. It contains one or more containers that share the same **network namespace** and **storage volumes**.

### Pod Lifecycle

| Phase | Description |
|-------|-------------|
| **Pending** | Pod is waiting to be scheduled or pulling images |
| **Running** | At least one container is running |
| **Succeeded** | All containers exited successfully (exit 0) |
| **Failed** | One or more containers exited with failure |
| **Unknown** | Cannot determine state due to node communication error |

### Basic Pod YAML Spec

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  containers:
  - name: app
    image: nginx:1.25
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
    livenessProbe:
      httpGet:
        path: /healthz
        port: 80
      initialDelaySeconds: 5
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /ready
        port: 80
      initialDelaySeconds: 3
      periodSeconds: 5
  restartPolicy: Always
\`\`\`

### Multi-Container Patterns

#### 1. Sidecar Pattern

A helper container runs alongside the main container (e.g., log shippers, proxies).

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: sidecar-example
spec:
  containers:
  - name: app
    image: my-app:1.0
    volumeMounts:
    - name: logs
      mountPath: /var/log/app
  - name: log-shipper
    image: fluentd:latest
    volumeMounts:
    - name: logs
      mountPath: /var/log/app
  volumes:
  - name: logs
    emptyDir: {}
\`\`\`

#### 2. Init Containers

Run **before** the main containers to perform initialization tasks. Init containers run **sequentially**, one at a time.

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: init-example
spec:
  initContainers:
  - name: wait-for-db
    image: busybox:1.36
    command: ['sh', '-c', 'until nslookup mydb-service; do echo waiting; sleep 2; done']
  - name: init-schema
    image: my-migration:1.0
    command: ['./migrate', '--up']
  containers:
  - name: app
    image: my-app:1.0
\`\`\`

### Essential kubectl Commands

\`\`\`bash
# Create a Pod imperatively
kubectl run nginx --image=nginx:1.25 --port=80

# Create Pod from YAML
kubectl apply -f pod.yaml

# Pod details
kubectl describe pod my-app

# Pod logs
kubectl logs my-app
kubectl logs my-app -c log-shipper  # specific container logs

# Exec into a Pod
kubectl exec -it my-app -- /bin/bash

# Delete a Pod
kubectl delete pod my-app

# Dry-run to generate YAML (CKA exam tip!)
kubectl run nginx --image=nginx --dry-run=client -o yaml > pod.yaml
\`\`\`

### Container Restart Policies (restartPolicy)

| Policy | Description | Use Case |
|--------|-------------|----------|
| **Always** | Always restart (default) | Long-running services |
| **OnFailure** | Restart only on failure | Jobs, batch workloads |
| **Never** | Never restart | Debugging, one-off tasks |

### CKA Exam Tips

- Pods are **ephemeral** — use Deployments instead of creating Pods directly
- Use \`kubectl run\` for quick Pod creation
- Leverage \`--dry-run=client -o yaml\` to save time on the exam
- If an init container fails, the entire Pod restarts
- Containers within the same Pod communicate via \`localhost\``
    },
  },

  // ── Section 2: ReplicaSet & Deployment ──
  {
    id: 'replicaset-deployment',
    title: { ko: 'ReplicaSet과 Deployment', en: 'ReplicaSet & Deployment' },
    level: 'workloads-scheduling',
    content: {
      ko: `## ReplicaSet과 Deployment

### ReplicaSet

**ReplicaSet**은 지정된 수의 Pod 복제본이 항상 실행되도록 보장합니다. 직접 사용하기보다는 **Deployment를 통해** 관리하는 것이 권장됩니다.

\`\`\`yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: my-app-rs
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:1.0
\`\`\`

> **중요**: \`selector.matchLabels\`와 \`template.metadata.labels\`는 반드시 일치해야 합니다.

### Deployment

**Deployment**는 ReplicaSet을 관리하며, **선언적 업데이트**, **롤백**, **스케일링**을 지원합니다.

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:1.0
        ports:
        - containerPort: 8080
\`\`\`

### 배포 전략 (Deployment Strategies)

| 전략 | 설명 | 다운타임 |
|------|------|----------|
| **RollingUpdate** | 점진적으로 새 Pod를 생성하고 이전 Pod를 제거 (기본값) | 없음 |
| **Recreate** | 모든 기존 Pod를 삭제한 후 새 Pod를 생성 | 있음 |

#### RollingUpdate 파라미터

| 파라미터 | 설명 | 기본값 |
|----------|------|--------|
| **maxSurge** | 원하는 replicas 이상으로 추가 생성 가능한 Pod 수 | 25% |
| **maxUnavailable** | 업데이트 중 사용 불가능한 최대 Pod 수 | 25% |

### 롤아웃 및 롤백 명령어

\`\`\`bash
# Deployment 생성
kubectl create deployment my-app --image=my-app:1.0 --replicas=3

# 이미지 업데이트 (롤아웃 트리거)
kubectl set image deployment/my-app app=my-app:2.0

# 롤아웃 상태 확인
kubectl rollout status deployment/my-app

# 롤아웃 히스토리 확인
kubectl rollout history deployment/my-app
kubectl rollout history deployment/my-app --revision=2

# 이전 버전으로 롤백
kubectl rollout undo deployment/my-app

# 특정 리비전으로 롤백
kubectl rollout undo deployment/my-app --to-revision=1

# 롤아웃 일시정지 / 재개
kubectl rollout pause deployment/my-app
kubectl rollout resume deployment/my-app
\`\`\`

### 스케일링

\`\`\`bash
# 수동 스케일링
kubectl scale deployment/my-app --replicas=5

# HPA (Horizontal Pod Autoscaler) 생성
kubectl autoscale deployment/my-app --min=2 --max=10 --cpu-percent=80
\`\`\`

### Deployment vs ReplicaSet 비교

| 기능 | ReplicaSet | Deployment |
|------|-----------|------------|
| Pod 복제본 관리 | O | O (ReplicaSet 통해) |
| 롤링 업데이트 | X | O |
| 롤백 | X | O |
| 배포 히스토리 | X | O |
| 일시정지/재개 | X | O |

### CKA 시험 포인트

- \`kubectl create deployment\`으로 빠르게 생성 후 \`--dry-run=client -o yaml\`로 YAML 추출
- 롤백 시 \`kubectl rollout undo\`를 사용
- \`CHANGE-CAUSE\` 기록을 위해 \`kubectl annotate\`를 사용하거나 \`--record\` (deprecated) 대신 annotation 사용
- Deployment가 새 ReplicaSet을 만들고, 이전 ReplicaSet은 replicas=0으로 유지됨
- \`revisionHistoryLimit\`으로 보관할 ReplicaSet 수 설정 (기본값: 10)`,
      en: `## ReplicaSet & Deployment

### ReplicaSet

A **ReplicaSet** ensures that a specified number of Pod replicas are running at all times. It is recommended to manage ReplicaSets **through Deployments** rather than directly.

\`\`\`yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: my-app-rs
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:1.0
\`\`\`

> **Important**: \`selector.matchLabels\` must match \`template.metadata.labels\`.

### Deployment

A **Deployment** manages ReplicaSets and supports **declarative updates**, **rollbacks**, and **scaling**.

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: my-app:1.0
        ports:
        - containerPort: 8080
\`\`\`

### Deployment Strategies

| Strategy | Description | Downtime |
|----------|-------------|----------|
| **RollingUpdate** | Gradually creates new Pods and removes old ones (default) | None |
| **Recreate** | Deletes all existing Pods before creating new ones | Yes |

#### RollingUpdate Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| **maxSurge** | Max Pods allowed above desired replica count | 25% |
| **maxUnavailable** | Max Pods that can be unavailable during update | 25% |

### Rollout and Rollback Commands

\`\`\`bash
# Create a Deployment
kubectl create deployment my-app --image=my-app:1.0 --replicas=3

# Update image (triggers rollout)
kubectl set image deployment/my-app app=my-app:2.0

# Check rollout status
kubectl rollout status deployment/my-app

# View rollout history
kubectl rollout history deployment/my-app
kubectl rollout history deployment/my-app --revision=2

# Rollback to previous version
kubectl rollout undo deployment/my-app

# Rollback to a specific revision
kubectl rollout undo deployment/my-app --to-revision=1

# Pause / resume rollout
kubectl rollout pause deployment/my-app
kubectl rollout resume deployment/my-app
\`\`\`

### Scaling

\`\`\`bash
# Manual scaling
kubectl scale deployment/my-app --replicas=5

# Create HPA (Horizontal Pod Autoscaler)
kubectl autoscale deployment/my-app --min=2 --max=10 --cpu-percent=80
\`\`\`

### Deployment vs ReplicaSet Comparison

| Feature | ReplicaSet | Deployment |
|---------|-----------|------------|
| Pod replica management | Yes | Yes (via ReplicaSet) |
| Rolling updates | No | Yes |
| Rollback | No | Yes |
| Deployment history | No | Yes |
| Pause/Resume | No | Yes |

### CKA Exam Tips

- Use \`kubectl create deployment\` with \`--dry-run=client -o yaml\` for quick YAML generation
- Use \`kubectl rollout undo\` for rollbacks
- For tracking \`CHANGE-CAUSE\`, use \`kubectl annotate\` instead of deprecated \`--record\`
- Deployments create new ReplicaSets; old ReplicaSets are kept at replicas=0
- Use \`revisionHistoryLimit\` to control how many old ReplicaSets are retained (default: 10)`
    },
  },

  // ── Section 3: DaemonSet & StatefulSet ──
  {
    id: 'daemonset-statefulset',
    title: { ko: 'DaemonSet과 StatefulSet', en: 'DaemonSet & StatefulSet' },
    level: 'workloads-scheduling',
    content: {
      ko: `## DaemonSet과 StatefulSet

### DaemonSet

**DaemonSet**은 클러스터의 **모든 노드**(또는 선택된 노드)에서 **하나의 Pod 복사본**이 실행되도록 보장합니다. 새 노드가 추가되면 자동으로 Pod가 배치됩니다.

#### DaemonSet 주요 사용 사례

| 사용 사례 | 예시 |
|-----------|------|
| **로그 수집** | Fluentd, Filebeat |
| **모니터링 에이전트** | Prometheus Node Exporter, Datadog Agent |
| **네트워크 플러그인** | Calico, Weave, kube-proxy |
| **스토리지 데몬** | Ceph, GlusterFS |

#### DaemonSet YAML

\`\`\`yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: kube-system
  labels:
    app: fluentd
spec:
  selector:
    matchLabels:
      app: fluentd
  template:
    metadata:
      labels:
        app: fluentd
    spec:
      tolerations:
      - key: node-role.kubernetes.io/control-plane
        effect: NoSchedule
      containers:
      - name: fluentd
        image: fluentd:v1.16
        resources:
          limits:
            memory: 200Mi
          requests:
            cpu: 100m
            memory: 200Mi
        volumeMounts:
        - name: varlog
          mountPath: /var/log
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
\`\`\`

#### DaemonSet 업데이트 전략

| 전략 | 설명 |
|------|------|
| **RollingUpdate** | 한 번에 하나씩 업데이트 (기본값) |
| **OnDelete** | 수동으로 Pod를 삭제해야 업데이트 |

### StatefulSet

**StatefulSet**은 **상태가 있는 애플리케이션**을 위한 워크로드 리소스입니다. 각 Pod에 **안정적인 네트워크 ID**와 **영속적 스토리지**를 제공합니다.

#### StatefulSet 특징

- Pod 이름이 **순서가 있는 인덱스**를 가짐: \`web-0\`, \`web-1\`, \`web-2\`
- Pod가 **순서대로** 생성 및 삭제됨 (0 → 1 → 2 생성, 2 → 1 → 0 삭제)
- 각 Pod에 **고유한 PersistentVolumeClaim** 연결
- **Headless Service**가 필요 (\`clusterIP: None\`)

#### StatefulSet YAML

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql-headless
spec:
  clusterIP: None
  selector:
    app: mysql
  ports:
  - port: 3306
    targetPort: 3306
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: "mysql-headless"
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        ports:
        - containerPort: 3306
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
\`\`\`

#### 안정적인 네트워크 ID

각 Pod는 다음 DNS 형식으로 접근 가능합니다:

\`\`\`
<pod-name>.<headless-service>.<namespace>.svc.cluster.local
\`\`\`

예: \`mysql-0.mysql-headless.default.svc.cluster.local\`

### DaemonSet vs StatefulSet vs Deployment

| 기능 | Deployment | DaemonSet | StatefulSet |
|------|-----------|-----------|-------------|
| Pod 이름 | 랜덤 해시 | 랜덤 해시 | 순서 인덱스 |
| 스케줄링 | 스케줄러 결정 | 모든 노드에 1개씩 | 스케줄러 결정 |
| 스케일링 | replicas 조정 | 노드 수에 따름 | replicas 조정 |
| 영속 스토리지 | 공유 PVC | hostPath 주로 사용 | Pod별 고유 PVC |
| 순서 보장 | X | X | O |

### CKA 시험 포인트

- DaemonSet은 replicas 필드가 없음 — 노드 수에 따라 자동 결정
- StatefulSet은 반드시 \`serviceName\` 지정과 Headless Service가 필요
- \`volumeClaimTemplates\`는 StatefulSet에서만 사용 가능
- StatefulSet Pod 삭제 시 PVC는 자동 삭제되지 않음 (데이터 보호)`,
      en: `## DaemonSet & StatefulSet

### DaemonSet

A **DaemonSet** ensures that **one copy of a Pod** runs on **every node** (or selected nodes) in the cluster. When new nodes are added, Pods are automatically scheduled.

#### DaemonSet Common Use Cases

| Use Case | Example |
|----------|---------|
| **Log collection** | Fluentd, Filebeat |
| **Monitoring agents** | Prometheus Node Exporter, Datadog Agent |
| **Network plugins** | Calico, Weave, kube-proxy |
| **Storage daemons** | Ceph, GlusterFS |

#### DaemonSet YAML

\`\`\`yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: kube-system
  labels:
    app: fluentd
spec:
  selector:
    matchLabels:
      app: fluentd
  template:
    metadata:
      labels:
        app: fluentd
    spec:
      tolerations:
      - key: node-role.kubernetes.io/control-plane
        effect: NoSchedule
      containers:
      - name: fluentd
        image: fluentd:v1.16
        resources:
          limits:
            memory: 200Mi
          requests:
            cpu: 100m
            memory: 200Mi
        volumeMounts:
        - name: varlog
          mountPath: /var/log
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
\`\`\`

#### DaemonSet Update Strategies

| Strategy | Description |
|----------|-------------|
| **RollingUpdate** | Updates one Pod at a time (default) |
| **OnDelete** | Pod must be manually deleted to trigger update |

### StatefulSet

A **StatefulSet** is a workload resource for **stateful applications**. It provides each Pod with a **stable network identity** and **persistent storage**.

#### StatefulSet Characteristics

- Pod names have **ordered indices**: \`web-0\`, \`web-1\`, \`web-2\`
- Pods are created and deleted **in order** (create: 0 → 1 → 2, delete: 2 → 1 → 0)
- Each Pod gets a **unique PersistentVolumeClaim**
- Requires a **Headless Service** (\`clusterIP: None\`)

#### StatefulSet YAML

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: mysql-headless
spec:
  clusterIP: None
  selector:
    app: mysql
  ports:
  - port: 3306
    targetPort: 3306
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
spec:
  serviceName: "mysql-headless"
  replicas: 3
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        ports:
        - containerPort: 3306
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
\`\`\`

#### Stable Network Identity

Each Pod is accessible via DNS:

\`\`\`
<pod-name>.<headless-service>.<namespace>.svc.cluster.local
\`\`\`

Example: \`mysql-0.mysql-headless.default.svc.cluster.local\`

### DaemonSet vs StatefulSet vs Deployment

| Feature | Deployment | DaemonSet | StatefulSet |
|---------|-----------|-----------|-------------|
| Pod naming | Random hash | Random hash | Ordered index |
| Scheduling | Scheduler decides | One per node | Scheduler decides |
| Scaling | Adjust replicas | Depends on node count | Adjust replicas |
| Persistent storage | Shared PVC | Typically hostPath | Unique PVC per Pod |
| Ordering guarantee | No | No | Yes |

### CKA Exam Tips

- DaemonSets have no \`replicas\` field — count is determined by number of nodes
- StatefulSets require a \`serviceName\` field and a Headless Service
- \`volumeClaimTemplates\` is only available in StatefulSets
- Deleting a StatefulSet Pod does NOT delete its PVC (data protection)`
    },
  },

  // ── Section 4: Jobs & CronJobs ──
  {
    id: 'jobs-cronjobs',
    title: { ko: 'Job과 CronJob', en: 'Jobs & CronJobs' },
    level: 'workloads-scheduling',
    content: {
      ko: `## Job과 CronJob

### Job

**Job**은 하나 이상의 Pod를 생성하여 **특정 작업을 완료**할 때까지 실행합니다. 모든 Pod가 성공적으로 종료되면 Job이 완료됩니다.

#### 기본 Job YAML

\`\`\`yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: data-migration
spec:
  completions: 1
  parallelism: 1
  backoffLimit: 4
  activeDeadlineSeconds: 300
  template:
    spec:
      containers:
      - name: migrate
        image: my-migration:1.0
        command: ["python", "migrate.py"]
      restartPolicy: Never
\`\`\`

#### Job 주요 파라미터

| 파라미터 | 설명 | 기본값 |
|----------|------|--------|
| **completions** | 성공적으로 완료해야 하는 Pod 수 | 1 |
| **parallelism** | 동시에 실행할 Pod 수 | 1 |
| **backoffLimit** | 실패 시 재시도 횟수 | 6 |
| **activeDeadlineSeconds** | Job의 전체 실행 시간 제한 (초) | 없음 |
| **ttlSecondsAfterFinished** | 완료 후 자동 삭제까지 대기 시간 (초) | 없음 |

#### 병렬 처리 패턴

\`\`\`yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: parallel-job
spec:
  completions: 10     # 총 10개의 작업 완료
  parallelism: 3      # 동시에 3개씩 실행
  backoffLimit: 5
  template:
    spec:
      containers:
      - name: worker
        image: my-worker:1.0
      restartPolicy: OnFailure
\`\`\`

### CronJob

**CronJob**은 **주기적으로 반복 실행**되는 Job을 생성합니다. Cron 형식의 스케줄을 사용합니다.

#### CronJob YAML

\`\`\`yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-backup
spec:
  schedule: "0 2 * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  startingDeadlineSeconds: 200
  jobTemplate:
    spec:
      backoffLimit: 2
      activeDeadlineSeconds: 600
      template:
        spec:
          containers:
          - name: backup
            image: my-backup:1.0
            command: ["./backup.sh"]
          restartPolicy: OnFailure
\`\`\`

#### Cron 스케줄 문법

\`\`\`
┌───────────── 분 (0 - 59)
│ ┌───────────── 시 (0 - 23)
│ │ ┌───────────── 일 (1 - 31)
│ │ │ ┌───────────── 월 (1 - 12)
│ │ │ │ ┌───────────── 요일 (0 - 6, 일요일=0)
│ │ │ │ │
* * * * *
\`\`\`

| 예시 | 설명 |
|------|------|
| \`*/5 * * * *\` | 5분마다 |
| \`0 * * * *\` | 매시 정각 |
| \`0 2 * * *\` | 매일 오전 2시 |
| \`0 0 * * 0\` | 매주 일요일 자정 |
| \`0 0 1 * *\` | 매월 1일 자정 |

#### CronJob concurrencyPolicy

| 정책 | 설명 |
|------|------|
| **Allow** | 동시 실행 허용 (기본값) |
| **Forbid** | 이전 Job이 실행 중이면 새 Job 건너뜀 |
| **Replace** | 이전 Job을 취소하고 새 Job 실행 |

### kubectl 명령어

\`\`\`bash
# Job 생성 (명령형)
kubectl create job my-job --image=busybox -- echo "Hello"

# CronJob 생성 (명령형)
kubectl create cronjob my-cron --image=busybox --schedule="*/5 * * * *" -- echo "Hello"

# Job 상태 확인
kubectl get jobs
kubectl describe job data-migration

# CronJob에서 수동으로 Job 실행
kubectl create job manual-backup --from=cronjob/nightly-backup

# Job의 Pod 로그 확인
kubectl logs job/data-migration
\`\`\`

### CKA 시험 포인트

- Job의 \`restartPolicy\`는 반드시 **Never** 또는 **OnFailure** (Always 불가)
- \`backoffLimit\`을 초과하면 Job이 **Failed** 상태가 됨
- \`activeDeadlineSeconds\`는 \`backoffLimit\`보다 우선 적용됨
- CronJob은 **UTC** 시간대를 사용 (timeZone 필드로 변경 가능, K8s 1.27+)
- \`kubectl create job --from=cronjob/...\`으로 CronJob 수동 트리거 가능`,
      en: `## Jobs & CronJobs

### Job

A **Job** creates one or more Pods and ensures they **run to completion**. The Job is complete when all Pods terminate successfully.

#### Basic Job YAML

\`\`\`yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: data-migration
spec:
  completions: 1
  parallelism: 1
  backoffLimit: 4
  activeDeadlineSeconds: 300
  template:
    spec:
      containers:
      - name: migrate
        image: my-migration:1.0
        command: ["python", "migrate.py"]
      restartPolicy: Never
\`\`\`

#### Job Key Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| **completions** | Number of Pods that must successfully complete | 1 |
| **parallelism** | Number of Pods to run concurrently | 1 |
| **backoffLimit** | Number of retries on failure | 6 |
| **activeDeadlineSeconds** | Maximum total execution time (seconds) | None |
| **ttlSecondsAfterFinished** | Time to wait before auto-cleanup (seconds) | None |

#### Parallel Processing Pattern

\`\`\`yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: parallel-job
spec:
  completions: 10     # 10 total tasks to complete
  parallelism: 3      # Run 3 at a time
  backoffLimit: 5
  template:
    spec:
      containers:
      - name: worker
        image: my-worker:1.0
      restartPolicy: OnFailure
\`\`\`

### CronJob

A **CronJob** creates Jobs on a **recurring schedule** using cron syntax.

#### CronJob YAML

\`\`\`yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-backup
spec:
  schedule: "0 2 * * *"
  concurrencyPolicy: Forbid
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  startingDeadlineSeconds: 200
  jobTemplate:
    spec:
      backoffLimit: 2
      activeDeadlineSeconds: 600
      template:
        spec:
          containers:
          - name: backup
            image: my-backup:1.0
            command: ["./backup.sh"]
          restartPolicy: OnFailure
\`\`\`

#### Cron Schedule Syntax

\`\`\`
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6, Sunday=0)
│ │ │ │ │
* * * * *
\`\`\`

| Example | Description |
|---------|-------------|
| \`*/5 * * * *\` | Every 5 minutes |
| \`0 * * * *\` | Every hour on the hour |
| \`0 2 * * *\` | Daily at 2:00 AM |
| \`0 0 * * 0\` | Every Sunday at midnight |
| \`0 0 1 * *\` | First day of every month at midnight |

#### CronJob concurrencyPolicy

| Policy | Description |
|--------|-------------|
| **Allow** | Allow concurrent Jobs (default) |
| **Forbid** | Skip new Job if previous is still running |
| **Replace** | Cancel running Job and start new one |

### kubectl Commands

\`\`\`bash
# Create a Job imperatively
kubectl create job my-job --image=busybox -- echo "Hello"

# Create a CronJob imperatively
kubectl create cronjob my-cron --image=busybox --schedule="*/5 * * * *" -- echo "Hello"

# Check Job status
kubectl get jobs
kubectl describe job data-migration

# Manually trigger a Job from CronJob
kubectl create job manual-backup --from=cronjob/nightly-backup

# View Pod logs from a Job
kubectl logs job/data-migration
\`\`\`

### CKA Exam Tips

- Job \`restartPolicy\` must be **Never** or **OnFailure** (not Always)
- Exceeding \`backoffLimit\` marks the Job as **Failed**
- \`activeDeadlineSeconds\` takes precedence over \`backoffLimit\`
- CronJobs use **UTC** by default (configurable with \`timeZone\` field, K8s 1.27+)
- Use \`kubectl create job --from=cronjob/...\` to manually trigger a CronJob`
    },
  },

  // ── Section 5: ConfigMap & Secret ──
  {
    id: 'configmap-secret',
    title: { ko: 'ConfigMap과 Secret', en: 'ConfigMap & Secret' },
    level: 'workloads-scheduling',
    content: {
      ko: `## ConfigMap과 Secret

### ConfigMap

**ConfigMap**은 키-값 쌍의 **설정 데이터**를 Pod에서 분리하여 관리합니다. 민감하지 않은 설정 정보에 사용합니다.

#### ConfigMap 생성

\`\`\`bash
# 리터럴 값으로 생성
kubectl create configmap app-config \\
  --from-literal=DB_HOST=mysql-service \\
  --from-literal=DB_PORT=3306

# 파일에서 생성
kubectl create configmap nginx-config --from-file=nginx.conf

# 디렉토리에서 생성
kubectl create configmap config-dir --from-file=./config/
\`\`\`

#### ConfigMap YAML

\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DB_HOST: "mysql-service"
  DB_PORT: "3306"
  app.properties: |
    server.port=8080
    logging.level=INFO
    feature.flag.enabled=true
\`\`\`

#### ConfigMap 사용 방법

**1. 환경 변수로 주입**

\`\`\`yaml
spec:
  containers:
  - name: app
    image: my-app:1.0
    envFrom:
    - configMapRef:
        name: app-config      # 모든 키를 환경 변수로
    env:
    - name: DATABASE_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: DB_HOST         # 특정 키만 선택
\`\`\`

**2. 볼륨으로 마운트**

\`\`\`yaml
spec:
  containers:
  - name: app
    image: my-app:1.0
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: app-config
\`\`\`

### Secret

**Secret**은 비밀번호, 토큰, 키 등 **민감한 데이터**를 저장합니다. Base64로 인코딩됩니다 (암호화가 아님!).

#### Secret 타입

| 타입 | 설명 |
|------|------|
| **Opaque** | 기본 타입, 임의의 키-값 데이터 |
| **kubernetes.io/dockerconfigjson** | Docker 레지스트리 인증 정보 |
| **kubernetes.io/tls** | TLS 인증서 |
| **kubernetes.io/basic-auth** | 기본 인증 (username/password) |
| **kubernetes.io/service-account-token** | 서비스 어카운트 토큰 |

#### Secret 생성

\`\`\`bash
# 리터럴 값으로 생성
kubectl create secret generic db-secret \\
  --from-literal=username=admin \\
  --from-literal=password=s3cur3P@ss

# TLS Secret 생성
kubectl create secret tls my-tls \\
  --cert=tls.crt --key=tls.key

# Docker 레지스트리 Secret
kubectl create secret docker-registry regcred \\
  --docker-server=registry.example.com \\
  --docker-username=user \\
  --docker-password=pass
\`\`\`

#### Secret YAML (값은 base64 인코딩)

\`\`\`yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=          # echo -n "admin" | base64
  password: czNjdXIzUEBzcw==  # echo -n "s3cur3P@ss" | base64
\`\`\`

> **팁**: \`stringData\`를 사용하면 base64 인코딩 없이 평문으로 작성 가능

\`\`\`yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  username: admin
  password: s3cur3P@ss
\`\`\`

#### Secret 사용 방법

\`\`\`yaml
spec:
  containers:
  - name: app
    image: my-app:1.0
    envFrom:
    - secretRef:
        name: db-secret
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: secret-volume
    secret:
      secretName: db-secret
\`\`\`

### Immutable ConfigMap / Secret

\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: immutable-config
data:
  key: value
immutable: true    # 변경 불가 — 삭제 후 재생성만 가능
\`\`\`

- **성능 향상**: kubelet이 API 서버에 변경 감시를 하지 않음
- **안전성**: 실수로 인한 변경 방지

### CKA 시험 포인트

- ConfigMap/Secret은 **같은 네임스페이스** 내에서만 참조 가능
- Secret은 base64 **인코딩**일 뿐 **암호화가 아님** — etcd 암호화 별도 설정 필요
- 볼륨 마운트 시 ConfigMap 변경이 자동 반영됨 (환경 변수는 Pod 재시작 필요)
- \`stringData\`를 사용하면 CKA 시험에서 시간 절약 가능
- \`kubectl create configmap/secret\` 명령어를 반드시 숙지`,
      en: `## ConfigMap & Secret

### ConfigMap

A **ConfigMap** stores **non-sensitive configuration data** as key-value pairs, decoupled from Pod specs.

#### Creating ConfigMaps

\`\`\`bash
# From literal values
kubectl create configmap app-config \\
  --from-literal=DB_HOST=mysql-service \\
  --from-literal=DB_PORT=3306

# From a file
kubectl create configmap nginx-config --from-file=nginx.conf

# From a directory
kubectl create configmap config-dir --from-file=./config/
\`\`\`

#### ConfigMap YAML

\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DB_HOST: "mysql-service"
  DB_PORT: "3306"
  app.properties: |
    server.port=8080
    logging.level=INFO
    feature.flag.enabled=true
\`\`\`

#### Using ConfigMaps

**1. Inject as Environment Variables**

\`\`\`yaml
spec:
  containers:
  - name: app
    image: my-app:1.0
    envFrom:
    - configMapRef:
        name: app-config      # All keys as env vars
    env:
    - name: DATABASE_HOST
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: DB_HOST         # Select specific key
\`\`\`

**2. Mount as Volume**

\`\`\`yaml
spec:
  containers:
  - name: app
    image: my-app:1.0
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: app-config
\`\`\`

### Secret

A **Secret** stores **sensitive data** such as passwords, tokens, and keys. Values are Base64-encoded (not encrypted!).

#### Secret Types

| Type | Description |
|------|-------------|
| **Opaque** | Default type, arbitrary key-value data |
| **kubernetes.io/dockerconfigjson** | Docker registry credentials |
| **kubernetes.io/tls** | TLS certificate |
| **kubernetes.io/basic-auth** | Basic authentication (username/password) |
| **kubernetes.io/service-account-token** | Service account token |

#### Creating Secrets

\`\`\`bash
# From literal values
kubectl create secret generic db-secret \\
  --from-literal=username=admin \\
  --from-literal=password=s3cur3P@ss

# TLS Secret
kubectl create secret tls my-tls \\
  --cert=tls.crt --key=tls.key

# Docker registry Secret
kubectl create secret docker-registry regcred \\
  --docker-server=registry.example.com \\
  --docker-username=user \\
  --docker-password=pass
\`\`\`

#### Secret YAML (values are base64-encoded)

\`\`\`yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=          # echo -n "admin" | base64
  password: czNjdXIzUEBzcw==  # echo -n "s3cur3P@ss" | base64
\`\`\`

> **Tip**: Use \`stringData\` to write plain text without base64 encoding

\`\`\`yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  username: admin
  password: s3cur3P@ss
\`\`\`

#### Using Secrets

\`\`\`yaml
spec:
  containers:
  - name: app
    image: my-app:1.0
    envFrom:
    - secretRef:
        name: db-secret
    env:
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: password
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: secret-volume
    secret:
      secretName: db-secret
\`\`\`

### Immutable ConfigMap / Secret

\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: immutable-config
data:
  key: value
immutable: true    # Cannot be modified — must delete and recreate
\`\`\`

- **Performance benefit**: kubelet stops watching the API server for changes
- **Safety**: Prevents accidental modifications

### CKA Exam Tips

- ConfigMaps/Secrets can only be referenced within the **same namespace**
- Secrets are base64 **encoded**, NOT **encrypted** — etcd encryption must be configured separately
- Volume-mounted ConfigMaps auto-update on change (env vars require Pod restart)
- Use \`stringData\` in Secrets to save time on the CKA exam
- Master the \`kubectl create configmap/secret\` imperative commands`
    },
  },

  // ── Section 6: Resource Management ──
  {
    id: 'resource-limits',
    title: { ko: '리소스 관리', en: 'Resource Management' },
    level: 'workloads-scheduling',
    content: {
      ko: `## 리소스 관리

### 리소스 Requests와 Limits

Kubernetes는 컨테이너별로 **CPU**와 **메모리** 리소스를 관리합니다.

| 구분 | 설명 |
|------|------|
| **requests** | 컨테이너가 **보장받는** 최소 리소스량 (스케줄링 기준) |
| **limits** | 컨테이너가 사용할 수 있는 **최대** 리소스량 |

#### 리소스 단위

| 리소스 | 단위 | 예시 |
|--------|------|------|
| **CPU** | 밀리코어 (m) | \`500m\` = 0.5 CPU, \`1000m\` = 1 CPU |
| **메모리** | 바이트 (Mi, Gi) | \`128Mi\`, \`1Gi\` |

#### Pod 리소스 설정 예시

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-demo
spec:
  containers:
  - name: app
    image: my-app:1.0
    resources:
      requests:
        memory: "128Mi"
        cpu: "250m"
      limits:
        memory: "256Mi"
        cpu: "500m"
\`\`\`

> **중요**: CPU 초과 시 **스로틀링**, 메모리 초과 시 **OOMKilled** (Pod 종료)

### QoS (Quality of Service) 클래스

Kubernetes는 리소스 설정에 따라 Pod에 QoS 클래스를 자동 할당합니다. 리소스 부족 시 낮은 QoS부터 **축출(evict)** 됩니다.

| QoS 클래스 | 조건 | 우선순위 |
|------------|------|----------|
| **Guaranteed** | 모든 컨테이너에 requests = limits 설정 | 최고 (마지막으로 축출) |
| **Burstable** | 최소 하나의 컨테이너에 requests 또는 limits 설정 | 중간 |
| **BestEffort** | 아무 리소스도 설정하지 않음 | 최저 (먼저 축출) |

#### Guaranteed 예시

\`\`\`yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "500m"
  limits:
    memory: "256Mi"    # requests와 동일
    cpu: "500m"        # requests와 동일
\`\`\`

### LimitRange

**LimitRange**는 네임스페이스 내에서 **컨테이너/Pod 단위**의 리소스 기본값과 제한을 설정합니다.

\`\`\`yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: resource-limits
  namespace: dev
spec:
  limits:
  - type: Container
    default:          # 기본 limits
      cpu: "500m"
      memory: "256Mi"
    defaultRequest:   # 기본 requests
      cpu: "100m"
      memory: "128Mi"
    max:              # 최대 허용
      cpu: "2"
      memory: "1Gi"
    min:              # 최소 요구
      cpu: "50m"
      memory: "64Mi"
  - type: Pod
    max:
      cpu: "4"
      memory: "2Gi"
\`\`\`

### ResourceQuota

**ResourceQuota**는 네임스페이스 전체의 **총 리소스 사용량**을 제한합니다.

\`\`\`yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: dev-quota
  namespace: dev
spec:
  hard:
    requests.cpu: "4"
    requests.memory: "8Gi"
    limits.cpu: "8"
    limits.memory: "16Gi"
    pods: "20"
    services: "10"
    persistentvolumeclaims: "5"
    configmaps: "10"
    secrets: "10"
\`\`\`

#### ResourceQuota 확인

\`\`\`bash
kubectl get resourcequota -n dev
kubectl describe resourcequota dev-quota -n dev
\`\`\`

### LimitRange vs ResourceQuota 비교

| 기능 | LimitRange | ResourceQuota |
|------|-----------|---------------|
| 적용 범위 | 개별 Pod/컨테이너 | 네임스페이스 전체 |
| 목적 | 기본값/최소/최대 설정 | 총 사용량 제한 |
| 기본값 지정 | O | X |
| 오브젝트 수 제한 | X | O |

### kubectl 명령어

\`\`\`bash
# Pod의 리소스 사용량 확인
kubectl top pods
kubectl top nodes

# QoS 클래스 확인
kubectl get pod <pod-name> -o jsonpath='{.status.qosClass}'

# LimitRange 확인
kubectl describe limitrange -n dev

# ResourceQuota 사용 현황
kubectl describe resourcequota -n dev
\`\`\`

### CKA 시험 포인트

- ResourceQuota가 설정된 네임스페이스에서는 반드시 requests/limits를 지정해야 Pod 생성 가능
- LimitRange의 default가 있으면 리소스 미지정 시 자동 적용
- QoS 클래스는 직접 설정하는 것이 아닌 requests/limits 설정에 의해 **자동 결정**
- \`kubectl top\`은 metrics-server가 설치되어 있어야 동작
- CPU는 스로틀링, 메모리는 OOMKill — 이 차이를 반드시 기억`,
      en: `## Resource Management

### Resource Requests and Limits

Kubernetes manages **CPU** and **memory** resources per container.

| Type | Description |
|------|-------------|
| **requests** | Minimum **guaranteed** resources for the container (scheduling basis) |
| **limits** | **Maximum** resources the container can use |

#### Resource Units

| Resource | Unit | Example |
|----------|------|---------|
| **CPU** | Millicores (m) | \`500m\` = 0.5 CPU, \`1000m\` = 1 CPU |
| **Memory** | Bytes (Mi, Gi) | \`128Mi\`, \`1Gi\` |

#### Pod Resource Configuration Example

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-demo
spec:
  containers:
  - name: app
    image: my-app:1.0
    resources:
      requests:
        memory: "128Mi"
        cpu: "250m"
      limits:
        memory: "256Mi"
        cpu: "500m"
\`\`\`

> **Important**: CPU overuse causes **throttling**; memory overuse causes **OOMKilled** (Pod termination)

### QoS (Quality of Service) Classes

Kubernetes automatically assigns QoS classes based on resource settings. Under resource pressure, lower QoS Pods are **evicted first**.

| QoS Class | Condition | Priority |
|-----------|-----------|----------|
| **Guaranteed** | All containers have requests = limits | Highest (evicted last) |
| **Burstable** | At least one container has requests or limits | Medium |
| **BestEffort** | No resources set at all | Lowest (evicted first) |

#### Guaranteed Example

\`\`\`yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "500m"
  limits:
    memory: "256Mi"    # Same as requests
    cpu: "500m"        # Same as requests
\`\`\`

### LimitRange

A **LimitRange** sets default values and constraints for **individual containers/Pods** within a namespace.

\`\`\`yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: resource-limits
  namespace: dev
spec:
  limits:
  - type: Container
    default:          # Default limits
      cpu: "500m"
      memory: "256Mi"
    defaultRequest:   # Default requests
      cpu: "100m"
      memory: "128Mi"
    max:              # Maximum allowed
      cpu: "2"
      memory: "1Gi"
    min:              # Minimum required
      cpu: "50m"
      memory: "64Mi"
  - type: Pod
    max:
      cpu: "4"
      memory: "2Gi"
\`\`\`

### ResourceQuota

A **ResourceQuota** limits the **total resource consumption** across an entire namespace.

\`\`\`yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: dev-quota
  namespace: dev
spec:
  hard:
    requests.cpu: "4"
    requests.memory: "8Gi"
    limits.cpu: "8"
    limits.memory: "16Gi"
    pods: "20"
    services: "10"
    persistentvolumeclaims: "5"
    configmaps: "10"
    secrets: "10"
\`\`\`

#### Checking ResourceQuota

\`\`\`bash
kubectl get resourcequota -n dev
kubectl describe resourcequota dev-quota -n dev
\`\`\`

### LimitRange vs ResourceQuota Comparison

| Feature | LimitRange | ResourceQuota |
|---------|-----------|---------------|
| Scope | Individual Pod/Container | Entire namespace |
| Purpose | Defaults / min / max | Total usage limits |
| Provides defaults | Yes | No |
| Object count limits | No | Yes |

### kubectl Commands

\`\`\`bash
# Check resource usage
kubectl top pods
kubectl top nodes

# Check QoS class
kubectl get pod <pod-name> -o jsonpath='{.status.qosClass}'

# View LimitRange
kubectl describe limitrange -n dev

# View ResourceQuota usage
kubectl describe resourcequota -n dev
\`\`\`

### CKA Exam Tips

- In namespaces with ResourceQuota, Pods **must** specify requests/limits to be created
- LimitRange defaults are auto-applied when resources are not specified
- QoS class is **automatically determined** by requests/limits settings, not set directly
- \`kubectl top\` requires metrics-server to be installed
- CPU exceeds limits = throttling; memory exceeds limits = OOMKill — remember the difference`
    },
  },

  // ── Section 7: Scheduling & Affinity ──
  {
    id: 'scheduling-affinity',
    title: { ko: '스케줄링과 어피니티', en: 'Scheduling & Affinity' },
    level: 'workloads-scheduling',
    content: {
      ko: `## 스케줄링과 어피니티

### nodeSelector

가장 간단한 노드 선택 방법입니다. **노드 레이블**을 기준으로 Pod를 특정 노드에 배치합니다.

\`\`\`bash
# 노드에 레이블 추가
kubectl label nodes worker-1 disktype=ssd
kubectl label nodes worker-2 disktype=hdd
\`\`\`

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: ssd-pod
spec:
  nodeSelector:
    disktype: ssd
  containers:
  - name: app
    image: my-app:1.0
\`\`\`

### Node Affinity

\`nodeSelector\`보다 **유연한** 노드 선택 규칙을 제공합니다.

| 타입 | 설명 |
|------|------|
| **requiredDuringSchedulingIgnoredDuringExecution** | 반드시 충족해야 함 (Hard) |
| **preferredDuringSchedulingIgnoredDuringExecution** | 가능하면 충족 (Soft) |

#### Node Affinity YAML

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: affinity-pod
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values:
            - ap-northeast-2a
            - ap-northeast-2b
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 80
        preference:
          matchExpressions:
          - key: disktype
            operator: In
            values:
            - ssd
  containers:
  - name: app
    image: my-app:1.0
\`\`\`

#### 지원 연산자

| 연산자 | 설명 |
|--------|------|
| **In** | 값 목록 중 하나와 일치 |
| **NotIn** | 값 목록에 없어야 함 |
| **Exists** | 키가 존재하면 됨 (값 무관) |
| **DoesNotExist** | 키가 존재하지 않아야 함 |
| **Gt** | 값보다 큼 (숫자) |
| **Lt** | 값보다 작음 (숫자) |

### Pod Affinity / Pod Anti-Affinity

Pod를 **다른 Pod와의 관계**에 따라 배치합니다.

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: cache-pod
  labels:
    app: cache
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - web
        topologyKey: kubernetes.io/hostname  # 같은 노드에 배치
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app
              operator: In
              values:
              - cache
          topologyKey: kubernetes.io/hostname  # 다른 노드에 분산
  containers:
  - name: cache
    image: redis:7
\`\`\`

> **topologyKey**: 토폴로지 도메인을 정의 (\`kubernetes.io/hostname\` = 노드 단위, \`topology.kubernetes.io/zone\` = 가용 영역 단위)

### Taints와 Tolerations

**Taint**는 노드에 설정하여 Pod 배치를 **거부**합니다. **Toleration**은 Pod에 설정하여 해당 Taint를 **허용**합니다.

#### Taint 관리

\`\`\`bash
# Taint 추가
kubectl taint nodes worker-1 env=production:NoSchedule

# Taint 제거
kubectl taint nodes worker-1 env=production:NoSchedule-

# Taint 확인
kubectl describe node worker-1 | grep -i taint
\`\`\`

#### Taint Effect

| Effect | 설명 |
|--------|------|
| **NoSchedule** | Toleration 없는 Pod는 스케줄링하지 않음 |
| **PreferNoSchedule** | 가능하면 스케줄링하지 않음 (soft) |
| **NoExecute** | 기존 실행 중인 Pod도 축출 + 새 Pod 스케줄링 금지 |

#### Toleration YAML

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: production-pod
spec:
  tolerations:
  - key: "env"
    operator: "Equal"
    value: "production"
    effect: "NoSchedule"
  - key: "node-role.kubernetes.io/control-plane"
    operator: "Exists"
    effect: "NoSchedule"
  containers:
  - name: app
    image: my-app:1.0
\`\`\`

### nodeName (직접 지정)

\`\`\`yaml
spec:
  nodeName: worker-1    # 스케줄러를 우회하여 직접 노드 지정
\`\`\`

### 스케줄링 정리

| 방법 | 설정 위치 | 목적 |
|------|-----------|------|
| **nodeSelector** | Pod | 간단한 노드 선택 |
| **nodeAffinity** | Pod | 유연한 노드 선택 |
| **podAffinity** | Pod | 특정 Pod와 같은 위치에 배치 |
| **podAntiAffinity** | Pod | 특정 Pod와 다른 위치에 배치 |
| **Taints** | Node | Pod 배치 거부 |
| **Tolerations** | Pod | Taint 허용 |
| **nodeName** | Pod | 직접 노드 지정 |

### CKA 시험 포인트

- \`nodeSelector\`는 가장 간단하지만 OR 조건 등 복잡한 표현 불가
- Taint/Toleration은 Pod를 특정 노드로 **끌어들이지 않음** — 거부만 함
- Control Plane 노드에는 기본적으로 \`NoSchedule\` Taint 설정됨
- \`topologyKey\`는 podAffinity/podAntiAffinity에서 **필수**
- \`IgnoredDuringExecution\`은 이미 실행 중인 Pod에는 규칙을 적용하지 않음`,
      en: `## Scheduling & Affinity

### nodeSelector

The simplest way to select nodes. Constrains Pods to nodes with matching **labels**.

\`\`\`bash
# Add labels to nodes
kubectl label nodes worker-1 disktype=ssd
kubectl label nodes worker-2 disktype=hdd
\`\`\`

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: ssd-pod
spec:
  nodeSelector:
    disktype: ssd
  containers:
  - name: app
    image: my-app:1.0
\`\`\`

### Node Affinity

Provides **more flexible** node selection rules than \`nodeSelector\`.

| Type | Description |
|------|-------------|
| **requiredDuringSchedulingIgnoredDuringExecution** | Must be satisfied (Hard) |
| **preferredDuringSchedulingIgnoredDuringExecution** | Prefer to satisfy (Soft) |

#### Node Affinity YAML

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: affinity-pod
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values:
            - us-east-1a
            - us-east-1b
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 80
        preference:
          matchExpressions:
          - key: disktype
            operator: In
            values:
            - ssd
  containers:
  - name: app
    image: my-app:1.0
\`\`\`

#### Supported Operators

| Operator | Description |
|----------|-------------|
| **In** | Matches one of the listed values |
| **NotIn** | Must not match any listed value |
| **Exists** | Key must exist (value irrelevant) |
| **DoesNotExist** | Key must not exist |
| **Gt** | Greater than (numeric) |
| **Lt** | Less than (numeric) |

### Pod Affinity / Pod Anti-Affinity

Schedule Pods based on their **relationship to other Pods**.

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: cache-pod
  labels:
    app: cache
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - web
        topologyKey: kubernetes.io/hostname  # Co-locate on same node
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchExpressions:
            - key: app
              operator: In
              values:
              - cache
          topologyKey: kubernetes.io/hostname  # Spread across nodes
  containers:
  - name: cache
    image: redis:7
\`\`\`

> **topologyKey**: Defines the topology domain (\`kubernetes.io/hostname\` = per node, \`topology.kubernetes.io/zone\` = per availability zone)

### Taints and Tolerations

**Taints** are set on nodes to **repel** Pods. **Tolerations** are set on Pods to **allow** scheduling on tainted nodes.

#### Managing Taints

\`\`\`bash
# Add a taint
kubectl taint nodes worker-1 env=production:NoSchedule

# Remove a taint
kubectl taint nodes worker-1 env=production:NoSchedule-

# Check taints
kubectl describe node worker-1 | grep -i taint
\`\`\`

#### Taint Effects

| Effect | Description |
|--------|-------------|
| **NoSchedule** | Do not schedule Pods without toleration |
| **PreferNoSchedule** | Try to avoid scheduling (soft) |
| **NoExecute** | Evict existing Pods + prevent new scheduling |

#### Toleration YAML

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: production-pod
spec:
  tolerations:
  - key: "env"
    operator: "Equal"
    value: "production"
    effect: "NoSchedule"
  - key: "node-role.kubernetes.io/control-plane"
    operator: "Exists"
    effect: "NoSchedule"
  containers:
  - name: app
    image: my-app:1.0
\`\`\`

### nodeName (Direct Assignment)

\`\`\`yaml
spec:
  nodeName: worker-1    # Bypasses the scheduler, assigns directly
\`\`\`

### Scheduling Summary

| Method | Configured On | Purpose |
|--------|--------------|---------|
| **nodeSelector** | Pod | Simple node selection |
| **nodeAffinity** | Pod | Flexible node selection |
| **podAffinity** | Pod | Co-locate with specific Pods |
| **podAntiAffinity** | Pod | Spread away from specific Pods |
| **Taints** | Node | Repel Pods |
| **Tolerations** | Pod | Allow tainted nodes |
| **nodeName** | Pod | Direct node assignment |

### CKA Exam Tips

- \`nodeSelector\` is simplest but cannot express OR conditions or complex rules
- Taints/Tolerations do NOT **attract** Pods to nodes — they only repel
- Control Plane nodes have \`NoSchedule\` taint by default
- \`topologyKey\` is **required** for podAffinity/podAntiAffinity
- \`IgnoredDuringExecution\` means rules are not applied to already-running Pods`
    },
  },

  // ── Section 8: Static Pods ──
  {
    id: 'static-pods',
    title: { ko: '스태틱 Pod', en: 'Static Pods' },
    level: 'workloads-scheduling',
    content: {
      ko: `## 스태틱 Pod

### 스태틱 Pod란?

**스태틱 Pod(Static Pod)**는 API 서버를 통하지 않고 특정 노드의 **kubelet이 직접 관리**하는 Pod입니다. kubelet이 지정된 디렉토리에서 YAML 매니페스트를 읽어 자동으로 Pod를 생성합니다.

### 스태틱 Pod의 특징

| 특징 | 설명 |
|------|------|
| **관리 주체** | kubelet이 직접 관리 (API 서버/스케줄러 우회) |
| **매니페스트 위치** | 노드의 특정 디렉토리에 YAML 파일 배치 |
| **자동 재시작** | kubelet이 Pod 장애 시 자동 재시작 |
| **미러 Pod** | API 서버에 읽기 전용 미러 오브젝트가 생성됨 |
| **삭제 방법** | 매니페스트 파일을 삭제해야 Pod 삭제됨 |

### staticPodPath 설정

kubelet 설정 파일에서 스태틱 Pod 디렉토리를 지정합니다.

\`\`\`bash
# kubelet 설정 파일 확인
cat /var/lib/kubelet/config.yaml
\`\`\`

\`\`\`yaml
# /var/lib/kubelet/config.yaml (일부)
staticPodPath: /etc/kubernetes/manifests
\`\`\`

> **기본 경로**: \`/etc/kubernetes/manifests\`

### Control Plane 컴포넌트와 스태틱 Pod

kubeadm으로 설치한 클러스터에서 Control Plane 컴포넌트들은 **스태틱 Pod**로 실행됩니다.

\`\`\`bash
# Control Plane 스태틱 Pod 매니페스트 확인
ls /etc/kubernetes/manifests/
\`\`\`

\`\`\`
etcd.yaml
kube-apiserver.yaml
kube-controller-manager.yaml
kube-scheduler.yaml
\`\`\`

### 스태틱 Pod 생성 방법

#### 1. 매니페스트 파일 작성

\`\`\`bash
# 스태틱 Pod 매니페스트 생성
cat <<EOF > /etc/kubernetes/manifests/static-web.yaml
apiVersion: v1
kind: Pod
metadata:
  name: static-web
  labels:
    app: static-web
spec:
  containers:
  - name: nginx
    image: nginx:1.25
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "100m"
      limits:
        memory: "128Mi"
        cpu: "250m"
EOF
\`\`\`

#### 2. kubelet이 자동으로 Pod 생성

\`\`\`bash
# 스태틱 Pod 확인 (노드 이름이 Pod 이름에 접미사로 붙음)
kubectl get pods -A | grep static-web
# 출력: static-web-<node-name>
\`\`\`

### 미러 Pod (Mirror Pod)

kubelet은 스태틱 Pod에 대한 **미러 Pod**를 API 서버에 생성합니다.

| 항목 | 설명 |
|------|------|
| **조회** | \`kubectl get pods\`로 볼 수 있음 |
| **수정** | API 서버를 통한 수정 **불가** |
| **삭제** | \`kubectl delete\`로 삭제해도 kubelet이 재생성 |
| **식별** | Pod 이름에 노드 이름이 접미사로 붙음 |
| **annotation** | \`kubernetes.io/config.mirror\` annotation이 있음 |

### 스태틱 Pod 관리 명령어

\`\`\`bash
# staticPodPath 확인
grep -i staticpodpath /var/lib/kubelet/config.yaml

# kubelet 설정 파일 위치 확인 (systemd)
systemctl status kubelet
# 또는
ps aux | grep kubelet | grep -- --config

# 스태틱 Pod 생성 (매니페스트 배치)
cp my-pod.yaml /etc/kubernetes/manifests/

# 스태틱 Pod 삭제 (매니페스트 제거)
rm /etc/kubernetes/manifests/static-web.yaml

# 스태틱 Pod 수정 (매니페스트 직접 편집)
vi /etc/kubernetes/manifests/static-web.yaml
# kubelet이 변경을 감지하여 자동으로 Pod 재생성
\`\`\`

### 스태틱 Pod 식별 방법

CKA 시험에서 스태틱 Pod를 식별하는 방법:

\`\`\`bash
# 방법 1: ownerReferences 확인
kubectl get pod <pod-name> -o yaml | grep -A5 ownerReferences
# ownerReferences의 kind가 "Node"이면 스태틱 Pod

# 방법 2: Pod 이름에 노드 이름 접미사 확인
kubectl get pods -o wide
# 예: etcd-controlplane, kube-apiserver-controlplane

# 방법 3: mirror annotation 확인
kubectl get pod <pod-name> -o yaml | grep mirror
\`\`\`

### 일반 Pod vs 스태틱 Pod 비교

| 항목 | 일반 Pod | 스태틱 Pod |
|------|---------|-----------|
| **생성 방법** | API 서버 (kubectl) | 매니페스트 파일 |
| **관리 주체** | API 서버 + 스케줄러 | kubelet |
| **스케줄링** | 스케줄러가 노드 결정 | 해당 노드에서만 실행 |
| **수정** | kubectl edit | 매니페스트 파일 수정 |
| **삭제** | kubectl delete | 매니페스트 파일 삭제 |
| **API 조회** | 가능 | 미러 Pod로 조회 (읽기 전용) |

### CKA 시험 포인트

- 스태틱 Pod 경로는 \`/var/lib/kubelet/config.yaml\`의 \`staticPodPath\`에서 확인
- 기본 경로는 \`/etc/kubernetes/manifests\`이지만 변경될 수 있음 — 반드시 확인!
- \`kubectl delete\`로 스태틱 Pod를 삭제할 수 **없음** — 매니페스트 파일을 삭제해야 함
- Control Plane 컴포넌트(etcd, apiserver, scheduler, controller-manager)는 스태틱 Pod
- 스태틱 Pod는 DaemonSet, Deployment 등 컨트롤러의 관리를 받지 않음
- 시험에서 kubelet 설정 파일 경로를 찾는 것이 첫 번째 단계`,
      en: `## Static Pods

### What are Static Pods?

**Static Pods** are managed **directly by the kubelet** on a specific node, without going through the API server. The kubelet reads YAML manifests from a designated directory and automatically creates Pods.

### Static Pod Characteristics

| Characteristic | Description |
|---------------|-------------|
| **Managed by** | kubelet directly (bypasses API server/scheduler) |
| **Manifest location** | YAML files placed in a specific directory on the node |
| **Auto-restart** | kubelet automatically restarts failed Pods |
| **Mirror Pod** | A read-only mirror object is created in the API server |
| **Deletion** | Must delete the manifest file to remove the Pod |

### staticPodPath Configuration

The static Pod directory is specified in the kubelet configuration file.

\`\`\`bash
# Check kubelet config file
cat /var/lib/kubelet/config.yaml
\`\`\`

\`\`\`yaml
# /var/lib/kubelet/config.yaml (excerpt)
staticPodPath: /etc/kubernetes/manifests
\`\`\`

> **Default path**: \`/etc/kubernetes/manifests\`

### Control Plane Components as Static Pods

In clusters installed with kubeadm, Control Plane components run as **static Pods**.

\`\`\`bash
# List Control Plane static Pod manifests
ls /etc/kubernetes/manifests/
\`\`\`

\`\`\`
etcd.yaml
kube-apiserver.yaml
kube-controller-manager.yaml
kube-scheduler.yaml
\`\`\`

### Creating a Static Pod

#### 1. Write the Manifest File

\`\`\`bash
# Create a static Pod manifest
cat <<EOF > /etc/kubernetes/manifests/static-web.yaml
apiVersion: v1
kind: Pod
metadata:
  name: static-web
  labels:
    app: static-web
spec:
  containers:
  - name: nginx
    image: nginx:1.25
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "100m"
      limits:
        memory: "128Mi"
        cpu: "250m"
EOF
\`\`\`

#### 2. kubelet Automatically Creates the Pod

\`\`\`bash
# Check the static Pod (node name is appended as suffix)
kubectl get pods -A | grep static-web
# Output: static-web-<node-name>
\`\`\`

### Mirror Pods

The kubelet creates a **mirror Pod** in the API server for each static Pod.

| Aspect | Description |
|--------|-------------|
| **Viewing** | Visible via \`kubectl get pods\` |
| **Editing** | **Cannot** be modified through the API server |
| **Deleting** | \`kubectl delete\` won't work — kubelet recreates it |
| **Identification** | Pod name has node name as suffix |
| **Annotation** | Has \`kubernetes.io/config.mirror\` annotation |

### Static Pod Management Commands

\`\`\`bash
# Find staticPodPath
grep -i staticpodpath /var/lib/kubelet/config.yaml

# Find kubelet config file location (systemd)
systemctl status kubelet
# or
ps aux | grep kubelet | grep -- --config

# Create a static Pod (place manifest)
cp my-pod.yaml /etc/kubernetes/manifests/

# Delete a static Pod (remove manifest)
rm /etc/kubernetes/manifests/static-web.yaml

# Modify a static Pod (edit manifest directly)
vi /etc/kubernetes/manifests/static-web.yaml
# kubelet detects changes and automatically recreates the Pod
\`\`\`

### Identifying Static Pods

How to identify static Pods on the CKA exam:

\`\`\`bash
# Method 1: Check ownerReferences
kubectl get pod <pod-name> -o yaml | grep -A5 ownerReferences
# If ownerReferences kind is "Node", it's a static Pod

# Method 2: Node name suffix in Pod name
kubectl get pods -o wide
# e.g.: etcd-controlplane, kube-apiserver-controlplane

# Method 3: Check for mirror annotation
kubectl get pod <pod-name> -o yaml | grep mirror
\`\`\`

### Regular Pods vs Static Pods

| Aspect | Regular Pod | Static Pod |
|--------|------------|------------|
| **Creation** | API server (kubectl) | Manifest file |
| **Managed by** | API server + scheduler | kubelet |
| **Scheduling** | Scheduler picks node | Runs only on that node |
| **Modification** | kubectl edit | Edit manifest file |
| **Deletion** | kubectl delete | Delete manifest file |
| **API visibility** | Full access | Mirror Pod (read-only) |

### CKA Exam Tips

- Check \`staticPodPath\` in \`/var/lib/kubelet/config.yaml\`
- Default path is \`/etc/kubernetes/manifests\` but may be changed — always verify!
- You **cannot** delete a static Pod with \`kubectl delete\` — you must remove the manifest file
- Control Plane components (etcd, apiserver, scheduler, controller-manager) are static Pods
- Static Pods are NOT managed by controllers like DaemonSets or Deployments
- On the exam, finding the kubelet config file path is always the first step`
    },
  },
];
