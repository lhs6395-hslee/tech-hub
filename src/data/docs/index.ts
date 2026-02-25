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

### 데이터 타입

| 타입 | PostgreSQL | MySQL | 설명 |
|------|-----------|-------|------|
| 정수 | INTEGER, BIGINT | INT, BIGINT | 정수형 |
| 실수 | DECIMAL(10,2), NUMERIC | DECIMAL(10,2) | 고정 소수점 |
| 문자열 | VARCHAR(100), TEXT | VARCHAR(100), TEXT | 가변 길이 문자열 |
| 날짜 | DATE | DATE | 날짜 (YYYY-MM-DD) |
| 시간 | TIMESTAMP | TIMESTAMP, DATETIME | 날짜+시간 |
| 논리 | BOOLEAN | BOOLEAN (TINYINT) | true/false |
| JSON | JSONB, JSON | JSON | JSON 데이터 (PG의 JSONB는 인덱싱 가능) |
| 자동증가 | SERIAL 또는 GENERATED AS IDENTITY | AUTO_INCREMENT | 자동 증가 PK |

### PostgreSQL vs MySQL 주요 차이

| 기능 | PostgreSQL | MySQL |
|------|-----------|-------|
| 자동 증가 | \`SERIAL\` (레거시) / \`GENERATED AS IDENTITY\` (권장) | \`AUTO_INCREMENT\` |
| 문자열 연결 | \`\\|\\|\` 연산자 | \`CONCAT()\` 함수 |
| 대소문자 | 기본 대소문자 구분 | 기본 대소문자 무시 (collation 의존) |
| UPSERT | \`ON CONFLICT DO UPDATE\` | \`ON DUPLICATE KEY UPDATE\` (MySQL 8.0.19+: \`AS\` 별칭 사용 권장) |
| LIMIT | \`LIMIT n OFFSET m\` | \`LIMIT m, n\` 또는 \`LIMIT n OFFSET m\` |
| BOOLEAN | 진짜 BOOLEAN 타입 | TINYINT(1)로 구현 |
| CHECK 제약 | 완전 지원 | 8.0.16+부터 실제 적용 (이전 버전은 구문만 허용) |
| JSON | \`JSONB\` (바이너리, 인덱싱 가능) / \`JSON\` | \`JSON\` (내부적으로 바이너리 저장) |
| MERGE | PG 15+: \`MERGE\` (PG 17+: \`RETURNING\` 지원) | 미지원 (\`INSERT ... ON DUPLICATE KEY\`로 대체) |
| 현재 시간 | \`CURRENT_TIMESTAMP\`, \`NOW()\` | \`NOW()\`, \`CURRENT_TIMESTAMP\` |

### 이 플랫폼의 스키마

\`\`\`
customers (고객)
├── id          SERIAL PRIMARY KEY
├── name        VARCHAR(100) NOT NULL
├── email       VARCHAR(150) UNIQUE NOT NULL
├── city        VARCHAR(50)
├── country     VARCHAR(50)
├── signup_date DATE
└── is_premium  BOOLEAN DEFAULT FALSE

categories (카테고리)
├── id          SERIAL PRIMARY KEY
├── name        VARCHAR(50) NOT NULL
└── parent_id   INTEGER → categories(id) (자기참조 FK)

products (상품)
├── id              SERIAL PRIMARY KEY
├── name            VARCHAR(200) NOT NULL
├── category_id     INTEGER → categories(id)
├── price           DECIMAL(10,2) NOT NULL
├── stock_quantity  INTEGER DEFAULT 0
└── created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP

orders (주문)
├── id            SERIAL PRIMARY KEY
├── customer_id   INTEGER → customers(id)
├── order_date    TIMESTAMP NOT NULL
├── status        VARCHAR(20) CHECK (pending/processing/shipped/delivered/cancelled)
└── total_amount  DECIMAL(12,2)

order_items (주문 상세)
├── id          SERIAL PRIMARY KEY
├── order_id    INTEGER → orders(id)
├── product_id  INTEGER → products(id)
├── quantity    INTEGER NOT NULL
└── unit_price  DECIMAL(10,2) NOT NULL

reviews (리뷰)
├── id          SERIAL PRIMARY KEY
├── product_id  INTEGER → products(id)
├── customer_id INTEGER → customers(id)
├── rating      INTEGER CHECK (1~5)
├── comment     TEXT
└── created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
\`\`\`

### 테이블 간 관계도 (ERD)

\`\`\`
customers ──< orders ──< order_items >── products
    │                                       │
    └─────── reviews ──────────────────────┘
                                 categories (self-ref)
\`\`\`
- \`──<\` : 1:N 관계 (한 고객이 여러 주문)
- \`>──\` : N:1 관계 (여러 주문항목이 하나의 상품)`,
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

### Data Types

| Type | PostgreSQL | MySQL | Description |
|------|-----------|-------|-------------|
| Integer | INTEGER, BIGINT | INT, BIGINT | Whole numbers |
| Decimal | DECIMAL(10,2), NUMERIC | DECIMAL(10,2) | Fixed-point |
| String | VARCHAR(100), TEXT | VARCHAR(100), TEXT | Variable-length |
| Date | DATE | DATE | Date (YYYY-MM-DD) |
| Timestamp | TIMESTAMP | TIMESTAMP, DATETIME | Date + time |
| Boolean | BOOLEAN | BOOLEAN (TINYINT) | true/false |
| JSON | JSONB, JSON | JSON | JSON data (PG's JSONB supports indexing) |
| Auto-increment | SERIAL or GENERATED AS IDENTITY | AUTO_INCREMENT | Auto PK |

### PostgreSQL vs MySQL Key Differences

| Feature | PostgreSQL | MySQL |
|---------|-----------|-------|
| Auto-increment | \`SERIAL\` (legacy) / \`GENERATED AS IDENTITY\` (recommended) | \`AUTO_INCREMENT\` |
| String concat | \`\\|\\|\` operator | \`CONCAT()\` function |
| Case sensitivity | Case-sensitive by default | Case-insensitive by default (collation-dependent) |
| UPSERT | \`ON CONFLICT DO UPDATE\` | \`ON DUPLICATE KEY UPDATE\` (MySQL 8.0.19+: \`AS\` alias recommended) |
| LIMIT | \`LIMIT n OFFSET m\` | \`LIMIT m, n\` or \`LIMIT n OFFSET m\` |
| BOOLEAN | Native BOOLEAN type | TINYINT(1) |
| CHECK | Fully supported | Enforced since 8.0.16 (syntax-only before) |
| JSON | \`JSONB\` (binary, indexable) / \`JSON\` | \`JSON\` (internally stored as binary) |
| MERGE | PG 15+: \`MERGE\` (PG 17+: with \`RETURNING\`) | Not supported (use \`INSERT ... ON DUPLICATE KEY\`) |
| Current time | \`CURRENT_TIMESTAMP\`, \`NOW()\` | \`NOW()\`, \`CURRENT_TIMESTAMP\` |

### Platform Schema

\`\`\`
customers
├── id          SERIAL PRIMARY KEY
├── name        VARCHAR(100) NOT NULL
├── email       VARCHAR(150) UNIQUE NOT NULL
├── city        VARCHAR(50)
├── country     VARCHAR(50)
├── signup_date DATE
└── is_premium  BOOLEAN DEFAULT FALSE

categories
├── id          SERIAL PRIMARY KEY
├── name        VARCHAR(50) NOT NULL
└── parent_id   INTEGER → categories(id) (self-referencing FK)

products
├── id              SERIAL PRIMARY KEY
├── name            VARCHAR(200) NOT NULL
├── category_id     INTEGER → categories(id)
├── price           DECIMAL(10,2) NOT NULL
├── stock_quantity  INTEGER DEFAULT 0
└── created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP

orders
├── id            SERIAL PRIMARY KEY
├── customer_id   INTEGER → customers(id)
├── order_date    TIMESTAMP NOT NULL
├── status        VARCHAR(20) CHECK (pending/processing/shipped/delivered/cancelled)
└── total_amount  DECIMAL(12,2)

order_items
├── id          SERIAL PRIMARY KEY
├── order_id    INTEGER → orders(id)
├── product_id  INTEGER → products(id)
├── quantity    INTEGER NOT NULL
└── unit_price  DECIMAL(10,2) NOT NULL

reviews
├── id          SERIAL PRIMARY KEY
├── product_id  INTEGER → products(id)
├── customer_id INTEGER → customers(id)
├── rating      INTEGER CHECK (1~5)
├── comment     TEXT
└── created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
\`\`\`

### Table Relationships (ERD)

\`\`\`
customers ──< orders ──< order_items >── products
    │                                       │
    └─────── reviews ──────────────────────┘
                                 categories (self-ref)
\`\`\`
- \`──<\` : 1:N relationship (one customer, many orders)
- \`>──\` : N:1 relationship (many order items, one product)`,
        },
      },
      {
        id: 'schema-keys',
        title: { ko: '스키마, 기본키, 외래키', en: 'Schema, Primary Key, Foreign Key' },
        level: 'beginner',
        content: {
          ko: `## 스키마 (Schema)

스키마는 데이터베이스의 **전체 구조를 정의하는 설계도**입니다. 어떤 테이블이 있고, 각 테이블에 어떤 열이 있으며, 테이블 간에 어떤 관계가 있는지를 정의합니다.

### 스키마의 구성 요소

| 구성 요소 | 설명 | 예시 |
|-----------|------|------|
| **테이블** | 데이터를 저장하는 2차원 구조 | customers, orders |
| **열 (Column)** | 데이터의 속성 (필드) | name, email, price |
| **행 (Row)** | 하나의 데이터 레코드 | 고객 1명의 전체 정보 |
| **제약 조건** | 데이터 무결성 규칙 | NOT NULL, UNIQUE, CHECK |
| **관계** | 테이블 간 연결 | 외래키(FK) 참조 |

### 스키마 정의 (DDL)

\`\`\`sql
CREATE TABLE customers (
    id       SERIAL PRIMARY KEY,          -- 기본키 (자동 증가)
    name     VARCHAR(100) NOT NULL,       -- 이름 (필수)
    email    VARCHAR(150) UNIQUE NOT NULL, -- 이메일 (중복 불가, 필수)
    city     VARCHAR(50),                 -- 도시 (선택)
    is_premium BOOLEAN DEFAULT FALSE      -- 프리미엄 (기본값: false)
);
\`\`\`

---

## 기본키 (Primary Key)

기본키는 테이블에서 **각 행을 고유하게 식별**하는 열(또는 열 조합)입니다. 모든 테이블은 반드시 기본키를 가져야 합니다.

### 기본키의 규칙

| 규칙 | 설명 |
|------|------|
| **고유성 (Unique)** | 같은 값을 가진 행이 2개 이상 존재할 수 없음 |
| **NOT NULL** | NULL 값이 허용되지 않음 |
| **불변성** | 한번 설정된 PK 값은 변경하지 않는 것이 원칙 |
| **단일 PK** | 하나의 테이블에 기본키는 하나만 존재 |

### 기본키 종류

| 종류 | 설명 | 예시 | 장단점 |
|------|------|------|--------|
| **대리키 (Surrogate)** | 의미 없는 자동 생성 번호 | \`id SERIAL\` 또는 \`id INT GENERATED ALWAYS AS IDENTITY\` | 단순하고 안정적, 가장 많이 사용 |
| **자연키 (Natural)** | 실제 의미가 있는 값 | \`email\`, \`주민번호\` | 직관적이지만 변경될 수 있음 |
| **복합키 (Composite)** | 2개 이상 열의 조합 | \`(order_id, product_id)\` | 다대다 관계 테이블에 사용 |

### 기본키 선언

\`\`\`sql
-- 방법 1: 열 정의 시 함께 선언
CREATE TABLE products (
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- 방법 2: 테이블 정의 끝에 선언
CREATE TABLE order_items (
    order_id   INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity   INTEGER NOT NULL,
    PRIMARY KEY (order_id, product_id)  -- 복합키
);
\`\`\`

> 실무에서는 거의 항상 대리키를 사용합니다. PostgreSQL에서는 \`SERIAL\` 대신 SQL 표준인 \`GENERATED ALWAYS AS IDENTITY\`가 권장됩니다 (PG 10+). 자연키는 이메일 변경 등으로 문제가 발생할 수 있습니다.

---

## 외래키 (Foreign Key)

외래키는 **다른 테이블의 기본키를 참조하는 열**입니다. 테이블 간의 관계를 만들고, **참조 무결성(Referential Integrity)**을 보장합니다.

### 외래키의 역할

- 두 테이블 사이에 **관계(relationship)**를 형성
- 존재하지 않는 값을 참조하는 것을 **방지**
- 예: \`orders.customer_id = 999\`인데 \`customers\` 테이블에 id=999인 고객이 없으면 → 에러!

### 외래키 선언

\`\`\`sql
CREATE TABLE orders (
    id            SERIAL PRIMARY KEY,
    customer_id   INTEGER NOT NULL,
    order_date    TIMESTAMP NOT NULL,
    total_amount  DECIMAL(12,2),

    -- 외래키: customer_id는 customers 테이블의 id를 참조
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
\`\`\`

### 외래키 제약 조건 옵션

부모 레코드가 삭제/수정될 때 자식 레코드를 어떻게 처리할지 지정합니다.

| 옵션 | 부모 삭제 시 동작 | 사용 예시 |
|------|------------------|-----------|
| \`RESTRICT\` (기본값) | 자식이 있으면 삭제 거부 | 주문이 있는 고객 삭제 불가 |
| \`CASCADE\` | 자식도 함께 삭제 | 주문 삭제 시 주문항목도 삭제 |
| \`SET NULL\` | 자식의 FK를 NULL로 변경 | 카테고리 삭제 시 상품의 category_id = NULL |
| \`SET DEFAULT\` | 자식의 FK를 기본값으로 변경 | 잘 사용하지 않음 |

\`\`\`sql
-- CASCADE 예시: 주문 삭제 시 주문항목도 자동 삭제
CREATE TABLE order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER NOT NULL,
    product_id  INTEGER NOT NULL,
    quantity    INTEGER NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);
\`\`\`

---

## 테이블 관계 유형

### 1:1 관계 (One-to-One)

한 행이 다른 테이블의 **정확히 한 행**과만 연결됩니다.

\`\`\`sql
-- 예: 사용자 ↔ 사용자 프로필 (1:1)
users      → user_profiles
(id=1)       (user_id=1)
(id=2)       (user_id=2)
\`\`\`

사용 예: 테이블 분리 (자주 쓰는 열과 드물게 쓰는 열 분리)

### 1:N 관계 (One-to-Many) ★ 가장 흔함

한 행이 다른 테이블의 **여러 행**과 연결됩니다.

\`\`\`sql
-- 예: 고객 1명 → 주문 여러 개
customers (id=1 김철수) → orders (customer_id=1, 주문#101)
                        → orders (customer_id=1, 주문#102)
                        → orders (customer_id=1, 주문#103)
\`\`\`

"1" 쪽 테이블의 PK가 "N" 쪽 테이블에 FK로 들어갑니다.

### N:1 관계 (Many-to-One)

1:N 관계를 **반대 방향에서 본 것**입니다. 같은 관계이지만, **어느 테이블 관점에서 보느냐**에 따라 다르게 표현합니다.

\`\`\`sql
-- 1:N 관점 (고객 기준): 한 고객 → 여러 주문
SELECT * FROM customers c
JOIN orders o ON c.id = o.customer_id;

-- N:1 관점 (주문 기준): 여러 주문 → 한 고객
SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id;
\`\`\`

| 관점 | 관계 | 설명 |
|------|------|------|
| customers → orders | **1:N** | 고객 1명이 주문 여러 개를 가짐 |
| orders → customers | **N:1** | 주문 여러 개가 고객 1명에게 속함 |
| orders → products (via order_items) | **N:M** | 주문 하나에 상품 여러 개, 상품 하나에 주문 여러 개 |

> 실무에서 JOIN을 쓸 때 "이 테이블에서 저 테이블을 보는 방향"이 중요합니다. FK를 가진 쪽이 "N"(Many) 쪽입니다.

### N:M 관계 (Many-to-Many)

양쪽 모두 여러 행과 연결됩니다. **중간 테이블(Junction Table)**이 필요합니다.

\`\`\`sql
-- 예: 학생 ↔ 수업 (다대다)
-- 한 학생이 여러 수업을 듣고, 한 수업에 여러 학생이 있음

students ←→ enrollments ←→ courses
             (student_id,
              course_id)
\`\`\`

\`\`\`sql
-- N:M을 위한 중간 테이블
CREATE TABLE enrollments (
    student_id  INTEGER REFERENCES students(id),
    course_id   INTEGER REFERENCES courses(id),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id)  -- 복합키
);
\`\`\`

이 플랫폼의 \`order_items\` 테이블이 바로 \`orders\`와 \`products\` 사이의 N:M 관계를 풀어주는 중간 테이블입니다.

---

## 제약 조건 (Constraints)

데이터의 정확성과 일관성을 보장하는 규칙입니다.

| 제약 조건 | 설명 | 예시 |
|-----------|------|------|
| \`PRIMARY KEY\` | 기본키 (고유 + NOT NULL) | \`id SERIAL PRIMARY KEY\` |
| \`FOREIGN KEY\` | 외래키 (다른 테이블 참조) | \`REFERENCES customers(id)\` |
| \`NOT NULL\` | NULL 허용 안함 | \`name VARCHAR(100) NOT NULL\` |
| \`UNIQUE\` | 중복 값 허용 안함 | \`email VARCHAR(150) UNIQUE\` |
| \`CHECK\` | 조건을 만족해야 함 | \`CHECK (rating BETWEEN 1 AND 5)\` |
| \`DEFAULT\` | 기본값 설정 | \`is_premium BOOLEAN DEFAULT FALSE\` |

\`\`\`sql
CREATE TABLE reviews (
    id          SERIAL PRIMARY KEY,
    product_id  INTEGER NOT NULL REFERENCES products(id),
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

> 제약 조건은 잘못된 데이터가 입력되는 것을 **DB 레벨에서** 자동으로 방지합니다. 애플리케이션 코드에서 검증하더라도, DB 제약 조건은 반드시 설정해야 합니다.`,
          en: `## Schema

A schema is the **complete structural blueprint** of a database. It defines what tables exist, what columns each table has, and what relationships connect them.

### Schema Components

| Component | Description | Example |
|-----------|-------------|---------|
| **Table** | 2D structure storing data | customers, orders |
| **Column** | Data attribute (field) | name, email, price |
| **Row** | One data record | All info for one customer |
| **Constraint** | Data integrity rule | NOT NULL, UNIQUE, CHECK |
| **Relationship** | Connection between tables | Foreign key (FK) reference |

### Defining a Schema (DDL)

\`\`\`sql
CREATE TABLE customers (
    id       SERIAL PRIMARY KEY,          -- Primary key (auto increment)
    name     VARCHAR(100) NOT NULL,       -- Name (required)
    email    VARCHAR(150) UNIQUE NOT NULL, -- Email (unique, required)
    city     VARCHAR(50),                 -- City (optional)
    is_premium BOOLEAN DEFAULT FALSE      -- Premium (default: false)
);
\`\`\`

---

## Primary Key (PK)

A primary key is a column (or column combination) that **uniquely identifies each row** in a table. Every table must have a primary key.

### Primary Key Rules

| Rule | Description |
|------|-------------|
| **Unique** | No two rows can have the same PK value |
| **NOT NULL** | NULL values are not allowed |
| **Immutable** | PK values should never be changed once set |
| **Single PK** | Only one primary key per table |

### Types of Primary Keys

| Type | Description | Example | Pros/Cons |
|------|-------------|---------|-----------|
| **Surrogate** | Auto-generated meaningless number | \`id SERIAL\` or \`id INT GENERATED ALWAYS AS IDENTITY\` | Simple & stable, most commonly used |
| **Natural** | Value with real-world meaning | \`email\`, \`SSN\` | Intuitive but may change |
| **Composite** | Combination of 2+ columns | \`(order_id, product_id)\` | Used in many-to-many junction tables |

### Declaring Primary Keys

\`\`\`sql
-- Method 1: Inline with column definition
CREATE TABLE products (
    id    SERIAL PRIMARY KEY,
    name  VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Method 2: Table-level constraint
CREATE TABLE order_items (
    order_id   INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity   INTEGER NOT NULL,
    PRIMARY KEY (order_id, product_id)  -- Composite key
);
\`\`\`

> In practice, surrogate keys are almost always used. In PostgreSQL, \`GENERATED ALWAYS AS IDENTITY\` (SQL standard) is now recommended over \`SERIAL\` (PG 10+). Natural keys can cause problems when values change (e.g., email updates).

---

## Foreign Key (FK)

A foreign key is a column that **references the primary key of another table**. It creates relationships between tables and ensures **referential integrity**.

### Foreign Key Purpose

- Forms a **relationship** between two tables
- **Prevents** referencing non-existent values
- Example: \`orders.customer_id = 999\` but no customer with id=999 exists → Error!

### Declaring Foreign Keys

\`\`\`sql
CREATE TABLE orders (
    id            SERIAL PRIMARY KEY,
    customer_id   INTEGER NOT NULL,
    order_date    TIMESTAMP NOT NULL,
    total_amount  DECIMAL(12,2),

    -- FK: customer_id references customers table's id
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
\`\`\`

### Foreign Key Constraint Options

Specify what happens to child records when a parent record is deleted/updated.

| Option | Behavior on Parent Delete | Use Case |
|--------|--------------------------|----------|
| \`RESTRICT\` (default) | Reject if children exist | Can't delete customer with orders |
| \`CASCADE\` | Delete children too | Delete order → delete order items |
| \`SET NULL\` | Set child FK to NULL | Delete category → product.category_id = NULL |
| \`SET DEFAULT\` | Set child FK to default | Rarely used |

\`\`\`sql
-- CASCADE example: deleting an order auto-deletes its items
CREATE TABLE order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER NOT NULL,
    product_id  INTEGER NOT NULL,
    quantity    INTEGER NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);
\`\`\`

---

## Relationship Types

### 1:1 Relationship (One-to-One)

One row links to **exactly one** row in another table.

\`\`\`sql
-- Example: user ↔ user_profile (1:1)
users      → user_profiles
(id=1)       (user_id=1)
(id=2)       (user_id=2)
\`\`\`

Use case: Table splitting (separate frequently-used columns from rarely-used ones)

### 1:N Relationship (One-to-Many) ★ Most Common

One row links to **multiple** rows in another table.

\`\`\`sql
-- Example: 1 customer → many orders
customers (id=1 John) → orders (customer_id=1, order#101)
                       → orders (customer_id=1, order#102)
                       → orders (customer_id=1, order#103)
\`\`\`

The PK from the "1" side becomes the FK in the "N" side table.

### N:1 Relationship (Many-to-One)

This is a 1:N relationship **viewed from the opposite direction**. It's the same relationship, but expressed differently depending on **which table's perspective** you take.

\`\`\`sql
-- 1:N perspective (from customers): one customer → many orders
SELECT * FROM customers c
JOIN orders o ON c.id = o.customer_id;

-- N:1 perspective (from orders): many orders → one customer
SELECT * FROM orders o
JOIN customers c ON o.customer_id = c.id;
\`\`\`

| Perspective | Relationship | Description |
|-------------|-------------|-------------|
| customers → orders | **1:N** | One customer has many orders |
| orders → customers | **N:1** | Many orders belong to one customer |
| orders → products (via order_items) | **N:M** | One order has many products, one product in many orders |

> When writing JOINs, the "direction" matters. The table that holds the FK is the "N" (Many) side.

### N:M Relationship (Many-to-Many)

Both sides connect to multiple rows. Requires a **junction table**.

\`\`\`sql
-- Example: students ↔ courses (many-to-many)
-- One student takes multiple courses, one course has multiple students

students ←→ enrollments ←→ courses
             (student_id,
              course_id)
\`\`\`

\`\`\`sql
-- Junction table for N:M relationship
CREATE TABLE enrollments (
    student_id  INTEGER REFERENCES students(id),
    course_id   INTEGER REFERENCES courses(id),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, course_id)  -- Composite key
);
\`\`\`

In this platform, \`order_items\` is the junction table resolving the N:M relationship between \`orders\` and \`products\`.

---

## Constraints

Rules that ensure data accuracy and consistency.

| Constraint | Description | Example |
|------------|-------------|---------|
| \`PRIMARY KEY\` | Primary key (unique + NOT NULL) | \`id SERIAL PRIMARY KEY\` |
| \`FOREIGN KEY\` | Foreign key (references another table) | \`REFERENCES customers(id)\` |
| \`NOT NULL\` | Disallow NULL values | \`name VARCHAR(100) NOT NULL\` |
| \`UNIQUE\` | Disallow duplicate values | \`email VARCHAR(150) UNIQUE\` |
| \`CHECK\` | Must satisfy a condition | \`CHECK (rating BETWEEN 1 AND 5)\` |
| \`DEFAULT\` | Set default value | \`is_premium BOOLEAN DEFAULT FALSE\` |

\`\`\`sql
CREATE TABLE reviews (
    id          SERIAL PRIMARY KEY,
    product_id  INTEGER NOT NULL REFERENCES products(id),
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

> Constraints automatically **prevent bad data at the DB level**. Even if your application code validates input, DB constraints should always be in place.`,
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
| 7 | LIMIT | 행 수 제한 |

### 자주 사용하는 함수

\`\`\`sql
-- 문자열 함수
SELECT UPPER(name), LOWER(email), LENGTH(name)
FROM customers;

-- 숫자 함수
SELECT ROUND(price, 0), CEIL(price), FLOOR(price)
FROM products;

-- 날짜 함수 (PostgreSQL)
SELECT CURRENT_DATE, CURRENT_TIMESTAMP, NOW();
SELECT signup_date, AGE(signup_date) FROM customers;

-- NULL 처리
SELECT name, COALESCE(city, '미지정') AS city
FROM customers;
\`\`\`

| 함수 | 설명 | 예시 결과 |
|------|------|----------|
| UPPER(s) | 대문자 변환 | 'HELLO' |
| LOWER(s) | 소문자 변환 | 'hello' |
| LENGTH(s) | 문자열 길이 | 5 |
| TRIM(s) | 앞뒤 공백 제거 | 'hello' |
| ROUND(n, d) | 반올림 | 3.14 |
| COALESCE(a, b) | NULL이면 b 반환 | b |
| CAST(x AS type) | 타입 변환 | 변환된 값 |

### 실습 예제

\`\`\`sql
-- 예제 1: 모든 고객의 이름과 도시 조회
SELECT name, city FROM customers;

-- 예제 2: 가격을 만원 단위로 표시
SELECT name, price, ROUND(price / 10000, 0) AS "만원"
FROM products;

-- 예제 3: 도시가 없는 고객에게 '미지정' 표시
SELECT name, COALESCE(city, '미지정') AS city
FROM customers;
\`\`\``,
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
| 7 | LIMIT | Limit row count |

### Commonly Used Functions

\`\`\`sql
-- String functions
SELECT UPPER(name), LOWER(email), LENGTH(name)
FROM customers;

-- Numeric functions
SELECT ROUND(price, 0), CEIL(price), FLOOR(price)
FROM products;

-- Date functions (PostgreSQL)
SELECT CURRENT_DATE, CURRENT_TIMESTAMP, NOW();
SELECT signup_date, AGE(signup_date) FROM customers;

-- NULL handling
SELECT name, COALESCE(city, 'Unknown') AS city
FROM customers;
\`\`\`

| Function | Description | Example Result |
|----------|-------------|---------------|
| UPPER(s) | Uppercase | 'HELLO' |
| LOWER(s) | Lowercase | 'hello' |
| LENGTH(s) | String length | 5 |
| TRIM(s) | Remove whitespace | 'hello' |
| ROUND(n, d) | Round to d decimals | 3.14 |
| COALESCE(a, b) | Return b if a is NULL | b |
| CAST(x AS type) | Type conversion | converted value |

### Practice Examples

\`\`\`sql
-- Example 1: List all customer names and cities
SELECT name, city FROM customers;

-- Example 2: Show price in thousands
SELECT name, price, ROUND(price / 10000, 0) AS price_in_10k
FROM products;

-- Example 3: Show 'Unknown' for customers without a city
SELECT name, COALESCE(city, 'Unknown') AS city
FROM customers;
\`\`\``,
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

> **주의**: \`= NULL\`은 동작하지 않습니다. 반드시 \`IS NULL\`을 사용하세요.

### NOT (부정)

\`\`\`sql
-- NOT IN
SELECT * FROM customers
WHERE country NOT IN ('Korea', 'Japan');

-- NOT LIKE
SELECT * FROM products
WHERE name NOT LIKE '%Phone%';

-- NOT BETWEEN
SELECT * FROM products
WHERE price NOT BETWEEN 10000 AND 50000;

-- NOT EXISTS (중급에서 자세히)
SELECT * FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);
\`\`\`

### WHERE 조건 조합 실습

\`\`\`sql
-- 1) 한국 프리미엄 고객 중 서울에 사는 사람
SELECT * FROM customers
WHERE country = 'Korea'
  AND is_premium = true
  AND city = 'Seoul';

-- 2) 가격 5만~10만원이고 재고 10개 이상인 상품
SELECT name, price, stock_quantity
FROM products
WHERE price BETWEEN 50000 AND 100000
  AND stock_quantity >= 10;

-- 3) 배송완료 또는 취소된 최근 주문
SELECT * FROM orders
WHERE status IN ('delivered', 'cancelled')
ORDER BY order_date DESC;

-- 4) 이름에 'Pro'가 포함되거나 가격이 100만원 이상인 상품
SELECT name, price FROM products
WHERE name LIKE '%Pro%' OR price >= 1000000;
\`\`\``,
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

> **Note**: \`= NULL\` does not work. Always use \`IS NULL\`.

### NOT (Negation)

\`\`\`sql
-- NOT IN
SELECT * FROM customers
WHERE country NOT IN ('Korea', 'Japan');

-- NOT LIKE
SELECT * FROM products
WHERE name NOT LIKE '%Phone%';

-- NOT BETWEEN
SELECT * FROM products
WHERE price NOT BETWEEN 10000 AND 50000;

-- NOT EXISTS (more in Intermediate)
SELECT * FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);
\`\`\`

### WHERE Practice Examples

\`\`\`sql
-- 1) Premium customers from Korea in Seoul
SELECT * FROM customers
WHERE country = 'Korea'
  AND is_premium = true
  AND city = 'Seoul';

-- 2) Products priced 50k-100k with stock >= 10
SELECT name, price, stock_quantity
FROM products
WHERE price BETWEEN 50000 AND 100000
  AND stock_quantity >= 10;

-- 3) Recent delivered or cancelled orders
SELECT * FROM orders
WHERE status IN ('delivered', 'cancelled')
ORDER BY order_date DESC;

-- 4) Products with 'Pro' in name or price >= 1M
SELECT name, price FROM products
WHERE name LIKE '%Pro%' OR price >= 1000000;
\`\`\``,
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

> MySQL 8.0+에서도 \`ORDER BY column IS NULL, column\` 패턴으로 NULL 위치를 제어할 수 있습니다.

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
\`\`\`

### FETCH FIRST (SQL 표준)

\`LIMIT\`은 PostgreSQL/MySQL 확장이고, SQL 표준은 \`FETCH FIRST\`입니다 (PG, MySQL 8.0+ 모두 지원):

\`\`\`sql
-- LIMIT 10과 동일
SELECT * FROM products
ORDER BY price DESC
FETCH FIRST 10 ROWS ONLY;

-- OFFSET과 함께 사용
SELECT * FROM products
ORDER BY price DESC
OFFSET 10 ROWS FETCH NEXT 10 ROWS ONLY;
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

> In MySQL 8.0+, use \`ORDER BY column IS NULL, column\` pattern to control NULL position.

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
\`\`\`

### FETCH FIRST (SQL Standard)

\`LIMIT\` is a PostgreSQL/MySQL extension. The SQL standard uses \`FETCH FIRST\` (supported by both PG and MySQL 8.0+):

\`\`\`sql
-- Same as LIMIT 10
SELECT * FROM products
ORDER BY price DESC
FETCH FIRST 10 ROWS ONLY;

-- With OFFSET
SELECT * FROM products
ORDER BY price DESC
OFFSET 10 ROWS FETCH NEXT 10 ROWS ONLY;
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
\`\`\`

### GROUP BY 주의사항

\`\`\`sql
-- 틀린 예: city가 GROUP BY에 없음
SELECT country, city, COUNT(*)
FROM customers
GROUP BY country;  -- 에러!

-- 올바른 예
SELECT country, city, COUNT(*)
FROM customers
GROUP BY country, city;
\`\`\`

### 실습 예제

\`\`\`sql
-- 1) 전체 상품 수와 평균 가격
SELECT COUNT(*) AS total_products,
  ROUND(AVG(price), 0) AS avg_price,
  MIN(price) AS cheapest,
  MAX(price) AS most_expensive
FROM products;

-- 2) 나라별 고객 수 (5명 이상만)
SELECT country, COUNT(*) AS cnt
FROM customers
GROUP BY country
HAVING COUNT(*) >= 5
ORDER BY cnt DESC;

-- 3) 상품별 평균 리뷰 점수
SELECT p.name,
  COUNT(r.id) AS review_count,
  ROUND(AVG(r.rating), 1) AS avg_rating
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name
ORDER BY avg_rating DESC;

-- 4) 월별 주문 건수와 매출
SELECT DATE_TRUNC('month', order_date) AS month,
  COUNT(*) AS orders,
  SUM(total_amount) AS revenue
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;
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
\`\`\`

### GROUP BY Pitfalls

\`\`\`sql
-- Wrong: city is not in GROUP BY
SELECT country, city, COUNT(*)
FROM customers
GROUP BY country;  -- Error!

-- Correct
SELECT country, city, COUNT(*)
FROM customers
GROUP BY country, city;
\`\`\`

### Practice Examples

\`\`\`sql
-- 1) Total products, average price
SELECT COUNT(*) AS total_products,
  ROUND(AVG(price), 0) AS avg_price,
  MIN(price) AS cheapest,
  MAX(price) AS most_expensive
FROM products;

-- 2) Countries with 5+ customers
SELECT country, COUNT(*) AS cnt
FROM customers
GROUP BY country
HAVING COUNT(*) >= 5
ORDER BY cnt DESC;

-- 3) Average rating per product
SELECT p.name,
  COUNT(r.id) AS review_count,
  ROUND(AVG(r.rating), 1) AS avg_rating
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name
ORDER BY avg_rating DESC;

-- 4) Monthly order count and revenue
SELECT DATE_TRUNC('month', order_date) AS month,
  COUNT(*) AS orders,
  SUM(total_amount) AS revenue
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;
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
| NTILE(n) | n개 그룹으로 균등 분할 |
| SUM() OVER | 누적/이동 합계 |
| AVG() OVER | 누적/이동 평균 |
| LAG(col, n) | n행 이전 값 |
| LEAD(col, n) | n행 이후 값 |
| FIRST_VALUE() | 윈도우 내 첫 값 |
| LAST_VALUE() | 윈도우 내 마지막 값 |
| PERCENT_RANK() | 백분위 순위 (0~1) |
| CUME_DIST() | 누적 분포 (0~1) |

### NTILE (균등 분할)

\`\`\`sql
-- 가격을 4분위로 나누기
SELECT name, price,
  NTILE(4) OVER (ORDER BY price) AS quartile
FROM products;
\`\`\`

### Named WINDOW 절

같은 윈도우 정의를 반복할 때 이름을 부여합니다:

\`\`\`sql
SELECT name, price,
  RANK() OVER w AS ranking,
  DENSE_RANK() OVER w AS dense_ranking,
  NTILE(4) OVER w AS quartile
FROM products
WINDOW w AS (ORDER BY price DESC);
\`\`\`

> Named WINDOW는 PostgreSQL과 MySQL 8.0+ 모두 지원합니다.`,
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
| NTILE(n) | Divide into n equal groups |
| SUM() OVER | Running/moving sum |
| AVG() OVER | Running/moving average |
| LAG(col, n) | Value n rows before |
| LEAD(col, n) | Value n rows after |
| FIRST_VALUE() | First value in window |
| LAST_VALUE() | Last value in window |
| PERCENT_RANK() | Percentile rank (0~1) |
| CUME_DIST() | Cumulative distribution (0~1) |

### NTILE (Equal Distribution)

\`\`\`sql
-- Divide prices into quartiles
SELECT name, price,
  NTILE(4) OVER (ORDER BY price) AS quartile
FROM products;
\`\`\`

### Named WINDOW Clause

Name a window definition when reusing it multiple times:

\`\`\`sql
SELECT name, price,
  RANK() OVER w AS ranking,
  DENSE_RANK() OVER w AS dense_ranking,
  NTILE(4) OVER w AS quartile
FROM products
WINDOW w AS (ORDER BY price DESC);
\`\`\`

> Named WINDOW is supported by both PostgreSQL and MySQL 8.0+.`,
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

> PostgreSQL과 MySQL 모두 재귀 CTE에서 \`WITH RECURSIVE\` 키워드가 필수입니다. 비재귀 CTE는 \`WITH\`만 사용합니다. SQL 표준에서도 재귀 시 \`RECURSIVE\`를 명시하도록 정의합니다.`,
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

> Both PostgreSQL and MySQL require the \`WITH RECURSIVE\` keyword for recursive CTEs. Non-recursive CTEs use just \`WITH\`. The SQL standard also mandates \`RECURSIVE\` for self-referencing CTEs.`,
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

### CREATE OR REPLACE VIEW

뷰 정의를 수정합니다. 뷰가 없으면 새로 생성합니다.

\`\`\`sql
CREATE OR REPLACE VIEW product_summary AS
SELECT p.id, p.name, c.name AS category, p.price,
  COUNT(r.id) AS review_count,
  COALESCE(AVG(r.rating), 0) AS avg_rating
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name, c.name, p.price;

-- 뷰 삭제
DROP VIEW IF EXISTS product_summary;
\`\`\`

### 업데이터블 뷰 (Updatable View)

단순한 뷰는 INSERT, UPDATE, DELETE가 가능합니다.

\`\`\`sql
CREATE VIEW premium_customers AS
SELECT id, name, email, city FROM customers
WHERE is_premium = true;

-- 뷰를 통해 데이터 수정
UPDATE premium_customers SET city = 'Seoul' WHERE id = 5;
\`\`\`

> **조건**: GROUP BY, HAVING, DISTINCT, UNION, JOIN, 집계 함수가 없는 단순 뷰만 업데이트 가능합니다.

### WITH CHECK OPTION

뷰의 조건을 벗어나는 데이터 변경을 방지합니다.

\`\`\`sql
CREATE VIEW korean_customers AS
SELECT * FROM customers WHERE country = 'Korea'
WITH CHECK OPTION;

-- 성공: country = 'Korea' 조건 충족
INSERT INTO korean_customers (name, email, country)
VALUES ('김철수', 'kim@test.com', 'Korea');

-- 실패: WITH CHECK OPTION 위반
INSERT INTO korean_customers (name, email, country)
VALUES ('John', 'john@test.com', 'USA');
\`\`\`

### MATERIALIZED VIEW 동시 갱신 (PostgreSQL)

\`\`\`sql
-- CONCURRENTLY: 읽기 잠금 없이 갱신 (유니크 인덱스 필요)
CREATE UNIQUE INDEX idx_monthly_sales ON monthly_sales(month);
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales;
\`\`\`

> MySQL은 Materialized View를 기본 지원하지 않습니다. 일반 테이블 + 트리거 또는 이벤트 스케줄러로 유사하게 구현합니다.

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

### INTERSECT / EXCEPT

\`\`\`sql
-- INTERSECT: 교집합 (양쪽 모두에 있는 행)
SELECT customer_id FROM orders
INTERSECT
SELECT customer_id FROM reviews;

-- EXCEPT: 차집합 (첫 번째에만 있는 행)
SELECT customer_id FROM orders
EXCEPT
SELECT customer_id FROM reviews;
\`\`\`

> MySQL 8.0.31+에서 INTERSECT / EXCEPT를 지원합니다. PostgreSQL은 오래전부터 지원합니다.

## ALTER TABLE

\`\`\`sql
-- 열 추가
ALTER TABLE products ADD COLUMN discount_rate DECIMAL(5,2);

-- 열 타입 변경 (PostgreSQL)
ALTER TABLE products ALTER COLUMN name TYPE VARCHAR(300);

-- 열 타입 변경 (MySQL)
-- ALTER TABLE products MODIFY COLUMN name VARCHAR(300);

-- 열 삭제
ALTER TABLE products DROP COLUMN discount_rate;

-- 제약 조건 추가
ALTER TABLE products ADD CONSTRAINT price_positive CHECK (price > 0);
\`\`\`

| 작업 | PostgreSQL | MySQL |
|------|-----------|-------|
| 열 타입 변경 | \`ALTER COLUMN col TYPE new_type\` | \`MODIFY COLUMN col new_type\` |
| 열 이름 변경 | \`RENAME COLUMN old TO new\` | \`RENAME COLUMN old TO new\` (8.0+) |
| 기본값 설정 | \`ALTER COLUMN col SET DEFAULT val\` | \`ALTER COLUMN col SET DEFAULT val\` |

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

### CREATE OR REPLACE VIEW

Modify a view definition, or create it if it doesn't exist.

\`\`\`sql
CREATE OR REPLACE VIEW product_summary AS
SELECT p.id, p.name, c.name AS category, p.price,
  COUNT(r.id) AS review_count,
  COALESCE(AVG(r.rating), 0) AS avg_rating
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name, c.name, p.price;

-- Drop a view
DROP VIEW IF EXISTS product_summary;
\`\`\`

### Updatable Views

Simple views support INSERT, UPDATE, and DELETE.

\`\`\`sql
CREATE VIEW premium_customers AS
SELECT id, name, email, city FROM customers
WHERE is_premium = true;

-- Modify data through the view
UPDATE premium_customers SET city = 'Seoul' WHERE id = 5;
\`\`\`

> **Requirement**: Only simple views without GROUP BY, HAVING, DISTINCT, UNION, JOIN, or aggregate functions are updatable.

### WITH CHECK OPTION

Prevents data changes that violate the view's filter condition.

\`\`\`sql
CREATE VIEW korean_customers AS
SELECT * FROM customers WHERE country = 'Korea'
WITH CHECK OPTION;

-- Success: meets country = 'Korea' condition
INSERT INTO korean_customers (name, email, country)
VALUES ('Kim', 'kim@test.com', 'Korea');

-- Fails: violates WITH CHECK OPTION
INSERT INTO korean_customers (name, email, country)
VALUES ('John', 'john@test.com', 'USA');
\`\`\`

### Concurrent MATERIALIZED VIEW Refresh (PostgreSQL)

\`\`\`sql
-- CONCURRENTLY: refresh without blocking reads (requires unique index)
CREATE UNIQUE INDEX idx_monthly_sales ON monthly_sales(month);
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales;
\`\`\`

> MySQL does not natively support Materialized Views. Similar functionality can be achieved using regular tables with triggers or the event scheduler.

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

### INTERSECT / EXCEPT

\`\`\`sql
-- INTERSECT: rows present in both queries
SELECT customer_id FROM orders
INTERSECT
SELECT customer_id FROM reviews;

-- EXCEPT: rows in first query but not in second
SELECT customer_id FROM orders
EXCEPT
SELECT customer_id FROM reviews;
\`\`\`

> MySQL supports INTERSECT / EXCEPT since 8.0.31+. PostgreSQL has supported them for a long time.

## ALTER TABLE

\`\`\`sql
-- Add column
ALTER TABLE products ADD COLUMN discount_rate DECIMAL(5,2);

-- Change column type (PostgreSQL)
ALTER TABLE products ALTER COLUMN name TYPE VARCHAR(300);

-- Change column type (MySQL)
-- ALTER TABLE products MODIFY COLUMN name VARCHAR(300);

-- Drop column
ALTER TABLE products DROP COLUMN discount_rate;

-- Add constraint
ALTER TABLE products ADD CONSTRAINT price_positive CHECK (price > 0);
\`\`\`

| Operation | PostgreSQL | MySQL |
|-----------|-----------|-------|
| Change type | \`ALTER COLUMN col TYPE new_type\` | \`MODIFY COLUMN col new_type\` |
| Rename column | \`RENAME COLUMN old TO new\` | \`RENAME COLUMN old TO new\` (8.0+) |
| Set default | \`ALTER COLUMN col SET DEFAULT val\` | \`ALTER COLUMN col SET DEFAULT val\` |

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

### 인덱스 유형 (PostgreSQL)

| 유형 | 용도 | 예시 |
|------|------|------|
| **B-tree** (기본) | 일반적인 비교 연산 (=, <, >, BETWEEN) | \`CREATE INDEX idx ON t(col)\` |
| **GIN** | 배열, JSONB, 전문 검색 | \`CREATE INDEX idx ON t USING GIN(col)\` |
| **GiST** | 공간 데이터, 범위 타입 | \`CREATE INDEX idx ON t USING GiST(col)\` |
| **BRIN** | 물리적으로 정렬된 대용량 테이블 | \`CREATE INDEX idx ON t USING BRIN(col)\` |

### 부분 인덱스 / 커버링 인덱스

\`\`\`sql
-- 부분 인덱스: 특정 조건의 행만 인덱싱
CREATE INDEX idx_active_orders ON orders(customer_id)
WHERE status IN ('pending', 'processing');

-- 커버링 인덱스 (PostgreSQL): INCLUDE로 추가 열 포함
CREATE INDEX idx_orders_cover ON orders(customer_id)
INCLUDE (order_date, total_amount);
\`\`\`

### MySQL 인덱스 특이사항

\`\`\`sql
-- FULLTEXT 인덱스 (전문 검색)
CREATE FULLTEXT INDEX idx_product_name ON products(name);
SELECT * FROM products WHERE MATCH(name) AGAINST('wireless');
\`\`\`

### 인덱스 주의사항

- INSERT/UPDATE/DELETE 성능이 약간 저하됨
- 저장 공간을 추가로 사용
- 작은 테이블에는 효과 미미
- 사용되지 않는 인덱스는 정기적으로 정리해야 함

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

### Index Types (PostgreSQL)

| Type | Use Case | Example |
|------|----------|---------|
| **B-tree** (default) | General comparisons (=, <, >, BETWEEN) | \`CREATE INDEX idx ON t(col)\` |
| **GIN** | Arrays, JSONB, full-text search | \`CREATE INDEX idx ON t USING GIN(col)\` |
| **GiST** | Spatial data, range types | \`CREATE INDEX idx ON t USING GiST(col)\` |
| **BRIN** | Physically sorted large tables | \`CREATE INDEX idx ON t USING BRIN(col)\` |

### Partial / Covering Indexes

\`\`\`sql
-- Partial index: only index rows matching a condition
CREATE INDEX idx_active_orders ON orders(customer_id)
WHERE status IN ('pending', 'processing');

-- Covering index (PostgreSQL): INCLUDE extra columns
CREATE INDEX idx_orders_cover ON orders(customer_id)
INCLUDE (order_date, total_amount);
\`\`\`

### MySQL Index Notes

\`\`\`sql
-- FULLTEXT index (full-text search)
CREATE FULLTEXT INDEX idx_product_name ON products(name);
SELECT * FROM products WHERE MATCH(name) AGAINST('wireless');
\`\`\`

### Index Considerations

- Slightly slows INSERT/UPDATE/DELETE
- Uses additional storage
- Minimal effect on small tables
- Unused indexes should be regularly cleaned up

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

### SAVEPOINT

트랜잭션 내에서 중간 지점을 설정하여 부분 롤백할 수 있습니다.

\`\`\`sql
BEGIN;
  INSERT INTO orders (...) VALUES (...);
  SAVEPOINT before_items;
  INSERT INTO order_items (...) VALUES (...);
  -- 항목 삽입에 문제가 있으면 항목만 롤백
  ROLLBACK TO SAVEPOINT before_items;
  -- 주문은 유지하면서 다시 시도
  INSERT INTO order_items (...) VALUES (...);
COMMIT;
\`\`\`

### 격리 수준 (Isolation Level)

| 격리 수준 | Dirty Read | Non-Repeatable Read | Phantom Read | 설명 |
|-----------|-----------|-------------------|-------------|------|
| READ UNCOMMITTED | 가능 | 가능 | 가능 | 커밋되지 않은 데이터도 읽음 (PG에서는 READ COMMITTED로 동작) |
| READ COMMITTED | 방지 | 가능 | 가능 | 커밋된 데이터만 읽음 (**PG 기본값**) |
| REPEATABLE READ | 방지 | 방지 | 가능 | 트랜잭션 내 같은 쿼리는 같은 결과 (**MySQL 기본값**) |
| SERIALIZABLE | 방지 | 방지 | 방지 | 완전 직렬화 (가장 느림) |

\`\`\`sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;
  -- 이 트랜잭션 내에서는 다른 트랜잭션의 커밋이 보이지 않음
  SELECT * FROM products WHERE id = 1;
COMMIT;
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

-- MySQL (8.0.19+, 권장): AS 별칭 사용
INSERT INTO products (id, name, price)
VALUES (1, 'Updated Product', 55000)
AS new_row
ON DUPLICATE KEY UPDATE
name = new_row.name, price = new_row.price;

-- MySQL (레거시): VALUES() 함수 (향후 제거 예정, deprecated)
-- INSERT INTO products (...) VALUES (...)
-- ON DUPLICATE KEY UPDATE name = VALUES(name);
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

### SAVEPOINT

Set intermediate points within a transaction for partial rollback.

\`\`\`sql
BEGIN;
  INSERT INTO orders (...) VALUES (...);
  SAVEPOINT before_items;
  INSERT INTO order_items (...) VALUES (...);
  -- Problem with items? Roll back only items
  ROLLBACK TO SAVEPOINT before_items;
  -- Order is preserved, retry items
  INSERT INTO order_items (...) VALUES (...);
COMMIT;
\`\`\`

### Isolation Levels

| Level | Dirty Read | Non-Repeatable Read | Phantom Read | Notes |
|-------|-----------|-------------------|-------------|-------|
| READ UNCOMMITTED | Possible | Possible | Possible | Reads uncommitted data (PG treats as READ COMMITTED) |
| READ COMMITTED | Prevented | Possible | Possible | Only reads committed data (**PG default**) |
| REPEATABLE READ | Prevented | Prevented | Possible | Same query returns same results within txn (**MySQL default**) |
| SERIALIZABLE | Prevented | Prevented | Prevented | Full serialization (slowest) |

\`\`\`sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;
  -- Other transactions' commits are not visible within this txn
  SELECT * FROM products WHERE id = 1;
COMMIT;
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

-- MySQL (8.0.19+, recommended): AS alias syntax
INSERT INTO products (id, name, price)
VALUES (1, 'Updated Product', 55000)
AS new_row
ON DUPLICATE KEY UPDATE
name = new_row.name, price = new_row.price;

-- MySQL (legacy): VALUES() function (deprecated, will be removed)
-- INSERT INTO products (...) VALUES (...)
-- ON DUPLICATE KEY UPDATE name = VALUES(name);
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

### IDENTITY 열 (SQL 표준, PG 10+)

\`SERIAL\`은 PostgreSQL 고유 문법이고, SQL 표준은 \`GENERATED AS IDENTITY\`입니다:

\`\`\`sql
-- GENERATED ALWAYS: 수동 값 삽입 차단 (더 안전)
CREATE TABLE products (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(200) NOT NULL
);

-- GENERATED BY DEFAULT: 수동 값 삽입 허용 (SERIAL과 유사)
CREATE TABLE logs (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  message TEXT
);
\`\`\`

| 비교 | SERIAL | GENERATED AS IDENTITY |
|------|--------|----------------------|
| SQL 표준 | PostgreSQL 전용 | SQL:2003 표준 |
| 수동 삽입 방지 | 불가 | ALWAYS 옵션으로 가능 |
| pg_dump 호환 | 시퀀스와 분리됨 | 열에 통합됨 |
| 권장 | 레거시 | **신규 프로젝트 권장** |

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

### IDENTITY Columns (SQL Standard, PG 10+)

\`SERIAL\` is PostgreSQL-specific. The SQL standard uses \`GENERATED AS IDENTITY\`:

\`\`\`sql
-- GENERATED ALWAYS: blocks manual value insertion (safer)
CREATE TABLE products (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(200) NOT NULL
);

-- GENERATED BY DEFAULT: allows manual values (similar to SERIAL)
CREATE TABLE logs (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  message TEXT
);
\`\`\`

| Comparison | SERIAL | GENERATED AS IDENTITY |
|-----------|--------|----------------------|
| SQL Standard | PostgreSQL-only | SQL:2003 standard |
| Block manual insert | No | Yes (with ALWAYS) |
| pg_dump compat | Sequence is separate | Integrated with column |
| Recommended | Legacy | **Recommended for new projects** |

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
      {
        id: 'functions-procedures',
        title: { ko: '함수와 프로시저', en: 'Functions & Stored Procedures' },
        level: 'expert',
        content: {
          ko: `## 함수 (Function)

입력을 받아 결과를 반환하는 저장된 코드 블록입니다. SELECT 문 안에서 호출할 수 있습니다.

### PostgreSQL 함수 (PL/pgSQL)

\`\`\`sql
-- 기본 함수: 할인 가격 계산
CREATE OR REPLACE FUNCTION calc_discount_price(
  original_price DECIMAL,
  discount_rate DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  RETURN original_price * (1 - discount_rate / 100);
END;
$$ LANGUAGE plpgsql;

-- 함수 호출
SELECT name, price, calc_discount_price(price, 10) AS discounted
FROM products WHERE price > 50000;
\`\`\`

### MySQL 함수

\`\`\`sql
CREATE FUNCTION calc_discount_price(
  original_price DECIMAL(10,2),
  discount_rate DECIMAL(5,2)
) RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
  RETURN original_price * (1 - discount_rate / 100);
END;

-- 함수 호출
SELECT name, price, calc_discount_price(price, 10) AS discounted
FROM products WHERE price > 50000;
\`\`\`

> MySQL에서 함수 생성 시 \`DETERMINISTIC\` (같은 입력 → 같은 결과) 또는 \`NOT DETERMINISTIC\`을 명시해야 합니다.

### 테이블 반환 함수 (PostgreSQL)

\`\`\`sql
-- RETURNS TABLE: 여러 행을 반환
CREATE OR REPLACE FUNCTION get_top_products(min_rating DECIMAL)
RETURNS TABLE (
  product_name VARCHAR,
  avg_rating DECIMAL,
  review_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.name, AVG(r.rating), COUNT(r.id)
  FROM products p
  JOIN reviews r ON p.id = r.product_id
  GROUP BY p.name
  HAVING AVG(r.rating) >= min_rating
  ORDER BY AVG(r.rating) DESC;
END;
$$ LANGUAGE plpgsql;

-- 테이블처럼 사용
SELECT * FROM get_top_products(4.0);
\`\`\`

### SQL 함수 (PostgreSQL)

단순한 경우 PL/pgSQL 대신 SQL 언어로 작성할 수 있습니다.

\`\`\`sql
CREATE OR REPLACE FUNCTION get_customer_order_count(cust_id INTEGER)
RETURNS BIGINT AS $$
  SELECT COUNT(*) FROM orders WHERE customer_id = cust_id;
$$ LANGUAGE sql STABLE;
\`\`\`

> \`STABLE\`: 같은 트랜잭션 내에서 같은 결과를 보장. \`IMMUTABLE\`: 항상 같은 결과 (인덱스에 사용 가능). \`VOLATILE\` (기본값): 매번 결과가 다를 수 있음.

## 프로시저 (Stored Procedure)

함수와 유사하지만 **값을 반환하지 않으며**, 트랜잭션 제어(COMMIT/ROLLBACK)가 가능합니다.

### PostgreSQL 프로시저 (PG 11+)

\`\`\`sql
CREATE OR REPLACE PROCEDURE transfer_funds(
  sender_id INTEGER,
  receiver_id INTEGER,
  amount DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- 잔액 차감
  UPDATE accounts SET balance = balance - amount
  WHERE id = sender_id;

  -- 잔액 부족 확인
  IF NOT FOUND OR (SELECT balance FROM accounts WHERE id = sender_id) < 0 THEN
    ROLLBACK;
    RAISE EXCEPTION '잔액이 부족합니다';
  END IF;

  -- 잔액 추가
  UPDATE accounts SET balance = balance + amount
  WHERE id = receiver_id;

  COMMIT;
END;
$$;

-- 프로시저 호출
CALL transfer_funds(1, 2, 50000);
\`\`\`

### MySQL 프로시저

\`\`\`sql
DELIMITER //
CREATE PROCEDURE transfer_funds(
  IN sender_id INT,
  IN receiver_id INT,
  IN amount DECIMAL(10,2)
)
BEGIN
  DECLARE sender_balance DECIMAL(10,2);

  START TRANSACTION;

  SELECT balance INTO sender_balance
  FROM accounts WHERE id = sender_id FOR UPDATE;

  IF sender_balance < amount THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient balance';
  ELSE
    UPDATE accounts SET balance = balance - amount WHERE id = sender_id;
    UPDATE accounts SET balance = balance + amount WHERE id = receiver_id;
    COMMIT;
  END IF;
END //
DELIMITER ;

-- 프로시저 호출
CALL transfer_funds(1, 2, 50000);
\`\`\`

### 매개변수 모드

| 모드 | 설명 | PostgreSQL | MySQL |
|------|------|-----------|-------|
| **IN** | 입력 전용 (기본값) | ✅ | ✅ |
| **OUT** | 출력 전용 | ✅ | ✅ |
| **INOUT** | 입출력 겸용 | ✅ | ✅ |
| **VARIADIC** | 가변 인자 | ✅ | ✗ |

\`\`\`sql
-- PostgreSQL: OUT 매개변수
CREATE OR REPLACE FUNCTION get_order_stats(
  cust_id INTEGER,
  OUT total_orders BIGINT,
  OUT total_amount DECIMAL
) AS $$
BEGIN
  SELECT COUNT(*), COALESCE(SUM(total_amount), 0)
  INTO total_orders, total_amount
  FROM orders WHERE customer_id = cust_id;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_order_stats(1);

-- MySQL: OUT 매개변수
DELIMITER //
CREATE PROCEDURE get_order_stats(
  IN cust_id INT,
  OUT total_orders INT,
  OUT total_amount DECIMAL(10,2)
)
BEGIN
  SELECT COUNT(*), COALESCE(SUM(total_amount), 0)
  INTO total_orders, total_amount
  FROM orders WHERE customer_id = cust_id;
END //
DELIMITER ;

CALL get_order_stats(1, @orders, @amount);
SELECT @orders, @amount;
\`\`\`

## 함수 vs 프로시저

| 비교 | 함수 (Function) | 프로시저 (Procedure) |
|------|----------------|---------------------|
| 반환값 | 반드시 값 반환 (RETURNS) | 반환값 없음 (OUT 매개변수로 대체) |
| SQL 내 호출 | SELECT, WHERE 등에서 사용 가능 | CALL로만 호출 |
| 트랜잭션 제어 | 불가 (PG), 불가 (MySQL) | COMMIT/ROLLBACK 가능 |
| 용도 | 계산, 데이터 변환, 조회 | 비즈니스 로직, 배치 작업 |

### 함수/프로시저 관리

\`\`\`sql
-- 함수 삭제
DROP FUNCTION IF EXISTS calc_discount_price(DECIMAL, DECIMAL);

-- 프로시저 삭제
DROP PROCEDURE IF EXISTS transfer_funds;

-- PostgreSQL: 함수 목록 조회
SELECT routine_name, routine_type, data_type
FROM information_schema.routines
WHERE routine_schema = 'public';

-- MySQL: 프로시저/함수 목록 조회
SHOW PROCEDURE STATUS WHERE Db = 'your_database';
SHOW FUNCTION STATUS WHERE Db = 'your_database';
\`\`\`

### 제어문 (PL/pgSQL / MySQL)

\`\`\`sql
-- IF / ELSIF / ELSE
IF amount > 100000 THEN
  discount := 0.15;
ELSIF amount > 50000 THEN
  discount := 0.10;
ELSE
  discount := 0.05;
END IF;

-- LOOP (PostgreSQL)
LOOP
  EXIT WHEN counter > 10;
  counter := counter + 1;
END LOOP;

-- WHILE (MySQL)
WHILE counter <= 10 DO
  SET counter = counter + 1;
END WHILE;

-- FOR (PostgreSQL)
FOR i IN 1..10 LOOP
  RAISE NOTICE 'Count: %', i;
END LOOP;

-- CURSOR (PostgreSQL)
DECLARE
  cur CURSOR FOR SELECT * FROM products WHERE price > 100000;
  rec RECORD;
BEGIN
  OPEN cur;
  LOOP
    FETCH cur INTO rec;
    EXIT WHEN NOT FOUND;
    RAISE NOTICE 'Product: %', rec.name;
  END LOOP;
  CLOSE cur;
END;
\`\`\`

> MySQL에서는 \`DELIMITER //\`로 구분자를 변경한 후 프로시저/함수를 작성하고, 마지막에 \`DELIMITER ;\`로 복원합니다. 이는 본문 내 세미콜론과 문장 종결자를 구분하기 위함입니다.`,
          en: `## Functions

Stored code blocks that accept input and return results. Can be called within SELECT statements.

### PostgreSQL Functions (PL/pgSQL)

\`\`\`sql
-- Basic function: calculate discount price
CREATE OR REPLACE FUNCTION calc_discount_price(
  original_price DECIMAL,
  discount_rate DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
  RETURN original_price * (1 - discount_rate / 100);
END;
$$ LANGUAGE plpgsql;

-- Call the function
SELECT name, price, calc_discount_price(price, 10) AS discounted
FROM products WHERE price > 50000;
\`\`\`

### MySQL Functions

\`\`\`sql
CREATE FUNCTION calc_discount_price(
  original_price DECIMAL(10,2),
  discount_rate DECIMAL(5,2)
) RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
  RETURN original_price * (1 - discount_rate / 100);
END;

-- Call the function
SELECT name, price, calc_discount_price(price, 10) AS discounted
FROM products WHERE price > 50000;
\`\`\`

> In MySQL, you must specify \`DETERMINISTIC\` (same input → same result) or \`NOT DETERMINISTIC\` when creating functions.

### Table-Returning Functions (PostgreSQL)

\`\`\`sql
-- RETURNS TABLE: return multiple rows
CREATE OR REPLACE FUNCTION get_top_products(min_rating DECIMAL)
RETURNS TABLE (
  product_name VARCHAR,
  avg_rating DECIMAL,
  review_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.name, AVG(r.rating), COUNT(r.id)
  FROM products p
  JOIN reviews r ON p.id = r.product_id
  GROUP BY p.name
  HAVING AVG(r.rating) >= min_rating
  ORDER BY AVG(r.rating) DESC;
END;
$$ LANGUAGE plpgsql;

-- Use like a table
SELECT * FROM get_top_products(4.0);
\`\`\`

### SQL Functions (PostgreSQL)

For simple cases, you can use SQL language instead of PL/pgSQL.

\`\`\`sql
CREATE OR REPLACE FUNCTION get_customer_order_count(cust_id INTEGER)
RETURNS BIGINT AS $$
  SELECT COUNT(*) FROM orders WHERE customer_id = cust_id;
$$ LANGUAGE sql STABLE;
\`\`\`

> \`STABLE\`: guarantees same result within a transaction. \`IMMUTABLE\`: always same result (can be used in indexes). \`VOLATILE\` (default): result may vary each call.

## Stored Procedures

Similar to functions but **do not return a value** and can control transactions (COMMIT/ROLLBACK).

### PostgreSQL Procedures (PG 11+)

\`\`\`sql
CREATE OR REPLACE PROCEDURE transfer_funds(
  sender_id INTEGER,
  receiver_id INTEGER,
  amount DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Deduct balance
  UPDATE accounts SET balance = balance - amount
  WHERE id = sender_id;

  -- Check sufficient balance
  IF NOT FOUND OR (SELECT balance FROM accounts WHERE id = sender_id) < 0 THEN
    ROLLBACK;
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Add balance
  UPDATE accounts SET balance = balance + amount
  WHERE id = receiver_id;

  COMMIT;
END;
$$;

-- Call the procedure
CALL transfer_funds(1, 2, 50000);
\`\`\`

### MySQL Procedures

\`\`\`sql
DELIMITER //
CREATE PROCEDURE transfer_funds(
  IN sender_id INT,
  IN receiver_id INT,
  IN amount DECIMAL(10,2)
)
BEGIN
  DECLARE sender_balance DECIMAL(10,2);

  START TRANSACTION;

  SELECT balance INTO sender_balance
  FROM accounts WHERE id = sender_id FOR UPDATE;

  IF sender_balance < amount THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient balance';
  ELSE
    UPDATE accounts SET balance = balance - amount WHERE id = sender_id;
    UPDATE accounts SET balance = balance + amount WHERE id = receiver_id;
    COMMIT;
  END IF;
END //
DELIMITER ;

-- Call the procedure
CALL transfer_funds(1, 2, 50000);
\`\`\`

### Parameter Modes

| Mode | Description | PostgreSQL | MySQL |
|------|------------|-----------|-------|
| **IN** | Input only (default) | \\u2705 | \\u2705 |
| **OUT** | Output only | \\u2705 | \\u2705 |
| **INOUT** | Input and output | \\u2705 | \\u2705 |
| **VARIADIC** | Variable arguments | \\u2705 | \\u2717 |

\`\`\`sql
-- PostgreSQL: OUT parameters
CREATE OR REPLACE FUNCTION get_order_stats(
  cust_id INTEGER,
  OUT total_orders BIGINT,
  OUT total_amount DECIMAL
) AS $$
BEGIN
  SELECT COUNT(*), COALESCE(SUM(total_amount), 0)
  INTO total_orders, total_amount
  FROM orders WHERE customer_id = cust_id;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM get_order_stats(1);

-- MySQL: OUT parameters
DELIMITER //
CREATE PROCEDURE get_order_stats(
  IN cust_id INT,
  OUT total_orders INT,
  OUT total_amount DECIMAL(10,2)
)
BEGIN
  SELECT COUNT(*), COALESCE(SUM(total_amount), 0)
  INTO total_orders, total_amount
  FROM orders WHERE customer_id = cust_id;
END //
DELIMITER ;

CALL get_order_stats(1, @orders, @amount);
SELECT @orders, @amount;
\`\`\`

## Function vs Procedure

| Comparison | Function | Procedure |
|-----------|----------|-----------|
| Return value | Must return a value (RETURNS) | No return value (use OUT params) |
| Use in SQL | Can be used in SELECT, WHERE | CALL only |
| Transaction control | Not allowed | COMMIT/ROLLBACK allowed |
| Use cases | Calculations, transforms, queries | Business logic, batch operations |

### Managing Functions / Procedures

\`\`\`sql
-- Drop function
DROP FUNCTION IF EXISTS calc_discount_price(DECIMAL, DECIMAL);

-- Drop procedure
DROP PROCEDURE IF EXISTS transfer_funds;

-- PostgreSQL: list functions
SELECT routine_name, routine_type, data_type
FROM information_schema.routines
WHERE routine_schema = 'public';

-- MySQL: list procedures/functions
SHOW PROCEDURE STATUS WHERE Db = 'your_database';
SHOW FUNCTION STATUS WHERE Db = 'your_database';
\`\`\`

### Control Flow (PL/pgSQL / MySQL)

\`\`\`sql
-- IF / ELSIF / ELSE
IF amount > 100000 THEN
  discount := 0.15;
ELSIF amount > 50000 THEN
  discount := 0.10;
ELSE
  discount := 0.05;
END IF;

-- LOOP (PostgreSQL)
LOOP
  EXIT WHEN counter > 10;
  counter := counter + 1;
END LOOP;

-- WHILE (MySQL)
WHILE counter <= 10 DO
  SET counter = counter + 1;
END WHILE;

-- FOR (PostgreSQL)
FOR i IN 1..10 LOOP
  RAISE NOTICE 'Count: %', i;
END LOOP;

-- CURSOR (PostgreSQL)
DECLARE
  cur CURSOR FOR SELECT * FROM products WHERE price > 100000;
  rec RECORD;
BEGIN
  OPEN cur;
  LOOP
    FETCH cur INTO rec;
    EXIT WHEN NOT FOUND;
    RAISE NOTICE 'Product: %', rec.name;
  END LOOP;
  CLOSE cur;
END;
\`\`\`

> In MySQL, use \`DELIMITER //\` to change the delimiter before writing procedures/functions, then restore with \`DELIMITER ;\`. This distinguishes semicolons within the body from statement terminators.`,
        },
      },
      {
        id: 'partition-tables',
        title: { ko: '파티션 테이블', en: 'Partition Tables' },
        level: 'expert',
        content: {
          ko: `## 파티션 테이블 (Table Partitioning)

대용량 테이블을 논리적으로 분할하여 쿼리 성능과 관리 효율을 높이는 기법입니다.

### 왜 파티셔닝이 필요한가?

- **쿼리 성능**: 파티션 프루닝으로 필요한 파티션만 스캔
- **유지보수**: 특정 파티션만 VACUUM, 재인덱싱 가능
- **데이터 관리**: 오래된 파티션을 DROP으로 빠르게 삭제
- **병렬 처리**: 여러 파티션을 동시에 스캔 가능

### RANGE 파티셔닝

날짜, 숫자 등 연속 범위로 분할합니다.

\`\`\`sql
-- PostgreSQL (선언적 파티셔닝, PG 10+)
CREATE TABLE orders_partitioned (
  id SERIAL,
  customer_id INTEGER,
  order_date DATE NOT NULL,
  total_amount DECIMAL(10,2)
) PARTITION BY RANGE (order_date);

-- 월별 파티션 생성
CREATE TABLE orders_2024_01 PARTITION OF orders_partitioned
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE orders_2024_02 PARTITION OF orders_partitioned
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- 기본 파티션 (PG 11+): 범위에 맞지 않는 데이터 수용
CREATE TABLE orders_default PARTITION OF orders_partitioned DEFAULT;
\`\`\`

\`\`\`sql
-- MySQL
CREATE TABLE orders_partitioned (
  id INT AUTO_INCREMENT,
  customer_id INT,
  order_date DATE NOT NULL,
  total_amount DECIMAL(10,2),
  PRIMARY KEY (id, order_date)
) PARTITION BY RANGE (YEAR(order_date)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p_future VALUES LESS THAN MAXVALUE
);
\`\`\`

> MySQL에서는 파티션 키가 반드시 PRIMARY KEY 또는 UNIQUE KEY에 포함되어야 합니다.

### LIST 파티셔닝

특정 값 목록으로 분할합니다.

\`\`\`sql
-- PostgreSQL
CREATE TABLE customers_by_region (
  id SERIAL,
  name VARCHAR(100),
  country VARCHAR(50) NOT NULL
) PARTITION BY LIST (country);

CREATE TABLE customers_asia PARTITION OF customers_by_region
  FOR VALUES IN ('Korea', 'Japan', 'China');
CREATE TABLE customers_europe PARTITION OF customers_by_region
  FOR VALUES IN ('Germany', 'France', 'UK');
CREATE TABLE customers_others PARTITION OF customers_by_region DEFAULT;
\`\`\`

\`\`\`sql
-- MySQL: LIST COLUMNS로 문자열 기반 분할 가능
CREATE TABLE customers_by_region (
  id INT AUTO_INCREMENT,
  name VARCHAR(100),
  country VARCHAR(50) NOT NULL,
  PRIMARY KEY (id, country)
) PARTITION BY LIST COLUMNS (country) (
  PARTITION p_asia VALUES IN ('Korea', 'Japan', 'China'),
  PARTITION p_europe VALUES IN ('Germany', 'France', 'UK'),
  PARTITION p_america VALUES IN ('USA', 'Canada', 'Brazil')
);
\`\`\`

### HASH 파티셔닝

해시 함수로 균등하게 분할합니다. 범위나 목록으로 나누기 어려울 때 사용합니다.

\`\`\`sql
-- PostgreSQL (PG 11+)
CREATE TABLE logs (
  id SERIAL,
  user_id INTEGER NOT NULL,
  message TEXT,
  created_at TIMESTAMP
) PARTITION BY HASH (user_id);

CREATE TABLE logs_0 PARTITION OF logs
  FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE logs_1 PARTITION OF logs
  FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE logs_2 PARTITION OF logs
  FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE logs_3 PARTITION OF logs
  FOR VALUES WITH (MODULUS 4, REMAINDER 3);
\`\`\`

\`\`\`sql
-- MySQL
CREATE TABLE logs (
  id INT AUTO_INCREMENT,
  user_id INT NOT NULL,
  message TEXT,
  created_at TIMESTAMP,
  PRIMARY KEY (id, user_id)
) PARTITION BY HASH (user_id) PARTITIONS 4;
\`\`\`

### 파티션 관리

\`\`\`sql
-- PostgreSQL: 파티션 추가
CREATE TABLE orders_2025_01 PARTITION OF orders_partitioned
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- PostgreSQL: 파티션 분리 (독립 테이블로 변환)
ALTER TABLE orders_partitioned DETACH PARTITION orders_2024_01;
-- PG 14+: CONCURRENTLY 옵션으로 잠금 최소화
ALTER TABLE orders_partitioned DETACH PARTITION orders_2024_01 CONCURRENTLY;

-- MySQL: 파티션 추가
ALTER TABLE orders_partitioned ADD PARTITION (
  PARTITION p2026 VALUES LESS THAN (2027)
);

-- MySQL: 파티션 삭제 (데이터도 함께 삭제됨)
ALTER TABLE orders_partitioned DROP PARTITION p2023;

-- MySQL: 파티션 데이터만 삭제 (파티션 구조 유지)
ALTER TABLE orders_partitioned TRUNCATE PARTITION p2023;
\`\`\`

### 파티션 프루닝 (Partition Pruning)

쿼리 조건에 맞는 파티션만 스캔하여 성능을 극대화합니다.

\`\`\`sql
-- order_date 조건으로 해당 파티션만 스캔
SELECT * FROM orders_partitioned
WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31';

-- EXPLAIN으로 파티션 프루닝 확인
EXPLAIN SELECT * FROM orders_partitioned
WHERE order_date = '2024-06-15';
\`\`\`

### PostgreSQL vs MySQL 비교

| 기능 | PostgreSQL | MySQL |
|------|-----------|-------|
| 선언적 파티셔닝 | PG 10+ | 지원 |
| RANGE | ✅ | ✅ |
| LIST | ✅ (모든 타입) | LIST COLUMNS (문자열 포함) |
| HASH | PG 11+ | ✅ |
| DEFAULT 파티션 | PG 11+ | MAXVALUE로 대체 |
| 파티션 DETACH | ✅ (PG 14: CONCURRENTLY) | ✗ (DROP만 가능) |
| 서브 파티셔닝 | 파티션을 다시 파티셔닝 | SUBPARTITION 문법 |
| 파티션 키 제약 | 없음 | PK/UK에 포함 필수 |
| 인덱스 | 파티션별 개별 인덱스 | 글로벌 인덱스 |`,
          en: `## Table Partitioning

A technique to logically split large tables into smaller pieces, improving query performance and management efficiency.

### Why Partition?

- **Query performance**: Partition pruning scans only relevant partitions
- **Maintenance**: VACUUM and reindex specific partitions only
- **Data management**: Quickly drop old partitions
- **Parallelism**: Scan multiple partitions concurrently

### RANGE Partitioning

Split by continuous ranges like dates or numbers.

\`\`\`sql
-- PostgreSQL (declarative partitioning, PG 10+)
CREATE TABLE orders_partitioned (
  id SERIAL,
  customer_id INTEGER,
  order_date DATE NOT NULL,
  total_amount DECIMAL(10,2)
) PARTITION BY RANGE (order_date);

-- Create monthly partitions
CREATE TABLE orders_2024_01 PARTITION OF orders_partitioned
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE orders_2024_02 PARTITION OF orders_partitioned
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Default partition (PG 11+): catches data outside defined ranges
CREATE TABLE orders_default PARTITION OF orders_partitioned DEFAULT;
\`\`\`

\`\`\`sql
-- MySQL
CREATE TABLE orders_partitioned (
  id INT AUTO_INCREMENT,
  customer_id INT,
  order_date DATE NOT NULL,
  total_amount DECIMAL(10,2),
  PRIMARY KEY (id, order_date)
) PARTITION BY RANGE (YEAR(order_date)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p_future VALUES LESS THAN MAXVALUE
);
\`\`\`

> In MySQL, the partition key must be part of the PRIMARY KEY or UNIQUE KEY.

### LIST Partitioning

Split by specific value lists.

\`\`\`sql
-- PostgreSQL
CREATE TABLE customers_by_region (
  id SERIAL,
  name VARCHAR(100),
  country VARCHAR(50) NOT NULL
) PARTITION BY LIST (country);

CREATE TABLE customers_asia PARTITION OF customers_by_region
  FOR VALUES IN ('Korea', 'Japan', 'China');
CREATE TABLE customers_europe PARTITION OF customers_by_region
  FOR VALUES IN ('Germany', 'France', 'UK');
CREATE TABLE customers_others PARTITION OF customers_by_region DEFAULT;
\`\`\`

\`\`\`sql
-- MySQL: LIST COLUMNS allows string-based partitioning
CREATE TABLE customers_by_region (
  id INT AUTO_INCREMENT,
  name VARCHAR(100),
  country VARCHAR(50) NOT NULL,
  PRIMARY KEY (id, country)
) PARTITION BY LIST COLUMNS (country) (
  PARTITION p_asia VALUES IN ('Korea', 'Japan', 'China'),
  PARTITION p_europe VALUES IN ('Germany', 'France', 'UK'),
  PARTITION p_america VALUES IN ('USA', 'Canada', 'Brazil')
);
\`\`\`

### HASH Partitioning

Distribute data evenly using a hash function. Useful when range or list criteria don't apply.

\`\`\`sql
-- PostgreSQL (PG 11+)
CREATE TABLE logs (
  id SERIAL,
  user_id INTEGER NOT NULL,
  message TEXT,
  created_at TIMESTAMP
) PARTITION BY HASH (user_id);

CREATE TABLE logs_0 PARTITION OF logs
  FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE logs_1 PARTITION OF logs
  FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE logs_2 PARTITION OF logs
  FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE logs_3 PARTITION OF logs
  FOR VALUES WITH (MODULUS 4, REMAINDER 3);
\`\`\`

\`\`\`sql
-- MySQL
CREATE TABLE logs (
  id INT AUTO_INCREMENT,
  user_id INT NOT NULL,
  message TEXT,
  created_at TIMESTAMP,
  PRIMARY KEY (id, user_id)
) PARTITION BY HASH (user_id) PARTITIONS 4;
\`\`\`

### Partition Management

\`\`\`sql
-- PostgreSQL: add partition
CREATE TABLE orders_2025_01 PARTITION OF orders_partitioned
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- PostgreSQL: detach partition (convert to standalone table)
ALTER TABLE orders_partitioned DETACH PARTITION orders_2024_01;
-- PG 14+: CONCURRENTLY to minimize locking
ALTER TABLE orders_partitioned DETACH PARTITION orders_2024_01 CONCURRENTLY;

-- MySQL: add partition
ALTER TABLE orders_partitioned ADD PARTITION (
  PARTITION p2026 VALUES LESS THAN (2027)
);

-- MySQL: drop partition (data is also deleted)
ALTER TABLE orders_partitioned DROP PARTITION p2023;

-- MySQL: truncate partition (keep structure, delete data)
ALTER TABLE orders_partitioned TRUNCATE PARTITION p2023;
\`\`\`

### Partition Pruning

Maximize performance by scanning only the partitions that match query conditions.

\`\`\`sql
-- Only scans the partition matching the order_date range
SELECT * FROM orders_partitioned
WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31';

-- Verify partition pruning with EXPLAIN
EXPLAIN SELECT * FROM orders_partitioned
WHERE order_date = '2024-06-15';
\`\`\`

### PostgreSQL vs MySQL Comparison

| Feature | PostgreSQL | MySQL |
|---------|-----------|-------|
| Declarative partitioning | PG 10+ | Supported |
| RANGE | \\u2705 | \\u2705 |
| LIST | \\u2705 (any type) | LIST COLUMNS (incl. strings) |
| HASH | PG 11+ | \\u2705 |
| DEFAULT partition | PG 11+ | Use MAXVALUE instead |
| Partition DETACH | \\u2705 (PG 14: CONCURRENTLY) | \\u2717 (DROP only) |
| Sub-partitioning | Partition of partition | SUBPARTITION syntax |
| Partition key constraint | None | Must be in PK/UK |
| Indexes | Per-partition indexes | Global indexes |`,
        },
      },
      {
        id: 'lob-data-types',
        title: { ko: 'LOB과 대용량 데이터 타입', en: 'LOB & Large Data Types' },
        level: 'expert',
        content: {
          ko: `## LOB (Large Object) / 대용량 데이터 타입

대용량 텍스트, 바이너리 데이터를 저장하기 위한 데이터 타입입니다.

### PostgreSQL 대용량 타입

| 타입 | 최대 크기 | 용도 |
|------|----------|------|
| **TEXT** | ~1GB | 제한 없는 가변 길이 텍스트 |
| **BYTEA** | ~1GB | 바이너리 데이터 (인라인 저장) |
| **Large Object** (lo) | ~4TB | 대형 바이너리 (별도 시스템 테이블) |
| **JSONB** | ~1GB | 바이너리 JSON (인덱싱 가능) |

\`\`\`sql
-- TEXT: 긴 텍스트 저장
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB
);

-- BYTEA: 바이너리 데이터
CREATE TABLE attachments (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  content_type VARCHAR(100),
  data BYTEA,
  file_size INTEGER
);

-- 바이너리 삽입 (hex 형식)
INSERT INTO attachments (filename, content_type, data)
VALUES ('test.txt', 'text/plain', '\\x48656c6c6f');
\`\`\`

### PostgreSQL Large Object

BYTEA보다 큰 파일(수 GB)을 저장할 때 사용합니다. 별도의 시스템 테이블(\`pg_largeobject\`)에 저장됩니다.

\`\`\`sql
-- Large Object 생성 (서버 측 파일에서)
SELECT lo_import('/path/to/file.pdf');

-- OID를 테이블에 저장
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  file_oid OID
);

-- Large Object 내보내기
SELECT lo_export(file_oid, '/path/to/output.pdf')
FROM documents WHERE id = 1;

-- Large Object 삭제
SELECT lo_unlink(file_oid) FROM documents WHERE id = 1;
\`\`\`

> Large Object는 트랜잭션 내에서만 접근 가능하며, 고아 객체(참조되지 않는 LO)는 \`vacuumlo\` 유틸리티로 정리합니다.

### TOAST (The Oversized-Attribute Storage Technique)

PostgreSQL은 행 크기가 약 2KB를 초과하면 자동으로 TOAST 메커니즘을 사용합니다.

- TEXT, BYTEA, JSONB 등 가변 길이 타입에 적용
- 자동 압축 후 별도 TOAST 테이블에 분할 저장
- 쿼리 시 필요한 경우에만 TOAST 데이터를 읽음 (lazy decompression)
- 사용자가 명시적으로 관리할 필요 없음

\`\`\`sql
-- 테이블의 TOAST 저장 전략 확인
SELECT attname, attstorage FROM pg_attribute
WHERE attrelid = 'articles'::regclass AND attnum > 0;
-- x: 압축 + 외부 저장 (EXTENDED, 기본값)
-- e: 외부 저장만 (EXTERNAL)
-- m: 압축만 (MAIN)
-- p: 인라인만 (PLAIN)
\`\`\`

### MySQL 대용량 타입

| 타입 | 최대 크기 | 용도 |
|------|----------|------|
| **TINYTEXT** / **TINYBLOB** | 255 bytes | 매우 작은 텍스트/바이너리 |
| **TEXT** / **BLOB** | ~64KB | 일반 텍스트/바이너리 |
| **MEDIUMTEXT** / **MEDIUMBLOB** | ~16MB | 중간 크기 |
| **LONGTEXT** / **LONGBLOB** | ~4GB | 대용량 텍스트/바이너리 |
| **JSON** | ~4GB (LONGTEXT) | JSON 데이터 |

\`\`\`sql
CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  body LONGTEXT NOT NULL,
  thumbnail MEDIUMBLOB,
  metadata JSON
);

-- BLOB 데이터 삽입
INSERT INTO articles (title, body, thumbnail)
VALUES ('제목', '본문 내용', LOAD_FILE('/path/to/image.jpg'));
\`\`\`

> MySQL의 \`LOAD_FILE()\`은 서버의 \`secure_file_priv\` 디렉토리 내 파일만 읽을 수 있습니다.

### TEXT vs VARCHAR

| 비교 | VARCHAR(n) | TEXT |
|------|-----------|------|
| 길이 제한 | 최대 n자 | PG: ~1GB, MySQL TEXT: ~64KB, LONGTEXT: ~4GB |
| 인덱싱 | 전체 열 인덱싱 가능 | MySQL: 접두사 인덱스만 가능 |
| DEFAULT 값 | 설정 가능 | MySQL 8.0.13+부터 가능 |
| 메모리 할당 | 정의된 길이 기반 | 실제 길이 기반 |
| 권장 | 길이가 예측 가능한 짧은 문자열 | 길이 예측이 어려운 긴 텍스트 |

\`\`\`sql
-- MySQL: TEXT 열에 접두사 인덱스
CREATE INDEX idx_body_prefix ON articles(body(100));

-- PostgreSQL: TEXT도 일반 인덱스 가능 (GIN으로 전문 검색)
CREATE INDEX idx_body_search ON articles USING GIN(to_tsvector('english', body));
\`\`\`

### BLOB vs 파일 시스템 저장

| 전략 | 장점 | 단점 |
|------|------|------|
| DB에 직접 저장 (BYTEA/BLOB) | 트랜잭션 보장, 단일 백업 | DB 크기 증가, 성능 저하 |
| 파일 시스템 + 경로 저장 | DB 부담 적음, 빠른 접근 | 정합성 관리 필요 |
| 오브젝트 스토리지 (S3 등) + URL | 확장성 우수, CDN 연동 | 외부 의존성 |

\`\`\`sql
-- 실무 패턴: URL만 DB에 저장
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  storage_url VARCHAR(500) NOT NULL,  -- S3/GCS URL
  content_type VARCHAR(100),
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

> **실무 권장**: 수 KB 이하의 작은 데이터는 DB에 저장하고, 수 MB 이상의 파일은 오브젝트 스토리지(S3, GCS 등)에 저장 후 URL만 DB에 기록하는 방식이 일반적입니다.`,
          en: `## LOB (Large Object) / Large Data Types

Data types designed for storing large text and binary data.

### PostgreSQL Large Types

| Type | Max Size | Use Case |
|------|---------|----------|
| **TEXT** | ~1GB | Unlimited variable-length text |
| **BYTEA** | ~1GB | Binary data (inline storage) |
| **Large Object** (lo) | ~4TB | Large binary (separate system table) |
| **JSONB** | ~1GB | Binary JSON (indexable) |

\`\`\`sql
-- TEXT: store long text
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB
);

-- BYTEA: binary data
CREATE TABLE attachments (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  content_type VARCHAR(100),
  data BYTEA,
  file_size INTEGER
);

-- Insert binary data (hex format)
INSERT INTO attachments (filename, content_type, data)
VALUES ('test.txt', 'text/plain', '\\x48656c6c6f');
\`\`\`

### PostgreSQL Large Object

Used for files larger than BYTEA can handle efficiently (multiple GB). Stored in a separate system table (\`pg_largeobject\`).

\`\`\`sql
-- Create Large Object from server-side file
SELECT lo_import('/path/to/file.pdf');

-- Store OID in a table
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  file_oid OID
);

-- Export Large Object
SELECT lo_export(file_oid, '/path/to/output.pdf')
FROM documents WHERE id = 1;

-- Delete Large Object
SELECT lo_unlink(file_oid) FROM documents WHERE id = 1;
\`\`\`

> Large Objects are only accessible within transactions. Orphaned objects (unreferenced LOs) should be cleaned up using the \`vacuumlo\` utility.

### TOAST (The Oversized-Attribute Storage Technique)

PostgreSQL automatically uses TOAST when row size exceeds approximately 2KB.

- Applies to variable-length types like TEXT, BYTEA, JSONB
- Automatically compresses and stores in a separate TOAST table
- TOAST data is read only when needed (lazy decompression)
- No explicit management required from the user

\`\`\`sql
-- Check TOAST storage strategy for a table
SELECT attname, attstorage FROM pg_attribute
WHERE attrelid = 'articles'::regclass AND attnum > 0;
-- x: compress + external (EXTENDED, default)
-- e: external only (EXTERNAL)
-- m: compress only (MAIN)
-- p: inline only (PLAIN)
\`\`\`

### MySQL Large Types

| Type | Max Size | Use Case |
|------|---------|----------|
| **TINYTEXT** / **TINYBLOB** | 255 bytes | Very small text/binary |
| **TEXT** / **BLOB** | ~64KB | General text/binary |
| **MEDIUMTEXT** / **MEDIUMBLOB** | ~16MB | Medium size |
| **LONGTEXT** / **LONGBLOB** | ~4GB | Large text/binary |
| **JSON** | ~4GB (LONGTEXT) | JSON data |

\`\`\`sql
CREATE TABLE articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  body LONGTEXT NOT NULL,
  thumbnail MEDIUMBLOB,
  metadata JSON
);

-- Insert BLOB data
INSERT INTO articles (title, body, thumbnail)
VALUES ('Title', 'Body content', LOAD_FILE('/path/to/image.jpg'));
\`\`\`

> MySQL's \`LOAD_FILE()\` can only read files within the server's \`secure_file_priv\` directory.

### TEXT vs VARCHAR

| Comparison | VARCHAR(n) | TEXT |
|-----------|-----------|------|
| Length limit | Max n chars | PG: ~1GB, MySQL TEXT: ~64KB, LONGTEXT: ~4GB |
| Indexing | Full column indexing | MySQL: prefix index only |
| DEFAULT value | Supported | MySQL 8.0.13+: supported |
| Memory allocation | Based on defined length | Based on actual length |
| Recommended for | Short strings with predictable length | Long text with unpredictable length |

\`\`\`sql
-- MySQL: prefix index on TEXT column
CREATE INDEX idx_body_prefix ON articles(body(100));

-- PostgreSQL: TEXT supports regular indexing (GIN for full-text search)
CREATE INDEX idx_body_search ON articles USING GIN(to_tsvector('english', body));
\`\`\`

### BLOB vs File System Storage

| Strategy | Pros | Cons |
|----------|------|------|
| Store in DB (BYTEA/BLOB) | Transaction safety, single backup | DB bloat, performance hit |
| File system + path in DB | Less DB load, fast access | Consistency management needed |
| Object storage (S3 etc.) + URL | Scalability, CDN integration | External dependency |

\`\`\`sql
-- Production pattern: store only URLs in DB
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  storage_url VARCHAR(500) NOT NULL,  -- S3/GCS URL
  content_type VARCHAR(100),
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

> **Production recommendation**: Store small data (a few KB) directly in the DB, and for files larger than a few MB, use object storage (S3, GCS, etc.) and store only the URL in the database.`,
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
