import type { K8sDocSection } from './index';

export const ch1Sections: K8sDocSection[] = [
  // ─── Section 1: Kubernetes Overview ───────────────────────────────────────────
  {
    id: 'k8s-overview',
    title: { ko: 'Kubernetes 개요', en: 'Kubernetes Overview' },
    level: 'cluster-architecture',
    content: {
      ko: `## Kubernetes 개요

### Kubernetes란?

Kubernetes(K8s)는 **컨테이너화된 애플리케이션**의 배포, 확장, 관리를 자동화하는 오픈소스 컨테이너 오케스트레이션 플랫폼입니다.

- Google이 내부 시스템(Borg)을 기반으로 설계
- 2014년 오픈소스로 공개, 현재 CNCF에서 관리
- 선언적 설정과 자동화를 통해 운영 효율성 극대화

### 왜 컨테이너인가?

| 특성 | 전통적 배포 | 가상화 배포 | 컨테이너 배포 |
|------|-----------|-----------|-------------|
| 격리 수준 | 없음 | OS 수준 | 프로세스 수준 |
| 시작 시간 | 분 단위 | 분 단위 | 초 단위 |
| 리소스 효율 | 낮음 | 중간 | 높음 |
| 이식성 | 낮음 | 중간 | 높음 |
| 이미지 크기 | GB | GB | MB |

### Kubernetes의 핵심 이점

- **서비스 디스커버리와 로드 밸런싱**: DNS 이름 또는 IP로 컨테이너 노출
- **스토리지 오케스트레이션**: 로컬, 클라우드 스토리지 자동 마운트
- **자동 롤아웃/롤백**: 선언적 상태에 따른 자동 배포 관리
- **자동 빈 패킹**: 리소스 요구사항에 따른 최적 노드 배치
- **자가 치유**: 실패한 컨테이너 재시작, 교체, 종료
- **시크릿/설정 관리**: 민감 정보를 이미지 재빌드 없이 관리

### 아키텍처 개요

### 핵심 포인트

- Kubernetes의 핵심 구성 요소와 역할을 정확히 이해
- Control Plane과 Worker Node의 차이점 숙지
- 선언적(Declarative) vs 명령적(Imperative) 접근법 이해
- \`kubectl\` 기본 명령어 숙달

\`\`\`bash
# 클러스터 정보 확인
kubectl cluster-info

# 노드 목록 확인
kubectl get nodes -o wide

# 모든 네임스페이스의 파드 확인
kubectl get pods --all-namespaces

# 컴포넌트 상태 확인
kubectl get componentstatuses
\`\`\`

### Kubernetes 오브젝트 모델

모든 K8s 리소스는 **오브젝트**로 표현됩니다:

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
  labels:
    app: web
spec:
  containers:
  - name: nginx
    image: nginx:1.25
    ports:
    - containerPort: 80
\`\`\`

- **apiVersion**: API 그룹과 버전
- **kind**: 오브젝트 타입
- **metadata**: 이름, 레이블, 어노테이션
- **spec**: 원하는 상태 (Desired State)
- **status**: 현재 상태 (Current State) - 시스템이 관리`,

      en: `## Kubernetes Overview

### What is Kubernetes?

Kubernetes (K8s) is an open-source container orchestration platform that automates the deployment, scaling, and management of **containerized applications**.

- Designed by Google based on internal systems (Borg)
- Open-sourced in 2014, currently managed by CNCF
- Maximizes operational efficiency through declarative configuration and automation

### Why Containers?

| Property | Traditional | Virtualized | Containerized |
|----------|------------|-------------|---------------|
| Isolation | None | OS-level | Process-level |
| Startup Time | Minutes | Minutes | Seconds |
| Resource Efficiency | Low | Medium | High |
| Portability | Low | Medium | High |
| Image Size | GBs | GBs | MBs |

### Key Benefits of Kubernetes

- **Service Discovery & Load Balancing**: Expose containers via DNS name or IP
- **Storage Orchestration**: Auto-mount local or cloud storage
- **Automated Rollouts/Rollbacks**: Automatic deployment management based on declared state
- **Automatic Bin Packing**: Optimal node placement based on resource requirements
- **Self-Healing**: Restart, replace, and kill failed containers
- **Secret & Config Management**: Manage sensitive info without rebuilding images

### Architecture Overview

### Key Points

- Understand core components and their roles precisely
- Know the differences between Control Plane and Worker Nodes
- Understand Declarative vs Imperative approaches
- Master basic \`kubectl\` commands

\`\`\`bash
# Check cluster info
kubectl cluster-info

# List nodes with details
kubectl get nodes -o wide

# Get pods across all namespaces
kubectl get pods --all-namespaces

# Check component status
kubectl get componentstatuses
\`\`\`

### Kubernetes Object Model

All K8s resources are represented as **objects**:

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
  labels:
    app: web
spec:
  containers:
  - name: nginx
    image: nginx:1.25
    ports:
    - containerPort: 80
\`\`\`

- **apiVersion**: API group and version
- **kind**: Object type
- **metadata**: Name, labels, annotations
- **spec**: Desired State
- **status**: Current State - managed by the system`,
    },
  },

  // ─── Section 2: Cluster Components ────────────────────────────────────────────
  {
    id: 'cluster-components',
    title: { ko: '클러스터 컴포넌트', en: 'Cluster Components' },
    level: 'cluster-architecture',
    content: {
      ko: `## 클러스터 컴포넌트

### Control Plane 컴포넌트

Control Plane은 클러스터의 **두뇌** 역할을 하며, 전체 클러스터 상태를 관리합니다.

#### 1. kube-apiserver

- 모든 클러스터 작업의 **진입점**
- RESTful API를 통해 모든 컴포넌트와 통신
- 인증(Authentication), 인가(Authorization), 어드미션 컨트롤 수행
- 유일하게 etcd와 직접 통신하는 컴포넌트

\`\`\`bash
# API Server 프로세스 확인
ps aux | grep kube-apiserver

# API Server 파드 확인 (kubeadm 클러스터)
kubectl get pods -n kube-system | grep apiserver
\`\`\`

#### 2. etcd

- 분산 키-값 저장소
- 클러스터의 모든 상태 데이터 저장
- Raft 합의 알고리즘 사용
- 기본 포트: **2379** (클라이언트), **2380** (피어)

#### 3. kube-scheduler

- 새로 생성된 파드를 적절한 노드에 **배치**
- 리소스 요구사항, affinity/anti-affinity, taint/toleration 고려
- 스케줄링 과정: 필터링(Filtering) → 스코어링(Scoring)

#### 4. kube-controller-manager

주요 컨트롤러들을 하나의 프로세스로 실행:

| 컨트롤러 | 역할 |
|---------|------|
| Node Controller | 노드 상태 모니터링, 장애 감지 |
| Replication Controller | 파드 복제본 수 유지 |
| Endpoints Controller | 서비스-파드 엔드포인트 관리 |
| SA & Token Controller | 네임스페이스 생성 시 ServiceAccount 생성 |
| Deployment Controller | 디플로이먼트 롤아웃 관리 |
| Job Controller | Job 오브젝트 완료 추적 |

#### 5. cloud-controller-manager (CCM)

- 클라우드 프로바이더와의 통합 관리
- 노드, 라우트, 로드밸런서 컨트롤러 포함

### Node 컴포넌트

모든 워커 노드에서 실행되는 컴포넌트들입니다.

#### 1. kubelet

- 각 노드에서 실행되는 **에이전트**
- PodSpec에 따라 컨테이너 실행 보장
- API Server에 노드 상태 보고
- Static Pod 관리 (\`/etc/kubernetes/manifests/\`)

\`\`\`bash
# kubelet 상태 확인
systemctl status kubelet

# kubelet 설정 확인
cat /var/lib/kubelet/config.yaml
\`\`\`

#### 2. kube-proxy

- 각 노드에서 네트워크 규칙 관리
- Service의 ClusterIP로 트래픽 라우팅
- iptables 또는 IPVS 모드 지원

\`\`\`bash
# kube-proxy 모드 확인
kubectl get configmap kube-proxy -n kube-system -o yaml | grep mode
\`\`\`

#### 3. Container Runtime

- 컨테이너 실행을 담당하는 소프트웨어
- CRI(Container Runtime Interface) 준수 필요
- containerd, CRI-O 등 지원 (Docker는 1.24부터 제거)

### Static Pod vs 일반 Pod

| 특성 | Static Pod | 일반 Pod |
|------|-----------|---------|
| 관리 주체 | kubelet | API Server |
| 정의 위치 | 노드 파일시스템 | etcd |
| 미러 파드 | API Server에 자동 생성 | 해당 없음 |
| Control Plane 컴포넌트 | 대부분 Static Pod | - |

\`\`\`bash
# Static Pod 경로 확인
cat /var/lib/kubelet/config.yaml | grep staticPodPath
# 기본값: /etc/kubernetes/manifests/
\`\`\``,

      en: `## Cluster Components

### Control Plane Components

The Control Plane acts as the **brain** of the cluster, managing the overall cluster state.

#### 1. kube-apiserver

- **Entry point** for all cluster operations
- Communicates with all components via RESTful API
- Performs Authentication, Authorization, and Admission Control
- Only component that directly communicates with etcd

\`\`\`bash
# Check API Server process
ps aux | grep kube-apiserver

# Check API Server pod (kubeadm cluster)
kubectl get pods -n kube-system | grep apiserver
\`\`\`

#### 2. etcd

- Distributed key-value store
- Stores all cluster state data
- Uses Raft consensus algorithm
- Default ports: **2379** (client), **2380** (peer)

#### 3. kube-scheduler

- **Places** newly created pods on appropriate nodes
- Considers resource requirements, affinity/anti-affinity, taints/tolerations
- Scheduling process: Filtering → Scoring

#### 4. kube-controller-manager

Runs major controllers in a single process:

| Controller | Role |
|-----------|------|
| Node Controller | Monitor node status, detect failures |
| Replication Controller | Maintain pod replica count |
| Endpoints Controller | Manage service-pod endpoints |
| SA & Token Controller | Create ServiceAccounts on namespace creation |
| Deployment Controller | Manage deployment rollouts |
| Job Controller | Track Job object completion |

#### 5. cloud-controller-manager (CCM)

- Manages integration with cloud providers
- Includes node, route, and load balancer controllers

### Node Components

Components running on every worker node.

#### 1. kubelet

- **Agent** running on each node
- Ensures containers run according to PodSpec
- Reports node status to API Server
- Manages Static Pods (\`/etc/kubernetes/manifests/\`)

\`\`\`bash
# Check kubelet status
systemctl status kubelet

# Check kubelet configuration
cat /var/lib/kubelet/config.yaml
\`\`\`

#### 2. kube-proxy

- Manages network rules on each node
- Routes traffic to Service ClusterIPs
- Supports iptables or IPVS mode

\`\`\`bash
# Check kube-proxy mode
kubectl get configmap kube-proxy -n kube-system -o yaml | grep mode
\`\`\`

#### 3. Container Runtime

- Software responsible for running containers
- Must comply with CRI (Container Runtime Interface)
- Supports containerd, CRI-O (Docker removed since 1.24)

### Static Pod vs Regular Pod

| Property | Static Pod | Regular Pod |
|----------|-----------|-------------|
| Managed by | kubelet | API Server |
| Definition location | Node filesystem | etcd |
| Mirror pod | Auto-created in API Server | N/A |
| Control Plane components | Mostly Static Pods | - |

\`\`\`bash
# Check Static Pod path
cat /var/lib/kubelet/config.yaml | grep staticPodPath
# Default: /etc/kubernetes/manifests/
\`\`\``,
    },
  },

  // ─── Section 3: API Server & etcd ─────────────────────────────────────────────
  {
    id: 'api-server-etcd',
    title: { ko: 'API Server와 etcd', en: 'API Server & etcd' },
    level: 'cluster-architecture',
    content: {
      ko: `## API Server와 etcd

### kube-apiserver 상세

API Server는 Kubernetes 클러스터의 **중앙 관리 허브**입니다. 모든 컴포넌트는 API Server를 통해서만 클러스터 상태에 접근합니다.

#### API Server 주요 설정

\`\`\`bash
# API Server 매니페스트 확인
cat /etc/kubernetes/manifests/kube-apiserver.yaml
\`\`\`

\`\`\`yaml
# 주요 설정 플래그
spec:
  containers:
  - command:
    - kube-apiserver
    - --advertise-address=10.0.0.1
    - --etcd-servers=https://127.0.0.1:2379
    - --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt
    - --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt
    - --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key
    - --service-cluster-ip-range=10.96.0.0/12
    - --authorization-mode=Node,RBAC
    - --enable-admission-plugins=NodeRestriction
\`\`\`

#### API 그룹과 버전

| API 그룹 | 리소스 예시 | 경로 |
|---------|-----------|------|
| core (v1) | Pod, Service, Node | /api/v1 |
| apps/v1 | Deployment, StatefulSet | /apis/apps/v1 |
| batch/v1 | Job, CronJob | /apis/batch/v1 |
| networking.k8s.io/v1 | NetworkPolicy, Ingress | /apis/networking.k8s.io/v1 |
| rbac.authorization.k8s.io/v1 | Role, ClusterRole | /apis/rbac.authorization.k8s.io/v1 |

\`\`\`bash
# 사용 가능한 API 리소스 확인
kubectl api-resources

# API 버전 확인
kubectl api-versions

# 직접 API 호출
kubectl get --raw /api/v1/namespaces/default/pods
\`\`\`

### etcd 상세

etcd는 Kubernetes 클러스터의 **단일 진실 공급원(Single Source of Truth)**입니다.

#### etcd의 핵심 특성

- **일관성**: Raft 합의 알고리즘으로 분산 환경에서도 일관성 보장
- **고가용성**: 홀수 개 노드 클러스터 구성 권장 (3, 5, 7)
- **성능**: 읽기/쓰기 수만 ops/sec 처리
- **감시(Watch)**: 키 변경 이벤트를 실시간으로 통지

#### etcd 클러스터 확인

\`\`\`bash
# etcd 멤버 목록 확인
ETCDCTL_API=3 etcdctl member list \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# etcd 클러스터 헬스 체크
ETCDCTL_API=3 etcdctl endpoint health \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key
\`\`\`

### 핵심 포인트

- API Server의 인증 → 인가 → 어드미션 컨트롤 흐름 이해
- etcd가 유일한 데이터 저장소임을 기억
- \`ETCDCTL_API=3\`을 항상 설정
- etcd 인증서 경로를 확인하는 방법 숙지
- API Server 매니페스트 위치: \`/etc/kubernetes/manifests/kube-apiserver.yaml\``,

      en: `## API Server & etcd

### kube-apiserver in Detail

The API Server is the **central management hub** of the Kubernetes cluster. All components access cluster state only through the API Server.

#### Key API Server Configuration

\`\`\`bash
# Check API Server manifest
cat /etc/kubernetes/manifests/kube-apiserver.yaml
\`\`\`

\`\`\`yaml
# Key configuration flags
spec:
  containers:
  - command:
    - kube-apiserver
    - --advertise-address=10.0.0.1
    - --etcd-servers=https://127.0.0.1:2379
    - --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt
    - --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt
    - --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key
    - --service-cluster-ip-range=10.96.0.0/12
    - --authorization-mode=Node,RBAC
    - --enable-admission-plugins=NodeRestriction
\`\`\`

#### API Groups and Versions

| API Group | Resource Examples | Path |
|-----------|------------------|------|
| core (v1) | Pod, Service, Node | /api/v1 |
| apps/v1 | Deployment, StatefulSet | /apis/apps/v1 |
| batch/v1 | Job, CronJob | /apis/batch/v1 |
| networking.k8s.io/v1 | NetworkPolicy, Ingress | /apis/networking.k8s.io/v1 |
| rbac.authorization.k8s.io/v1 | Role, ClusterRole | /apis/rbac.authorization.k8s.io/v1 |

\`\`\`bash
# List available API resources
kubectl api-resources

# List API versions
kubectl api-versions

# Direct API call
kubectl get --raw /api/v1/namespaces/default/pods
\`\`\`

### etcd in Detail

etcd is the **Single Source of Truth** for the Kubernetes cluster.

#### Key Characteristics of etcd

- **Consistency**: Raft consensus algorithm ensures consistency in distributed environments
- **High Availability**: Odd-number node clusters recommended (3, 5, 7)
- **Performance**: Handles tens of thousands of read/write ops/sec
- **Watch**: Real-time notification of key change events

#### Checking etcd Cluster

\`\`\`bash
# List etcd members
ETCDCTL_API=3 etcdctl member list \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# etcd cluster health check
ETCDCTL_API=3 etcdctl endpoint health \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key
\`\`\`

### Key Points

- Understand the Authentication → Authorization → Admission Control flow
- Remember that etcd is the only data store
- Always set \`ETCDCTL_API=3\`
- Know how to find etcd certificate paths
- API Server manifest location: \`/etc/kubernetes/manifests/kube-apiserver.yaml\``,
    },
  },

  // ─── Section 4: kubeadm Cluster Installation ──────────────────────────────────
  {
    id: 'kubeadm-install',
    title: { ko: 'kubeadm 클러스터 설치', en: 'kubeadm Cluster Installation' },
    level: 'cluster-architecture',
    content: {
      ko: `## kubeadm 클러스터 설치

### 사전 요구사항

kubeadm으로 클러스터를 설치하기 전에 모든 노드에서 다음을 확인해야 합니다:

| 요구사항 | 최소 사양 |
|---------|----------|
| OS | Ubuntu 20.04+, CentOS 7+ |
| CPU | 2 코어 이상 (컨트롤 플레인) |
| 메모리 | 2GB 이상 |
| 스왑 | 비활성화 필수 |
| 네트워크 | 노드 간 통신 가능 |
| 포트 | 6443, 2379-2380, 10250-10252 |

### 1단계: 사전 설정 (모든 노드)

\`\`\`bash
# 스왑 비활성화
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab

# 필요한 커널 모듈 로드
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# 네트워크 설정
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

sudo sysctl --system
\`\`\`

### 2단계: 컨테이너 런타임 설치 (모든 노드)

\`\`\`bash
# containerd 설치
sudo apt-get update
sudo apt-get install -y containerd

# containerd 기본 설정 생성
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml

# SystemdCgroup 활성화 (중요!)
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' \\
  /etc/containerd/config.toml

sudo systemctl restart containerd
sudo systemctl enable containerd
\`\`\`

### 3단계: kubeadm, kubelet, kubectl 설치 (모든 노드)

\`\`\`bash
# Kubernetes 패키지 저장소 추가
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gpg

curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | \\
  sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] \\
  https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | \\
  sudo tee /etc/apt/sources.list.d/kubernetes.list

# 패키지 설치
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
\`\`\`

### 4단계: 컨트롤 플레인 초기화

\`\`\`bash
# 컨트롤 플레인 초기화
sudo kubeadm init \\
  --pod-network-cidr=10.244.0.0/16 \\
  --apiserver-advertise-address=<CONTROL_PLANE_IP>

# kubeconfig 설정
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
\`\`\`

### 5단계: CNI 네트워크 플러그인 설치

\`\`\`bash
# Calico 설치
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml

# 또는 Flannel 설치
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
\`\`\`

### 6단계: 워커 노드 조인

\`\`\`bash
# 컨트롤 플레인에서 토큰 확인
kubeadm token list

# 새 토큰 생성 및 조인 명령어 출력
kubeadm token create --print-join-command

# 워커 노드에서 실행
sudo kubeadm join <CONTROL_PLANE_IP>:6443 \\
  --token <TOKEN> \\
  --discovery-token-ca-cert-hash sha256:<HASH>
\`\`\`

### 설치 확인

\`\`\`bash
# 노드 상태 확인
kubectl get nodes

# 시스템 파드 확인
kubectl get pods -n kube-system

# 컴포넌트 상태 확인
kubectl cluster-info
\`\`\`

### 핵심 포인트

- \`kubeadm init\`과 \`kubeadm join\` 명령어 숙지
- \`--pod-network-cidr\` 플래그의 역할 이해
- 토큰 만료 시 \`kubeadm token create --print-join-command\` 사용
- CNI 플러그인 없이는 노드가 NotReady 상태
- 스왑 비활성화가 필수임을 기억`,

      en: `## kubeadm Cluster Installation

### Prerequisites

Before installing a cluster with kubeadm, verify the following on all nodes:

| Requirement | Minimum Spec |
|------------|-------------|
| OS | Ubuntu 20.04+, CentOS 7+ |
| CPU | 2+ cores (control plane) |
| Memory | 2GB+ |
| Swap | Must be disabled |
| Network | Nodes must be able to communicate |
| Ports | 6443, 2379-2380, 10250-10252 |

### Step 1: Pre-configuration (All Nodes)

\`\`\`bash
# Disable swap
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab

# Load required kernel modules
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# Network settings
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

sudo sysctl --system
\`\`\`

### Step 2: Install Container Runtime (All Nodes)

\`\`\`bash
# Install containerd
sudo apt-get update
sudo apt-get install -y containerd

# Generate default containerd config
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml

# Enable SystemdCgroup (Important!)
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' \\
  /etc/containerd/config.toml

sudo systemctl restart containerd
sudo systemctl enable containerd
\`\`\`

### Step 3: Install kubeadm, kubelet, kubectl (All Nodes)

\`\`\`bash
# Add Kubernetes package repository
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gpg

curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | \\
  sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] \\
  https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /' | \\
  sudo tee /etc/apt/sources.list.d/kubernetes.list

# Install packages
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
\`\`\`

### Step 4: Initialize Control Plane

\`\`\`bash
# Initialize control plane
sudo kubeadm init \\
  --pod-network-cidr=10.244.0.0/16 \\
  --apiserver-advertise-address=<CONTROL_PLANE_IP>

# Set up kubeconfig
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
\`\`\`

### Step 5: Install CNI Network Plugin

\`\`\`bash
# Install Calico
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml

# Or install Flannel
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
\`\`\`

### Step 6: Join Worker Nodes

\`\`\`bash
# Check tokens on control plane
kubeadm token list

# Generate new token and print join command
kubeadm token create --print-join-command

# Run on worker node
sudo kubeadm join <CONTROL_PLANE_IP>:6443 \\
  --token <TOKEN> \\
  --discovery-token-ca-cert-hash sha256:<HASH>
\`\`\`

### Verify Installation

\`\`\`bash
# Check node status
kubectl get nodes

# Check system pods
kubectl get pods -n kube-system

# Check component status
kubectl cluster-info
\`\`\`

### Key Points

- Master \`kubeadm init\` and \`kubeadm join\` commands
- Understand the role of \`--pod-network-cidr\` flag
- Use \`kubeadm token create --print-join-command\` for expired tokens
- Nodes stay NotReady without a CNI plugin
- Remember that disabling swap is mandatory`,
    },
  },

  // ─── Section 5: kubeconfig & Contexts ─────────────────────────────────────────
  {
    id: 'kubeconfig-contexts',
    title: { ko: 'kubeconfig와 컨텍스트', en: 'kubeconfig & Contexts' },
    level: 'cluster-architecture',
    content: {
      ko: `## kubeconfig와 컨텍스트

### kubeconfig 파일이란?

kubeconfig 파일은 클러스터, 사용자, 네임스페이스, 인증 메커니즘에 대한 정보를 담고 있는 설정 파일입니다.

- 기본 위치: \`$HOME/.kube/config\`
- 환경 변수: \`KUBECONFIG\`로 경로 지정 가능
- 플래그: \`--kubeconfig\`로 명시적 지정

### kubeconfig 구조

\`\`\`yaml
apiVersion: v1
kind: Config
current-context: my-context

clusters:
- name: production-cluster
  cluster:
    server: https://10.0.0.1:6443
    certificate-authority-data: <BASE64_CA_CERT>
    # 또는 certificate-authority: /path/to/ca.crt

- name: development-cluster
  cluster:
    server: https://10.0.1.1:6443
    certificate-authority-data: <BASE64_CA_CERT>

users:
- name: admin-user
  user:
    client-certificate-data: <BASE64_CLIENT_CERT>
    client-key-data: <BASE64_CLIENT_KEY>

- name: dev-user
  user:
    token: <BEARER_TOKEN>

contexts:
- name: my-context
  context:
    cluster: production-cluster
    user: admin-user
    namespace: default

- name: dev-context
  context:
    cluster: development-cluster
    user: dev-user
    namespace: development
\`\`\`

### 3가지 핵심 요소

| 요소 | 설명 | 포함 정보 |
|------|------|----------|
| **clusters** | 접속할 클러스터 정보 | API Server URL, CA 인증서 |
| **users** | 인증 정보 | 클라이언트 인증서, 토큰, 키 |
| **contexts** | 클러스터 + 사용자 + 네임스페이스 조합 | 어떤 클러스터에 어떤 사용자로 접속할지 |

### kubectl config 명령어

\`\`\`bash
# 현재 kubeconfig 확인
kubectl config view

# 민감 정보 포함하여 확인
kubectl config view --raw

# 현재 컨텍스트 확인
kubectl config current-context

# 컨텍스트 목록 확인
kubectl config get-contexts

# 컨텍스트 전환
kubectl config use-context dev-context

# 새 컨텍스트 생성
kubectl config set-context my-new-context \\
  --cluster=production-cluster \\
  --user=admin-user \\
  --namespace=kube-system

# 현재 컨텍스트의 네임스페이스 변경
kubectl config set-context --current --namespace=my-namespace

# 클러스터 정보 추가
kubectl config set-cluster new-cluster \\
  --server=https://10.0.2.1:6443 \\
  --certificate-authority=/path/to/ca.crt

# 사용자 정보 추가
kubectl config set-credentials new-user \\
  --client-certificate=/path/to/cert.crt \\
  --client-key=/path/to/key.key
\`\`\`

### 여러 kubeconfig 병합

\`\`\`bash
# 여러 kubeconfig 파일 병합
export KUBECONFIG=~/.kube/config:~/.kube/cluster2-config

# 병합된 결과를 단일 파일로 저장
kubectl config view --flatten > ~/.kube/merged-config

# 단일 파일로 설정
export KUBECONFIG=~/.kube/merged-config
\`\`\`

### 인증 방식

| 방식 | 설정 필드 | 용도 |
|------|---------|------|
| X.509 인증서 | client-certificate, client-key | 관리자, 컴포넌트 인증 |
| Bearer 토큰 | token | ServiceAccount, OIDC |
| Basic Auth | username, password | 비권장 (deprecated) |
| Exec 플러그인 | exec | 클라우드 프로바이더 인증 |

### 핵심 포인트

- 시험에서 여러 클러스터 간 전환이 필요
- \`kubectl config use-context\` 명령어 필수 숙지
- kubeconfig 파일의 3가지 섹션 (clusters, users, contexts) 이해
- \`--kubeconfig\` 플래그와 \`KUBECONFIG\` 환경변수 차이 이해

\`\`\`bash
# 실무에서 자주 사용하는 패턴
# 1. 컨텍스트 확인
kubectl config get-contexts

# 2. 지정된 컨텍스트로 전환
kubectl config use-context k8s-cluster1

# 3. 네임스페이스 설정
kubectl config set-context --current --namespace=target-ns
\`\`\``,

      en: `## kubeconfig & Contexts

### What is a kubeconfig File?

A kubeconfig file is a configuration file containing information about clusters, users, namespaces, and authentication mechanisms.

- Default location: \`$HOME/.kube/config\`
- Environment variable: Set path with \`KUBECONFIG\`
- Flag: Explicitly specify with \`--kubeconfig\`

### kubeconfig Structure

\`\`\`yaml
apiVersion: v1
kind: Config
current-context: my-context

clusters:
- name: production-cluster
  cluster:
    server: https://10.0.0.1:6443
    certificate-authority-data: <BASE64_CA_CERT>
    # or certificate-authority: /path/to/ca.crt

- name: development-cluster
  cluster:
    server: https://10.0.1.1:6443
    certificate-authority-data: <BASE64_CA_CERT>

users:
- name: admin-user
  user:
    client-certificate-data: <BASE64_CLIENT_CERT>
    client-key-data: <BASE64_CLIENT_KEY>

- name: dev-user
  user:
    token: <BEARER_TOKEN>

contexts:
- name: my-context
  context:
    cluster: production-cluster
    user: admin-user
    namespace: default

- name: dev-context
  context:
    cluster: development-cluster
    user: dev-user
    namespace: development
\`\`\`

### Three Core Elements

| Element | Description | Contains |
|---------|------------|----------|
| **clusters** | Cluster connection info | API Server URL, CA certificate |
| **users** | Authentication info | Client certificates, tokens, keys |
| **contexts** | Cluster + User + Namespace combination | Which cluster to connect with which user |

### kubectl config Commands

\`\`\`bash
# View current kubeconfig
kubectl config view

# View with sensitive data
kubectl config view --raw

# Check current context
kubectl config current-context

# List contexts
kubectl config get-contexts

# Switch context
kubectl config use-context dev-context

# Create new context
kubectl config set-context my-new-context \\
  --cluster=production-cluster \\
  --user=admin-user \\
  --namespace=kube-system

# Change namespace of current context
kubectl config set-context --current --namespace=my-namespace

# Add cluster info
kubectl config set-cluster new-cluster \\
  --server=https://10.0.2.1:6443 \\
  --certificate-authority=/path/to/ca.crt

# Add user credentials
kubectl config set-credentials new-user \\
  --client-certificate=/path/to/cert.crt \\
  --client-key=/path/to/key.key
\`\`\`

### Merging Multiple kubeconfigs

\`\`\`bash
# Merge multiple kubeconfig files
export KUBECONFIG=~/.kube/config:~/.kube/cluster2-config

# Save merged result to single file
kubectl config view --flatten > ~/.kube/merged-config

# Set single file
export KUBECONFIG=~/.kube/merged-config
\`\`\`

### Authentication Methods

| Method | Config Field | Use Case |
|--------|-------------|----------|
| X.509 Certificate | client-certificate, client-key | Admin, component auth |
| Bearer Token | token | ServiceAccount, OIDC |
| Basic Auth | username, password | Deprecated |
| Exec Plugin | exec | Cloud provider auth |

### Key Points

- Exam requires switching between multiple clusters
- \`kubectl config use-context\` is essential
- Understand the 3 sections of kubeconfig (clusters, users, contexts)
- Understand the difference between \`--kubeconfig\` flag and \`KUBECONFIG\` env variable

\`\`\`bash
# Common practical pattern
# 1. Check contexts
kubectl config get-contexts

# 2. Switch to specified context
kubectl config use-context k8s-cluster1

# 3. Set namespace
kubectl config set-context --current --namespace=target-ns
\`\`\``,
    },
  },

  // ─── Section 6: RBAC Authorization ────────────────────────────────────────────
  {
    id: 'rbac',
    title: { ko: 'RBAC 인가', en: 'RBAC Authorization' },
    level: 'cluster-architecture',
    content: {
      ko: `## RBAC 인가

### RBAC란?

RBAC(Role-Based Access Control)는 Kubernetes에서 **역할 기반으로 API 접근을 제어**하는 인가 방식입니다.

### 4가지 RBAC 리소스

| 리소스 | 범위 | 설명 |
|-------|------|------|
| **Role** | 네임스페이스 | 특정 네임스페이스 내 권한 정의 |
| **ClusterRole** | 클러스터 전체 | 클러스터 범위 권한 정의 |
| **RoleBinding** | 네임스페이스 | Role/ClusterRole을 사용자에게 바인딩 |
| **ClusterRoleBinding** | 클러스터 전체 | ClusterRole을 사용자에게 클러스터 범위로 바인딩 |

### Role 예시

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]        # "" = core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
- apiGroups: [""]
  resources: ["pods/log"]
  verbs: ["get"]
\`\`\`

### ClusterRole 예시

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-reader
rules:
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["get", "watch", "list"]
- apiGroups: [""]
  resources: ["persistentvolumes"]
  verbs: ["get", "list"]
\`\`\`

### RoleBinding 예시

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: jane
  apiGroup: rbac.authorization.k8s.io
- kind: ServiceAccount
  name: my-sa
  namespace: default
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
\`\`\`

### ClusterRoleBinding 예시

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: read-nodes-global
subjects:
- kind: Group
  name: developers
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: node-reader
  apiGroup: rbac.authorization.k8s.io
\`\`\`

### ServiceAccount

\`\`\`yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
  namespace: default
\`\`\`

\`\`\`bash
# ServiceAccount 생성
kubectl create serviceaccount my-sa -n default

# ServiceAccount에 Role 바인딩
kubectl create rolebinding my-sa-binding \\
  --role=pod-reader \\
  --serviceaccount=default:my-sa \\
  -n default
\`\`\`

### 사용 가능한 Verbs

| Verb | 설명 | HTTP 메서드 |
|------|------|-----------|
| get | 단일 리소스 조회 | GET |
| list | 리소스 목록 조회 | GET |
| watch | 변경 감시 | GET (watch) |
| create | 리소스 생성 | POST |
| update | 리소스 전체 업데이트 | PUT |
| patch | 리소스 부분 업데이트 | PATCH |
| delete | 리소스 삭제 | DELETE |
| deletecollection | 리소스 일괄 삭제 | DELETE |

### kubectl 명령어

\`\`\`bash
# Role 생성 (명령형)
kubectl create role pod-manager \\
  --verb=get,list,watch,create,delete \\
  --resource=pods \\
  -n default

# ClusterRole 생성
kubectl create clusterrole node-viewer \\
  --verb=get,list,watch \\
  --resource=nodes

# 권한 확인
kubectl auth can-i create pods --as jane -n default
kubectl auth can-i get nodes --as system:serviceaccount:default:my-sa

# 모든 권한 확인
kubectl auth can-i --list --as jane -n default
\`\`\`

### 핵심 포인트

- Role vs ClusterRole, RoleBinding vs ClusterRoleBinding 차이 명확히 이해
- \`kubectl auth can-i\` 명령어로 권한 테스트
- ServiceAccount와 RBAC 연결 방법 숙지
- subjects의 kind 유형: User, Group, ServiceAccount
- ClusterRole을 RoleBinding으로 바인딩하면 네임스페이스 범위로 제한됨`,

      en: `## RBAC Authorization

### What is RBAC?

RBAC (Role-Based Access Control) is an authorization method in Kubernetes that **controls API access based on roles**.

### Four RBAC Resources

| Resource | Scope | Description |
|----------|-------|-------------|
| **Role** | Namespace | Defines permissions within a specific namespace |
| **ClusterRole** | Cluster-wide | Defines cluster-wide permissions |
| **RoleBinding** | Namespace | Binds Role/ClusterRole to users |
| **ClusterRoleBinding** | Cluster-wide | Binds ClusterRole to users cluster-wide |

### Role Example

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]        # "" = core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
- apiGroups: [""]
  resources: ["pods/log"]
  verbs: ["get"]
\`\`\`

### ClusterRole Example

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-reader
rules:
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["get", "watch", "list"]
- apiGroups: [""]
  resources: ["persistentvolumes"]
  verbs: ["get", "list"]
\`\`\`

### RoleBinding Example

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: jane
  apiGroup: rbac.authorization.k8s.io
- kind: ServiceAccount
  name: my-sa
  namespace: default
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
\`\`\`

### ClusterRoleBinding Example

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: read-nodes-global
subjects:
- kind: Group
  name: developers
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: node-reader
  apiGroup: rbac.authorization.k8s.io
\`\`\`

### ServiceAccount

\`\`\`yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: my-service-account
  namespace: default
\`\`\`

\`\`\`bash
# Create ServiceAccount
kubectl create serviceaccount my-sa -n default

# Bind Role to ServiceAccount
kubectl create rolebinding my-sa-binding \\
  --role=pod-reader \\
  --serviceaccount=default:my-sa \\
  -n default
\`\`\`

### Available Verbs

| Verb | Description | HTTP Method |
|------|------------|-------------|
| get | Read a single resource | GET |
| list | List resources | GET |
| watch | Watch for changes | GET (watch) |
| create | Create a resource | POST |
| update | Full resource update | PUT |
| patch | Partial resource update | PATCH |
| delete | Delete a resource | DELETE |
| deletecollection | Bulk delete resources | DELETE |

### kubectl Commands

\`\`\`bash
# Create Role (imperative)
kubectl create role pod-manager \\
  --verb=get,list,watch,create,delete \\
  --resource=pods \\
  -n default

# Create ClusterRole
kubectl create clusterrole node-viewer \\
  --verb=get,list,watch \\
  --resource=nodes

# Check permissions
kubectl auth can-i create pods --as jane -n default
kubectl auth can-i get nodes --as system:serviceaccount:default:my-sa

# List all permissions
kubectl auth can-i --list --as jane -n default
\`\`\`

### Key Points

- Clearly understand Role vs ClusterRole, RoleBinding vs ClusterRoleBinding
- Test permissions with \`kubectl auth can-i\`
- Know how to connect ServiceAccount with RBAC
- Subject kinds: User, Group, ServiceAccount
- Binding a ClusterRole with RoleBinding limits it to namespace scope`,
    },
  },

  // ─── Section 7: Cluster Upgrade ───────────────────────────────────────────────
  {
    id: 'cluster-upgrade',
    title: { ko: '클러스터 업그레이드', en: 'Cluster Upgrade' },
    level: 'cluster-architecture',
    content: {
      ko: `## 클러스터 업그레이드

### 버전 스큐 정책 (Version Skew Policy)

Kubernetes 컴포넌트 간에는 허용되는 버전 차이가 있습니다:

| 컴포넌트 | kube-apiserver 대비 | 예시 (API Server 1.30) |
|---------|-------------------|-----------------------|
| kube-apiserver | 기준 | 1.30 |
| kube-controller-manager | -1 | 1.29 ~ 1.30 |
| kube-scheduler | -1 | 1.29 ~ 1.30 |
| kubelet | -2 | 1.28 ~ 1.30 |
| kube-proxy | -2 | 1.28 ~ 1.30 |
| kubectl | +1/-1 | 1.29 ~ 1.31 |

**핵심 규칙**: 한 번에 하나의 마이너 버전만 업그레이드 (예: 1.29 → 1.30)

### 컨트롤 플레인 업그레이드

\`\`\`bash
# 1. 업그레이드 가능 버전 확인
sudo apt-get update
apt-cache madison kubeadm

# 2. kubeadm 업그레이드
sudo apt-mark unhold kubeadm
sudo apt-get update && sudo apt-get install -y kubeadm=1.30.0-1.1
sudo apt-mark hold kubeadm

# 3. 업그레이드 계획 확인
sudo kubeadm upgrade plan

# 4. 업그레이드 적용
sudo kubeadm upgrade apply v1.30.0

# 5. kubelet, kubectl 업그레이드
sudo apt-mark unhold kubelet kubectl
sudo apt-get update && sudo apt-get install -y \\
  kubelet=1.30.0-1.1 kubectl=1.30.0-1.1
sudo apt-mark hold kubelet kubectl

# 6. kubelet 재시작
sudo systemctl daemon-reload
sudo systemctl restart kubelet
\`\`\`

### 워커 노드 업그레이드

\`\`\`bash
# === 컨트롤 플레인에서 실행 ===
# 1. 워커 노드 drain (파드 안전하게 이동)
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# === 워커 노드에서 실행 ===
# 2. kubeadm 업그레이드
sudo apt-mark unhold kubeadm
sudo apt-get update && sudo apt-get install -y kubeadm=1.30.0-1.1
sudo apt-mark hold kubeadm

# 3. 노드 설정 업그레이드
sudo kubeadm upgrade node

# 4. kubelet, kubectl 업그레이드
sudo apt-mark unhold kubelet kubectl
sudo apt-get update && sudo apt-get install -y \\
  kubelet=1.30.0-1.1 kubectl=1.30.0-1.1
sudo apt-mark hold kubelet kubectl

# 5. kubelet 재시작
sudo systemctl daemon-reload
sudo systemctl restart kubelet

# === 컨트롤 플레인에서 실행 ===
# 6. 노드 uncordon (스케줄링 재개)
kubectl uncordon <node-name>
\`\`\`

### drain vs cordon

| 명령어 | 동작 | 기존 파드 |
|-------|------|----------|
| \`kubectl cordon\` | 새 파드 스케줄링 방지 | 유지 |
| \`kubectl drain\` | cordon + 기존 파드 제거 | 다른 노드로 이동 |
| \`kubectl uncordon\` | 스케줄링 재개 | 해당 없음 |

\`\`\`bash
# drain 시 주요 옵션
kubectl drain <node> \\
  --ignore-daemonsets \\         # DaemonSet 파드 무시
  --delete-emptydir-data \\      # emptyDir 데이터 삭제 허용
  --force \\                      # ReplicaSet 없는 파드도 강제 제거
  --grace-period=60              # 종료 대기 시간
\`\`\`

### 업그레이드 확인

\`\`\`bash
# 노드 버전 확인
kubectl get nodes

# 컴포넌트 버전 확인
kubectl version --short

# kubelet 버전 확인
kubelet --version
\`\`\`

### 핵심 포인트

- 업그레이드 순서: 컨트롤 플레인 먼저, 워커 노드 나중에
- \`kubeadm upgrade apply\`는 첫 컨트롤 플레인에서만, 나머지는 \`kubeadm upgrade node\`
- drain 시 \`--ignore-daemonsets\` 옵션 필수
- 버전 스큐 정책 이해 필수
- 한 번에 하나의 마이너 버전만 업그레이드 가능`,

      en: `## Cluster Upgrade

### Version Skew Policy

There are allowed version differences between Kubernetes components:

| Component | Relative to kube-apiserver | Example (API Server 1.30) |
|-----------|---------------------------|---------------------------|
| kube-apiserver | Baseline | 1.30 |
| kube-controller-manager | -1 | 1.29 ~ 1.30 |
| kube-scheduler | -1 | 1.29 ~ 1.30 |
| kubelet | -2 | 1.28 ~ 1.30 |
| kube-proxy | -2 | 1.28 ~ 1.30 |
| kubectl | +1/-1 | 1.29 ~ 1.31 |

**Key rule**: Upgrade only one minor version at a time (e.g., 1.29 → 1.30)

### Control Plane Upgrade

\`\`\`bash
# 1. Check available versions
sudo apt-get update
apt-cache madison kubeadm

# 2. Upgrade kubeadm
sudo apt-mark unhold kubeadm
sudo apt-get update && sudo apt-get install -y kubeadm=1.30.0-1.1
sudo apt-mark hold kubeadm

# 3. Check upgrade plan
sudo kubeadm upgrade plan

# 4. Apply upgrade
sudo kubeadm upgrade apply v1.30.0

# 5. Upgrade kubelet, kubectl
sudo apt-mark unhold kubelet kubectl
sudo apt-get update && sudo apt-get install -y \\
  kubelet=1.30.0-1.1 kubectl=1.30.0-1.1
sudo apt-mark hold kubelet kubectl

# 6. Restart kubelet
sudo systemctl daemon-reload
sudo systemctl restart kubelet
\`\`\`

### Worker Node Upgrade

\`\`\`bash
# === Run on Control Plane ===
# 1. Drain worker node (safely move pods)
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# === Run on Worker Node ===
# 2. Upgrade kubeadm
sudo apt-mark unhold kubeadm
sudo apt-get update && sudo apt-get install -y kubeadm=1.30.0-1.1
sudo apt-mark hold kubeadm

# 3. Upgrade node configuration
sudo kubeadm upgrade node

# 4. Upgrade kubelet, kubectl
sudo apt-mark unhold kubelet kubectl
sudo apt-get update && sudo apt-get install -y \\
  kubelet=1.30.0-1.1 kubectl=1.30.0-1.1
sudo apt-mark hold kubelet kubectl

# 5. Restart kubelet
sudo systemctl daemon-reload
sudo systemctl restart kubelet

# === Run on Control Plane ===
# 6. Uncordon node (resume scheduling)
kubectl uncordon <node-name>
\`\`\`

### drain vs cordon

| Command | Action | Existing Pods |
|---------|--------|--------------|
| \`kubectl cordon\` | Prevent new pod scheduling | Kept |
| \`kubectl drain\` | cordon + evict existing pods | Moved to other nodes |
| \`kubectl uncordon\` | Resume scheduling | N/A |

\`\`\`bash
# Key drain options
kubectl drain <node> \\
  --ignore-daemonsets \\         # Ignore DaemonSet pods
  --delete-emptydir-data \\      # Allow emptyDir data deletion
  --force \\                      # Force evict pods without ReplicaSet
  --grace-period=60              # Termination wait time
\`\`\`

### Verify Upgrade

\`\`\`bash
# Check node versions
kubectl get nodes

# Check component versions
kubectl version --short

# Check kubelet version
kubelet --version
\`\`\`

### Key Points

- Upgrade order: Control plane first, worker nodes after
- \`kubeadm upgrade apply\` only on first control plane; \`kubeadm upgrade node\` for the rest
- \`--ignore-daemonsets\` flag is essential when draining
- Understanding version skew policy is mandatory
- Only one minor version upgrade at a time`,
    },
  },

  // ─── Section 8: etcd Backup & Restore ─────────────────────────────────────────
  {
    id: 'etcd-backup-restore',
    title: { ko: 'etcd 백업과 복원', en: 'etcd Backup & Restore' },
    level: 'cluster-architecture',
    content: {
      ko: `## etcd 백업과 복원

### etcd 백업의 중요성

etcd는 Kubernetes 클러스터의 **모든 상태 데이터**를 저장합니다. etcd 데이터 손실은 클러스터 전체 손실을 의미하므로 정기적인 백업이 필수입니다.

### etcd 인증 정보 확인

\`\`\`bash
# etcd 파드 매니페스트에서 인증서 경로 확인
cat /etc/kubernetes/manifests/etcd.yaml
\`\`\`

\`\`\`yaml
# 주요 인증서 경로
spec:
  containers:
  - command:
    - etcd
    - --cert-file=/etc/kubernetes/pki/etcd/server.crt
    - --key-file=/etc/kubernetes/pki/etcd/server.key
    - --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
    - --peer-cert-file=/etc/kubernetes/pki/etcd/peer.crt
    - --peer-key-file=/etc/kubernetes/pki/etcd/peer.key
    - --peer-trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
    - --listen-client-urls=https://127.0.0.1:2379,https://10.0.0.1:2379
    - --data-dir=/var/lib/etcd
\`\`\`

### etcd 스냅샷 백업

\`\`\`bash
# 환경변수 설정 (API 버전 3 필수)
export ETCDCTL_API=3

# 스냅샷 백업
etcdctl snapshot save /opt/etcd-backup/snapshot.db \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# 스냅샷 상태 확인
etcdctl snapshot status /opt/etcd-backup/snapshot.db \\
  --write-out=table
\`\`\`

스냅샷 상태 출력 예시:

| HASH | REVISION | TOTAL KEYS | TOTAL SIZE |
|------|----------|------------|------------|
| 3e7a... | 15234 | 1042 | 4.1 MB |

### etcd 스냅샷 복원

\`\`\`bash
# 1. etcd 프로세스 중지 (Static Pod인 경우 매니페스트 이동)
mv /etc/kubernetes/manifests/etcd.yaml /tmp/etcd.yaml

# 2. 기존 데이터 백업
mv /var/lib/etcd /var/lib/etcd.bak

# 3. 스냅샷에서 복원
ETCDCTL_API=3 etcdctl snapshot restore /opt/etcd-backup/snapshot.db \\
  --data-dir=/var/lib/etcd \\
  --name=master \\
  --initial-cluster=master=https://127.0.0.1:2380 \\
  --initial-advertise-peer-urls=https://127.0.0.1:2380 \\
  --initial-cluster-token=etcd-cluster-1

# 4. 데이터 디렉토리 소유권 확인
chown -R etcd:etcd /var/lib/etcd

# 5. etcd 매니페스트 복원
mv /tmp/etcd.yaml /etc/kubernetes/manifests/etcd.yaml

# 6. etcd 재시작 확인
kubectl get pods -n kube-system | grep etcd
\`\`\`

### 간편 백업/복원 (기본 설정)

시험에서 가장 많이 사용하는 간편 버전:

\`\`\`bash
# 백업
ETCDCTL_API=3 etcdctl snapshot save /tmp/etcd-snapshot.db \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# 복원 (새 데이터 디렉토리에)
ETCDCTL_API=3 etcdctl snapshot restore /tmp/etcd-snapshot.db \\
  --data-dir=/var/lib/etcd-restored
\`\`\`

복원 후 etcd가 새 경로를 사용하도록 매니페스트 수정:

\`\`\`yaml
# /etc/kubernetes/manifests/etcd.yaml 수정
volumes:
- hostPath:
    path: /var/lib/etcd-restored   # 기존: /var/lib/etcd
    type: DirectoryOrCreate
  name: etcd-data
\`\`\`

### 자동 백업 스크립트

\`\`\`bash
#!/bin/bash
# etcd-backup.sh
BACKUP_DIR="/opt/etcd-backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

ETCDCTL_API=3 etcdctl snapshot save \\
  "\${BACKUP_DIR}/snapshot_\${TIMESTAMP}.db" \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# 7일 이상 된 백업 삭제
find \${BACKUP_DIR} -name "snapshot_*.db" -mtime +7 -delete
\`\`\`

### 핵심 포인트

- \`ETCDCTL_API=3\` 설정 필수 (기본값이 아닐 수 있음)
- 인증서 경로는 etcd 매니페스트에서 확인: \`/etc/kubernetes/manifests/etcd.yaml\`
- \`snapshot save\`와 \`snapshot restore\` 명령어 숙지
- 복원 시 \`--data-dir\`로 새 디렉토리 지정하는 것이 안전
- 복원 후 etcd 매니페스트의 데이터 디렉토리 경로 수정 확인`,

      en: `## etcd Backup & Restore

### Importance of etcd Backup

etcd stores **all state data** of the Kubernetes cluster. Losing etcd data means losing the entire cluster, making regular backups essential.

### Finding etcd Credentials

\`\`\`bash
# Check certificate paths from etcd pod manifest
cat /etc/kubernetes/manifests/etcd.yaml
\`\`\`

\`\`\`yaml
# Key certificate paths
spec:
  containers:
  - command:
    - etcd
    - --cert-file=/etc/kubernetes/pki/etcd/server.crt
    - --key-file=/etc/kubernetes/pki/etcd/server.key
    - --trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
    - --peer-cert-file=/etc/kubernetes/pki/etcd/peer.crt
    - --peer-key-file=/etc/kubernetes/pki/etcd/peer.key
    - --peer-trusted-ca-file=/etc/kubernetes/pki/etcd/ca.crt
    - --listen-client-urls=https://127.0.0.1:2379,https://10.0.0.1:2379
    - --data-dir=/var/lib/etcd
\`\`\`

### etcd Snapshot Backup

\`\`\`bash
# Set environment variable (API version 3 required)
export ETCDCTL_API=3

# Take snapshot backup
etcdctl snapshot save /opt/etcd-backup/snapshot.db \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# Check snapshot status
etcdctl snapshot status /opt/etcd-backup/snapshot.db \\
  --write-out=table
\`\`\`

Example snapshot status output:

| HASH | REVISION | TOTAL KEYS | TOTAL SIZE |
|------|----------|------------|------------|
| 3e7a... | 15234 | 1042 | 4.1 MB |

### etcd Snapshot Restore

\`\`\`bash
# 1. Stop etcd process (move manifest if Static Pod)
mv /etc/kubernetes/manifests/etcd.yaml /tmp/etcd.yaml

# 2. Backup existing data
mv /var/lib/etcd /var/lib/etcd.bak

# 3. Restore from snapshot
ETCDCTL_API=3 etcdctl snapshot restore /opt/etcd-backup/snapshot.db \\
  --data-dir=/var/lib/etcd \\
  --name=master \\
  --initial-cluster=master=https://127.0.0.1:2380 \\
  --initial-advertise-peer-urls=https://127.0.0.1:2380 \\
  --initial-cluster-token=etcd-cluster-1

# 4. Verify data directory ownership
chown -R etcd:etcd /var/lib/etcd

# 5. Restore etcd manifest
mv /tmp/etcd.yaml /etc/kubernetes/manifests/etcd.yaml

# 6. Verify etcd restart
kubectl get pods -n kube-system | grep etcd
\`\`\`

### Simple Backup/Restore (Default Settings)

Most commonly used simplified version in the exam:

\`\`\`bash
# Backup
ETCDCTL_API=3 etcdctl snapshot save /tmp/etcd-snapshot.db \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# Restore (to new data directory)
ETCDCTL_API=3 etcdctl snapshot restore /tmp/etcd-snapshot.db \\
  --data-dir=/var/lib/etcd-restored
\`\`\`

After restore, modify the manifest so etcd uses the new path:

\`\`\`yaml
# Edit /etc/kubernetes/manifests/etcd.yaml
volumes:
- hostPath:
    path: /var/lib/etcd-restored   # was: /var/lib/etcd
    type: DirectoryOrCreate
  name: etcd-data
\`\`\`

### Automated Backup Script

\`\`\`bash
#!/bin/bash
# etcd-backup.sh
BACKUP_DIR="/opt/etcd-backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

ETCDCTL_API=3 etcdctl snapshot save \\
  "\${BACKUP_DIR}/snapshot_\${TIMESTAMP}.db" \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# Delete backups older than 7 days
find \${BACKUP_DIR} -name "snapshot_*.db" -mtime +7 -delete
\`\`\`

### Key Points

- Setting \`ETCDCTL_API=3\` is mandatory (may not be default)
- Find certificate paths from etcd manifest: \`/etc/kubernetes/manifests/etcd.yaml\`
- Master \`snapshot save\` and \`snapshot restore\` commands
- Specifying a new directory with \`--data-dir\` during restore is safer
- After restore, verify the data directory path in the etcd manifest`,
    },
  },

  // ─── Section 9: Certificates & TLS ────────────────────────────────────────────
  {
    id: 'certificates-tls',
    title: { ko: '인증서와 TLS', en: 'Certificates & TLS' },
    level: 'cluster-architecture',
    content: {
      ko: `## 인증서와 TLS

### Kubernetes PKI 개요

Kubernetes는 컴포넌트 간 통신을 **TLS로 암호화**하며, PKI(Public Key Infrastructure)를 사용합니다.

\`\`\`
                    Root CA
                   /       \\
          etcd CA           K8s CA
         /     \\           /    |    \\
   etcd       etcd     API    kubelet  front
   server     peer     Server          proxy
\`\`\`

### 주요 인증서 목록

| 인증서 | 경로 | 용도 |
|-------|------|------|
| CA 인증서 | /etc/kubernetes/pki/ca.crt | 클러스터 루트 CA |
| CA 키 | /etc/kubernetes/pki/ca.key | CA 서명용 키 |
| API Server 인증서 | /etc/kubernetes/pki/apiserver.crt | API Server TLS |
| API Server 키 | /etc/kubernetes/pki/apiserver.key | API Server TLS 키 |
| API Server → etcd | /etc/kubernetes/pki/apiserver-etcd-client.crt | etcd 접근용 |
| API Server → kubelet | /etc/kubernetes/pki/apiserver-kubelet-client.crt | kubelet 접근용 |
| etcd CA | /etc/kubernetes/pki/etcd/ca.crt | etcd 전용 CA |
| etcd Server 인증서 | /etc/kubernetes/pki/etcd/server.crt | etcd 서버 TLS |
| Front Proxy CA | /etc/kubernetes/pki/front-proxy-ca.crt | 프록시 인증 CA |

### 인증서 확인 명령어

\`\`\`bash
# 인증서 내용 확인
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -text -noout

# 인증서 만료일 확인
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -enddate

# 인증서 발급자 확인
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -issuer

# 인증서 Subject 확인
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -subject

# SAN(Subject Alternative Names) 확인
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -ext subjectAltName
\`\`\`

### kubeadm 인증서 관리

\`\`\`bash
# 모든 인증서 만료일 확인
kubeadm certs check-expiration

# 인증서 갱신 (전체)
kubeadm certs renew all

# 특정 인증서만 갱신
kubeadm certs renew apiserver
kubeadm certs renew apiserver-etcd-client
kubeadm certs renew apiserver-kubelet-client

# 갱신 후 컨트롤 플레인 재시작
# (Static Pod이므로 kubelet이 자동 감지하여 재시작)
\`\`\`

### CSR (Certificate Signing Request) 승인

새로운 사용자 인증서 생성 과정:

\`\`\`bash
# 1. 개인 키 생성
openssl genrsa -out jane.key 2048

# 2. CSR 생성
openssl req -new -key jane.key -out jane.csr -subj "/CN=jane/O=developers"

# 3. Kubernetes CSR 오브젝트 생성
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: jane-csr
spec:
  request: $(cat jane.csr | base64 | tr -d '\\n')
  signerName: kubernetes.io/kube-apiserver-client
  usages:
  - client auth
EOF

# 4. CSR 승인
kubectl certificate approve jane-csr

# 5. 인증서 추출
kubectl get csr jane-csr -o jsonpath='{.status.certificate}' | \\
  base64 --decode > jane.crt
\`\`\`

### CSR 관리 명령어

\`\`\`bash
# CSR 목록 확인
kubectl get csr

# CSR 상세 확인
kubectl describe csr jane-csr

# CSR 승인
kubectl certificate approve jane-csr

# CSR 거부
kubectl certificate deny jane-csr

# CSR 삭제
kubectl delete csr jane-csr
\`\`\`

### kubeconfig에 사용자 추가

\`\`\`bash
# 사용자 자격증명 추가
kubectl config set-credentials jane \\
  --client-certificate=jane.crt \\
  --client-key=jane.key

# 컨텍스트 생성
kubectl config set-context jane-context \\
  --cluster=kubernetes \\
  --user=jane \\
  --namespace=default

# 컨텍스트 전환
kubectl config use-context jane-context
\`\`\`

### 핵심 포인트

- 인증서 위치: \`/etc/kubernetes/pki/\` 디렉토리
- \`openssl x509\` 명령어로 인증서 확인 방법 숙지
- \`kubeadm certs check-expiration\`으로 만료일 확인
- CSR 생성 → 승인 → 인증서 추출 과정 숙지
- \`signerName: kubernetes.io/kube-apiserver-client\` 기억
- CSR 요청의 \`request\` 필드는 base64 인코딩 필수`,

      en: `## Certificates & TLS

### Kubernetes PKI Overview

Kubernetes **encrypts communication between components with TLS** and uses PKI (Public Key Infrastructure).

\`\`\`
                    Root CA
                   /       \\
          etcd CA           K8s CA
         /     \\           /    |    \\
   etcd       etcd     API    kubelet  front
   server     peer     Server          proxy
\`\`\`

### Key Certificate List

| Certificate | Path | Purpose |
|------------|------|---------|
| CA Cert | /etc/kubernetes/pki/ca.crt | Cluster root CA |
| CA Key | /etc/kubernetes/pki/ca.key | CA signing key |
| API Server Cert | /etc/kubernetes/pki/apiserver.crt | API Server TLS |
| API Server Key | /etc/kubernetes/pki/apiserver.key | API Server TLS key |
| API Server → etcd | /etc/kubernetes/pki/apiserver-etcd-client.crt | etcd access |
| API Server → kubelet | /etc/kubernetes/pki/apiserver-kubelet-client.crt | kubelet access |
| etcd CA | /etc/kubernetes/pki/etcd/ca.crt | etcd dedicated CA |
| etcd Server Cert | /etc/kubernetes/pki/etcd/server.crt | etcd server TLS |
| Front Proxy CA | /etc/kubernetes/pki/front-proxy-ca.crt | Proxy auth CA |

### Certificate Inspection Commands

\`\`\`bash
# View certificate details
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -text -noout

# Check certificate expiration
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -enddate

# Check certificate issuer
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -issuer

# Check certificate subject
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -subject

# Check SAN (Subject Alternative Names)
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -ext subjectAltName
\`\`\`

### kubeadm Certificate Management

\`\`\`bash
# Check all certificate expirations
kubeadm certs check-expiration

# Renew all certificates
kubeadm certs renew all

# Renew specific certificates
kubeadm certs renew apiserver
kubeadm certs renew apiserver-etcd-client
kubeadm certs renew apiserver-kubelet-client

# After renewal, control plane restarts automatically
# (kubelet detects changes in Static Pod manifests)
\`\`\`

### CSR (Certificate Signing Request) Approval

Process for creating new user certificates:

\`\`\`bash
# 1. Generate private key
openssl genrsa -out jane.key 2048

# 2. Create CSR
openssl req -new -key jane.key -out jane.csr -subj "/CN=jane/O=developers"

# 3. Create Kubernetes CSR object
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: jane-csr
spec:
  request: $(cat jane.csr | base64 | tr -d '\\n')
  signerName: kubernetes.io/kube-apiserver-client
  usages:
  - client auth
EOF

# 4. Approve CSR
kubectl certificate approve jane-csr

# 5. Extract certificate
kubectl get csr jane-csr -o jsonpath='{.status.certificate}' | \\
  base64 --decode > jane.crt
\`\`\`

### CSR Management Commands

\`\`\`bash
# List CSRs
kubectl get csr

# Describe CSR
kubectl describe csr jane-csr

# Approve CSR
kubectl certificate approve jane-csr

# Deny CSR
kubectl certificate deny jane-csr

# Delete CSR
kubectl delete csr jane-csr
\`\`\`

### Adding User to kubeconfig

\`\`\`bash
# Add user credentials
kubectl config set-credentials jane \\
  --client-certificate=jane.crt \\
  --client-key=jane.key

# Create context
kubectl config set-context jane-context \\
  --cluster=kubernetes \\
  --user=jane \\
  --namespace=default

# Switch context
kubectl config use-context jane-context
\`\`\`

### Key Points

- Certificate location: \`/etc/kubernetes/pki/\` directory
- Know how to inspect certificates with \`openssl x509\`
- Check expiration with \`kubeadm certs check-expiration\`
- Master the CSR creation → approval → certificate extraction flow
- Remember \`signerName: kubernetes.io/kube-apiserver-client\`
- The \`request\` field in CSR must be base64 encoded`,
    },
  },
];
