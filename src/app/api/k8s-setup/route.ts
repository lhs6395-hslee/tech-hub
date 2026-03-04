import { NextRequest, NextResponse } from 'next/server';
import {
  executeKubectl,
  createNamespace,
  deleteNamespace,
} from '@/lib/k8s/k8s-engine';
import { gradeK8sSolution } from '@/lib/grading/k8s-grader';
import { getK8sProblemById } from '@/data/k8s-problems';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, problemId } = body as {
      action: 'setup' | 'verify' | 'cleanup';
      problemId: string;
    };

    if (!action || !problemId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: action, problemId' },
        { status: 400 }
      );
    }

    const problem = getK8sProblemById(problemId);
    if (!problem) {
      return NextResponse.json(
        { success: false, error: `Problem not found: ${problemId}` },
        { status: 404 }
      );
    }

    const { namespace } = problem;

    switch (action) {
      case 'setup': {
        // Create namespace
        await createNamespace(namespace);

        // Execute setup commands
        for (const cmd of problem.setupCommands) {
          const result = await executeKubectl(cmd, namespace);
          if (result.exitCode !== 0) {
            return NextResponse.json({
              success: false,
              error: `Setup failed: ${result.stderr}`,
            });
          }
        }

        return NextResponse.json({ success: true });
      }

      case 'verify': {
        const gradingResult = await gradeK8sSolution(
          problem.verificationSteps,
          namespace
        );

        return NextResponse.json({
          success: true,
          result: gradingResult,
        });
      }

      case 'cleanup': {
        // Execute cleanup commands
        for (const cmd of problem.cleanupCommands) {
          await executeKubectl(cmd, namespace);
        }

        // Delete namespace
        await deleteNamespace(namespace);

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
