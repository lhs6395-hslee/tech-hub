// ─── Kubernetes Quiz Data Types ───

export type K8sQuizCategory =
  | 'core-concepts'
  | 'cluster-setup'
  | 'workloads'
  | 'scheduling'
  | 'services'
  | 'networking'
  | 'storage'
  | 'troubleshooting'
  | 'security'
  | 'configuration'
  | 'monitoring';

export interface K8sOXQuestion {
  id: string;
  category: K8sQuizCategory;
  statement: { ko: string; en: string };
  answer: boolean;
  explanation: { ko: string; en: string };
}

export interface K8sMCQuestion {
  id: string;
  category: K8sQuizCategory;
  question: { ko: string; en: string };
  choices: { ko: string[]; en: string[] };
  answerIndex: number;
  explanation: { ko: string; en: string };
}

export interface K8sMatchPair {
  term: { ko: string; en: string };
  definition: { ko: string; en: string };
}

export interface K8sMatchingSet {
  id: string;
  category: K8sQuizCategory;
  title: { ko: string; en: string };
  pairs: K8sMatchPair[];
}

// ─── Category Metadata ───

export const k8sQuizCategories: {
  id: K8sQuizCategory;
  name: { ko: string; en: string };
  icon: string;
}[] = [
  { id: 'core-concepts', name: { ko: '핵심 개념', en: 'Core Concepts' }, icon: '🎯' },
  { id: 'cluster-setup', name: { ko: '클러스터 설정', en: 'Cluster Setup' }, icon: '🏗️' },
  { id: 'workloads', name: { ko: '워크로드', en: 'Workloads' }, icon: '📦' },
  { id: 'scheduling', name: { ko: '스케줄링', en: 'Scheduling' }, icon: '📋' },
  { id: 'services', name: { ko: '서비스', en: 'Services' }, icon: '🔌' },
  { id: 'networking', name: { ko: '네트워킹', en: 'Networking' }, icon: '🌐' },
  { id: 'storage', name: { ko: '스토리지', en: 'Storage' }, icon: '💾' },
  { id: 'troubleshooting', name: { ko: '트러블슈팅', en: 'Troubleshooting' }, icon: '🔍' },
  { id: 'security', name: { ko: '보안', en: 'Security' }, icon: '🛡️' },
  { id: 'configuration', name: { ko: '구성 관리', en: 'Configuration' }, icon: '⚙️' },
  { id: 'monitoring', name: { ko: '모니터링', en: 'Monitoring' }, icon: '📊' },
];

// ─── OX (True/False) Questions ───

export const k8sOXQuestions: K8sOXQuestion[] = [
  // Core Concepts
  {
    id: 'k8s-ox-01',
    category: 'core-concepts',
    statement: {
      ko: 'Pod는 항상 하나의 컨테이너만 포함할 수 있다.',
      en: 'A Pod can only contain a single container.',
    },
    answer: false,
    explanation: {
      ko: 'Pod는 하나 이상의 컨테이너를 포함할 수 있습니다. Sidecar 패턴처럼 여러 컨테이너가 같은 네트워크 네임스페이스와 볼륨을 공유하며 함께 실행됩니다.',
      en: 'A Pod can contain one or more containers. Like the sidecar pattern, multiple containers share the same network namespace and volumes.',
    },
  },
  {
    id: 'k8s-ox-02',
    category: 'core-concepts',
    statement: {
      ko: 'etcd는 Kubernetes 클러스터의 모든 상태를 저장하는 키-값 저장소이다.',
      en: 'etcd is a key-value store that holds all cluster state for Kubernetes.',
    },
    answer: true,
    explanation: {
      ko: 'etcd는 분산 키-값 저장소로 클러스터의 모든 구성 데이터와 상태를 저장합니다. API Server만 etcd에 직접 접근하며, Raft 합의 알고리즘을 사용합니다.',
      en: 'etcd is a distributed key-value store holding all cluster configuration and state. Only the API Server accesses etcd directly, and it uses the Raft consensus algorithm.',
    },
  },
  {
    id: 'k8s-ox-03',
    category: 'core-concepts',
    statement: {
      ko: 'kubelet은 컨트롤 플레인 노드에서만 실행된다.',
      en: 'kubelet runs only on control plane nodes.',
    },
    answer: false,
    explanation: {
      ko: 'kubelet은 컨트롤 플레인 노드와 워커 노드 모두에서 실행됩니다. 각 노드에서 Pod의 생명주기를 관리하는 에이전트입니다.',
      en: 'kubelet runs on both control plane and worker nodes. It is an agent on each node that manages the lifecycle of Pods.',
    },
  },
  {
    id: 'k8s-ox-04',
    category: 'core-concepts',
    statement: {
      ko: 'Namespace를 삭제하면 해당 Namespace 안의 모든 리소스도 함께 삭제된다.',
      en: 'Deleting a Namespace also deletes all resources within it.',
    },
    answer: true,
    explanation: {
      ko: 'Namespace 삭제 시 해당 Namespace에 속한 모든 리소스(Pod, Service, ConfigMap 등)가 함께 삭제됩니다. 프로덕션 환경에서 주의가 필요합니다.',
      en: 'Deleting a Namespace removes all resources (Pods, Services, ConfigMaps, etc.) within it. Exercise caution in production environments.',
    },
  },

  // Cluster Setup
  {
    id: 'k8s-ox-05',
    category: 'cluster-setup',
    statement: {
      ko: 'kubeadm init 명령은 워커 노드를 클러스터에 조인시킬 때 사용한다.',
      en: 'The kubeadm init command is used to join worker nodes to the cluster.',
    },
    answer: false,
    explanation: {
      ko: 'kubeadm init은 컨트롤 플레인을 초기화할 때 사용합니다. 워커 노드를 조인시킬 때는 kubeadm join 명령을 사용합니다.',
      en: 'kubeadm init initializes the control plane. To join worker nodes, use the kubeadm join command.',
    },
  },
  {
    id: 'k8s-ox-06',
    category: 'cluster-setup',
    statement: {
      ko: 'etcd의 백업에는 etcdctl snapshot save 명령을 사용한다.',
      en: 'The etcdctl snapshot save command is used to back up etcd.',
    },
    answer: true,
    explanation: {
      ko: 'ETCDCTL_API=3 etcdctl snapshot save <filename>으로 etcd 스냅샷을 생성합니다. 실무에서 필수적으로 알아야 하는 백업/복구 절차입니다.',
      en: 'Use ETCDCTL_API=3 etcdctl snapshot save <filename> to create an etcd snapshot. This backup/restore procedure is essential in practice.',
    },
  },
  {
    id: 'k8s-ox-07',
    category: 'cluster-setup',
    statement: {
      ko: 'kubectl은 기본적으로 $HOME/.kube/config 파일에서 클러스터 접속 정보를 읽는다.',
      en: 'kubectl reads cluster connection info from $HOME/.kube/config by default.',
    },
    answer: true,
    explanation: {
      ko: 'kubectl은 기본적으로 $HOME/.kube/config를 kubeconfig로 사용합니다. KUBECONFIG 환경변수 또는 --kubeconfig 플래그로 다른 파일을 지정할 수 있습니다.',
      en: 'kubectl uses $HOME/.kube/config as the default kubeconfig. You can specify a different file with the KUBECONFIG environment variable or --kubeconfig flag.',
    },
  },

  // Workloads
  {
    id: 'k8s-ox-08',
    category: 'workloads',
    statement: {
      ko: 'DaemonSet은 모든 노드에 Pod를 하나씩 배포한다.',
      en: 'A DaemonSet deploys exactly one Pod on every node.',
    },
    answer: true,
    explanation: {
      ko: 'DaemonSet은 클러스터의 모든(또는 특정) 노드에 Pod 하나를 보장합니다. 로그 수집기(Fluentd), 모니터링 에이전트(Node Exporter) 등에 사용됩니다.',
      en: 'A DaemonSet ensures one Pod runs on all (or specific) nodes. Used for log collectors (Fluentd), monitoring agents (Node Exporter), etc.',
    },
  },
  {
    id: 'k8s-ox-09',
    category: 'workloads',
    statement: {
      ko: 'StatefulSet의 Pod는 Deployment의 Pod와 달리 고정된 네트워크 ID를 가진다.',
      en: 'StatefulSet Pods have stable network identities, unlike Deployment Pods.',
    },
    answer: true,
    explanation: {
      ko: 'StatefulSet의 Pod는 순서화된 고정 이름(예: web-0, web-1)과 안정적인 DNS 호스트명을 가집니다. 데이터베이스와 같이 고유 식별이 필요한 워크로드에 적합합니다.',
      en: 'StatefulSet Pods have ordered, stable names (e.g., web-0, web-1) and stable DNS hostnames. Suitable for workloads requiring unique identification like databases.',
    },
  },
  {
    id: 'k8s-ox-10',
    category: 'workloads',
    statement: {
      ko: 'Deployment의 롤백은 kubectl rollout undo 명령으로 수행할 수 있다.',
      en: 'A Deployment rollback can be performed with the kubectl rollout undo command.',
    },
    answer: true,
    explanation: {
      ko: 'kubectl rollout undo deployment/<name>으로 이전 버전으로 롤백할 수 있습니다. --to-revision 플래그로 특정 리비전을 지정할 수도 있습니다.',
      en: 'Use kubectl rollout undo deployment/<name> to roll back. You can also specify a particular revision with the --to-revision flag.',
    },
  },
  {
    id: 'k8s-ox-11',
    category: 'workloads',
    statement: {
      ko: 'CronJob에서 concurrencyPolicy를 Forbid로 설정하면 이전 Job이 아직 실행 중일 때 새 Job을 건너뛴다.',
      en: 'Setting concurrencyPolicy to Forbid in a CronJob skips new Jobs if the previous one is still running.',
    },
    answer: true,
    explanation: {
      ko: 'Forbid 정책은 이전 Job이 완료되지 않았으면 새 실행을 건너뜁니다. Allow는 동시 실행을 허용하고, Replace는 이전 Job을 중단하고 새 Job을 시작합니다.',
      en: 'Forbid policy skips new execution if the previous Job has not finished. Allow permits concurrent runs, and Replace terminates the old Job and starts a new one.',
    },
  },

  // Scheduling
  {
    id: 'k8s-ox-12',
    category: 'scheduling',
    statement: {
      ko: 'nodeSelector는 nodeAffinity보다 더 세밀한 스케줄링 조건을 지정할 수 있다.',
      en: 'nodeSelector can specify more fine-grained scheduling conditions than nodeAffinity.',
    },
    answer: false,
    explanation: {
      ko: 'nodeAffinity가 nodeSelector보다 더 표현력이 풍부합니다. nodeAffinity는 In, NotIn, Exists 등 다양한 연산자와 soft/hard 조건을 지원합니다.',
      en: 'nodeAffinity is more expressive than nodeSelector. It supports operators like In, NotIn, Exists and both soft (preferred) and hard (required) conditions.',
    },
  },
  {
    id: 'k8s-ox-13',
    category: 'scheduling',
    statement: {
      ko: 'Taint가 설정된 노드에는 해당 Taint에 대한 Toleration이 없는 Pod는 스케줄링되지 않는다.',
      en: 'Pods without a matching Toleration cannot be scheduled on a node with a Taint.',
    },
    answer: true,
    explanation: {
      ko: 'Taint는 노드에 설정하여 특정 Pod를 거부합니다. Pod에 해당 Taint에 대한 Toleration이 있어야만 해당 노드에 스케줄링됩니다.',
      en: 'Taints are set on nodes to repel certain Pods. A Pod must have a matching Toleration to be scheduled on a tainted node.',
    },
  },
  {
    id: 'k8s-ox-14',
    category: 'scheduling',
    statement: {
      ko: 'Pod의 resources.requests는 스케줄러가 노드를 선택할 때 사용하고, resources.limits는 런타임에서 강제된다.',
      en: 'Pod resources.requests are used by the scheduler for node selection, while resources.limits are enforced at runtime.',
    },
    answer: true,
    explanation: {
      ko: 'requests는 스케줄러가 노드에 충분한 리소스가 있는지 판단하는 기준입니다. limits는 컨테이너가 사용할 수 있는 리소스의 상한이며, 초과 시 CPU는 쓰로틀링, 메모리는 OOMKill이 발생합니다.',
      en: 'Requests determine whether a node has enough resources for scheduling. Limits cap the resources a container can use: exceeding CPU causes throttling, exceeding memory triggers OOMKill.',
    },
  },

  // Services
  {
    id: 'k8s-ox-15',
    category: 'services',
    statement: {
      ko: 'ClusterIP 타입의 Service는 클러스터 외부에서도 접근할 수 있다.',
      en: 'A ClusterIP type Service is accessible from outside the cluster.',
    },
    answer: false,
    explanation: {
      ko: 'ClusterIP는 클러스터 내부에서만 접근 가능한 가상 IP를 할당합니다. 외부 접근이 필요하면 NodePort, LoadBalancer, 또는 Ingress를 사용해야 합니다.',
      en: 'ClusterIP assigns a virtual IP accessible only within the cluster. For external access, use NodePort, LoadBalancer, or Ingress.',
    },
  },
  {
    id: 'k8s-ox-16',
    category: 'services',
    statement: {
      ko: 'Headless Service는 clusterIP를 None으로 설정하면 생성된다.',
      en: 'A Headless Service is created by setting clusterIP to None.',
    },
    answer: true,
    explanation: {
      ko: 'clusterIP: None으로 설정하면 Headless Service가 됩니다. kube-proxy가 로드밸런싱을 하지 않고, DNS가 개별 Pod IP를 직접 반환합니다. StatefulSet과 함께 자주 사용됩니다.',
      en: 'Setting clusterIP: None creates a Headless Service. kube-proxy does not load balance, and DNS returns individual Pod IPs directly. Often used with StatefulSets.',
    },
  },
  {
    id: 'k8s-ox-17',
    category: 'services',
    statement: {
      ko: 'NodePort 타입의 Service는 30000~32767 범위의 포트를 사용한다.',
      en: 'NodePort type Services use ports in the range 30000-32767.',
    },
    answer: true,
    explanation: {
      ko: 'NodePort의 기본 포트 범위는 30000-32767입니다. 이 범위는 API Server의 --service-node-port-range 플래그로 변경할 수 있습니다.',
      en: 'The default NodePort range is 30000-32767. This range can be changed with the API Server\'s --service-node-port-range flag.',
    },
  },

  // Networking
  {
    id: 'k8s-ox-18',
    category: 'networking',
    statement: {
      ko: 'Kubernetes의 네트워크 모델에서 모든 Pod는 NAT 없이 서로 직접 통신할 수 있어야 한다.',
      en: 'In the Kubernetes network model, all Pods must be able to communicate directly without NAT.',
    },
    answer: true,
    explanation: {
      ko: 'Kubernetes 네트워크 모델의 핵심 요구사항입니다. 모든 Pod는 고유 IP를 가지며 NAT 없이 다른 Pod와 통신합니다. CNI 플러그인(Calico, Flannel 등)이 이를 구현합니다.',
      en: 'This is a core requirement of the Kubernetes network model. Every Pod gets a unique IP and communicates with other Pods without NAT. CNI plugins (Calico, Flannel, etc.) implement this.',
    },
  },
  {
    id: 'k8s-ox-19',
    category: 'networking',
    statement: {
      ko: 'NetworkPolicy가 없으면 Namespace 내의 모든 Pod 간 트래픽이 기본적으로 차단된다.',
      en: 'Without a NetworkPolicy, all traffic between Pods in a Namespace is blocked by default.',
    },
    answer: false,
    explanation: {
      ko: 'NetworkPolicy가 없으면 기본적으로 모든 ingress/egress 트래픽이 허용됩니다. NetworkPolicy를 하나라도 적용하면 해당 Pod에 대해 명시적으로 허용된 트래픽만 통과합니다.',
      en: 'Without a NetworkPolicy, all ingress/egress traffic is allowed by default. Once any NetworkPolicy is applied to a Pod, only explicitly allowed traffic is permitted.',
    },
  },
  {
    id: 'k8s-ox-20',
    category: 'networking',
    statement: {
      ko: 'Ingress 리소스를 생성하면 자동으로 외부 트래픽을 라우팅할 수 있다.',
      en: 'Creating an Ingress resource automatically routes external traffic.',
    },
    answer: false,
    explanation: {
      ko: 'Ingress 리소스만으로는 동작하지 않습니다. Ingress Controller(nginx, traefik 등)가 클러스터에 설치되어 있어야 Ingress 규칙이 실제로 적용됩니다.',
      en: 'An Ingress resource alone does not work. An Ingress Controller (nginx, traefik, etc.) must be installed in the cluster for Ingress rules to take effect.',
    },
  },

  // Storage
  {
    id: 'k8s-ox-21',
    category: 'storage',
    statement: {
      ko: 'PersistentVolume의 Reclaim Policy가 Delete이면, PVC 삭제 시 PV도 함께 삭제된다.',
      en: 'If a PersistentVolume\'s Reclaim Policy is Delete, the PV is deleted when the PVC is deleted.',
    },
    answer: true,
    explanation: {
      ko: 'Delete 정책은 PVC가 삭제되면 PV와 실제 스토리지 자원(클라우드 디스크 등)도 함께 삭제합니다. Retain 정책은 PV를 보존하고, Recycle은 더 이상 사용되지 않습니다.',
      en: 'Delete policy removes both the PV and underlying storage (cloud disk, etc.) when PVC is deleted. Retain preserves the PV, and Recycle is deprecated.',
    },
  },
  {
    id: 'k8s-ox-22',
    category: 'storage',
    statement: {
      ko: 'emptyDir 볼륨은 Pod가 삭제되면 데이터가 사라진다.',
      en: 'An emptyDir volume loses its data when the Pod is deleted.',
    },
    answer: true,
    explanation: {
      ko: 'emptyDir은 Pod의 수명과 동일합니다. 컨테이너가 재시작되어도 데이터는 유지되지만, Pod가 노드에서 제거되면 데이터가 영구적으로 삭제됩니다.',
      en: 'emptyDir has the same lifetime as the Pod. Data survives container restarts but is permanently deleted when the Pod is removed from the node.',
    },
  },
  {
    id: 'k8s-ox-23',
    category: 'storage',
    statement: {
      ko: 'StorageClass의 volumeBindingMode를 WaitForFirstConsumer로 설정하면 PVC 생성 시 즉시 PV가 바인딩된다.',
      en: 'Setting volumeBindingMode to WaitForFirstConsumer in a StorageClass binds the PV immediately when PVC is created.',
    },
    answer: false,
    explanation: {
      ko: 'WaitForFirstConsumer는 PVC를 사용하는 첫 번째 Pod가 스케줄링될 때까지 PV 바인딩을 지연합니다. 이를 통해 Pod가 스케줄링되는 노드의 토폴로지에 맞는 볼륨을 생성합니다.',
      en: 'WaitForFirstConsumer delays PV binding until the first Pod using the PVC is scheduled. This ensures the volume is created in the correct topology zone for the scheduled node.',
    },
  },

  // Troubleshooting
  {
    id: 'k8s-ox-24',
    category: 'troubleshooting',
    statement: {
      ko: 'CrashLoopBackOff 상태는 컨테이너가 반복적으로 시작에 실패하고 있음을 의미한다.',
      en: 'CrashLoopBackOff status means the container is repeatedly failing to start.',
    },
    answer: true,
    explanation: {
      ko: 'CrashLoopBackOff는 컨테이너가 시작 후 즉시 종료되는 것을 반복할 때 발생합니다. kubectl logs와 kubectl describe pod로 원인을 확인할 수 있습니다.',
      en: 'CrashLoopBackOff occurs when a container repeatedly starts and immediately exits. Use kubectl logs and kubectl describe pod to investigate the cause.',
    },
  },
  {
    id: 'k8s-ox-25',
    category: 'troubleshooting',
    statement: {
      ko: 'kubectl describe pod 명령의 Events 섹션에서 스케줄링 실패 원인을 확인할 수 있다.',
      en: 'The Events section of kubectl describe pod shows the reasons for scheduling failures.',
    },
    answer: true,
    explanation: {
      ko: 'Events 섹션에는 Pod의 스케줄링, 이미지 풀, 컨테이너 시작 등의 이벤트가 기록됩니다. FailedScheduling, ImagePullBackOff 등의 원인을 확인할 수 있습니다.',
      en: 'The Events section records scheduling, image pull, container start events, etc. You can identify causes like FailedScheduling, ImagePullBackOff, and more.',
    },
  },
  {
    id: 'k8s-ox-26',
    category: 'troubleshooting',
    statement: {
      ko: 'Pod가 Pending 상태인 경우, 항상 리소스 부족이 원인이다.',
      en: 'When a Pod is in Pending state, the cause is always insufficient resources.',
    },
    answer: false,
    explanation: {
      ko: 'Pending 상태는 리소스 부족 외에도 nodeSelector/affinity 조건 불충족, Taint/Toleration 미스매치, PVC 바인딩 대기 등 다양한 원인이 있을 수 있습니다.',
      en: 'Pending state can be caused by various reasons beyond insufficient resources: unmet nodeSelector/affinity, Taint/Toleration mismatch, PVC waiting for binding, etc.',
    },
  },
  {
    id: 'k8s-ox-27',
    category: 'troubleshooting',
    statement: {
      ko: 'kubectl exec 명령으로 실행 중인 컨테이너에 접속하여 디버깅할 수 있다.',
      en: 'You can debug a running container by connecting to it with kubectl exec.',
    },
    answer: true,
    explanation: {
      ko: 'kubectl exec -it <pod-name> -- /bin/sh로 컨테이너 내부에 접속할 수 있습니다. 멀티 컨테이너 Pod에서는 -c 플래그로 특정 컨테이너를 지정합니다.',
      en: 'Use kubectl exec -it <pod-name> -- /bin/sh to access a container. In multi-container Pods, use the -c flag to specify the target container.',
    },
  },

  // Security
  {
    id: 'k8s-ox-28',
    category: 'security',
    statement: {
      ko: 'ServiceAccount는 Namespace 범위의 리소스이다.',
      en: 'ServiceAccount is a Namespace-scoped resource.',
    },
    answer: true,
    explanation: {
      ko: 'ServiceAccount는 특정 Namespace에 속합니다. Pod가 API Server와 통신할 때 인증에 사용되며, 각 Namespace에는 기본 default ServiceAccount가 자동 생성됩니다.',
      en: 'ServiceAccount belongs to a specific Namespace. It is used for authentication when Pods communicate with the API Server. Each Namespace gets a default ServiceAccount automatically.',
    },
  },
  {
    id: 'k8s-ox-29',
    category: 'security',
    statement: {
      ko: 'Role은 클러스터 전체에 대한 권한을 정의할 수 있다.',
      en: 'A Role can define permissions across the entire cluster.',
    },
    answer: false,
    explanation: {
      ko: 'Role은 특정 Namespace 내의 권한만 정의합니다. 클러스터 전체에 대한 권한은 ClusterRole로 정의합니다. RoleBinding은 Role을 사용자에게 연결합니다.',
      en: 'A Role defines permissions within a specific Namespace only. Cluster-wide permissions are defined with ClusterRole. RoleBinding connects a Role to users.',
    },
  },
  {
    id: 'k8s-ox-30',
    category: 'security',
    statement: {
      ko: 'RBAC에서 ClusterRoleBinding을 사용하면 ClusterRole의 권한을 모든 Namespace에 적용할 수 있다.',
      en: 'Using a ClusterRoleBinding applies ClusterRole permissions across all Namespaces.',
    },
    answer: true,
    explanation: {
      ko: 'ClusterRoleBinding은 ClusterRole을 클러스터 전체에 바인딩합니다. 반면 RoleBinding으로 ClusterRole을 바인딩하면 해당 Namespace 내에서만 권한이 적용됩니다.',
      en: 'ClusterRoleBinding binds a ClusterRole cluster-wide. In contrast, binding a ClusterRole via RoleBinding restricts permissions to that specific Namespace.',
    },
  },

  // Configuration
  {
    id: 'k8s-ox-31',
    category: 'configuration',
    statement: {
      ko: 'ConfigMap의 데이터를 수정하면 해당 ConfigMap을 사용하는 모든 Pod에 자동으로 반영된다.',
      en: 'Modifying ConfigMap data is automatically reflected in all Pods using that ConfigMap.',
    },
    answer: false,
    explanation: {
      ko: 'Volume으로 마운트된 ConfigMap은 일정 시간 후 업데이트되지만, 환경변수로 주입된 ConfigMap은 Pod 재시작 없이는 반영되지 않습니다. 즉각적인 반영이 보장되지 않습니다.',
      en: 'ConfigMaps mounted as volumes are updated after some delay, but ConfigMaps injected as environment variables require a Pod restart. Immediate reflection is not guaranteed.',
    },
  },
  {
    id: 'k8s-ox-32',
    category: 'configuration',
    statement: {
      ko: 'Secret은 기본적으로 etcd에 암호화되어 저장된다.',
      en: 'Secrets are encrypted at rest in etcd by default.',
    },
    answer: false,
    explanation: {
      ko: 'Secret은 기본적으로 etcd에 base64 인코딩된 상태로 저장되며, 암호화되지 않습니다. EncryptionConfiguration을 설정해야 at-rest 암호화가 활성화됩니다.',
      en: 'By default, Secrets are stored in etcd as base64-encoded, not encrypted. You must configure EncryptionConfiguration to enable encryption at rest.',
    },
  },
  {
    id: 'k8s-ox-33',
    category: 'configuration',
    statement: {
      ko: 'ResourceQuota를 사용하면 Namespace 단위로 리소스 사용량을 제한할 수 있다.',
      en: 'ResourceQuota allows limiting resource usage at the Namespace level.',
    },
    answer: true,
    explanation: {
      ko: 'ResourceQuota는 Namespace 내에서 사용할 수 있는 총 CPU, 메모리, Pod 수, PVC 수 등을 제한합니다. LimitRange는 개별 Pod/컨테이너 단위의 기본값과 제한을 설정합니다.',
      en: 'ResourceQuota limits total CPU, memory, Pod count, PVC count, etc. within a Namespace. LimitRange sets defaults and limits at the individual Pod/container level.',
    },
  },

  // Monitoring
  {
    id: 'k8s-ox-34',
    category: 'monitoring',
    statement: {
      ko: 'kubectl top 명령을 사용하려면 Metrics Server가 클러스터에 설치되어 있어야 한다.',
      en: 'Using kubectl top requires Metrics Server to be installed in the cluster.',
    },
    answer: true,
    explanation: {
      ko: 'kubectl top은 Metrics Server에서 수집한 리소스 사용량 데이터를 보여줍니다. Metrics Server가 없으면 "metrics not available" 오류가 발생합니다.',
      en: 'kubectl top displays resource usage data collected by Metrics Server. Without Metrics Server, you get a "metrics not available" error.',
    },
  },
  {
    id: 'k8s-ox-35',
    category: 'monitoring',
    statement: {
      ko: 'HorizontalPodAutoscaler(HPA)는 CPU 사용률 외에 커스텀 메트릭도 기준으로 스케일링할 수 있다.',
      en: 'HorizontalPodAutoscaler (HPA) can scale based on custom metrics in addition to CPU utilization.',
    },
    answer: true,
    explanation: {
      ko: 'HPA v2는 CPU, 메모리 외에 커스텀 메트릭(예: RPS, 큐 길이)과 외부 메트릭을 기준으로 스케일링을 지원합니다. Custom Metrics API 어댑터가 필요합니다.',
      en: 'HPA v2 supports scaling based on custom metrics (e.g., RPS, queue length) and external metrics beyond CPU and memory. A Custom Metrics API adapter is required.',
    },
  },
  {
    id: 'k8s-ox-36',
    category: 'monitoring',
    statement: {
      ko: 'liveness probe 실패 시 kubelet은 해당 컨테이너를 재시작한다.',
      en: 'When a liveness probe fails, kubelet restarts the container.',
    },
    answer: true,
    explanation: {
      ko: 'liveness probe 실패 시 kubelet이 컨테이너를 재시작합니다. readiness probe 실패 시에는 Service의 Endpoints에서 해당 Pod를 제거하여 트래픽을 차단합니다.',
      en: 'When a liveness probe fails, kubelet restarts the container. When a readiness probe fails, the Pod is removed from Service Endpoints to stop traffic.',
    },
  },
];

// ─── Multiple Choice Questions ───

export const k8sMCQuestions: K8sMCQuestion[] = [
  // Core Concepts
  {
    id: 'k8s-mc-01',
    category: 'core-concepts',
    question: {
      ko: 'Kubernetes 컨트롤 플레인의 구성 요소가 아닌 것은?',
      en: 'Which of the following is NOT a component of the Kubernetes control plane?',
    },
    choices: {
      ko: ['kube-apiserver', 'kube-scheduler', 'kube-proxy', 'kube-controller-manager'],
      en: ['kube-apiserver', 'kube-scheduler', 'kube-proxy', 'kube-controller-manager'],
    },
    answerIndex: 2,
    explanation: {
      ko: 'kube-proxy는 각 노드에서 실행되는 네트워크 프록시로 워커 노드의 구성 요소입니다. 컨트롤 플레인은 API Server, Scheduler, Controller Manager, etcd로 구성됩니다.',
      en: 'kube-proxy is a network proxy running on each node and is a worker node component. The control plane consists of API Server, Scheduler, Controller Manager, and etcd.',
    },
  },
  {
    id: 'k8s-mc-02',
    category: 'core-concepts',
    question: {
      ko: '다음 중 Namespace 범위가 아닌(클러스터 범위) 리소스는?',
      en: 'Which of the following is a cluster-scoped (not Namespace-scoped) resource?',
    },
    choices: {
      ko: ['Pod', 'ConfigMap', 'Node', 'Service'],
      en: ['Pod', 'ConfigMap', 'Node', 'Service'],
    },
    answerIndex: 2,
    explanation: {
      ko: 'Node는 클러스터 범위 리소스입니다. PersistentVolume, ClusterRole, Namespace 자체도 클러스터 범위입니다. Pod, Service, ConfigMap 등은 Namespace 범위입니다.',
      en: 'Node is a cluster-scoped resource. PersistentVolume, ClusterRole, and Namespace itself are also cluster-scoped. Pod, Service, ConfigMap, etc. are Namespace-scoped.',
    },
  },

  // Cluster Setup
  {
    id: 'k8s-mc-03',
    category: 'cluster-setup',
    question: {
      ko: 'Kubernetes 클러스터를 업그레이드할 때 올바른 순서는?',
      en: 'What is the correct order when upgrading a Kubernetes cluster?',
    },
    choices: {
      ko: [
        'kubelet → kube-apiserver → kubectl',
        'kube-apiserver → kubelet → kubectl',
        'kubectl → kube-apiserver → kubelet',
        'kube-apiserver → kube-controller-manager → kube-scheduler → kubelet',
      ],
      en: [
        'kubelet → kube-apiserver → kubectl',
        'kube-apiserver → kubelet → kubectl',
        'kubectl → kube-apiserver → kubelet',
        'kube-apiserver → kube-controller-manager → kube-scheduler → kubelet',
      ],
    },
    answerIndex: 3,
    explanation: {
      ko: '업그레이드 순서: 컨트롤 플레인(API Server → Controller Manager → Scheduler) → 워커 노드(kubelet, kube-proxy). 한 번에 하나의 마이너 버전만 업그레이드해야 합니다.',
      en: 'Upgrade order: control plane (API Server → Controller Manager → Scheduler) → worker nodes (kubelet, kube-proxy). Only upgrade one minor version at a time.',
    },
  },
  {
    id: 'k8s-mc-04',
    category: 'cluster-setup',
    question: {
      ko: '워커 노드를 유지보수하기 위해 안전하게 Pod를 제거하는 명령은?',
      en: 'Which command safely evicts Pods from a worker node for maintenance?',
    },
    choices: {
      ko: ['kubectl delete node <name>', 'kubectl drain <name>', 'kubectl cordon <name>', 'kubectl taint <name>'],
      en: ['kubectl delete node <name>', 'kubectl drain <name>', 'kubectl cordon <name>', 'kubectl taint <name>'],
    },
    answerIndex: 1,
    explanation: {
      ko: 'kubectl drain은 노드를 Unschedulable로 표시하고 기존 Pod를 안전하게 퇴출합니다. cordon은 새 Pod 스케줄링만 차단하고, 기존 Pod는 유지합니다.',
      en: 'kubectl drain marks the node as Unschedulable and safely evicts existing Pods. cordon only prevents new Pod scheduling while keeping existing Pods.',
    },
  },

  // Workloads
  {
    id: 'k8s-mc-05',
    category: 'workloads',
    question: {
      ko: 'Deployment의 기본 업데이트 전략(strategy)은?',
      en: 'What is the default update strategy for a Deployment?',
    },
    choices: {
      ko: ['Recreate', 'RollingUpdate', 'Blue-Green', 'Canary'],
      en: ['Recreate', 'RollingUpdate', 'Blue-Green', 'Canary'],
    },
    answerIndex: 1,
    explanation: {
      ko: 'Deployment의 기본 전략은 RollingUpdate입니다. maxSurge와 maxUnavailable로 롤링 업데이트 속도를 제어합니다. Recreate는 모든 Pod를 한 번에 교체합니다.',
      en: 'The default Deployment strategy is RollingUpdate. maxSurge and maxUnavailable control the rolling update pace. Recreate replaces all Pods at once.',
    },
  },
  {
    id: 'k8s-mc-06',
    category: 'workloads',
    question: {
      ko: 'Job의 completions=5, parallelism=2로 설정했을 때의 동작은?',
      en: 'How does a Job behave with completions=5 and parallelism=2?',
    },
    choices: {
      ko: [
        '5개의 Pod를 동시에 실행',
        '2개의 Pod를 동시에 실행하여 총 5번 성공할 때까지 반복',
        '5개의 Pod를 2번 반복 실행',
        '2개의 Pod만 실행하고 종료',
      ],
      en: [
        'Run 5 Pods simultaneously',
        'Run 2 Pods concurrently until 5 total completions',
        'Run 5 Pods twice',
        'Run only 2 Pods and terminate',
      ],
    },
    answerIndex: 1,
    explanation: {
      ko: 'completions는 총 성공 횟수, parallelism은 동시에 실행할 Pod 수입니다. 최대 2개씩 동시에 실행하면서 총 5번 성공할 때까지 반복합니다.',
      en: 'completions is the total required successes, parallelism is the concurrent Pod count. It runs up to 2 Pods at a time until reaching 5 total completions.',
    },
  },

  // Scheduling
  {
    id: 'k8s-mc-07',
    category: 'scheduling',
    question: {
      ko: '특정 노드에 Pod를 강제로 배치하는 가장 간단한 방법은?',
      en: 'What is the simplest way to force a Pod onto a specific node?',
    },
    choices: {
      ko: ['nodeAffinity', 'nodeName', 'nodeSelector', 'podAffinity'],
      en: ['nodeAffinity', 'nodeName', 'nodeSelector', 'podAffinity'],
    },
    answerIndex: 1,
    explanation: {
      ko: 'nodeName은 스케줄러를 우회하여 특정 노드에 직접 Pod를 배치합니다. nodeSelector와 nodeAffinity는 레이블 기반 조건으로 스케줄러가 노드를 선택합니다.',
      en: 'nodeName bypasses the scheduler and places the Pod directly on the specified node. nodeSelector and nodeAffinity use label-based conditions for scheduler selection.',
    },
  },
  {
    id: 'k8s-mc-08',
    category: 'scheduling',
    question: {
      ko: 'Taint의 effect 중 이미 실행 중인 Pod도 강제로 퇴출하는 것은?',
      en: 'Which Taint effect forcibly evicts already running Pods?',
    },
    choices: {
      ko: ['NoSchedule', 'PreferNoSchedule', 'NoExecute', 'Evict'],
      en: ['NoSchedule', 'PreferNoSchedule', 'NoExecute', 'Evict'],
    },
    answerIndex: 2,
    explanation: {
      ko: 'NoExecute는 Toleration이 없는 실행 중인 Pod도 퇴출합니다. NoSchedule은 새 Pod만 차단하고, PreferNoSchedule은 가능하면 스케줄링을 피합니다.',
      en: 'NoExecute evicts running Pods without matching Tolerations. NoSchedule only blocks new Pods, and PreferNoSchedule is a soft preference.',
    },
  },

  // Services
  {
    id: 'k8s-mc-09',
    category: 'services',
    question: {
      ko: 'Service의 타입 중 클라우드 프로바이더의 로드밸런서를 프로비저닝하는 것은?',
      en: 'Which Service type provisions a cloud provider\'s load balancer?',
    },
    choices: {
      ko: ['ClusterIP', 'NodePort', 'LoadBalancer', 'ExternalName'],
      en: ['ClusterIP', 'NodePort', 'LoadBalancer', 'ExternalName'],
    },
    answerIndex: 2,
    explanation: {
      ko: 'LoadBalancer 타입은 클라우드 프로바이더(AWS ELB, GCP LB 등)의 외부 로드밸런서를 자동으로 프로비저닝합니다. NodePort와 ClusterIP를 자동으로 포함합니다.',
      en: 'LoadBalancer type automatically provisions an external load balancer from the cloud provider (AWS ELB, GCP LB, etc.). It automatically includes NodePort and ClusterIP.',
    },
  },
  {
    id: 'k8s-mc-10',
    category: 'services',
    question: {
      ko: 'Kubernetes DNS에서 Service의 FQDN 형식은?',
      en: 'What is the FQDN format for a Service in Kubernetes DNS?',
    },
    choices: {
      ko: [
        '<service-name>.<namespace>.pod.cluster.local',
        '<service-name>.<namespace>.svc.cluster.local',
        '<namespace>.<service-name>.svc.cluster.local',
        '<service-name>.svc.<namespace>.cluster.local',
      ],
      en: [
        '<service-name>.<namespace>.pod.cluster.local',
        '<service-name>.<namespace>.svc.cluster.local',
        '<namespace>.<service-name>.svc.cluster.local',
        '<service-name>.svc.<namespace>.cluster.local',
      ],
    },
    answerIndex: 1,
    explanation: {
      ko: 'Service의 DNS FQDN은 <service-name>.<namespace>.svc.cluster.local입니다. 같은 Namespace 내에서는 <service-name>만으로도 접근할 수 있습니다.',
      en: 'Service DNS FQDN is <service-name>.<namespace>.svc.cluster.local. Within the same Namespace, you can access it with just <service-name>.',
    },
  },

  // Networking
  {
    id: 'k8s-mc-11',
    category: 'networking',
    question: {
      ko: 'NetworkPolicy에서 빈 podSelector({})의 의미는?',
      en: 'What does an empty podSelector ({}) mean in a NetworkPolicy?',
    },
    choices: {
      ko: ['어떤 Pod도 선택하지 않음', '같은 Namespace의 모든 Pod 선택', '모든 Namespace의 모든 Pod 선택', '정책 비활성화'],
      en: ['Select no Pods', 'Select all Pods in the same Namespace', 'Select all Pods in all Namespaces', 'Disable the policy'],
    },
    answerIndex: 1,
    explanation: {
      ko: '빈 podSelector({})는 해당 Namespace의 모든 Pod에 정책을 적용합니다. spec.podSelector는 정책의 대상 Pod를, ingress/egress의 podSelector는 허용 대상을 지정합니다.',
      en: 'An empty podSelector ({}) applies the policy to all Pods in that Namespace. spec.podSelector specifies target Pods, while ingress/egress podSelector specifies allowed sources/destinations.',
    },
  },
  {
    id: 'k8s-mc-12',
    category: 'networking',
    question: {
      ko: '다음 중 Kubernetes CNI 플러그인이 아닌 것은?',
      en: 'Which of the following is NOT a Kubernetes CNI plugin?',
    },
    choices: {
      ko: ['Calico', 'Flannel', 'Istio', 'Weave Net'],
      en: ['Calico', 'Flannel', 'Istio', 'Weave Net'],
    },
    answerIndex: 2,
    explanation: {
      ko: 'Istio는 CNI 플러그인이 아니라 서비스 메시(Service Mesh)입니다. Calico, Flannel, Weave Net은 모두 Pod 네트워크를 구현하는 CNI 플러그인입니다.',
      en: 'Istio is a service mesh, not a CNI plugin. Calico, Flannel, and Weave Net are all CNI plugins that implement Pod networking.',
    },
  },

  // Storage
  {
    id: 'k8s-mc-13',
    category: 'storage',
    question: {
      ko: 'PersistentVolume의 accessModes 중 여러 노드에서 동시에 읽기/쓰기가 가능한 것은?',
      en: 'Which PersistentVolume accessMode allows simultaneous read/write from multiple nodes?',
    },
    choices: {
      ko: ['ReadWriteOnce (RWO)', 'ReadOnlyMany (ROX)', 'ReadWriteMany (RWX)', 'ReadWriteOncePod (RWOP)'],
      en: ['ReadWriteOnce (RWO)', 'ReadOnlyMany (ROX)', 'ReadWriteMany (RWX)', 'ReadWriteOncePod (RWOP)'],
    },
    answerIndex: 2,
    explanation: {
      ko: 'ReadWriteMany(RWX)는 여러 노드에서 동시에 읽기/쓰기가 가능합니다. NFS, CephFS 등이 지원합니다. RWO는 단일 노드, ROX는 여러 노드 읽기 전용, RWOP는 단일 Pod 전용입니다.',
      en: 'ReadWriteMany (RWX) allows read/write from multiple nodes simultaneously. Supported by NFS, CephFS, etc. RWO is single-node, ROX is multi-node read-only, RWOP is single-Pod.',
    },
  },
  {
    id: 'k8s-mc-14',
    category: 'storage',
    question: {
      ko: 'PVC가 Pending 상태로 남아있는 원인으로 가장 가능성이 높은 것은?',
      en: 'What is the most likely cause of a PVC remaining in Pending state?',
    },
    choices: {
      ko: ['Pod가 아직 생성되지 않음', '조건에 맞는 PV가 없음', 'Namespace에 권한이 없음', 'Service가 연결되지 않음'],
      en: ['Pod has not been created yet', 'No matching PV available', 'Namespace lacks permissions', 'Service is not connected'],
    },
    answerIndex: 1,
    explanation: {
      ko: 'PVC가 Pending인 주요 원인은 용량, accessModes, StorageClass가 일치하는 PV가 없거나 StorageClass의 동적 프로비저닝이 실패한 경우입니다.',
      en: 'PVC stays Pending mainly when there is no PV matching the capacity, accessModes, or StorageClass, or when dynamic provisioning by the StorageClass fails.',
    },
  },

  // Troubleshooting
  {
    id: 'k8s-mc-15',
    category: 'troubleshooting',
    question: {
      ko: 'Pod의 이전 컨테이너 로그를 확인하는 명령은?',
      en: 'Which command shows logs from a previous container instance in a Pod?',
    },
    choices: {
      ko: ['kubectl logs <pod> --all', 'kubectl logs <pod> --previous', 'kubectl logs <pod> --history', 'kubectl logs <pod> --old'],
      en: ['kubectl logs <pod> --all', 'kubectl logs <pod> --previous', 'kubectl logs <pod> --history', 'kubectl logs <pod> --old'],
    },
    answerIndex: 1,
    explanation: {
      ko: '--previous (-p) 플래그는 이전에 종료된 컨테이너의 로그를 보여줍니다. CrashLoopBackOff 디버깅에 필수적인 명령입니다.',
      en: 'The --previous (-p) flag shows logs from the previously terminated container. This is essential for debugging CrashLoopBackOff issues.',
    },
  },
  {
    id: 'k8s-mc-16',
    category: 'troubleshooting',
    question: {
      ko: 'Pod가 ImagePullBackOff 상태일 때 확인해야 할 사항이 아닌 것은?',
      en: 'Which is NOT a likely cause when a Pod is in ImagePullBackOff state?',
    },
    choices: {
      ko: ['이미지 이름의 오타', '프라이빗 레지스트리 인증 실패', 'imagePullSecret 미설정', 'Pod의 CPU 리소스 부족'],
      en: ['Typo in image name', 'Private registry authentication failure', 'Missing imagePullSecret', 'Insufficient Pod CPU resources'],
    },
    answerIndex: 3,
    explanation: {
      ko: 'ImagePullBackOff는 이미지를 가져올 수 없을 때 발생합니다. 이미지 이름 오류, 레지스트리 인증 실패, imagePullSecret 누락 등이 원인입니다. CPU 리소스와는 관계가 없습니다.',
      en: 'ImagePullBackOff occurs when the image cannot be pulled. Common causes: wrong image name, registry auth failure, missing imagePullSecret. CPU resources are unrelated.',
    },
  },

  // Security
  {
    id: 'k8s-mc-17',
    category: 'security',
    question: {
      ko: 'RBAC에서 특정 리소스에 대한 권한을 정의하는 필드가 아닌 것은?',
      en: 'Which field is NOT used to define permissions on specific resources in RBAC?',
    },
    choices: {
      ko: ['apiGroups', 'resources', 'verbs', 'subjects'],
      en: ['apiGroups', 'resources', 'verbs', 'subjects'],
    },
    answerIndex: 3,
    explanation: {
      ko: 'Role/ClusterRole의 rules에는 apiGroups, resources, verbs를 정의합니다. subjects는 RoleBinding/ClusterRoleBinding에서 권한을 부여할 대상(User, Group, ServiceAccount)을 지정합니다.',
      en: 'Role/ClusterRole rules define apiGroups, resources, and verbs. subjects is used in RoleBinding/ClusterRoleBinding to specify the target (User, Group, ServiceAccount).',
    },
  },
  {
    id: 'k8s-mc-18',
    category: 'security',
    question: {
      ko: 'Pod의 보안 컨텍스트에서 runAsNonRoot: true 설정의 효과는?',
      en: 'What is the effect of setting runAsNonRoot: true in a Pod\'s security context?',
    },
    choices: {
      ko: [
        '컨테이너를 항상 root로 실행',
        '컨테이너가 root(UID 0)로 실행되면 시작을 거부',
        '모든 파일 시스템 접근을 차단',
        '네트워크 접근을 제한',
      ],
      en: [
        'Always run the container as root',
        'Reject container startup if it runs as root (UID 0)',
        'Block all filesystem access',
        'Restrict network access',
      ],
    },
    answerIndex: 1,
    explanation: {
      ko: 'runAsNonRoot: true는 컨테이너가 UID 0(root)으로 실행되는 것을 방지합니다. 이미지의 USER가 root이거나 지정되지 않으면 Pod 시작이 실패합니다.',
      en: 'runAsNonRoot: true prevents the container from running as UID 0 (root). If the image USER is root or unspecified, the Pod fails to start.',
    },
  },

  // Configuration
  {
    id: 'k8s-mc-19',
    category: 'configuration',
    question: {
      ko: 'ConfigMap을 Pod에서 사용하는 방법이 아닌 것은?',
      en: 'Which is NOT a way to consume a ConfigMap in a Pod?',
    },
    choices: {
      ko: ['환경변수로 주입', '볼륨으로 마운트', 'Command line 인자로 전달', 'Init Container로 실행'],
      en: ['Inject as environment variables', 'Mount as a volume', 'Pass as command line arguments', 'Run as an Init Container'],
    },
    answerIndex: 3,
    explanation: {
      ko: 'ConfigMap은 환경변수(envFrom/valueFrom), 볼륨 마운트, 커맨드 인자로 사용할 수 있습니다. Init Container로 실행하는 것은 ConfigMap의 사용 방법이 아닙니다.',
      en: 'ConfigMaps can be used as environment variables (envFrom/valueFrom), volume mounts, and command arguments. Running as an Init Container is not a ConfigMap consumption method.',
    },
  },
  {
    id: 'k8s-mc-20',
    category: 'configuration',
    question: {
      ko: 'LimitRange와 ResourceQuota의 차이점으로 올바른 것은?',
      en: 'What correctly describes the difference between LimitRange and ResourceQuota?',
    },
    choices: {
      ko: [
        'LimitRange는 클러스터 범위, ResourceQuota는 Namespace 범위',
        'LimitRange는 개별 Pod/컨테이너 제한, ResourceQuota는 Namespace 총량 제한',
        'LimitRange는 CPU만, ResourceQuota는 메모리만 제한',
        'LimitRange는 실행 중에 적용, ResourceQuota는 생성 시에만 적용',
      ],
      en: [
        'LimitRange is cluster-scoped, ResourceQuota is Namespace-scoped',
        'LimitRange limits individual Pods/containers, ResourceQuota limits Namespace totals',
        'LimitRange limits CPU only, ResourceQuota limits memory only',
        'LimitRange applies at runtime, ResourceQuota applies only at creation',
      ],
    },
    answerIndex: 1,
    explanation: {
      ko: 'LimitRange는 개별 Pod/컨테이너의 기본 리소스 요청/제한을 설정합니다. ResourceQuota는 Namespace 전체의 총 리소스 사용량을 제한합니다. 둘 다 Namespace 범위입니다.',
      en: 'LimitRange sets default resource requests/limits for individual Pods/containers. ResourceQuota limits total resource usage for the entire Namespace. Both are Namespace-scoped.',
    },
  },

  // Monitoring
  {
    id: 'k8s-mc-21',
    category: 'monitoring',
    question: {
      ko: 'readiness probe와 liveness probe의 차이로 올바른 것은?',
      en: 'What correctly describes the difference between readiness and liveness probes?',
    },
    choices: {
      ko: [
        'readiness 실패 시 컨테이너 재시작, liveness 실패 시 트래픽 차단',
        'readiness 실패 시 트래픽 차단, liveness 실패 시 컨테이너 재시작',
        '둘 다 실패 시 컨테이너를 재시작',
        '둘 다 실패 시 트래픽만 차단',
      ],
      en: [
        'readiness failure restarts container, liveness failure blocks traffic',
        'readiness failure blocks traffic, liveness failure restarts container',
        'Both restart the container on failure',
        'Both only block traffic on failure',
      ],
    },
    answerIndex: 1,
    explanation: {
      ko: 'readiness probe 실패 시 Service Endpoints에서 제거하여 트래픽을 차단합니다. liveness probe 실패 시 kubelet이 컨테이너를 재시작합니다.',
      en: 'readiness probe failure removes the Pod from Service Endpoints to block traffic. liveness probe failure causes kubelet to restart the container.',
    },
  },
  {
    id: 'k8s-mc-22',
    category: 'monitoring',
    question: {
      ko: 'HPA가 Pod를 스케일 아웃하는 기본 조건은?',
      en: 'What is the default condition for HPA to scale out Pods?',
    },
    choices: {
      ko: [
        '현재 메트릭 값이 목표값의 50%를 초과할 때',
        '현재 메트릭 값이 목표값을 초과할 때',
        '현재 메트릭 값이 목표값의 200%를 초과할 때',
        '1분간 목표값을 연속으로 초과할 때',
      ],
      en: [
        'When current metric exceeds 50% of target',
        'When current metric exceeds the target value',
        'When current metric exceeds 200% of target',
        'When target is exceeded continuously for 1 minute',
      ],
    },
    answerIndex: 1,
    explanation: {
      ko: 'HPA는 desiredReplicas = ceil(currentReplicas * (currentMetricValue / targetValue)) 공식으로 필요 레플리카를 계산합니다. 현재 값이 목표를 초과하면 스케일 아웃합니다.',
      en: 'HPA calculates desired replicas with: desiredReplicas = ceil(currentReplicas * (currentMetricValue / targetValue)). It scales out when the current value exceeds the target.',
    },
  },
];

// ─── Term Matching Sets ───

export const k8sMatchingSets: K8sMatchingSet[] = [
  {
    id: 'k8s-match-01',
    category: 'workloads',
    title: { ko: '컨트롤러 타입 매칭', en: 'Controller Types' },
    pairs: [
      {
        term: { ko: 'Deployment', en: 'Deployment' },
        definition: { ko: '무상태 애플리케이션의 선언적 업데이트와 롤링 배포 관리', en: 'Declarative updates and rolling deployments for stateless applications' },
      },
      {
        term: { ko: 'ReplicaSet', en: 'ReplicaSet' },
        definition: { ko: '지정된 수의 Pod 복제본을 유지 (Deployment가 내부적으로 사용)', en: 'Maintains a specified number of Pod replicas (used internally by Deployment)' },
      },
      {
        term: { ko: 'DaemonSet', en: 'DaemonSet' },
        definition: { ko: '모든(또는 특정) 노드에 Pod를 하나씩 배포', en: 'Runs one Pod on every (or selected) node' },
      },
      {
        term: { ko: 'StatefulSet', en: 'StatefulSet' },
        definition: { ko: '고정 네트워크 ID와 안정적인 스토리지를 가진 상태 유지 워크로드', en: 'Stateful workloads with stable network IDs and persistent storage' },
      },
      {
        term: { ko: 'Job', en: 'Job' },
        definition: { ko: '한 번 실행하고 성공적으로 완료되면 종료되는 배치 작업', en: 'Batch tasks that run once and terminate upon successful completion' },
      },
    ],
  },
  {
    id: 'k8s-match-02',
    category: 'services',
    title: { ko: 'Service 타입 매칭', en: 'Service Types' },
    pairs: [
      {
        term: { ko: 'ClusterIP', en: 'ClusterIP' },
        definition: { ko: '클러스터 내부에서만 접근 가능한 가상 IP (기본 타입)', en: 'Virtual IP accessible only within the cluster (default type)' },
      },
      {
        term: { ko: 'NodePort', en: 'NodePort' },
        definition: { ko: '각 노드의 고정 포트(30000-32767)로 외부 접근 허용', en: 'Allows external access via a fixed port (30000-32767) on each node' },
      },
      {
        term: { ko: 'LoadBalancer', en: 'LoadBalancer' },
        definition: { ko: '클라우드 프로바이더의 외부 로드밸런서를 자동 프로비저닝', en: 'Auto-provisions an external load balancer from the cloud provider' },
      },
      {
        term: { ko: 'ExternalName', en: 'ExternalName' },
        definition: { ko: 'CNAME 레코드를 반환하여 외부 서비스로 DNS 리다이렉트', en: 'Returns a CNAME record to DNS-redirect to an external service' },
      },
    ],
  },
  {
    id: 'k8s-match-03',
    category: 'troubleshooting',
    title: { ko: 'Pod 상태 원인 매칭', en: 'Pod Status Reasons' },
    pairs: [
      {
        term: { ko: 'CrashLoopBackOff', en: 'CrashLoopBackOff' },
        definition: { ko: '컨테이너가 반복적으로 시작 후 즉시 종료됨', en: 'Container repeatedly starts and immediately exits' },
      },
      {
        term: { ko: 'ImagePullBackOff', en: 'ImagePullBackOff' },
        definition: { ko: '컨테이너 이미지를 레지스트리에서 가져오지 못함', en: 'Failed to pull container image from registry' },
      },
      {
        term: { ko: 'Pending', en: 'Pending' },
        definition: { ko: '스케줄링 대기 중 (리소스 부족, 조건 미충족 등)', en: 'Waiting for scheduling (insufficient resources, unmet conditions, etc.)' },
      },
      {
        term: { ko: 'OOMKilled', en: 'OOMKilled' },
        definition: { ko: '메모리 제한을 초과하여 커널의 OOM Killer에 의해 종료됨', en: 'Terminated by kernel OOM Killer for exceeding memory limit' },
      },
      {
        term: { ko: 'ErrImageNeverPull', en: 'ErrImageNeverPull' },
        definition: { ko: 'imagePullPolicy가 Never인데 노드에 이미지가 없음', en: 'imagePullPolicy is Never but image is not present on the node' },
      },
    ],
  },
  {
    id: 'k8s-match-04',
    category: 'core-concepts',
    title: { ko: 'Kubernetes 도메인 매칭', en: 'Kubernetes Domains' },
    pairs: [
      {
        term: { ko: '클러스터 아키텍처, 설치 및 구성', en: 'Cluster Architecture, Installation & Configuration' },
        definition: { ko: 'kubeadm, etcd 백업/복구, RBAC, 클러스터 업그레이드', en: 'kubeadm, etcd backup/restore, RBAC, cluster upgrades' },
      },
      {
        term: { ko: '워크로드 및 스케줄링', en: 'Workloads & Scheduling' },
        definition: { ko: 'Deployment, Pod 스케줄링, ConfigMap/Secret, 리소스 관리', en: 'Deployment, Pod scheduling, ConfigMap/Secret, resource management' },
      },
      {
        term: { ko: '서비스 및 네트워킹', en: 'Services & Networking' },
        definition: { ko: 'Service 타입, Ingress, CoreDNS, NetworkPolicy', en: 'Service types, Ingress, CoreDNS, NetworkPolicy' },
      },
      {
        term: { ko: '스토리지', en: 'Storage' },
        definition: { ko: 'PV/PVC, StorageClass, 볼륨 타입과 접근 모드', en: 'PV/PVC, StorageClass, volume types and access modes' },
      },
      {
        term: { ko: '트러블슈팅', en: 'Troubleshooting' },
        definition: { ko: '클러스터/노드 로그, Pod 디버깅, 네트워크 문제 해결', en: 'Cluster/node logs, Pod debugging, network troubleshooting' },
      },
    ],
  },
  {
    id: 'k8s-match-05',
    category: 'storage',
    title: { ko: '볼륨 타입 매칭', en: 'Volume Types' },
    pairs: [
      {
        term: { ko: 'emptyDir', en: 'emptyDir' },
        definition: { ko: 'Pod 수명과 동일, 컨테이너 간 임시 데이터 공유', en: 'Same lifetime as Pod, temporary data sharing between containers' },
      },
      {
        term: { ko: 'hostPath', en: 'hostPath' },
        definition: { ko: '호스트 노드의 파일 시스템 경로를 Pod에 마운트', en: 'Mounts a path from the host node filesystem into the Pod' },
      },
      {
        term: { ko: 'PersistentVolume (PV)', en: 'PersistentVolume (PV)' },
        definition: { ko: '클러스터 수준의 영구 스토리지, Pod 수명과 독립적', en: 'Cluster-level persistent storage, independent of Pod lifecycle' },
      },
      {
        term: { ko: 'CSI (Container Storage Interface)', en: 'CSI (Container Storage Interface)' },
        definition: { ko: '서드파티 스토리지 드라이버를 플러그인으로 연결하는 표준 인터페이스', en: 'Standard interface for plugging in third-party storage drivers' },
      },
    ],
  },
  {
    id: 'k8s-match-06',
    category: 'security',
    title: { ko: 'RBAC 개념 매칭', en: 'RBAC Concepts' },
    pairs: [
      {
        term: { ko: 'Role', en: 'Role' },
        definition: { ko: '특정 Namespace 내의 리소스에 대한 권한 정의', en: 'Defines permissions for resources within a specific Namespace' },
      },
      {
        term: { ko: 'ClusterRole', en: 'ClusterRole' },
        definition: { ko: '클러스터 전체 또는 비-Namespace 리소스에 대한 권한 정의', en: 'Defines permissions cluster-wide or for non-namespaced resources' },
      },
      {
        term: { ko: 'RoleBinding', en: 'RoleBinding' },
        definition: { ko: 'Role 또는 ClusterRole을 특정 Namespace 내 사용자에게 연결', en: 'Binds a Role or ClusterRole to users within a specific Namespace' },
      },
      {
        term: { ko: 'ClusterRoleBinding', en: 'ClusterRoleBinding' },
        definition: { ko: 'ClusterRole을 클러스터 전체 범위로 사용자에게 연결', en: 'Binds a ClusterRole to users across the entire cluster' },
      },
    ],
  },
  {
    id: 'k8s-match-07',
    category: 'monitoring',
    title: { ko: 'Probe 타입 매칭', en: 'Probe Types' },
    pairs: [
      {
        term: { ko: 'startupProbe', en: 'startupProbe' },
        definition: { ko: '컨테이너 초기화 완료 여부 확인, 성공 전까지 다른 프로브 비활성화', en: 'Checks if container initialization is complete, disables other probes until success' },
      },
      {
        term: { ko: 'livenessProbe', en: 'livenessProbe' },
        definition: { ko: '컨테이너 정상 동작 확인, 실패 시 컨테이너 재시작', en: 'Checks if container is running properly, restarts on failure' },
      },
      {
        term: { ko: 'readinessProbe', en: 'readinessProbe' },
        definition: { ko: '트래픽 수신 준비 여부 확인, 실패 시 Service Endpoints에서 제거', en: 'Checks readiness to receive traffic, removes from Service Endpoints on failure' },
      },
    ],
  },
  {
    id: 'k8s-match-08',
    category: 'scheduling',
    title: { ko: 'Taint Effect 매칭', en: 'Taint Effects' },
    pairs: [
      {
        term: { ko: 'NoSchedule', en: 'NoSchedule' },
        definition: { ko: 'Toleration 없는 새 Pod의 스케줄링을 완전히 차단', en: 'Completely blocks scheduling of new Pods without matching Toleration' },
      },
      {
        term: { ko: 'PreferNoSchedule', en: 'PreferNoSchedule' },
        definition: { ko: '가능하면 스케줄링을 피하지만, 다른 노드가 없으면 허용', en: 'Avoids scheduling if possible, but allows it if no other nodes are available' },
      },
      {
        term: { ko: 'NoExecute', en: 'NoExecute' },
        definition: { ko: '새 Pod 차단 + Toleration 없는 기존 실행 중인 Pod도 퇴출', en: 'Blocks new Pods and evicts already running Pods without matching Toleration' },
      },
    ],
  },
  {
    id: 'k8s-match-09',
    category: 'configuration',
    title: { ko: 'QoS 클래스 매칭', en: 'QoS Classes' },
    pairs: [
      {
        term: { ko: 'Guaranteed', en: 'Guaranteed' },
        definition: { ko: '모든 컨테이너의 requests와 limits가 동일하게 설정됨 (우선순위 최고)', en: 'All containers have equal requests and limits set (highest priority)' },
      },
      {
        term: { ko: 'Burstable', en: 'Burstable' },
        definition: { ko: 'requests와 limits가 다르거나, 일부 컨테이너만 설정됨 (중간 우선순위)', en: 'Requests and limits differ, or only some containers have them set (medium priority)' },
      },
      {
        term: { ko: 'BestEffort', en: 'BestEffort' },
        definition: { ko: 'requests와 limits가 전혀 설정되지 않음 (OOM 시 가장 먼저 종료)', en: 'No requests or limits set at all (first to be killed on OOM)' },
      },
    ],
  },
  {
    id: 'k8s-match-10',
    category: 'networking',
    title: { ko: 'NetworkPolicy 개념 매칭', en: 'NetworkPolicy Concepts' },
    pairs: [
      {
        term: { ko: 'ingress 규칙', en: 'Ingress Rules' },
        definition: { ko: '대상 Pod로 들어오는 인바운드 트래픽 제어', en: 'Controls inbound traffic entering the target Pod' },
      },
      {
        term: { ko: 'egress 규칙', en: 'Egress Rules' },
        definition: { ko: '대상 Pod에서 나가는 아웃바운드 트래픽 제어', en: 'Controls outbound traffic leaving the target Pod' },
      },
      {
        term: { ko: 'podSelector', en: 'podSelector' },
        definition: { ko: '레이블 기반으로 같은 Namespace 내 특정 Pod를 선택', en: 'Selects specific Pods within the same Namespace by label' },
      },
      {
        term: { ko: 'namespaceSelector', en: 'namespaceSelector' },
        definition: { ko: '레이블 기반으로 특정 Namespace의 모든 Pod를 허용/차단', en: 'Allows/blocks all Pods from specific Namespaces by label' },
      },
    ],
  },
];
