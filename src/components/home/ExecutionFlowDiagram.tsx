'use client';

import { useState, useEffect, useCallback } from 'react';
import { DrawIoEmbed } from 'react-drawio';
import { Maximize2, Minimize2 } from 'lucide-react';

interface Props {
  locale: 'ko' | 'en';
}

export default function ExecutionFlowDiagram({ locale }: Props) {
  const [xml, setXml] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch('/diagrams/execution-flow.drawio')
      .then((r) => r.text())
      .then(setXml)
      .catch(() => setXml(null));
  }, []);

  const toggleExpand = useCallback(() => setExpanded((v) => !v), []);

  if (!xml) return null;

  return (
    <div className="not-prose my-10 rounded-2xl border border-border/50 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div>
          <h3 className="font-bold text-lg">
            {locale === 'ko' ? 'SQL Execution Flow' : 'SQL Execution Flow'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {locale === 'ko'
              ? '쿼리가 실행되는 전체 과정을 확인하세요'
              : 'See the complete query execution process'}
          </p>
        </div>
        <button
          onClick={toggleExpand}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                     bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          {expanded
            ? locale === 'ko' ? '축소' : 'Collapse'
            : locale === 'ko' ? '확대' : 'Expand'}
        </button>
      </div>

      {/* draw.io embed */}
      <div style={{ height: expanded ? 500 : 300 }} className="transition-all duration-300">
        <DrawIoEmbed
          xml={xml}
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
      </div>
    </div>
  );
}
