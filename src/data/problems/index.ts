import type { Problem, Level } from '@/types/problem';

import { problem as p001 } from './beginner/001-select-all';
import { problem as p002 } from './beginner/002-select-columns';
import { problem as p003 } from './beginner/003-column-alias';
import { problem as p004 } from './beginner/004-where-basic';
import { problem as p005 } from './beginner/005-where-and-or';
import { problem as p006 } from './beginner/006-between-in';
import { problem as p007 } from './beginner/007-like-pattern';
import { problem as p008 } from './beginner/008-order-by';
import { problem as p009 } from './beginner/009-limit';
import { problem as p010 } from './beginner/010-aggregate';

const allProblems: Problem[] = [
  p001,
  p002,
  p003,
  p004,
  p005,
  p006,
  p007,
  p008,
  p009,
  p010,
];

export function getAllProblems(): Problem[] {
  return allProblems;
}

export function getProblemsByLevel(level: Level): Problem[] {
  return allProblems.filter((p) => p.level === level);
}

export function getProblemById(id: string): Problem | undefined {
  return allProblems.find((p) => p.id === id);
}

export function getNextProblem(currentId: string): Problem | undefined {
  const idx = allProblems.findIndex((p) => p.id === currentId);
  return idx >= 0 && idx < allProblems.length - 1
    ? allProblems[idx + 1]
    : undefined;
}
