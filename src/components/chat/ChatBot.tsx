'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocaleStore } from '@/stores/locale-store';
import {
  MessageCircle, X, Send, Loader2, Bot, User, AlertCircle, Trash2,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export type ChatContext = 'hub' | 'database' | 'ai' | 'kubernetes';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBotProps {
  context: ChatContext;
}

/* ------------------------------------------------------------------ */
/*  i18n (per-context)                                                 */
/* ------------------------------------------------------------------ */
const chatI18nByContext: Record<ChatContext, { ko: ChatI18nStrings; en: ChatI18nStrings }> = {
  hub: {
    ko: {
      title: 'IT Tech Hub 도우미',
      subtitle: 'AI 어시스턴트',
      placeholder: '플랫폼에 대해 질문하세요...',
      send: '보내기',
      greeting:
        '안녕하세요! IT Tech Hub에 오신 것을 환영합니다. Database, AI/ML, Kubernetes 등 학습 경로 안내와 플랫폼 사용법에 대해 질문하세요.',
      errorGeneric: '오류가 발생했습니다. 다시 시도해주세요.',
      clear: '대화 초기화',
    },
    en: {
      title: 'IT Tech Hub Assistant',
      subtitle: 'AI Assistant',
      placeholder: 'Ask about the platform...',
      send: 'Send',
      greeting:
        'Welcome to IT Tech Hub! Ask me about our learning paths — Database, AI/ML, Kubernetes — or how to get started.',
      errorGeneric: 'An error occurred. Please try again.',
      clear: 'Clear chat',
    },
  },
  database: {
    ko: {
      title: 'SQL 학습 도우미',
      subtitle: 'Database AI 어시스턴트',
      placeholder: 'SQL에 대해 질문하세요...',
      send: '보내기',
      greeting:
        '안녕하세요! SQL 학습을 도와드리겠습니다. 쿼리 작성, 개념 설명, PostgreSQL/MySQL 차이점 등 무엇이든 질문하세요.',
      errorGeneric: '오류가 발생했습니다. 다시 시도해주세요.',
      clear: '대화 초기화',
    },
    en: {
      title: 'SQL Learning Assistant',
      subtitle: 'Database AI Assistant',
      placeholder: 'Ask about SQL...',
      send: 'Send',
      greeting:
        'Hello! I\'m here to help you learn SQL. Ask me anything about query writing, concepts, PostgreSQL/MySQL differences, and more.',
      errorGeneric: 'An error occurred. Please try again.',
      clear: 'Clear chat',
    },
  },
  ai: {
    ko: {
      title: 'AI/ML 학습 도우미',
      subtitle: 'AI/ML AI 어시스턴트',
      placeholder: 'AI/ML에 대해 질문하세요...',
      send: '보내기',
      greeting:
        '안녕하세요! AI와 머신러닝 학습을 도와드리겠습니다. 딥러닝, 신경망, 모델 학습 등 무엇이든 질문하세요.',
      errorGeneric: '오류가 발생했습니다. 다시 시도해주세요.',
      clear: '대화 초기화',
    },
    en: {
      title: 'AI/ML Learning Assistant',
      subtitle: 'AI/ML AI Assistant',
      placeholder: 'Ask about AI/ML...',
      send: 'Send',
      greeting:
        'Hello! I\'m here to help you learn AI and Machine Learning. Ask me anything about deep learning, neural networks, model training, and more.',
      errorGeneric: 'An error occurred. Please try again.',
      clear: 'Clear chat',
    },
  },
  kubernetes: {
    ko: {
      title: 'Kubernetes 학습 도우미',
      subtitle: 'Kubernetes AI 어시스턴트',
      placeholder: 'Kubernetes에 대해 질문하세요...',
      send: '보내기',
      greeting:
        '안녕하세요! Kubernetes 학습을 도와드리겠습니다. Pod, Service, Deployment 등 무엇이든 질문하세요.',
      errorGeneric: '오류가 발생했습니다. 다시 시도해주세요.',
      clear: '대화 초기화',
    },
    en: {
      title: 'Kubernetes Learning Assistant',
      subtitle: 'Kubernetes AI Assistant',
      placeholder: 'Ask about Kubernetes...',
      send: 'Send',
      greeting:
        'Hello! I\'m here to help you learn Kubernetes. Ask me anything about Pods, Services, Deployments, and more.',
      errorGeneric: 'An error occurred. Please try again.',
      clear: 'Clear chat',
    },
  },
};

interface ChatI18nStrings {
  title: string;
  subtitle: string;
  placeholder: string;
  send: string;
  greeting: string;
  errorGeneric: string;
  clear: string;
}

/* ------------------------------------------------------------------ */
/*  Markdown-lite renderer                                             */
/* ------------------------------------------------------------------ */
function renderMessageContent(content: string) {
  // Split by code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const match = part.match(/```(\w*)\n?([\s\S]*?)```/);
      const code = match ? match[2] : part.slice(3, -3);
      return (
        <pre
          key={i}
          className="my-2 p-3 rounded-lg bg-zinc-900 text-zinc-100 dark:bg-zinc-950
                     text-xs font-mono overflow-x-auto whitespace-pre"
        >
          {code.trim()}
        </pre>
      );
    }

    // Inline formatting
    const lines = part.split('\n');
    return (
      <span key={i}>
        {lines.map((line, j) => {
          // Bold
          let processed: React.ReactNode = line.replace(
            /\*\*(.*?)\*\*/g,
            '<b>$1</b>'
          );
          // Inline code
          processed = (processed as string).replace(
            /`([^`]+)`/g,
            '<code class="px-1 py-0.5 rounded bg-muted text-xs font-mono">$1</code>'
          );

          return (
            <span key={j}>
              {j > 0 && <br />}
              <span dangerouslySetInnerHTML={{ __html: processed as string }} />
            </span>
          );
        })}
      </span>
    );
  });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ChatBot({ context }: ChatBotProps) {
  const locale = useLocaleStore((s) => s.locale);
  const t = chatI18nByContext[context][locale];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    // Add placeholder assistant message
    const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
    setMessages([...newMessages, assistantMessage]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, context }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulated += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: accumulated,
                  };
                  return updated;
                });
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (parseErr) {
              // Skip non-JSON lines
              if (parseErr instanceof SyntaxError) continue;
              throw parseErr;
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg = err instanceof Error ? err.message : t.errorGeneric;
      setError(errorMsg);
      // Remove empty assistant message on error
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && !last.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50
                     w-14 h-14 rounded-full shadow-lg
                     bg-gradient-to-br from-blue-500 to-violet-600
                     text-white flex items-center justify-center
                     hover:scale-110 hover:shadow-xl
                     transition-all duration-300
                     animate-in fade-in zoom-in"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50
                     w-[380px] max-w-[calc(100vw-3rem)]
                     h-[560px] max-h-[calc(100vh-6rem)]
                     flex flex-col
                     rounded-2xl shadow-2xl border border-border/50
                     bg-background
                     animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50
                          bg-gradient-to-r from-blue-500/10 to-violet-500/10 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600
                              flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t.title}</h3>
                <p className="text-[10px] text-muted-foreground">{t.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"
                title={t.clear}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Greeting */}
            {messages.length === 0 && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600
                                flex items-center justify-center mt-0.5">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 bg-muted/40 rounded-2xl rounded-tl-sm px-4 py-3">
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {t.greeting}
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 ${
                    msg.role === 'user'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-gradient-to-br from-blue-500 to-violet-600'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`flex-1 max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted/40 text-foreground/80 rounded-tl-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    msg.content ? (
                      renderMessageContent(msg.content)
                    ) : (
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        {locale === 'ko' ? '생각 중...' : 'Thinking...'}
                      </span>
                    )
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-destructive/10 text-destructive text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border/50">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
                rows={1}
                disabled={isLoading}
                className="flex-1 resize-none rounded-xl border border-border/50
                           bg-muted/30 px-4 py-2.5 text-sm
                           placeholder:text-muted-foreground/60
                           focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50
                           disabled:opacity-50
                           max-h-24 min-h-[40px]"
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const el = e.target as HTMLTextAreaElement;
                  el.style.height = 'auto';
                  el.style.height = Math.min(el.scrollHeight, 96) + 'px';
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 w-10 h-10 rounded-xl
                           bg-primary text-primary-foreground
                           flex items-center justify-center
                           hover:bg-primary/90 transition-colors
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
