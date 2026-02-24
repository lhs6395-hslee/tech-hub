import type { Problem, Level } from '@/types/problem';

// Beginner
import { problem as b001 } from './beginner/001-select-all';
import { problem as b002 } from './beginner/002-select-columns';
import { problem as b003 } from './beginner/003-column-alias';
import { problem as b004 } from './beginner/004-where-basic';
import { problem as b005 } from './beginner/005-where-and-or';
import { problem as b006 } from './beginner/006-between-in';
import { problem as b007 } from './beginner/007-like-pattern';
import { problem as b008 } from './beginner/008-order-by';
import { problem as b009 } from './beginner/009-limit';
import { problem as b010 } from './beginner/010-aggregate';
import { problem as b011 } from './beginner/011-insert-basic';
import { problem as b012 } from './beginner/012-update-basic';
import { problem as b013 } from './beginner/013-delete-basic';
import { problem as b014 } from './beginner/014-insert-multiple';
import { problem as b015 } from './beginner/015-update-multiple-columns';

// Intermediate
import { problem as i001 } from './intermediate/001-inner-join';
import { problem as i002 } from './intermediate/002-left-join';
import { problem as i003 } from './intermediate/003-multi-join';
import { problem as i004 } from './intermediate/004-subquery';
import { problem as i005 } from './intermediate/005-group-having';
import { problem as i006 } from './intermediate/006-case';
import { problem as i007 } from './intermediate/007-insert';
import { problem as i008 } from './intermediate/008-update';
import { problem as i009 } from './intermediate/009-delete';
import { problem as i010 } from './intermediate/010-comprehensive';
import { problem as i011 } from './intermediate/011-insert-select';
import { problem as i012 } from './intermediate/012-update-with-join';
import { problem as i013 } from './intermediate/013-delete-subquery';
import { problem as i014 } from './intermediate/014-create-table';
import { problem as i015 } from './intermediate/015-drop-table';
import { problem as i016 } from './intermediate/016-truncate';

// Advanced
import { problem as a001 } from './advanced/001-row-number';
import { problem as a002 } from './advanced/002-rank';
import { problem as a003 } from './advanced/003-running-total';
import { problem as a004 } from './advanced/004-lag-lead';
import { problem as a005 } from './advanced/005-cte-basic';
import { problem as a006 } from './advanced/006-recursive-cte';
import { problem as a007 } from './advanced/007-create-view';
import { problem as a008 } from './advanced/008-create-table';
import { problem as a009 } from './advanced/009-union';
import { problem as a010 } from './advanced/010-alter-table';
import { problem as a011 } from './advanced/011-insert-returning';
import { problem as a012 } from './advanced/012-update-from';
import { problem as a013 } from './advanced/013-create-table-as-select';
import { problem as a014 } from './advanced/014-alter-table-advanced';
import { problem as a015 } from './advanced/015-materialized-view';

// Expert
import { problem as e001 } from './expert/001-create-index';
import { problem as e002 } from './expert/002-explain';
import { problem as e003 } from './expert/003-transaction';
import { problem as e004 } from './expert/004-constraints';
import { problem as e005 } from './expert/005-upsert';
import { problem as e006 } from './expert/006-explain-analyze';
import { problem as e007 } from './expert/007-drop-recreate';
import { problem as e008 } from './expert/008-window-cte-combo';
import { problem as e009 } from './expert/009-subquery-optimization';
import { problem as e010 } from './expert/010-comprehensive-dba';
import { problem as e011 } from './expert/011-delete-using';
import { problem as e012 } from './expert/012-bulk-update-case';
import { problem as e013 } from './expert/013-create-schema';
import { problem as e014 } from './expert/014-create-sequence';
import { problem as e015 } from './expert/015-create-trigger';
import { problem as e016 } from './expert/016-grant-revoke';

// Database
import { problem as d001 } from './database/001-vacuum-analyze';
import { problem as d002 } from './database/002-pg-stat-activity';
import { problem as d003 } from './database/003-table-statistics';
import { problem as d004 } from './database/004-database-size';
import { problem as d005 } from './database/005-pg-locks';
import { problem as d006 } from './database/006-pg-settings';
import { problem as d007 } from './database/007-index-usage';
import { problem as d008 } from './database/008-connection-info';

const allProblems: Problem[] = [
  // Beginner
  b001, b002, b003, b004, b005, b006, b007, b008, b009, b010, b011, b012, b013, b014, b015,
  // Intermediate
  i001, i002, i003, i004, i005, i006, i007, i008, i009, i010, i011, i012, i013, i014, i015, i016,
  // Advanced
  a001, a002, a003, a004, a005, a006, a007, a008, a009, a010, a011, a012, a013, a014, a015,
  // Expert
  e001, e002, e003, e004, e005, e006, e007, e008, e009, e010, e011, e012, e013, e014, e015, e016,
  // Database
  d001, d002, d003, d004, d005, d006, d007, d008,
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
