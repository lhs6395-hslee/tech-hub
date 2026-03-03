'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useLocaleStore } from '@/stores/locale-store';
import { k8sDocChapters, type K8sDocChapter, type K8sDocSection } from '@/data/kubernetes/docs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ChevronRight,
  BookOpen,
  PanelLeftClose,
  PanelLeft,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Copy,
  Check,
} from 'lucide-react';
import Link from 'next/link';

const LEVEL_GRADIENTS: Record<string, string> = {
  'cluster-architecture': 'from-blue-500/20 via-blue-500/5 to-transparent',
  'workloads-scheduling': 'from-emerald-500/20 via-emerald-500/5 to-transparent',
  'services-networking': 'from-cyan-500/20 via-cyan-500/5 to-transparent',
  'storage': 'from-amber-500/20 via-amber-500/5 to-transparent',
  'troubleshooting': 'from-purple-500/20 via-purple-500/5 to-transparent',
  'hands-on': 'from-rose-500/20 via-rose-500/5 to-transparent',
};

const LEVEL_BADGE_COLORS: Record<string, string> = {
  'cluster-architecture': 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20',
  'workloads-scheduling': 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  'services-networking': 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
  'storage': 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20',
  'troubleshooting': 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/20',
  'hands-on': 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/20',
};

const LEVEL_ACCENT: Record<string, string> = {
  'cluster-architecture': 'border-blue-500/40',
  'workloads-scheduling': 'border-emerald-500/40',
  'services-networking': 'border-cyan-500/40',
  'storage': 'border-amber-500/40',
  'troubleshooting': 'border-purple-500/40',
  'hands-on': 'border-rose-500/40',
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
      aria-label="Copy code"
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-500" />
      ) : (
        <Copy className="h-3 w-3 text-muted-foreground" />
      )}
    </button>
  );
}

export default function K8sDocsPage() {
  const locale = useLocaleStore((s) => s.locale);
  const [selectedChapter, setSelectedChapter] = useState<string>(k8sDocChapters[0].id);
  const [selectedSection, setSelectedSection] = useState<string>(k8sDocChapters[0].sections[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentChapter = k8sDocChapters.find((c) => c.id === selectedChapter);
  const currentSection = currentChapter?.sections.find((s) => s.id === selectedSection);

  const selectSection = (chapter: K8sDocChapter, section: K8sDocSection) => {
    setSelectedChapter(chapter.id);
    setSelectedSection(section.id);
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find prev/next section for navigation
  const allSections: { chapter: K8sDocChapter; section: K8sDocSection }[] = [];
  for (const ch of k8sDocChapters) {
    for (const sec of ch.sections) {
      allSections.push({ chapter: ch, section: sec });
    }
  }
  const currentIndex = allSections.findIndex(
    (s) => s.chapter.id === selectedChapter && s.section.id === selectedSection
  );
  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

  const sectionNumber = currentIndex + 1;
  const totalSections = allSections.length;

  const chapterSectionIndex = currentChapter?.sections.findIndex((s) => s.id === selectedSection) ?? 0;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowLeft' && prevSection) {
        selectSection(prevSection.chapter, prevSection.section);
      }
      if (e.altKey && e.key === 'ArrowRight' && nextSection) {
        selectSection(nextSection.chapter, nextSection.section);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* ─── Sidebar ─── */}
      {sidebarOpen && (
        <aside className="w-72 border-r bg-muted/10 shrink-0 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
                <BookOpen className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold leading-none">
                  {locale === 'ko' ? 'K8s 이론' : 'K8s Theory'}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {sectionNumber}/{totalSections} {locale === 'ko' ? '섹션' : 'sections'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setSidebarOpen(false)}
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>

          <div className="px-4 py-2 border-b">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${(sectionNumber / totalSections) * 100}%` }}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <Accordion
              type="multiple"
              defaultValue={[k8sDocChapters[0].id]}
              className="px-2 py-2"
            >
              {k8sDocChapters.map((chapter, chapterIdx) => (
                <AccordionItem key={chapter.id} value={chapter.id} className="border-none">
                  <AccordionTrigger className="px-2 py-2 text-sm font-medium hover:no-underline hover:bg-muted/60 rounded-lg [&[data-state=open]>svg]:text-primary">
                    <div className="flex items-center gap-2.5 text-left">
                      <span className="text-base">{chapter.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-[13px] font-semibold">{chapter.title[locale]}</p>
                        <p className="text-[10px] text-muted-foreground font-normal">
                          {chapter.sections.length} {locale === 'ko' ? '섹션' : 'sections'}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-1 pt-0">
                    <div className="ml-3 space-y-0.5">
                      {chapter.sections.map((section, secIdx) => {
                        const isActive =
                          selectedChapter === chapter.id && selectedSection === section.id;
                        let globalNum = 0;
                        for (let i = 0; i < chapterIdx; i++) {
                          globalNum += k8sDocChapters[i].sections.length;
                        }
                        globalNum += secIdx + 1;

                        return (
                          <button
                            key={section.id}
                            onClick={() => selectSection(chapter, section)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center gap-2.5 ${
                              isActive
                                ? `bg-primary/10 text-primary font-semibold border ${LEVEL_ACCENT[chapter.level]}`
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                            }`}
                          >
                            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 ${
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {globalNum}
                            </span>
                            <span className="truncate">{section.title[locale]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>

          <div className="p-3 border-t space-y-2">
            <Link href="/kubernetes/learn" className="block">
              <Button variant="default" size="sm" className="w-full text-xs gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0">
                <GraduationCap className="h-3.5 w-3.5" />
                {locale === 'ko' ? '퀴즈 풀러 가기' : 'Go to Quizzes'}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </aside>
      )}

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 py-2.5 border-b flex items-center gap-3 bg-background/80 backdrop-blur-sm">
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setSidebarOpen(true)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          )}
          {currentChapter && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Badge
                variant="outline"
                className={`text-[10px] shrink-0 ${LEVEL_BADGE_COLORS[currentChapter.level]}`}
              >
                {currentChapter.icon} {currentChapter.title[locale]}
              </Badge>
              {currentSection && (
                <>
                  <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium truncate">
                    {currentSection.title[locale]}
                  </span>
                </>
              )}
            </div>
          )}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] text-muted-foreground mr-1">
              {sectionNumber}/{totalSections}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={!prevSection}
              onClick={() => prevSection && selectSection(prevSection.chapter, prevSection.section)}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={!nextSection}
              onClick={() => nextSection && selectSection(nextSection.chapter, nextSection.section)}
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1" ref={contentRef}>
          {currentSection && currentChapter && (
            <div>
              <div className={`bg-gradient-to-b ${LEVEL_GRADIENTS[currentChapter.level]} px-6 pt-8 pb-6`}>
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-background shadow-sm border text-sm font-bold">
                      {sectionNumber}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${LEVEL_BADGE_COLORS[currentChapter.level]}`}
                    >
                      {currentChapter.icon} {currentChapter.title[locale]}
                    </Badge>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    {currentSection.title[locale]}
                  </h1>
                  <div className="flex items-center gap-1.5 mt-4">
                    {currentChapter.sections.map((sec, idx) => (
                      <button
                        key={sec.id}
                        onClick={() => selectSection(currentChapter, sec)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === chapterSectionIndex
                            ? 'w-6 bg-primary'
                            : idx < chapterSectionIndex
                              ? 'w-1.5 bg-primary/40'
                              : 'w-1.5 bg-muted-foreground/20'
                        }`}
                        title={sec.title[locale]}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="max-w-3xl mx-auto px-6 py-10">
                <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-p:leading-7 prose-li:leading-7 prose-ul:my-4 prose-ol:my-4">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({ children }) => (
                        <h2 className="flex items-center gap-3 text-xl font-bold mt-14 mb-6 pb-3 border-b border-border/60">
                          <span className="w-1.5 h-7 rounded-full bg-primary shrink-0" />
                          <span>{children}</span>
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-base font-semibold mt-10 mb-5 py-2.5 pl-4 border-l-[3px] border-primary/40 bg-muted/30 rounded-r-lg">
                          {children}
                        </h3>
                      ),
                      code: ({ children, className, ...props }) => {
                        const isInline = !className;
                        if (isInline) {
                          return (
                            <code
                              className="rounded-md bg-primary/10 text-primary px-1.5 py-0.5 text-[12px] font-mono font-semibold"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        }
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';
                        const code = String(children).replace(/\n$/, '');

                        return (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={language || 'text'}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              borderRadius: '0 0 0.5rem 0.5rem',
                              fontSize: '12px',
                              background: '#09090b',
                            }}
                            codeTagProps={{
                              style: {
                                fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
                              }
                            }}
                          >
                            {code}
                          </SyntaxHighlighter>
                        );
                      },
                      pre: ({ children, ...props }) => {
                        const codeStr =
                          typeof children === 'object' &&
                          children !== null &&
                          'props' in children
                            ? String((children as React.ReactElement<{ children?: React.ReactNode }>).props.children ?? '')
                            : '';
                        return (
                          <div className="group relative my-6">
                            {(() => {
                              const lang =
                                typeof children === 'object' &&
                                children !== null &&
                                'props' in children
                                  ? String(
                                      (children as React.ReactElement<{ className?: string }>).props.className ?? ''
                                    )
                                      .replace('language-', '')
                                      .toUpperCase()
                                  : '';
                              return (
                                <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-800 dark:bg-zinc-800/80 rounded-t-lg border-b border-zinc-700/50 flex items-center px-3 gap-1.5">
                                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                                  <span className="ml-2 text-[10px] text-zinc-400 font-mono">{lang || 'CODE'}</span>
                                </div>
                              );
                            })()}
                            <pre
                              className="rounded-lg bg-zinc-950 dark:bg-zinc-900/80 pt-10 pb-4 px-4 text-[12px] overflow-x-auto text-zinc-100 border border-zinc-700/40 [&_code]:!text-zinc-100 [&_code]:!bg-transparent [&_code]:!p-0 [&_code]:!rounded-none [&_code]:!border-0 [&_code]:!shadow-none [&_code]:!font-normal"
                              {...props}
                            >
                              {children}
                            </pre>
                            {codeStr && <CopyButton text={codeStr} />}
                          </div>
                        );
                      },
                      table: ({ children, ...props }) => (
                        <div className="my-6 overflow-x-auto rounded-lg border border-border">
                          <table className="text-xs w-full" {...props}>
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children, ...props }) => (
                        <thead className="bg-muted/60" {...props}>{children}</thead>
                      ),
                      th: ({ children, ...props }) => (
                        <th className="px-3 py-2 text-left text-xs font-semibold border-b" {...props}>
                          {children}
                        </th>
                      ),
                      td: ({ children, ...props }) => (
                        <td className="px-3 py-2 text-xs border-b border-border/50" {...props}>
                          {children}
                        </td>
                      ),
                      blockquote: ({ children }) => (
                        <div className="my-6 flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                          <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <div className="text-xs text-amber-800 dark:text-amber-200 [&>p]:m-0">
                            {children}
                          </div>
                        </div>
                      ),
                      hr: () => <Separator className="my-8" />,
                    }}
                  >
                    {currentSection.content[locale]}
                  </ReactMarkdown>
                </div>

                <Separator className="mt-10" />
                <div className="flex items-stretch gap-4 mt-6 pb-8">
                  {prevSection ? (
                    <button
                      onClick={() => selectSection(prevSection.chapter, prevSection.section)}
                      className="flex-1 group text-left p-4 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-muted/30 transition-all"
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                        <ArrowLeft className="h-3 w-3" />
                        {locale === 'ko' ? '이전' : 'Previous'}
                      </div>
                      <p className="text-sm font-semibold group-hover:text-primary transition-colors truncate">
                        {prevSection.section.title[locale]}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {prevSection.chapter.icon} {prevSection.chapter.title[locale]}
                      </p>
                    </button>
                  ) : (
                    <div className="flex-1" />
                  )}
                  {nextSection ? (
                    <button
                      onClick={() => selectSection(nextSection.chapter, nextSection.section)}
                      className="flex-1 group text-right p-4 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-muted/30 transition-all"
                    >
                      <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground mb-1">
                        {locale === 'ko' ? '다음' : 'Next'}
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <p className="text-sm font-semibold group-hover:text-primary transition-colors truncate">
                        {nextSection.section.title[locale]}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {nextSection.chapter.icon} {nextSection.chapter.title[locale]}
                      </p>
                    </button>
                  ) : (
                    <Link href="/kubernetes/learn" className="flex-1">
                      <div className="h-full group text-right p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-all">
                        <div className="flex items-center justify-end gap-1.5 text-[10px] text-blue-600 dark:text-blue-400 mb-1">
                          {locale === 'ko' ? '학습 완료!' : 'All done!'}
                          <ArrowRight className="h-3 w-3" />
                        </div>
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                          {locale === 'ko' ? '퀴즈 풀기 시작하기' : 'Start Taking Quizzes'}
                        </p>
                        <p className="text-[10px] text-blue-600/70 dark:text-blue-400/70 mt-0.5">
                          <GraduationCap className="h-3 w-3 inline mr-1" />
                          {locale === 'ko' ? '배운 내용을 복습해보세요' : 'Review what you learned'}
                        </p>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
