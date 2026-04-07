'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { DrawIoEmbed } from 'react-drawio';
import { Maximize2, Minimize2, Loader2 } from 'lucide-react';

interface DiagramEmbedProps {
  locale: 'ko' | 'en';
  src: string;
  title: { ko: string; en: string };
  description: { ko: string; en: string };
  defaultHeight?: number;
  expandedHeight?: number;
}

export default function DiagramEmbed({
  locale,
  src,
  title,
  description,
  defaultHeight = 420,
  expandedHeight = 700,
}: DiagramEmbedProps) {
  const [xml, setXml] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer — only fetch when in viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fetch drawio XML only when visible
  useEffect(() => {
    if (!visible) return;
    fetch(src)
      .then((r) => r.text())
      .then(setXml)
      .catch(() => setXml(null));
  }, [visible, src]);

  const toggleExpand = useCallback(() => setExpanded((v) => !v), []);

  return (
    <div
      ref={containerRef}
      className="not-prose my-10 rounded-2xl border border-border/50 bg-gradient-to-b from-muted/30 to-background overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div>
          <h3 className="font-bold text-lg">{title[locale]}</h3>
          <p className="text-xs text-muted-foreground">{description[locale]}</p>
        </div>
        {xml && (
          <button
            onClick={toggleExpand}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            {expanded
              ? locale === 'ko' ? '축소' : 'Collapse'
              : locale === 'ko' ? '확대' : 'Expand'}
          </button>
        )}
      </div>

      <div
        style={{ height: expanded ? expandedHeight : defaultHeight }}
        className="transition-all duration-300 relative"
      >
        {!xml || !visible ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {locale === 'ko' ? '다이어그램 렌더링 중...' : 'Rendering diagram...'}
                </div>
              </div>
            )}
            <DrawIoEmbed
              xml={xml}
              onLoad={() => setLoaded(true)}
              urlParameters={{
                spin: true,
                libraries: false,
                chrome: false,
                lightbox: false,
                nav: true,
                layers: true,
                grid: false,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
