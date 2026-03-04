import type { K8sDocSection } from './index';

export const ch6Sections: K8sDocSection[] = [
  {
    id: 'k3s-introduction',
    title: { ko: 'k3s 소개', en: 'Introduction to k3s' },
    level: 'hands-on',
    content: {
      ko: `## k3s 소개

k3s는 **Rancher Labs(현 SUSE)**에서 만든 경량 Kubernetes 배포판입니다. 단일 바이너리(~70MB)로 제공되며, IoT, Edge, CI/CD, 학습 환경에 최적화되어 있습니다.

### k3s vs 표준 Kubernetes

| 항목 | k3s | 표준 K8s |
|------|-----|----------|
| 바이너리 크기 | ~70MB | ~300MB+ |
| 기본 데이터스토어 | SQLite | etcd |
| 설치 시간 | ~30초 | ~10분+ |
| 최소 RAM | 512MB | 2GB+ |
| Ingress 컨트롤러 | Traefik 내장 | 별도 설치 |
| 스토리지 | local-path-provisioner 내장 | 별도 설치 |
| 컨테이너 런타임 | containerd | containerd/CRI-O |
| API 호환성 | 완전 호환 | 기준 |

### 경량 K8s 도구 비교

| 도구 | 용도 | 멀티노드 | 프로덕션 | 리소스 |
|------|------|----------|----------|--------|
| **k3s** | 학습/Edge/프로덕션 | O | O | 매우 낮음 |
| **minikube** | 로컬 개발 | X | X | 보통 |
| **kind** | CI/CD 테스트 | O (컨테이너) | X | 보통 |
| **microk8s** | 개발/IoT | O | O | 낮음 |

### k3s 아키텍처

- **k3s server**: Control Plane + Kubelet 모두 실행 (단일 노드에서는 이것만으로 충분)
- **k3s agent**: Kubelet만 실행 (워커 노드용)

### 학습에 적합한 이유

- **저사양**: 512MB RAM, 1 CPU로 실행 가능
- **빠른 설치**: 한 줄 명령어로 30초 내 설치
- **완전한 K8s API**: kubectl, Helm 등 모든 도구 그대로 사용
- **내장 컴포넌트**: Traefik, CoreDNS, local-path-provisioner 기본 제공
- **쉬운 정리**: 단일 스크립트로 완전 삭제

> k3s에서 학습한 내용은 표준 Kubernetes 환경에서도 그대로 적용됩니다. API 호환성이 완벽하기 때문에 kubectl 명령어와 YAML 매니페스트가 동일하게 동작합니다.`,
      en: `## Introduction to k3s

k3s is a lightweight Kubernetes distribution created by **Rancher Labs (now SUSE)**. Delivered as a single binary (~70MB), it's optimized for IoT, Edge, CI/CD, and learning environments.

### k3s vs Standard Kubernetes

| Feature | k3s | Standard K8s |
|---------|-----|--------------|
| Binary size | ~70MB | ~300MB+ |
| Default datastore | SQLite | etcd |
| Install time | ~30 seconds | ~10 minutes+ |
| Minimum RAM | 512MB | 2GB+ |
| Ingress controller | Traefik built-in | Install separately |
| Storage | local-path-provisioner built-in | Install separately |
| Container runtime | containerd | containerd/CRI-O |
| API compatibility | Fully compatible | Reference |

### Lightweight K8s Tool Comparison

| Tool | Use Case | Multi-node | Production | Resources |
|------|----------|------------|------------|-----------|
| **k3s** | Learning/Edge/Prod | Yes | Yes | Very low |
| **minikube** | Local development | No | No | Medium |
| **kind** | CI/CD testing | Yes (containers) | No | Medium |
| **microk8s** | Dev/IoT | Yes | Yes | Low |

### k3s Architecture

- **k3s server**: Runs both Control Plane + Kubelet (sufficient for a single node)
- **k3s agent**: Runs Kubelet only (for worker nodes)

### Why k3s is Great for Learning

- **Low resources**: Runs with 512MB RAM, 1 CPU
- **Fast install**: One-line command, ready in 30 seconds
- **Full K8s API**: All tools like kubectl, Helm work identically
- **Built-in components**: Traefik, CoreDNS, local-path-provisioner included
- **Easy cleanup**: Single script for complete removal

> Everything you learn on k3s applies directly to standard Kubernetes environments. The API is fully compatible, so kubectl commands and YAML manifests work identically.`,
    },
  },
  {
    id: 'k3s-installation',
    title: { ko: 'k3s 설치', en: 'k3s Installation' },
    level: 'hands-on',
    content: {
      ko: `## k3s 설치

### 시스템 요구사항

| 항목 | 최소 사양 | 권장 사양 |
|------|-----------|-----------|
| OS | Linux (x86_64, ARM64) | Ubuntu 20.04+ / Debian 11+ |
| RAM (Server) | 512MB | 1GB+ |
| RAM (Agent) | 256MB | 512MB+ |
| CPU | 1 core | 2 cores+ |
| 디스크 | 200MB | 1GB+ |

### 단일 노드 설치

\`\`\`bash
# k3s 설치 (한 줄이면 충분!)
curl -sfL https://get.k3s.io | sh -

# 설치 확인
sudo k3s kubectl get nodes

# 모든 시스템 Pod 확인
sudo k3s kubectl get pods -A
\`\`\`

기대 출력:
\`\`\`text
NAME          STATUS   ROLES                  AGE   VERSION
my-hostname   Ready    control-plane,master   30s   v1.31.x+k3s1
\`\`\`

### kubeconfig 설정

\`\`\`bash
# 방법 1: 환경변수 설정
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

# 방법 2: ~/.kube/config로 복사 (권장)
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER:$USER ~/.kube/config
chmod 600 ~/.kube/config

# 이제 sudo 없이 kubectl 사용 가능
kubectl get nodes
\`\`\`

### 멀티 노드 설정

**Server 노드에서 토큰 확인:**
\`\`\`bash
sudo cat /var/lib/rancher/k3s/server/node-token
\`\`\`

**Agent(Worker) 노드 추가:**
\`\`\`bash
curl -sfL https://get.k3s.io | K3S_URL=https://<server-ip>:6443 K3S_TOKEN=<token> sh -
\`\`\`

### 설치 옵션

\`\`\`bash
# Traefik 없이 설치
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable traefik" sh -

# kubeconfig 권한 변경 (sudo 없이 접근)
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--write-kubeconfig-mode 644" sh -

# 특정 버전 설치
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION="v1.31.0+k3s1" sh -

# 여러 옵션 조합
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable traefik --write-kubeconfig-mode 644" sh -
\`\`\`

### k3s 삭제

\`\`\`bash
# Server 노드 삭제
/usr/local/bin/k3s-uninstall.sh

# Agent 노드 삭제
/usr/local/bin/k3s-agent-uninstall.sh
\`\`\`

> 삭제 스크립트는 k3s 관련 모든 데이터(컨테이너, 네트워크, 볼륨)를 정리합니다. 학습 후 깔끔하게 정리할 수 있으므로 부담 없이 설치해보세요.`,
      en: `## k3s Installation

### System Requirements

| Item | Minimum | Recommended |
|------|---------|-------------|
| OS | Linux (x86_64, ARM64) | Ubuntu 20.04+ / Debian 11+ |
| RAM (Server) | 512MB | 1GB+ |
| RAM (Agent) | 256MB | 512MB+ |
| CPU | 1 core | 2 cores+ |
| Disk | 200MB | 1GB+ |

### Single Node Installation

\`\`\`bash
# Install k3s (one line is all you need!)
curl -sfL https://get.k3s.io | sh -

# Verify installation
sudo k3s kubectl get nodes

# Check all system pods
sudo k3s kubectl get pods -A
\`\`\`

Expected output:
\`\`\`text
NAME          STATUS   ROLES                  AGE   VERSION
my-hostname   Ready    control-plane,master   30s   v1.31.x+k3s1
\`\`\`

### kubeconfig Setup

\`\`\`bash
# Method 1: Set environment variable
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

# Method 2: Copy to ~/.kube/config (recommended)
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER:$USER ~/.kube/config
chmod 600 ~/.kube/config

# Now you can use kubectl without sudo
kubectl get nodes
\`\`\`

### Multi-Node Setup

**Get token from server node:**
\`\`\`bash
sudo cat /var/lib/rancher/k3s/server/node-token
\`\`\`

**Add agent (worker) node:**
\`\`\`bash
curl -sfL https://get.k3s.io | K3S_URL=https://<server-ip>:6443 K3S_TOKEN=<token> sh -
\`\`\`

### Installation Options

\`\`\`bash
# Install without Traefik
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable traefik" sh -

# Change kubeconfig permissions (access without sudo)
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--write-kubeconfig-mode 644" sh -

# Install specific version
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION="v1.31.0+k3s1" sh -

# Combine multiple options
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--disable traefik --write-kubeconfig-mode 644" sh -
\`\`\`

### Uninstalling k3s

\`\`\`bash
# Uninstall server node
/usr/local/bin/k3s-uninstall.sh

# Uninstall agent node
/usr/local/bin/k3s-agent-uninstall.sh
\`\`\`

> The uninstall script cleans up all k3s-related data (containers, networks, volumes). Feel free to install and experiment — cleanup is straightforward.`,
    },
  },
  {
    id: 'k3s-basic-operations',
    title: { ko: 'k3s 기본 운영', en: 'k3s Basic Operations' },
    level: 'hands-on',
    content: {
      ko: `## k3s 기본 운영

### systemd 서비스 관리

\`\`\`bash
# k3s 서비스 상태 확인
sudo systemctl status k3s

# k3s 재시작
sudo systemctl restart k3s

# k3s 중지/시작
sudo systemctl stop k3s
sudo systemctl start k3s

# 부팅 시 자동 시작 (기본 활성화)
sudo systemctl enable k3s
\`\`\`

### kubectl 사용법

\`\`\`bash
# k3s 내장 kubectl
sudo k3s kubectl get nodes

# 일반 kubectl 사용 (kubeconfig 설정 후)
kubectl get nodes

# 편리한 alias 설정
echo 'alias k="kubectl"' >> ~/.bashrc
source ~/.bashrc
k get nodes

# bash 자동완성 설정
echo 'source <(kubectl completion bash)' >> ~/.bashrc
echo 'complete -o default -F __start_kubectl k' >> ~/.bashrc
source ~/.bashrc
\`\`\`

### 클러스터 상태 확인

\`\`\`bash
# 클러스터 정보
kubectl cluster-info

# 노드 상세 정보
kubectl get nodes -o wide

# 모든 네임스페이스의 Pod 확인
kubectl get pods -A

# 시스템 컴포넌트 확인
kubectl get pods -n kube-system
\`\`\`

### k3s 내장 컴포넌트

| 컴포넌트 | 역할 | 네임스페이스 |
|----------|------|-------------|
| **CoreDNS** | 클러스터 내부 DNS | kube-system |
| **Traefik** | Ingress 컨트롤러 | kube-system |
| **local-path-provisioner** | 동적 스토리지 프로비저닝 | kube-system |
| **Metrics Server** | 리소스 사용량 수집 | kube-system |
| **ServiceLB** | LoadBalancer 서비스 지원 | kube-system |

### 로그 확인

\`\`\`bash
# k3s 서비스 로그 (실시간)
sudo journalctl -u k3s -f

# 최근 100줄
sudo journalctl -u k3s --no-pager -n 100

# 특정 시간 이후 로그
sudo journalctl -u k3s --since "10 minutes ago"
\`\`\`

### 설정 파일

\`\`\`yaml
# /etc/rancher/k3s/config.yaml
write-kubeconfig-mode: "0644"
disable:
  - traefik
tls-san:
  - "my-server.example.com"
\`\`\`

> config.yaml 파일은 k3s 서비스 시작 시 자동으로 로드됩니다. 변경 후 \`sudo systemctl restart k3s\`로 적용하세요.`,
      en: `## k3s Basic Operations

### systemd Service Management

\`\`\`bash
# Check k3s service status
sudo systemctl status k3s

# Restart k3s
sudo systemctl restart k3s

# Stop/Start k3s
sudo systemctl stop k3s
sudo systemctl start k3s

# Enable auto-start on boot (enabled by default)
sudo systemctl enable k3s
\`\`\`

### Using kubectl

\`\`\`bash
# Built-in k3s kubectl
sudo k3s kubectl get nodes

# Regular kubectl (after kubeconfig setup)
kubectl get nodes

# Convenient alias
echo 'alias k="kubectl"' >> ~/.bashrc
source ~/.bashrc
k get nodes

# Bash auto-completion
echo 'source <(kubectl completion bash)' >> ~/.bashrc
echo 'complete -o default -F __start_kubectl k' >> ~/.bashrc
source ~/.bashrc
\`\`\`

### Checking Cluster Status

\`\`\`bash
# Cluster info
kubectl cluster-info

# Detailed node info
kubectl get nodes -o wide

# All pods across namespaces
kubectl get pods -A

# System component pods
kubectl get pods -n kube-system
\`\`\`

### k3s Built-in Components

| Component | Role | Namespace |
|-----------|------|-----------|
| **CoreDNS** | Internal cluster DNS | kube-system |
| **Traefik** | Ingress controller | kube-system |
| **local-path-provisioner** | Dynamic storage provisioning | kube-system |
| **Metrics Server** | Resource usage metrics | kube-system |
| **ServiceLB** | LoadBalancer service support | kube-system |

### Checking Logs

\`\`\`bash
# k3s service logs (real-time)
sudo journalctl -u k3s -f

# Last 100 lines
sudo journalctl -u k3s --no-pager -n 100

# Logs since a specific time
sudo journalctl -u k3s --since "10 minutes ago"
\`\`\`

### Configuration File

\`\`\`yaml
# /etc/rancher/k3s/config.yaml
write-kubeconfig-mode: "0644"
disable:
  - traefik
tls-san:
  - "my-server.example.com"
\`\`\`

> The config.yaml file is automatically loaded when the k3s service starts. After changes, apply with \`sudo systemctl restart k3s\`.`,
    },
  },
  {
    id: 'k3s-lab-cluster-arch',
    title: { ko: '실습: 클러스터 아키텍처', en: 'Lab: Cluster Architecture' },
    level: 'hands-on',
    content: {
      ko: `## 실습: 클러스터 아키텍처

### 실습 1: 시스템 컴포넌트 확인

\`\`\`bash
# kube-system 네임스페이스의 Pod 확인
kubectl get pods -n kube-system

# 각 컴포넌트 상세 정보
kubectl describe pod -n kube-system -l app=local-path-provisioner
\`\`\`

기대 출력:
\`\`\`text
NAME                                      READY   STATUS    RESTARTS   AGE
coredns-xxx                               1/1     Running   0          5m
local-path-provisioner-xxx                1/1     Running   0          5m
metrics-server-xxx                        1/1     Running   0          5m
svclb-traefik-xxx                         2/2     Running   0          5m
traefik-xxx                               1/1     Running   0          5m
\`\`\`

### 실습 2: k3s 데이터스토어 확인

\`\`\`bash
# SQLite 데이터베이스 파일 확인
sudo ls -la /var/lib/rancher/k3s/server/db/

# 데이터베이스 크기 확인
sudo du -sh /var/lib/rancher/k3s/server/db/

# k3s 데이터 디렉토리 구조
sudo ls /var/lib/rancher/k3s/server/
\`\`\`

### 실습 3: API 리소스 탐색

\`\`\`bash
# 사용 가능한 API 리소스 목록
kubectl api-resources | head -20

# API 버전 확인
kubectl api-versions

# 특정 리소스 정보
kubectl explain pod.spec.containers
kubectl explain deployment.spec.strategy
\`\`\`

### 실습 4: RBAC 설정

**ServiceAccount 생성:**
\`\`\`bash
kubectl create namespace rbac-test
kubectl create serviceaccount dev-user -n rbac-test
\`\`\`

**Role 생성 (YAML):**
\`\`\`yaml
# role.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: rbac-test
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
\`\`\`

**RoleBinding 생성:**
\`\`\`yaml
# rolebinding.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: rbac-test
subjects:
- kind: ServiceAccount
  name: dev-user
  namespace: rbac-test
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
\`\`\`

\`\`\`bash
kubectl apply -f role.yaml
kubectl apply -f rolebinding.yaml

# 권한 테스트
kubectl auth can-i get pods -n rbac-test --as system:serviceaccount:rbac-test:dev-user
# 출력: yes

kubectl auth can-i delete pods -n rbac-test --as system:serviceaccount:rbac-test:dev-user
# 출력: no
\`\`\`

### 실습 5: 인증서 확인

\`\`\`bash
# k3s TLS 인증서 디렉토리
sudo ls /var/lib/rancher/k3s/server/tls/

# 서버 인증서 정보 확인
sudo openssl x509 -in /var/lib/rancher/k3s/server/tls/server-ca.crt -text -noout | head -20

# 인증서 만료일 확인
sudo openssl x509 -in /var/lib/rancher/k3s/server/tls/server-ca.crt -enddate -noout
\`\`\`

> 정리: \`kubectl delete namespace rbac-test\` 로 실습 리소스를 삭제할 수 있습니다.`,
      en: `## Lab: Cluster Architecture

### Exercise 1: Inspect System Components

\`\`\`bash
# Check pods in kube-system namespace
kubectl get pods -n kube-system

# Detailed info for each component
kubectl describe pod -n kube-system -l app=local-path-provisioner
\`\`\`

Expected output:
\`\`\`text
NAME                                      READY   STATUS    RESTARTS   AGE
coredns-xxx                               1/1     Running   0          5m
local-path-provisioner-xxx                1/1     Running   0          5m
metrics-server-xxx                        1/1     Running   0          5m
svclb-traefik-xxx                         2/2     Running   0          5m
traefik-xxx                               1/1     Running   0          5m
\`\`\`

### Exercise 2: Inspect k3s Datastore

\`\`\`bash
# Check SQLite database file
sudo ls -la /var/lib/rancher/k3s/server/db/

# Check database size
sudo du -sh /var/lib/rancher/k3s/server/db/

# k3s data directory structure
sudo ls /var/lib/rancher/k3s/server/
\`\`\`

### Exercise 3: Explore API Resources

\`\`\`bash
# List available API resources
kubectl api-resources | head -20

# Check API versions
kubectl api-versions

# Get info about specific resources
kubectl explain pod.spec.containers
kubectl explain deployment.spec.strategy
\`\`\`

### Exercise 4: RBAC Configuration

**Create ServiceAccount:**
\`\`\`bash
kubectl create namespace rbac-test
kubectl create serviceaccount dev-user -n rbac-test
\`\`\`

**Create Role (YAML):**
\`\`\`yaml
# role.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: rbac-test
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
\`\`\`

**Create RoleBinding:**
\`\`\`yaml
# rolebinding.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: rbac-test
subjects:
- kind: ServiceAccount
  name: dev-user
  namespace: rbac-test
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
\`\`\`

\`\`\`bash
kubectl apply -f role.yaml
kubectl apply -f rolebinding.yaml

# Test permissions
kubectl auth can-i get pods -n rbac-test --as system:serviceaccount:rbac-test:dev-user
# Output: yes

kubectl auth can-i delete pods -n rbac-test --as system:serviceaccount:rbac-test:dev-user
# Output: no
\`\`\`

### Exercise 5: Inspect Certificates

\`\`\`bash
# k3s TLS certificate directory
sudo ls /var/lib/rancher/k3s/server/tls/

# View server certificate info
sudo openssl x509 -in /var/lib/rancher/k3s/server/tls/server-ca.crt -text -noout | head -20

# Check certificate expiry
sudo openssl x509 -in /var/lib/rancher/k3s/server/tls/server-ca.crt -enddate -noout
\`\`\`

> Cleanup: Run \`kubectl delete namespace rbac-test\` to remove lab resources.`,
    },
  },
  {
    id: 'k3s-lab-workloads',
    title: { ko: '실습: 워크로드 & 스케줄링', en: 'Lab: Workloads & Scheduling' },
    level: 'hands-on',
    content: {
      ko: `## 실습: 워크로드 & 스케줄링

### 실습 1: Pod 생성

**명령형(Imperative):**
\`\`\`bash
# Pod 생성
kubectl run nginx --image=nginx:alpine --port=80

# Pod 상태 확인
kubectl get pods -o wide

# Pod 로그 확인
kubectl logs nginx

# Pod 내부 접속
kubectl exec -it nginx -- /bin/sh

# Pod 삭제
kubectl delete pod nginx
\`\`\`

**선언형(Declarative) YAML:**
\`\`\`yaml
# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:alpine
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "100m"
      limits:
        memory: "128Mi"
        cpu: "200m"
\`\`\`

\`\`\`bash
kubectl apply -f pod.yaml
kubectl get pod nginx-pod
kubectl describe pod nginx-pod
\`\`\`

### 실습 2: Deployment 생성/스케일/롤백

\`\`\`bash
# Deployment 생성
kubectl create deployment web --image=nginx:1.24 --replicas=3

# 상태 확인
kubectl get deployment web
kubectl get replicaset
kubectl get pods -l app=web

# 스케일 업/다운
kubectl scale deployment web --replicas=5
kubectl get pods -l app=web

# 이미지 업데이트 (Rolling Update)
kubectl set image deployment/web nginx=nginx:1.25

# 롤아웃 상태 확인
kubectl rollout status deployment/web

# 롤아웃 히스토리
kubectl rollout history deployment/web

# 이전 버전으로 롤백
kubectl rollout undo deployment/web

# 정리
kubectl delete deployment web
\`\`\`

### 실습 3: Job / CronJob

**Job:**
\`\`\`yaml
# job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-calc
spec:
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34
        command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(100)"]
      restartPolicy: Never
  backoffLimit: 4
\`\`\`

\`\`\`bash
kubectl apply -f job.yaml
kubectl get jobs --watch
kubectl logs job/pi-calc
\`\`\`

**CronJob:**
\`\`\`yaml
# cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello-cron
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: busybox:1.36
            command: ["echo", "Hello from CronJob!"]
          restartPolicy: OnFailure
\`\`\`

\`\`\`bash
kubectl apply -f cronjob.yaml
kubectl get cronjob
# 1분 후 확인
kubectl get jobs
kubectl get pods
\`\`\`

### 실습 4: ConfigMap / Secret

\`\`\`bash
# ConfigMap 생성
kubectl create configmap app-config \\
  --from-literal=APP_ENV=production \\
  --from-literal=LOG_LEVEL=info

# Secret 생성
kubectl create secret generic db-secret \\
  --from-literal=DB_USER=admin \\
  --from-literal=DB_PASS=secretpass123
\`\`\`

**Pod에서 사용:**
\`\`\`yaml
# config-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: config-demo
spec:
  containers:
  - name: app
    image: busybox:1.36
    command: ["sh", "-c", "echo $APP_ENV $DB_USER && sleep 3600"]
    envFrom:
    - configMapRef:
        name: app-config
    env:
    - name: DB_USER
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: DB_USER
\`\`\`

\`\`\`bash
kubectl apply -f config-pod.yaml
kubectl logs config-demo
# 출력: production admin
\`\`\`

### 실습 5: 리소스 제한

\`\`\`yaml
# resource-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-demo
spec:
  containers:
  - name: app
    image: nginx:alpine
    resources:
      requests:
        memory: "64Mi"
        cpu: "100m"
      limits:
        memory: "128Mi"
        cpu: "200m"
\`\`\`

\`\`\`bash
kubectl apply -f resource-pod.yaml
kubectl top pod resource-demo  # Metrics Server 필요
kubectl describe pod resource-demo | grep -A 5 "Limits"
\`\`\`

> 실습 후 정리: \`kubectl delete pod,job,cronjob,configmap,secret --all\``,
      en: `## Lab: Workloads & Scheduling

### Exercise 1: Create Pods

**Imperative approach:**
\`\`\`bash
# Create a Pod
kubectl run nginx --image=nginx:alpine --port=80

# Check Pod status
kubectl get pods -o wide

# View Pod logs
kubectl logs nginx

# Access Pod shell
kubectl exec -it nginx -- /bin/sh

# Delete Pod
kubectl delete pod nginx
\`\`\`

**Declarative YAML:**
\`\`\`yaml
# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:alpine
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "100m"
      limits:
        memory: "128Mi"
        cpu: "200m"
\`\`\`

\`\`\`bash
kubectl apply -f pod.yaml
kubectl get pod nginx-pod
kubectl describe pod nginx-pod
\`\`\`

### Exercise 2: Deployment Create/Scale/Rollback

\`\`\`bash
# Create Deployment
kubectl create deployment web --image=nginx:1.24 --replicas=3

# Check status
kubectl get deployment web
kubectl get replicaset
kubectl get pods -l app=web

# Scale up/down
kubectl scale deployment web --replicas=5
kubectl get pods -l app=web

# Update image (Rolling Update)
kubectl set image deployment/web nginx=nginx:1.25

# Check rollout status
kubectl rollout status deployment/web

# Rollout history
kubectl rollout history deployment/web

# Rollback to previous version
kubectl rollout undo deployment/web

# Cleanup
kubectl delete deployment web
\`\`\`

### Exercise 3: Job / CronJob

**Job:**
\`\`\`yaml
# job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi-calc
spec:
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34
        command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(100)"]
      restartPolicy: Never
  backoffLimit: 4
\`\`\`

\`\`\`bash
kubectl apply -f job.yaml
kubectl get jobs --watch
kubectl logs job/pi-calc
\`\`\`

**CronJob:**
\`\`\`yaml
# cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello-cron
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: busybox:1.36
            command: ["echo", "Hello from CronJob!"]
          restartPolicy: OnFailure
\`\`\`

\`\`\`bash
kubectl apply -f cronjob.yaml
kubectl get cronjob
# After 1 minute
kubectl get jobs
kubectl get pods
\`\`\`

### Exercise 4: ConfigMap / Secret

\`\`\`bash
# Create ConfigMap
kubectl create configmap app-config \\
  --from-literal=APP_ENV=production \\
  --from-literal=LOG_LEVEL=info

# Create Secret
kubectl create secret generic db-secret \\
  --from-literal=DB_USER=admin \\
  --from-literal=DB_PASS=secretpass123
\`\`\`

**Use in a Pod:**
\`\`\`yaml
# config-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: config-demo
spec:
  containers:
  - name: app
    image: busybox:1.36
    command: ["sh", "-c", "echo $APP_ENV $DB_USER && sleep 3600"]
    envFrom:
    - configMapRef:
        name: app-config
    env:
    - name: DB_USER
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: DB_USER
\`\`\`

\`\`\`bash
kubectl apply -f config-pod.yaml
kubectl logs config-demo
# Output: production admin
\`\`\`

### Exercise 5: Resource Limits

\`\`\`yaml
# resource-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: resource-demo
spec:
  containers:
  - name: app
    image: nginx:alpine
    resources:
      requests:
        memory: "64Mi"
        cpu: "100m"
      limits:
        memory: "128Mi"
        cpu: "200m"
\`\`\`

\`\`\`bash
kubectl apply -f resource-pod.yaml
kubectl top pod resource-demo  # Requires Metrics Server
kubectl describe pod resource-demo | grep -A 5 "Limits"
\`\`\`

> Cleanup: \`kubectl delete pod,job,cronjob,configmap,secret --all\``,
    },
  },
  {
    id: 'k3s-lab-networking',
    title: { ko: '실습: 서비스 & 네트워킹', en: 'Lab: Services & Networking' },
    level: 'hands-on',
    content: {
      ko: `## 실습: 서비스 & 네트워킹

### 실습 1: Service 생성

**앱 배포 후 Service 노출:**
\`\`\`bash
# 테스트 Deployment 생성
kubectl create deployment web --image=nginx:alpine --replicas=2
kubectl expose deployment web --port=80 --target-port=80 --type=ClusterIP

# ClusterIP Service 확인
kubectl get svc web
kubectl describe svc web

# 클러스터 내부에서 접근 테스트
kubectl run curl-test --image=curlimages/curl -it --rm -- curl http://web.default.svc.cluster.local
\`\`\`

**NodePort Service:**
\`\`\`bash
kubectl expose deployment web --name=web-np --port=80 --target-port=80 --type=NodePort

# 할당된 NodePort 확인
kubectl get svc web-np
# 외부에서 접근: http://<node-ip>:<node-port>
\`\`\`

### 실습 2: DNS 확인

\`\`\`bash
# DNS 조회 테스트
kubectl run dns-test --image=busybox:1.36 -it --rm -- nslookup web.default.svc.cluster.local

# 기대 출력:
# Server:    10.43.0.10
# Address:   10.43.0.10:53
# Name:      web.default.svc.cluster.local
# Address:   10.43.x.x

# CoreDNS 상태 확인
kubectl get pods -n kube-system -l k8s-app=kube-dns
kubectl logs -n kube-system -l k8s-app=kube-dns
\`\`\`

### 실습 3: Ingress (Traefik)

k3s에는 Traefik이 기본 설치되어 있습니다.

\`\`\`yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
  - host: web.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web
            port:
              number: 80
\`\`\`

\`\`\`bash
kubectl apply -f ingress.yaml
kubectl get ingress

# 로컬 테스트 (/etc/hosts에 추가하거나 curl -H 사용)
curl -H "Host: web.local" http://localhost
\`\`\`

### 실습 4: NetworkPolicy

\`\`\`bash
# 테스트 네임스페이스 생성
kubectl create namespace netpol-test
kubectl create deployment web --image=nginx:alpine -n netpol-test
kubectl expose deployment web --port=80 -n netpol-test
\`\`\`

**기본 Deny-All 정책:**
\`\`\`yaml
# deny-all.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: netpol-test
spec:
  podSelector: {}
  policyTypes:
  - Ingress
\`\`\`

**특정 트래픽 허용:**
\`\`\`yaml
# allow-web.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-web
  namespace: netpol-test
spec:
  podSelector:
    matchLabels:
      app: web
  ingress:
  - from:
    - podSelector:
        matchLabels:
          access: "true"
    ports:
    - port: 80
\`\`\`

\`\`\`bash
kubectl apply -f deny-all.yaml
kubectl apply -f allow-web.yaml

# 접근 불가 테스트
kubectl run test1 -n netpol-test --image=curlimages/curl -it --rm -- curl --max-time 3 http://web
# 타임아웃

# 라벨 추가 후 접근 가능
kubectl run test2 -n netpol-test --image=curlimages/curl -it --rm --labels="access=true" -- curl http://web
# 성공!
\`\`\`

### Port-Forward로 로컬 테스트

\`\`\`bash
# Pod 직접 포트포워딩
kubectl port-forward pod/nginx-pod 8080:80 &

# Service 포트포워딩
kubectl port-forward svc/web 8080:80 &

# 테스트
curl http://localhost:8080
\`\`\`

> 정리: \`kubectl delete namespace netpol-test && kubectl delete deploy,svc,ingress --all\``,
      en: `## Lab: Services & Networking

### Exercise 1: Create Services

**Deploy an app and expose it:**
\`\`\`bash
# Create test Deployment
kubectl create deployment web --image=nginx:alpine --replicas=2
kubectl expose deployment web --port=80 --target-port=80 --type=ClusterIP

# Check ClusterIP Service
kubectl get svc web
kubectl describe svc web

# Test access from inside the cluster
kubectl run curl-test --image=curlimages/curl -it --rm -- curl http://web.default.svc.cluster.local
\`\`\`

**NodePort Service:**
\`\`\`bash
kubectl expose deployment web --name=web-np --port=80 --target-port=80 --type=NodePort

# Check assigned NodePort
kubectl get svc web-np
# Access from outside: http://<node-ip>:<node-port>
\`\`\`

### Exercise 2: DNS Verification

\`\`\`bash
# DNS lookup test
kubectl run dns-test --image=busybox:1.36 -it --rm -- nslookup web.default.svc.cluster.local

# Expected output:
# Server:    10.43.0.10
# Address:   10.43.0.10:53
# Name:      web.default.svc.cluster.local
# Address:   10.43.x.x

# Check CoreDNS status
kubectl get pods -n kube-system -l k8s-app=kube-dns
kubectl logs -n kube-system -l k8s-app=kube-dns
\`\`\`

### Exercise 3: Ingress (Traefik)

k3s comes with Traefik pre-installed.

\`\`\`yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  rules:
  - host: web.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web
            port:
              number: 80
\`\`\`

\`\`\`bash
kubectl apply -f ingress.yaml
kubectl get ingress

# Local test (add to /etc/hosts or use curl -H)
curl -H "Host: web.local" http://localhost
\`\`\`

### Exercise 4: NetworkPolicy

\`\`\`bash
# Create test namespace
kubectl create namespace netpol-test
kubectl create deployment web --image=nginx:alpine -n netpol-test
kubectl expose deployment web --port=80 -n netpol-test
\`\`\`

**Default Deny-All policy:**
\`\`\`yaml
# deny-all.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: netpol-test
spec:
  podSelector: {}
  policyTypes:
  - Ingress
\`\`\`

**Allow specific traffic:**
\`\`\`yaml
# allow-web.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-web
  namespace: netpol-test
spec:
  podSelector:
    matchLabels:
      app: web
  ingress:
  - from:
    - podSelector:
        matchLabels:
          access: "true"
    ports:
    - port: 80
\`\`\`

\`\`\`bash
kubectl apply -f deny-all.yaml
kubectl apply -f allow-web.yaml

# Test denied access
kubectl run test1 -n netpol-test --image=curlimages/curl -it --rm -- curl --max-time 3 http://web
# Timeout

# Add label and test allowed access
kubectl run test2 -n netpol-test --image=curlimages/curl -it --rm --labels="access=true" -- curl http://web
# Success!
\`\`\`

### Port-Forward for Local Testing

\`\`\`bash
# Direct Pod port-forward
kubectl port-forward pod/nginx-pod 8080:80 &

# Service port-forward
kubectl port-forward svc/web 8080:80 &

# Test
curl http://localhost:8080
\`\`\`

> Cleanup: \`kubectl delete namespace netpol-test && kubectl delete deploy,svc,ingress --all\``,
    },
  },
  {
    id: 'k3s-lab-storage',
    title: { ko: '실습: 스토리지', en: 'Lab: Storage' },
    level: 'hands-on',
    content: {
      ko: `## 실습: 스토리지

### 실습 1: local-path-provisioner (동적 프로비저닝)

k3s는 local-path-provisioner가 기본 설치되어 PVC 생성 시 자동으로 PV가 프로비저닝됩니다.

\`\`\`bash
# 기본 StorageClass 확인
kubectl get storageclass
# NAME                   PROVISIONER             AGE
# local-path (default)   rancher.io/local-path   10m
\`\`\`

**PVC 생성:**
\`\`\`yaml
# pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-path
  resources:
    requests:
      storage: 1Gi
\`\`\`

**PVC를 사용하는 Pod:**
\`\`\`yaml
# pvc-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: pvc-demo
spec:
  containers:
  - name: app
    image: busybox:1.36
    command: ["sh", "-c", "echo 'Hello from PVC!' > /data/hello.txt && sleep 3600"]
    volumeMounts:
    - name: my-storage
      mountPath: /data
  volumes:
  - name: my-storage
    persistentVolumeClaim:
      claimName: my-pvc
\`\`\`

\`\`\`bash
kubectl apply -f pvc.yaml
kubectl apply -f pvc-pod.yaml

# PV 자동 생성 확인
kubectl get pv,pvc

# 데이터 확인
kubectl exec pvc-demo -- cat /data/hello.txt
# 출력: Hello from PVC!

# 실제 호스트 저장 경로 확인
sudo ls /var/lib/rancher/k3s/storage/
\`\`\`

### 실습 2: 수동 PV/PVC (hostPath)

\`\`\`yaml
# manual-pv.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: manual-pv
spec:
  capacity:
    storage: 500Mi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /tmp/k3s-lab-data
    type: DirectoryOrCreate
  storageClassName: manual
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: manual-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: manual
  resources:
    requests:
      storage: 500Mi
\`\`\`

\`\`\`bash
kubectl apply -f manual-pv.yaml

# PV-PVC 바인딩 확인
kubectl get pv,pvc
# STATUS: Bound
\`\`\`

### 실습 3: StatefulSet + volumeClaimTemplates

\`\`\`yaml
# statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: db
spec:
  serviceName: db
  replicas: 2
  selector:
    matchLabels:
      app: db
  template:
    metadata:
      labels:
        app: db
    spec:
      containers:
      - name: db
        image: busybox:1.36
        command: ["sh", "-c", "echo $(hostname) > /data/hostname.txt && sleep 3600"]
        volumeMounts:
        - name: data
          mountPath: /data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: local-path
      resources:
        requests:
          storage: 100Mi
\`\`\`

\`\`\`bash
kubectl apply -f statefulset.yaml

# 각 Pod에 고유 PVC 생성 확인
kubectl get pvc
# data-db-0   Bound
# data-db-1   Bound

# 각 Pod의 고유 데이터 확인
kubectl exec db-0 -- cat /data/hostname.txt
# 출력: db-0
kubectl exec db-1 -- cat /data/hostname.txt
# 출력: db-1
\`\`\`

> 정리: \`kubectl delete statefulset db && kubectl delete pvc --all && kubectl delete pv --all\``,
      en: `## Lab: Storage

### Exercise 1: local-path-provisioner (Dynamic Provisioning)

k3s comes with local-path-provisioner pre-installed, automatically provisioning PVs when PVCs are created.

\`\`\`bash
# Check default StorageClass
kubectl get storageclass
# NAME                   PROVISIONER             AGE
# local-path (default)   rancher.io/local-path   10m
\`\`\`

**Create PVC:**
\`\`\`yaml
# pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-path
  resources:
    requests:
      storage: 1Gi
\`\`\`

**Pod using PVC:**
\`\`\`yaml
# pvc-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: pvc-demo
spec:
  containers:
  - name: app
    image: busybox:1.36
    command: ["sh", "-c", "echo 'Hello from PVC!' > /data/hello.txt && sleep 3600"]
    volumeMounts:
    - name: my-storage
      mountPath: /data
  volumes:
  - name: my-storage
    persistentVolumeClaim:
      claimName: my-pvc
\`\`\`

\`\`\`bash
kubectl apply -f pvc.yaml
kubectl apply -f pvc-pod.yaml

# Check auto-created PV
kubectl get pv,pvc

# Verify data
kubectl exec pvc-demo -- cat /data/hello.txt
# Output: Hello from PVC!

# Check actual host storage path
sudo ls /var/lib/rancher/k3s/storage/
\`\`\`

### Exercise 2: Manual PV/PVC (hostPath)

\`\`\`yaml
# manual-pv.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: manual-pv
spec:
  capacity:
    storage: 500Mi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /tmp/k3s-lab-data
    type: DirectoryOrCreate
  storageClassName: manual
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: manual-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: manual
  resources:
    requests:
      storage: 500Mi
\`\`\`

\`\`\`bash
kubectl apply -f manual-pv.yaml

# Check PV-PVC binding
kubectl get pv,pvc
# STATUS: Bound
\`\`\`

### Exercise 3: StatefulSet + volumeClaimTemplates

\`\`\`yaml
# statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: db
spec:
  serviceName: db
  replicas: 2
  selector:
    matchLabels:
      app: db
  template:
    metadata:
      labels:
        app: db
    spec:
      containers:
      - name: db
        image: busybox:1.36
        command: ["sh", "-c", "echo $(hostname) > /data/hostname.txt && sleep 3600"]
        volumeMounts:
        - name: data
          mountPath: /data
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: local-path
      resources:
        requests:
          storage: 100Mi
\`\`\`

\`\`\`bash
kubectl apply -f statefulset.yaml

# Check unique PVC per Pod
kubectl get pvc
# data-db-0   Bound
# data-db-1   Bound

# Verify unique data per Pod
kubectl exec db-0 -- cat /data/hostname.txt
# Output: db-0
kubectl exec db-1 -- cat /data/hostname.txt
# Output: db-1
\`\`\`

> Cleanup: \`kubectl delete statefulset db && kubectl delete pvc --all && kubectl delete pv --all\``,
    },
  },
  {
    id: 'k3s-lab-troubleshooting',
    title: { ko: '실습: 트러블슈팅', en: 'Lab: Troubleshooting' },
    level: 'hands-on',
    content: {
      ko: `## 실습: 트러블슈팅

### 실습 1: CrashLoopBackOff 디버깅

**문제 Pod 배포:**
\`\`\`yaml
# crash-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: crash-demo
spec:
  containers:
  - name: app
    image: busybox:1.36
    command: ["sh", "-c", "exit 1"]
\`\`\`

\`\`\`bash
kubectl apply -f crash-pod.yaml

# 상태 확인 - CrashLoopBackOff 발생
kubectl get pods crash-demo --watch

# 원인 진단
kubectl describe pod crash-demo
# Events 섹션에서 "Back-off restarting failed container" 확인

kubectl logs crash-demo
# 빈 출력 (즉시 종료되었으므로)

kubectl logs crash-demo --previous
# 이전 컨테이너 로그 확인
\`\`\`

**수정:**
\`\`\`bash
kubectl delete pod crash-demo
# command를 ["sh", "-c", "echo ok && sleep 3600"] 으로 변경 후 재배포
\`\`\`

### 실습 2: Pending Pod 디버깅

**문제 Pod 배포 (과도한 리소스 요청):**
\`\`\`yaml
# pending-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: pending-demo
spec:
  containers:
  - name: app
    image: nginx:alpine
    resources:
      requests:
        memory: "999Gi"
        cpu: "999"
\`\`\`

\`\`\`bash
kubectl apply -f pending-pod.yaml

# Pending 상태 확인
kubectl get pods pending-demo

# 원인 진단
kubectl describe pod pending-demo
# Events: "Insufficient memory", "Insufficient cpu"

# 해결: 리소스 요청을 적절한 값으로 수정
kubectl delete pod pending-demo
\`\`\`

**존재하지 않는 노드 셀렉터:**
\`\`\`yaml
# nodeselector-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: selector-demo
spec:
  nodeSelector:
    disk: ssd
  containers:
  - name: app
    image: nginx:alpine
\`\`\`

\`\`\`bash
kubectl apply -f nodeselector-pod.yaml
kubectl describe pod selector-demo
# Events: "didn't match Pod's node affinity/selector"

# 해결 방법 1: 노드에 라벨 추가
kubectl label nodes <node-name> disk=ssd

# 해결 방법 2: nodeSelector 제거
kubectl delete pod selector-demo
\`\`\`

### 실습 3: 네트워크 문제 디버깅

**잘못된 Service 포트:**
\`\`\`bash
# 앱 배포
kubectl create deployment web --image=nginx:alpine
kubectl expose deployment web --port=8080 --target-port=80

# 접근 실패 (포트 불일치)
kubectl run test --image=curlimages/curl -it --rm -- curl --max-time 3 http://web:8080
# 실제로는 동작함 (Service port=8080 → targetPort=80)

# 셀렉터 불일치 테스트
kubectl create deployment api --image=nginx:alpine
\`\`\`

\`\`\`yaml
# wrong-svc.yaml
apiVersion: v1
kind: Service
metadata:
  name: api-svc
spec:
  selector:
    app: wrong-label  # 잘못된 셀렉터!
  ports:
  - port: 80
    targetPort: 80
\`\`\`

\`\`\`bash
kubectl apply -f wrong-svc.yaml

# Endpoints가 없음을 확인
kubectl get endpoints api-svc
# ENDPOINTS: <none>

# 올바른 셀렉터 확인
kubectl get pods --show-labels
# app=api 라벨 확인

# 수정: selector를 app: api로 변경
\`\`\`

### 실습 4: k3s 시스템 점검

\`\`\`bash
# k3s 시스템 설정 확인
sudo k3s check-config

# k3s 서비스 로그 확인
sudo journalctl -u k3s --no-pager -n 50

# 노드 상태 확인
kubectl get nodes
kubectl describe node <node-name> | grep -A 10 "Conditions"

# 시스템 리소스 확인
kubectl top nodes
kubectl top pods -A --sort-by=memory
\`\`\`

### 실습 5: Break-and-Fix 시나리오

다음 매니페스트를 배포하고 문제를 찾아 수정하세요:

\`\`\`yaml
# broken.yaml
apiVersion: v1
kind: Pod
metadata:
  name: broken-app
spec:
  containers:
  - name: app
    image: nginx:nonexistent-tag
    ports:
    - containerPort: 80
    readinessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 5
\`\`\`

\`\`\`bash
kubectl apply -f broken.yaml

# 진단 단계
kubectl get pods broken-app           # 1. 상태 확인
kubectl describe pod broken-app       # 2. 이벤트 확인
kubectl logs broken-app               # 3. 로그 확인
\`\`\`

**문제점:**
1. \`image: nginx:nonexistent-tag\` → ImagePullBackOff (존재하지 않는 태그)
2. \`readinessProbe port: 8080\` → nginx는 80 포트에서 실행
3. \`readinessProbe path: /healthz\` → nginx에는 /healthz 경로 없음

**수정:**
\`\`\`yaml
# fixed.yaml
apiVersion: v1
kind: Pod
metadata:
  name: fixed-app
spec:
  containers:
  - name: app
    image: nginx:alpine
    ports:
    - containerPort: 80
    readinessProbe:
      httpGet:
        path: /
        port: 80
      initialDelaySeconds: 5
\`\`\`

> 트러블슈팅 핵심 순서: \`get\` → \`describe\` → \`logs\` → \`exec\`. 이 패턴을 반복하면 대부분의 문제를 해결할 수 있습니다.`,
      en: `## Lab: Troubleshooting

### Exercise 1: Debug CrashLoopBackOff

**Deploy a broken Pod:**
\`\`\`yaml
# crash-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: crash-demo
spec:
  containers:
  - name: app
    image: busybox:1.36
    command: ["sh", "-c", "exit 1"]
\`\`\`

\`\`\`bash
kubectl apply -f crash-pod.yaml

# Check status - CrashLoopBackOff occurs
kubectl get pods crash-demo --watch

# Diagnose the cause
kubectl describe pod crash-demo
# Check Events: "Back-off restarting failed container"

kubectl logs crash-demo
# Empty output (exited immediately)

kubectl logs crash-demo --previous
# Check previous container logs
\`\`\`

**Fix:**
\`\`\`bash
kubectl delete pod crash-demo
# Change command to ["sh", "-c", "echo ok && sleep 3600"] and redeploy
\`\`\`

### Exercise 2: Debug Pending Pod

**Deploy a Pod with excessive resource requests:**
\`\`\`yaml
# pending-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: pending-demo
spec:
  containers:
  - name: app
    image: nginx:alpine
    resources:
      requests:
        memory: "999Gi"
        cpu: "999"
\`\`\`

\`\`\`bash
kubectl apply -f pending-pod.yaml

# Check Pending status
kubectl get pods pending-demo

# Diagnose
kubectl describe pod pending-demo
# Events: "Insufficient memory", "Insufficient cpu"

# Fix: Modify resource requests to reasonable values
kubectl delete pod pending-demo
\`\`\`

**Non-existent node selector:**
\`\`\`yaml
# nodeselector-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: selector-demo
spec:
  nodeSelector:
    disk: ssd
  containers:
  - name: app
    image: nginx:alpine
\`\`\`

\`\`\`bash
kubectl apply -f nodeselector-pod.yaml
kubectl describe pod selector-demo
# Events: "didn't match Pod's node affinity/selector"

# Fix option 1: Add label to node
kubectl label nodes <node-name> disk=ssd

# Fix option 2: Remove nodeSelector
kubectl delete pod selector-demo
\`\`\`

### Exercise 3: Debug Network Issues

**Wrong Service port:**
\`\`\`bash
# Deploy app
kubectl create deployment web --image=nginx:alpine
kubectl expose deployment web --port=8080 --target-port=80

# Selector mismatch test
kubectl create deployment api --image=nginx:alpine
\`\`\`

\`\`\`yaml
# wrong-svc.yaml
apiVersion: v1
kind: Service
metadata:
  name: api-svc
spec:
  selector:
    app: wrong-label  # Wrong selector!
  ports:
  - port: 80
    targetPort: 80
\`\`\`

\`\`\`bash
kubectl apply -f wrong-svc.yaml

# Check that Endpoints are empty
kubectl get endpoints api-svc
# ENDPOINTS: <none>

# Check correct labels
kubectl get pods --show-labels
# Verify app=api label

# Fix: Change selector to app: api
\`\`\`

### Exercise 4: k3s System Health Check

\`\`\`bash
# Check k3s system configuration
sudo k3s check-config

# Check k3s service logs
sudo journalctl -u k3s --no-pager -n 50

# Check node status
kubectl get nodes
kubectl describe node <node-name> | grep -A 10 "Conditions"

# Check system resources
kubectl top nodes
kubectl top pods -A --sort-by=memory
\`\`\`

### Exercise 5: Break-and-Fix Scenario

Deploy the following manifest and find/fix the issues:

\`\`\`yaml
# broken.yaml
apiVersion: v1
kind: Pod
metadata:
  name: broken-app
spec:
  containers:
  - name: app
    image: nginx:nonexistent-tag
    ports:
    - containerPort: 80
    readinessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 5
\`\`\`

\`\`\`bash
kubectl apply -f broken.yaml

# Diagnostic steps
kubectl get pods broken-app           # 1. Check status
kubectl describe pod broken-app       # 2. Check events
kubectl logs broken-app               # 3. Check logs
\`\`\`

**Issues found:**
1. \`image: nginx:nonexistent-tag\` → ImagePullBackOff (non-existent tag)
2. \`readinessProbe port: 8080\` → nginx runs on port 80
3. \`readinessProbe path: /healthz\` → nginx has no /healthz endpoint

**Fix:**
\`\`\`yaml
# fixed.yaml
apiVersion: v1
kind: Pod
metadata:
  name: fixed-app
spec:
  containers:
  - name: app
    image: nginx:alpine
    ports:
    - containerPort: 80
    readinessProbe:
      httpGet:
        path: /
        port: 80
      initialDelaySeconds: 5
\`\`\`

> Troubleshooting order: \`get\` → \`describe\` → \`logs\` → \`exec\`. Repeating this pattern will solve most issues.`,
    },
  },
];
