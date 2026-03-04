import { executeKubectl } from '@/lib/k8s/k8s-engine';
import type { VerificationStep, K8sGradingResult, K8sVerificationDetail } from '@/types/k8s-problem';

function normalizeOutput(output: string): string {
  return output
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n')
    .toLowerCase();
}

function checkExpected(actual: string, expected: string): boolean {
  const normalizedActual = normalizeOutput(actual);
  const normalizedExpected = normalizeOutput(expected);

  // Exact match
  if (normalizedActual === normalizedExpected) return true;

  // Check if expected is contained in actual (for partial matches)
  if (normalizedActual.includes(normalizedExpected)) return true;

  // Check line-by-line containment
  const expectedLines = normalizedExpected.split('\n');
  return expectedLines.every((line) => normalizedActual.includes(line));
}

export async function gradeK8sSolution(
  verificationSteps: VerificationStep[],
  namespace: string
): Promise<K8sGradingResult> {
  const details: K8sVerificationDetail[] = [];
  let passedCount = 0;

  for (const step of verificationSteps) {
    const result = await executeKubectl(step.command, namespace);
    const actual = result.stdout || result.stderr;
    const passed = result.exitCode === 0 && checkExpected(actual, step.expected);

    details.push({
      description: step.description,
      passed,
      expected: step.expected,
      actual: actual || '(no output)',
    });

    if (passed) passedCount++;
  }

  const total = verificationSteps.length;
  const score = total > 0 ? Math.round((passedCount / total) * 100) : 0;
  const correct = passedCount === total;

  return {
    correct,
    score,
    message: correct
      ? { ko: '정답입니다! 모든 검증을 통과했습니다.', en: 'Correct! All verifications passed.' }
      : {
          ko: `${total}개 검증 중 ${passedCount}개 통과했습니다.`,
          en: `Passed ${passedCount} of ${total} verifications.`,
        },
    details,
  };
}
