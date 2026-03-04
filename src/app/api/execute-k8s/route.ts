import { NextRequest, NextResponse } from 'next/server';
import { validateK8sCommand, validateK8sYaml } from '@/lib/safety/k8s-validator';
import { executeKubectl, applyYaml, isYamlInput } from '@/lib/k8s/k8s-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, namespace } = body as {
      input: string;
      namespace: string;
    };

    if (!input || !namespace) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: input, namespace' },
        { status: 400 }
      );
    }

    const isYaml = isYamlInput(input);

    // Validate input
    const validation = isYaml
      ? validateK8sYaml(input, namespace)
      : validateK8sCommand(input, namespace);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error, errorKo: validation.errorKo },
        { status: 400 }
      );
    }

    if (isYaml) {
      const result = await applyYaml(input, namespace);
      return NextResponse.json({
        success: result.exitCode === 0,
        results: [result],
        error: result.exitCode !== 0 ? result.stderr : undefined,
      });
    }

    // Execute kubectl commands (one per line)
    const commands = input
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'));

    const results = [];
    for (const cmd of commands) {
      const result = await executeKubectl(cmd, namespace);
      results.push(result);

      // Stop on first error
      if (result.exitCode !== 0) {
        return NextResponse.json({
          success: false,
          results,
          error: result.stderr || 'Command failed',
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
