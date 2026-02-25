'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLocaleStore } from '@/stores/locale-store';
import { docChapters, type DocChapter, type DocSection } from '@/data/docs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import Link from 'next/link';

const LEVEL_COLORS: Record<string, string> = {
  beginner: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  intermediate: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  advanced: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  expert: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  database: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

export default function DocsPage() {
  const locale = useLocaleStore((s) => s.locale);
  const [selectedChapter, setSelectedChapter] = useState<string>(docChapters[0].id);
  const [selectedSection, setSelectedSection] = useState<string>(docChapters[0].sections[0].id);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set([docChapters[0].id])
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentChapter = docChapters.find((c) => c.id === selectedChapter);
  const currentSection = currentChapter?.sections.find((s) => s.id === selectedSection);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const selectSection = (chapter: DocChapter, section: DocSection) => {
    setSelectedChapter(chapter.id);
    setSelectedSection(section.id);
    if (!expandedChapters.has(chapter.id)) {
      setExpandedChapters((prev) => new Set([...prev, chapter.id]));
    }
  };

  // Find prev/next section for navigation
  const allSections: { chapter: DocChapter; section: DocSection }[] = [];
  for (const ch of docChapters) {
    for (const sec of ch.sections) {
      allSections.push({ chapter: ch, section: sec });
    }
  }
  const currentIndex = allSections.findIndex(
    (s) => s.chapter.id === selectedChapter && s.section.id === selectedSection
  );
  const prevSection = currentIndex > 0 ? allSections[currentIndex - 1] : null;
  const nextSection = currentIndex < allSections.length - 1 ? allSections[currentIndex + 1] : null;

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="w-72 border-r bg-muted/20 shrink-0 flex flex-col">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-semibold">
                {locale === 'ko' ? 'SQL 이론' : 'SQL Theory'}
              </span>
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
          <ScrollArea className="flex-1">
            <nav className="p-2 space-y-1">
              {docChapters.map((chapter) => {
                const isExpanded = expandedChapters.has(chapter.id);
                return (
                  <div key={chapter.id}>
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium hover:bg-muted transition-colors text-left"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      )}
                      <span className="mr-1">{chapter.icon}</span>
                      <span className="truncate flex-1">{chapter.title[locale]}</span>
                    </button>
                    {isExpanded && (
                      <div className="ml-5 pl-2 border-l border-border/50 space-y-0.5 mt-0.5 mb-1">
                        {chapter.sections.map((section) => {
                          const isActive =
                            selectedChapter === chapter.id && selectedSection === section.id;
                          return (
                            <button
                              key={section.id}
                              onClick={() => selectSection(chapter, section)}
                              className={`w-full text-left px-2 py-1 rounded-md text-xs transition-colors truncate ${
                                isActive
                                  ? 'bg-primary/10 text-primary font-medium'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }`}
                            >
                              {section.title[locale]}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </ScrollArea>
          <div className="p-3 border-t">
            <Link href="/levels/beginner">
              <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                {locale === 'ko' ? '문제 풀러 가기' : 'Go to Problems'}
                <ChevronRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="p-3 border-b flex items-center gap-2">
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
            <>
              <Badge variant="secondary" className={`text-[10px] ${LEVEL_COLORS[currentChapter.level]}`}>
                {currentChapter.title[locale]}
              </Badge>
              {currentSection && (
                <>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-medium truncate">
                    {currentSection.title[locale]}
                  </span>
                </>
              )}
            </>
          )}
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="max-w-3xl mx-auto px-6 py-8">
            {currentSection && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: ({ children, className, ...props }) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code
                            className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }
                      return (
                        <code className={`${className} text-xs`} {...props}>
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children, ...props }) => (
                      <pre
                        className="rounded-lg bg-muted/50 p-4 text-xs overflow-x-auto"
                        {...props}
                      >
                        {children}
                      </pre>
                    ),
                    table: ({ children, ...props }) => (
                      <div className="overflow-x-auto">
                        <table className="text-xs" {...props}>
                          {children}
                        </table>
                      </div>
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote
                        className="border-l-4 border-amber-400 bg-amber-500/5 pl-4 py-2 text-xs"
                        {...props}
                      >
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {currentSection.content[locale]}
                </ReactMarkdown>
              </div>
            )}

            {/* Prev / Next Navigation */}
            <div className="flex items-center justify-between mt-12 pt-6 border-t">
              {prevSection ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => selectSection(prevSection.chapter, prevSection.section)}
                >
                  <ChevronRight className="h-3 w-3 rotate-180" />
                  {prevSection.section.title[locale]}
                </Button>
              ) : (
                <div />
              )}
              {nextSection ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => selectSection(nextSection.chapter, nextSection.section)}
                >
                  {nextSection.section.title[locale]}
                  <ChevronRight className="h-3 w-3" />
                </Button>
              ) : (
                <Link href="/levels/beginner">
                  <Button size="sm" className="gap-1.5 text-xs">
                    {locale === 'ko' ? '문제 풀기 시작' : 'Start Problems'}
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
