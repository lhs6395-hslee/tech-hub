// ─── Quiz Data Types ───

export type QuizCategory =
  | 'relational-model'
  | 'sql-basics'
  | 'normalization'
  | 'relational-algebra'
  | 'transactions'
  | 'indexing'
  | 'query-processing'
  | 'recovery'
  | 'storage';

export interface OXQuestion {
  id: string;
  category: QuizCategory;
  statement: { ko: string; en: string };
  answer: boolean;
  explanation: { ko: string; en: string };
}

export interface MCQuestion {
  id: string;
  category: QuizCategory;
  question: { ko: string; en: string };
  choices: { ko: string[]; en: string[] };
  answerIndex: number;
  explanation: { ko: string; en: string };
}

export interface MatchPair {
  term: { ko: string; en: string };
  definition: { ko: string; en: string };
}

export interface MatchingSet {
  id: string;
  category: QuizCategory;
  title: { ko: string; en: string };
  pairs: MatchPair[];
}

// ─── Category Metadata ───

export const quizCategories: {
  id: QuizCategory;
  name: { ko: string; en: string };
  icon: string;
}[] = [
  { id: 'relational-model', name: { ko: '관계형 모델', en: 'Relational Model' }, icon: '🗂️' },
  { id: 'sql-basics', name: { ko: 'SQL 기초', en: 'SQL Basics' }, icon: '📝' },
  { id: 'normalization', name: { ko: '정규화', en: 'Normalization' }, icon: '🔧' },
  { id: 'relational-algebra', name: { ko: '관계 대수', en: 'Relational Algebra' }, icon: '🔣' },
  { id: 'transactions', name: { ko: '트랜잭션', en: 'Transactions' }, icon: '🔒' },
  { id: 'indexing', name: { ko: '인덱스', en: 'Indexing' }, icon: '📇' },
  { id: 'query-processing', name: { ko: '쿼리 처리', en: 'Query Processing' }, icon: '⚙️' },
  { id: 'recovery', name: { ko: '복구', en: 'Recovery' }, icon: '🔄' },
  { id: 'storage', name: { ko: '스토리지', en: 'Storage' }, icon: '💾' },
];

// ─── OX (True/False) Questions ───

export const oxQuestions: OXQuestion[] = [
  // Relational Model
  {
    id: 'ox-01',
    category: 'relational-model',
    statement: {
      ko: 'PRIMARY KEY는 NULL 값을 허용한다.',
      en: 'A PRIMARY KEY allows NULL values.',
    },
    answer: false,
    explanation: {
      ko: 'PRIMARY KEY는 NOT NULL + UNIQUE 제약을 모두 포함합니다. NULL을 허용하지 않습니다.',
      en: 'PRIMARY KEY includes both NOT NULL and UNIQUE constraints. It does not allow NULL.',
    },
  },
  {
    id: 'ox-02',
    category: 'relational-model',
    statement: {
      ko: '외래 키(Foreign Key)는 반드시 다른 테이블의 기본 키를 참조해야 한다.',
      en: 'A Foreign Key must always reference a Primary Key of another table.',
    },
    answer: false,
    explanation: {
      ko: '외래 키는 다른 테이블의 PRIMARY KEY 또는 UNIQUE 제약이 있는 컬럼을 참조할 수 있습니다.',
      en: 'A Foreign Key can reference either a PRIMARY KEY or a column with a UNIQUE constraint.',
    },
  },
  {
    id: 'ox-03',
    category: 'relational-model',
    statement: {
      ko: '약한 엔터티(Weak Entity)는 소유 엔터티 없이 독립적으로 존재할 수 있다.',
      en: 'A Weak Entity can exist independently without its owner entity.',
    },
    answer: false,
    explanation: {
      ko: '약한 엔터티는 자체 기본키가 없어 소유 엔터티의 키에 의존합니다. 소유 엔터티가 삭제되면 함께 삭제됩니다.',
      en: 'A weak entity has no primary key of its own and depends on the owner entity. It is deleted when the owner is deleted.',
    },
  },
  {
    id: 'ox-04',
    category: 'relational-model',
    statement: {
      ko: 'N:M 관계를 구현하려면 중간 테이블(Junction Table)이 필요하다.',
      en: 'Implementing an N:M relationship requires a Junction Table.',
    },
    answer: true,
    explanation: {
      ko: 'N:M 관계는 양쪽 테이블의 FK를 포함하는 중간 테이블로 구현합니다. 예: order_items가 orders와 products를 연결.',
      en: 'N:M relationships are implemented via a junction table containing FKs from both tables. e.g., order_items connects orders and products.',
    },
  },

  // SQL Basics
  {
    id: 'ox-05',
    category: 'sql-basics',
    statement: {
      ko: 'WHERE절은 GROUP BY 이후에 실행된다.',
      en: 'The WHERE clause executes after GROUP BY.',
    },
    answer: false,
    explanation: {
      ko: 'WHERE는 GROUP BY 전에 행을 필터링합니다. 그룹화 후 필터링은 HAVING을 사용합니다.',
      en: 'WHERE filters rows before GROUP BY. Use HAVING to filter after grouping.',
    },
  },
  {
    id: 'ox-06',
    category: 'sql-basics',
    statement: {
      ko: 'LEFT JOIN은 왼쪽 테이블의 모든 행을 포함하고, 매칭되지 않는 오른쪽 컬럼은 NULL이 된다.',
      en: 'LEFT JOIN includes all rows from the left table, with NULLs for non-matching right columns.',
    },
    answer: true,
    explanation: {
      ko: 'LEFT (OUTER) JOIN은 왼쪽 테이블의 모든 행을 보존합니다. 오른쪽 테이블에 매칭이 없으면 NULL로 채워집니다.',
      en: 'LEFT (OUTER) JOIN preserves all rows from the left table. Non-matching right-side columns are filled with NULL.',
    },
  },
  {
    id: 'ox-07',
    category: 'sql-basics',
    statement: {
      ko: 'NOT IN 서브쿼리에서 결과에 NULL이 포함되면, 전체 결과가 비어버릴 수 있다.',
      en: 'If a NOT IN subquery result contains NULL, the entire result set may become empty.',
    },
    answer: true,
    explanation: {
      ko: 'NOT IN은 내부적으로 != ALL로 변환됩니다. NULL과의 비교는 UNKNOWN이므로 전체 조건이 UNKNOWN이 되어 행이 반환되지 않습니다. NOT EXISTS 사용이 권장됩니다.',
      en: 'NOT IN translates to != ALL internally. Comparison with NULL yields UNKNOWN, making the whole condition UNKNOWN and returning no rows. Use NOT EXISTS instead.',
    },
  },

  // Normalization
  {
    id: 'ox-08',
    category: 'normalization',
    statement: {
      ko: '3NF를 만족하는 릴레이션은 항상 BCNF도 만족한다.',
      en: 'A relation in 3NF always satisfies BCNF as well.',
    },
    answer: false,
    explanation: {
      ko: 'BCNF는 3NF보다 엄격합니다. "모든 결정자가 후보키"여야 하므로, 3NF를 만족해도 BCNF를 위반할 수 있습니다.',
      en: 'BCNF is stricter than 3NF. It requires "every determinant is a candidate key," so a 3NF relation can still violate BCNF.',
    },
  },
  {
    id: 'ox-09',
    category: 'normalization',
    statement: {
      ko: '함수적 종속 A → B에서, A를 결정자(Determinant)라고 한다.',
      en: 'In functional dependency A → B, A is called the Determinant.',
    },
    answer: true,
    explanation: {
      ko: 'A → B에서 A는 결정자(Determinant), B는 종속자(Dependent)입니다. A의 값이 B의 값을 유일하게 결정합니다.',
      en: 'In A → B, A is the Determinant and B is the Dependent. The value of A uniquely determines the value of B.',
    },
  },
  {
    id: 'ox-10',
    category: 'normalization',
    statement: {
      ko: '무손실 분해(Lossless Decomposition)란 분해된 테이블을 자연 조인하면 원래 데이터를 정확히 복원할 수 있는 것이다.',
      en: 'Lossless Decomposition means natural-joining the decomposed tables exactly restores the original data.',
    },
    answer: true,
    explanation: {
      ko: '무손실 분해에서는 정보 손실 없이 원래 릴레이션을 복원할 수 있습니다. R1 ∩ R2 → R1 또는 R2이면 무손실입니다.',
      en: 'In lossless decomposition, the original relation can be restored without information loss. If R1 ∩ R2 → R1 or R2, it is lossless.',
    },
  },

  // Relational Algebra
  {
    id: 'ox-11',
    category: 'relational-algebra',
    statement: {
      ko: '관계 대수에서 사영(Projection, π)은 중복 행을 자동으로 제거한다.',
      en: 'In relational algebra, Projection (π) automatically eliminates duplicate rows.',
    },
    answer: true,
    explanation: {
      ko: '관계 대수는 집합(set) 기반이므로 사영 결과에서 중복이 제거됩니다. SQL의 SELECT DISTINCT에 해당합니다.',
      en: 'Relational algebra is set-based, so projection results have no duplicates. Equivalent to SQL\'s SELECT DISTINCT.',
    },
  },
  {
    id: 'ox-12',
    category: 'relational-algebra',
    statement: {
      ko: '조인 교환 법칙에 의해 R ⋈ S = S ⋈ R이 항상 성립한다.',
      en: 'The join commutativity law states R ⋈ S = S ⋈ R always holds.',
    },
    answer: true,
    explanation: {
      ko: '자연 조인은 교환 법칙이 성립합니다. 옵티마이저는 이 법칙을 이용해 조인 순서를 변경하여 최적화합니다.',
      en: 'Natural join is commutative. The optimizer uses this law to reorder joins for optimization.',
    },
  },

  // Transactions
  {
    id: 'ox-13',
    category: 'transactions',
    statement: {
      ko: 'SERIALIZABLE 격리 수준은 Dirty Read, Non-Repeatable Read, Phantom Read를 모두 방지한다.',
      en: 'SERIALIZABLE isolation level prevents Dirty Read, Non-Repeatable Read, and Phantom Read.',
    },
    answer: true,
    explanation: {
      ko: 'SERIALIZABLE은 가장 높은 격리 수준으로 모든 이상 현상을 방지합니다. 대신 동시성이 가장 낮습니다.',
      en: 'SERIALIZABLE is the highest isolation level, preventing all anomalies at the cost of lowest concurrency.',
    },
  },
  {
    id: 'ox-14',
    category: 'transactions',
    statement: {
      ko: '교착 상태(Deadlock)는 2단계 잠금(2PL) 프로토콜에서 발생할 수 없다.',
      en: 'Deadlocks cannot occur under the Two-Phase Locking (2PL) protocol.',
    },
    answer: false,
    explanation: {
      ko: '2PL은 직렬 가능성을 보장하지만, 교착 상태는 여전히 발생할 수 있습니다. 별도의 교착 상태 감지/방지 메커니즘이 필요합니다.',
      en: '2PL guarantees serializability but deadlocks can still occur. Separate deadlock detection/prevention mechanisms are needed.',
    },
  },
  {
    id: 'ox-15',
    category: 'transactions',
    statement: {
      ko: '충돌 직렬 가능성 판별에서, 선행 그래프에 사이클이 없으면 해당 스케줄은 직렬 가능하다.',
      en: 'In conflict serializability testing, if the precedence graph has no cycle, the schedule is serializable.',
    },
    answer: true,
    explanation: {
      ko: '선행 그래프(Precedence Graph)에 사이클이 없으면 충돌 직렬 가능, 사이클이 있으면 비직렬 가능입니다.',
      en: 'If the precedence graph has no cycle, it is conflict-serializable. If it has a cycle, it is not.',
    },
  },

  // Indexing
  {
    id: 'ox-16',
    category: 'indexing',
    statement: {
      ko: 'B-tree 인덱스는 범위 검색(BETWEEN)을 지원하지만, 해시 인덱스는 지원하지 않는다.',
      en: 'B-tree indexes support range queries (BETWEEN) but hash indexes do not.',
    },
    answer: true,
    explanation: {
      ko: 'B-tree의 리프 노드는 연결 리스트로 연결되어 범위 검색이 가능합니다. 해시 인덱스는 등호(=) 검색만 O(1)로 지원합니다.',
      en: 'B-tree leaf nodes are linked, enabling range scans. Hash indexes only support equality (=) lookups in O(1).',
    },
  },
  {
    id: 'ox-17',
    category: 'indexing',
    statement: {
      ko: '복합 인덱스 (A, B)에서 WHERE B = 5 조건만으로는 인덱스를 활용할 수 없다.',
      en: 'A composite index (A, B) cannot be used with just a WHERE B = 5 condition.',
    },
    answer: true,
    explanation: {
      ko: '복합 인덱스는 선두 열(Leading Column)부터 사용해야 합니다. (A, B) 인덱스에서 B만 조건으로 사용하면 인덱스를 타지 못합니다.',
      en: 'Composite indexes must be used starting from the leading column. Using only B in an (A, B) index skips the index.',
    },
  },

  // Query Processing
  {
    id: 'ox-18',
    category: 'query-processing',
    statement: {
      ko: 'Hash Join은 범위 조건(<, >)의 조인에도 사용할 수 있다.',
      en: 'Hash Join can be used for range condition (<, >) joins.',
    },
    answer: false,
    explanation: {
      ko: 'Hash Join은 등호(=) 조인에만 사용할 수 있습니다. 범위 조인에는 Nested Loop 또는 Merge Join을 사용합니다.',
      en: 'Hash Join only works for equality (=) joins. Range joins use Nested Loop or Merge Join.',
    },
  },
  {
    id: 'ox-19',
    category: 'query-processing',
    statement: {
      ko: '옵티마이저의 카디널리티 추정이 부정확하면 잘못된 실행 계획이 선택될 수 있다.',
      en: 'Inaccurate cardinality estimation by the optimizer can lead to choosing a wrong execution plan.',
    },
    answer: true,
    explanation: {
      ko: '카디널리티 추정은 비용 기반 최적화의 핵심입니다. ANALYZE를 실행하여 통계를 최신으로 유지해야 합니다.',
      en: 'Cardinality estimation is key to cost-based optimization. Run ANALYZE to keep statistics up to date.',
    },
  },

  // Recovery
  {
    id: 'ox-20',
    category: 'recovery',
    statement: {
      ko: 'WAL(Write-Ahead Logging)에서는 데이터를 디스크에 쓰기 전에 로그를 먼저 디스크에 써야 한다.',
      en: 'In WAL (Write-Ahead Logging), the log must be written to disk before the data.',
    },
    answer: true,
    explanation: {
      ko: 'WAL의 핵심 원칙입니다. 로그가 먼저 기록되어야 장애 시 REDO/UNDO가 가능합니다.',
      en: 'This is the core WAL principle. Logging first enables REDO/UNDO during crash recovery.',
    },
  },
  {
    id: 'ox-21',
    category: 'recovery',
    statement: {
      ko: 'ARIES 복구의 REDO 단계에서는 커밋된 트랜잭션만 재실행한다.',
      en: 'In ARIES recovery, the REDO phase only replays committed transactions.',
    },
    answer: false,
    explanation: {
      ko: 'ARIES의 REDO는 "Repeating History"로, 커밋/미커밋에 관계없이 모든 변경을 재실행합니다. 미커밋 트랜잭션은 이후 UNDO 단계에서 롤백됩니다.',
      en: 'ARIES REDO "repeats history," replaying all changes regardless of commit status. Uncommitted transactions are rolled back in the UNDO phase.',
    },
  },

  // Storage
  {
    id: 'ox-22',
    category: 'storage',
    statement: {
      ko: 'PostgreSQL의 기본 페이지 크기는 16KB이다.',
      en: 'PostgreSQL\'s default page size is 16KB.',
    },
    answer: false,
    explanation: {
      ko: 'PostgreSQL의 기본 페이지(블록) 크기는 8KB입니다. MySQL/InnoDB의 기본 페이지 크기가 16KB입니다.',
      en: 'PostgreSQL\'s default page (block) size is 8KB. MySQL/InnoDB\'s default page size is 16KB.',
    },
  },
  {
    id: 'ox-23',
    category: 'storage',
    statement: {
      ko: 'VACUUM FULL은 테이블에 AccessExclusiveLock을 걸어 읽기/쓰기를 모두 차단한다.',
      en: 'VACUUM FULL acquires an AccessExclusiveLock, blocking both reads and writes.',
    },
    answer: true,
    explanation: {
      ko: 'VACUUM FULL은 테이블을 완전히 재작성하므로 배타적 잠금이 필요합니다. 운영 시간에 실행하면 서비스 중단이 발생합니다.',
      en: 'VACUUM FULL rewrites the entire table, requiring an exclusive lock. Running it during production hours causes service outages.',
    },
  },
  {
    id: 'ox-24',
    category: 'storage',
    statement: {
      ko: 'InnoDB에서 Primary Key는 클러스터 인덱스(Clustered Index)로 동작하여 데이터의 물리적 정렬 순서를 결정한다.',
      en: 'In InnoDB, the Primary Key acts as a Clustered Index, determining the physical sort order of data.',
    },
    answer: true,
    explanation: {
      ko: 'InnoDB는 PK를 기준으로 데이터를 물리적으로 정렬하여 저장합니다. PK가 없으면 내부적으로 숨겨진 클러스터 키를 생성합니다.',
      en: 'InnoDB physically sorts data by PK. If no PK exists, InnoDB internally generates a hidden cluster key.',
    },
  },
];

// ─── Multiple Choice Questions ───

export const mcQuestions: MCQuestion[] = [
  {
    id: 'mc-01',
    category: 'relational-algebra',
    question: {
      ko: '관계 대수에서 σ (시그마) 연산자의 역할은?',
      en: 'What does the σ (sigma) operator do in relational algebra?',
    },
    choices: {
      ko: ['열(컬럼) 선택', '행(튜플) 필터링', '두 릴레이션 결합', '릴레이션 이름 변경'],
      en: ['Column selection', 'Row (tuple) filtering', 'Joining two relations', 'Renaming a relation'],
    },
    answerIndex: 1,
    explanation: {
      ko: 'σ (Selection)은 조건에 맞는 행을 필터링합니다. SQL의 WHERE절에 대응됩니다.',
      en: 'σ (Selection) filters rows by condition. It corresponds to SQL\'s WHERE clause.',
    },
  },
  {
    id: 'mc-02',
    category: 'relational-algebra',
    question: {
      ko: '관계 대수에서 π (파이) 연산자의 역할은?',
      en: 'What does the π (pi) operator do in relational algebra?',
    },
    choices: {
      ko: ['행 필터링', '열(컬럼) 추출', '카티션 곱', '합집합'],
      en: ['Row filtering', 'Column extraction', 'Cartesian product', 'Union'],
    },
    answerIndex: 1,
    explanation: {
      ko: 'π (Projection)은 원하는 컬럼만 추출합니다. SQL의 SELECT 컬럼에 대응됩니다.',
      en: 'π (Projection) extracts desired columns. It corresponds to SQL\'s SELECT column list.',
    },
  },
  {
    id: 'mc-03',
    category: 'normalization',
    question: {
      ko: '2NF(제2정규형)의 조건은?',
      en: 'What is the condition for 2NF (Second Normal Form)?',
    },
    choices: {
      ko: ['모든 속성이 원자값', '부분 함수적 종속 제거', '이행적 종속 제거', '모든 결정자가 후보키'],
      en: ['All attributes are atomic', 'Remove partial functional dependencies', 'Remove transitive dependencies', 'Every determinant is a candidate key'],
    },
    answerIndex: 1,
    explanation: {
      ko: '2NF는 1NF를 만족하면서, 모든 비주요 속성이 기본키에 완전 함수적 종속이어야 합니다. 부분 종속을 제거합니다.',
      en: '2NF requires 1NF plus every non-key attribute is fully functionally dependent on the primary key. It removes partial dependencies.',
    },
  },
  {
    id: 'mc-04',
    category: 'normalization',
    question: {
      ko: 'Armstrong의 공리 중 "X → Y이고 Y → Z이면 X → Z"는?',
      en: 'Which Armstrong\'s axiom states "If X → Y and Y → Z, then X → Z"?',
    },
    choices: {
      ko: ['반사 규칙', '첨가 규칙', '이행 규칙', '분해 규칙'],
      en: ['Reflexivity', 'Augmentation', 'Transitivity', 'Decomposition'],
    },
    answerIndex: 2,
    explanation: {
      ko: '이행 규칙(Transitivity): X → Y, Y → Z이면 X → Z가 성립합니다.',
      en: 'Transitivity: If X → Y and Y → Z, then X → Z holds.',
    },
  },
  {
    id: 'mc-05',
    category: 'transactions',
    question: {
      ko: 'ACID 속성 중 "트랜잭션은 전부 성공하거나 전부 실패한다"를 의미하는 것은?',
      en: 'Which ACID property means "a transaction either fully succeeds or fully fails"?',
    },
    choices: {
      ko: ['원자성 (Atomicity)', '일관성 (Consistency)', '격리성 (Isolation)', '지속성 (Durability)'],
      en: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
    },
    answerIndex: 0,
    explanation: {
      ko: 'Atomicity(원자성)는 트랜잭션의 "all or nothing" 특성입니다.',
      en: 'Atomicity is the "all or nothing" property of transactions.',
    },
  },
  {
    id: 'mc-06',
    category: 'transactions',
    question: {
      ko: 'PostgreSQL의 기본 격리 수준은?',
      en: 'What is PostgreSQL\'s default isolation level?',
    },
    choices: {
      ko: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'],
      en: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'],
    },
    answerIndex: 1,
    explanation: {
      ko: 'PostgreSQL의 기본 격리 수준은 READ COMMITTED입니다. MySQL의 기본은 REPEATABLE READ입니다.',
      en: 'PostgreSQL defaults to READ COMMITTED. MySQL defaults to REPEATABLE READ.',
    },
  },
  {
    id: 'mc-07',
    category: 'indexing',
    question: {
      ko: 'B-tree에서 1억 행을 검색할 때 대략 몇 번의 디스크 I/O가 필요한가?',
      en: 'Approximately how many disk I/Os are needed to search 100 million rows in a B-tree?',
    },
    choices: {
      ko: ['2회', '4회', '100회', '1000회'],
      en: ['2', '4', '100', '1,000'],
    },
    answerIndex: 1,
    explanation: {
      ko: '1억 행의 B-tree 높이는 약 4입니다. 루트→리프까지 4회의 디스크 I/O로 검색 가능합니다.',
      en: 'A B-tree with 100M rows has height ~4. Search requires 4 disk I/Os from root to leaf.',
    },
  },
  {
    id: 'mc-08',
    category: 'indexing',
    question: {
      ko: 'PostgreSQL에서 JSONB, 배열, 전문 검색에 적합한 인덱스 유형은?',
      en: 'Which PostgreSQL index type is suitable for JSONB, arrays, and full-text search?',
    },
    choices: {
      ko: ['B-tree', 'GIN', 'GiST', 'BRIN'],
      en: ['B-tree', 'GIN', 'GiST', 'BRIN'],
    },
    answerIndex: 1,
    explanation: {
      ko: 'GIN(Generalized Inverted Index)은 배열, JSONB, 전문 검색 등 복합 데이터 타입에 최적화된 인덱스입니다.',
      en: 'GIN (Generalized Inverted Index) is optimized for composite data types like arrays, JSONB, and full-text search.',
    },
  },
  {
    id: 'mc-09',
    category: 'query-processing',
    question: {
      ko: '두 테이블이 모두 이미 정렬되어 있을 때 가장 효율적인 조인 알고리즘은?',
      en: 'Which join algorithm is most efficient when both tables are already sorted?',
    },
    choices: {
      ko: ['Nested Loop Join', 'Hash Join', 'Merge Join', 'Cross Join'],
      en: ['Nested Loop Join', 'Hash Join', 'Merge Join', 'Cross Join'],
    },
    answerIndex: 2,
    explanation: {
      ko: 'Merge Join은 양쪽이 이미 정렬되어 있으면 정렬 비용 없이 병합만 하면 되므로 매우 효율적입니다.',
      en: 'Merge Join is very efficient when both sides are already sorted, as it only needs to merge without sorting.',
    },
  },
  {
    id: 'mc-10',
    category: 'query-processing',
    question: {
      ko: 'PostgreSQL의 쿼리 실행 엔진이 사용하는 모델은?',
      en: 'Which execution model does PostgreSQL\'s query engine use?',
    },
    choices: {
      ko: ['Materialization 모델', 'Volcano (Iterator) 모델', 'Vectorized 모델', 'Push 모델'],
      en: ['Materialization Model', 'Volcano (Iterator) Model', 'Vectorized Model', 'Push Model'],
    },
    answerIndex: 1,
    explanation: {
      ko: 'PostgreSQL은 Volcano/Iterator 모델을 사용합니다. 각 연산자가 next()를 호출하여 행을 한 건씩 pull합니다.',
      en: 'PostgreSQL uses the Volcano/Iterator model. Each operator calls next() to pull rows one at a time.',
    },
  },
  {
    id: 'mc-11',
    category: 'recovery',
    question: {
      ko: 'ARIES 복구 알고리즘의 3단계 순서는?',
      en: 'What is the correct order of the 3 phases in ARIES recovery?',
    },
    choices: {
      ko: ['REDO → UNDO → Analysis', 'UNDO → Analysis → REDO', 'Analysis → REDO → UNDO', 'Analysis → UNDO → REDO'],
      en: ['REDO → UNDO → Analysis', 'UNDO → Analysis → REDO', 'Analysis → REDO → UNDO', 'Analysis → UNDO → REDO'],
    },
    answerIndex: 2,
    explanation: {
      ko: 'ARIES는 1) Analysis(분석) → 2) REDO(재실행) → 3) UNDO(취소) 순서로 복구합니다.',
      en: 'ARIES recovers in order: 1) Analysis → 2) REDO → 3) UNDO.',
    },
  },
  {
    id: 'mc-12',
    category: 'storage',
    question: {
      ko: 'PostgreSQL에서 autovacuum이 VACUUM을 트리거하는 공식은?',
      en: 'What is the formula for autovacuum triggering VACUUM in PostgreSQL?',
    },
    choices: {
      ko: [
        'dead_tuples ≥ threshold × scale_factor',
        'dead_tuples ≥ threshold + scale_factor × n_live_tup',
        'dead_tuples ≥ scale_factor × table_size',
        'dead_tuples ≥ threshold + n_live_tup',
      ],
      en: [
        'dead_tuples ≥ threshold × scale_factor',
        'dead_tuples ≥ threshold + scale_factor × n_live_tup',
        'dead_tuples ≥ scale_factor × table_size',
        'dead_tuples ≥ threshold + n_live_tup',
      ],
    },
    answerIndex: 1,
    explanation: {
      ko: 'autovacuum 공식: dead_tuples ≥ threshold(50) + scale_factor(0.2) × n_live_tup. 10만 행이면 20,050개 dead tuple 시 트리거.',
      en: 'Autovacuum formula: dead_tuples ≥ threshold(50) + scale_factor(0.2) × n_live_tup. For 100K rows, triggers at 20,050 dead tuples.',
    },
  },
];

// ─── Term Matching Sets ───

export const matchingSets: MatchingSet[] = [
  {
    id: 'match-01',
    category: 'relational-algebra',
    title: { ko: '관계 대수 연산자 매칭', en: 'Relational Algebra Operators' },
    pairs: [
      {
        term: { ko: 'σ (Selection)', en: 'σ (Selection)' },
        definition: { ko: 'WHERE — 행 필터링', en: 'WHERE — Row filtering' },
      },
      {
        term: { ko: 'π (Projection)', en: 'π (Projection)' },
        definition: { ko: 'SELECT 컬럼 — 열 추출', en: 'SELECT columns — Column extraction' },
      },
      {
        term: { ko: '⋈ (Join)', en: '⋈ (Join)' },
        definition: { ko: 'JOIN — 릴레이션 결합', en: 'JOIN — Combine relations' },
      },
      {
        term: { ko: '∪ (Union)', en: '∪ (Union)' },
        definition: { ko: 'UNION — 합집합', en: 'UNION — Set union' },
      },
      {
        term: { ko: '− (Difference)', en: '− (Difference)' },
        definition: { ko: 'EXCEPT — 차집합', en: 'EXCEPT — Set difference' },
      },
      {
        term: { ko: 'ρ (Rename)', en: 'ρ (Rename)' },
        definition: { ko: 'AS — 이름 변경', en: 'AS — Rename alias' },
      },
    ],
  },
  {
    id: 'match-02',
    category: 'normalization',
    title: { ko: '정규형 조건 매칭', en: 'Normal Form Conditions' },
    pairs: [
      {
        term: { ko: '1NF', en: '1NF' },
        definition: { ko: '모든 속성이 원자값', en: 'All attributes are atomic' },
      },
      {
        term: { ko: '2NF', en: '2NF' },
        definition: { ko: '부분 함수적 종속 제거', en: 'Remove partial FDs' },
      },
      {
        term: { ko: '3NF', en: '3NF' },
        definition: { ko: '이행적 종속 제거', en: 'Remove transitive FDs' },
      },
      {
        term: { ko: 'BCNF', en: 'BCNF' },
        definition: { ko: '모든 결정자가 후보키', en: 'Every determinant is a candidate key' },
      },
      {
        term: { ko: '4NF', en: '4NF' },
        definition: { ko: '다치 종속(MVD) 제거', en: 'Remove multi-valued dependencies' },
      },
    ],
  },
  {
    id: 'match-03',
    category: 'transactions',
    title: { ko: 'ACID 속성 매칭', en: 'ACID Properties' },
    pairs: [
      {
        term: { ko: 'Atomicity', en: 'Atomicity' },
        definition: { ko: '전부 성공 또는 전부 실패', en: 'All or nothing' },
      },
      {
        term: { ko: 'Consistency', en: 'Consistency' },
        definition: { ko: '트랜잭션 전후 무결성 유지', en: 'Integrity maintained before and after' },
      },
      {
        term: { ko: 'Isolation', en: 'Isolation' },
        definition: { ko: '동시 트랜잭션이 서로 간섭 없음', en: 'Concurrent txns don\'t interfere' },
      },
      {
        term: { ko: 'Durability', en: 'Durability' },
        definition: { ko: '커밋된 데이터는 영구 보존', en: 'Committed data is permanently saved' },
      },
    ],
  },
  {
    id: 'match-04',
    category: 'indexing',
    title: { ko: '인덱스 유형 매칭', en: 'Index Type Matching' },
    pairs: [
      {
        term: { ko: 'B-tree', en: 'B-tree' },
        definition: { ko: '일반 비교 연산 (=, <, >, BETWEEN)', en: 'General comparisons (=, <, >, BETWEEN)' },
      },
      {
        term: { ko: 'Hash', en: 'Hash' },
        definition: { ko: '등호(=) 검색만, O(1)', en: 'Equality (=) only, O(1)' },
      },
      {
        term: { ko: 'GIN', en: 'GIN' },
        definition: { ko: 'JSONB, 배열, 전문 검색', en: 'JSONB, arrays, full-text search' },
      },
      {
        term: { ko: 'BRIN', en: 'BRIN' },
        definition: { ko: '물리적으로 정렬된 대용량 테이블', en: 'Physically sorted large tables' },
      },
      {
        term: { ko: 'GiST', en: 'GiST' },
        definition: { ko: '공간 데이터, 범위 타입', en: 'Spatial data, range types' },
      },
    ],
  },
  {
    id: 'match-05',
    category: 'query-processing',
    title: { ko: '조인 알고리즘 매칭', en: 'Join Algorithm Matching' },
    pairs: [
      {
        term: { ko: 'Nested Loop', en: 'Nested Loop' },
        definition: { ko: '내부 테이블에 인덱스, 작은 외부 테이블', en: 'Index on inner table, small outer table' },
      },
      {
        term: { ko: 'Hash Join', en: 'Hash Join' },
        definition: { ko: '등호 조인, 메모리 충분', en: 'Equality joins, sufficient memory' },
      },
      {
        term: { ko: 'Merge Join', en: 'Merge Join' },
        definition: { ko: '이미 정렬된 데이터, 범위 조인', en: 'Pre-sorted data, range joins' },
      },
    ],
  },
  {
    id: 'match-06',
    category: 'recovery',
    title: { ko: 'ARIES 복구 단계 매칭', en: 'ARIES Recovery Phases' },
    pairs: [
      {
        term: { ko: 'Analysis (분석)', en: 'Analysis' },
        definition: { ko: '활성 트랜잭션·더티 페이지 목록 재구성', en: 'Reconstruct ATT and DPT' },
      },
      {
        term: { ko: 'REDO (재실행)', en: 'REDO' },
        definition: { ko: '모든 변경을 순방향으로 재실행', en: 'Replay all changes forward' },
      },
      {
        term: { ko: 'UNDO (취소)', en: 'UNDO' },
        definition: { ko: '미커밋 트랜잭션을 역방향으로 취소', en: 'Reverse uncommitted transactions' },
      },
      {
        term: { ko: 'CLR (보상 로그)', en: 'CLR (Compensation Log)' },
        definition: { ko: 'UNDO 중 생성, 복구 재시작 안전 보장', en: 'Generated during UNDO, ensures safe re-recovery' },
      },
    ],
  },
];
