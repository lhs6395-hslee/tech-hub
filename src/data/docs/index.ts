export interface DocSection {
  id: string;
  title: { ko: string; en: string };
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'database';
  content: { ko: string; en: string };
}

export interface DocChapter {
  id: string;
  title: { ko: string; en: string };
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'database';
  icon: string;
  sections: DocSection[];
}

export const docChapters: DocChapter[] = [
  // ─── BEGINNER ───
  {
    id: 'beginner',
    title: { ko: '초보: SQL 기초', en: 'Beginner: SQL Fundamentals' },
    level: 'beginner',
    icon: '🌱',
    sections: [
      {
        id: 'what-is-sql',
        title: { ko: 'SQL이란?', en: 'What is SQL?' },
        level: 'beginner',
        content: {
          ko: `## SQL이란?

**SQL**(Structured Query Language)은 관계형 데이터베이스에서 데이터를 관리하고 조작하기 위한 표준 언어입니다.

### SQL의 분류

| 분류 | 명령어 | 설명 |
|------|--------|------|
| **DQL** (Data Query Language) | SELECT | 데이터 조회 |
| **DML** (Data Manipulation Language) | INSERT, UPDATE, DELETE | 데이터 조작 |
| **DDL** (Data Definition Language) | CREATE, ALTER, DROP, TRUNCATE | 테이블 구조 정의 |
| **DCL** (Data Control Language) | GRANT, REVOKE | 권한 관리 |
| **TCL** (Transaction Control Language) | BEGIN, COMMIT, ROLLBACK | 트랜잭션 제어 |

### 관계형 데이터베이스 핵심 개념

- **테이블(Table)**: 행(Row)과 열(Column)로 구성된 데이터 저장 단위
- **행(Row/Record)**: 하나의 데이터 항목 (예: 한 명의 고객 정보)
- **열(Column/Field)**: 데이터의 속성 (예: 이름, 이메일, 도시)
- **기본 키(Primary Key)**: 각 행을 고유하게 식별하는 열
- **외래 키(Foreign Key)**: 다른 테이블의 기본 키를 참조하는 열

### 이 플랫폼의 스키마

\`\`\`
customers (고객)
├── id, name, email, city, country, signup_date, is_premium

categories (카테고리)
├── id, name, parent_id

products (상품)
├── id, name, category_id, price, stock_quantity, created_at

orders (주문)
├── id, customer_id, order_date, status, total_amount

order_items (주문 상세)
├── id, order_id, product_id, quantity, unit_price

reviews (리뷰)
├── id, product_id, customer_id, rating, comment, created_at
\`\`\``,
          en: `## What is SQL?

**SQL** (Structured Query Language) is the standard language for managing and manipulating data in relational databases.

### SQL Categories

| Category | Commands | Description |
|----------|----------|-------------|
| **DQL** (Data Query Language) | SELECT | Query data |
| **DML** (Data Manipulation Language) | INSERT, UPDATE, DELETE | Manipulate data |
| **DDL** (Data Definition Language) | CREATE, ALTER, DROP, TRUNCATE | Define table structure |
| **DCL** (Data Control Language) | GRANT, REVOKE | Manage permissions |
| **TCL** (Transaction Control Language) | BEGIN, COMMIT, ROLLBACK | Control transactions |

### Core Relational Database Concepts

- **Table**: A storage unit composed of rows and columns
- **Row/Record**: A single data entry (e.g., one customer's information)
- **Column/Field**: A data attribute (e.g., name, email, city)
- **Primary Key**: A column that uniquely identifies each row
- **Foreign Key**: A column that references the primary key of another table

### Platform Schema

\`\`\`
customers
├── id, name, email, city, country, signup_date, is_premium

categories
├── id, name, parent_id

products
├── id, name, category_id, price, stock_quantity, created_at

orders
├── id, customer_id, order_date, status, total_amount

order_items
├── id, order_id, product_id, quantity, unit_price

reviews
├── id, product_id, customer_id, rating, comment, created_at
\`\`\``,
        },
      },
      {
        id: 'select-basics',
        title: { ko: 'SELECT: 데이터 조회', en: 'SELECT: Querying Data' },
        level: 'beginner',
        content: {
          ko: `## SELECT 문

데이터베이스에서 데이터를 조회하는 가장 기본적인 명령어입니다.

### 전체 조회

\`\`\`sql
SELECT * FROM customers;
\`\`\`

\`*\`는 모든 열을 의미합니다. 실무에서는 필요한 열만 지정하는 것이 좋습니다.

### 특정 열 조회

\`\`\`sql
SELECT name, email, city FROM customers;
\`\`\`

### 별칭 (Alias)

열이나 테이블에 임시 이름을 부여합니다.

\`\`\`sql
SELECT name AS 고객명, email AS 이메일
FROM customers;
\`\`\`

\`AS\`는 생략 가능합니다: \`SELECT name 고객명 FROM customers;\`

### DISTINCT (중복 제거)

\`\`\`sql
SELECT DISTINCT city FROM customers;
SELECT DISTINCT country, city FROM customers;
\`\`\`

### 실행 순서

SQL 문의 실제 실행 순서는 작성 순서와 다릅니다:

| 순서 | 절 | 설명 |
|------|------|------|
| 1 | FROM | 테이블 선택 |
| 2 | WHERE | 행 필터링 |
| 3 | GROUP BY | 그룹화 |
| 4 | HAVING | 그룹 필터링 |
| 5 | SELECT | 열 선택 |
| 6 | ORDER BY | 정렬 |
| 7 | LIMIT | 행 수 제한 |`,
          en: `## SELECT Statement

The most fundamental command for querying data from a database.

### Select All

\`\`\`sql
SELECT * FROM customers;
\`\`\`

\`*\` means all columns. In practice, it's better to specify only the columns you need.

### Select Specific Columns

\`\`\`sql
SELECT name, email, city FROM customers;
\`\`\`

### Aliases

Assign temporary names to columns or tables.

\`\`\`sql
SELECT name AS customer_name, email AS customer_email
FROM customers;
\`\`\`

\`AS\` is optional: \`SELECT name customer_name FROM customers;\`

### DISTINCT (Remove Duplicates)

\`\`\`sql
SELECT DISTINCT city FROM customers;
SELECT DISTINCT country, city FROM customers;
\`\`\`

### Execution Order

The actual execution order of SQL differs from the written order:

| Order | Clause | Description |
|-------|--------|-------------|
| 1 | FROM | Select table |
| 2 | WHERE | Filter rows |
| 3 | GROUP BY | Group rows |
| 4 | HAVING | Filter groups |
| 5 | SELECT | Select columns |
| 6 | ORDER BY | Sort results |
| 7 | LIMIT | Limit row count |`,
        },
      },
      {
        id: 'where-filtering',
        title: { ko: 'WHERE: 조건 필터링', en: 'WHERE: Conditional Filtering' },
        level: 'beginner',
        content: {
          ko: `## WHERE 절

특정 조건을 만족하는 행만 필터링합니다.

### 비교 연산자

\`\`\`sql
SELECT * FROM products WHERE price > 100000;
SELECT * FROM products WHERE price <= 50000;
SELECT * FROM customers WHERE country = 'Korea';
SELECT * FROM customers WHERE country != 'USA';
\`\`\`

| 연산자 | 의미 |
|--------|------|
| = | 같다 |
| != 또는 <> | 같지 않다 |
| > | 크다 |
| < | 작다 |
| >= | 크거나 같다 |
| <= | 작거나 같다 |

### AND / OR

\`\`\`sql
-- 한국에 사는 프리미엄 고객
SELECT * FROM customers
WHERE country = 'Korea' AND is_premium = true;

-- 서울이거나 부산에 사는 고객
SELECT * FROM customers
WHERE city = 'Seoul' OR city = 'Busan';

-- 괄호로 우선순위 지정
SELECT * FROM products
WHERE (category_id = 1 OR category_id = 2)
  AND price > 50000;
\`\`\`

### BETWEEN

범위 조건 (양쪽 값 포함):

\`\`\`sql
SELECT * FROM products
WHERE price BETWEEN 10000 AND 50000;
-- price >= 10000 AND price <= 50000 과 동일
\`\`\`

### IN

여러 값 중 하나와 일치:

\`\`\`sql
SELECT * FROM customers
WHERE city IN ('Seoul', 'Busan', 'Incheon');
-- city = 'Seoul' OR city = 'Busan' OR city = 'Incheon' 과 동일
\`\`\`

### LIKE (패턴 매칭)

\`\`\`sql
-- 'S'로 시작하는 이름
SELECT * FROM customers WHERE name LIKE 'S%';

-- 'son'으로 끝나는 이름
SELECT * FROM customers WHERE name LIKE '%son';

-- 'an'이 포함된 이름
SELECT * FROM customers WHERE name LIKE '%an%';

-- 정확히 5글자인 이름 (\_는 한 글자)
SELECT * FROM customers WHERE name LIKE '_____';
\`\`\`

| 와일드카드 | 의미 |
|-----------|------|
| % | 0개 이상의 문자 |
| _ | 정확히 1개의 문자 |

### IS NULL / IS NOT NULL

\`\`\`sql
SELECT * FROM categories WHERE parent_id IS NULL;
SELECT * FROM customers WHERE city IS NOT NULL;
\`\`\`

> **주의**: \`= NULL\`은 동작하지 않습니다. 반드시 \`IS NULL\`을 사용하세요.`,
          en: `## WHERE Clause

Filters rows that satisfy specific conditions.

### Comparison Operators

\`\`\`sql
SELECT * FROM products WHERE price > 100000;
SELECT * FROM products WHERE price <= 50000;
SELECT * FROM customers WHERE country = 'Korea';
SELECT * FROM customers WHERE country != 'USA';
\`\`\`

| Operator | Meaning |
|----------|---------|
| = | Equal to |
| != or <> | Not equal to |
| > | Greater than |
| < | Less than |
| >= | Greater than or equal to |
| <= | Less than or equal to |

### AND / OR

\`\`\`sql
-- Premium customers in Korea
SELECT * FROM customers
WHERE country = 'Korea' AND is_premium = true;

-- Customers in Seoul or Busan
SELECT * FROM customers
WHERE city = 'Seoul' OR city = 'Busan';

-- Use parentheses for precedence
SELECT * FROM products
WHERE (category_id = 1 OR category_id = 2)
  AND price > 50000;
\`\`\`

### BETWEEN

Range condition (inclusive):

\`\`\`sql
SELECT * FROM products
WHERE price BETWEEN 10000 AND 50000;
-- Same as: price >= 10000 AND price <= 50000
\`\`\`

### IN

Match one of several values:

\`\`\`sql
SELECT * FROM customers
WHERE city IN ('Seoul', 'Busan', 'Incheon');
-- Same as: city = 'Seoul' OR city = 'Busan' OR city = 'Incheon'
\`\`\`

### LIKE (Pattern Matching)

\`\`\`sql
-- Names starting with 'S'
SELECT * FROM customers WHERE name LIKE 'S%';

-- Names ending with 'son'
SELECT * FROM customers WHERE name LIKE '%son';

-- Names containing 'an'
SELECT * FROM customers WHERE name LIKE '%an%';

-- Names exactly 5 characters long (_ = one character)
SELECT * FROM customers WHERE name LIKE '_____';
\`\`\`

| Wildcard | Meaning |
|----------|---------|
| % | Zero or more characters |
| _ | Exactly one character |

### IS NULL / IS NOT NULL

\`\`\`sql
SELECT * FROM categories WHERE parent_id IS NULL;
SELECT * FROM customers WHERE city IS NOT NULL;
\`\`\`

> **Note**: \`= NULL\` does not work. Always use \`IS NULL\`.`,
        },
      },
      {
        id: 'sorting-limiting',
        title: { ko: 'ORDER BY / LIMIT: 정렬과 제한', en: 'ORDER BY / LIMIT: Sorting & Limiting' },
        level: 'beginner',
        content: {
          ko: `## ORDER BY (정렬)

\`\`\`sql
-- 가격 오름차순
SELECT * FROM products ORDER BY price ASC;

-- 가격 내림차순
SELECT * FROM products ORDER BY price DESC;

-- 여러 기준: 카테고리 → 가격 순
SELECT * FROM products
ORDER BY category_id ASC, price DESC;
\`\`\`

- \`ASC\`: 오름차순 (기본값, 생략 가능)
- \`DESC\`: 내림차순

### NULL 정렬

PostgreSQL에서 NULL은 기본적으로 가장 큰 값으로 취급됩니다:
\`\`\`sql
ORDER BY column NULLS FIRST;  -- NULL을 앞에
ORDER BY column NULLS LAST;   -- NULL을 뒤에
\`\`\`

## LIMIT (행 수 제한)

\`\`\`sql
-- 상위 10개
SELECT * FROM products
ORDER BY price DESC
LIMIT 10;

-- 11번째부터 10개 (OFFSET)
SELECT * FROM products
ORDER BY price DESC
LIMIT 10 OFFSET 10;
\`\`\`

### 실무 활용

\`\`\`sql
-- 가장 비싼 상품 5개
SELECT name, price FROM products
ORDER BY price DESC LIMIT 5;

-- 최근 주문 10개
SELECT * FROM orders
ORDER BY order_date DESC LIMIT 10;
\`\`\``,
          en: `## ORDER BY (Sorting)

\`\`\`sql
-- Price ascending
SELECT * FROM products ORDER BY price ASC;

-- Price descending
SELECT * FROM products ORDER BY price DESC;

-- Multiple criteria: category, then price
SELECT * FROM products
ORDER BY category_id ASC, price DESC;
\`\`\`

- \`ASC\`: Ascending (default, can be omitted)
- \`DESC\`: Descending

### NULL Sorting

In PostgreSQL, NULL is treated as the largest value by default:
\`\`\`sql
ORDER BY column NULLS FIRST;
ORDER BY column NULLS LAST;
\`\`\`

## LIMIT (Row Count Limit)

\`\`\`sql
-- Top 10
SELECT * FROM products
ORDER BY price DESC
LIMIT 10;

-- Skip first 10, then get 10 (OFFSET)
SELECT * FROM products
ORDER BY price DESC
LIMIT 10 OFFSET 10;
\`\`\`

### Practical Examples

\`\`\`sql
-- 5 most expensive products
SELECT name, price FROM products
ORDER BY price DESC LIMIT 5;

-- 10 most recent orders
SELECT * FROM orders
ORDER BY order_date DESC LIMIT 10;
\`\`\``,
        },
      },
      {
        id: 'aggregate-functions',
        title: { ko: '집계 함수: COUNT, SUM, AVG, MIN, MAX', en: 'Aggregate Functions' },
        level: 'beginner',
        content: {
          ko: `## 집계 함수

여러 행의 데이터를 하나의 값으로 계산합니다.

| 함수 | 설명 | 예시 |
|------|------|------|
| COUNT(*) | 행 수 | 전체 고객 수 |
| COUNT(column) | NULL이 아닌 값의 수 | 이메일이 있는 고객 수 |
| SUM(column) | 합계 | 총 매출 |
| AVG(column) | 평균 | 평균 가격 |
| MIN(column) | 최솟값 | 최저 가격 |
| MAX(column) | 최댓값 | 최고 가격 |

### 기본 사용

\`\`\`sql
SELECT COUNT(*) FROM customers;
SELECT AVG(price) FROM products;
SELECT MIN(price), MAX(price) FROM products;
SELECT SUM(total_amount) FROM orders;
\`\`\`

### GROUP BY (그룹별 집계)

\`\`\`sql
-- 나라별 고객 수
SELECT country, COUNT(*) AS customer_count
FROM customers
GROUP BY country;

-- 카테고리별 평균 가격
SELECT category_id, AVG(price) AS avg_price
FROM products
GROUP BY category_id;

-- 주문 상태별 건수와 합계
SELECT status, COUNT(*) AS order_count, SUM(total_amount) AS total
FROM orders
GROUP BY status;
\`\`\`

> **규칙**: SELECT에 집계 함수가 아닌 열이 있으면, 반드시 GROUP BY에 포함해야 합니다.

### ROUND (반올림)

\`\`\`sql
SELECT category_id, ROUND(AVG(price), 0) AS avg_price
FROM products
GROUP BY category_id;
\`\`\``,
          en: `## Aggregate Functions

Calculate a single value from multiple rows of data.

| Function | Description | Example |
|----------|-------------|---------|
| COUNT(*) | Row count | Total customers |
| COUNT(column) | Non-NULL count | Customers with email |
| SUM(column) | Sum | Total revenue |
| AVG(column) | Average | Average price |
| MIN(column) | Minimum | Lowest price |
| MAX(column) | Maximum | Highest price |

### Basic Usage

\`\`\`sql
SELECT COUNT(*) FROM customers;
SELECT AVG(price) FROM products;
SELECT MIN(price), MAX(price) FROM products;
SELECT SUM(total_amount) FROM orders;
\`\`\`

### GROUP BY (Group Aggregation)

\`\`\`sql
-- Customer count by country
SELECT country, COUNT(*) AS customer_count
FROM customers
GROUP BY country;

-- Average price by category
SELECT category_id, AVG(price) AS avg_price
FROM products
GROUP BY category_id;

-- Order count and total by status
SELECT status, COUNT(*) AS order_count, SUM(total_amount) AS total
FROM orders
GROUP BY status;
\`\`\`

> **Rule**: Any non-aggregate column in SELECT must be in the GROUP BY clause.

### ROUND

\`\`\`sql
SELECT category_id, ROUND(AVG(price), 0) AS avg_price
FROM products
GROUP BY category_id;
\`\`\``,
        },
      },
      {
        id: 'dml-basics',
        title: { ko: 'INSERT / UPDATE / DELETE 기초', en: 'INSERT / UPDATE / DELETE Basics' },
        level: 'beginner',
        content: {
          ko: `## INSERT (데이터 삽입)

### 단일 행 삽입

\`\`\`sql
INSERT INTO categories (id, name, parent_id)
VALUES (100, 'New Category', NULL);
\`\`\`

### 여러 행 삽입

\`\`\`sql
INSERT INTO categories (id, name, parent_id)
VALUES
  (101, 'Board Games', NULL),
  (102, 'Card Games', NULL),
  (103, 'Puzzles', NULL);
\`\`\`

### 열 순서와 기본값

- 모든 열을 지정하지 않으면 기본값(DEFAULT)이 사용됩니다
- \`id\`가 SERIAL/AUTO_INCREMENT이면 생략 가능합니다

## UPDATE (데이터 수정)

\`\`\`sql
-- 단일 열 수정
UPDATE products
SET price = 55000
WHERE id = 1;

-- 여러 열 수정
UPDATE customers
SET city = 'Busan', is_premium = true
WHERE id = 5;
\`\`\`

> **경고**: WHERE 없이 UPDATE하면 **모든 행**이 수정됩니다!

### 계산을 이용한 수정

\`\`\`sql
-- 10% 가격 인상
UPDATE products SET price = price * 1.1
WHERE category_id = 3;
\`\`\`

## DELETE (데이터 삭제)

\`\`\`sql
DELETE FROM reviews WHERE rating = 1;
\`\`\`

> **경고**: WHERE 없이 DELETE하면 **모든 행**이 삭제됩니다!

### 안전한 DML 절차

1. 먼저 \`SELECT\`로 대상 확인
2. 결과 확인 후 \`INSERT\` / \`UPDATE\` / \`DELETE\` 실행
3. 다시 \`SELECT\`로 결과 검증

\`\`\`sql
-- 1단계: 대상 확인
SELECT * FROM reviews WHERE rating = 1;

-- 2단계: 삭제 실행
DELETE FROM reviews WHERE rating = 1;

-- 3단계: 결과 검증
SELECT * FROM reviews WHERE rating = 1;
-- (0 rows) → 정상 삭제 완료
\`\`\``,
          en: `## INSERT (Add Data)

### Single Row

\`\`\`sql
INSERT INTO categories (id, name, parent_id)
VALUES (100, 'New Category', NULL);
\`\`\`

### Multiple Rows

\`\`\`sql
INSERT INTO categories (id, name, parent_id)
VALUES
  (101, 'Board Games', NULL),
  (102, 'Card Games', NULL),
  (103, 'Puzzles', NULL);
\`\`\`

### Column Order and Defaults

- Omitted columns use their DEFAULT value
- If \`id\` is SERIAL/AUTO_INCREMENT, it can be omitted

## UPDATE (Modify Data)

\`\`\`sql
-- Single column
UPDATE products
SET price = 55000
WHERE id = 1;

-- Multiple columns
UPDATE customers
SET city = 'Busan', is_premium = true
WHERE id = 5;
\`\`\`

> **Warning**: UPDATE without WHERE modifies **all rows**!

### Calculated Updates

\`\`\`sql
-- 10% price increase
UPDATE products SET price = price * 1.1
WHERE category_id = 3;
\`\`\`

## DELETE (Remove Data)

\`\`\`sql
DELETE FROM reviews WHERE rating = 1;
\`\`\`

> **Warning**: DELETE without WHERE removes **all rows**!

### Safe DML Workflow

1. First verify targets with \`SELECT\`
2. Execute \`INSERT\` / \`UPDATE\` / \`DELETE\`
3. Verify results with \`SELECT\`

\`\`\`sql
-- Step 1: Verify targets
SELECT * FROM reviews WHERE rating = 1;

-- Step 2: Execute delete
DELETE FROM reviews WHERE rating = 1;

-- Step 3: Verify result
SELECT * FROM reviews WHERE rating = 1;
-- (0 rows) → Successfully deleted
\`\`\``,
        },
      },
    ],
  },

  // ─── INTERMEDIATE ───
  {
    id: 'intermediate',
    title: { ko: '중급: 조인과 서브쿼리', en: 'Intermediate: Joins & Subqueries' },
    level: 'intermediate',
    icon: '🌿',
    sections: [
      {
        id: 'joins',
        title: { ko: 'JOIN: 테이블 결합', en: 'JOIN: Combining Tables' },
        level: 'intermediate',
        content: {
          ko: `## JOIN

두 개 이상의 테이블을 결합하여 데이터를 조회합니다.

### INNER JOIN

두 테이블에서 **일치하는 행만** 반환합니다.

\`\`\`sql
SELECT o.id, c.name, o.total_amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id;
\`\`\`

### LEFT JOIN (LEFT OUTER JOIN)

왼쪽 테이블의 **모든 행** + 오른쪽에서 일치하는 행. 일치하지 않으면 NULL.

\`\`\`sql
-- 주문이 없는 고객도 포함
SELECT c.name, o.id AS order_id
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;
\`\`\`

### RIGHT JOIN

오른쪽 테이블의 모든 행 + 왼쪽에서 일치하는 행.

### FULL OUTER JOIN

양쪽 모두의 모든 행 (일치하지 않으면 NULL).

### JOIN 비교

\`\`\`
테이블 A        테이블 B
┌───────┐      ┌───────┐
│ 1, 2  │      │ 2, 3  │
└───────┘      └───────┘

INNER JOIN:     2       (교집합)
LEFT JOIN:      1, 2    (A 전체 + 교집합)
RIGHT JOIN:     2, 3    (교집합 + B 전체)
FULL OUTER:     1, 2, 3 (합집합)
\`\`\`

### 여러 테이블 JOIN

\`\`\`sql
SELECT c.name, p.name AS product_name, oi.quantity, oi.unit_price
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.status = 'delivered';
\`\`\`

### 자주 쓰는 패턴

\`\`\`sql
-- 주문이 없는 고객 찾기
SELECT c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;

-- 리뷰와 함께 상품 조회
SELECT p.name, r.rating, r.comment
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id;
\`\`\``,
          en: `## JOIN

Combine two or more tables to query related data.

### INNER JOIN

Returns only rows that **match in both** tables.

\`\`\`sql
SELECT o.id, c.name, o.total_amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id;
\`\`\`

### LEFT JOIN (LEFT OUTER JOIN)

**All rows** from the left table + matching rows from the right. NULL if no match.

\`\`\`sql
-- Include customers with no orders
SELECT c.name, o.id AS order_id
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;
\`\`\`

### RIGHT JOIN

All rows from the right table + matching from the left.

### FULL OUTER JOIN

All rows from both tables (NULL where no match).

### JOIN Comparison

\`\`\`
Table A         Table B
┌───────┐      ┌───────┐
│ 1, 2  │      │ 2, 3  │
└───────┘      └───────┘

INNER JOIN:     2       (intersection)
LEFT JOIN:      1, 2    (all A + intersection)
RIGHT JOIN:     2, 3    (intersection + all B)
FULL OUTER:     1, 2, 3 (union)
\`\`\`

### Multiple Table JOINs

\`\`\`sql
SELECT c.name, p.name AS product_name, oi.quantity, oi.unit_price
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.status = 'delivered';
\`\`\`

### Common Patterns

\`\`\`sql
-- Find customers with no orders
SELECT c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;

-- Products with their reviews
SELECT p.name, r.rating, r.comment
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id;
\`\`\``,
        },
      },
      {
        id: 'subqueries',
        title: { ko: '서브쿼리', en: 'Subqueries' },
        level: 'intermediate',
        content: {
          ko: `## 서브쿼리 (Subquery)

쿼리 안에 포함된 쿼리입니다. 괄호 \`()\`로 감쌉니다.

### WHERE절 서브쿼리

\`\`\`sql
-- 평균 가격보다 비싼 상품
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- 주문한 적 있는 고객
SELECT name FROM customers
WHERE id IN (SELECT DISTINCT customer_id FROM orders);
\`\`\`

### FROM절 서브쿼리 (인라인 뷰)

\`\`\`sql
-- 카테고리별 평균 가격에서 가장 높은 것
SELECT category_id, avg_price
FROM (
  SELECT category_id, AVG(price) AS avg_price
  FROM products
  GROUP BY category_id
) AS cat_avg
ORDER BY avg_price DESC
LIMIT 1;
\`\`\`

### EXISTS

서브쿼리 결과가 존재하는지 확인합니다.

\`\`\`sql
-- 리뷰가 있는 상품만
SELECT p.name
FROM products p
WHERE EXISTS (
  SELECT 1 FROM reviews r WHERE r.product_id = p.id
);
\`\`\`

## GROUP BY + HAVING

\`\`\`sql
-- 주문 3건 이상인 고객
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 3;
\`\`\`

- **WHERE**: 그룹화 전 행 필터링
- **HAVING**: 그룹화 후 그룹 필터링

## CASE 표현식

\`\`\`sql
SELECT name, price,
  CASE
    WHEN price >= 1000000 THEN '고가'
    WHEN price >= 100000 THEN '중가'
    ELSE '저가'
  END AS price_range
FROM products;
\`\`\``,
          en: `## Subqueries

A query nested inside another query, enclosed in parentheses \`()\`.

### WHERE Clause Subquery

\`\`\`sql
-- Products more expensive than average
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- Customers who have ordered
SELECT name FROM customers
WHERE id IN (SELECT DISTINCT customer_id FROM orders);
\`\`\`

### FROM Clause Subquery (Inline View)

\`\`\`sql
-- Highest average price among categories
SELECT category_id, avg_price
FROM (
  SELECT category_id, AVG(price) AS avg_price
  FROM products
  GROUP BY category_id
) AS cat_avg
ORDER BY avg_price DESC
LIMIT 1;
\`\`\`

### EXISTS

Check if a subquery returns any results.

\`\`\`sql
-- Only products with reviews
SELECT p.name
FROM products p
WHERE EXISTS (
  SELECT 1 FROM reviews r WHERE r.product_id = p.id
);
\`\`\`

## GROUP BY + HAVING

\`\`\`sql
-- Customers with 3+ orders
SELECT customer_id, COUNT(*) AS order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(*) >= 3;
\`\`\`

- **WHERE**: Filters rows before grouping
- **HAVING**: Filters groups after grouping

## CASE Expression

\`\`\`sql
SELECT name, price,
  CASE
    WHEN price >= 1000000 THEN 'Expensive'
    WHEN price >= 100000 THEN 'Mid-range'
    ELSE 'Budget'
  END AS price_range
FROM products;
\`\`\``,
        },
      },
      {
        id: 'dml-intermediate',
        title: { ko: '중급 DML과 DDL', en: 'Intermediate DML & DDL' },
        level: 'intermediate',
        content: {
          ko: `## 중급 DML

### INSERT ... SELECT

다른 테이블의 데이터를 기반으로 삽입합니다.

\`\`\`sql
INSERT INTO categories (name, parent_id)
SELECT DISTINCT 'Sub-' || name, id
FROM categories
WHERE parent_id IS NULL;
\`\`\`

### UPDATE with JOIN

다른 테이블을 참조하여 수정합니다.

\`\`\`sql
-- PostgreSQL
UPDATE products p
SET price = price * 0.9
FROM categories c
WHERE p.category_id = c.id AND c.name = 'Electronics';

-- MySQL
UPDATE products p
JOIN categories c ON p.category_id = c.id
SET p.price = p.price * 0.9
WHERE c.name = 'Electronics';
\`\`\`

### DELETE with 서브쿼리

\`\`\`sql
DELETE FROM reviews
WHERE product_id IN (
  SELECT id FROM products WHERE stock_quantity = 0
);
\`\`\`

## DDL (Data Definition Language)

### CREATE TABLE

\`\`\`sql
CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  level VARCHAR(10) DEFAULT 'info',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### DROP TABLE

\`\`\`sql
DROP TABLE IF EXISTS logs;
-- CASCADE: 의존하는 객체도 삭제
DROP TABLE IF EXISTS categories CASCADE;
\`\`\`

### TRUNCATE

테이블의 모든 데이터를 빠르게 삭제합니다 (구조는 유지).

\`\`\`sql
TRUNCATE TABLE logs;
\`\`\`

| 비교 | DELETE (전체) | TRUNCATE |
|------|-------------|----------|
| 속도 | 느림 (행 단위) | 빠름 (테이블 단위) |
| WHERE | 사용 가능 | 불가 |
| 롤백 | 가능 | DB마다 다름 |
| 트리거 | 실행됨 | 실행 안 됨 |`,
          en: `## Intermediate DML

### INSERT ... SELECT

Insert data based on another table's data.

\`\`\`sql
INSERT INTO categories (name, parent_id)
SELECT DISTINCT 'Sub-' || name, id
FROM categories
WHERE parent_id IS NULL;
\`\`\`

### UPDATE with JOIN

Update using data from another table.

\`\`\`sql
-- PostgreSQL
UPDATE products p
SET price = price * 0.9
FROM categories c
WHERE p.category_id = c.id AND c.name = 'Electronics';

-- MySQL
UPDATE products p
JOIN categories c ON p.category_id = c.id
SET p.price = p.price * 0.9
WHERE c.name = 'Electronics';
\`\`\`

### DELETE with Subquery

\`\`\`sql
DELETE FROM reviews
WHERE product_id IN (
  SELECT id FROM products WHERE stock_quantity = 0
);
\`\`\`

## DDL (Data Definition Language)

### CREATE TABLE

\`\`\`sql
CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  level VARCHAR(10) DEFAULT 'info',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### DROP TABLE

\`\`\`sql
DROP TABLE IF EXISTS logs;
-- CASCADE: also drop dependent objects
DROP TABLE IF EXISTS categories CASCADE;
\`\`\`

### TRUNCATE

Quickly delete all data from a table (keeps structure).

\`\`\`sql
TRUNCATE TABLE logs;
\`\`\`

| Comparison | DELETE (all) | TRUNCATE |
|------------|-------------|----------|
| Speed | Slow (row-by-row) | Fast (table-level) |
| WHERE | Supported | Not supported |
| Rollback | Possible | Varies by DB |
| Triggers | Fired | Not fired |`,
        },
      },
    ],
  },

  // ─── ADVANCED ───
  {
    id: 'advanced',
    title: { ko: '고급: 윈도우 함수와 CTE', en: 'Advanced: Window Functions & CTEs' },
    level: 'advanced',
    icon: '🌳',
    sections: [
      {
        id: 'window-functions',
        title: { ko: '윈도우 함수', en: 'Window Functions' },
        level: 'advanced',
        content: {
          ko: `## 윈도우 함수 (Window Functions)

집계를 하되 행을 유지하는 함수입니다. GROUP BY와 달리 원본 행이 사라지지 않습니다.

### 기본 구문

\`\`\`sql
함수() OVER (
  [PARTITION BY 그룹열]
  [ORDER BY 정렬열]
)
\`\`\`

### ROW_NUMBER()

각 행에 순번을 부여합니다.

\`\`\`sql
SELECT name, price,
  ROW_NUMBER() OVER (ORDER BY price DESC) AS rank
FROM products;
\`\`\`

### RANK() / DENSE_RANK()

\`\`\`sql
-- RANK: 동점이면 같은 순위, 다음 순위는 건너뜀 (1,2,2,4)
-- DENSE_RANK: 동점이면 같은 순위, 다음 순위는 연속 (1,2,2,3)
SELECT name, price,
  RANK() OVER (ORDER BY price DESC) AS ranking,
  DENSE_RANK() OVER (ORDER BY price DESC) AS dense_ranking
FROM products;
\`\`\`

### PARTITION BY

그룹별로 윈도우 함수를 적용합니다.

\`\`\`sql
-- 카테고리 내 가격 순위
SELECT name, category_id, price,
  RANK() OVER (PARTITION BY category_id ORDER BY price DESC) AS cat_rank
FROM products;
\`\`\`

### SUM / AVG OVER (누적 합계)

\`\`\`sql
-- 날짜별 누적 매출
SELECT order_date, total_amount,
  SUM(total_amount) OVER (ORDER BY order_date) AS running_total
FROM orders;
\`\`\`

### LAG / LEAD

이전/다음 행의 값을 참조합니다.

\`\`\`sql
SELECT order_date, total_amount,
  LAG(total_amount, 1) OVER (ORDER BY order_date) AS prev_amount,
  LEAD(total_amount, 1) OVER (ORDER BY order_date) AS next_amount
FROM orders;
\`\`\`

| 함수 | 설명 |
|------|------|
| ROW_NUMBER() | 고유 순번 |
| RANK() | 동점 허용, 건너뜀 |
| DENSE_RANK() | 동점 허용, 연속 |
| SUM() OVER | 누적/이동 합계 |
| AVG() OVER | 누적/이동 평균 |
| LAG(col, n) | n행 이전 값 |
| LEAD(col, n) | n행 이후 값 |
| FIRST_VALUE() | 윈도우 내 첫 값 |
| LAST_VALUE() | 윈도우 내 마지막 값 |`,
          en: `## Window Functions

Perform calculations across rows while keeping the original rows intact. Unlike GROUP BY, source rows are preserved.

### Basic Syntax

\`\`\`sql
function() OVER (
  [PARTITION BY group_column]
  [ORDER BY sort_column]
)
\`\`\`

### ROW_NUMBER()

Assigns a unique sequential number to each row.

\`\`\`sql
SELECT name, price,
  ROW_NUMBER() OVER (ORDER BY price DESC) AS rank
FROM products;
\`\`\`

### RANK() / DENSE_RANK()

\`\`\`sql
-- RANK: ties get same rank, next rank skips (1,2,2,4)
-- DENSE_RANK: ties get same rank, next rank is consecutive (1,2,2,3)
SELECT name, price,
  RANK() OVER (ORDER BY price DESC) AS ranking,
  DENSE_RANK() OVER (ORDER BY price DESC) AS dense_ranking
FROM products;
\`\`\`

### PARTITION BY

Apply window functions within groups.

\`\`\`sql
-- Price rank within each category
SELECT name, category_id, price,
  RANK() OVER (PARTITION BY category_id ORDER BY price DESC) AS cat_rank
FROM products;
\`\`\`

### SUM / AVG OVER (Running Total)

\`\`\`sql
-- Running total of sales by date
SELECT order_date, total_amount,
  SUM(total_amount) OVER (ORDER BY order_date) AS running_total
FROM orders;
\`\`\`

### LAG / LEAD

Reference previous/next row values.

\`\`\`sql
SELECT order_date, total_amount,
  LAG(total_amount, 1) OVER (ORDER BY order_date) AS prev_amount,
  LEAD(total_amount, 1) OVER (ORDER BY order_date) AS next_amount
FROM orders;
\`\`\`

| Function | Description |
|----------|-------------|
| ROW_NUMBER() | Unique row number |
| RANK() | Ties allowed, gaps |
| DENSE_RANK() | Ties allowed, no gaps |
| SUM() OVER | Running/moving sum |
| AVG() OVER | Running/moving average |
| LAG(col, n) | Value n rows before |
| LEAD(col, n) | Value n rows after |
| FIRST_VALUE() | First value in window |
| LAST_VALUE() | Last value in window |`,
        },
      },
      {
        id: 'cte',
        title: { ko: 'CTE와 재귀 쿼리', en: 'CTEs & Recursive Queries' },
        level: 'advanced',
        content: {
          ko: `## CTE (Common Table Expression)

\`WITH\` 절을 사용하여 임시 결과셋에 이름을 부여합니다. 복잡한 쿼리를 읽기 쉽게 분리합니다.

### 기본 CTE

\`\`\`sql
WITH high_value_orders AS (
  SELECT customer_id, SUM(total_amount) AS total
  FROM orders
  GROUP BY customer_id
  HAVING SUM(total_amount) > 1000000
)
SELECT c.name, h.total
FROM high_value_orders h
JOIN customers c ON h.customer_id = c.id;
\`\`\`

### 여러 CTE 연결

\`\`\`sql
WITH
  order_totals AS (
    SELECT customer_id, COUNT(*) AS cnt, SUM(total_amount) AS total
    FROM orders GROUP BY customer_id
  ),
  premium_customers AS (
    SELECT * FROM order_totals WHERE total > 500000
  )
SELECT c.name, p.cnt, p.total
FROM premium_customers p
JOIN customers c ON p.customer_id = c.id;
\`\`\`

### 재귀 CTE

자기 자신을 참조하는 CTE입니다. 계층 구조 데이터에 유용합니다.

\`\`\`sql
WITH RECURSIVE category_tree AS (
  -- 기본 케이스: 최상위 카테고리
  SELECT id, name, parent_id, 0 AS depth
  FROM categories
  WHERE parent_id IS NULL

  UNION ALL

  -- 재귀 케이스: 하위 카테고리
  SELECT c.id, c.name, c.parent_id, ct.depth + 1
  FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY depth, name;
\`\`\`

> MySQL에서는 \`WITH RECURSIVE\`가 필수이지만, PostgreSQL에서는 \`RECURSIVE\` 키워드 없이도 작동합니다 (단, 명시적으로 쓰는 것이 좋습니다).`,
          en: `## CTE (Common Table Expression)

Use the \`WITH\` clause to name a temporary result set. Makes complex queries more readable.

### Basic CTE

\`\`\`sql
WITH high_value_orders AS (
  SELECT customer_id, SUM(total_amount) AS total
  FROM orders
  GROUP BY customer_id
  HAVING SUM(total_amount) > 1000000
)
SELECT c.name, h.total
FROM high_value_orders h
JOIN customers c ON h.customer_id = c.id;
\`\`\`

### Chaining Multiple CTEs

\`\`\`sql
WITH
  order_totals AS (
    SELECT customer_id, COUNT(*) AS cnt, SUM(total_amount) AS total
    FROM orders GROUP BY customer_id
  ),
  premium_customers AS (
    SELECT * FROM order_totals WHERE total > 500000
  )
SELECT c.name, p.cnt, p.total
FROM premium_customers p
JOIN customers c ON p.customer_id = c.id;
\`\`\`

### Recursive CTE

A CTE that references itself. Useful for hierarchical data.

\`\`\`sql
WITH RECURSIVE category_tree AS (
  -- Base case: top-level categories
  SELECT id, name, parent_id, 0 AS depth
  FROM categories
  WHERE parent_id IS NULL

  UNION ALL

  -- Recursive case: child categories
  SELECT c.id, c.name, c.parent_id, ct.depth + 1
  FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY depth, name;
\`\`\`

> MySQL requires \`WITH RECURSIVE\`, while PostgreSQL works without the \`RECURSIVE\` keyword (though it's best to include it explicitly).`,
        },
      },
      {
        id: 'views-union',
        title: { ko: 'VIEW, UNION, ALTER TABLE', en: 'Views, UNION, ALTER TABLE' },
        level: 'advanced',
        content: {
          ko: `## VIEW (뷰)

자주 사용하는 쿼리를 가상 테이블로 저장합니다.

\`\`\`sql
CREATE VIEW product_summary AS
SELECT p.id, p.name, c.name AS category, p.price,
  COALESCE(AVG(r.rating), 0) AS avg_rating
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name, c.name, p.price;

-- 뷰를 테이블처럼 사용
SELECT * FROM product_summary WHERE avg_rating >= 4;
\`\`\`

### MATERIALIZED VIEW (PostgreSQL 전용)

결과를 실제로 저장하여 성능을 개선합니다.

\`\`\`sql
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT DATE_TRUNC('month', order_date) AS month,
  SUM(total_amount) AS total
FROM orders GROUP BY 1;

-- 데이터 갱신
REFRESH MATERIALIZED VIEW monthly_sales;
\`\`\`

## UNION

여러 쿼리 결과를 합칩니다.

\`\`\`sql
-- UNION: 중복 제거
SELECT name FROM customers WHERE country = 'Korea'
UNION
SELECT name FROM customers WHERE is_premium = true;

-- UNION ALL: 중복 포함 (빠름)
SELECT 'order' AS type, id FROM orders
UNION ALL
SELECT 'review' AS type, id FROM reviews;
\`\`\`

> **규칙**: 각 SELECT의 열 수와 타입이 동일해야 합니다.

## ALTER TABLE

\`\`\`sql
-- 열 추가
ALTER TABLE products ADD COLUMN discount_rate DECIMAL(5,2);

-- 열 타입 변경
ALTER TABLE products ALTER COLUMN name TYPE VARCHAR(300);

-- 열 삭제
ALTER TABLE products DROP COLUMN discount_rate;

-- 제약 조건 추가
ALTER TABLE products ADD CONSTRAINT price_positive CHECK (price > 0);
\`\`\`

## CREATE TABLE AS SELECT (CTAS)

\`\`\`sql
CREATE TABLE top_products AS
SELECT p.*, AVG(r.rating) AS avg_rating
FROM products p
JOIN reviews r ON p.id = r.product_id
GROUP BY p.id
HAVING AVG(r.rating) >= 4.5;
\`\`\``,
          en: `## VIEW

Save frequently used queries as virtual tables.

\`\`\`sql
CREATE VIEW product_summary AS
SELECT p.id, p.name, c.name AS category, p.price,
  COALESCE(AVG(r.rating), 0) AS avg_rating
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name, c.name, p.price;

-- Use the view like a table
SELECT * FROM product_summary WHERE avg_rating >= 4;
\`\`\`

### MATERIALIZED VIEW (PostgreSQL only)

Stores results physically for better performance.

\`\`\`sql
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT DATE_TRUNC('month', order_date) AS month,
  SUM(total_amount) AS total
FROM orders GROUP BY 1;

-- Refresh data
REFRESH MATERIALIZED VIEW monthly_sales;
\`\`\`

## UNION

Combine results from multiple queries.

\`\`\`sql
-- UNION: removes duplicates
SELECT name FROM customers WHERE country = 'Korea'
UNION
SELECT name FROM customers WHERE is_premium = true;

-- UNION ALL: keeps duplicates (faster)
SELECT 'order' AS type, id FROM orders
UNION ALL
SELECT 'review' AS type, id FROM reviews;
\`\`\`

> **Rule**: Each SELECT must have the same number and type of columns.

## ALTER TABLE

\`\`\`sql
-- Add column
ALTER TABLE products ADD COLUMN discount_rate DECIMAL(5,2);

-- Change column type
ALTER TABLE products ALTER COLUMN name TYPE VARCHAR(300);

-- Drop column
ALTER TABLE products DROP COLUMN discount_rate;

-- Add constraint
ALTER TABLE products ADD CONSTRAINT price_positive CHECK (price > 0);
\`\`\`

## CREATE TABLE AS SELECT (CTAS)

\`\`\`sql
CREATE TABLE top_products AS
SELECT p.*, AVG(r.rating) AS avg_rating
FROM products p
JOIN reviews r ON p.id = r.product_id
GROUP BY p.id
HAVING AVG(r.rating) >= 4.5;
\`\`\``,
        },
      },
    ],
  },

  // ─── EXPERT ───
  {
    id: 'expert',
    title: { ko: '전문가: 성능과 관리', en: 'Expert: Performance & Administration' },
    level: 'expert',
    icon: '🏔️',
    sections: [
      {
        id: 'indexes-performance',
        title: { ko: '인덱스와 실행 계획', en: 'Indexes & Execution Plans' },
        level: 'expert',
        content: {
          ko: `## 인덱스 (Index)

데이터 검색 속도를 높이는 자료구조입니다. 책의 목차와 같은 역할을 합니다.

### 인덱스 생성

\`\`\`sql
-- 단일 열 인덱스
CREATE INDEX idx_products_category ON products(category_id);

-- 복합 인덱스
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);

-- 유니크 인덱스
CREATE UNIQUE INDEX idx_customers_email ON customers(email);
\`\`\`

### 인덱스가 효과적인 경우

- WHERE절에서 자주 사용되는 열
- JOIN의 결합 열
- ORDER BY에 사용되는 열
- 선택도(Selectivity)가 높은 열 (고유한 값이 많은 열)

### 인덱스 주의사항

- INSERT/UPDATE/DELETE 성능이 약간 저하됨
- 저장 공간을 추가로 사용
- 작은 테이블에는 효과 미미

## EXPLAIN (실행 계획)

쿼리가 어떻게 실행되는지 분석합니다.

\`\`\`sql
EXPLAIN SELECT * FROM products WHERE category_id = 1;
\`\`\`

### EXPLAIN ANALYZE (실제 실행)

\`\`\`sql
EXPLAIN ANALYZE
SELECT p.name, c.name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.price > 100000;
\`\`\`

### 실행 계획 읽기

| 용어 | 설명 |
|------|------|
| Seq Scan | 전체 테이블 스캔 (느림) |
| Index Scan | 인덱스를 사용한 스캔 (빠름) |
| Index Only Scan | 인덱스만으로 결과 반환 (가장 빠름) |
| Nested Loop | 중첩 루프 조인 |
| Hash Join | 해시 테이블 기반 조인 |
| Sort | 정렬 연산 |
| cost | 예상 비용 (낮을수록 좋음) |
| rows | 예상 행 수 |
| actual time | 실제 실행 시간 (ms) |`,
          en: `## Indexes

Data structures that speed up data retrieval, like a book's table of contents.

### Creating Indexes

\`\`\`sql
-- Single column index
CREATE INDEX idx_products_category ON products(category_id);

-- Composite index
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);

-- Unique index
CREATE UNIQUE INDEX idx_customers_email ON customers(email);
\`\`\`

### When Indexes Are Effective

- Columns frequently used in WHERE clauses
- JOIN columns
- ORDER BY columns
- Columns with high selectivity (many unique values)

### Index Considerations

- Slightly slows INSERT/UPDATE/DELETE
- Uses additional storage
- Minimal effect on small tables

## EXPLAIN (Execution Plan)

Analyze how a query will be executed.

\`\`\`sql
EXPLAIN SELECT * FROM products WHERE category_id = 1;
\`\`\`

### EXPLAIN ANALYZE (Actual Execution)

\`\`\`sql
EXPLAIN ANALYZE
SELECT p.name, c.name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.price > 100000;
\`\`\`

### Reading Execution Plans

| Term | Description |
|------|-------------|
| Seq Scan | Full table scan (slow) |
| Index Scan | Index-based scan (fast) |
| Index Only Scan | Results from index alone (fastest) |
| Nested Loop | Nested loop join |
| Hash Join | Hash table-based join |
| Sort | Sort operation |
| cost | Estimated cost (lower is better) |
| rows | Estimated row count |
| actual time | Actual execution time (ms) |`,
        },
      },
      {
        id: 'transactions-constraints',
        title: { ko: '트랜잭션과 제약 조건', en: 'Transactions & Constraints' },
        level: 'expert',
        content: {
          ko: `## 트랜잭션 (Transaction)

여러 SQL 문을 하나의 작업 단위로 묶습니다. 모두 성공하거나, 모두 취소됩니다.

### ACID 속성

| 속성 | 설명 |
|------|------|
| **A**tomicity (원자성) | 전부 성공 또는 전부 실패 |
| **C**onsistency (일관성) | 트랜잭션 전후 데이터 무결성 유지 |
| **I**solation (격리성) | 동시 실행되는 트랜잭션이 서로 영향 없음 |
| **D**urability (지속성) | 커밋된 데이터는 영구 보존 |

### 기본 사용법

\`\`\`sql
BEGIN;
  UPDATE accounts SET balance = balance - 10000 WHERE id = 1;
  UPDATE accounts SET balance = balance + 10000 WHERE id = 2;
COMMIT;

-- 문제 발생 시
BEGIN;
  UPDATE accounts SET balance = balance - 10000 WHERE id = 1;
  -- 오류 발생!
ROLLBACK;  -- 모든 변경 취소
\`\`\`

## 제약 조건 (Constraints)

데이터 무결성을 보장하는 규칙입니다.

| 제약 조건 | 설명 | 예시 |
|----------|------|------|
| PRIMARY KEY | 고유 식별자, NOT NULL | \`id SERIAL PRIMARY KEY\` |
| UNIQUE | 중복 불가 | \`email VARCHAR(150) UNIQUE\` |
| NOT NULL | NULL 불가 | \`name VARCHAR(100) NOT NULL\` |
| CHECK | 조건 만족 | \`CHECK (price > 0)\` |
| FOREIGN KEY | 다른 테이블 참조 | \`REFERENCES customers(id)\` |
| DEFAULT | 기본값 | \`DEFAULT CURRENT_TIMESTAMP\` |

### UPSERT (충돌 시 업데이트)

\`\`\`sql
-- PostgreSQL: ON CONFLICT
INSERT INTO products (id, name, price)
VALUES (1, 'Updated Product', 55000)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, price = EXCLUDED.price;

-- MySQL: ON DUPLICATE KEY UPDATE
INSERT INTO products (id, name, price)
VALUES (1, 'Updated Product', 55000)
ON DUPLICATE KEY UPDATE
name = VALUES(name), price = VALUES(price);
\`\`\``,
          en: `## Transactions

Group multiple SQL statements into a single unit of work. Either all succeed, or all are rolled back.

### ACID Properties

| Property | Description |
|----------|-------------|
| **A**tomicity | All or nothing |
| **C**onsistency | Data integrity maintained before and after |
| **I**solation | Concurrent transactions don't interfere |
| **D**urability | Committed data is permanently saved |

### Basic Usage

\`\`\`sql
BEGIN;
  UPDATE accounts SET balance = balance - 10000 WHERE id = 1;
  UPDATE accounts SET balance = balance + 10000 WHERE id = 2;
COMMIT;

-- On error
BEGIN;
  UPDATE accounts SET balance = balance - 10000 WHERE id = 1;
  -- Error occurred!
ROLLBACK;  -- Undo all changes
\`\`\`

## Constraints

Rules that ensure data integrity.

| Constraint | Description | Example |
|-----------|-------------|---------|
| PRIMARY KEY | Unique identifier, NOT NULL | \`id SERIAL PRIMARY KEY\` |
| UNIQUE | No duplicates | \`email VARCHAR(150) UNIQUE\` |
| NOT NULL | Cannot be NULL | \`name VARCHAR(100) NOT NULL\` |
| CHECK | Must satisfy condition | \`CHECK (price > 0)\` |
| FOREIGN KEY | References another table | \`REFERENCES customers(id)\` |
| DEFAULT | Default value | \`DEFAULT CURRENT_TIMESTAMP\` |

### UPSERT (Update on Conflict)

\`\`\`sql
-- PostgreSQL: ON CONFLICT
INSERT INTO products (id, name, price)
VALUES (1, 'Updated Product', 55000)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, price = EXCLUDED.price;

-- MySQL: ON DUPLICATE KEY UPDATE
INSERT INTO products (id, name, price)
VALUES (1, 'Updated Product', 55000)
ON DUPLICATE KEY UPDATE
name = VALUES(name), price = VALUES(price);
\`\`\``,
        },
      },
      {
        id: 'advanced-objects',
        title: { ko: '스키마, 시퀀스, 트리거, 권한', en: 'Schema, Sequences, Triggers, Permissions' },
        level: 'expert',
        content: {
          ko: `## 스키마 (Schema)

데이터베이스 객체를 논리적으로 그룹화하는 네임스페이스입니다.

\`\`\`sql
CREATE SCHEMA analytics;
CREATE TABLE analytics.daily_stats (...);
\`\`\`

## 시퀀스 (Sequence)

자동 증가하는 숫자를 생성합니다. SERIAL의 내부 구현체입니다.

\`\`\`sql
CREATE SEQUENCE order_seq START WITH 1000 INCREMENT BY 1;
SELECT nextval('order_seq');  -- 1000, 1001, 1002, ...
\`\`\`

## 트리거 (Trigger)

특정 이벤트(INSERT, UPDATE, DELETE) 발생 시 자동으로 실행되는 함수입니다.

\`\`\`sql
-- PostgreSQL
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
\`\`\`

## 권한 관리 (GRANT / REVOKE)

\`\`\`sql
-- 권한 부여
GRANT SELECT, INSERT ON products TO analyst_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_role;

-- 권한 회수
REVOKE INSERT ON products FROM analyst_role;

-- 역할 생성
CREATE ROLE readonly_user LOGIN PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
\`\`\`

| 권한 | 설명 |
|------|------|
| SELECT | 조회 |
| INSERT | 삽입 |
| UPDATE | 수정 |
| DELETE | 삭제 |
| ALL PRIVILEGES | 모든 권한 |
| USAGE | 스키마/시퀀스 사용 |`,
          en: `## Schema

A namespace that logically groups database objects.

\`\`\`sql
CREATE SCHEMA analytics;
CREATE TABLE analytics.daily_stats (...);
\`\`\`

## Sequence

Generates auto-incrementing numbers. The internal implementation of SERIAL.

\`\`\`sql
CREATE SEQUENCE order_seq START WITH 1000 INCREMENT BY 1;
SELECT nextval('order_seq');  -- 1000, 1001, 1002, ...
\`\`\`

## Trigger

A function that executes automatically on specific events (INSERT, UPDATE, DELETE).

\`\`\`sql
-- PostgreSQL
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
\`\`\`

## Permissions (GRANT / REVOKE)

\`\`\`sql
-- Grant permissions
GRANT SELECT, INSERT ON products TO analyst_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_role;

-- Revoke permissions
REVOKE INSERT ON products FROM analyst_role;

-- Create role
CREATE ROLE readonly_user LOGIN PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
\`\`\`

| Permission | Description |
|-----------|-------------|
| SELECT | Read data |
| INSERT | Add data |
| UPDATE | Modify data |
| DELETE | Remove data |
| ALL PRIVILEGES | All permissions |
| USAGE | Use schema/sequence |`,
        },
      },
    ],
  },

  // ─── DATABASE ───
  {
    id: 'database',
    title: { ko: 'DBA: 데이터베이스 관리', en: 'DBA: Database Administration' },
    level: 'database',
    icon: '🔧',
    sections: [
      {
        id: 'vacuum-maintenance',
        title: { ko: 'VACUUM과 데이터베이스 유지보수', en: 'VACUUM & Database Maintenance' },
        level: 'database',
        content: {
          ko: `## VACUUM (PostgreSQL)

PostgreSQL은 MVCC(Multi-Version Concurrency Control) 방식으로 동작합니다. UPDATE/DELETE된 행의 이전 버전(dead tuple)이 남아있어 정리가 필요합니다.

\`\`\`sql
-- 기본 VACUUM (공간 재사용 가능하게 표시)
VACUUM products;

-- VACUUM ANALYZE (통계 정보도 갱신)
VACUUM ANALYZE products;

-- VACUUM FULL (물리적 공간 회수 - 배타적 잠금 발생)
VACUUM FULL products;
\`\`\`

| 명령 | 잠금 | 공간 회수 | 속도 |
|------|------|----------|------|
| VACUUM | 없음 | 재사용 표시 | 빠름 |
| VACUUM FULL | 배타적 잠금 | 물리적 회수 | 느림 |
| VACUUM ANALYZE | 없음 | 재사용 표시 + 통계 | 빠름 |

### ANALYZE (통계 갱신)

\`\`\`sql
ANALYZE products;  -- 쿼리 플래너의 통계 정보 갱신
ANALYZE;           -- 전체 데이터베이스
\`\`\`

### autovacuum

PostgreSQL은 기본적으로 autovacuum 데몬이 자동으로 VACUUM을 실행합니다.

\`\`\`sql
-- autovacuum 설정 확인
SELECT name, setting FROM pg_settings
WHERE name LIKE 'autovacuum%';
\`\`\`

## MySQL 유지보수

\`\`\`sql
-- 테이블 최적화 (VACUUM FULL과 유사)
OPTIMIZE TABLE products;

-- 테이블 분석 (통계 갱신)
ANALYZE TABLE products;

-- 테이블 점검
CHECK TABLE products;
\`\`\``,
          en: `## VACUUM (PostgreSQL)

PostgreSQL uses MVCC (Multi-Version Concurrency Control). Previous versions of UPDATE/DELETE'd rows (dead tuples) remain and need cleanup.

\`\`\`sql
-- Basic VACUUM (marks space as reusable)
VACUUM products;

-- VACUUM ANALYZE (also updates statistics)
VACUUM ANALYZE products;

-- VACUUM FULL (physically reclaims space - exclusive lock)
VACUUM FULL products;
\`\`\`

| Command | Lock | Space Reclaim | Speed |
|---------|------|--------------|-------|
| VACUUM | None | Marks reusable | Fast |
| VACUUM FULL | Exclusive | Physical reclaim | Slow |
| VACUUM ANALYZE | None | Marks + stats | Fast |

### ANALYZE (Update Statistics)

\`\`\`sql
ANALYZE products;  -- Update planner statistics
ANALYZE;           -- Entire database
\`\`\`

### autovacuum

PostgreSQL's autovacuum daemon automatically runs VACUUM by default.

\`\`\`sql
-- Check autovacuum settings
SELECT name, setting FROM pg_settings
WHERE name LIKE 'autovacuum%';
\`\`\`

## MySQL Maintenance

\`\`\`sql
-- Optimize table (similar to VACUUM FULL)
OPTIMIZE TABLE products;

-- Analyze table (update statistics)
ANALYZE TABLE products;

-- Check table
CHECK TABLE products;
\`\`\``,
        },
      },
      {
        id: 'monitoring',
        title: { ko: '모니터링과 시스템 카탈로그', en: 'Monitoring & System Catalogs' },
        level: 'database',
        content: {
          ko: `## PostgreSQL 시스템 카탈로그

### 활성 세션 조회

\`\`\`sql
SELECT pid, usename, application_name, state,
  query, query_start
FROM pg_stat_activity
WHERE state != 'idle';
\`\`\`

### 테이블 통계

\`\`\`sql
SELECT schemaname, relname,
  n_live_tup AS live_rows,
  n_dead_tup AS dead_rows,
  last_vacuum, last_analyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
\`\`\`

### 데이터베이스 크기

\`\`\`sql
-- 데이터베이스 크기
SELECT pg_database.datname,
  pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
ORDER BY pg_database_size(pg_database.datname) DESC;

-- 테이블별 크기
SELECT relname,
  pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
  pg_size_pretty(pg_relation_size(relid)) AS data_size,
  pg_size_pretty(pg_indexes_size(relid)) AS index_size
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
\`\`\`

### 잠금 (Locks) 조회

\`\`\`sql
SELECT l.pid, l.locktype, l.mode, l.granted,
  a.usename, a.query
FROM pg_locks l
JOIN pg_stat_activity a ON l.pid = a.pid
WHERE NOT l.granted;  -- 대기 중인 잠금
\`\`\`

### 인덱스 사용률

\`\`\`sql
SELECT schemaname, relname, indexrelname,
  idx_scan AS times_used,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
\`\`\`

### 설정 조회

\`\`\`sql
SELECT name, setting, unit, short_desc
FROM pg_settings
WHERE name IN ('shared_buffers', 'work_mem',
  'max_connections', 'effective_cache_size');
\`\`\`

### 연결 정보

\`\`\`sql
SELECT current_database(), current_user, version(),
  inet_server_addr(), inet_server_port();
\`\`\``,
          en: `## PostgreSQL System Catalogs

### Active Sessions

\`\`\`sql
SELECT pid, usename, application_name, state,
  query, query_start
FROM pg_stat_activity
WHERE state != 'idle';
\`\`\`

### Table Statistics

\`\`\`sql
SELECT schemaname, relname,
  n_live_tup AS live_rows,
  n_dead_tup AS dead_rows,
  last_vacuum, last_analyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
\`\`\`

### Database Size

\`\`\`sql
-- Database size
SELECT pg_database.datname,
  pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
ORDER BY pg_database_size(pg_database.datname) DESC;

-- Table sizes
SELECT relname,
  pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
  pg_size_pretty(pg_relation_size(relid)) AS data_size,
  pg_size_pretty(pg_indexes_size(relid)) AS index_size
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
\`\`\`

### Lock Monitoring

\`\`\`sql
SELECT l.pid, l.locktype, l.mode, l.granted,
  a.usename, a.query
FROM pg_locks l
JOIN pg_stat_activity a ON l.pid = a.pid
WHERE NOT l.granted;  -- Waiting locks
\`\`\`

### Index Usage

\`\`\`sql
SELECT schemaname, relname, indexrelname,
  idx_scan AS times_used,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
\`\`\`

### Configuration

\`\`\`sql
SELECT name, setting, unit, short_desc
FROM pg_settings
WHERE name IN ('shared_buffers', 'work_mem',
  'max_connections', 'effective_cache_size');
\`\`\`

### Connection Info

\`\`\`sql
SELECT current_database(), current_user, version(),
  inet_server_addr(), inet_server_port();
\`\`\``,
        },
      },
    ],
  },
];

export function getDocChapter(id: string): DocChapter | undefined {
  return docChapters.find((c) => c.id === id);
}

export function getDocSection(chapterId: string, sectionId: string): DocSection | undefined {
  const chapter = getDocChapter(chapterId);
  return chapter?.sections.find((s) => s.id === sectionId);
}
