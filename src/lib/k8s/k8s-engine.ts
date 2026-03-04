import { execFile } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import type { K8sExecutionResult } from '@/types/k8s-problem';

const KUBECONFIG = '/etc/rancher/k3s/k3s.yaml';
const KUBECTL_TIMEOUT = 10_000;

function runCommand(
  command: string,
  args: string[],
  options?: { stdin?: string }
): Promise<K8sExecutionResult> {
  const start = Date.now();

  return new Promise((resolve) => {
    const child = execFile(
      command,
      args,
      {
        timeout: KUBECTL_TIMEOUT,
        env: { ...process.env, KUBECONFIG },
        maxBuffer: 1024 * 1024,
      },
      (error, stdout, stderr) => {
        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: error ? (error as NodeJS.ErrnoException & { code?: number }).code === null ? 1 : (error.code as unknown as number) || 1 : 0,
          executionTime: Date.now() - start,
        });
      }
    );

    if (options?.stdin && child.stdin) {
      child.stdin.write(options.stdin);
      child.stdin.end();
    }
  });
}

export async function executeKubectl(
  command: string,
  namespace?: string
): Promise<K8sExecutionResult> {
  const parts = command.trim().split(/\s+/);

  if (parts[0] === 'kubectl') {
    parts.shift();
  }

  if (namespace && !parts.includes('-n') && !parts.includes('--namespace') && !parts.includes('--all-namespaces')) {
    parts.push('-n', namespace);
  }

  return runCommand('kubectl', parts);
}

export async function applyYaml(
  yaml: string,
  namespace?: string
): Promise<K8sExecutionResult> {
  const args = ['apply', '-f', '-'];
  if (namespace) {
    args.push('-n', namespace);
  }

  return runCommand('kubectl', args, { stdin: yaml });
}

export async function deleteYaml(
  yaml: string,
  namespace?: string
): Promise<K8sExecutionResult> {
  const args = ['delete', '-f', '-', '--ignore-not-found'];
  if (namespace) {
    args.push('-n', namespace);
  }

  return runCommand('kubectl', args, { stdin: yaml });
}

export async function testK8sConnection(): Promise<{
  connected: boolean;
  error?: string;
}> {
  const result = await runCommand('kubectl', ['cluster-info', '--request-timeout=5s']);

  if (result.exitCode === 0) {
    return { connected: true };
  }

  return {
    connected: false,
    error: result.stderr || 'Failed to connect to k3s cluster',
  };
}

export async function createNamespace(namespace: string): Promise<K8sExecutionResult> {
  return runCommand('kubectl', ['create', 'namespace', namespace, '--dry-run=client', '-o', 'yaml']).then(
    async (dryRun) => {
      // Use apply so it's idempotent
      return runCommand('kubectl', ['apply', '-f', '-'], { stdin: dryRun.stdout });
    }
  );
}

export async function deleteNamespace(namespace: string): Promise<K8sExecutionResult> {
  return runCommand('kubectl', ['delete', 'namespace', namespace, '--ignore-not-found', '--wait=false']);
}

export function isYamlInput(input: string): boolean {
  const trimmed = input.trim();
  return (
    trimmed.startsWith('apiVersion:') ||
    trimmed.startsWith('kind:') ||
    trimmed.startsWith('---') ||
    /^apiVersion:\s/m.test(trimmed)
  );
}
