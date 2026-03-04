interface K8sValidationResult {
  valid: boolean;
  error?: string;
  errorKo?: string;
}

const BLOCKED_NAMESPACES = ['kube-system', 'kube-public', 'kube-node-lease', 'default'];

const BLOCKED_PATTERNS: { pattern: RegExp; message: { ko: string; en: string } }[] = [
  {
    pattern: /\b(drain|cordon|uncordon)\b/i,
    message: {
      ko: '노드 drain/cordon 명령은 실습 환경에서 사용할 수 없습니다.',
      en: 'Node drain/cordon commands are not allowed in the lab environment.',
    },
  },
  {
    pattern: /\bdelete\s+(node|nodes)\b/i,
    message: {
      ko: '노드 삭제는 실습 환경에서 사용할 수 없습니다.',
      en: 'Deleting nodes is not allowed in the lab environment.',
    },
  },
  {
    pattern: /[;&|`$]|\$\(/,
    message: {
      ko: '쉘 특수문자(;, &, |, `, $)는 사용할 수 없습니다.',
      en: 'Shell special characters (;, &, |, `, $) are not allowed.',
    },
  },
  {
    pattern: /\bexec\b.*\b--\s*(sh|bash|\/bin\/sh|\/bin\/bash)\b/i,
    message: {
      ko: '컨테이너 쉘 접근은 실습 환경에서 사용할 수 없습니다.',
      en: 'Container shell access is not allowed in the lab environment.',
    },
  },
];

function checkNamespaceAccess(input: string, allowedNamespace: string): K8sValidationResult | null {
  // Check if user is trying to target a protected namespace
  const nsMatch = input.match(/(?:-n|--namespace)[=\s]+(\S+)/);
  if (nsMatch) {
    const targetNs = nsMatch[1];
    if (BLOCKED_NAMESPACES.includes(targetNs) && targetNs !== allowedNamespace) {
      return {
        valid: false,
        error: `Access to namespace '${targetNs}' is not allowed. Use namespace '${allowedNamespace}'.`,
        errorKo: `'${targetNs}' 네임스페이스 접근은 허용되지 않습니다. '${allowedNamespace}' 네임스페이스를 사용하세요.`,
      };
    }
  }

  // Check for --all-namespaces
  if (/--all-namespaces|-A\b/.test(input)) {
    return {
      valid: false,
      error: 'The --all-namespaces flag is not allowed in the lab environment.',
      errorKo: '--all-namespaces 플래그는 실습 환경에서 사용할 수 없습니다.',
    };
  }

  return null;
}

export function validateK8sCommand(input: string, allowedNamespace: string): K8sValidationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      valid: false,
      error: 'Please enter a kubectl command or YAML manifest.',
      errorKo: 'kubectl 명령 또는 YAML 매니페스트를 입력해주세요.',
    };
  }

  // Check each line for kubectl commands
  const lines = trimmed.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));

  for (const line of lines) {
    // Check blocked patterns
    for (const { pattern, message } of BLOCKED_PATTERNS) {
      if (pattern.test(line)) {
        return {
          valid: false,
          error: message.en,
          errorKo: message.ko,
        };
      }
    }

    // Check namespace access
    const nsResult = checkNamespaceAccess(line, allowedNamespace);
    if (nsResult) return nsResult;
  }

  return { valid: true };
}

export function validateK8sYaml(yaml: string, allowedNamespace: string): K8sValidationResult {
  const trimmed = yaml.trim();

  if (!trimmed) {
    return {
      valid: false,
      error: 'Please enter a YAML manifest.',
      errorKo: 'YAML 매니페스트를 입력해주세요.',
    };
  }

  // Check if YAML targets a blocked namespace
  const nsMatch = yaml.match(/namespace:\s*(\S+)/);
  if (nsMatch) {
    const targetNs = nsMatch[1];
    if (BLOCKED_NAMESPACES.includes(targetNs) && targetNs !== allowedNamespace) {
      return {
        valid: false,
        error: `YAML targets namespace '${targetNs}' which is not allowed. Use '${allowedNamespace}'.`,
        errorKo: `YAML이 '${targetNs}' 네임스페이스를 대상으로 합니다. '${allowedNamespace}'를 사용하세요.`,
      };
    }
  }

  return { valid: true };
}
