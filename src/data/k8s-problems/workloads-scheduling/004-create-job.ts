import type { K8sProblem } from '@/types/k8s-problem';

export const problem: K8sProblem = {
  id: 'workloads-scheduling-004',
  domain: 'workloads-scheduling',
  order: 4,
  title: {
    ko: 'Job 생성하기',
    en: 'Create a Job',
  },
  description: {
    ko: `## 시나리오

원주율(Pi)을 소수점 100자리까지 계산하는 일회성 작업을 실행해야 합니다.

### 요구사항

1. \`math-job\`이라는 이름의 Job을 생성하세요.
2. 이미지는 \`perl:5.34\`를 사용하세요.
3. 실행할 명령: \`perl -Mbignum=bpi -wle "print bpi(100)"\`

### 참고
- \`kubectl create job\` 명령을 사용하여 Job을 생성할 수 있습니다.
- 컨테이너에서 실행할 명령은 \`--\` 뒤에 지정합니다.
- Job은 작업이 완료되면 Pod가 종료됩니다.`,
    en: `## Scenario

You need to run a one-time task that calculates Pi to 100 decimal places.

### Requirements

1. Create a Job named \`math-job\`.
2. Use the \`perl:5.34\` image.
3. Command to run: \`perl -Mbignum=bpi -wle "print bpi(100)"\`

### Notes
- You can use the \`kubectl create job\` command to create a Job.
- Specify the command to run in the container after \`--\`.
- A Job's Pod terminates once the task is complete.`,
  },
  category: 'Job',
  difficulty: 2,
  hints: {
    ko: [
      'kubectl create job 명령에 --image 플래그와 -- 뒤에 실행할 명령을 지정하세요.',
      'kubectl create job math-job --image=perl:5.34 -- perl -Mbignum=bpi -wle "print bpi(100)"',
      '또는 YAML에서 spec.template.spec.containers[0].command를 설정하세요.',
    ],
    en: [
      'Use the --image flag with kubectl create job and specify the command after --.',
      'kubectl create job math-job --image=perl:5.34 -- perl -Mbignum=bpi -wle "print bpi(100)"',
      'Or in YAML, set spec.template.spec.containers[0].command.',
    ],
  },
  explanation: {
    ko: `## Job 생성

\`\`\`bash
kubectl create job math-job --image=perl:5.34 -- perl -Mbignum=bpi -wle "print bpi(100)"
\`\`\`

### 주요 개념
- **Job**은 하나 이상의 Pod를 생성하고 지정된 수의 Pod가 성공적으로 종료될 때까지 실행합니다.
- Job은 배치 처리, 데이터 마이그레이션 등 일회성 작업에 적합합니다.
- \`completions\`로 성공해야 하는 Pod 수를, \`parallelism\`으로 동시 실행 수를 설정할 수 있습니다.
- Job이 완료된 후에도 Pod와 로그는 유지되어 결과를 확인할 수 있습니다.`,
    en: `## Creating a Job

\`\`\`bash
kubectl create job math-job --image=perl:5.34 -- perl -Mbignum=bpi -wle "print bpi(100)"
\`\`\`

### Key Concepts
- A **Job** creates one or more Pods and runs them until a specified number of Pods successfully terminate.
- Jobs are ideal for one-time tasks like batch processing and data migration.
- Use \`completions\` to set the number of Pods that must succeed, and \`parallelism\` for concurrent execution.
- After a Job completes, Pods and logs are retained so you can inspect the results.`,
  },
  setupCommands: [],
  verificationSteps: [
    {
      command: 'get job math-job -o jsonpath={.metadata.name}',
      expected: 'math-job',
      description: {
        ko: 'math-job Job이 존재하는지 확인',
        en: 'Verify math-job Job exists',
      },
    },
    {
      command: 'get job math-job -o jsonpath={.spec.template.spec.containers[0].image}',
      expected: 'perl:5.34',
      description: {
        ko: '이미지가 perl:5.34인지 확인',
        en: 'Verify image is perl:5.34',
      },
    },
  ],
  cleanupCommands: ['delete job math-job --ignore-not-found'],
  namespace: 'lab-workloads-004',
  editorMode: 'both',
  expectedAnswer: 'kubectl create job math-job --image=perl:5.34 -- perl -Mbignum=bpi -wle "print bpi(100)"',
};
