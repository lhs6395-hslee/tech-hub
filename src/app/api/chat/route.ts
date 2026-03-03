import {
  BedrockRuntimeClient,
  ConverseStreamCommand,
  type Message,
  type ContentBlock,
} from '@aws-sdk/client-bedrock-runtime';
import { getQueryEmbedding } from '@/lib/rag/embeddings';
import { searchVectors, isRagAvailable } from '@/lib/rag/vector-store';

/* ------------------------------------------------------------------ */
/*  Bedrock Client                                                     */
/* ------------------------------------------------------------------ */
const client = new BedrockRuntimeClient({
  region: process.env.AWS_BEDROCK_REGION || process.env.AWS_REGION || 'us-east-1',
  // Credentials are loaded automatically from the default AWS profile
  // (~/.aws/credentials default profile)
});

const MODEL_ID =
  process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-sonnet-4-20250514-v1:0';

/* ------------------------------------------------------------------ */
/*  System Prompts (per learning-path context)                         */
/* ------------------------------------------------------------------ */
type ChatContext = 'hub' | 'database' | 'ai' | 'kubernetes';

const SYSTEM_PROMPTS: Record<ChatContext, string> = {
  hub: `You are the IT Tech Hub platform assistant.
Your role is to guide students through the platform and help them choose the right learning path.

## Platform Overview
IT Tech Hub is a web-based learning platform covering multiple IT technology domains:

### Available Learning Paths
1. **Database** (Available) — SQL 쿼리 작성부터 DBA 실무까지 체계적 학습
   - 70 SQL problems across 5 levels (Beginner → Expert → DBA)
   - Dual database support: PostgreSQL 16 + MySQL 8.0
   - Interactive theory docs with 22 sections
   - Real-time SQL execution and auto-grading
2. **AI / ML** (Coming Soon) — 인공지능과 머신러닝 핵심 개념 학습
3. **Kubernetes** (Coming Soon) — 컨테이너 오케스트레이션과 클라우드 네이티브 기술 학습

### Platform Features
- Bilingual support: Korean / English
- Dark / Light theme
- AI-powered chatbot assistant for each learning path
- Progress tracking with level-based unlocking

## Guidelines
- Help users understand the platform structure and choose a learning path
- Explain what each learning path covers and who it's for
- Guide users on how to get started
- Keep responses concise and friendly
- Respond in the same language the user uses (Korean or English)`,

  database: `You are a SQL/DBA learning assistant embedded in the IT Tech Hub platform.
Your role is to help students learn SQL from beginner to expert DBA level.

## Platform Context
The platform offers 70 SQL problems across 5 levels:
- Beginner (15): SELECT, WHERE, ORDER BY, LIMIT, aggregation, DML
- Intermediate (16): JOIN, Subquery, GROUP BY/HAVING, CREATE/DROP TABLE
- Advanced (15): Window Functions, CTE, Views, CTAS, Materialized Views
- Expert (16): Indexes, Transactions, Triggers, Sequences, Schema, Permissions
- Database (8): VACUUM, Monitoring, Statistics, Performance Tuning

The platform supports both PostgreSQL 16 and MySQL 8.0.

## Database Schema (E-Commerce)
- customers (id SERIAL PK, name, email, city, signup_date, is_premium)
- customer_profiles (id SERIAL PK, customer_id UNIQUE FK→customers, bio, avatar_url) — 1:1
- categories (id SERIAL PK, name, parent_id FK→categories) — self-referencing
- products (id SERIAL PK, name, price, stock, category_id FK→categories, created_at)
- orders (id SERIAL PK, customer_id FK→customers, order_date, total_amount, status)
- order_items (id SERIAL PK, order_id FK→orders, product_id FK→products, quantity, unit_price)
- reviews (id SERIAL PK, customer_id FK→customers, product_id FK→products, rating 1-5, comment, created_at)

## Guidelines
- Explain SQL concepts clearly with examples using the schema above
- Highlight PostgreSQL vs MySQL syntax differences when relevant
- Keep responses concise and educational
- Use markdown code blocks for SQL examples
- Respond in the same language the student uses (Korean or English)
- Be encouraging but honest about mistakes
- When explaining concepts, relate them to the platform's level structure
- When reference material from textbooks is provided below, use it to give more accurate and detailed answers. Cite the source when appropriate.`,

  ai: `You are an AI/ML learning assistant embedded in the IT Tech Hub platform.
Your role is to help students learn artificial intelligence and machine learning concepts.

## Topics You Cover
- Machine Learning fundamentals (supervised, unsupervised, reinforcement learning)
- Deep Learning (neural networks, CNN, RNN, Transformer)
- Natural Language Processing (NLP)
- Computer Vision
- Model training, evaluation, and optimization
- Popular frameworks (PyTorch, TensorFlow, scikit-learn)
- MLOps and model deployment

## Guidelines
- Explain AI/ML concepts clearly with practical examples
- Use code examples in Python when appropriate
- Keep responses concise and educational
- Use markdown code blocks for code examples
- Respond in the same language the student uses (Korean or English)
- Be encouraging but honest about mistakes
- Break down complex mathematical concepts into understandable explanations`,

  kubernetes: `You are a Kubernetes learning assistant embedded in the IT Tech Hub platform.
Your role is to help students learn container orchestration and cloud-native technologies.

## Topics You Cover
- Kubernetes core concepts (Pod, Service, Deployment, ReplicaSet)
- Configuration (ConfigMap, Secret)
- Storage (PersistentVolume, PersistentVolumeClaim)
- Networking (Ingress, NetworkPolicy)
- Scaling (HPA, VPA)
- Helm charts and package management
- Docker and container fundamentals
- CI/CD pipelines with Kubernetes
- Monitoring and logging (Prometheus, Grafana)

## Guidelines
- Explain Kubernetes concepts clearly with practical YAML examples
- Keep responses concise and educational
- Use markdown code blocks for YAML and CLI examples
- Respond in the same language the student uses (Korean or English)
- Be encouraging but honest about mistakes
- Relate concepts to real-world production scenarios when helpful`,
};

/* ------------------------------------------------------------------ */
/*  RAG: Retrieve relevant textbook context                            */
/* ------------------------------------------------------------------ */
async function retrieveRagContext(query: string): Promise<string> {
  if (!isRagAvailable()) return '';

  try {
    const queryEmbedding = await getQueryEmbedding(query);
    const results = searchVectors(queryEmbedding, 3);

    if (results.length === 0) return '';

    const SOURCE_LABELS: Record<string, string> = {
      'dbms-textbook': 'Database Management Systems Textbook',
      'ullman-db-complete': 'Database Systems: The Complete Book (Garcia-Molina, Ullman, Widom)',
    };

    const context = results
      .map((r, i) => {
        const src = SOURCE_LABELS[r.source] || r.source;
        return `### Reference ${i + 1} [${src}] (relevance: ${(r.score * 100).toFixed(0)}%)\n${r.text}`;
      })
      .join('\n\n');

    return `\n\n## Reference Material from Database Textbooks\nUse the following excerpts to provide more accurate answers when relevant.\n\n${context}`;
  } catch (err) {
    console.error('[RAG] Retrieval failed:', err);
    return '';
  }
}

/* ------------------------------------------------------------------ */
/*  Route Handler                                                      */
/* ------------------------------------------------------------------ */
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages;
    const context: ChatContext = body.context || 'database';

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'messages array is required' },
        { status: 400 }
      );
    }

    const systemPrompt = SYSTEM_PROMPTS[context] || SYSTEM_PROMPTS.database;

    // RAG: retrieve relevant textbook context (database context only)
    let ragContext = '';
    if (context === 'database') {
      const lastUserMessage =
        [...messages].reverse().find((m) => m.role === 'user')?.content || '';
      ragContext = await retrieveRagContext(lastUserMessage);
    }

    // Convert to Bedrock Converse format
    const bedrockMessages: Message[] = messages.map((m) => ({
      role: m.role,
      content: [{ text: m.content }] as ContentBlock[],
    }));

    const command = new ConverseStreamCommand({
      modelId: MODEL_ID,
      messages: bedrockMessages,
      system: [{ text: systemPrompt + ragContext }],
      inferenceConfig: {
        maxTokens: 2048,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    const response = await client.send(command);

    // Create SSE stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (response.stream) {
            for await (const event of response.stream) {
              if (event.contentBlockDelta) {
                const delta = event.contentBlockDelta.delta;
                if (delta && 'text' in delta && delta.text) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text: delta.text })}\n\n`)
                  );
                }
              }
              if (event.messageStop) {
                controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              }
            }
          }
        } catch (streamError) {
          console.error('Stream error:', streamError);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);

    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    // Provide helpful error messages
    if (message.includes('credentials') || message.includes('security token')) {
      return Response.json(
        {
          error:
            'AWS credentials not configured. Please set up ~/.aws/credentials with your default profile.',
        },
        { status: 500 }
      );
    }

    if (message.includes('AccessDeniedException') || message.includes('not authorized')) {
      return Response.json(
        {
          error:
            'AWS Bedrock access denied. Please enable model access in the AWS Bedrock console.',
        },
        { status: 403 }
      );
    }

    return Response.json({ error: message }, { status: 500 });
  }
}
