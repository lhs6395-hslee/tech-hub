import type { K8sDocSection } from './index';

export const ch5Sections: K8sDocSection[] = [
  {
    id: 'kubectl-debugging',
    title: { ko: 'kubectl 디버깅', en: 'kubectl Debugging' },
    level: 'troubleshooting',
    content: {
      ko: `## kubectl 디버깅

CKA 시험에서 **트러블슈팅은 30%** 비중을 차지합니다. kubectl 명령어를 활용한 디버깅 능력이 핵심입니다.

### 핵심 디버깅 명령어

| 명령어 | 용도 |
|--------|------|
| \`kubectl get\` | 리소스 상태 조회 |
| \`kubectl describe\` | 리소스 상세 정보 (이벤트 포함) |
| \`kubectl logs\` | 컨테이너 로그 조회 |
| \`kubectl exec\` | 컨테이너 내부 명령 실행 |
| \`kubectl top\` | 리소스 사용량 확인 |
| \`kubectl get events\` | 클러스터 이벤트 조회 |

### kubectl describe

\`\`\`bash
# Pod 상세 정보 확인 (Events 섹션이 핵심)
kubectl describe pod <pod-name> -n <namespace>

# Node 상태 확인
kubectl describe node <node-name>

# Service 엔드포인트 확인
kubectl describe svc <service-name>
\`\`\`

### kubectl logs

\`\`\`bash
# 현재 로그
kubectl logs <pod-name>

# 이전 컨테이너 로그 (재시작된 경우)
kubectl logs <pod-name> --previous

# 특정 컨테이너 로그 (멀티 컨테이너 Pod)
kubectl logs <pod-name> -c <container-name>

# 실시간 로그 스트리밍
kubectl logs -f <pod-name>

# 최근 1시간 로그
kubectl logs --since=1h <pod-name>

# 마지막 100줄
kubectl logs --tail=100 <pod-name>
\`\`\`

### kubectl exec

\`\`\`bash
# 컨테이너 내부 접속
kubectl exec -it <pod-name> -- /bin/sh

# 특정 명령 실행
kubectl exec <pod-name> -- cat /etc/resolv.conf

# 멀티 컨테이너 Pod에서 특정 컨테이너 접속
kubectl exec -it <pod-name> -c <container> -- /bin/sh
\`\`\`

### JSONPath로 정보 추출

\`\`\`bash
# Pod IP 추출
kubectl get pod <name> -o jsonpath='{.status.podIP}'

# 모든 Node의 Internal IP
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="InternalIP")].address}'

# 특정 조건의 Pod 필터링
kubectl get pods -o jsonpath='{.items[?(@.status.phase=="Running")].metadata.name}'

# custom-columns 사용
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase,IP:.status.podIP
\`\`\`

### kubectl debug (임시 디버그 컨테이너)

\`\`\`bash
# 디버그 컨테이너 추가
kubectl debug <pod-name> -it --image=busybox --target=<container>

# Node 디버깅
kubectl debug node/<node-name> -it --image=ubuntu
\`\`\`

### 이벤트 조회

\`\`\`bash
# 네임스페이스 이벤트 (시간순)
kubectl get events -n <namespace> --sort-by='.lastTimestamp'

# Warning 이벤트만 필터링
kubectl get events --field-selector type=Warning

# 특정 리소스 관련 이벤트
kubectl get events --field-selector involvedObject.name=<pod-name>
\`\`\`

> **CKA 시험 팁**: \`kubectl describe\`의 Events 섹션을 가장 먼저 확인하세요. 대부분의 문제 원인이 여기에 기록됩니다.`,
      en: `## kubectl Debugging

**Troubleshooting makes up 30%** of the CKA exam. Mastering kubectl debugging commands is essential.

### Essential Debugging Commands

| Command | Purpose |
|---------|---------|
| \`kubectl get\` | View resource status |
| \`kubectl describe\` | Detailed resource info (including events) |
| \`kubectl logs\` | View container logs |
| \`kubectl exec\` | Execute commands inside containers |
| \`kubectl top\` | Check resource usage |
| \`kubectl get events\` | View cluster events |

### kubectl describe

\`\`\`bash
# Check Pod details (Events section is key)
kubectl describe pod <pod-name> -n <namespace>

# Check Node status
kubectl describe node <node-name>

# Check Service endpoints
kubectl describe svc <service-name>
\`\`\`

### kubectl logs

\`\`\`bash
# Current logs
kubectl logs <pod-name>

# Previous container logs (if restarted)
kubectl logs <pod-name> --previous

# Specific container logs (multi-container Pod)
kubectl logs <pod-name> -c <container-name>

# Real-time log streaming
kubectl logs -f <pod-name>

# Logs from last hour
kubectl logs --since=1h <pod-name>

# Last 100 lines
kubectl logs --tail=100 <pod-name>
\`\`\`

### kubectl exec

\`\`\`bash
# Access container shell
kubectl exec -it <pod-name> -- /bin/sh

# Run specific command
kubectl exec <pod-name> -- cat /etc/resolv.conf

# Access specific container in multi-container Pod
kubectl exec -it <pod-name> -c <container> -- /bin/sh
\`\`\`

### Extracting Info with JSONPath

\`\`\`bash
# Extract Pod IP
kubectl get pod <name> -o jsonpath='{.status.podIP}'

# All Node Internal IPs
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="InternalIP")].address}'

# Filter Pods by condition
kubectl get pods -o jsonpath='{.items[?(@.status.phase=="Running")].metadata.name}'

# Using custom-columns
kubectl get pods -o custom-columns=NAME:.metadata.name,STATUS:.status.phase,IP:.status.podIP
\`\`\`

### kubectl debug (Ephemeral Debug Containers)

\`\`\`bash
# Add debug container
kubectl debug <pod-name> -it --image=busybox --target=<container>

# Node debugging
kubectl debug node/<node-name> -it --image=ubuntu
\`\`\`

### Viewing Events

\`\`\`bash
# Namespace events (sorted by time)
kubectl get events -n <namespace> --sort-by='.lastTimestamp'

# Warning events only
kubectl get events --field-selector type=Warning

# Events for specific resource
kubectl get events --field-selector involvedObject.name=<pod-name>
\`\`\`

> **CKA Exam Tip**: Always check the Events section of \`kubectl describe\` first. Most problem causes are recorded there.`,
    },
  },
  {
    id: 'pod-troubleshooting',
    title: { ko: 'Pod 문제 해결', en: 'Pod Troubleshooting' },
    level: 'troubleshooting',
    content: {
      ko: `## Pod 문제 해결

### Pod 상태별 문제 진단

| 상태 | 원인 | 해결 방법 |
|------|------|-----------|
| **Pending** | 스케줄링 불가 (리소스 부족, nodeSelector 불일치) | \`kubectl describe pod\`로 Events 확인 |
| **CrashLoopBackOff** | 컨테이너가 반복 크래시 | \`kubectl logs --previous\`로 이전 로그 확인 |
| **ImagePullBackOff** | 이미지 풀 실패 (이름 오류, 인증 실패) | 이미지 이름/태그 확인, imagePullSecrets 확인 |
| **OOMKilled** | 메모리 한도 초과 | 리소스 limits 증가 또는 앱 메모리 사용 최적화 |
| **Error** | 컨테이너 비정상 종료 | \`kubectl logs\`로 에러 메시지 확인 |
| **CreateContainerConfigError** | ConfigMap/Secret 마운트 실패 | ConfigMap/Secret 존재 여부 확인 |

### CrashLoopBackOff 디버깅 플로우

\`\`\`bash
# 1. Pod 상태 확인
kubectl get pod <name> -o wide

# 2. 이벤트 확인
kubectl describe pod <name>

# 3. 이전 컨테이너 로그 확인
kubectl logs <name> --previous

# 4. 컨테이너 명령어/인수 확인
kubectl get pod <name> -o yaml | grep -A5 "command\\|args"

# 5. 환경변수 확인
kubectl exec <name> -- env
\`\`\`

### ImagePullBackOff 디버깅

\`\`\`bash
# 이미지 이름 확인
kubectl get pod <name> -o jsonpath='{.spec.containers[0].image}'

# imagePullSecrets 확인
kubectl get pod <name> -o jsonpath='{.spec.imagePullSecrets}'

# Secret 존재 확인
kubectl get secret <secret-name> -n <namespace>

# Private registry Secret 생성
kubectl create secret docker-registry regcred \\
  --docker-server=<registry> \\
  --docker-username=<user> \\
  --docker-password=<pass>
\`\`\`

### Pending Pod 디버깅

\`\`\`bash
# 스케줄링 이벤트 확인
kubectl describe pod <name> | grep -A10 Events

# 노드 리소스 확인
kubectl describe nodes | grep -A5 "Allocated resources"

# Taint 확인
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{": "}{.spec.taints}{"\n"}{end}'
\`\`\`

### Probe 실패 문제

\`\`\`yaml
# 프로브 설정 예시
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 15  # 시작 지연 (충분히 설정)
  periodSeconds: 10
  failureThreshold: 3      # 실패 허용 횟수

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
\`\`\`

> **CKA 시험 팁**: Pod 문제 해결 시 항상 \`describe → logs → exec\` 순서로 확인하세요.`,
      en: `## Pod Troubleshooting

### Diagnosing Issues by Pod Status

| Status | Cause | Resolution |
|--------|-------|------------|
| **Pending** | Cannot schedule (resource shortage, nodeSelector mismatch) | Check Events with \`kubectl describe pod\` |
| **CrashLoopBackOff** | Container repeatedly crashes | Check previous logs with \`kubectl logs --previous\` |
| **ImagePullBackOff** | Image pull failed (wrong name, auth failure) | Verify image name/tag, check imagePullSecrets |
| **OOMKilled** | Memory limit exceeded | Increase resource limits or optimize app memory |
| **Error** | Container exited abnormally | Check error message with \`kubectl logs\` |
| **CreateContainerConfigError** | ConfigMap/Secret mount failed | Verify ConfigMap/Secret exists |

### CrashLoopBackOff Debugging Flow

\`\`\`bash
# 1. Check Pod status
kubectl get pod <name> -o wide

# 2. Check events
kubectl describe pod <name>

# 3. Check previous container logs
kubectl logs <name> --previous

# 4. Check container command/args
kubectl get pod <name> -o yaml | grep -A5 "command\\|args"

# 5. Check environment variables
kubectl exec <name> -- env
\`\`\`

### ImagePullBackOff Debugging

\`\`\`bash
# Verify image name
kubectl get pod <name> -o jsonpath='{.spec.containers[0].image}'

# Check imagePullSecrets
kubectl get pod <name> -o jsonpath='{.spec.imagePullSecrets}'

# Verify Secret exists
kubectl get secret <secret-name> -n <namespace>

# Create private registry Secret
kubectl create secret docker-registry regcred \\
  --docker-server=<registry> \\
  --docker-username=<user> \\
  --docker-password=<pass>
\`\`\`

### Pending Pod Debugging

\`\`\`bash
# Check scheduling events
kubectl describe pod <name> | grep -A10 Events

# Check node resources
kubectl describe nodes | grep -A5 "Allocated resources"

# Check taints
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{": "}{.spec.taints}{"\n"}{end}'
\`\`\`

### Probe Failure Issues

\`\`\`yaml
# Probe configuration example
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 15  # Start delay (set sufficiently)
  periodSeconds: 10
  failureThreshold: 3      # Allowed failure count

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
\`\`\`

> **CKA Exam Tip**: When troubleshooting Pods, always follow the \`describe → logs → exec\` sequence.`,
    },
  },
  {
    id: 'node-troubleshooting',
    title: { ko: 'Node 문제 해결', en: 'Node Troubleshooting' },
    level: 'troubleshooting',
    content: {
      ko: `## Node 문제 해결

### Node 상태 확인

\`\`\`bash
# Node 상태 조회
kubectl get nodes

# Node 상세 정보
kubectl describe node <node-name>

# Node Conditions 확인
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{": "}{range .status.conditions[*]}{.type}={.status}{" "}{end}{"\n"}{end}'
\`\`\`

### Node Conditions

| Condition | 정상 값 | 설명 |
|-----------|---------|------|
| **Ready** | True | kubelet이 정상 작동 |
| **MemoryPressure** | False | 메모리 부족 |
| **DiskPressure** | False | 디스크 공간 부족 |
| **PIDPressure** | False | 프로세스 수 초과 |
| **NetworkUnavailable** | False | 네트워크 미구성 |

### NotReady Node 디버깅

\`\`\`bash
# 1. kubelet 상태 확인 (Node에 SSH 접속 후)
systemctl status kubelet

# 2. kubelet 로그 확인
journalctl -u kubelet -f --no-pager

# 3. kubelet 재시작
systemctl restart kubelet

# 4. kubelet 설정 확인
cat /var/lib/kubelet/config.yaml

# 5. 컨테이너 런타임 상태 확인
systemctl status containerd
# 또는
crictl ps
\`\`\`

### 리소스 압박(Pressure) 해결

\`\`\`bash
# 디스크 사용량 확인
df -h

# 메모리 사용량 확인
free -m

# 프로세스 확인
ps aux --sort=-%mem | head -20

# 미사용 이미지 정리
crictl rmi --prune

# Evicted Pod 정리
kubectl get pods --all-namespaces --field-selector status.phase=Failed | grep Evicted
\`\`\`

### Node 유지보수

\`\`\`bash
# 1. Node를 스케줄 불가 상태로 전환 + Pod 제거
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# 2. 유지보수 작업 수행

# 3. Node를 스케줄 가능 상태로 복구
kubectl uncordon <node-name>

# cordon만 (새 Pod 스케줄링 방지, 기존 Pod 유지)
kubectl cordon <node-name>
\`\`\`

> **CKA 시험 팁**: Node 문제는 kubelet과 컨테이너 런타임 상태를 먼저 확인하세요. \`systemctl status kubelet\`이 첫 번째 명령어입니다.`,
      en: `## Node Troubleshooting

### Checking Node Status

\`\`\`bash
# List Node status
kubectl get nodes

# Node detailed info
kubectl describe node <node-name>

# Check Node Conditions
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{": "}{range .status.conditions[*]}{.type}={.status}{" "}{end}{"\n"}{end}'
\`\`\`

### Node Conditions

| Condition | Healthy Value | Description |
|-----------|--------------|-------------|
| **Ready** | True | kubelet is functioning |
| **MemoryPressure** | False | Low memory |
| **DiskPressure** | False | Low disk space |
| **PIDPressure** | False | Too many processes |
| **NetworkUnavailable** | False | Network not configured |

### Debugging NotReady Nodes

\`\`\`bash
# 1. Check kubelet status (after SSH to node)
systemctl status kubelet

# 2. Check kubelet logs
journalctl -u kubelet -f --no-pager

# 3. Restart kubelet
systemctl restart kubelet

# 4. Check kubelet config
cat /var/lib/kubelet/config.yaml

# 5. Check container runtime status
systemctl status containerd
# or
crictl ps
\`\`\`

### Resolving Resource Pressure

\`\`\`bash
# Check disk usage
df -h

# Check memory usage
free -m

# Check processes
ps aux --sort=-%mem | head -20

# Clean unused images
crictl rmi --prune

# Clean Evicted Pods
kubectl get pods --all-namespaces --field-selector status.phase=Failed | grep Evicted
\`\`\`

### Node Maintenance

\`\`\`bash
# 1. Mark node unschedulable + evict Pods
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# 2. Perform maintenance

# 3. Restore node to schedulable state
kubectl uncordon <node-name>

# Cordon only (prevent new scheduling, keep existing Pods)
kubectl cordon <node-name>
\`\`\`

> **CKA Exam Tip**: For Node issues, always check kubelet and container runtime first. \`systemctl status kubelet\` is your first command.`,
    },
  },
  {
    id: 'network-troubleshooting',
    title: { ko: '네트워크 문제 해결', en: 'Network Troubleshooting' },
    level: 'troubleshooting',
    content: {
      ko: `## 네트워크 문제 해결

### 네트워크 문제 진단 순서

1. **Service** 확인 → 2. **Endpoint** 확인 → 3. **Pod** 연결 테스트 → 4. **DNS** 확인 → 5. **NetworkPolicy** 확인

### Service 연결 문제

\`\`\`bash
# Service 확인
kubectl get svc <name>

# Endpoints 확인 (Pod가 연결되었는지)
kubectl get endpoints <service-name>

# Service의 selector와 Pod label 일치 확인
kubectl get svc <name> -o jsonpath='{.spec.selector}'
kubectl get pods -l <key>=<value>

# 임시 Pod로 Service 테스트
kubectl run test --rm -it --image=busybox --restart=Never -- wget -qO- <service-name>:<port>
\`\`\`

### DNS 문제 해결

\`\`\`bash
# DNS 테스트 Pod
kubectl run dnstest --rm -it --image=busybox --restart=Never -- nslookup <service-name>

# CoreDNS Pod 상태 확인
kubectl get pods -n kube-system -l k8s-app=kube-dns

# CoreDNS 로그 확인
kubectl logs -n kube-system -l k8s-app=kube-dns

# Pod의 DNS 설정 확인
kubectl exec <pod> -- cat /etc/resolv.conf
\`\`\`

### DNS 형식

| 리소스 | DNS 형식 |
|--------|----------|
| Service | \`<svc>.<ns>.svc.cluster.local\` |
| Pod | \`<pod-ip-dashes>.<ns>.pod.cluster.local\` |
| StatefulSet Pod | \`<pod-name>.<svc>.<ns>.svc.cluster.local\` |

### kube-proxy 문제

\`\`\`bash
# kube-proxy 상태 확인
kubectl get pods -n kube-system -l k8s-app=kube-proxy

# kube-proxy 로그
kubectl logs -n kube-system -l k8s-app=kube-proxy

# iptables 규칙 확인 (Node에서)
iptables -t nat -L KUBE-SERVICES
\`\`\`

### CNI 플러그인 문제

\`\`\`bash
# CNI 설정 확인
ls /etc/cni/net.d/

# CNI 바이너리 확인
ls /opt/cni/bin/

# Pod 네트워크 테스트
kubectl exec <pod-a> -- ping <pod-b-ip>
kubectl exec <pod-a> -- wget -qO- <pod-b-ip>:<port>
\`\`\`

### NetworkPolicy 디버깅

\`\`\`bash
# 적용된 NetworkPolicy 확인
kubectl get networkpolicy -n <namespace>

# NetworkPolicy 상세 확인
kubectl describe networkpolicy <name>

# Pod에 적용되는 정책 확인 (label 기반)
kubectl get networkpolicy -n <ns> -o yaml | grep -A5 podSelector
\`\`\`

> **CKA 시험 팁**: 네트워크 문제 시 먼저 Endpoint가 있는지 확인하세요. Endpoint가 없으면 selector와 label 불일치입니다.`,
      en: `## Network Troubleshooting

### Network Diagnosis Order

1. Check **Service** → 2. Check **Endpoints** → 3. Test **Pod** connectivity → 4. Check **DNS** → 5. Check **NetworkPolicy**

### Service Connection Issues

\`\`\`bash
# Check Service
kubectl get svc <name>

# Check Endpoints (are Pods connected?)
kubectl get endpoints <service-name>

# Verify Service selector matches Pod labels
kubectl get svc <name> -o jsonpath='{.spec.selector}'
kubectl get pods -l <key>=<value>

# Test Service with temporary Pod
kubectl run test --rm -it --image=busybox --restart=Never -- wget -qO- <service-name>:<port>
\`\`\`

### DNS Troubleshooting

\`\`\`bash
# DNS test Pod
kubectl run dnstest --rm -it --image=busybox --restart=Never -- nslookup <service-name>

# Check CoreDNS Pod status
kubectl get pods -n kube-system -l k8s-app=kube-dns

# Check CoreDNS logs
kubectl logs -n kube-system -l k8s-app=kube-dns

# Check Pod DNS config
kubectl exec <pod> -- cat /etc/resolv.conf
\`\`\`

### DNS Formats

| Resource | DNS Format |
|----------|-----------|
| Service | \`<svc>.<ns>.svc.cluster.local\` |
| Pod | \`<pod-ip-dashes>.<ns>.pod.cluster.local\` |
| StatefulSet Pod | \`<pod-name>.<svc>.<ns>.svc.cluster.local\` |

### kube-proxy Issues

\`\`\`bash
# Check kube-proxy status
kubectl get pods -n kube-system -l k8s-app=kube-proxy

# kube-proxy logs
kubectl logs -n kube-system -l k8s-app=kube-proxy

# Check iptables rules (on Node)
iptables -t nat -L KUBE-SERVICES
\`\`\`

### CNI Plugin Issues

\`\`\`bash
# Check CNI config
ls /etc/cni/net.d/

# Check CNI binaries
ls /opt/cni/bin/

# Test Pod networking
kubectl exec <pod-a> -- ping <pod-b-ip>
kubectl exec <pod-a> -- wget -qO- <pod-b-ip>:<port>
\`\`\`

### NetworkPolicy Debugging

\`\`\`bash
# Check applied NetworkPolicies
kubectl get networkpolicy -n <namespace>

# NetworkPolicy details
kubectl describe networkpolicy <name>

# Check policies applied to Pod (label-based)
kubectl get networkpolicy -n <ns> -o yaml | grep -A5 podSelector
\`\`\`

> **CKA Exam Tip**: When facing network issues, first check if Endpoints exist. No Endpoints means a selector/label mismatch.`,
    },
  },
  {
    id: 'cluster-troubleshooting',
    title: { ko: '클러스터 문제 해결', en: 'Cluster Troubleshooting' },
    level: 'troubleshooting',
    content: {
      ko: `## 클러스터 문제 해결

### Control Plane 컴포넌트 확인

\`\`\`bash
# Control Plane Pod 상태
kubectl get pods -n kube-system

# 각 컴포넌트 확인
kubectl get pods -n kube-system -l component=kube-apiserver
kubectl get pods -n kube-system -l component=kube-scheduler
kubectl get pods -n kube-system -l component=kube-controller-manager
kubectl get pods -n kube-system -l component=etcd
\`\`\`

### Static Pod 매니페스트 위치

\`\`\`bash
# Control Plane 컴포넌트 매니페스트
ls /etc/kubernetes/manifests/
# kube-apiserver.yaml
# kube-controller-manager.yaml
# kube-scheduler.yaml
# etcd.yaml
\`\`\`

### API Server 문제

\`\`\`bash
# API Server 로그
kubectl logs -n kube-system kube-apiserver-<node>

# API Server 프로세스 확인 (Node에서)
crictl ps | grep kube-apiserver

# API Server 접근 테스트
kubectl cluster-info

# 인증서 만료 확인
kubeadm certs check-expiration
\`\`\`

### Scheduler/Controller Manager 문제

\`\`\`bash
# Scheduler 로그
kubectl logs -n kube-system kube-scheduler-<node>

# Controller Manager 로그
kubectl logs -n kube-system kube-controller-manager-<node>

# 리더 선출 확인 (HA 클러스터)
kubectl get endpoints kube-scheduler -n kube-system -o yaml
\`\`\`

### etcd 문제

\`\`\`bash
# etcd 상태 확인
kubectl get pods -n kube-system -l component=etcd

# etcd 멤버 목록
ETCDCTL_API=3 etcdctl member list \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# etcd 상태 점검
ETCDCTL_API=3 etcdctl endpoint health \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key
\`\`\`

### 인증서 만료 문제

\`\`\`bash
# 인증서 만료일 확인
kubeadm certs check-expiration

# 인증서 갱신
kubeadm certs renew all

# 갱신 후 Control Plane 재시작
# (Static Pod 매니페스트 이동 후 복원)
\`\`\`

> **CKA 시험 팁**: Control Plane 문제는 \`/etc/kubernetes/manifests/\` 의 Static Pod 매니페스트를 확인하세요. 설정 오류가 가장 흔한 원인입니다.`,
      en: `## Cluster Troubleshooting

### Checking Control Plane Components

\`\`\`bash
# Control Plane Pod status
kubectl get pods -n kube-system

# Check each component
kubectl get pods -n kube-system -l component=kube-apiserver
kubectl get pods -n kube-system -l component=kube-scheduler
kubectl get pods -n kube-system -l component=kube-controller-manager
kubectl get pods -n kube-system -l component=etcd
\`\`\`

### Static Pod Manifest Location

\`\`\`bash
# Control Plane component manifests
ls /etc/kubernetes/manifests/
# kube-apiserver.yaml
# kube-controller-manager.yaml
# kube-scheduler.yaml
# etcd.yaml
\`\`\`

### API Server Issues

\`\`\`bash
# API Server logs
kubectl logs -n kube-system kube-apiserver-<node>

# Check API Server process (on Node)
crictl ps | grep kube-apiserver

# Test API Server access
kubectl cluster-info

# Check certificate expiration
kubeadm certs check-expiration
\`\`\`

### Scheduler/Controller Manager Issues

\`\`\`bash
# Scheduler logs
kubectl logs -n kube-system kube-scheduler-<node>

# Controller Manager logs
kubectl logs -n kube-system kube-controller-manager-<node>

# Check leader election (HA clusters)
kubectl get endpoints kube-scheduler -n kube-system -o yaml
\`\`\`

### etcd Issues

\`\`\`bash
# Check etcd status
kubectl get pods -n kube-system -l component=etcd

# etcd member list
ETCDCTL_API=3 etcdctl member list \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key

# etcd health check
ETCDCTL_API=3 etcdctl endpoint health \\
  --endpoints=https://127.0.0.1:2379 \\
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\
  --cert=/etc/kubernetes/pki/etcd/server.crt \\
  --key=/etc/kubernetes/pki/etcd/server.key
\`\`\`

### Certificate Expiration Issues

\`\`\`bash
# Check certificate expiration
kubeadm certs check-expiration

# Renew certificates
kubeadm certs renew all

# Restart Control Plane after renewal
# (Move Static Pod manifests out and back)
\`\`\`

> **CKA Exam Tip**: For Control Plane issues, check Static Pod manifests in \`/etc/kubernetes/manifests/\`. Configuration errors are the most common cause.`,
    },
  },
  {
    id: 'logging-monitoring',
    title: { ko: '로깅과 모니터링', en: 'Logging & Monitoring' },
    level: 'troubleshooting',
    content: {
      ko: `## 로깅과 모니터링

### 컨테이너 로깅 구조

Kubernetes에서 컨테이너의 stdout/stderr 출력은 자동으로 로그로 캡처됩니다.

\`\`\`bash
# 기본 로그 위치 (Node에서)
/var/log/containers/
/var/log/pods/

# kubelet 로그
journalctl -u kubelet
\`\`\`

### 로그 조회 명령어

\`\`\`bash
# 기본 조회
kubectl logs <pod-name>

# 멀티 컨테이너 Pod
kubectl logs <pod-name> -c <container-name>
kubectl logs <pod-name> --all-containers

# Label로 여러 Pod 로그 조회
kubectl logs -l app=nginx --all-containers

# 이전 컨테이너 로그
kubectl logs <pod-name> --previous

# 시간/줄 수 필터
kubectl logs --since=30m <pod-name>
kubectl logs --tail=50 <pod-name>
\`\`\`

### metrics-server

metrics-server는 Pod/Node 리소스 사용량을 수집하는 클러스터 애드온입니다.

\`\`\`bash
# metrics-server 설치 확인
kubectl get deployment metrics-server -n kube-system

# Node 리소스 사용량
kubectl top nodes

# Pod 리소스 사용량
kubectl top pods
kubectl top pods -n <namespace> --sort-by=cpu
kubectl top pods -n <namespace> --sort-by=memory

# 특정 Pod의 컨테이너별 사용량
kubectl top pod <pod-name> --containers
\`\`\`

### 클러스터 레벨 로깅 아키텍처

| 방식 | 설명 |
|------|------|
| **Node 에이전트** | DaemonSet으로 각 Node에 로그 수집기 배포 (Fluentd, Filebeat) |
| **사이드카 컨테이너** | Pod에 로그 전송 사이드카 추가 |
| **애플리케이션 직접 전송** | 앱에서 직접 로그 백엔드로 전송 |

### 주요 로그 위치 요약

| 컴포넌트 | 로그 위치/명령어 |
|----------|------------------|
| Pod/Container | \`kubectl logs <pod>\` |
| kubelet | \`journalctl -u kubelet\` |
| API Server | \`kubectl logs -n kube-system kube-apiserver-*\` |
| etcd | \`kubectl logs -n kube-system etcd-*\` |
| Scheduler | \`kubectl logs -n kube-system kube-scheduler-*\` |
| Controller Manager | \`kubectl logs -n kube-system kube-controller-manager-*\` |
| Container Runtime | \`journalctl -u containerd\` |

> **CKA 시험 팁**: \`kubectl top\`은 metrics-server가 설치되어 있어야 동작합니다. 시험 환경에서는 보통 이미 설치되어 있습니다.`,
      en: `## Logging & Monitoring

### Container Logging Architecture

In Kubernetes, container stdout/stderr output is automatically captured as logs.

\`\`\`bash
# Default log location (on Node)
/var/log/containers/
/var/log/pods/

# kubelet logs
journalctl -u kubelet
\`\`\`

### Log Query Commands

\`\`\`bash
# Basic query
kubectl logs <pod-name>

# Multi-container Pod
kubectl logs <pod-name> -c <container-name>
kubectl logs <pod-name> --all-containers

# Logs from multiple Pods by label
kubectl logs -l app=nginx --all-containers

# Previous container logs
kubectl logs <pod-name> --previous

# Time/line filters
kubectl logs --since=30m <pod-name>
kubectl logs --tail=50 <pod-name>
\`\`\`

### metrics-server

metrics-server is a cluster add-on that collects Pod/Node resource usage.

\`\`\`bash
# Check metrics-server installation
kubectl get deployment metrics-server -n kube-system

# Node resource usage
kubectl top nodes

# Pod resource usage
kubectl top pods
kubectl top pods -n <namespace> --sort-by=cpu
kubectl top pods -n <namespace> --sort-by=memory

# Per-container usage for specific Pod
kubectl top pod <pod-name> --containers
\`\`\`

### Cluster-Level Logging Architecture

| Method | Description |
|--------|------------|
| **Node Agent** | Deploy log collector as DaemonSet on each Node (Fluentd, Filebeat) |
| **Sidecar Container** | Add log-forwarding sidecar to Pod |
| **Direct Application Push** | App sends logs directly to logging backend |

### Key Log Locations Summary

| Component | Log Location/Command |
|-----------|---------------------|
| Pod/Container | \`kubectl logs <pod>\` |
| kubelet | \`journalctl -u kubelet\` |
| API Server | \`kubectl logs -n kube-system kube-apiserver-*\` |
| etcd | \`kubectl logs -n kube-system etcd-*\` |
| Scheduler | \`kubectl logs -n kube-system kube-scheduler-*\` |
| Controller Manager | \`kubectl logs -n kube-system kube-controller-manager-*\` |
| Container Runtime | \`journalctl -u containerd\` |

> **CKA Exam Tip**: \`kubectl top\` requires metrics-server to be installed. In exam environments, it's usually pre-installed.`,
    },
  },
  {
    id: 'application-lifecycle',
    title: { ko: '애플리케이션 생명주기 관리', en: 'Application Lifecycle Management' },
    level: 'troubleshooting',
    content: {
      ko: `## 애플리케이션 생명주기 관리

### Rolling Update

\`\`\`bash
# 이미지 업데이트 (Rolling Update 트리거)
kubectl set image deployment/<name> <container>=<new-image>

# 롤아웃 상태 확인
kubectl rollout status deployment/<name>

# 롤아웃 히스토리
kubectl rollout history deployment/<name>

# 특정 리비전 상세 확인
kubectl rollout history deployment/<name> --revision=2
\`\`\`

### Rollback

\`\`\`bash
# 이전 버전으로 롤백
kubectl rollout undo deployment/<name>

# 특정 리비전으로 롤백
kubectl rollout undo deployment/<name> --to-revision=2

# 롤아웃 일시정지/재개
kubectl rollout pause deployment/<name>
kubectl rollout resume deployment/<name>
\`\`\`

### Deployment 전략

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
spec:
  strategy:
    type: RollingUpdate      # 또는 Recreate
    rollingUpdate:
      maxSurge: 25%          # 최대 초과 Pod 수
      maxUnavailable: 25%    # 최대 불가용 Pod 수
\`\`\`

| 전략 | 설명 | 사용 시기 |
|------|------|-----------|
| **RollingUpdate** | 점진적 교체 (기본값) | 무중단 배포 |
| **Recreate** | 모두 삭제 후 재생성 | DB 마이그레이션 등 |

### Probe 종류

\`\`\`yaml
# Startup Probe: 시작 완료 확인 (한 번만)
startupProbe:
  httpGet:
    path: /healthz
    port: 8080
  failureThreshold: 30
  periodSeconds: 10

# Liveness Probe: 컨테이너 생존 확인 (실패 시 재시작)
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  periodSeconds: 10

# Readiness Probe: 트래픽 수신 가능 확인 (실패 시 Service에서 제외)
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  periodSeconds: 5
\`\`\`

### Probe 유형

| 유형 | 설명 |
|------|------|
| **httpGet** | HTTP GET 요청 (200-399 성공) |
| **tcpSocket** | TCP 연결 확인 |
| **exec** | 컨테이너 내 명령 실행 (exit 0 성공) |
| **grpc** | gRPC 헬스 체크 |

### Graceful Shutdown

\`\`\`yaml
spec:
  terminationGracePeriodSeconds: 30  # 기본 30초
  containers:
  - name: app
    lifecycle:
      preStop:
        exec:
          command: ["/bin/sh", "-c", "sleep 5 && kill -SIGTERM 1"]
\`\`\`

**종료 순서:**
1. Pod가 Terminating 상태로 전환
2. Service 엔드포인트에서 제거
3. preStop 훅 실행
4. SIGTERM 전송
5. terminationGracePeriodSeconds 대기
6. SIGKILL 전송 (강제 종료)

### 배포 전략 비교

| 전략 | 무중단 | 리소스 | 롤백 속도 |
|------|--------|--------|-----------|
| Rolling Update | O | 추가 필요 | 빠름 |
| Recreate | X | 동일 | 빠름 |
| Blue-Green | O | 2배 | 즉시 |
| Canary | O | 약간 추가 | 즉시 |

> **CKA 시험 팁**: \`kubectl rollout\` 명령어 시리즈를 숙지하세요. 특히 \`undo --to-revision\`은 자주 출제됩니다.`,
      en: `## Application Lifecycle Management

### Rolling Update

\`\`\`bash
# Update image (triggers Rolling Update)
kubectl set image deployment/<name> <container>=<new-image>

# Check rollout status
kubectl rollout status deployment/<name>

# Rollout history
kubectl rollout history deployment/<name>

# Detailed specific revision
kubectl rollout history deployment/<name> --revision=2
\`\`\`

### Rollback

\`\`\`bash
# Rollback to previous version
kubectl rollout undo deployment/<name>

# Rollback to specific revision
kubectl rollout undo deployment/<name> --to-revision=2

# Pause/resume rollout
kubectl rollout pause deployment/<name>
kubectl rollout resume deployment/<name>
\`\`\`

### Deployment Strategies

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
spec:
  strategy:
    type: RollingUpdate      # or Recreate
    rollingUpdate:
      maxSurge: 25%          # Max extra Pods
      maxUnavailable: 25%    # Max unavailable Pods
\`\`\`

| Strategy | Description | When to Use |
|----------|-------------|-------------|
| **RollingUpdate** | Gradual replacement (default) | Zero-downtime deployments |
| **Recreate** | Delete all, then recreate | DB migrations etc. |

### Probe Types

\`\`\`yaml
# Startup Probe: Check startup completion (once only)
startupProbe:
  httpGet:
    path: /healthz
    port: 8080
  failureThreshold: 30
  periodSeconds: 10

# Liveness Probe: Check container is alive (restart on failure)
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  periodSeconds: 10

# Readiness Probe: Check traffic readiness (remove from Service on failure)
readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  periodSeconds: 5
\`\`\`

### Probe Methods

| Method | Description |
|--------|------------|
| **httpGet** | HTTP GET request (200-399 success) |
| **tcpSocket** | TCP connection check |
| **exec** | Execute command in container (exit 0 success) |
| **grpc** | gRPC health check |

### Graceful Shutdown

\`\`\`yaml
spec:
  terminationGracePeriodSeconds: 30  # Default 30 seconds
  containers:
  - name: app
    lifecycle:
      preStop:
        exec:
          command: ["/bin/sh", "-c", "sleep 5 && kill -SIGTERM 1"]
\`\`\`

**Termination Order:**
1. Pod transitions to Terminating state
2. Removed from Service endpoints
3. preStop hook executes
4. SIGTERM sent
5. Wait for terminationGracePeriodSeconds
6. SIGKILL sent (force kill)

### Deployment Strategy Comparison

| Strategy | Zero Downtime | Resources | Rollback Speed |
|----------|--------------|-----------|----------------|
| Rolling Update | Yes | Extra needed | Fast |
| Recreate | No | Same | Fast |
| Blue-Green | Yes | 2x | Instant |
| Canary | Yes | Slightly extra | Instant |

> **CKA Exam Tip**: Master the \`kubectl rollout\` command series. \`undo --to-revision\` is frequently tested.`,
    },
  },
];
