'use client';

import { useEffect, useRef, useCallback } from 'react';
import { EditorView, keymap, placeholder } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { sql, PostgreSQL, MySQL } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
} from '@codemirror/language';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { lineNumbers, highlightActiveLineGutter, highlightActiveLine } from '@codemirror/view';
import { useTheme } from 'next-themes';
import { useSettingsStore } from '@/stores/settings-store';
import { useTranslation } from '@/lib/i18n';

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  readOnly?: boolean;
}

export default function SqlEditor({ value, onChange, onRun, readOnly = false }: SqlEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const { resolvedTheme } = useTheme();
  const dbEngine = useSettingsStore((s) => s.dbEngine);
  const { t } = useTranslation();

  const onRunRef = useRef(onRun);
  onRunRef.current = onRun;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const createExtensions = useCallback(() => {
    const isDark = resolvedTheme === 'dark';
    const dialect = dbEngine === 'postgresql' ? PostgreSQL : MySQL;

    return [
      lineNumbers(),
      highlightActiveLineGutter(),
      highlightActiveLine(),
      history(),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      sql({ dialect }),
      syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
      ...(isDark ? [oneDark] : []),
      placeholder(t('problem.writeQuery')),
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
      EditorView.editable.of(!readOnly),
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
  }, [resolvedTheme, dbEngine, readOnly, t]);

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
    // Only recreate when theme or engine changes, not on every value change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedTheme, dbEngine, readOnly]);

  // Update content when external value changes
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
