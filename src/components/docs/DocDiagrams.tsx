'use client';

import { Fragment, useState } from 'react';

interface DiagramProps {
  locale: 'ko' | 'en';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// E-Commerce ERD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface TableDef {
  name: string;
  label: { ko: string; en: string };
  color: string;
  columns: { name: string; type: string; pk?: boolean; fk?: string }[];
}

const ERD_TABLES: TableDef[] = [
  {
    name: 'customers',
    label: { ko: '고객', en: 'Customers' },
    color: 'blue',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'name', type: 'VARCHAR(100)' },
      { name: 'email', type: 'VARCHAR(150)' },
      { name: 'city', type: 'VARCHAR(50)' },
      { name: 'signup_date', type: 'DATE' },
      { name: 'is_premium', type: 'BOOLEAN' },
    ],
  },
  {
    name: 'customer_profiles',
    label: { ko: '고객 프로필', en: 'Customer Profiles' },
    color: 'teal',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'customer_id', type: 'INTEGER UNIQUE', fk: 'customers' },
      { name: 'bio', type: 'TEXT' },
      { name: 'avatar_url', type: 'VARCHAR(300)' },
    ],
  },
  {
    name: 'orders',
    label: { ko: '주문', en: 'Orders' },
    color: 'violet',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'customer_id', type: 'INTEGER', fk: 'customers' },
      { name: 'order_date', type: 'TIMESTAMP' },
      { name: 'status', type: 'VARCHAR(20)' },
      { name: 'total_amount', type: 'DECIMAL(12,2)' },
    ],
  },
  {
    name: 'order_items',
    label: { ko: '주문 상세', en: 'Order Items' },
    color: 'rose',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'order_id', type: 'INTEGER', fk: 'orders' },
      { name: 'product_id', type: 'INTEGER', fk: 'products' },
      { name: 'quantity', type: 'INTEGER' },
      { name: 'unit_price', type: 'DECIMAL(10,2)' },
    ],
  },
  {
    name: 'categories',
    label: { ko: '카테고리', en: 'Categories' },
    color: 'amber',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'name', type: 'VARCHAR(50)' },
      { name: 'parent_id', type: 'INTEGER', fk: 'categories (self)' },
    ],
  },
  {
    name: 'products',
    label: { ko: '상품', en: 'Products' },
    color: 'emerald',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'name', type: 'VARCHAR(200)' },
      { name: 'category_id', type: 'INTEGER', fk: 'categories' },
      { name: 'price', type: 'DECIMAL(10,2)' },
      { name: 'stock_quantity', type: 'INTEGER' },
    ],
  },
  {
    name: 'reviews',
    label: { ko: '리뷰', en: 'Reviews' },
    color: 'orange',
    columns: [
      { name: 'id', type: 'SERIAL', pk: true },
      { name: 'product_id', type: 'INTEGER', fk: 'products' },
      { name: 'customer_id', type: 'INTEGER', fk: 'customers' },
      { name: 'rating', type: 'INTEGER CHECK(1~5)' },
      { name: 'comment', type: 'TEXT' },
    ],
  },
];

const TABLE_HEADER_COLORS: Record<string, string> = {
  blue: 'bg-blue-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  orange: 'bg-orange-500',
  teal: 'bg-teal-500',
};

const TABLE_RING_COLORS: Record<string, string> = {
  blue: 'ring-blue-200 dark:ring-blue-800/50',
  violet: 'ring-violet-200 dark:ring-violet-800/50',
  rose: 'ring-rose-200 dark:ring-rose-800/50',
  amber: 'ring-amber-200 dark:ring-amber-800/50',
  emerald: 'ring-emerald-200 dark:ring-emerald-800/50',
  orange: 'ring-orange-200 dark:ring-orange-800/50',
  teal: 'ring-teal-200 dark:ring-teal-800/50',
};

function ERDTableCard({ table, locale }: { table: TableDef; locale: 'ko' | 'en' }) {
  return (
    <div className={`rounded-lg border bg-card shadow-sm ring-1 ${TABLE_RING_COLORS[table.color]} overflow-hidden`}>
      <div className={`${TABLE_HEADER_COLORS[table.color]} px-3 py-2 flex items-center justify-between`}>
        <span className="text-white font-mono text-xs font-bold">{table.name}</span>
        <span className="text-white/70 text-[10px]">{table.label[locale]}</span>
      </div>
      <div className="divide-y divide-border/40">
        {table.columns.map((col) => (
          <div key={col.name} className="px-3 py-1.5 flex items-center gap-2 text-[11px]">
            <div className="flex items-center gap-1 w-5 shrink-0 justify-center">
              {col.pk && (
                <span className="text-amber-500 text-[10px]" title="Primary Key">PK</span>
              )}
              {col.fk && !col.pk && (
                <span className="text-blue-500 text-[10px]" title={`FK → ${col.fk}`}>FK</span>
              )}
            </div>
            <span className="font-mono font-medium text-foreground">{col.name}</span>
            <span className="text-muted-foreground ml-auto text-[10px] font-mono">{col.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const TYPE_COLORS: Record<string, string> = {
  '1:N': 'text-blue-600 dark:text-blue-400',
  'N:1': 'text-violet-600 dark:text-violet-400',
  'N:M': 'text-orange-600 dark:text-orange-400',
  '1:1': 'text-emerald-600 dark:text-emerald-400',
};

const TYPE_BG: Record<string, string> = {
  '1:N': 'bg-blue-500/10',
  'N:1': 'bg-violet-500/10',
  'N:M': 'bg-orange-500/10',
  '1:1': 'bg-emerald-500/10',
};

export function EcommerceERD({ locale }: DiagramProps) {
  const relationships: { from: string; to: string; type: string; label: { ko: string; en: string } }[] = [
    // 1:1 relationships
    { from: 'customers', to: 'customer_profiles', type: '1:1', label: { ko: '한 고객 ↔ 하나의 프로필', en: 'One customer ↔ one profile' } },
    // 1:N relationships (parent → children)
    { from: 'customers', to: 'orders', type: '1:N', label: { ko: '한 고객이 여러 주문', en: 'One customer has many orders' } },
    { from: 'categories', to: 'products', type: '1:N', label: { ko: '한 카테고리에 여러 상품', en: 'One category has many products' } },
    // N:1 relationships (child → parent)
    { from: 'order_items', to: 'orders', type: 'N:1', label: { ko: '여러 항목이 한 주문에 속함', en: 'Many items belong to one order' } },
    { from: 'order_items', to: 'products', type: 'N:1', label: { ko: '여러 항목이 한 상품을 참조', en: 'Many items reference one product' } },
    { from: 'reviews', to: 'customers', type: 'N:1', label: { ko: '여러 리뷰가 한 고객에 속함', en: 'Many reviews belong to one customer' } },
    { from: 'reviews', to: 'products', type: 'N:1', label: { ko: '여러 리뷰가 한 상품에 속함', en: 'Many reviews belong to one product' } },
    // N:M relationships (through junction table)
    { from: 'orders', to: 'products', type: 'N:M', label: { ko: '주문↔상품 (order_items 경유)', en: 'Orders↔Products (via order_items)' } },
    // Self-referencing
    { from: 'categories', to: 'categories', type: '1:N', label: { ko: '자기참조: 상위↔하위 카테고리', en: 'Self-ref: parent↔child category' } },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white text-sm">
          ER
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? 'E-Commerce 데이터베이스 스키마' : 'E-Commerce Database Schema'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '7개 테이블 · 1:1, 1:N, N:1, N:M 관계 포함' : '7 tables · includes 1:1, 1:N, N:1, N:M relationships'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {ERD_TABLES.map((t) => (
          <ERDTableCard key={t.name} table={t} locale={locale} />
        ))}
      </div>

      <div className="border-t pt-4">
        <p className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-wider">
          {locale === 'ko' ? '테이블 관계' : 'Table Relationships'}
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {relationships.map((r, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs">
              <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[10px] font-bold">{r.from}</code>
              <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded ${TYPE_COLORS[r.type]} ${TYPE_BG[r.type]}`}>
                {r.type}
              </span>
              <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[10px] font-bold">{r.to}</code>
              <span className="text-muted-foreground text-[10px] hidden sm:inline truncate">{r.label[locale]}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px]">
          <span className="text-muted-foreground font-semibold">{locale === 'ko' ? '범례:' : 'Legend:'}</span>
          <div className="flex items-center gap-1">
            <span className={`px-1.5 py-0.5 rounded font-bold font-mono ${TYPE_COLORS['1:1']} ${TYPE_BG['1:1']}`}>1:1</span>
            <span className="text-muted-foreground">{locale === 'ko' ? '하나↔하나' : 'One↔One'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`px-1.5 py-0.5 rounded font-bold font-mono ${TYPE_COLORS['1:N']} ${TYPE_BG['1:N']}`}>1:N</span>
            <span className="text-muted-foreground">{locale === 'ko' ? '하나→여러개' : 'One→Many'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`px-1.5 py-0.5 rounded font-bold font-mono ${TYPE_COLORS['N:1']} ${TYPE_BG['N:1']}`}>N:1</span>
            <span className="text-muted-foreground">{locale === 'ko' ? '여러개→하나' : 'Many→One'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={`px-1.5 py-0.5 rounded font-bold font-mono ${TYPE_COLORS['N:M']} ${TYPE_BG['N:M']}`}>N:M</span>
            <span className="text-muted-foreground">{locale === 'ko' ? '다대다 (중간 테이블)' : 'Many↔Many (junction)'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// JOIN Types Diagram
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type JoinType = 'inner' | 'left' | 'right' | 'full';

function JoinVenn({ type, id }: { type: JoinType; id: string }) {
  const cx1 = 70, cx2 = 130, cy = 65, r = 48;

  const leftOpacity = type === 'left' || type === 'full' ? 0.35 : 0.06;
  const rightOpacity = type === 'right' || type === 'full' ? 0.35 : 0.06;
  const showIntersection = type === 'inner';

  return (
    <svg viewBox="0 0 200 130" className="w-full max-w-[180px] mx-auto">
      <defs>
        <clipPath id={`clip-${id}`}>
          <circle cx={cx1} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* Left circle */}
      <circle cx={cx1} cy={cy} r={r}
        fill={`rgba(59, 130, 246, ${leftOpacity})`}
        stroke="rgb(59, 130, 246)" strokeWidth="2.5" />

      {/* Right circle */}
      <circle cx={cx2} cy={cy} r={r}
        fill={`rgba(239, 68, 68, ${rightOpacity})`}
        stroke="rgb(239, 68, 68)" strokeWidth="2.5" />

      {/* INNER JOIN: highlight intersection only */}
      {showIntersection && (
        <circle cx={cx2} cy={cy} r={r}
          fill="rgba(139, 92, 246, 0.4)"
          clipPath={`url(#clip-${id})`} />
      )}

      {/* Labels */}
      <text x={cx1 - 20} y={cy + 5} fill="currentColor" fontSize="14" fontWeight="700" textAnchor="middle">A</text>
      <text x={cx2 + 20} y={cy + 5} fill="currentColor" fontSize="14" fontWeight="700" textAnchor="middle">B</text>
    </svg>
  );
}

export function JoinTypesDiagram({ locale }: DiagramProps) {
  const [activeType, setActiveType] = useState<JoinType | null>(null);

  const types: {
    type: JoinType;
    name: string;
    desc: { ko: string; en: string };
    example: { ko: string; en: string };
    result: { ko: string; en: string };
  }[] = [
    {
      type: 'inner',
      name: 'INNER JOIN',
      desc: { ko: '양쪽 모두 일치하는 행만 반환', en: 'Only matching rows from both tables' },
      example: {
        ko: 'SELECT * FROM customers c INNER JOIN orders o ON c.id = o.customer_id;',
        en: 'SELECT * FROM customers c INNER JOIN orders o ON c.id = o.customer_id;'
      },
      result: {
        ko: '주문이 있는 고객만 반환 (고객 ID가 양쪽 테이블에 모두 존재)',
        en: 'Returns only customers who have orders (customer ID exists in both tables)'
      }
    },
    {
      type: 'left',
      name: 'LEFT JOIN',
      desc: { ko: '왼쪽(A) 전체 + 오른쪽 일치', en: 'All from A + matching from B' },
      example: {
        ko: 'SELECT * FROM customers c LEFT JOIN orders o ON c.id = o.customer_id;',
        en: 'SELECT * FROM customers c LEFT JOIN orders o ON c.id = o.customer_id;'
      },
      result: {
        ko: '모든 고객 반환 (주문이 없으면 orders 컬럼은 NULL)',
        en: 'Returns all customers (orders columns are NULL if no orders)'
      }
    },
    {
      type: 'right',
      name: 'RIGHT JOIN',
      desc: { ko: '왼쪽 일치 + 오른쪽(B) 전체', en: 'Matching from A + all from B' },
      example: {
        ko: 'SELECT * FROM customers c RIGHT JOIN orders o ON c.id = o.customer_id;',
        en: 'SELECT * FROM customers c RIGHT JOIN orders o ON c.id = o.customer_id;'
      },
      result: {
        ko: '모든 주문 반환 (고객 정보가 없으면 customers 컬럼은 NULL)',
        en: 'Returns all orders (customers columns are NULL if no customer info)'
      }
    },
    {
      type: 'full',
      name: 'FULL OUTER JOIN',
      desc: { ko: '양쪽 모두의 전체 행 (합집합)', en: 'All rows from both (union)' },
      example: {
        ko: 'SELECT * FROM customers c FULL OUTER JOIN orders o ON c.id = o.customer_id;',
        en: 'SELECT * FROM customers c FULL OUTER JOIN orders o ON c.id = o.customer_id;'
      },
      result: {
        ko: '모든 고객과 모든 주문 반환 (일치하지 않으면 NULL)',
        en: 'Returns all customers and all orders (NULL where no match)'
      }
    },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-red-500 text-white text-xs font-bold">
          JN
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? 'JOIN 타입 비교' : 'JOIN Types Comparison'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '각 JOIN 타입을 클릭하여 SQL 예시 확인' : 'Click each JOIN type to see SQL examples'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {types.map((t) => (
          <button
            key={t.type}
            onClick={() => setActiveType(activeType === t.type ? null : t.type)}
            className={`text-center p-4 rounded-xl bg-background border shadow-sm transition-all hover:shadow-md ${
              activeType === t.type ? 'ring-2 ring-primary shadow-lg' : ''
            }`}
          >
            <JoinVenn type={t.type} id={t.type} />
            <p className="text-xs font-bold font-mono mt-2 text-foreground">{t.name}</p>
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{t.desc[locale]}</p>
          </button>
        ))}
      </div>

      {activeType && (
        <div className="mt-4 p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
          <p className="text-[10px] font-bold mb-2 text-primary">
            {locale === 'ko' ? 'SQL 예시' : 'SQL Example'}:
          </p>
          <code className="block text-[11px] font-mono bg-background/60 p-2 rounded mb-3 overflow-x-auto">
            {types.find(t => t.type === activeType)?.example[locale]}
          </code>
          <p className="text-[10px] font-bold mb-1">
            {locale === 'ko' ? '결과' : 'Result'}:
          </p>
          <p className="text-xs leading-relaxed">
            {types.find(t => t.type === activeType)?.result[locale]}
          </p>
        </div>
      )}

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">💡 TIP:</span>{' '}
          {locale === 'ko'
            ? 'LEFT JOIN이 가장 자주 사용됩니다. 일치하지 않는 행은 NULL이 되므로, WHERE o.id IS NULL 패턴으로 "데이터가 없는 항목"을 찾을 수 있습니다.'
            : 'LEFT JOIN is the most commonly used. Non-matching rows return NULL, so you can use the WHERE o.id IS NULL pattern to find "missing data".'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SQL Execution Order
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function SqlExecutionOrder({ locale }: DiagramProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      clause: 'FROM / JOIN',
      desc: { ko: '테이블 선택 & 결합', en: 'Select & join tables' },
      detail: {
        ko: '실행할 데이터 소스를 결정합니다. 여러 테이블을 JOIN하는 경우 여기서 결합이 발생합니다.',
        en: 'Determines the data source to execute. If joining multiple tables, the join happens here.'
      },
      example: { ko: 'FROM customers c JOIN orders o ON c.id = o.customer_id', en: 'FROM customers c JOIN orders o ON c.id = o.customer_id' },
      color: 'bg-blue-500',
      written: 4
    },
    {
      clause: 'WHERE',
      desc: { ko: '조건에 맞는 행 필터링', en: 'Filter rows by condition' },
      detail: {
        ko: 'FROM에서 가져온 행 중 조건을 만족하는 행만 남깁니다. 집계 함수는 사용 불가합니다.',
        en: 'Keeps only rows that satisfy the condition from FROM. Cannot use aggregate functions.'
      },
      example: { ko: 'WHERE c.city = \'Seoul\' AND o.total_amount > 1000', en: 'WHERE c.city = \'Seoul\' AND o.total_amount > 1000' },
      color: 'bg-red-500',
      written: 5
    },
    {
      clause: 'GROUP BY',
      desc: { ko: '행을 그룹으로 묶기', en: 'Group rows together' },
      detail: {
        ko: '지정된 컬럼 값이 같은 행들을 하나의 그룹으로 묶습니다. 집계 함수와 함께 사용됩니다.',
        en: 'Groups rows with the same column values together. Used with aggregate functions.'
      },
      example: { ko: 'GROUP BY c.city', en: 'GROUP BY c.city' },
      color: 'bg-amber-500',
      written: 6
    },
    {
      clause: 'HAVING',
      desc: { ko: '그룹 필터링', en: 'Filter groups' },
      detail: {
        ko: 'GROUP BY로 생성된 그룹을 필터링합니다. 집계 함수를 조건으로 사용할 수 있습니다.',
        en: 'Filters groups created by GROUP BY. Can use aggregate functions in conditions.'
      },
      example: { ko: 'HAVING COUNT(*) > 5', en: 'HAVING COUNT(*) > 5' },
      color: 'bg-orange-500',
      written: 7
    },
    {
      clause: 'SELECT',
      desc: { ko: '열 선택 & 계산', en: 'Select columns & compute' },
      detail: {
        ko: '최종 결과에 포함할 컬럼을 선택하고, 계산식이나 집계 함수를 실행합니다.',
        en: 'Selects columns to include in the final result and executes calculations or aggregate functions.'
      },
      example: { ko: 'SELECT c.city, COUNT(*) as order_count, SUM(o.total_amount) as total', en: 'SELECT c.city, COUNT(*) as order_count, SUM(o.total_amount) as total' },
      color: 'bg-emerald-500',
      written: 1
    },
    {
      clause: 'DISTINCT',
      desc: { ko: '중복 행 제거', en: 'Remove duplicate rows' },
      detail: {
        ko: 'SELECT 결과에서 완전히 동일한 행을 제거하고 고유한 행만 남깁니다.',
        en: 'Removes completely identical rows from SELECT results, keeping only unique rows.'
      },
      example: { ko: 'SELECT DISTINCT city FROM customers', en: 'SELECT DISTINCT city FROM customers' },
      color: 'bg-teal-500',
      written: 2
    },
    {
      clause: 'ORDER BY',
      desc: { ko: '결과 정렬', en: 'Sort results' },
      detail: {
        ko: '최종 결과를 지정된 컬럼 기준으로 정렬합니다. SELECT의 별칭을 사용할 수 있습니다.',
        en: 'Sorts the final result by specified columns. Can use aliases from SELECT.'
      },
      example: { ko: 'ORDER BY total DESC, order_count ASC', en: 'ORDER BY total DESC, order_count ASC' },
      color: 'bg-violet-500',
      written: 8
    },
    {
      clause: 'LIMIT / OFFSET',
      desc: { ko: '반환 행 수 제한', en: 'Limit number of rows' },
      detail: {
        ko: '반환할 행의 개수를 제한하고, OFFSET으로 시작 위치를 지정할 수 있습니다.',
        en: 'Limits the number of rows to return and can specify start position with OFFSET.'
      },
      example: { ko: 'LIMIT 10 OFFSET 20', en: 'LIMIT 10 OFFSET 20' },
      color: 'bg-pink-500',
      written: 9
    },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-xs font-bold">
          #
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? 'SQL 실행 순서' : 'SQL Execution Order'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '각 단계를 클릭하여 상세 정보 확인' : 'Click each step for details'}
          </p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Execution Order */}
        <div className="flex-1">
          <p className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-wider">
            {locale === 'ko' ? '⚡ 실행 순서 (실제 처리 순서)' : '⚡ Execution Order (Actual Processing)'}
          </p>
          <div className="flex flex-col items-start gap-0">
            {steps.map((step, i) => (
              <Fragment key={step.clause}>
                <button
                  onClick={() => setActiveStep(activeStep === i ? null : i)}
                  className={`flex items-center gap-3 w-full transition-all hover:bg-background/50 rounded-lg p-1 ${
                    activeStep === i ? 'bg-background/80 ring-2 ring-primary' : ''
                  }`}
                >
                  <span className={`${step.color} w-7 h-7 rounded-full text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm`}>
                    {i + 1}
                  </span>
                  <div className="flex items-baseline gap-2 min-w-0 text-left">
                    <code className="font-mono font-bold text-[13px] shrink-0">{step.clause}</code>
                    <span className="text-xs text-muted-foreground truncate">{step.desc[locale]}</span>
                  </div>
                </button>
                {i < steps.length - 1 && (
                  <div className="w-px h-3 bg-border ml-[13px]" />
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Written Order comparison */}
        <div className="w-48 shrink-0 hidden md:block">
          <p className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-wider">
            {locale === 'ko' ? '✍️ 작성 순서' : '✍️ Written Order'}
          </p>
          <div className="space-y-1 text-xs font-mono">
            <div className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold">1. SELECT</div>
            <div className="px-2 py-1 rounded bg-teal-500/10 text-teal-700 dark:text-teal-300">2. DISTINCT</div>
            <div className="px-2 py-1 rounded bg-muted text-muted-foreground">3. column_list</div>
            <div className="px-2 py-1 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold">4. FROM / JOIN</div>
            <div className="px-2 py-1 rounded bg-red-500/10 text-red-700 dark:text-red-300">5. WHERE</div>
            <div className="px-2 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300">6. GROUP BY</div>
            <div className="px-2 py-1 rounded bg-orange-500/10 text-orange-700 dark:text-orange-300">7. HAVING</div>
            <div className="px-2 py-1 rounded bg-violet-500/10 text-violet-700 dark:text-violet-300">8. ORDER BY</div>
            <div className="px-2 py-1 rounded bg-pink-500/10 text-pink-700 dark:text-pink-300">9. LIMIT</div>
          </div>
        </div>
      </div>

      {activeStep !== null && (
        <div className="mt-4 p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
          <p className="text-[10px] font-bold mb-2 text-primary">{steps[activeStep].clause}</p>
          <p className="text-xs mb-3 leading-relaxed">{steps[activeStep].detail[locale]}</p>
          <p className="text-[10px] font-bold mb-1">{locale === 'ko' ? '예시' : 'Example'}:</p>
          <code className="block text-[11px] font-mono bg-background/60 p-2 rounded overflow-x-auto">
            {steps[activeStep].example[locale]}
          </code>
        </div>
      )}

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">💡 TIP:</span>{' '}
          {locale === 'ko'
            ? 'SELECT는 5번째로 실행됩니다! 따라서 WHERE 절에서 SELECT의 별칭(AS)을 사용할 수 없습니다. 별칭을 사용하려면 ORDER BY에서 사용하세요.'
            : 'SELECT runs 5th! So you cannot use SELECT aliases (AS) in the WHERE clause. Use aliases in ORDER BY instead.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PK / FK Relationship Diagram
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function PKFKDiagram({ locale }: DiagramProps) {
  const customersData = [
    { id: 1, name: locale === 'ko' ? '김철수' : 'John', email: 'john@mail.com' },
    { id: 2, name: locale === 'ko' ? '이영희' : 'Sarah', email: 'sarah@mail.com' },
    { id: 3, name: locale === 'ko' ? '박민수' : 'Mike', email: 'mike@mail.com' },
  ];
  const ordersData = [
    { id: 101, customer_id: 1, total: '150.00' },
    { id: 102, customer_id: 1, total: '89.50' },
    { id: 103, customer_id: 2, total: '210.00' },
    { id: 104, customer_id: 3, total: '45.00' },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-blue-500 text-white text-xs font-bold">
          PK
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '기본키(PK) ↔ 외래키(FK) 연결' : 'Primary Key (PK) ↔ Foreign Key (FK) Link'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? 'FK는 다른 테이블의 PK를 참조하여 테이블 간 관계를 형성합니다' : 'FK references another table\'s PK to form relationships'}
          </p>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Customers table */}
        <div className="flex-1">
          <div className="rounded-lg border overflow-hidden shadow-sm">
            <div className="bg-blue-500 px-3 py-2 flex items-center justify-between">
              <span className="text-white font-mono text-xs font-bold">customers</span>
              <span className="text-white/70 text-[10px]">{locale === 'ko' ? '"1" 쪽' : '"1" side'}</span>
            </div>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-2 py-1.5 text-left font-bold text-amber-600 dark:text-amber-400">PK id</th>
                  <th className="px-2 py-1.5 text-left font-semibold">name</th>
                  <th className="px-2 py-1.5 text-left font-semibold">email</th>
                </tr>
              </thead>
              <tbody>
                {customersData.map((c) => (
                  <tr key={c.id} className="border-t border-border/40">
                    <td className="px-2 py-1.5 font-mono font-bold text-amber-600 dark:text-amber-400">{c.id}</td>
                    <td className="px-2 py-1.5">{c.name}</td>
                    <td className="px-2 py-1.5 text-muted-foreground">{c.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center justify-center pt-12 shrink-0">
          <svg width="60" height="80" viewBox="0 0 60 80">
            <defs>
              <marker id="pk-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-primary" />
              </marker>
            </defs>
            <line x1="5" y1="20" x2="55" y2="20" stroke="currentColor" className="text-primary" strokeWidth="2" markerEnd="url(#pk-arrow)" />
            <line x1="5" y1="40" x2="55" y2="40" stroke="currentColor" className="text-primary" strokeWidth="2" markerEnd="url(#pk-arrow)" />
            <line x1="5" y1="60" x2="55" y2="60" stroke="currentColor" className="text-primary" strokeWidth="2" markerEnd="url(#pk-arrow)" />
          </svg>
          <span className="text-[9px] text-muted-foreground font-mono mt-1">
            PK ← FK
          </span>
        </div>

        {/* Orders table */}
        <div className="flex-1">
          <div className="rounded-lg border overflow-hidden shadow-sm">
            <div className="bg-violet-500 px-3 py-2 flex items-center justify-between">
              <span className="text-white font-mono text-xs font-bold">orders</span>
              <span className="text-white/70 text-[10px]">{locale === 'ko' ? '"N" 쪽' : '"N" side'}</span>
            </div>
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-2 py-1.5 text-left font-bold text-amber-600 dark:text-amber-400">PK id</th>
                  <th className="px-2 py-1.5 text-left font-bold text-blue-600 dark:text-blue-400">FK customer_id</th>
                  <th className="px-2 py-1.5 text-left font-semibold">total</th>
                </tr>
              </thead>
              <tbody>
                {ordersData.map((o) => (
                  <tr key={o.id} className="border-t border-border/40">
                    <td className="px-2 py-1.5 font-mono font-bold text-amber-600 dark:text-amber-400">{o.id}</td>
                    <td className="px-2 py-1.5 font-mono font-bold text-blue-600 dark:text-blue-400">{o.customer_id}</td>
                    <td className="px-2 py-1.5 text-muted-foreground">${o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/40" />
          <span className="font-bold text-amber-600 dark:text-amber-400">PK</span>
          <span className="text-muted-foreground">{locale === 'ko' ? '기본키 (고유 식별자)' : 'Primary Key (unique identifier)'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/40" />
          <span className="font-bold text-blue-600 dark:text-blue-400">FK</span>
          <span className="text-muted-foreground">{locale === 'ko' ? '외래키 (다른 테이블 PK 참조)' : 'Foreign Key (references another PK)'}</span>
        </div>
      </div>

      {/* Key insight */}
      <div className="mt-4 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? 'customer_id=1인 주문이 2개 (주문#101, #102) → 고객 "김철수"가 2번 주문한 것. 이것이 1:N 관계입니다. FK 값으로 어느 고객의 주문인지 알 수 있습니다.'
            : 'customer_id=1 has 2 orders (#101, #102) → Customer "John" placed 2 orders. This is a 1:N relationship. The FK value tells you which customer owns the order.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Relationship Types Diagram
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function RelationshipTypesDiagram({ locale }: DiagramProps) {
  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 text-white text-xs font-bold">
          1:N
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '테이블 관계 유형' : 'Relationship Types'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '테이블 간 데이터 연결 방식 4가지' : 'Four ways tables relate to each other'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 1:1 */}
        <div className="p-4 rounded-xl bg-background border shadow-sm">
          <div className="text-center mb-3">
            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-mono">
              1 : 1
            </span>
          </div>
          <svg viewBox="0 0 200 100" className="w-full max-w-[220px] mx-auto">
            <rect x="10" y="20" width="70" height="60" rx="8" fill="none" stroke="currentColor" className="text-blue-400" strokeWidth="2" />
            <text x="45" y="45" fill="currentColor" fontSize="10" textAnchor="middle" fontWeight="700" className="text-foreground">users</text>
            <text x="45" y="60" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">id=1</text>
            <text x="45" y="70" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">id=2</text>

            <rect x="120" y="20" width="70" height="60" rx="8" fill="none" stroke="currentColor" className="text-violet-400" strokeWidth="2" />
            <text x="155" y="45" fill="currentColor" fontSize="9" textAnchor="middle" fontWeight="700" className="text-foreground">profiles</text>
            <text x="155" y="60" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">user_id=1</text>
            <text x="155" y="70" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">user_id=2</text>

            <line x1="82" y1="50" x2="118" y2="50" stroke="currentColor" className="text-primary" strokeWidth="2" />
            <circle cx="85" cy="50" r="3" fill="currentColor" className="text-primary" />
            <circle cx="115" cy="50" r="3" fill="currentColor" className="text-primary" />
          </svg>
          <p className="text-[10px] text-center text-muted-foreground mt-2 leading-snug">
            {locale === 'ko' ? '한 행 ↔ 정확히 한 행' : 'One row ↔ exactly one row'}
          </p>
        </div>

        {/* 1:N */}
        <div className="p-4 rounded-xl bg-background border-2 border-primary/30 shadow-sm">
          <div className="text-center mb-3">
            <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
              1 : N ★
            </span>
          </div>
          <svg viewBox="0 0 200 100" className="w-full max-w-[220px] mx-auto">
            <rect x="10" y="15" width="70" height="70" rx="8" fill="none" stroke="currentColor" className="text-blue-400" strokeWidth="2" />
            <text x="45" y="38" fill="currentColor" fontSize="9" textAnchor="middle" fontWeight="700" className="text-foreground">customers</text>
            <text x="45" y="55" fill="currentColor" fontSize="9" textAnchor="middle" className="text-muted-foreground">id=1</text>

            <rect x="120" y="5" width="70" height="90" rx="8" fill="none" stroke="currentColor" className="text-violet-400" strokeWidth="2" />
            <text x="155" y="25" fill="currentColor" fontSize="10" textAnchor="middle" fontWeight="700" className="text-foreground">orders</text>
            <text x="155" y="42" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">c_id=1</text>
            <text x="155" y="55" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">c_id=1</text>
            <text x="155" y="68" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">c_id=1</text>

            <line x1="82" y1="55" x2="118" y2="42" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <line x1="82" y1="55" x2="118" y2="55" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <line x1="82" y1="55" x2="118" y2="68" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <circle cx="85" cy="55" r="3" fill="currentColor" className="text-primary" />
          </svg>
          <p className="text-[10px] text-center text-muted-foreground mt-2 leading-snug">
            {locale === 'ko' ? '한 행 → 여러 행 (가장 흔함)' : 'One row → many rows (most common)'}
          </p>
        </div>

        {/* N:1 */}
        <div className="p-4 rounded-xl bg-background border shadow-sm">
          <div className="text-center mb-3">
            <span className="inline-block px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs font-bold font-mono">
              N : 1
            </span>
          </div>
          <svg viewBox="0 0 200 100" className="w-full max-w-[220px] mx-auto">
            {/* Orders side (N) */}
            <rect x="10" y="5" width="70" height="90" rx="8" fill="none" stroke="currentColor" className="text-violet-400" strokeWidth="2" />
            <text x="45" y="25" fill="currentColor" fontSize="10" textAnchor="middle" fontWeight="700" className="text-foreground">orders</text>
            <text x="45" y="42" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">c_id=1</text>
            <text x="45" y="55" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">c_id=1</text>
            <text x="45" y="68" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">c_id=1</text>

            {/* Customers side (1) */}
            <rect x="120" y="15" width="70" height="70" rx="8" fill="none" stroke="currentColor" className="text-blue-400" strokeWidth="2" />
            <text x="155" y="38" fill="currentColor" fontSize="9" textAnchor="middle" fontWeight="700" className="text-foreground">customers</text>
            <text x="155" y="55" fill="currentColor" fontSize="9" textAnchor="middle" className="text-muted-foreground">id=1</text>

            <line x1="82" y1="42" x2="118" y2="55" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <line x1="82" y1="55" x2="118" y2="55" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <line x1="82" y1="68" x2="118" y2="55" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <circle cx="121" cy="55" r="3" fill="currentColor" className="text-primary" />
          </svg>
          <p className="text-[10px] text-center text-muted-foreground mt-2 leading-snug">
            {locale === 'ko' ? '여러 행 → 한 행 (1:N의 역방향)' : 'Many rows → one row (reverse of 1:N)'}
          </p>
        </div>

        {/* N:M */}
        <div className="p-4 rounded-xl bg-background border shadow-sm">
          <div className="text-center mb-3">
            <span className="inline-block px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-700 dark:text-orange-300 text-xs font-bold font-mono">
              N : M
            </span>
          </div>
          <svg viewBox="0 0 200 100" className="w-full max-w-[220px] mx-auto">
            <rect x="5" y="15" width="55" height="70" rx="8" fill="none" stroke="currentColor" className="text-blue-400" strokeWidth="2" />
            <text x="32" y="35" fill="currentColor" fontSize="9" textAnchor="middle" fontWeight="700" className="text-foreground">orders</text>
            <text x="32" y="52" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">id=1</text>
            <text x="32" y="65" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">id=2</text>

            <rect x="73" y="20" width="55" height="60" rx="8" fill="none" stroke="currentColor" className="text-rose-400" strokeWidth="2" strokeDasharray="4 2" />
            <text x="100" y="38" fill="currentColor" fontSize="7" textAnchor="middle" fontWeight="700" className="text-foreground">order_</text>
            <text x="100" y="48" fill="currentColor" fontSize="7" textAnchor="middle" fontWeight="700" className="text-foreground">items</text>
            <text x="100" y="62" fill="currentColor" fontSize="7" textAnchor="middle" className="text-muted-foreground">(1,A)(1,B)</text>
            <text x="100" y="72" fill="currentColor" fontSize="7" textAnchor="middle" className="text-muted-foreground">(2,A)</text>

            <rect x="140" y="15" width="55" height="70" rx="8" fill="none" stroke="currentColor" className="text-emerald-400" strokeWidth="2" />
            <text x="167" y="35" fill="currentColor" fontSize="8" textAnchor="middle" fontWeight="700" className="text-foreground">products</text>
            <text x="167" y="52" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">id=A</text>
            <text x="167" y="65" fill="currentColor" fontSize="8" textAnchor="middle" className="text-muted-foreground">id=B</text>

            <line x1="62" y1="50" x2="71" y2="50" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
            <line x1="130" y1="50" x2="138" y2="50" stroke="currentColor" className="text-primary" strokeWidth="1.5" />
          </svg>
          <p className="text-[10px] text-center text-muted-foreground mt-2 leading-snug">
            {locale === 'ko' ? '여러 행 ↔ 여러 행 (중간 테이블 필요)' : 'Many rows ↔ many rows (junction table needed)'}
          </p>
        </div>
      </div>

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? '대부분의 관계는 1:N입니다. N:M 관계는 중간 테이블(order_items 같은)로 풀어서 두 개의 1:N 관계로 만듭니다.'
            : 'Most relationships are 1:N. N:M relationships are resolved using a junction table (like order_items), creating two 1:N relationships.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Section → Diagram Mapping
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Combined diagram for schema-keys section
function SchemaKeysDiagrams({ locale }: DiagramProps) {
  return (
    <>
      <PKFKDiagram locale={locale} />
      <RelationshipTypesDiagram locale={locale} />
    </>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Partition Table Diagram (Interactive)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PARTITION_COLORS = [
  { bg: 'bg-blue-500/10', border: 'border-blue-500/30', dot: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-300' },
  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
  { bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300' },
  { bg: 'bg-rose-500/10', border: 'border-rose-500/30', dot: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300' },
];

interface PartitionConfig {
  table: string;
  column: string;
  desc: { ko: string; en: string };
  partitions: { name: string; range: string; rows: string[] }[];
}

export function PartitionDiagram({ locale }: DiagramProps) {
  const [activeType, setActiveType] = useState<'range' | 'list' | 'hash'>('range');

  const configs: Record<string, PartitionConfig> = {
    range: {
      table: 'orders',
      column: 'order_date',
      desc: { ko: '날짜 범위로 분할', en: 'Split by date range' },
      partitions: [
        { name: '2024_Q1', range: 'Jan – Mar', rows: ['2024-01-15', '2024-02-20', '2024-03-10'] },
        { name: '2024_Q2', range: 'Apr – Jun', rows: ['2024-04-05', '2024-05-18'] },
        { name: '2024_Q3', range: 'Jul – Sep', rows: ['2024-07-01', '2024-09-30'] },
        { name: '2024_Q4', range: 'Oct – Dec', rows: ['2024-11-11'] },
      ],
    },
    list: {
      table: 'customers',
      column: 'country',
      desc: { ko: '값 목록으로 분할', en: 'Split by value list' },
      partitions: [
        { name: 'p_asia', range: 'KR, JP, CN', rows: ['Korea', 'Japan', 'China'] },
        { name: 'p_europe', range: 'DE, FR, UK', rows: ['Germany', 'France'] },
        { name: 'p_america', range: 'US, CA, BR', rows: ['USA', 'Canada', 'Brazil'] },
      ],
    },
    hash: {
      table: 'logs',
      column: 'user_id',
      desc: { ko: '해시 함수로 균등 분할', en: 'Even distribution via hash' },
      partitions: [
        { name: 'P0', range: 'MOD 4 = 0', rows: ['uid=4', 'uid=8', 'uid=12'] },
        { name: 'P1', range: 'MOD 4 = 1', rows: ['uid=1', 'uid=5'] },
        { name: 'P2', range: 'MOD 4 = 2', rows: ['uid=2', 'uid=6'] },
        { name: 'P3', range: 'MOD 4 = 3', rows: ['uid=3', 'uid=7'] },
      ],
    },
  };

  const config = configs[activeType];
  const allRows = config.partitions.flatMap((p) => p.rows);

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-amber-500 text-white text-xs font-bold">
          PT
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '파티션 테이블 구조' : 'Partition Table Structure'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '클릭하여 파티셔닝 방식 비교' : 'Click to compare partitioning strategies'}
          </p>
        </div>
      </div>

      {/* Type selector tabs */}
      <div className="flex gap-2 mb-5">
        {(['range', 'list', 'hash'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
              activeType === type
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
        <span className="text-[10px] text-muted-foreground self-center ml-2 italic">
          {config.desc[locale]}
        </span>
      </div>

      {/* Main visual */}
      <div className="flex items-stretch gap-3">
        {/* Source table */}
        <div className="w-[130px] shrink-0">
          <div className="rounded-lg border overflow-hidden shadow-sm h-full flex flex-col">
            <div className="bg-zinc-500 dark:bg-zinc-600 px-3 py-2">
              <span className="text-white font-mono text-[11px] font-bold">{config.table}</span>
            </div>
            <div className="p-2 flex-1">
              <div className="text-[9px] text-muted-foreground font-mono leading-relaxed">
                PARTITION BY<br />
                <span className="font-bold">{activeType.toUpperCase()}</span> ({config.column})
              </div>
              <div className="border-t mt-2 pt-2 space-y-0.5">
                {allRows.slice(0, 7).map((row, i) => (
                  <div key={i} className="text-[10px] font-mono bg-muted/50 px-1.5 py-0.5 rounded truncate">
                    {row}
                  </div>
                ))}
                {allRows.length > 7 && (
                  <div className="text-[9px] text-muted-foreground text-center">
                    +{allRows.length - 7} more
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center shrink-0">
          <svg width="36" height="24" viewBox="0 0 36 24" className="text-primary">
            <path d="M2 12 L28 12 M22 6 L28 12 L22 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Partitions */}
        <div className="flex-1 flex flex-col gap-2">
          {config.partitions.map((p, i) => {
            const c = PARTITION_COLORS[i % PARTITION_COLORS.length];
            return (
              <div key={p.name} className={`rounded-lg border ${c.border} ${c.bg} px-3 py-2 flex items-center gap-3 transition-all hover:shadow-sm`}>
                <div className={`w-2.5 h-2.5 rounded-full ${c.dot} shrink-0`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-bold font-mono">{p.name}</span>
                    <span className="text-[9px] text-muted-foreground">{p.range}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.rows.map((row, j) => (
                      <span key={j} className="text-[10px] font-mono bg-background/60 px-1.5 py-0.5 rounded shadow-sm">
                        {row}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                  {p.rows.length}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tip */}
      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? 'WHERE 조건에 파티션 키가 포함되면 해당 파티션만 스캔합니다 (파티션 프루닝). EXPLAIN으로 확인하세요.'
            : 'When WHERE includes the partition key, only the relevant partition is scanned (partition pruning). Verify with EXPLAIN.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Function vs Procedure Diagram
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function FunctionProcedureDiagram({ locale }: DiagramProps) {
  const [activeTab, setActiveTab] = useState<'function' | 'procedure'>('function');

  const fnSteps = [
    {
      icon: '①',
      title: { ko: '입력 매개변수', en: 'Input Parameters' },
      code: '(price DECIMAL, rate DECIMAL)',
      color: 'bg-emerald-500',
    },
    {
      icon: '②',
      title: { ko: '처리 본문', en: 'Process Body' },
      code: 'RETURN price * (1 - rate/100)',
      color: 'bg-emerald-500',
    },
    {
      icon: '③',
      title: { ko: 'RETURNS 반환', en: 'RETURNS value' },
      code: '→ DECIMAL',
      color: 'bg-emerald-500',
    },
  ];

  const procSteps = [
    {
      icon: '①',
      title: { ko: '입력 매개변수', en: 'Input Parameters' },
      code: '(IN sender INT, IN rcvr INT, IN amount DECIMAL)',
      color: 'bg-violet-500',
    },
    {
      icon: '②',
      title: { ko: '처리 본문', en: 'Process Body' },
      code: 'UPDATE accounts ... UPDATE accounts ...',
      color: 'bg-violet-500',
    },
    {
      icon: '③',
      title: { ko: '트랜잭션 제어', en: 'Transaction Control' },
      code: 'COMMIT / ROLLBACK',
      color: 'bg-violet-500',
    },
  ];

  const steps = activeTab === 'function' ? fnSteps : procSteps;
  const traitsPanelClass = activeTab === 'function'
    ? 'bg-emerald-500/5 border-emerald-500/20'
    : 'bg-violet-500/5 border-violet-500/20';
  const callCodeClass = activeTab === 'function'
    ? 'text-emerald-700 dark:text-emerald-300'
    : 'text-violet-700 dark:text-violet-300';

  const fnTraits = [
    { ok: true, text: { ko: 'SELECT, WHERE, JOIN에서 사용 가능', en: 'Can be used in SELECT, WHERE, JOIN' } },
    { ok: true, text: { ko: '값을 반드시 반환 (RETURNS)', en: 'Must return a value (RETURNS)' } },
    { ok: false, text: { ko: '트랜잭션 제어 불가', en: 'Cannot control transactions' } },
  ];
  const procTraits = [
    { ok: true, text: { ko: 'COMMIT / ROLLBACK 가능', en: 'Can COMMIT / ROLLBACK' } },
    { ok: true, text: { ko: 'OUT 매개변수로 결과 전달', en: 'Pass results via OUT params' } },
    { ok: false, text: { ko: 'SELECT에서 사용 불가 (CALL로만 호출)', en: 'Cannot use in SELECT (CALL only)' } },
  ];
  const traits = activeTab === 'function' ? fnTraits : procTraits;

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-500 text-white text-xs font-bold">
          Fn
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '함수 vs 프로시저 실행 흐름' : 'Function vs Procedure Flow'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '클릭하여 실행 흐름 비교' : 'Click to compare execution flows'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setActiveTab('function')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'function'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          FUNCTION
        </button>
        <button
          onClick={() => setActiveTab('procedure')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'procedure'
              ? 'bg-violet-500 text-white shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          PROCEDURE
        </button>
        <span className="text-[10px] text-muted-foreground self-center ml-2">
          {activeTab === 'function'
            ? locale === 'ko' ? 'SELECT calc_discount(price, 10)' : 'SELECT calc_discount(price, 10)'
            : locale === 'ko' ? 'CALL transfer_funds(1, 2, 50000)' : 'CALL transfer_funds(1, 2, 50000)'}
        </span>
      </div>

      <div className="flex gap-6">
        {/* Flow steps */}
        <div className="flex-1">
          <div className="flex flex-col items-start gap-0">
            {steps.map((step, i) => (
              <Fragment key={i}>
                <div className="flex items-start gap-3 w-full">
                  <span className={`${step.color} w-7 h-7 rounded-full text-white flex items-center justify-center text-[12px] font-bold shrink-0 shadow-sm`}>
                    {i + 1}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-xs font-bold">{step.title[locale]}</p>
                    <code className="text-[10px] font-mono text-muted-foreground break-all">{step.code}</code>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-4 bg-border ml-[13px]" />
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Traits panel */}
        <div className={`w-64 shrink-0 rounded-lg border p-3 ${traitsPanelClass}`}>
          <p className="text-[10px] font-bold text-muted-foreground mb-2 uppercase tracking-wider">
            {locale === 'ko' ? '특징' : 'Characteristics'}
          </p>
          <div className="space-y-2">
            {traits.map((t, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`shrink-0 mt-0.5 ${t.ok ? 'text-emerald-500' : 'text-red-400'}`}>
                  {t.ok ? '✓' : '✗'}
                </span>
                <span className={t.ok ? 'text-foreground' : 'text-muted-foreground'}>
                  {t.text[locale]}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground mb-1">
              {locale === 'ko' ? '호출 방식' : 'How to call'}
            </p>
            <code className={`text-[11px] font-mono font-bold ${callCodeClass}`}>
              {activeTab === 'function'
                ? 'SELECT func_name(...)'
                : 'CALL proc_name(...)'}
            </code>
          </div>
        </div>
      </div>

      {/* Quick comparison */}
      <div className="mt-5 grid grid-cols-2 gap-3 text-[11px]">
        <div className={`rounded-lg border p-3 ${activeTab === 'function' ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border bg-background'}`}>
          <p className="font-bold font-mono mb-1 text-emerald-700 dark:text-emerald-300">FUNCTION</p>
          <p className="text-muted-foreground leading-relaxed">
            {locale === 'ko'
              ? '계산, 데이터 변환, 조회용. SQL 문 안에서 직접 호출.'
              : 'For calculations, transforms, queries. Called directly in SQL.'}
          </p>
        </div>
        <div className={`rounded-lg border p-3 ${activeTab === 'procedure' ? 'border-violet-500/40 bg-violet-500/5' : 'border-border bg-background'}`}>
          <p className="font-bold font-mono mb-1 text-violet-700 dark:text-violet-300">PROCEDURE</p>
          <p className="text-muted-foreground leading-relaxed">
            {locale === 'ko'
              ? '비즈니스 로직, 배치 작업용. CALL로 호출하며 트랜잭션 제어 가능.'
              : 'For business logic, batch ops. Called with CALL, can control transactions.'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOB Storage Tiers Diagram
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function StorageTiersDiagram({ locale }: DiagramProps) {
  const [activeTier, setActiveTier] = useState<number | null>(null);

  const tiers = [
    {
      name: { ko: '인라인 저장', en: 'Inline Storage' },
      size: '< 2KB',
      color: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', header: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
      types: ['INT', 'VARCHAR', 'BOOLEAN', 'DATE', 'DECIMAL'],
      pg: { ko: '행 내부에 직접 저장', en: 'Stored directly in row' },
      mysql: { ko: '행 내부에 직접 저장', en: 'Stored directly in row' },
      desc: { ko: '일반 데이터 타입은 행(row) 안에 인라인으로 저장됩니다. 가장 빠른 접근 속도입니다.', en: 'Regular data types are stored inline within the row. Fastest access speed.' },
    },
    {
      name: { ko: 'TOAST / 오프페이지', en: 'TOAST / Off-page' },
      size: '2KB – 1GB',
      color: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', header: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-300' },
      types: ['TEXT', 'BYTEA', 'JSONB', 'BLOB'],
      pg: { ko: 'TOAST: 자동 압축 + 외부 테이블', en: 'TOAST: auto compress + external table' },
      mysql: { ko: 'Off-page: 별도 페이지 저장', en: 'Off-page: stored in separate pages' },
      desc: { ko: 'PostgreSQL은 TOAST로 자동 압축 후 분할 저장합니다. MySQL은 오버플로 페이지에 저장합니다. 사용자가 관리할 필요 없습니다.', en: 'PostgreSQL uses TOAST for auto-compression and split storage. MySQL stores in overflow pages. No user management needed.' },
    },
    {
      name: { ko: 'Large Object', en: 'Large Object' },
      size: '> 1GB',
      color: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', header: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300' },
      types: ['lo_import', 'OID', 'pg_largeobject'],
      pg: { ko: '별도 시스템 테이블 (최대 ~4TB)', en: 'Separate system table (up to ~4TB)' },
      mysql: { ko: 'LONGBLOB/LONGTEXT (최대 ~4GB)', en: 'LONGBLOB/LONGTEXT (up to ~4GB)' },
      desc: { ko: 'PostgreSQL은 pg_largeobject 시스템 테이블에 청크 단위로 저장합니다. MySQL은 LONGBLOB/LONGTEXT로 최대 4GB까지 저장합니다.', en: 'PostgreSQL stores in pg_largeobject system table in chunks. MySQL uses LONGBLOB/LONGTEXT up to 4GB.' },
    },
    {
      name: { ko: '외부 스토리지', en: 'External Storage' },
      size: locale === 'ko' ? '무제한' : 'Unlimited',
      color: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', header: 'bg-rose-500', text: 'text-rose-700 dark:text-rose-300' },
      types: ['S3', 'GCS', 'Azure Blob', 'URL'],
      pg: { ko: 'URL만 DB에 저장', en: 'Store only URL in DB' },
      mysql: { ko: 'URL만 DB에 저장', en: 'Store only URL in DB' },
      desc: { ko: '수 MB 이상의 파일은 오브젝트 스토리지에 저장하고, URL만 DB에 기록하는 것이 실무 권장 패턴입니다.', en: 'For files larger than a few MB, store in object storage and record only the URL in DB. This is the recommended production pattern.' },
    },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-rose-500 text-white text-xs font-bold">
          LO
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '데이터 크기별 저장 전략' : 'Storage Strategy by Data Size'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '각 단계를 클릭하여 상세 정보를 확인하세요' : 'Click each tier for details'}
          </p>
        </div>
      </div>

      {/* Size scale bar */}
      <div className="mb-4 flex items-center gap-1 text-[9px] text-muted-foreground">
        <span>{locale === 'ko' ? '작음' : 'Small'}</span>
        <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-emerald-500/40 via-blue-500/40 via-amber-500/40 to-rose-500/40" />
        <span>{locale === 'ko' ? '대용량' : 'Large'}</span>
      </div>

      {/* Tier cards */}
      <div className="grid grid-cols-4 gap-2">
        {tiers.map((tier, i) => (
          <button
            key={i}
            onClick={() => setActiveTier(activeTier === i ? null : i)}
            className={`rounded-lg border text-left transition-all ${tier.color.border} ${tier.color.bg} ${
              activeTier === i ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
            }`}
          >
            <div className={`${tier.color.header} px-2 py-1.5 rounded-t-[7px]`}>
              <span className="text-white text-[10px] font-bold">{tier.name[locale]}</span>
            </div>
            <div className="p-2">
              <p className={`text-[12px] font-bold font-mono ${tier.color.text}`}>{tier.size}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {tier.types.map((t) => (
                  <span key={t} className="text-[9px] font-mono bg-background/60 px-1 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {activeTier !== null && (
        <div className={`mt-3 rounded-lg border ${tiers[activeTier].color.border} ${tiers[activeTier].color.bg} p-4 transition-all`}>
          <p className="text-xs leading-relaxed mb-3">{tiers[activeTier].desc[locale]}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-background/60 p-2.5">
              <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-1">PostgreSQL</p>
              <p className="text-[11px] text-foreground">{tiers[activeTier].pg[locale]}</p>
            </div>
            <div className="rounded-md bg-background/60 p-2.5">
              <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 mb-1">MySQL</p>
              <p className="text-[11px] text-foreground">{tiers[activeTier].mysql[locale]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tip */}
      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? '수 KB 이하 → DB 직접 저장, 수 MB 이상 → S3/GCS에 저장 후 URL만 DB에 기록하는 것이 실무 표준입니다.'
            : 'A few KB or less → store in DB directly. A few MB or more → store in S3/GCS and record only the URL in DB.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ERD Modeling — Relationship Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function ERDModelingDiagram({ locale }: DiagramProps) {
  const [activeRel, setActiveRel] = useState<number | null>(null);

  const relations = [
    {
      type: '1:1',
      label: { ko: '일대일', en: 'One-to-One' },
      color: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', header: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
      left: 'Customer',
      right: 'Profile',
      desc: { ko: '한 고객은 하나의 프로필만 가집니다. FK에 UNIQUE 제약조건으로 보장합니다.', en: 'One customer has exactly one profile. Guaranteed by UNIQUE constraint on FK.' },
      sql: 'customer_profiles.customer_id UNIQUE → customers.id',
    },
    {
      type: '1:N',
      label: { ko: '일대다', en: 'One-to-Many' },
      color: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', header: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400' },
      left: 'Customer',
      right: 'Orders',
      desc: { ko: '한 고객은 여러 주문을 할 수 있습니다. 가장 흔한 관계입니다.', en: 'One customer can have many orders. The most common relationship type.' },
      sql: 'orders.customer_id → customers.id',
    },
    {
      type: 'N:M',
      label: { ko: '다대다', en: 'Many-to-Many' },
      color: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', header: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
      left: 'Orders',
      right: 'Products',
      desc: { ko: '주문과 상품은 다대다 관계입니다. 중간 테이블(order_items)로 해소합니다.', en: 'Orders and products have a many-to-many relationship. Resolved via junction table (order_items).' },
      sql: 'order_items(order_id, product_id)',
    },
    {
      type: locale === 'ko' ? '자기참조' : 'Self',
      label: { ko: '자기참조', en: 'Self-Referencing' },
      color: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', header: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
      left: 'Category',
      right: 'Category',
      desc: { ko: '같은 테이블 내에서 부모-자식 관계를 형성합니다. 계층 구조에 사용합니다.', en: 'Forms parent-child relationships within the same table. Used for hierarchies.' },
      sql: 'categories.parent_id → categories.id',
    },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-rose-500 text-white text-xs font-bold">
          ER
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? 'ERD 관계 유형' : 'ERD Relationship Types'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '각 관계를 클릭하여 상세 정보 확인' : 'Click each relationship for details'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {relations.map((rel, i) => (
          <button
            key={i}
            onClick={() => setActiveRel(activeRel === i ? null : i)}
            className={`rounded-lg border text-left transition-all ${rel.color.border} ${rel.color.bg} ${
              activeRel === i ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
            }`}
          >
            <div className={`${rel.color.header} px-2 py-1.5 rounded-t-[7px] text-center`}>
              <span className="text-white text-[11px] font-bold">{rel.type}</span>
            </div>
            <div className="p-2 text-center">
              <p className={`text-[10px] font-bold ${rel.color.text}`}>{rel.label[locale]}</p>
              <div className="mt-1.5 flex items-center justify-center gap-1 text-[9px] font-mono text-muted-foreground">
                <span className="bg-background/60 px-1 py-0.5 rounded">{rel.left}</span>
                <span>→</span>
                <span className="bg-background/60 px-1 py-0.5 rounded">{rel.right}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {activeRel !== null && (
        <div className={`mt-3 rounded-lg border ${relations[activeRel].color.border} ${relations[activeRel].color.bg} p-4 transition-all`}>
          <p className="text-xs leading-relaxed mb-2">{relations[activeRel].desc[locale]}</p>
          <div className="rounded-md bg-background/60 p-2">
            <p className="text-[10px] font-mono text-muted-foreground">{relations[activeRel].sql}</p>
          </div>
        </div>
      )}

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? 'Crow\'s Foot 표기법에서 ─ 은 1, ─< 은 N(다수)을 의미합니다. N:M 관계는 반드시 중간 테이블로 해소해야 합니다.'
            : 'In Crow\'s Foot notation, ─ means 1, ─< means N (many). N:M relationships must be resolved with a junction table.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Data Modeling — 3 Stage Pipeline
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function DataModelingDiagram({ locale }: DiagramProps) {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const stages = [
    {
      num: '01',
      name: { ko: '개념적 모델링', en: 'Conceptual' },
      color: { bg: 'bg-sky-500/10', border: 'border-sky-500/30', header: 'bg-sky-500', text: 'text-sky-600 dark:text-sky-400' },
      output: { ko: 'ERD', en: 'ERD' },
      items: [
        { ko: '엔터티 도출', en: 'Identify entities' },
        { ko: '속성 정의', en: 'Define attributes' },
        { ko: '관계 설정', en: 'Establish relationships' },
      ],
      desc: { ko: '비즈니스 요구사항을 추상적으로 표현합니다. DBMS에 독립적이며 업무 담당자와 소통 가능한 수준입니다.', en: 'Abstract representation of business requirements. DBMS-independent and understandable by business stakeholders.' },
    },
    {
      num: '02',
      name: { ko: '논리적 모델링', en: 'Logical' },
      color: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', header: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400' },
      output: { ko: locale === 'ko' ? '정규화된 스키마' : 'Normalized Schema', en: 'Normalized Schema' },
      items: [
        { ko: '정규화 (1NF~BCNF)', en: 'Normalization (1NF~BCNF)' },
        { ko: 'PK / FK 결정', en: 'Define PK / FK' },
        { ko: '데이터 타입 논리 정의', en: 'Logical data types' },
      ],
      desc: { ko: '개념적 모델을 테이블 구조로 변환합니다. 정규화를 통해 데이터 중복과 이상현상을 방지합니다.', en: 'Transform conceptual model into table structures. Normalization prevents data redundancy and anomalies.' },
    },
    {
      num: '03',
      name: { ko: '물리적 모델링', en: 'Physical' },
      color: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', header: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
      output: { ko: 'DDL + 인덱스', en: 'DDL + Indexes' },
      items: [
        { ko: 'DBMS별 데이터 타입', en: 'DBMS-specific types' },
        { ko: '인덱스 / 파티션', en: 'Indexes / Partitions' },
        { ko: '반정규화 검토', en: 'Denormalization review' },
      ],
      desc: { ko: '특정 DBMS에 맞게 최적화합니다. 성능을 위해 인덱스, 파티셔닝, 반정규화를 적용합니다.', en: 'Optimize for a specific DBMS. Apply indexes, partitioning, and denormalization for performance.' },
    },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500 text-white text-xs font-bold">
          DM
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '데이터 모델링 3단계' : '3 Stages of Data Modeling'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '각 단계를 클릭하여 상세 내용 확인' : 'Click each stage for details'}
          </p>
        </div>
      </div>

      {/* Pipeline flow */}
      <div className="flex items-center gap-1 mb-4">
        {stages.map((stage, i) => (
          <Fragment key={i}>
            <button
              onClick={() => setActiveStage(activeStage === i ? null : i)}
              className={`flex-1 rounded-lg border text-left transition-all ${stage.color.border} ${stage.color.bg} ${
                activeStage === i ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
              }`}
            >
              <div className={`${stage.color.header} px-2 py-1.5 rounded-t-[7px] flex items-center justify-between`}>
                <span className="text-white text-[10px] font-bold">{stage.num}</span>
                <span className="text-white/80 text-[9px]">{stage.output[locale]}</span>
              </div>
              <div className="p-2.5">
                <p className={`text-[11px] font-bold ${stage.color.text}`}>{stage.name[locale]}</p>
                <ul className="mt-1.5 space-y-0.5">
                  {stage.items.map((item, j) => (
                    <li key={j} className="text-[9px] text-muted-foreground flex items-center gap-1">
                      <span className={`w-1 h-1 rounded-full ${stage.color.header}`} />
                      {item[locale]}
                    </li>
                  ))}
                </ul>
              </div>
            </button>
            {i < stages.length - 1 && (
              <div className="text-muted-foreground text-sm font-bold">→</div>
            )}
          </Fragment>
        ))}
      </div>

      {activeStage !== null && (
        <div className={`rounded-lg border ${stages[activeStage].color.border} ${stages[activeStage].color.bg} p-4 transition-all`}>
          <p className="text-xs leading-relaxed">{stages[activeStage].desc[locale]}</p>
        </div>
      )}

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? '실무에서는 물리적 모델링 시 성능을 위해 반정규화를 적용하기도 합니다. 정규화와 반정규화의 균형이 중요합니다.'
            : 'In practice, denormalization is sometimes applied during physical modeling for performance. Balance between normalization and denormalization is key.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Data Mart — Star Schema
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function DataMartDiagram({ locale }: DiagramProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const factTable = {
    id: 'fact',
    name: 'fact_sales',
    label: { ko: '팩트 테이블', en: 'Fact Table' },
    color: 'bg-rose-500',
    desc: { ko: '측정값(매출액, 수량 등)을 저장하는 중심 테이블입니다. 디멘션 테이블의 FK를 가집니다.', en: 'Central table storing measurements (revenue, quantity, etc.). Contains FKs to dimension tables.' },
    cols: ['sale_id PK', 'date_key FK', 'product_key FK', 'customer_key FK', 'quantity', 'amount'],
  };

  const dims = [
    {
      id: 'date',
      name: 'dim_date',
      label: { ko: '시간', en: 'Date' },
      color: 'bg-sky-500',
      desc: { ko: '연/분기/월/일/요일/공휴일 등 시간 축 분석용 디멘션입니다.', en: 'Dimension for time-based analysis: year, quarter, month, day, weekday, holiday.' },
      cols: ['date_key PK', 'full_date', 'year', 'quarter', 'month'],
    },
    {
      id: 'product',
      name: 'dim_product',
      label: { ko: '상품', en: 'Product' },
      color: 'bg-violet-500',
      desc: { ko: '상품명, 카테고리, 브랜드 등 상품 분석 축입니다.', en: 'Product analysis axis: name, category, brand.' },
      cols: ['product_key PK', 'name', 'category', 'brand'],
    },
    {
      id: 'customer',
      name: 'dim_customer',
      label: { ko: '고객', en: 'Customer' },
      color: 'bg-emerald-500',
      desc: { ko: '고객명, 지역, 등급 등 고객 분석 축입니다.', en: 'Customer analysis axis: name, region, tier.' },
      cols: ['customer_key PK', 'name', 'city', 'country', 'tier'],
    },
    {
      id: 'store',
      name: 'dim_store',
      label: { ko: '매장', en: 'Store' },
      color: 'bg-amber-500',
      desc: { ko: '매장/채널 분석용 디멘션입니다. 오프라인/온라인 구분 등에 활용합니다.', en: 'Dimension for store/channel analysis. Used for offline/online segmentation.' },
      cols: ['store_key PK', 'name', 'region', 'channel'],
    },
  ];

  const active = activeNode === 'fact' ? factTable : dims.find((d) => d.id === activeNode);

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-amber-500 text-white text-[9px] font-bold">
          ★
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '스타 스키마 (Star Schema)' : 'Star Schema'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '팩트 테이블 중심, 디멘션으로 둘러싸인 구조' : 'Fact table center, surrounded by dimensions'}
          </p>
        </div>
      </div>

      {/* Star layout */}
      <div className="relative flex flex-col items-center gap-2">
        {/* Top dim */}
        <button
          onClick={() => setActiveNode(activeNode === 'date' ? null : 'date')}
          className={`rounded-lg border ${dims[0].color}/10 border-sky-500/30 bg-sky-500/10 px-4 py-2 transition-all ${
            activeNode === 'date' ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
          }`}
        >
          <p className="text-[9px] font-bold text-sky-600 dark:text-sky-400">{dims[0].label[locale]}</p>
          <p className="text-[10px] font-mono text-muted-foreground">{dims[0].name}</p>
        </button>
        <div className="text-muted-foreground text-[10px]">↓ FK</div>

        {/* Middle row: left dim → FACT → right dim */}
        <div className="flex items-center gap-2 w-full justify-center">
          <button
            onClick={() => setActiveNode(activeNode === 'customer' ? null : 'customer')}
            className={`rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 transition-all ${
              activeNode === 'customer' ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
            }`}
          >
            <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">{dims[2].label[locale]}</p>
            <p className="text-[10px] font-mono text-muted-foreground">{dims[2].name}</p>
          </button>
          <span className="text-muted-foreground text-[10px]">FK →</span>

          <button
            onClick={() => setActiveNode(activeNode === 'fact' ? null : 'fact')}
            className={`rounded-lg border-2 border-rose-500/50 bg-rose-500/10 px-5 py-3 transition-all ${
              activeNode === 'fact' ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
            }`}
          >
            <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400">{factTable.label[locale]}</p>
            <p className="text-[11px] font-mono font-bold text-foreground">{factTable.name}</p>
          </button>

          <span className="text-muted-foreground text-[10px]">← FK</span>
          <button
            onClick={() => setActiveNode(activeNode === 'product' ? null : 'product')}
            className={`rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 transition-all ${
              activeNode === 'product' ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
            }`}
          >
            <p className="text-[9px] font-bold text-violet-600 dark:text-violet-400">{dims[1].label[locale]}</p>
            <p className="text-[10px] font-mono text-muted-foreground">{dims[1].name}</p>
          </button>
        </div>

        <div className="text-muted-foreground text-[10px]">↑ FK</div>
        <button
          onClick={() => setActiveNode(activeNode === 'store' ? null : 'store')}
          className={`rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 transition-all ${
            activeNode === 'store' ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
          }`}
        >
          <p className="text-[9px] font-bold text-amber-600 dark:text-amber-400">{dims[3].label[locale]}</p>
          <p className="text-[10px] font-mono text-muted-foreground">{dims[3].name}</p>
        </button>
      </div>

      {active && (
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4 transition-all">
          <p className="text-xs leading-relaxed mb-2">{active.desc[locale]}</p>
          <div className="flex flex-wrap gap-1">
            {active.cols.map((col) => (
              <span
                key={col}
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                  col.includes('PK')
                    ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 font-bold'
                    : col.includes('FK')
                      ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                      : 'bg-background/60 text-muted-foreground'
                }`}
              >
                {col}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? '스타 스키마는 디멘션이 정규화되지 않아 JOIN이 적습니다. 스노우플레이크 스키마는 디멘션을 추가 정규화하여 저장 효율을 높입니다.'
            : 'Star schema has denormalized dimensions for fewer JOINs. Snowflake schema further normalizes dimensions for storage efficiency.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Data Warehouse — ETL Pipeline
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function DataWarehouseDiagram({ locale }: DiagramProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      icon: '📦',
      name: { ko: '원천 시스템', en: 'Source Systems' },
      color: { bg: 'bg-slate-500/10', border: 'border-slate-500/30', header: 'bg-slate-600' },
      items: ['OLTP DB', 'ERP', 'CRM', 'API', 'CSV/Excel'],
      desc: { ko: '운영 데이터가 생성되는 다양한 원천 시스템입니다. 각각 다른 형식과 스키마를 가집니다.', en: 'Various source systems where operational data originates. Each has different formats and schemas.' },
    },
    {
      icon: '⚙️',
      name: { ko: 'ETL / ELT', en: 'ETL / ELT' },
      color: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', header: 'bg-orange-500' },
      items: ['Extract', 'Transform', 'Load', 'CDC'],
      desc: { ko: 'ETL: 변환 후 적재 (전통적). ELT: 적재 후 변환 (클라우드 DW). CDC로 실시간 변경 캡처도 가능합니다.', en: 'ETL: transform then load (traditional). ELT: load then transform (cloud DW). CDC enables real-time change capture.' },
    },
    {
      icon: '🏢',
      name: { ko: '데이터 웨어하우스', en: 'Data Warehouse' },
      color: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', header: 'bg-blue-500' },
      items: ['Staging', 'ODS', 'DW Core', 'History'],
      desc: { ko: '전사 통합 데이터 저장소. 주제 지향적, 통합적, 시간 가변적, 비휘발성의 4가지 특성을 가집니다.', en: 'Enterprise-wide integrated data store. Has 4 properties: subject-oriented, integrated, time-variant, non-volatile.' },
    },
    {
      icon: '📊',
      name: { ko: '데이터 마트', en: 'Data Marts' },
      color: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', header: 'bg-violet-500' },
      items: [
        locale === 'ko' ? '매출 마트' : 'Sales Mart',
        locale === 'ko' ? '마케팅 마트' : 'Marketing',
        locale === 'ko' ? '재무 마트' : 'Finance',
      ],
      desc: { ko: '부서별 최적화된 소규모 데이터 저장소. DW에서 필요한 데이터만 추출하여 스타 스키마로 구성합니다.', en: 'Department-optimized small data stores. Extract needed data from DW and organize in star schema.' },
    },
    {
      icon: '👤',
      name: { ko: '소비자', en: 'Consumers' },
      color: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', header: 'bg-emerald-500' },
      items: ['BI Dashboard', locale === 'ko' ? '리포트' : 'Reports', 'ML/AI', 'Ad-hoc'],
      desc: { ko: 'BI 도구, 대시보드, 리포트, ML 모델 등이 마트 데이터를 소비합니다.', en: 'BI tools, dashboards, reports, and ML models consume mart data.' },
    },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-emerald-500 text-white text-xs font-bold">
          DW
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '데이터 웨어하우스 아키텍처' : 'Data Warehouse Architecture'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '데이터 흐름의 각 단계를 클릭하세요' : 'Click each stage of the data flow'}
          </p>
        </div>
      </div>

      {/* Pipeline */}
      <div className="flex items-stretch gap-1">
        {steps.map((step, i) => (
          <Fragment key={i}>
            <button
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              className={`flex-1 rounded-lg border text-left transition-all ${step.color.border} ${step.color.bg} ${
                activeStep === i ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
              }`}
            >
              <div className={`${step.color.header} px-2 py-1 rounded-t-[7px] text-center`}>
                <span className="text-[10px]">{step.icon}</span>
              </div>
              <div className="p-2">
                <p className="text-[10px] font-bold text-foreground text-center">{step.name[locale]}</p>
                <div className="mt-1 space-y-0.5">
                  {step.items.map((item, j) => (
                    <p key={j} className="text-[8px] text-muted-foreground text-center font-mono">{item}</p>
                  ))}
                </div>
              </div>
            </button>
            {i < steps.length - 1 && (
              <div className="flex items-center text-muted-foreground text-xs font-bold">→</div>
            )}
          </Fragment>
        ))}
      </div>

      {activeStep !== null && (
        <div className={`mt-3 rounded-lg border ${steps[activeStep].color.border} ${steps[activeStep].color.bg} p-4 transition-all`}>
          <p className="text-xs leading-relaxed">{steps[activeStep].desc[locale]}</p>
        </div>
      )}

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? '클라우드 DW(BigQuery, Redshift)에서는 ELT가 주류입니다. 원본 데이터를 먼저 적재하고 DW 엔진의 처리 능력으로 변환합니다.'
            : 'In cloud DW (BigQuery, Redshift), ELT is mainstream. Load raw data first, then transform using the DW engine\'s processing power.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Data Migration — Strategy Comparison
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function DataMigrationDiagram({ locale }: DiagramProps) {
  const [activeStrategy, setActiveStrategy] = useState<number | null>(null);

  const strategies = [
    {
      name: { ko: '빅뱅', en: 'Big Bang' },
      icon: '💥',
      color: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', header: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
      downtime: { ko: '길다', en: 'Long' },
      risk: { ko: '높음', en: 'High' },
      cost: { ko: '낮음', en: 'Low' },
      desc: { ko: '한 번에 전체 데이터를 이관합니다. 단순하지만 다운타임이 길고 롤백이 어렵습니다.', en: 'Migrate all data at once. Simple but long downtime and difficult rollback.' },
      flow: ['Stop Old DB', '→', 'Full Dump', '→', 'Load New DB', '→', 'Switch App'],
    },
    {
      name: { ko: '점진적', en: 'Trickle' },
      icon: '🔄',
      color: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', header: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
      downtime: { ko: '짧다', en: 'Short' },
      risk: { ko: '중간', en: 'Medium' },
      cost: { ko: '중간', en: 'Medium' },
      desc: { ko: '단계별로 테이블/데이터를 나눠 이관합니다. 복잡하지만 위험을 분산합니다.', en: 'Migrate tables/data in phases. Complex but spreads risk across iterations.' },
      flow: ['Phase 1', '→', 'Phase 2', '→', 'Phase 3', '→', 'Complete'],
    },
    {
      name: { ko: '병행 운영', en: 'Parallel Run' },
      icon: '⚡',
      color: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', header: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
      downtime: { ko: '없음', en: 'None' },
      risk: { ko: '낮음', en: 'Low' },
      cost: { ko: '높음', en: 'High' },
      desc: { ko: '양쪽 시스템을 동시 운영하며 데이터를 동기화합니다. 비용은 높지만 안전합니다.', en: 'Run both systems simultaneously with data sync. Expensive but safe.' },
      flow: ['Old DB ↔ Sync ↔ New DB', '→', 'Verify', '→', 'Cut Over'],
    },
    {
      name: { ko: '블루-그린', en: 'Blue-Green' },
      icon: '🟢',
      color: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', header: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
      downtime: { ko: '매우 짧다', en: 'Very Short' },
      risk: { ko: '낮음', en: 'Low' },
      cost: { ko: '중간', en: 'Medium' },
      desc: { ko: '새 환경을 미리 준비하고 DNS/LB로 즉시 전환합니다. 롤백도 즉시 가능합니다.', en: 'Prepare new environment in advance, switch instantly via DNS/LB. Instant rollback possible.' },
      flow: ['Prep Green', '→', 'Replicate', '→', 'DNS Switch', '→', locale === 'ko' ? '완료' : 'Done'],
    },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-emerald-500 text-white text-xs font-bold">
          MG
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '데이터 이관 전략 비교' : 'Migration Strategy Comparison'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '각 전략을 클릭하여 비교하세요' : 'Click each strategy to compare'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {strategies.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveStrategy(activeStrategy === i ? null : i)}
            className={`rounded-lg border text-left transition-all ${s.color.border} ${s.color.bg} ${
              activeStrategy === i ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
            }`}
          >
            <div className={`${s.color.header} px-2 py-1.5 rounded-t-[7px] text-center`}>
              <span className="text-sm">{s.icon}</span>
            </div>
            <div className="p-2 text-center">
              <p className={`text-[10px] font-bold ${s.color.text}`}>{s.name[locale]}</p>
              <div className="mt-1.5 space-y-0.5 text-[9px] text-muted-foreground">
                <p>{locale === 'ko' ? '다운타임' : 'Downtime'}: <span className="font-bold">{s.downtime[locale]}</span></p>
                <p>{locale === 'ko' ? '위험도' : 'Risk'}: <span className="font-bold">{s.risk[locale]}</span></p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {activeStrategy !== null && (
        <div className={`mt-3 rounded-lg border ${strategies[activeStrategy].color.border} ${strategies[activeStrategy].color.bg} p-4 transition-all`}>
          <p className="text-xs leading-relaxed mb-3">{strategies[activeStrategy].desc[locale]}</p>
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {strategies[activeStrategy].flow.map((step, j) => (
              <span
                key={j}
                className={`text-[9px] font-mono ${
                  step === '→' ? 'text-muted-foreground' : 'bg-background/60 px-2 py-0.5 rounded border border-border'
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? '이관 후 반드시 행 수 비교, 체크섬, 샘플 검증을 수행하세요. AWS DMS나 pgloader 같은 도구를 활용하면 이종 DB 이관이 수월합니다.'
            : 'Always perform row count comparison, checksums, and sample verification after migration. Tools like AWS DMS or pgloader simplify cross-platform migration.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DB Engine & Storage — Architecture
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function DbEngineDiagram({ locale }: DiagramProps) {
  const [activeDb, setActiveDb] = useState<'pg' | 'mysql'>('pg');
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  const dbs = {
    pg: {
      name: 'PostgreSQL',
      layers: [
        {
          name: 'Shared Buffers',
          color: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', header: 'bg-blue-500' },
          items: ['Data Pages', 'WAL Buffer', 'CLOG Buffer'],
          desc: { ko: '디스크에서 읽은 데이터를 캐싱하는 공유 메모리 영역. RAM의 25%가 권장값입니다.', en: 'Shared memory area caching data read from disk. 25% of RAM is the recommended value.' },
        },
        {
          name: 'WAL (Write-Ahead Log)',
          color: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', header: 'bg-amber-500' },
          items: ['Redo Records', 'Checkpoint', 'Archive'],
          desc: { ko: '데이터 변경 전 로그를 먼저 기록하여 장애 복구를 보장합니다. 복제에도 활용됩니다.', en: 'Writes log before data changes for crash recovery. Also used for replication.' },
        },
        {
          name: 'Heap / Index / TOAST',
          color: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', header: 'bg-emerald-500' },
          items: ['Heap Files (.dat)', 'B-tree / GIN / GiST', 'TOAST (large values)'],
          desc: { ko: '실제 디스크 저장 구조. Heap 파일에 행 데이터, B-tree 등으로 인덱스, TOAST로 대형 값을 저장합니다.', en: 'Physical disk storage. Row data in heap files, B-tree indexes, and TOAST for large values.' },
        },
      ],
    },
    mysql: {
      name: 'MySQL (InnoDB)',
      layers: [
        {
          name: 'Buffer Pool',
          color: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', header: 'bg-orange-500' },
          items: ['Data Pages', 'Change Buffer', 'Adaptive Hash Index'],
          desc: { ko: 'InnoDB의 메인 캐시. RAM의 70~80%를 할당하는 것이 권장됩니다. 변경 버퍼로 쓰기를 최적화합니다.', en: 'InnoDB main cache. 70-80% of RAM recommended. Change buffer optimizes writes.' },
        },
        {
          name: 'Redo / Undo Log',
          color: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', header: 'bg-amber-500' },
          items: ['Redo Log (WAL)', 'Undo Log (MVCC)', 'Binary Log'],
          desc: { ko: 'Redo Log로 장애 복구, Undo Log로 트랜잭션 롤백과 MVCC를 구현합니다. Binlog은 복제용입니다.', en: 'Redo log for crash recovery, undo log for rollback and MVCC. Binary log for replication.' },
        },
        {
          name: 'Tablespace (.ibd)',
          color: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', header: 'bg-emerald-500' },
          items: ['Clustered Index (PK)', 'Secondary Indexes', 'Overflow Pages'],
          desc: { ko: 'InnoDB는 PK 기준으로 클러스터드 인덱스에 데이터를 저장합니다. 보조 인덱스는 PK를 가리킵니다.', en: 'InnoDB stores data in a clustered index based on PK. Secondary indexes point to PK.' },
        },
      ],
    },
  };

  const current = dbs[activeDb];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-orange-500 text-white text-xs font-bold">
          EN
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '데이터베이스 스토리지 아키텍처' : 'Database Storage Architecture'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '탭으로 엔진을 전환하고 각 레이어를 클릭하세요' : 'Switch engines with tabs, click each layer'}
          </p>
        </div>
      </div>

      {/* DB tabs */}
      <div className="flex gap-1 mb-4">
        <button
          onClick={() => { setActiveDb('pg'); setActiveLayer(null); }}
          className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
            activeDb === 'pg' ? 'bg-blue-600 text-white shadow' : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          PostgreSQL
        </button>
        <button
          onClick={() => { setActiveDb('mysql'); setActiveLayer(null); }}
          className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${
            activeDb === 'mysql' ? 'bg-orange-500 text-white shadow' : 'bg-muted hover:bg-muted/80 text-muted-foreground'
          }`}
        >
          MySQL (InnoDB)
        </button>
      </div>

      {/* Layer stack */}
      <div className="space-y-1.5">
        {current.layers.map((layer, i) => (
          <button
            key={`${activeDb}-${i}`}
            onClick={() => setActiveLayer(activeLayer === i ? null : i)}
            className={`w-full rounded-lg border text-left transition-all ${layer.color.border} ${layer.color.bg} ${
              activeLayer === i ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 p-3">
              <div className={`${layer.color.header} w-1.5 h-8 rounded-full`} />
              <div className="flex-1">
                <p className="text-[11px] font-bold text-foreground">{layer.name}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {layer.items.map((item) => (
                    <span key={item} className="text-[9px] font-mono bg-background/60 px-1.5 py-0.5 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-[9px] text-muted-foreground">
                {i === 0 ? (locale === 'ko' ? '메모리' : 'Memory') : i === 1 ? (locale === 'ko' ? '로그' : 'Log') : (locale === 'ko' ? '디스크' : 'Disk')}
              </span>
            </div>
          </button>
        ))}
      </div>

      {activeLayer !== null && (
        <div className={`mt-3 rounded-lg border ${current.layers[activeLayer].color.border} ${current.layers[activeLayer].color.bg} p-4 transition-all`}>
          <p className="text-xs leading-relaxed">{current.layers[activeLayer].desc[locale]}</p>
        </div>
      )}

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? 'PostgreSQL은 단일 스토리지 엔진, MySQL은 플러거블 엔진(InnoDB, MyISAM 등)을 사용합니다. OLTP는 행 저장, OLAP는 컬럼 저장이 유리합니다.'
            : 'PostgreSQL uses a single storage engine, MySQL uses pluggable engines (InnoDB, MyISAM, etc.). Row stores suit OLTP, column stores suit OLAP.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Backup & Recovery — Backup Types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function BackupRecoveryDiagram({ locale }: DiagramProps) {
  const [activeType, setActiveType] = useState<number | null>(null);

  const types = [
    {
      name: { ko: '논리적 백업', en: 'Logical Backup' },
      icon: '📝',
      color: { bg: 'bg-sky-500/10', border: 'border-sky-500/30', header: 'bg-sky-500', text: 'text-sky-600 dark:text-sky-400' },
      tools: { pg: 'pg_dump', mysql: 'mysqldump' },
      pros: { ko: '이식성 높음, 부분 복원 가능', en: 'Portable, partial restore possible' },
      cons: { ko: '느림, 큰 DB에 비효율', en: 'Slow, inefficient for large DBs' },
      desc: { ko: 'SQL 문 형태로 스키마와 데이터를 덤프합니다. 다른 DBMS 버전이나 플랫폼으로 이관 시 유용합니다.', en: 'Dumps schema and data as SQL statements. Useful for cross-version or cross-platform migration.' },
    },
    {
      name: { ko: '물리적 백업', en: 'Physical Backup' },
      icon: '💾',
      color: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', header: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400' },
      tools: { pg: 'pg_basebackup', mysql: 'XtraBackup' },
      pros: { ko: '빠름, 전체 클러스터 복원', en: 'Fast, full cluster restore' },
      cons: { ko: '동일 DBMS/버전만, 부분 복원 어려움', en: 'Same DBMS/version only, hard to partial restore' },
      desc: { ko: '데이터 파일을 직접 복사합니다. 대용량 DB에서 빠르고 PITR(시점 복구)의 기반이 됩니다.', en: 'Direct copy of data files. Fast for large DBs and serves as the base for PITR.' },
    },
    {
      name: { ko: 'PITR', en: 'PITR' },
      icon: '⏱️',
      color: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', header: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
      tools: { pg: 'WAL Archive', mysql: 'Binary Log' },
      pros: { ko: '특정 시점 복구, 세밀한 제어', en: 'Point-in-time recovery, fine control' },
      cons: { ko: 'WAL/Binlog 보관 필요, 설정 복잡', en: 'WAL/Binlog retention needed, complex setup' },
      desc: { ko: '물리적 백업 + WAL/Binlog를 조합하여 장애 직전이나 특정 시각으로 복구합니다.', en: 'Combines physical backup + WAL/Binlog to recover to just before failure or a specific time.' },
    },
    {
      name: { ko: '자동화 도구', en: 'Automation Tools' },
      icon: '🤖',
      color: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', header: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
      tools: { pg: 'pgBackRest / Barman', mysql: 'MySQL Enterprise / mysqlsh' },
      pros: { ko: '스케줄링, 증분, 검증 자동화', en: 'Scheduling, incremental, verification' },
      cons: { ko: '추가 설치/설정 필요', en: 'Additional setup required' },
      desc: { ko: '전체/증분/차등 백업 스케줄링, 백업 검증, 보존 정책을 자동 관리합니다.', en: 'Automates full/incremental/differential scheduling, backup verification, and retention policies.' },
    },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-amber-500 text-white text-xs font-bold">
          BK
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '백업 전략 비교' : 'Backup Strategy Comparison'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '각 백업 유형을 클릭하여 비교하세요' : 'Click each backup type to compare'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {types.map((t, i) => (
          <button
            key={i}
            onClick={() => setActiveType(activeType === i ? null : i)}
            className={`rounded-lg border text-left transition-all ${t.color.border} ${t.color.bg} ${
              activeType === i ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
            }`}
          >
            <div className={`${t.color.header} px-2 py-1.5 rounded-t-[7px] text-center`}>
              <span className="text-sm">{t.icon}</span>
            </div>
            <div className="p-2 text-center">
              <p className={`text-[10px] font-bold ${t.color.text}`}>{t.name[locale]}</p>
              <div className="mt-1.5 space-y-0.5 text-[8px] font-mono text-muted-foreground">
                <p>PG: {t.tools.pg}</p>
                <p>MY: {t.tools.mysql}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {activeType !== null && (
        <div className={`mt-3 rounded-lg border ${types[activeType].color.border} ${types[activeType].color.bg} p-4 transition-all`}>
          <p className="text-xs leading-relaxed mb-2">{types[activeType].desc[locale]}</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="rounded-md bg-emerald-500/10 p-2">
              <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">{locale === 'ko' ? '장점' : 'Pros'}</p>
              <p className="text-[10px]">{types[activeType].pros[locale]}</p>
            </div>
            <div className="rounded-md bg-rose-500/10 p-2">
              <p className="text-[9px] font-bold text-rose-600 dark:text-rose-400 mb-0.5">{locale === 'ko' ? '단점' : 'Cons'}</p>
              <p className="text-[10px]">{types[activeType].cons[locale]}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? '3-2-1 백업 규칙: 최소 3벌, 2종류 이상의 매체, 1벌은 오프사이트에 보관하세요.'
            : '3-2-1 backup rule: keep at least 3 copies, on 2 different media, with 1 offsite.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Replication & HA — Architecture
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function ReplicationHADiagram({ locale }: DiagramProps) {
  const [activeMode, setActiveMode] = useState<number | null>(null);

  const modes = [
    {
      name: { ko: '스트리밍 복제', en: 'Streaming Replication' },
      scope: 'PostgreSQL',
      color: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', header: 'bg-blue-500' },
      type: { ko: '물리적 / 비동기·동기', en: 'Physical / Async or Sync' },
      desc: { ko: 'WAL 레코드를 Standby에 전송. 전체 클러스터 단위 복제. HA와 읽기 분산에 활용합니다.', en: 'Sends WAL records to standby. Cluster-wide replication. Used for HA and read scaling.' },
    },
    {
      name: { ko: '논리적 복제', en: 'Logical Replication' },
      scope: 'PostgreSQL',
      color: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', header: 'bg-teal-500' },
      type: { ko: '논리적 / Publication-Subscription', en: 'Logical / Pub-Sub' },
      desc: { ko: '테이블 단위 선택 복제. 다른 PG 버전 간 가능. Subscriber에서 쓰기도 가능합니다.', en: 'Selective table replication. Cross-version support. Subscriber can write.' },
    },
    {
      name: { ko: 'Source-Replica', en: 'Source-Replica' },
      scope: 'MySQL',
      color: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', header: 'bg-orange-500' },
      type: { ko: 'Binlog 기반 / 비동기·반동기', en: 'Binlog-based / Async or Semi-sync' },
      desc: { ko: 'Binary Log를 Replica에 전송. GTID로 위치 관리. 읽기 분산과 백업 서버로 활용합니다.', en: 'Sends binary logs to replica. Position managed by GTID. Used for read scaling and backup.' },
    },
    {
      name: { ko: 'Group Replication', en: 'Group Replication' },
      scope: 'MySQL 8.0+',
      color: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', header: 'bg-rose-500' },
      type: { ko: '멀티소스 / 합의 기반', en: 'Multi-source / Consensus' },
      desc: { ko: '3~9 노드 클러스터. Paxos 합의로 자동 장애 복구. Single-Primary 또는 Multi-Primary 모드를 지원합니다.', en: '3-9 node cluster. Paxos consensus for auto failover. Supports Single or Multi-Primary mode.' },
    },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 text-white text-xs font-bold">
          HA
        </span>
        <div>
          <h3 className="text-sm font-bold">
            {locale === 'ko' ? '복제 방식 비교' : 'Replication Modes'}
          </h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '각 복제 방식을 클릭하여 비교하세요' : 'Click each replication mode to compare'}
          </p>
        </div>
      </div>

      {/* HA Topology */}
      <div className="mb-4 flex items-center justify-center gap-4 text-[10px]">
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-center">
          <p className="font-bold text-blue-600 dark:text-blue-400">Primary</p>
          <p className="text-muted-foreground">R/W</p>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-muted-foreground">← Replication →</span>
          <span className="text-[8px] text-muted-foreground">(WAL / Binlog)</span>
        </div>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center">
          <p className="font-bold text-emerald-600 dark:text-emerald-400">Standby / Replica</p>
          <p className="text-muted-foreground">Read-Only</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {modes.map((m, i) => (
          <button
            key={i}
            onClick={() => setActiveMode(activeMode === i ? null : i)}
            className={`rounded-lg border text-left transition-all ${m.color.border} ${m.color.bg} ${
              activeMode === i ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'
            }`}
          >
            <div className={`${m.color.header} px-2 py-1 rounded-t-[7px] flex items-center justify-between`}>
              <span className="text-white text-[10px] font-bold">{m.name[locale]}</span>
              <span className="text-white/70 text-[8px]">{m.scope}</span>
            </div>
            <div className="p-2">
              <p className="text-[9px] text-muted-foreground">{m.type[locale]}</p>
            </div>
          </button>
        ))}
      </div>

      {activeMode !== null && (
        <div className={`mt-3 rounded-lg border ${modes[activeMode].color.border} ${modes[activeMode].color.bg} p-4 transition-all`}>
          <p className="text-xs leading-relaxed">{modes[activeMode].desc[locale]}</p>
        </div>
      )}

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">TIP:</span>{' '}
          {locale === 'ko'
            ? '클라우드에서는 RDS Multi-AZ, Aurora, Cloud SQL 등이 자동 HA를 제공합니다. 온프레미스에서는 Patroni(PG)나 InnoDB Cluster(MySQL)를 권장합니다.'
            : 'In cloud, RDS Multi-AZ, Aurora, Cloud SQL provide automatic HA. On-premise, use Patroni (PG) or InnoDB Cluster (MySQL).'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// InnoDB Deep Dive — Internal Layers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function InnoDBDiagram({ locale }: DiagramProps) {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const components = {
    bufferPool: {
      name: { ko: 'Buffer Pool', en: 'Buffer Pool' },
      icon: '🧠',
      size: { ko: 'RAM 70-80%', en: 'RAM 70-80%' },
      desc: {
        ko: 'InnoDB의 핵심 캐시. 디스크 I/O를 최소화하여 성능을 좌우합니다. LRU 알고리즘으로 관리하며, 히트율 99% 이상이 목표입니다.',
        en: 'Core cache that minimizes disk I/O. Managed by LRU algorithm, target 99%+ hit rate.',
      },
      subItems: ['Data Pages', 'Index Pages', 'Change Buffer', 'Adaptive Hash'],
    },
    logBuffer: {
      name: { ko: 'Log Buffer', en: 'Log Buffer' },
      icon: '📝',
      size: { ko: '16MB', en: '16MB' },
      desc: {
        ko: 'Redo Log를 디스크에 쓰기 전 메모리에서 버퍼링. 트랜잭션 커밋 시 디스크로 플러시됩니다.',
        en: 'Buffers redo log entries before writing to disk. Flushed on transaction commit.',
      },
    },
    redoLog: {
      name: { ko: 'Redo Log', en: 'Redo Log' },
      icon: '📋',
      size: { ko: '수 GB', en: 'Several GB' },
      desc: {
        ko: 'WAL(Write-Ahead Logging) 방식으로 커밋된 트랜잭션을 보장. 장애 발생 시 복구에 사용됩니다.',
        en: 'WAL for crash recovery. Ensures durability of committed transactions.',
      },
    },
    undoLog: {
      name: { ko: 'Undo Log', en: 'Undo Log' },
      icon: '↩️',
      size: { ko: 'Auto', en: 'Auto' },
      desc: {
        ko: '트랜잭션 롤백과 MVCC 읽기 일관성을 제공. 이전 버전의 데이터를 보관합니다.',
        en: 'Provides rollback and MVCC read consistency. Stores previous versions of data.',
      },
    },
    dataFiles: {
      name: { ko: 'Data Files (.ibd)', en: 'Data Files (.ibd)' },
      icon: '💾',
      size: { ko: 'Variable', en: 'Variable' },
      desc: {
        ko: 'PK 기준 클러스터드 인덱스로 저장. 각 테이블은 별도의 .ibd 파일로 관리됩니다.',
        en: 'Stored as clustered index by PK. Each table has its own .ibd file.',
      },
    },
    threads: {
      name: { ko: 'Background Threads', en: 'Background Threads' },
      icon: '⚙️',
      desc: {
        ko: 'Master Thread(메인), IO Threads(읽기/쓰기), Purge Thread(삭제), Page Cleaner(플러시)가 백그라운드에서 실행됩니다.',
        en: 'Master (main), IO (read/write), Purge (cleanup), Page Cleaner (flush) run in background.',
      },
    },
  };

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 text-white text-[9px] font-bold">
          IDB
        </span>
        <div>
          <h3 className="text-sm font-bold">InnoDB {locale === 'ko' ? '아키텍처' : 'Architecture'}</h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '컴포넌트를 클릭하여 상세 정보 확인' : 'Click components for details'}
          </p>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="relative space-y-4">
        {/* Client Layer */}
        <div className="flex justify-center">
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
            <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300">
              {locale === 'ko' ? '📱 클라이언트 / 애플리케이션' : '📱 Client / Application'}
            </p>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center">
          <div className="text-2xl text-muted-foreground">↓</div>
        </div>

        {/* Memory Layer */}
        <div className="border-2 border-orange-500/30 rounded-xl p-4 bg-orange-500/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-orange-700 dark:text-orange-300">
              💭 {locale === 'ko' ? 'IN-MEMORY' : 'IN-MEMORY'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Buffer Pool - takes 2 columns */}
            <button
              onClick={() => setActiveComponent(activeComponent === 'bufferPool' ? null : 'bufferPool')}
              className={`col-span-2 p-3 rounded-lg border-2 border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 transition-all text-left ${
                activeComponent === 'bufferPool' ? 'ring-2 ring-orange-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{components.bufferPool.icon}</span>
                <span className="text-[8px] font-mono text-muted-foreground">{components.bufferPool.size[locale]}</span>
              </div>
              <p className="text-[11px] font-bold mb-1">{components.bufferPool.name[locale]}</p>
              <div className="flex flex-wrap gap-1">
                {components.bufferPool.subItems.map((item) => (
                  <span key={item} className="text-[7px] font-mono bg-background/60 px-1.5 py-0.5 rounded">
                    {item}
                  </span>
                ))}
              </div>
            </button>

            {/* Log Buffer */}
            <button
              onClick={() => setActiveComponent(activeComponent === 'logBuffer' ? null : 'logBuffer')}
              className={`p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all text-left ${
                activeComponent === 'logBuffer' ? 'ring-2 ring-amber-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{components.logBuffer.icon}</span>
                <span className="text-[8px] font-mono text-muted-foreground">{components.logBuffer.size[locale]}</span>
              </div>
              <p className="text-[10px] font-bold">{components.logBuffer.name[locale]}</p>
            </button>

            {/* Empty space for visual balance */}
            <div className="p-3 rounded-lg border border-dashed border-muted-foreground/20"></div>
          </div>
        </div>

        {/* Arrow down with label */}
        <div className="flex flex-col items-center">
          <div className="text-2xl text-muted-foreground">↓</div>
          <span className="text-[8px] text-muted-foreground font-mono">
            {locale === 'ko' ? 'Flush / Checkpoint' : 'Flush / Checkpoint'}
          </span>
        </div>

        {/* Disk Layer */}
        <div className="border-2 border-emerald-500/30 rounded-xl p-4 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              💿 {locale === 'ko' ? 'ON-DISK (영구 저장소)' : 'ON-DISK (Persistent Storage)'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Data Files */}
            <button
              onClick={() => setActiveComponent(activeComponent === 'dataFiles' ? null : 'dataFiles')}
              className={`p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all text-left ${
                activeComponent === 'dataFiles' ? 'ring-2 ring-emerald-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{components.dataFiles.icon}</span>
              </div>
              <p className="text-[10px] font-bold">{components.dataFiles.name[locale]}</p>
            </button>

            {/* Redo Log */}
            <button
              onClick={() => setActiveComponent(activeComponent === 'redoLog' ? null : 'redoLog')}
              className={`p-3 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all text-left ${
                activeComponent === 'redoLog' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{components.redoLog.icon}</span>
                <span className="text-[8px] font-mono text-muted-foreground">{components.redoLog.size[locale]}</span>
              </div>
              <p className="text-[10px] font-bold">{components.redoLog.name[locale]}</p>
            </button>

            {/* Undo Log */}
            <button
              onClick={() => setActiveComponent(activeComponent === 'undoLog' ? null : 'undoLog')}
              className={`p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all text-left ${
                activeComponent === 'undoLog' ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{components.undoLog.icon}</span>
                <span className="text-[8px] font-mono text-muted-foreground">{components.undoLog.size[locale]}</span>
              </div>
              <p className="text-[10px] font-bold">{components.undoLog.name[locale]}</p>
            </button>
          </div>
        </div>

        {/* Background Threads */}
        <button
          onClick={() => setActiveComponent(activeComponent === 'threads' ? null : 'threads')}
          className={`w-full p-3 rounded-lg border border-slate-500/30 bg-slate-500/10 hover:bg-slate-500/20 transition-all text-left ${
            activeComponent === 'threads' ? 'ring-2 ring-slate-500' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{components.threads.icon}</span>
            <p className="text-[10px] font-bold">{components.threads.name[locale]}</p>
          </div>
        </button>
      </div>

      {/* Detail Panel */}
      {activeComponent && (
        <div className="mt-4 p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
          <p className="text-xs leading-relaxed">{components[activeComponent as keyof typeof components].desc[locale]}</p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">💡 TIP:</span>{' '}
          {locale === 'ko'
            ? 'Buffer Pool 히트율이 99% 미만이면 innodb_buffer_pool_size를 증가시키세요. SHOW STATUS LIKE \'Innodb_buffer_pool%\';로 확인합니다.'
            : 'If buffer pool hit rate < 99%, increase innodb_buffer_pool_size. Check with SHOW STATUS LIKE \'Innodb_buffer_pool%\';'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PostgreSQL Internals — Features
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function PostgreSQLDiagram({ locale }: DiagramProps) {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const components = {
    postmaster: {
      name: { ko: 'Postmaster', en: 'Postmaster' },
      icon: '👑',
      desc: {
        ko: 'PostgreSQL의 메인 데몬 프로세스. 클라이언트 연결을 수신하고 각 연결마다 새로운 Backend 프로세스를 생성합니다.',
        en: 'Main daemon process. Listens for client connections and spawns a new backend process for each connection.',
      },
    },
    backends: {
      name: { ko: 'Backend Processes', en: 'Backend Processes' },
      icon: '👥',
      desc: {
        ko: '각 클라이언트 연결마다 별도의 프로세스가 생성됩니다 (Multi-Process). 각 Backend는 독립적인 메모리 공간을 가집니다.',
        en: 'Each client connection gets its own process (Multi-Process). Each backend has independent memory space.',
      },
    },
    sharedBuffers: {
      name: { ko: 'Shared Buffers', en: 'Shared Buffers' },
      icon: '🧠',
      size: { ko: 'RAM 25%', en: 'RAM 25%' },
      desc: {
        ko: '테이블과 인덱스 페이지를 캐시하는 공유 메모리. 모든 Backend 프로세스가 공유합니다.',
        en: 'Shared memory cache for table and index pages. Shared by all backend processes.',
      },
    },
    walBuffers: {
      name: { ko: 'WAL Buffers', en: 'WAL Buffers' },
      icon: '📝',
      size: { ko: '16MB', en: '16MB' },
      desc: {
        ko: 'Write-Ahead Log 버퍼. 트랜잭션 로그를 디스크에 쓰기 전 메모리에서 버퍼링합니다.',
        en: 'Write-Ahead Log buffer. Buffers transaction logs before writing to disk.',
      },
    },
    bgWriter: {
      name: { ko: 'Background Writer', en: 'Background Writer' },
      icon: '✍️',
      desc: {
        ko: 'Dirty 페이지를 주기적으로 디스크에 기록. Checkpoint 시 부하를 분산시킵니다.',
        en: 'Periodically writes dirty pages to disk. Distributes I/O load from checkpoints.',
      },
    },
    walWriter: {
      name: { ko: 'WAL Writer', en: 'WAL Writer' },
      icon: '📋',
      desc: {
        ko: 'WAL 버퍼를 디스크에 기록. 트랜잭션 커밋 시 즉시 플러시됩니다.',
        en: 'Writes WAL buffers to disk. Flushes immediately on transaction commit.',
      },
    },
    checkpointer: {
      name: { ko: 'Checkpointer', en: 'Checkpointer' },
      icon: '⏱️',
      desc: {
        ko: '주기적으로 체크포인트를 수행. Shared Buffers의 Dirty 페이지를 디스크에 동기화합니다.',
        en: 'Performs periodic checkpoints. Syncs dirty pages in shared buffers to disk.',
      },
    },
    autovacuum: {
      name: { ko: 'Autovacuum', en: 'Autovacuum' },
      icon: '🧹',
      desc: {
        ko: 'MVCC로 생성된 Dead Tuple을 자동으로 정리. 통계 정보도 업데이트합니다.',
        en: 'Automatically cleans up dead tuples from MVCC. Also updates statistics.',
      },
    },
    dataFiles: {
      name: { ko: 'Data Files', en: 'Data Files' },
      icon: '💾',
      desc: {
        ko: '테이블과 인덱스 데이터. Heap 구조로 저장되며 MVCC를 위한 xmin/xmax를 포함합니다.',
        en: 'Table and index data. Stored as heap with xmin/xmax for MVCC.',
      },
    },
    walFiles: {
      name: { ko: 'WAL Files', en: 'WAL Files' },
      icon: '📁',
      desc: {
        ko: 'Write-Ahead Logging 파일. 트랜잭션 복구와 복제에 사용됩니다.',
        en: 'Write-Ahead Logging files. Used for crash recovery and replication.',
      },
    },
  };

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 text-white text-xs font-bold">
          PG
        </span>
        <div>
          <h3 className="text-sm font-bold">PostgreSQL {locale === 'ko' ? '프로세스 아키텍처' : 'Process Architecture'}</h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '컴포넌트를 클릭하여 상세 정보 확인' : 'Click components for details'}
          </p>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="relative space-y-4">
        {/* Client Layer */}
        <div className="flex justify-center">
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center">
            <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300">
              {locale === 'ko' ? '📱 클라이언트 연결' : '📱 Client Connections'}
            </p>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center">
          <div className="text-2xl text-muted-foreground">↓</div>
        </div>

        {/* Postmaster */}
        <button
          onClick={() => setActiveComponent(activeComponent === 'postmaster' ? null : 'postmaster')}
          className={`w-full p-3 rounded-lg border-2 border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 transition-all text-left ${
            activeComponent === 'postmaster' ? 'ring-2 ring-violet-500' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{components.postmaster.icon}</span>
            <p className="text-[11px] font-bold">{components.postmaster.name[locale]}</p>
          </div>
        </button>

        {/* Arrow down */}
        <div className="flex justify-center">
          <div className="text-2xl text-muted-foreground">↓</div>
        </div>

        {/* Backend Processes */}
        <button
          onClick={() => setActiveComponent(activeComponent === 'backends' ? null : 'backends')}
          className={`w-full p-3 rounded-lg border-2 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all text-left ${
            activeComponent === 'backends' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{components.backends.icon}</span>
            <p className="text-[11px] font-bold">{components.backends.name[locale]}</p>
            <span className="ml-auto text-[8px] text-muted-foreground font-mono">
              {locale === 'ko' ? '연결당 1개 프로세스' : '1 process per connection'}
            </span>
          </div>
        </button>

        {/* Arrow down */}
        <div className="flex justify-center">
          <div className="text-2xl text-muted-foreground">↕</div>
        </div>

        {/* Shared Memory */}
        <div className="border-2 border-orange-500/30 rounded-xl p-4 bg-orange-500/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-orange-700 dark:text-orange-300">
              💭 {locale === 'ko' ? 'SHARED MEMORY' : 'SHARED MEMORY'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Shared Buffers */}
            <button
              onClick={() => setActiveComponent(activeComponent === 'sharedBuffers' ? null : 'sharedBuffers')}
              className={`col-span-2 p-3 rounded-lg border-2 border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 transition-all text-left ${
                activeComponent === 'sharedBuffers' ? 'ring-2 ring-orange-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{components.sharedBuffers.icon}</span>
                <span className="text-[8px] font-mono text-muted-foreground">{components.sharedBuffers.size[locale]}</span>
              </div>
              <p className="text-[11px] font-bold">{components.sharedBuffers.name[locale]}</p>
            </button>

            {/* WAL Buffers */}
            <button
              onClick={() => setActiveComponent(activeComponent === 'walBuffers' ? null : 'walBuffers')}
              className={`p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all text-left ${
                activeComponent === 'walBuffers' ? 'ring-2 ring-amber-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{components.walBuffers.icon}</span>
                <span className="text-[8px] font-mono text-muted-foreground">{components.walBuffers.size[locale]}</span>
              </div>
              <p className="text-[10px] font-bold">{components.walBuffers.name[locale]}</p>
            </button>

            {/* Empty space for visual balance */}
            <div className="p-3 rounded-lg border border-dashed border-muted-foreground/20"></div>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex flex-col items-center">
          <div className="text-2xl text-muted-foreground">↓</div>
          <span className="text-[8px] text-muted-foreground font-mono">
            {locale === 'ko' ? 'Background Processes' : 'Background Processes'}
          </span>
        </div>

        {/* Background Workers */}
        <div className="border-2 border-slate-500/30 rounded-xl p-4 bg-slate-500/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              ⚙️ {locale === 'ko' ? 'BACKGROUND WORKERS' : 'BACKGROUND WORKERS'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Background Writer */}
            <button
              onClick={() => setActiveComponent(activeComponent === 'bgWriter' ? null : 'bgWriter')}
              className={`p-2.5 rounded-lg border border-slate-500/30 bg-slate-500/10 hover:bg-slate-500/20 transition-all text-left ${
                activeComponent === 'bgWriter' ? 'ring-2 ring-slate-500' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{components.bgWriter.icon}</span>
                <p className="text-[9px] font-bold">{components.bgWriter.name[locale]}</p>
              </div>
            </button>

            {/* WAL Writer */}
            <button
              onClick={() => setActiveComponent(activeComponent === 'walWriter' ? null : 'walWriter')}
              className={`p-2.5 rounded-lg border border-slate-500/30 bg-slate-500/10 hover:bg-slate-500/20 transition-all text-left ${
                activeComponent === 'walWriter' ? 'ring-2 ring-slate-500' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{components.walWriter.icon}</span>
                <p className="text-[9px] font-bold">{components.walWriter.name[locale]}</p>
              </div>
            </button>

            {/* Checkpointer */}
            <button
              onClick={() => setActiveComponent(activeComponent === 'checkpointer' ? null : 'checkpointer')}
              className={`p-2.5 rounded-lg border border-slate-500/30 bg-slate-500/10 hover:bg-slate-500/20 transition-all text-left ${
                activeComponent === 'checkpointer' ? 'ring-2 ring-slate-500' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{components.checkpointer.icon}</span>
                <p className="text-[9px] font-bold">{components.checkpointer.name[locale]}</p>
              </div>
            </button>

            {/* Autovacuum */}
            <button
              onClick={() => setActiveComponent(activeComponent === 'autovacuum' ? null : 'autovacuum')}
              className={`p-2.5 rounded-lg border border-slate-500/30 bg-slate-500/10 hover:bg-slate-500/20 transition-all text-left ${
                activeComponent === 'autovacuum' ? 'ring-2 ring-slate-500' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{components.autovacuum.icon}</span>
                <p className="text-[9px] font-bold">{components.autovacuum.name[locale]}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex flex-col items-center">
          <div className="text-2xl text-muted-foreground">↓</div>
          <span className="text-[8px] text-muted-foreground font-mono">
            {locale === 'ko' ? 'Write to Disk' : 'Write to Disk'}
          </span>
        </div>

        {/* Disk Storage */}
        <div className="border-2 border-emerald-500/30 rounded-xl p-4 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              💿 {locale === 'ko' ? 'DISK STORAGE' : 'DISK STORAGE'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Data Files */}
            <button
              onClick={() => setActiveComponent(activeComponent === 'dataFiles' ? null : 'dataFiles')}
              className={`p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all text-left ${
                activeComponent === 'dataFiles' ? 'ring-2 ring-emerald-500' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{components.dataFiles.icon}</span>
                <p className="text-[10px] font-bold">{components.dataFiles.name[locale]}</p>
              </div>
            </button>

            {/* WAL Files */}
            <button
              onClick={() => setActiveComponent(activeComponent === 'walFiles' ? null : 'walFiles')}
              className={`p-3 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all text-left ${
                activeComponent === 'walFiles' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{components.walFiles.icon}</span>
                <p className="text-[10px] font-bold">{components.walFiles.name[locale]}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {activeComponent && (
        <div className="mt-4 p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
          <p className="text-xs leading-relaxed">{components[activeComponent as keyof typeof components].desc[locale]}</p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">💡 TIP:</span>{' '}
          {locale === 'ko'
            ? 'shared_buffers는 RAM의 25%로 설정하고, effective_cache_size는 전체 RAM의 50-75%로 설정하세요. EXPLAIN (ANALYZE, BUFFERS)로 버퍼 사용량을 모니터링합니다.'
            : 'Set shared_buffers to 25% of RAM and effective_cache_size to 50-75% of total RAM. Monitor buffer usage with EXPLAIN (ANALYZE, BUFFERS).'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Transaction Isolation Levels
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function TransactionIsolationDiagram({ locale }: DiagramProps) {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  const levels = [
    {
      name: { ko: 'READ UNCOMMITTED', en: 'READ UNCOMMITTED' },
      level: 0,
      icon: '🔓',
      color: { bg: 'bg-red-500/10', border: 'border-red-500/30', ring: 'ring-red-500' },
      problems: { ko: ['Dirty Read ✓', 'Non-repeatable Read ✓', 'Phantom Read ✓'], en: ['Dirty Read ✓', 'Non-repeatable Read ✓', 'Phantom Read ✓'] },
      desc: {
        ko: '가장 낮은 격리 수준. 커밋되지 않은 데이터도 읽을 수 있어 모든 문제가 발생할 수 있습니다. 실무에서는 거의 사용하지 않습니다.',
        en: 'Lowest isolation level. Can read uncommitted data, allowing all concurrency problems. Rarely used in practice.',
      },
    },
    {
      name: { ko: 'READ COMMITTED', en: 'READ COMMITTED' },
      level: 1,
      icon: '🔐',
      color: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', ring: 'ring-orange-500' },
      problems: { ko: ['Dirty Read ✗', 'Non-repeatable Read ✓', 'Phantom Read ✓'], en: ['Dirty Read ✗', 'Non-repeatable Read ✓', 'Phantom Read ✓'] },
      desc: {
        ko: '커밋된 데이터만 읽습니다. Dirty Read는 방지하지만, 같은 쿼리를 반복해도 다른 결과가 나올 수 있습니다. PostgreSQL, Oracle의 기본값입니다.',
        en: 'Reads only committed data. Prevents Dirty Read but allows Non-repeatable Read. Default in PostgreSQL and Oracle.',
      },
    },
    {
      name: { ko: 'REPEATABLE READ', en: 'REPEATABLE READ' },
      level: 2,
      icon: '🔒',
      color: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', ring: 'ring-blue-500' },
      problems: { ko: ['Dirty Read ✗', 'Non-repeatable Read ✗', 'Phantom Read △'], en: ['Dirty Read ✗', 'Non-repeatable Read ✗', 'Phantom Read △'] },
      desc: {
        ko: '트랜잭션 내에서 같은 쿼리는 항상 같은 결과를 반환합니다. MySQL InnoDB의 기본값이며, Next-Key Lock으로 Phantom Read도 대부분 방지합니다.',
        en: 'Same query returns same results within transaction. Default in MySQL InnoDB. Mostly prevents Phantom Read with Next-Key Locks.',
      },
    },
    {
      name: { ko: 'SERIALIZABLE', en: 'SERIALIZABLE' },
      level: 3,
      icon: '🔐',
      color: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', ring: 'ring-emerald-500' },
      problems: { ko: ['Dirty Read ✗', 'Non-repeatable Read ✗', 'Phantom Read ✗'], en: ['Dirty Read ✗', 'Non-repeatable Read ✗', 'Phantom Read ✗'] },
      desc: {
        ko: '가장 높은 격리 수준. 트랜잭션이 순차적으로 실행되는 것처럼 동작하여 모든 문제를 방지합니다. 성능이 가장 낮아 특수한 경우에만 사용합니다.',
        en: 'Highest isolation level. Transactions execute as if serialized, preventing all problems. Lowest performance, used only in special cases.',
      },
    },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white text-[9px] font-bold">
          ISO
        </span>
        <div>
          <h3 className="text-sm font-bold">{locale === 'ko' ? '트랜잭션 격리 수준' : 'Transaction Isolation Levels'}</h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '각 레벨을 클릭하여 상세 정보 확인' : 'Click each level for details'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {levels.map((level, i) => (
          <button
            key={i}
            onClick={() => setActiveLevel(activeLevel === i ? null : i)}
            className={`w-full rounded-lg border text-left transition-all ${level.color.border} ${level.color.bg} ${
              activeLevel === i ? `ring-2 ${level.color.ring} shadow-md` : 'hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 p-3">
              <span className="text-xl">{level.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] font-bold text-foreground">{level.name[locale]}</p>
                  <span className="text-[8px] text-muted-foreground font-mono">Level {level.level}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {level.problems[locale].map((problem, idx) => (
                    <span
                      key={idx}
                      className={`text-[7px] font-mono px-1.5 py-0.5 rounded ${
                        problem.includes('✓')
                          ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                          : problem.includes('△')
                            ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300'
                            : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {problem}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {activeLevel !== null && (
        <div className={`mt-3 rounded-lg border ${levels[activeLevel].color.border} ${levels[activeLevel].color.bg} p-4 transition-all`}>
          <p className="text-xs leading-relaxed">{levels[activeLevel].desc[locale]}</p>
        </div>
      )}

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">💡 TIP:</span>{' '}
          {locale === 'ko'
            ? '대부분의 애플리케이션은 READ COMMITTED 또는 REPEATABLE READ로 충분합니다. 성능과 일관성 사이의 균형을 고려하여 선택하세요.'
            : 'Most applications work well with READ COMMITTED or REPEATABLE READ. Choose based on the balance between performance and consistency.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Normalization Steps
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function NormalizationDiagram({ locale }: DiagramProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      name: { ko: '비정규형 (Unnormalized)', en: 'Unnormalized Form' },
      icon: '❌',
      color: { bg: 'bg-red-500/10', border: 'border-red-500/30', ring: 'ring-red-500' },
      problem: { ko: '반복 그룹, 중복 데이터', en: 'Repeating groups, duplicate data' },
      example: {
        ko: '주문(주문ID, 고객명, 상품1, 수량1, 상품2, 수량2, ...)',
        en: 'Order(OrderID, Customer, Product1, Qty1, Product2, Qty2, ...)',
      },
    },
    {
      name: { ko: '제1정규형 (1NF)', en: '1st Normal Form (1NF)' },
      icon: '1️⃣',
      color: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', ring: 'ring-orange-500' },
      rule: { ko: '원자값만 허용', en: 'Atomic values only' },
      example: {
        ko: '주문(주문ID, 고객명, 상품명, 수량) - 각 행이 하나의 상품',
        en: 'Order(OrderID, Customer, Product, Qty) - one product per row',
      },
    },
    {
      name: { ko: '제2정규형 (2NF)', en: '2nd Normal Form (2NF)' },
      icon: '2️⃣',
      color: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', ring: 'ring-yellow-500' },
      rule: { ko: '부분 함수 종속 제거', en: 'Eliminate partial dependencies' },
      example: {
        ko: '주문(주문ID, 고객ID) + 주문상세(주문ID, 상품ID, 수량) + 고객(고객ID, 고객명)',
        en: 'Order(OrderID, CustomerID) + OrderItem(OrderID, ProductID, Qty) + Customer(CustomerID, Name)',
      },
    },
    {
      name: { ko: '제3정규형 (3NF)', en: '3rd Normal Form (3NF)' },
      icon: '3️⃣',
      color: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', ring: 'ring-emerald-500' },
      rule: { ko: '이행 함수 종속 제거', en: 'Eliminate transitive dependencies' },
      example: {
        ko: '직원(직원ID, 부서ID) + 부서(부서ID, 부서명, 위치) - 부서명과 위치는 부서ID로만 결정',
        en: 'Employee(EmpID, DeptID) + Department(DeptID, Name, Location) - Name/Location determined by DeptID only',
      },
    },
    {
      name: { ko: 'BCNF', en: 'BCNF' },
      icon: '🔐',
      color: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', ring: 'ring-blue-500' },
      rule: { ko: '모든 결정자가 후보키', en: 'All determinants are candidate keys' },
      example: {
        ko: '강의(교수ID, 과목코드, 시간) → 교수(교수ID, ...) + 과목(과목코드, ...)',
        en: 'Class(ProfID, CourseCode, Time) → Professor(ProfID, ...) + Course(CourseCode, ...)',
      },
    },
  ];

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 text-white text-[9px] font-bold">
          NF
        </span>
        <div>
          <h3 className="text-sm font-bold">{locale === 'ko' ? '정규화 단계' : 'Normalization Steps'}</h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '각 단계를 클릭하여 상세 정보 확인' : 'Click each step for details'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(activeStep === i ? null : i)}
            className={`w-full rounded-lg border text-left transition-all ${step.color.border} ${step.color.bg} ${
              activeStep === i ? `ring-2 ${step.color.ring} shadow-md` : 'hover:shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 p-3">
              <span className="text-xl">{step.icon}</span>
              <div className="flex-1">
                <p className="text-[11px] font-bold text-foreground mb-1">{step.name[locale]}</p>
                {step.rule && (
                  <p className="text-[9px] text-muted-foreground font-mono">
                    {locale === 'ko' ? '규칙' : 'Rule'}: {step.rule[locale]}
                  </p>
                )}
                {step.problem && (
                  <p className="text-[9px] text-red-600 dark:text-red-400 font-mono">
                    {locale === 'ko' ? '문제' : 'Problem'}: {step.problem[locale]}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {activeStep !== null && (
        <div className={`mt-3 rounded-lg border ${steps[activeStep].color.border} ${steps[activeStep].color.bg} p-4 transition-all`}>
          <p className="text-[10px] font-bold mb-2">{locale === 'ko' ? '예시' : 'Example'}:</p>
          <p className="text-xs font-mono leading-relaxed">{steps[activeStep].example[locale]}</p>
        </div>
      )}

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">💡 TIP:</span>{' '}
          {locale === 'ko'
            ? '실무에서는 대부분 3NF까지만 정규화합니다. 과도한 정규화는 JOIN이 많아져 성능 저하를 일으킬 수 있습니다.'
            : 'In practice, most databases are normalized up to 3NF. Over-normalization can lead to performance issues due to excessive JOINs.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// B-tree Index Structure
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function IndexStructureDiagram({ locale }: DiagramProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = {
    root: {
      name: { ko: '루트 노드', en: 'Root Node' },
      value: '50',
      desc: { ko: '트리의 최상위 노드. 모든 검색은 루트에서 시작됩니다.', en: 'Top node of the tree. All searches start from the root.' },
    },
    left: {
      name: { ko: '내부 노드 (왼쪽)', en: 'Internal Node (Left)' },
      value: '20, 30',
      desc: { ko: '중간 레벨 노드. 하위 노드들의 범위를 나타냅니다.', en: 'Mid-level node. Represents ranges of child nodes.' },
    },
    right: {
      name: { ko: '내부 노드 (오른쪽)', en: 'Internal Node (Right)' },
      value: '70, 80',
      desc: { ko: '중간 레벨 노드. 데이터를 찾기 위한 경로를 제공합니다.', en: 'Mid-level node. Provides path to find data.' },
    },
    leaf: {
      name: { ko: '리프 노드', en: 'Leaf Nodes' },
      value: '10, 15 | 25, 27 | 60, 65 | 75, 77 | 85, 90',
      desc: { ko: '실제 데이터가 저장된 노드. 정렬된 순서로 연결되어 범위 검색에 효율적입니다.', en: 'Nodes containing actual data. Linked in sorted order for efficient range queries.' },
    },
  };

  return (
    <div className="not-prose my-8 p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
      <div className="flex items-center gap-2 mb-5">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white text-[9px] font-bold">
          B+
        </span>
        <div>
          <h3 className="text-sm font-bold">{locale === 'ko' ? 'B-tree 인덱스 구조' : 'B-tree Index Structure'}</h3>
          <p className="text-[10px] text-muted-foreground">
            {locale === 'ko' ? '각 노드를 클릭하여 상세 정보 확인' : 'Click each node for details'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Root Node */}
        <div className="flex justify-center">
          <button
            onClick={() => setActiveNode(activeNode === 'root' ? null : 'root')}
            className={`px-4 py-2 rounded-lg border-2 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all ${
              activeNode === 'root' ? 'ring-2 ring-purple-500 shadow-md' : ''
            }`}
          >
            <p className="text-[10px] font-mono font-bold">{nodes.root.value}</p>
          </button>
        </div>

        {/* Arrows */}
        <div className="flex justify-center gap-8 text-muted-foreground">
          <span className="text-xs">↙</span>
          <span className="text-xs">↘</span>
        </div>

        {/* Internal Nodes */}
        <div className="flex justify-center gap-8">
          <button
            onClick={() => setActiveNode(activeNode === 'left' ? null : 'left')}
            className={`px-3 py-2 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all ${
              activeNode === 'left' ? 'ring-2 ring-blue-500 shadow-md' : ''
            }`}
          >
            <p className="text-[9px] font-mono font-bold">{nodes.left.value}</p>
          </button>
          <button
            onClick={() => setActiveNode(activeNode === 'right' ? null : 'right')}
            className={`px-3 py-2 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition-all ${
              activeNode === 'right' ? 'ring-2 ring-blue-500 shadow-md' : ''
            }`}
          >
            <p className="text-[9px] font-mono font-bold">{nodes.right.value}</p>
          </button>
        </div>

        {/* Arrows */}
        <div className="flex justify-center gap-4 text-muted-foreground text-xs">
          <span>↓</span>
          <span>↓</span>
          <span className="ml-8">↓</span>
          <span>↓</span>
          <span>↓</span>
        </div>

        {/* Leaf Nodes */}
        <button
          onClick={() => setActiveNode(activeNode === 'leaf' ? null : 'leaf')}
          className={`w-full px-3 py-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all ${
            activeNode === 'leaf' ? 'ring-2 ring-emerald-500 shadow-md' : ''
          }`}
        >
          <div className="flex justify-center gap-2 text-[8px] font-mono font-bold">
            <span className="px-2 py-1 bg-background/60 rounded">10, 15</span>
            <span className="px-2 py-1 bg-background/60 rounded">25, 27</span>
            <span className="px-2 py-1 bg-background/60 rounded">60, 65</span>
            <span className="px-2 py-1 bg-background/60 rounded">75, 77</span>
            <span className="px-2 py-1 bg-background/60 rounded">85, 90</span>
          </div>
          <p className="text-[8px] text-center mt-1 text-muted-foreground">← {locale === 'ko' ? '연결됨' : 'Linked'} →</p>
        </button>
      </div>

      {activeNode && (
        <div className="mt-4 p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
          <p className="text-[10px] font-bold mb-1">{nodes[activeNode as keyof typeof nodes].name[locale]}</p>
          <p className="text-xs leading-relaxed">{nodes[activeNode as keyof typeof nodes].desc[locale]}</p>
        </div>
      )}

      <div className="mt-5 p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
          <span className="font-bold">💡 TIP:</span>{' '}
          {locale === 'ko'
            ? 'B-tree는 균형 트리로, 모든 리프 노드의 깊이가 같습니다. 이로 인해 검색 시간이 O(log n)으로 일정하게 유지됩니다.'
            : 'B-tree is a balanced tree where all leaf nodes have the same depth, ensuring consistent O(log n) search time.'}
        </p>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Section → Diagram Mapping
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const sectionDiagrams: Record<string, React.ComponentType<DiagramProps>> = {
  'what-is-sql': EcommerceERD,
  'schema-keys': SchemaKeysDiagrams,
  'erd-modeling': ERDModelingDiagram,
  'select-basics': SqlExecutionOrder,
  'data-modeling': DataModelingDiagram,
  'joins': JoinTypesDiagram,
  'partition-tables': PartitionDiagram,
  'functions-procedures': FunctionProcedureDiagram,
  'lob-data-types': StorageTiersDiagram,
  'data-mart': DataMartDiagram,
  'data-warehouse': DataWarehouseDiagram,
  'data-migration': DataMigrationDiagram,
  'db-engine-storage': DbEngineDiagram,
  'backup-recovery': BackupRecoveryDiagram,
  'replication-ha': ReplicationHADiagram,
  'innodb-deep-dive': InnoDBDiagram,
  'postgresql-internals': PostgreSQLDiagram,
  'transactions-constraints': TransactionIsolationDiagram,
  'normalization-theory': NormalizationDiagram,
  'indexes-performance': IndexStructureDiagram,
};
