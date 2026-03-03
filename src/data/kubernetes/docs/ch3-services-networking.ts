import type { K8sDocSection } from './index';

export const ch3Sections: K8sDocSection[] = [
  {
    id: 'service-types',
    title: { ko: 'Service 유형', en: 'Service Types' },
    level: 'services-networking',
    content: {
      ko: `## Service 유형

### 개요

Kubernetes Service는 파드 집합에 대한 안정적인 네트워크 엔드포인트를 제공합니다.
파드는 일시적이지만, Service는 고정된 IP와 DNS 이름을 통해 접근할 수 있습니다.

---

### Service 유형 비교

| 유형 | 접근 범위 | 포트 할당 | 사용 사례 |
|------|-----------|-----------|-----------|
| **ClusterIP** | 클러스터 내부 전용 | 클러스터 IP | 내부 마이크로서비스 통신 |
| **NodePort** | 외부 + 내부 | 30000-32767 | 개발/테스트 환경 |
| **LoadBalancer** | 외부 + 내부 | 클라우드 LB | 프로덕션 외부 노출 |
| **ExternalName** | DNS CNAME | 없음 | 외부 서비스 참조 |

---

### ClusterIP Service

클러스터 내부에서만 접근 가능한 기본 서비스 유형입니다.

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: my-clusterip-svc
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80        # Service 포트
      targetPort: 8080 # 파드 컨테이너 포트
\`\`\`

### NodePort Service

모든 노드의 고정 포트를 통해 외부에서 접근할 수 있습니다.

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nodeport-svc
spec:
  type: NodePort
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
      nodePort: 30080  # 생략 시 30000-32767 범위에서 자동 할당
\`\`\`

- 접근 방법: \`<NodeIP>:<NodePort>\`
- 자동으로 ClusterIP도 생성됨

### LoadBalancer Service

클라우드 환경에서 외부 로드 밸런서를 프로비저닝합니다.

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: my-lb-svc
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
\`\`\`

- NodePort + ClusterIP가 자동 생성됨
- \`status.loadBalancer.ingress\`에 외부 IP 할당

### ExternalName Service

클러스터 내부에서 외부 DNS를 CNAME으로 참조합니다.

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: external-db
spec:
  type: ExternalName
  externalName: db.example.com
\`\`\`

- selector가 없음
- kube-dns/CoreDNS가 CNAME 레코드 반환

---

### Headless Service

\`clusterIP: None\`으로 설정하면 프록시 없이 파드 IP를 직접 반환합니다.

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: my-headless-svc
spec:
  clusterIP: None
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
\`\`\`

- StatefulSet과 함께 자주 사용
- DNS 조회 시 개별 파드 IP 목록 반환
- 클라이언트 측 로드 밸런싱에 유용

---

### Selector 기반 라우팅

Service는 label selector를 사용하여 트래픽을 라우팅합니다.

\`\`\`bash
# Service의 엔드포인트 확인
kubectl get endpoints my-clusterip-svc

# Service 상세 정보 확인
kubectl describe svc my-clusterip-svc

# 특정 label을 가진 파드 확인
kubectl get pods -l app=my-app -o wide
\`\`\`

### CKA 시험 핵심 포인트

- **\`port\`**: Service가 노출하는 포트
- **\`targetPort\`**: 파드 컨테이너의 실제 포트
- **\`nodePort\`**: NodePort 유형에서 노드에 열리는 포트
- selector가 없으면 Endpoint가 자동 생성되지 않음
- \`sessionAffinity: ClientIP\`로 세션 고정 가능`,

      en: `## Service Types

### Overview

A Kubernetes Service provides a stable network endpoint for a set of Pods.
While Pods are ephemeral, Services offer a fixed IP and DNS name for access.

---

### Service Types Comparison

| Type | Access Scope | Port Allocation | Use Case |
|------|-------------|-----------------|----------|
| **ClusterIP** | Internal only | Cluster IP | Internal microservice communication |
| **NodePort** | External + Internal | 30000-32767 | Dev/test environments |
| **LoadBalancer** | External + Internal | Cloud LB | Production external exposure |
| **ExternalName** | DNS CNAME | None | Reference external services |

---

### ClusterIP Service

The default Service type, accessible only within the cluster.

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: my-clusterip-svc
spec:
  type: ClusterIP
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80        # Service port
      targetPort: 8080 # Pod container port
\`\`\`

### NodePort Service

Exposes the Service externally via a static port on every node.

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nodeport-svc
spec:
  type: NodePort
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
      nodePort: 30080  # Auto-assigned from 30000-32767 if omitted
\`\`\`

- Access via: \`<NodeIP>:<NodePort>\`
- A ClusterIP is automatically created as well

### LoadBalancer Service

Provisions an external load balancer in cloud environments.

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: my-lb-svc
spec:
  type: LoadBalancer
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
\`\`\`

- Automatically creates NodePort + ClusterIP
- External IP assigned in \`status.loadBalancer.ingress\`

### ExternalName Service

References an external DNS name via CNAME from within the cluster.

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: external-db
spec:
  type: ExternalName
  externalName: db.example.com
\`\`\`

- No selector
- kube-dns/CoreDNS returns a CNAME record

---

### Headless Service

Setting \`clusterIP: None\` returns Pod IPs directly without proxying.

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: my-headless-svc
spec:
  clusterIP: None
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 8080
\`\`\`

- Commonly used with StatefulSets
- DNS lookup returns individual Pod IP list
- Useful for client-side load balancing

---

### Selector-Based Routing

Services use label selectors to route traffic to matching Pods.

\`\`\`bash
# Check Service endpoints
kubectl get endpoints my-clusterip-svc

# View Service details
kubectl describe svc my-clusterip-svc

# List Pods matching a label
kubectl get pods -l app=my-app -o wide
\`\`\`

### CKA Exam Key Points

- **\`port\`**: The port the Service exposes
- **\`targetPort\`**: The actual container port on the Pod
- **\`nodePort\`**: The port opened on nodes for NodePort type
- Without a selector, no Endpoint is auto-created
- Use \`sessionAffinity: ClientIP\` for sticky sessions`,
    },
  },
  {
    id: 'dns-service-discovery',
    title: { ko: 'DNS와 서비스 디스커버리', en: 'DNS & Service Discovery' },
    level: 'services-networking',
    content: {
      ko: `## DNS와 서비스 디스커버리

### 개요

Kubernetes는 CoreDNS를 사용하여 클러스터 내부 DNS를 제공합니다.
모든 Service와 Pod는 자동으로 DNS 레코드를 갖게 됩니다.

---

### CoreDNS 아키텍처

CoreDNS는 kube-system 네임스페이스에서 Deployment로 실행됩니다.

\`\`\`bash
# CoreDNS 파드 확인
kubectl get pods -n kube-system -l k8s-app=kube-dns

# CoreDNS 서비스 확인
kubectl get svc -n kube-system kube-dns

# CoreDNS ConfigMap 확인
kubectl get configmap coredns -n kube-system -o yaml
\`\`\`

### CoreDNS Corefile 구성

\`\`\`
.:53 {
    errors
    health {
        lameduck 5s
    }
    ready
    kubernetes cluster.local in-addr.arpa ip6.arpa {
        pods insecure
        fallthrough in-addr.arpa ip6.arpa
        ttl 30
    }
    prometheus :9153
    forward . /etc/resolv.conf
    cache 30
    loop
    reload
    loadbalance
}
\`\`\`

---

### Service DNS 형식

| DNS 레코드 | 형식 |
|------------|------|
| **Service (같은 NS)** | \`<service-name>\` |
| **Service (다른 NS)** | \`<service-name>.<namespace>\` |
| **Service (FQDN)** | \`<service-name>.<namespace>.svc.cluster.local\` |
| **SRV 레코드** | \`_<port-name>._<protocol>.<service>.<namespace>.svc.cluster.local\` |

\`\`\`bash
# 같은 네임스페이스 내 Service 접근
curl http://my-service

# 다른 네임스페이스의 Service 접근
curl http://my-service.other-namespace

# FQDN으로 접근
curl http://my-service.default.svc.cluster.local
\`\`\`

---

### Pod DNS

각 Pod도 DNS 레코드를 가집니다.

| DNS 레코드 | 형식 |
|------------|------|
| **Pod (IP 기반)** | \`<pod-ip-dashed>.<namespace>.pod.cluster.local\` |
| **StatefulSet Pod** | \`<pod-name>.<headless-svc>.<namespace>.svc.cluster.local\` |

\`\`\`bash
# Pod IP가 10.244.1.5인 경우:
# 10-244-1-5.default.pod.cluster.local

# StatefulSet Pod DNS 예시:
# web-0.nginx-headless.default.svc.cluster.local
\`\`\`

### Pod DNS 정책 설정

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: dns-example
spec:
  containers:
    - name: app
      image: nginx
  dnsPolicy: ClusterFirst  # 기본값
  dnsConfig:
    nameservers:
      - 8.8.8.8
    searches:
      - my-namespace.svc.cluster.local
      - svc.cluster.local
\`\`\`

DNS 정책 옵션:
- **ClusterFirst** (기본): 클러스터 DNS 우선 사용
- **Default**: 노드의 DNS 설정 상속
- **ClusterFirstWithHostNet**: hostNetwork 사용 시 클러스터 DNS 유지
- **None**: dnsConfig로 수동 설정

---

### Headless Service DNS

Headless Service는 개별 파드 IP를 직접 반환합니다.

\`\`\`bash
# 일반 Service DNS 조회 - ClusterIP 반환
nslookup my-service.default.svc.cluster.local

# Headless Service DNS 조회 - 모든 파드 IP 반환
nslookup my-headless.default.svc.cluster.local
\`\`\`

---

### DNS 디버깅

\`\`\`bash
# DNS 디버깅용 파드 생성
kubectl run dnsutils --image=gcr.io/kubernetes-e2e-test-images/dnsutils:1.3 \\
  --command -- sleep infinity

# DNS 조회 테스트
kubectl exec dnsutils -- nslookup kubernetes.default

# CoreDNS 로그 확인
kubectl logs -n kube-system -l k8s-app=kube-dns

# Pod의 resolv.conf 확인
kubectl exec dnsutils -- cat /etc/resolv.conf
\`\`\`

### CKA 시험 핵심 포인트

- CoreDNS는 \`kube-system\` 네임스페이스의 Deployment로 실행
- Service FQDN: \`<svc>.<ns>.svc.cluster.local\`
- Pod의 \`/etc/resolv.conf\`에 CoreDNS 서비스 IP가 nameserver로 설정됨
- \`nslookup\`, \`dig\` 명령어로 DNS 확인
- CoreDNS 설정은 ConfigMap \`coredns\`에서 관리`,

      en: `## DNS & Service Discovery

### Overview

Kubernetes uses CoreDNS to provide cluster-internal DNS.
Every Service and Pod automatically gets a DNS record.

---

### CoreDNS Architecture

CoreDNS runs as a Deployment in the kube-system namespace.

\`\`\`bash
# Check CoreDNS pods
kubectl get pods -n kube-system -l k8s-app=kube-dns

# Check CoreDNS service
kubectl get svc -n kube-system kube-dns

# View CoreDNS ConfigMap
kubectl get configmap coredns -n kube-system -o yaml
\`\`\`

### CoreDNS Corefile Configuration

\`\`\`
.:53 {
    errors
    health {
        lameduck 5s
    }
    ready
    kubernetes cluster.local in-addr.arpa ip6.arpa {
        pods insecure
        fallthrough in-addr.arpa ip6.arpa
        ttl 30
    }
    prometheus :9153
    forward . /etc/resolv.conf
    cache 30
    loop
    reload
    loadbalance
}
\`\`\`

---

### Service DNS Format

| DNS Record | Format |
|------------|--------|
| **Service (same NS)** | \`<service-name>\` |
| **Service (cross NS)** | \`<service-name>.<namespace>\` |
| **Service (FQDN)** | \`<service-name>.<namespace>.svc.cluster.local\` |
| **SRV Record** | \`_<port-name>._<protocol>.<service>.<namespace>.svc.cluster.local\` |

\`\`\`bash
# Access Service in the same namespace
curl http://my-service

# Access Service in a different namespace
curl http://my-service.other-namespace

# Access via FQDN
curl http://my-service.default.svc.cluster.local
\`\`\`

---

### Pod DNS

Each Pod also gets a DNS record.

| DNS Record | Format |
|------------|--------|
| **Pod (IP-based)** | \`<pod-ip-dashed>.<namespace>.pod.cluster.local\` |
| **StatefulSet Pod** | \`<pod-name>.<headless-svc>.<namespace>.svc.cluster.local\` |

\`\`\`bash
# If Pod IP is 10.244.1.5:
# 10-244-1-5.default.pod.cluster.local

# StatefulSet Pod DNS example:
# web-0.nginx-headless.default.svc.cluster.local
\`\`\`

### Pod DNS Policy Configuration

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: dns-example
spec:
  containers:
    - name: app
      image: nginx
  dnsPolicy: ClusterFirst  # default
  dnsConfig:
    nameservers:
      - 8.8.8.8
    searches:
      - my-namespace.svc.cluster.local
      - svc.cluster.local
\`\`\`

DNS Policy options:
- **ClusterFirst** (default): Use cluster DNS first
- **Default**: Inherit node DNS configuration
- **ClusterFirstWithHostNet**: Keep cluster DNS with hostNetwork
- **None**: Manual configuration via dnsConfig

---

### Headless Service DNS

Headless Services return individual Pod IPs directly.

\`\`\`bash
# Normal Service DNS lookup - returns ClusterIP
nslookup my-service.default.svc.cluster.local

# Headless Service DNS lookup - returns all Pod IPs
nslookup my-headless.default.svc.cluster.local
\`\`\`

---

### Debugging DNS

\`\`\`bash
# Create a debugging Pod
kubectl run dnsutils --image=gcr.io/kubernetes-e2e-test-images/dnsutils:1.3 \\
  --command -- sleep infinity

# Test DNS resolution
kubectl exec dnsutils -- nslookup kubernetes.default

# Check CoreDNS logs
kubectl logs -n kube-system -l k8s-app=kube-dns

# Inspect Pod resolv.conf
kubectl exec dnsutils -- cat /etc/resolv.conf
\`\`\`

### CKA Exam Key Points

- CoreDNS runs as a Deployment in \`kube-system\` namespace
- Service FQDN: \`<svc>.<ns>.svc.cluster.local\`
- Pod \`/etc/resolv.conf\` has CoreDNS service IP as nameserver
- Use \`nslookup\` and \`dig\` to verify DNS
- CoreDNS config is managed via the \`coredns\` ConfigMap`,
    },
  },
  {
    id: 'ingress',
    title: { ko: 'Ingress', en: 'Ingress' },
    level: 'services-networking',
    content: {
      ko: `## Ingress

### 개요

Ingress는 클러스터 외부에서 내부 Service로의 HTTP/HTTPS 라우팅을 관리합니다.
단일 IP로 여러 서비스에 접근할 수 있으며, SSL 종료 및 이름 기반 가상 호스팅을 지원합니다.

---

### Ingress Controller

Ingress 리소스만으로는 작동하지 않으며, 반드시 Ingress Controller가 필요합니다.

| Controller | 특징 |
|-----------|------|
| **NGINX Ingress** | 가장 널리 사용, CKA 시험 기본 |
| **Traefik** | 자동 설정, Let's Encrypt 통합 |
| **HAProxy** | 고성능, 고급 로드 밸런싱 |
| **Contour** | Envoy 기반, HTTPProxy CRD |

\`\`\`bash
# NGINX Ingress Controller 설치 확인
kubectl get pods -n ingress-nginx
kubectl get ingressclass
\`\`\`

---

### IngressClass

Kubernetes v1.18+에서 IngressClass를 사용하여 여러 컨트롤러를 구분합니다.

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: nginx
  annotations:
    ingressclass.kubernetes.io/is-default-class: "true"
spec:
  controller: k8s.io/ingress-nginx
\`\`\`

---

### 기본 Ingress 리소스

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-service
                port:
                  number: 80
\`\`\`

### pathType 옵션

| pathType | 설명 | 예시 |
|----------|------|------|
| **Prefix** | URL 접두사 매칭 | \`/app\` -> \`/app\`, \`/app/sub\` |
| **Exact** | 정확한 경로 매칭 | \`/app\` -> \`/app\`만 |
| **ImplementationSpecific** | 컨트롤러 구현에 따름 | - |

---

### 경로 기반 라우팅 (Path-Based Routing)

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: path-based-ingress
spec:
  ingressClassName: nginx
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 8080
          - path: /web
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 80
\`\`\`

---

### 호스트 기반 라우팅 (Host-Based Routing)

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: host-based-ingress
spec:
  ingressClassName: nginx
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 8080
    - host: web.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 80
\`\`\`

---

### TLS 종료 (TLS Termination)

\`\`\`bash
# TLS Secret 생성
kubectl create secret tls my-tls-secret \\
  --cert=tls.crt --key=tls.key
\`\`\`

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tls-ingress
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - app.example.com
      secretName: my-tls-secret
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-service
                port:
                  number: 80
\`\`\`

---

### CKA 시험 핵심 포인트

- Ingress Controller가 반드시 설치되어 있어야 함
- \`ingressClassName\` 필드로 IngressClass 지정
- \`pathType\`은 필수 필드 (Prefix, Exact, ImplementationSpecific)
- TLS Secret은 \`kubernetes.io/tls\` 타입으로 \`tls.crt\`, \`tls.key\` 포함
- \`kubectl describe ingress <name>\`으로 라우팅 규칙 확인
- 기본 백엔드: \`spec.defaultBackend\`로 매칭되지 않는 요청 처리`,

      en: `## Ingress

### Overview

Ingress manages HTTP/HTTPS routing from outside the cluster to internal Services.
It enables access to multiple services via a single IP, with SSL termination and name-based virtual hosting.

---

### Ingress Controller

An Ingress resource alone does nothing -- an Ingress Controller is required.

| Controller | Characteristics |
|-----------|----------------|
| **NGINX Ingress** | Most widely used, CKA exam default |
| **Traefik** | Auto-config, Let's Encrypt integration |
| **HAProxy** | High performance, advanced load balancing |
| **Contour** | Envoy-based, HTTPProxy CRD |

\`\`\`bash
# Verify NGINX Ingress Controller installation
kubectl get pods -n ingress-nginx
kubectl get ingressclass
\`\`\`

---

### IngressClass

Kubernetes v1.18+ uses IngressClass to distinguish between multiple controllers.

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: nginx
  annotations:
    ingressclass.kubernetes.io/is-default-class: "true"
spec:
  controller: k8s.io/ingress-nginx
\`\`\`

---

### Basic Ingress Resource

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-service
                port:
                  number: 80
\`\`\`

### pathType Options

| pathType | Description | Example |
|----------|-------------|---------|
| **Prefix** | URL prefix matching | \`/app\` -> \`/app\`, \`/app/sub\` |
| **Exact** | Exact path matching | \`/app\` -> \`/app\` only |
| **ImplementationSpecific** | Controller-dependent | - |

---

### Path-Based Routing

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: path-based-ingress
spec:
  ingressClassName: nginx
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 8080
          - path: /web
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 80
\`\`\`

---

### Host-Based Routing

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: host-based-ingress
spec:
  ingressClassName: nginx
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 8080
    - host: web.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-service
                port:
                  number: 80
\`\`\`

---

### TLS Termination

\`\`\`bash
# Create a TLS Secret
kubectl create secret tls my-tls-secret \\
  --cert=tls.crt --key=tls.key
\`\`\`

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tls-ingress
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - app.example.com
      secretName: my-tls-secret
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-service
                port:
                  number: 80
\`\`\`

---

### CKA Exam Key Points

- An Ingress Controller must be installed for Ingress to work
- Use \`ingressClassName\` to specify the IngressClass
- \`pathType\` is a required field (Prefix, Exact, ImplementationSpecific)
- TLS Secret must be type \`kubernetes.io/tls\` with \`tls.crt\` and \`tls.key\`
- Use \`kubectl describe ingress <name>\` to inspect routing rules
- Default backend: \`spec.defaultBackend\` handles unmatched requests`,
    },
  },
  {
    id: 'network-policy',
    title: { ko: 'NetworkPolicy', en: 'NetworkPolicy' },
    level: 'services-networking',
    content: {
      ko: `## NetworkPolicy

### 개요

NetworkPolicy는 파드 간 트래픽을 제어하는 방화벽 규칙입니다.
기본적으로 쿠버네티스는 모든 파드 간 통신을 허용하며, NetworkPolicy로 이를 제한할 수 있습니다.

> **중요**: NetworkPolicy를 지원하는 CNI 플러그인(Calico, Cilium, Weave Net 등)이 필요합니다. Flannel은 NetworkPolicy를 지원하지 않습니다.

---

### 기본 거부 정책 (Default Deny)

#### 모든 Ingress 거부

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: default
spec:
  podSelector: {}   # 모든 파드에 적용
  policyTypes:
    - Ingress
\`\`\`

#### 모든 Egress 거부

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-egress
  namespace: default
spec:
  podSelector: {}
  policyTypes:
    - Egress
\`\`\`

#### 모든 Ingress/Egress 거부

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: default
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
\`\`\`

---

### Ingress 규칙

특정 소스에서 파드로의 들어오는 트래픽을 허용합니다.

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 8080
\`\`\`

---

### Egress 규칙

파드에서 나가는 트래픽을 제어합니다.

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns-and-api
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Egress
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system
        - podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
    - to:
        - podSelector:
            matchLabels:
              app: database
      ports:
        - protocol: TCP
          port: 5432
\`\`\`

---

### Namespace Selector

다른 네임스페이스의 파드로부터 트래픽을 허용합니다.

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-from-monitoring
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              purpose: monitoring
          podSelector:
            matchLabels:
              app: prometheus
      ports:
        - protocol: TCP
          port: 9090
\`\`\`

> **주의**: \`namespaceSelector\`와 \`podSelector\`가 같은 \`- from\` 항목에 있으면 AND 조건, 별도 항목이면 OR 조건입니다.

---

### CIDR 블록

특정 IP 범위에 대한 규칙을 설정합니다.

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-external
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - ipBlock:
            cidr: 10.0.0.0/8
            except:
              - 10.0.1.0/24
  egress:
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0
            except:
              - 169.254.169.254/32
\`\`\`

---

### 자주 사용하는 패턴

\`\`\`bash
# NetworkPolicy 목록 확인
kubectl get networkpolicy -A

# 상세 정보 확인
kubectl describe networkpolicy allow-frontend

# 파드의 label 확인
kubectl get pods --show-labels

# 네임스페이스에 label 추가
kubectl label namespace monitoring purpose=monitoring
\`\`\`

### CKA 시험 핵심 포인트

- \`podSelector: {}\`는 네임스페이스의 모든 파드를 선택
- \`policyTypes\`에 명시하지 않은 방향은 영향 없음
- 같은 \`from\`/\`to\` 배열 항목 내 조건은 AND, 별도 항목은 OR
- DNS(포트 53) egress를 잊지 말 것 - deny-all 시 DNS도 차단됨
- NetworkPolicy는 네임스페이스 범위 리소스`,

      en: `## NetworkPolicy

### Overview

NetworkPolicy defines firewall rules that control traffic between Pods.
By default, Kubernetes allows all Pod-to-Pod communication; NetworkPolicy restricts it.

> **Important**: A CNI plugin that supports NetworkPolicy (Calico, Cilium, Weave Net, etc.) is required. Flannel does not support NetworkPolicy.

---

### Default Deny Policies

#### Deny All Ingress

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
  namespace: default
spec:
  podSelector: {}   # Applies to all pods
  policyTypes:
    - Ingress
\`\`\`

#### Deny All Egress

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-egress
  namespace: default
spec:
  podSelector: {}
  policyTypes:
    - Egress
\`\`\`

#### Deny All Ingress and Egress

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: default
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
\`\`\`

---

### Ingress Rules

Allow incoming traffic from specific sources to selected Pods.

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 8080
\`\`\`

---

### Egress Rules

Control outgoing traffic from selected Pods.

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns-and-api
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Egress
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system
        - podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
    - to:
        - podSelector:
            matchLabels:
              app: database
      ports:
        - protocol: TCP
          port: 5432
\`\`\`

---

### Namespace Selector

Allow traffic from Pods in other namespaces.

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-from-monitoring
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes:
    - Ingress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              purpose: monitoring
          podSelector:
            matchLabels:
              app: prometheus
      ports:
        - protocol: TCP
          port: 9090
\`\`\`

> **Note**: When \`namespaceSelector\` and \`podSelector\` are in the same \`- from\` item they act as AND; in separate items they act as OR.

---

### CIDR Blocks

Define rules for specific IP ranges.

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-external
spec:
  podSelector:
    matchLabels:
      app: web
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - ipBlock:
            cidr: 10.0.0.0/8
            except:
              - 10.0.1.0/24
  egress:
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0
            except:
              - 169.254.169.254/32
\`\`\`

---

### Common Patterns

\`\`\`bash
# List all NetworkPolicies
kubectl get networkpolicy -A

# View details
kubectl describe networkpolicy allow-frontend

# Check Pod labels
kubectl get pods --show-labels

# Label a namespace
kubectl label namespace monitoring purpose=monitoring
\`\`\`

### CKA Exam Key Points

- \`podSelector: {}\` selects all Pods in the namespace
- Directions not listed in \`policyTypes\` are unaffected
- Conditions within the same \`from\`/\`to\` array item are AND; separate items are OR
- Do not forget DNS (port 53) egress -- a deny-all policy blocks DNS too
- NetworkPolicy is a namespace-scoped resource`,
    },
  },
  {
    id: 'cni-networking',
    title: { ko: 'CNI와 클러스터 네트워킹', en: 'CNI & Cluster Networking' },
    level: 'services-networking',
    content: {
      ko: `## CNI와 클러스터 네트워킹

### 개요

CNI(Container Network Interface)는 쿠버네티스 파드 네트워킹의 표준 인터페이스입니다.
CNI 플러그인은 파드에 IP를 할당하고 파드 간 통신을 가능하게 합니다.

---

### 쿠버네티스 네트워킹 모델

쿠버네티스 네트워킹의 기본 요구사항:

1. **모든 파드는 NAT 없이 다른 파드와 통신 가능**
2. **모든 노드는 NAT 없이 모든 파드와 통신 가능**
3. **파드가 보는 자신의 IP와 다른 파드가 보는 IP가 동일**

| 통신 유형 | 설명 |
|-----------|------|
| **Pod-to-Pod (같은 노드)** | Linux bridge/veth pair를 통해 통신 |
| **Pod-to-Pod (다른 노드)** | CNI 플러그인이 오버레이/라우팅으로 처리 |
| **Pod-to-Service** | kube-proxy가 iptables/IPVS 규칙으로 처리 |
| **External-to-Service** | NodePort, LoadBalancer, Ingress를 통해 접근 |

---

### 주요 CNI 플러그인 비교

| 플러그인 | 네트워크 모드 | NetworkPolicy | 특징 |
|----------|-------------|---------------|------|
| **Calico** | BGP/VXLAN/IPIP | 지원 | 가장 널리 사용, 높은 성능 |
| **Flannel** | VXLAN/host-gw | 미지원 | 간단한 설정, 기본적 기능 |
| **Weave Net** | VXLAN | 지원 | 설치 용이, 암호화 지원 |
| **Cilium** | eBPF | 지원 | L7 정책, 높은 성능 |

---

### CNI 플러그인 설치 및 확인

\`\`\`bash
# CNI 플러그인 바이너리 위치
ls /opt/cni/bin/

# CNI 설정 파일 위치
ls /etc/cni/net.d/

# 현재 사용 중인 CNI 확인
cat /etc/cni/net.d/10-calico.conflist

# Calico 설치 예시
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml

# Flannel 설치 예시
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
\`\`\`

---

### 파드 네트워킹 구조

\`\`\`bash
# 파드 IP 확인
kubectl get pods -o wide

# 파드 내부에서 네트워크 인터페이스 확인
kubectl exec my-pod -- ip addr

# 노드의 네트워크 인터페이스 확인
ip link show

# 노드의 라우팅 테이블 확인
ip route

# veth pair 확인
bridge link show
\`\`\`

### 파드 네트워크 흐름

\`\`\`
Pod A (10.244.1.2) --> veth pair --> Node bridge (cbr0)
    --> CNI routing/overlay --> Node bridge (cbr0) --> veth pair
    --> Pod B (10.244.2.3)
\`\`\`

---

### 클러스터 IP 범위

| 범위 | 설정 위치 | 용도 |
|------|-----------|------|
| **Pod CIDR** | \`--cluster-cidr\` (kube-controller-manager) | 파드 IP 할당 |
| **Service CIDR** | \`--service-cluster-ip-range\` (kube-apiserver) | Service ClusterIP 할당 |
| **Node Pod CIDR** | \`--pod-cidr\` (각 노드) | 노드별 파드 서브넷 |

\`\`\`bash
# Pod CIDR 확인
kubectl cluster-info dump | grep -m 1 cluster-cidr

# Service CIDR 확인
kubectl cluster-info dump | grep -m 1 service-cluster-ip-range

# 노드별 Pod CIDR 확인
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{": "}{.spec.podCIDR}{"\\n"}{end}'
\`\`\`

---

### kube-proxy 모드

kube-proxy는 Service의 ClusterIP를 파드 IP로 변환합니다.

| 모드 | 설명 | 성능 |
|------|------|------|
| **iptables** | iptables 규칙 기반 (기본값) | 중간 |
| **IPVS** | Linux IPVS 기반 | 높음 (대규모 클러스터) |

\`\`\`bash
# kube-proxy 모드 확인
kubectl get configmap kube-proxy -n kube-system -o yaml | grep mode

# iptables 규칙 확인
iptables -t nat -L KUBE-SERVICES

# IPVS 규칙 확인
ipvsadm -L -n
\`\`\`

---

### CKA 시험 핵심 포인트

- CNI 플러그인 바이너리: \`/opt/cni/bin/\`, 설정: \`/etc/cni/net.d/\`
- kubelet의 \`--network-plugin=cni\` 옵션으로 CNI 활성화
- Pod CIDR과 Service CIDR은 겹치면 안 됨
- \`kubectl get nodes -o wide\`로 노드 IP 확인
- CNI 미설치 시 파드가 \`Pending\` 상태로 유지됨`,

      en: `## CNI & Cluster Networking

### Overview

CNI (Container Network Interface) is the standard interface for Kubernetes Pod networking.
CNI plugins assign IPs to Pods and enable Pod-to-Pod communication.

---

### Kubernetes Networking Model

Fundamental requirements of Kubernetes networking:

1. **Every Pod can communicate with every other Pod without NAT**
2. **Every node can communicate with every Pod without NAT**
3. **The IP a Pod sees for itself is the same IP others see for it**

| Communication Type | Description |
|-------------------|-------------|
| **Pod-to-Pod (same node)** | Via Linux bridge/veth pairs |
| **Pod-to-Pod (cross-node)** | Handled by CNI plugin via overlay/routing |
| **Pod-to-Service** | kube-proxy manages iptables/IPVS rules |
| **External-to-Service** | Via NodePort, LoadBalancer, or Ingress |

---

### Major CNI Plugin Comparison

| Plugin | Network Mode | NetworkPolicy | Characteristics |
|--------|-------------|---------------|-----------------|
| **Calico** | BGP/VXLAN/IPIP | Supported | Most widely used, high performance |
| **Flannel** | VXLAN/host-gw | Not supported | Simple setup, basic features |
| **Weave Net** | VXLAN | Supported | Easy install, encryption support |
| **Cilium** | eBPF | Supported | L7 policies, high performance |

---

### CNI Plugin Installation and Verification

\`\`\`bash
# CNI plugin binary location
ls /opt/cni/bin/

# CNI configuration file location
ls /etc/cni/net.d/

# Check current CNI in use
cat /etc/cni/net.d/10-calico.conflist

# Calico installation example
kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml

# Flannel installation example
kubectl apply -f https://raw.githubusercontent.com/flannel-io/flannel/master/Documentation/kube-flannel.yml
\`\`\`

---

### Pod Networking Structure

\`\`\`bash
# Check Pod IPs
kubectl get pods -o wide

# View network interfaces inside a Pod
kubectl exec my-pod -- ip addr

# View node network interfaces
ip link show

# Check node routing table
ip route

# Inspect veth pairs
bridge link show
\`\`\`

### Pod Network Flow

\`\`\`
Pod A (10.244.1.2) --> veth pair --> Node bridge (cbr0)
    --> CNI routing/overlay --> Node bridge (cbr0) --> veth pair
    --> Pod B (10.244.2.3)
\`\`\`

---

### Cluster IP Ranges

| Range | Configuration Location | Purpose |
|-------|----------------------|---------|
| **Pod CIDR** | \`--cluster-cidr\` (kube-controller-manager) | Pod IP allocation |
| **Service CIDR** | \`--service-cluster-ip-range\` (kube-apiserver) | Service ClusterIP allocation |
| **Node Pod CIDR** | \`--pod-cidr\` (per node) | Per-node Pod subnet |

\`\`\`bash
# Check Pod CIDR
kubectl cluster-info dump | grep -m 1 cluster-cidr

# Check Service CIDR
kubectl cluster-info dump | grep -m 1 service-cluster-ip-range

# Check per-node Pod CIDR
kubectl get nodes -o jsonpath='{range .items[*]}{.metadata.name}{": "}{.spec.podCIDR}{"\\n"}{end}'
\`\`\`

---

### kube-proxy Modes

kube-proxy translates Service ClusterIPs to Pod IPs.

| Mode | Description | Performance |
|------|-------------|-------------|
| **iptables** | iptables rule-based (default) | Medium |
| **IPVS** | Linux IPVS-based | High (large clusters) |

\`\`\`bash
# Check kube-proxy mode
kubectl get configmap kube-proxy -n kube-system -o yaml | grep mode

# View iptables rules
iptables -t nat -L KUBE-SERVICES

# View IPVS rules
ipvsadm -L -n
\`\`\`

---

### CKA Exam Key Points

- CNI plugin binaries: \`/opt/cni/bin/\`, config: \`/etc/cni/net.d/\`
- kubelet uses \`--network-plugin=cni\` to enable CNI
- Pod CIDR and Service CIDR must not overlap
- Use \`kubectl get nodes -o wide\` to check node IPs
- If no CNI is installed, Pods remain in \`Pending\` state`,
    },
  },
  {
    id: 'endpoint-slices',
    title: { ko: 'EndpointSlice', en: 'EndpointSlices' },
    level: 'services-networking',
    content: {
      ko: `## EndpointSlice

### 개요

EndpointSlice는 Kubernetes v1.21에서 GA된 리소스로, 기존 Endpoints 리소스의 확장성 문제를 해결합니다.
Service의 네트워크 엔드포인트를 더 효율적으로 추적하고 배포합니다.

---

### Endpoints vs EndpointSlices

| 특성 | Endpoints | EndpointSlices |
|------|-----------|----------------|
| **API 버전** | v1 (레거시) | discovery.k8s.io/v1 |
| **최대 엔드포인트** | 무제한 (단일 객체) | 슬라이스당 최대 100개 |
| **확장성** | 대규모 시 성능 저하 | 분산 처리로 확장성 우수 |
| **업데이트 범위** | 전체 객체 업데이트 | 변경된 슬라이스만 업데이트 |
| **토폴로지 정보** | 미지원 | zone, nodeName 등 포함 |

---

### Endpoints 리소스 (레거시)

\`\`\`bash
# Endpoints 확인
kubectl get endpoints my-service

# 상세 정보
kubectl describe endpoints my-service
\`\`\`

\`\`\`yaml
# Endpoints 객체 구조 예시
apiVersion: v1
kind: Endpoints
metadata:
  name: my-service
subsets:
  - addresses:
      - ip: 10.244.1.5
        nodeName: node-1
      - ip: 10.244.2.8
        nodeName: node-2
    ports:
      - port: 8080
        protocol: TCP
\`\`\`

---

### EndpointSlice 리소스

\`\`\`bash
# EndpointSlice 확인
kubectl get endpointslices -l kubernetes.io/service-name=my-service

# 상세 정보
kubectl describe endpointslice my-service-abc12
\`\`\`

\`\`\`yaml
# EndpointSlice 객체 구조 예시
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: my-service-abc12
  labels:
    kubernetes.io/service-name: my-service
  ownerReferences:
    - apiVersion: v1
      kind: Service
      name: my-service
addressType: IPv4
endpoints:
  - addresses:
      - "10.244.1.5"
    conditions:
      ready: true
      serving: true
      terminating: false
    nodeName: node-1
    zone: us-east-1a
  - addresses:
      - "10.244.2.8"
    conditions:
      ready: true
      serving: true
      terminating: false
    nodeName: node-2
    zone: us-east-1b
ports:
  - name: http
    port: 8080
    protocol: TCP
\`\`\`

---

### 확장성 개선

#### 기존 Endpoints의 문제점

대규모 Service(수천 개의 파드)에서 단일 Endpoints 객체가 매우 커짐:
- etcd 저장소 부담 증가
- 파드 하나 변경 시 전체 Endpoints 객체 전송
- kube-proxy, CoreDNS 등 watch하는 컴포넌트에 부하

#### EndpointSlice의 해결 방식

\`\`\`
Service (1000 파드)
├── EndpointSlice-1 (100 엔드포인트)
├── EndpointSlice-2 (100 엔드포인트)
├── ...
└── EndpointSlice-10 (100 엔드포인트)
\`\`\`

- 슬라이스당 기본 최대 100개 엔드포인트
- 변경 시 해당 슬라이스만 업데이트/전송
- 네트워크 트래픽 및 API 서버 부하 대폭 감소

---

### Service가 Endpoint를 사용하는 방식

\`\`\`
1. Service 생성 시 EndpointSlice Controller가 자동으로 EndpointSlice 생성
2. selector와 매칭되는 파드의 IP가 EndpointSlice에 등록
3. 파드가 추가/삭제되면 해당 EndpointSlice만 업데이트
4. kube-proxy가 EndpointSlice를 watch하여 iptables/IPVS 규칙 업데이트
\`\`\`

\`\`\`bash
# Service와 연결된 EndpointSlice 확인
kubectl get endpointslices -l kubernetes.io/service-name=my-service -o wide

# EndpointSlice의 엔드포인트 조건 확인
kubectl get endpointslice my-service-abc12 -o yaml
\`\`\`

### 엔드포인트 조건 (Conditions)

| 조건 | 설명 |
|------|------|
| **ready** | 파드가 트래픽을 받을 준비 완료 |
| **serving** | 파드가 트래픽을 서빙 중 (terminating 중에도 true 가능) |
| **terminating** | 파드가 종료 중 |

---

### 트러블슈팅

\`\`\`bash
# Service에 Endpoint가 없는 경우
kubectl get endpoints my-service
# -> 빈 결과: selector가 매칭하는 파드가 없음

# 파드 label 확인
kubectl get pods --show-labels

# EndpointSlice 상태 확인
kubectl get endpointslices -l kubernetes.io/service-name=my-service

# Service와 파드 selector 비교
kubectl describe svc my-service
kubectl get pods -l app=my-app

# ready 상태가 아닌 엔드포인트 확인
kubectl get endpointslice -o yaml | grep -A 3 "conditions"

# 파드의 readinessProbe 확인
kubectl describe pod my-pod | grep -A 5 "Readiness"
\`\`\`

### 일반적인 문제와 해결

| 문제 | 원인 | 해결 |
|------|------|------|
| Endpoint 없음 | selector 불일치 | 파드 label과 Service selector 확인 |
| Endpoint not ready | readinessProbe 실패 | 파드 상태 및 프로브 설정 확인 |
| 서비스 접근 불가 | targetPort 불일치 | 컨테이너 실제 리스닝 포트 확인 |
| 간헐적 연결 실패 | 일부 파드 비정상 | 개별 파드 상태 점검 |

---

### CKA 시험 핵심 포인트

- EndpointSlice는 Endpoints의 확장 가능한 대체 리소스
- \`kubernetes.io/service-name\` 레이블로 Service와 연결
- 슬라이스당 최대 100개 엔드포인트 (기본값)
- Service 디버깅 시 \`kubectl get endpoints\`와 \`kubectl get endpointslices\` 모두 확인
- selector가 없는 Service는 수동으로 Endpoint 생성 필요`,

      en: `## EndpointSlices

### Overview

EndpointSlice became GA in Kubernetes v1.21, solving the scalability limitations of the legacy Endpoints resource.
It tracks and distributes network endpoints for Services more efficiently.

---

### Endpoints vs EndpointSlices

| Property | Endpoints | EndpointSlices |
|----------|-----------|----------------|
| **API Version** | v1 (legacy) | discovery.k8s.io/v1 |
| **Max Endpoints** | Unlimited (single object) | Up to 100 per slice |
| **Scalability** | Degrades at scale | Distributed for better scalability |
| **Update Scope** | Entire object update | Only changed slices update |
| **Topology Info** | Not supported | Includes zone, nodeName, etc. |

---

### Endpoints Resource (Legacy)

\`\`\`bash
# View Endpoints
kubectl get endpoints my-service

# Detailed info
kubectl describe endpoints my-service
\`\`\`

\`\`\`yaml
# Endpoints object structure example
apiVersion: v1
kind: Endpoints
metadata:
  name: my-service
subsets:
  - addresses:
      - ip: 10.244.1.5
        nodeName: node-1
      - ip: 10.244.2.8
        nodeName: node-2
    ports:
      - port: 8080
        protocol: TCP
\`\`\`

---

### EndpointSlice Resource

\`\`\`bash
# View EndpointSlices
kubectl get endpointslices -l kubernetes.io/service-name=my-service

# Detailed info
kubectl describe endpointslice my-service-abc12
\`\`\`

\`\`\`yaml
# EndpointSlice object structure example
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: my-service-abc12
  labels:
    kubernetes.io/service-name: my-service
  ownerReferences:
    - apiVersion: v1
      kind: Service
      name: my-service
addressType: IPv4
endpoints:
  - addresses:
      - "10.244.1.5"
    conditions:
      ready: true
      serving: true
      terminating: false
    nodeName: node-1
    zone: us-east-1a
  - addresses:
      - "10.244.2.8"
    conditions:
      ready: true
      serving: true
      terminating: false
    nodeName: node-2
    zone: us-east-1b
ports:
  - name: http
    port: 8080
    protocol: TCP
\`\`\`

---

### Scalability Improvements

#### Problems with Legacy Endpoints

For large Services (thousands of Pods), a single Endpoints object becomes very large:
- Increased etcd storage pressure
- Entire Endpoints object transmitted when one Pod changes
- Heavy load on watching components (kube-proxy, CoreDNS, etc.)

#### How EndpointSlices Solve This

\`\`\`
Service (1000 Pods)
├── EndpointSlice-1 (100 endpoints)
├── EndpointSlice-2 (100 endpoints)
├── ...
└── EndpointSlice-10 (100 endpoints)
\`\`\`

- Default maximum of 100 endpoints per slice
- Only the affected slice is updated/transmitted on changes
- Dramatically reduces network traffic and API server load

---

### How Services Use Endpoints

\`\`\`
1. EndpointSlice Controller automatically creates EndpointSlices when a Service is created
2. Pod IPs matching the selector are registered in EndpointSlices
3. When Pods are added/removed, only the relevant EndpointSlice is updated
4. kube-proxy watches EndpointSlices and updates iptables/IPVS rules
\`\`\`

\`\`\`bash
# View EndpointSlices for a Service
kubectl get endpointslices -l kubernetes.io/service-name=my-service -o wide

# Check endpoint conditions in an EndpointSlice
kubectl get endpointslice my-service-abc12 -o yaml
\`\`\`

### Endpoint Conditions

| Condition | Description |
|-----------|-------------|
| **ready** | Pod is ready to receive traffic |
| **serving** | Pod is actively serving (can be true even while terminating) |
| **terminating** | Pod is shutting down |

---

### Troubleshooting

\`\`\`bash
# If a Service has no Endpoints
kubectl get endpoints my-service
# -> Empty result: no Pods match the selector

# Check Pod labels
kubectl get pods --show-labels

# Check EndpointSlice status
kubectl get endpointslices -l kubernetes.io/service-name=my-service

# Compare Service and Pod selectors
kubectl describe svc my-service
kubectl get pods -l app=my-app

# Check for not-ready endpoints
kubectl get endpointslice -o yaml | grep -A 3 "conditions"

# Verify Pod readinessProbe
kubectl describe pod my-pod | grep -A 5 "Readiness"
\`\`\`

### Common Issues and Solutions

| Issue | Cause | Resolution |
|-------|-------|------------|
| No Endpoints | Selector mismatch | Verify Pod labels match Service selector |
| Endpoint not ready | readinessProbe failing | Check Pod status and probe configuration |
| Service unreachable | targetPort mismatch | Verify the actual container listening port |
| Intermittent failures | Some Pods unhealthy | Inspect individual Pod status |

---

### CKA Exam Key Points

- EndpointSlice is the scalable replacement for Endpoints
- Linked to Services via the \`kubernetes.io/service-name\` label
- Default maximum of 100 endpoints per slice
- When debugging Services, check both \`kubectl get endpoints\` and \`kubectl get endpointslices\`
- Services without selectors require manual Endpoint creation`,
    },
  },
];
