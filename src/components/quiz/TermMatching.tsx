'use client';

import { useState, useMemo } from 'react';
import { useLocaleStore } from '@/stores/locale-store';
import { matchingSets, quizCategories } from '@/data/quiz';
import { RotateCcw, Trophy, ArrowRight, CheckCircle, XCircle, Shuffle } from 'lucide-react';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TermMatching() {
  const locale = useLocaleStore((s) => s.locale);
  const [setIndex, setSetIndex] = useState(0);
  const [shuffledDefs, setShuffledDefs] = useState<number[]>(() =>
    shuffle(matchingSets[0].pairs.map((_, i) => i))
  );
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [matches, setMatches] = useState<Map<number, number>>(new Map());
  const [wrong, setWrong] = useState<{ term: number; def: number } | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [totalSets, setTotalSets] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentSet = matchingSets[setIndex];
  const allMatched = matches.size === currentSet.pairs.length;
  const catMeta = quizCategories.find((c) => c.id === currentSet.category);

  const handleTermClick = (termIdx: number) => {
    if (matches.has(termIdx)) return;
    setSelectedTerm(termIdx);
    setWrong(null);
  };

  const handleDefClick = (defIdx: number) => {
    if (selectedTerm === null) return;
    // Check if this definition is already matched
    const matchedDefs = new Set(matches.values());
    if (matchedDefs.has(defIdx)) return;

    if (defIdx === selectedTerm) {
      // Correct match!
      setMatches((m) => {
        const next = new Map(m);
        next.set(selectedTerm, defIdx);
        return next;
      });
      setSelectedTerm(null);
      setWrong(null);
    } else {
      // Wrong match
      setWrong({ term: selectedTerm, def: defIdx });
      setTimeout(() => {
        setWrong(null);
        setSelectedTerm(null);
      }, 800);
    }
  };

  const handleNextSet = () => {
    const correctCount = matches.size;
    setTotalScore((s) => s + correctCount);
    setTotalSets((s) => s + 1);

    if (setIndex + 1 >= matchingSets.length) {
      setFinished(true);
    } else {
      const nextIdx = setIndex + 1;
      setSetIndex(nextIdx);
      setShuffledDefs(shuffle(matchingSets[nextIdx].pairs.map((_, i) => i)));
      setSelectedTerm(null);
      setMatches(new Map());
      setWrong(null);
    }
  };

  const handleRestart = () => {
    setSetIndex(0);
    setShuffledDefs(shuffle(matchingSets[0].pairs.map((_, i) => i)));
    setSelectedTerm(null);
    setMatches(new Map());
    setWrong(null);
    setTotalScore(0);
    setTotalSets(0);
    setFinished(false);
  };

  // Finished
  if (finished) {
    const totalPairs = matchingSets.reduce((s, m) => s + m.pairs.length, 0);
    const finalScore = totalScore + matches.size;
    const pct = Math.round((finalScore / totalPairs) * 100);

    return (
      <div className="max-w-md mx-auto text-center space-y-6 py-8">
        <Trophy className="h-16 w-16 mx-auto text-yellow-500" />
        <h2 className="text-2xl font-bold">
          {locale === 'ko' ? '매칭 완료!' : 'Matching Complete!'}
        </h2>
        <div className="space-y-2 text-lg">
          <p>
            {locale === 'ko' ? '정답' : 'Score'}: {finalScore} / {totalPairs} ({pct}%)
          </p>
          <p>
            {locale === 'ko' ? '완료한 세트' : 'Sets Completed'}: {matchingSets.length}
          </p>
        </div>
        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          {locale === 'ko' ? '다시 도전' : 'Try Again'}
        </button>
      </div>
    );
  }

  const matchedDefs = new Set(matches.values());

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {catMeta && (
            <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground mb-2">
              {catMeta.icon} {catMeta.name[locale]}
            </span>
          )}
          <h3 className="text-lg font-semibold">{currentSet.title[locale]}</h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {setIndex + 1} / {matchingSets.length}
        </span>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${(matches.size / currentSet.pairs.length) * 100}%` }}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        {locale === 'ko'
          ? '왼쪽에서 용어를 선택한 후, 오른쪽에서 알맞은 정의를 클릭하세요.'
          : 'Select a term on the left, then click the matching definition on the right.'}
      </p>

      {/* Matching Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Terms (left) */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            {locale === 'ko' ? '용어' : 'Terms'}
          </p>
          {currentSet.pairs.map((pair, i) => {
            const isMatched = matches.has(i);
            const isSelected = selectedTerm === i;
            const isWrongTerm = wrong?.term === i;

            let style = 'border-border bg-card hover:border-primary/50';
            if (isMatched) style = 'border-green-500 bg-green-50 dark:bg-green-950/30 opacity-60';
            else if (isWrongTerm) style = 'border-red-500 bg-red-50 dark:bg-red-950/30 animate-shake';
            else if (isSelected) style = 'border-primary bg-primary/5 ring-2 ring-primary/30';

            return (
              <button
                key={`term-${i}`}
                onClick={() => handleTermClick(i)}
                disabled={isMatched}
                className={`w-full p-3 rounded-lg border-2 text-left text-sm font-medium transition-all ${style}`}
              >
                {isMatched && <CheckCircle className="inline h-4 w-4 text-green-500 mr-2" />}
                {pair.term[locale]}
              </button>
            );
          })}
        </div>

        {/* Definitions (right, shuffled) */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            {locale === 'ko' ? '정의' : 'Definitions'}
          </p>
          {shuffledDefs.map((defIdx) => {
            const isMatched = matchedDefs.has(defIdx);
            const isWrongDef = wrong?.def === defIdx;

            let style = 'border-border bg-card hover:border-purple-400';
            if (isMatched) style = 'border-green-500 bg-green-50 dark:bg-green-950/30 opacity-60';
            else if (isWrongDef) style = 'border-red-500 bg-red-50 dark:bg-red-950/30 animate-shake';

            return (
              <button
                key={`def-${defIdx}`}
                onClick={() => handleDefClick(defIdx)}
                disabled={isMatched || selectedTerm === null}
                className={`w-full p-3 rounded-lg border-2 text-left text-sm transition-all ${style} ${
                  selectedTerm !== null && !isMatched ? 'cursor-pointer' : ''
                }`}
              >
                {isMatched && <CheckCircle className="inline h-4 w-4 text-green-500 mr-2" />}
                {currentSet.pairs[defIdx].definition[locale]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Set Button */}
      {allMatched && (
        <button
          onClick={handleNextSet}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          {setIndex + 1 >= matchingSets.length
            ? locale === 'ko'
              ? '결과 보기'
              : 'See Results'
            : locale === 'ko'
              ? '다음 세트'
              : 'Next Set'}
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
