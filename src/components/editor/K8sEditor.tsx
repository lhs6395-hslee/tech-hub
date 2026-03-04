'use client';

import { useEffect, useRef, useCallback } from 'react';
import { EditorView, keymap, placeholder } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { yaml } from '@codemirror/lang-yaml';
import { oneDark } from '@codemirror/theme-one-dark';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
} from '@codemirror/language';
import { closeBrackets } from '@codemirror/autocomplete';
import { lineNumbers, highlightActiveLineGutter, highlightActiveLine } from '@codemirror/view';
import { useTheme } from 'next-themes';
import { useLocaleStore } from '@/stores/locale-store';
import type { K8sEditorMode } from '@/types/k8s-problem';

interface K8sEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  editorMode: K8sEditorMode;
  activeTab: 'kubectl' | 'yaml';
}

export default function K8sEditor({
  value,
  onChange,
  onRun,
  editorMode,
  activeTab,
}: K8sEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { resolvedTheme } = useTheme();
  const locale = useLocaleStore((s) => s.locale);

  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const isYamlTab = activeTab === 'yaml';

  const createExtensions = useCallback(() => {
    const isDark = resolvedTheme === 'dark';
    const placeholderText = isYamlTab
      ? locale === 'ko'
        ? 'YAML 매니페스트를 입력하세요...'
        : 'Enter YAML manifest...'
      : locale === 'ko'
        ? 'kubectl 명령을 입력하세요...'
        : 'Enter kubectl commands...';

    return [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      history(),
      bracketMatching(),
      closeBrackets(),
      ...(isYamlTab ? [yaml()] : []),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      ...(isDark ? [oneDark] : []),
      placeholder(placeholderText),
      keymap.of([
        {
          key: 'Ctrl-Enter',
          mac: 'Cmd-Enter',
          run: () => {
            onRunRef.current();
            return true;
          },
        },
        ...defaultKeymap,
        ...historyKeymap,
      ]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChangeRef.current(update.state.doc.toString());
        }
      }),
      EditorView.theme({
        '&': {
          fontSize: '14px',
          height: '100%',
        },
        '.cm-scroller': {
          fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
          overflow: 'auto',
        },
        '.cm-content': {
          minHeight: '150px',
          padding: '8px 0',
        },
        '.cm-gutters': {
          borderRight: '1px solid var(--border)',
        },
      }),
    ];
  }, [resolvedTheme, isYamlTab, locale]);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: createExtensions(),
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme, isYamlTab]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentValue = view.state.doc.toString();
    if (currentValue !== value) {
      view.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      ref={editorRef}
      className="h-full min-h-[200px] rounded-md border border-border bg-background overflow-hidden"
    />
  );
}
