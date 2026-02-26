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

#### 📋 **customers** (고객)
| 컬럼 | 타입 | 제약조건 |
|------|------|----------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE NOT NULL |
| city | VARCHAR(50) | |
| country | VARCHAR(50) | |
| signup_date | DATE | |
| is_premium | BOOLEAN | DEFAULT FALSE |

#### 📂 **categories** (카테고리)
| 컬럼 | 타입 | 제약조건 |
|------|------|----------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(50) | NOT NULL |
| parent_id | INTEGER | FK → categories(id) (자기참조) |

#### 📦 **products** (상품)
| 컬럼 | 타입 | 제약조건 |
|------|------|----------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(200) | NOT NULL |
| category_id | INTEGER | FK → categories(id) |
| price | DECIMAL(10,2) | NOT NULL |
| stock_quantity | INTEGER | DEFAULT 0 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

#### 🛒 **orders** (주문)
| 컬럼 | 타입 | 제약조건 |
|------|------|----------|
| id | SERIAL | PRIMARY KEY |
| customer_id | INTEGER | FK → customers(id) |
| order_date | TIMESTAMP | NOT NULL |
| status | VARCHAR(20) | CHECK (pending/processing/shipped/delivered/cancelled) |
| total_amount | DECIMAL(12,2) | |

#### 📝 **order_items** (주문 상세)
| 컬럼 | 타입 | 제약조건 |
|------|------|----------|
| id | SERIAL | PRIMARY KEY |
| order_id | INTEGER | FK → orders(id) |
| product_id | INTEGER | FK → products(id) |
| quantity | INTEGER | NOT NULL |
| unit_price | DECIMAL(10,2) | NOT NULL |

#### ⭐ **reviews** (리뷰)
| 컬럼 | 타입 | 제약조건 |
|------|------|----------|
| id | SERIAL | PRIMARY KEY |
| product_id | INTEGER | FK → products(id) |
| customer_id | INTEGER | FK → customers(id) |
| rating | INTEGER | CHECK (1~5) |
| comment | TEXT | |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### 테이블 간 관계도 (ERD)

**주요 관계:**
- **customers → orders**: 1:N 관계 (한 고객이 여러 주문 가능)
- **orders → order_items**: 1:N 관계 (한 주문에 여러 주문 항목 가능)
- **products → order_items**: 1:N 관계 (한 상품이 여러 주문 항목에 포함 가능)
- **customers → reviews**: 1:N 관계 (한 고객이 여러 리뷰 작성 가능)
- **products → reviews**: 1:N 관계 (한 상품에 여러 리뷰 가능)
- **categories → categories**: 자기참조 관계 (parent_id로 계층 구조 형성)
- **categories → products**: 1:N 관계 (한 카테고리에 여러 상품 가능)`,
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

#### 📋 **customers** (Customers)
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE NOT NULL |
| city | VARCHAR(50) | |
| country | VARCHAR(50) | |
| signup_date | DATE | |
| is_premium | BOOLEAN | DEFAULT FALSE |

#### 📂 **categories** (Categories)
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(50) | NOT NULL |
| parent_id | INTEGER | FK → categories(id) (self-referencing) |

#### 📦 **products** (Products)
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(200) | NOT NULL |
| category_id | INTEGER | FK → categories(id) |
| price | DECIMAL(10,2) | NOT NULL |
| stock_quantity | INTEGER | DEFAULT 0 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

#### 🛒 **orders** (Orders)
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| customer_id | INTEGER | FK → customers(id) |
| order_date | TIMESTAMP | NOT NULL |
| status | VARCHAR(20) | CHECK (pending/processing/shipped/delivered/cancelled) |
| total_amount | DECIMAL(12,2) | |

#### 📝 **order_items** (Order Items)
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| order_id | INTEGER | FK → orders(id) |
| product_id | INTEGER | FK → products(id) |
| quantity | INTEGER | NOT NULL |
| unit_price | DECIMAL(10,2) | NOT NULL |

#### ⭐ **reviews** (Reviews)
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| product_id | INTEGER | FK → products(id) |
| customer_id | INTEGER | FK → customers(id) |
| rating | INTEGER | CHECK (1~5) |
| comment | TEXT | |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Table Relationships (ERD)

**Key Relationships:**
- **customers → orders**: 1:N relationship (one customer can have many orders)
- **orders → order_items**: 1:N relationship (one order can have many order items)
- **products → order_items**: 1:N relationship (one product can appear in many order items)
- **customers → reviews**: 1:N relationship (one customer can write many reviews)
- **products → reviews**: 1:N relationship (one product can have many reviews)
- **categories → categories**: Self-referencing relationship (parent_id creates hierarchical structure)
- **categories → products**: 1:N relationship (one category can contain many products)`,
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
        id: 'erd-modeling',
        title: { ko: 'ERD: 개체-관계 모델링', en: 'ERD: Entity-Relationship Modeling' },
        level: 'beginner',
        content: {
          ko: `## ERD (Entity-Relationship Diagram)

**ERD**(개체-관계 다이어그램)는 데이터베이스의 **테이블(Entity)**과 **관계(Relationship)**를 시각적으로 표현한 설계도입니다.

---

## 핵심 구성 요소

### 1. 개체 (Entity) — 테이블

| 구성 | 설명 | 예시 |
|------|------|------|
| **개체명** | 테이블 이름 | customers, orders, products |
| **속성 (Attribute)** | 컬럼 | id, name, email, price |
| **기본키 (PK)** | 행을 고유 식별 | id (SERIAL / AUTO_INCREMENT) |

### 2. 카디널리티 (Cardinality)

| 카디널리티 | 의미 | 예시 |
|------------|------|------|
| **1:1** | 한 행 ↔ 한 행 | customers ↔ customer_profiles |
| **1:N** | 한 행 → 여러 행 | customers → orders |
| **N:M** | 여러 행 ↔ 여러 행 | products ↔ orders (order_items 중간 테이블) |
| **Self-ref** | 자기 자신 참조 | categories → categories (parent_id) |

---

## 관계 유형 상세

### 1:1 관계 — FK에 UNIQUE

\`\`\`sql
CREATE TABLE customer_profiles (
    id          SERIAL PRIMARY KEY,
    customer_id INTEGER UNIQUE NOT NULL,  -- UNIQUE = 1:1 보장
    bio         TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
\`\`\`

### 1:N 관계 — 가장 흔한 관계

\`\`\`sql
CREATE TABLE orders (
    id          SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    order_date  DATE NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 한 고객의 모든 주문
SELECT c.name, o.id, o.total_amount
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE c.id = 1;
\`\`\`

### N:M 관계 — 중간 테이블 (Junction Table)

\`\`\`sql
-- order_items가 orders ↔ products 를 연결
CREATE TABLE order_items (
    id         SERIAL PRIMARY KEY,
    order_id   INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity   INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

-- 주문 1의 모든 상품 (N:M → JOIN 2번)
SELECT p.name, oi.quantity, oi.unit_price
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.order_id = 1;
\`\`\`

### Self-Referencing — 자기 참조

\`\`\`sql
CREATE TABLE categories (
    id        SERIAL PRIMARY KEY,
    name      VARCHAR(100) NOT NULL,
    parent_id INTEGER REFERENCES categories(id)
);

-- 하위 카테고리 조회 (Self JOIN)
SELECT c.name AS category, p.name AS parent
FROM categories c
LEFT JOIN categories p ON c.parent_id = p.id;
\`\`\`

---

## E-Commerce ERD (본 플랫폼)

\`\`\`
customers ──1:1── customer_profiles
    │ 1:N              │ 1:N
    ▼                  ▼
  orders            reviews ◄──1:N── products
    │ 1:N                              │ N:1
    ▼                                  ▼
 order_items ────N:M──── products   categories
                                    ▲ self-ref
                                    └───┘
\`\`\`

### 관계 요약

| 관계 | 유형 | FK 위치 | 설명 |
|------|------|---------|------|
| customers ↔ customer_profiles | 1:1 | customer_profiles.customer_id (UNIQUE) | 고객 프로필 |
| customers → orders | 1:N | orders.customer_id | 한 고객, 여러 주문 |
| customers → reviews | 1:N | reviews.customer_id | 한 고객, 여러 리뷰 |
| orders → order_items | 1:N | order_items.order_id | 한 주문, 여러 상품 |
| products ↔ orders | N:M | order_items (중간 테이블) | 상품-주문 다대다 |
| products → reviews | 1:N | reviews.product_id | 한 상품, 여러 리뷰 |
| categories → products | 1:N | products.category_id | 카테고리별 상품 |
| categories → categories | Self | categories.parent_id | 카테고리 계층 |

---

## Crow's Foot 표기법

\`\`\`
──||──  : 정확히 1 (필수)      ──|○──  : 0 또는 1
──<──   : 다수 (Many)          ──○<──  : 0 이상
\`\`\`

---

## PostgreSQL vs MySQL 차이

| 기능 | PostgreSQL | MySQL |
|------|-----------|-------|
| 자동 증가 PK | \`SERIAL\` / \`GENERATED ALWAYS AS IDENTITY\` | \`AUTO_INCREMENT\` |
| FK 지원 | 모든 테이블 | **InnoDB**에서만 |
| Deferred FK | \`DEFERRABLE INITIALLY DEFERRED\` 지원 | 미지원 |
| CASCADE | \`ON DELETE CASCADE / SET NULL / RESTRICT\` | 동일 |

---

## ER 모델 심화

### 약한 엔터티 (Weak Entity)

자체적인 기본키가 없어 **소유 엔터티(Owner Entity)**의 키에 의존하는 엔터티입니다.

\`\`\`
[rooms] ← 약한 엔터티
  room_number (부분키)
  building_id → [buildings] (소유 엔터티)

기본키: (building_id, room_number) ← 복합키
\`\`\`

\`\`\`sql
CREATE TABLE buildings (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL
);

CREATE TABLE rooms (
  building_id  INTEGER NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  room_number  VARCHAR(10) NOT NULL,
  capacity     INTEGER,
  PRIMARY KEY (building_id, room_number)  -- 복합키 = 소유자PK + 부분키
);
\`\`\`

**약한 엔터티 조건:**
- 소유 엔터티가 삭제되면 약한 엔터티도 삭제 (CASCADE)
- 소유 관계는 항상 **1:N** (소유자 1 : 약한 엔터티 N)
- ERD에서 이중 사각형(▭)으로 표기

### 속성의 종류

| 종류 | 설명 | ERD 처리 |
|------|------|---------|
| **단순 속성** | 더 이상 분해 불가 (이름, 가격) | 컬럼으로 직접 매핑 |
| **복합 속성** | 분해 가능 (주소 → 시, 구, 동) | 개별 컬럼으로 분해 또는 별도 테이블 |
| **다치 속성** | 여러 값 (전화번호 여러 개) | 별도 테이블로 분리 (1NF) |
| **유도 속성** | 다른 속성에서 계산 (나이 ← 생년월일) | 저장 안 함 또는 파생 컬럼 |
| **키 속성** | 엔터티를 고유 식별 | PRIMARY KEY |

### E/R → 릴레이션 변환 규칙

| ER 요소 | 릴레이션 변환 |
|---------|-------------|
| **강한 엔터티** | 테이블 1개, 속성 → 컬럼, 키 → PK |
| **약한 엔터티** | 테이블 1개, PK = 소유자PK + 부분키 |
| **1:1 관계** | FK(UNIQUE)를 한쪽에 추가 또는 테이블 병합 |
| **1:N 관계** | N쪽에 FK 추가 |
| **N:M 관계** | 중간 테이블 생성 (양쪽 FK가 복합 PK) |
| **다치 속성** | 별도 테이블 (원래 엔터티 FK + 속성값) |
| **관계의 속성** | 관계 테이블에 컬럼으로 추가 |

\`\`\`sql
-- N:M 관계 변환: students ↔ courses
-- 관계 속성: grade (성적)
CREATE TABLE enrollments (
  student_id  INTEGER REFERENCES students(id),
  course_id   INTEGER REFERENCES courses(id),
  grade       CHAR(2),            -- 관계의 속성
  semester    VARCHAR(10),
  PRIMARY KEY (student_id, course_id, semester)
);
\`\`\`

### ER 설계 원칙 (Design Principles)

| 원칙 | 설명 |
|------|------|
| **충실성 (Faithfulness)** | 현실 세계를 정확히 반영 |
| **중복 회피 (Avoid Redundancy)** | 같은 정보를 두 곳에 저장하지 않음 |
| **단순성 (Simplicity)** | 불필요한 엔터티/관계를 만들지 않음 |
| **올바른 관계 선택** | 엔터티 vs 속성, 관계 vs 엔터티를 신중히 결정 |

> **속성 vs 엔터티 판단:** 해당 데이터가 자체 속성을 가지거나 다른 엔터티와 관계가 있으면 → 엔터티. 단순 값이면 → 속성.`,
          en: `## ERD (Entity-Relationship Diagram)

An **ERD** is a visual blueprint showing the **tables (Entities)** and **relationships** in a database.

---

## Core Components

### 1. Entity — Table

| Component | Description | Example |
|-----------|-------------|---------|
| **Entity name** | Table name | customers, orders, products |
| **Attribute** | Columns | id, name, email, price |
| **Primary Key (PK)** | Uniquely identifies a row | id (SERIAL / AUTO_INCREMENT) |

### 2. Cardinality

| Cardinality | Meaning | Example |
|-------------|---------|---------|
| **1:1** | One row ↔ One row | customers ↔ customer_profiles |
| **1:N** | One row → Many rows | customers → orders |
| **N:M** | Many rows ↔ Many rows | products ↔ orders (via order_items) |
| **Self-ref** | References itself | categories → categories (parent_id) |

---

## Relationship Types in Detail

### 1:1 — FK with UNIQUE

\`\`\`sql
CREATE TABLE customer_profiles (
    id          SERIAL PRIMARY KEY,
    customer_id INTEGER UNIQUE NOT NULL,  -- UNIQUE = enforces 1:1
    bio         TEXT,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
\`\`\`

### 1:N — Most Common Relationship

\`\`\`sql
CREATE TABLE orders (
    id          SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    order_date  DATE NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- All orders for one customer
SELECT c.name, o.id, o.total_amount
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE c.id = 1;
\`\`\`

### N:M — Junction Table

\`\`\`sql
-- order_items connects orders ↔ products
CREATE TABLE order_items (
    id         SERIAL PRIMARY KEY,
    order_id   INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity   INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

-- All products in order 1 (N:M → 2 JOINs)
SELECT p.name, oi.quantity, oi.unit_price
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.order_id = 1;
\`\`\`

### Self-Referencing

\`\`\`sql
CREATE TABLE categories (
    id        SERIAL PRIMARY KEY,
    name      VARCHAR(100) NOT NULL,
    parent_id INTEGER REFERENCES categories(id)
);

-- Query subcategories (Self JOIN)
SELECT c.name AS category, p.name AS parent
FROM categories c
LEFT JOIN categories p ON c.parent_id = p.id;
\`\`\`

---

## E-Commerce ERD (This Platform)

\`\`\`
customers ──1:1── customer_profiles
    │ 1:N              │ 1:N
    ▼                  ▼
  orders            reviews ◄──1:N── products
    │ 1:N                              │ N:1
    ▼                                  ▼
 order_items ────N:M──── products   categories
                                    ▲ self-ref
                                    └───┘
\`\`\`

### Relationship Summary

| Relationship | Type | FK Location | Description |
|-------------|------|-------------|-------------|
| customers ↔ customer_profiles | 1:1 | customer_profiles.customer_id (UNIQUE) | Customer profile |
| customers → orders | 1:N | orders.customer_id | One customer, many orders |
| customers → reviews | 1:N | reviews.customer_id | One customer, many reviews |
| orders → order_items | 1:N | order_items.order_id | One order, many items |
| products ↔ orders | N:M | order_items (junction table) | Product-order many-to-many |
| products → reviews | 1:N | reviews.product_id | One product, many reviews |
| categories → products | 1:N | products.category_id | Products per category |
| categories → categories | Self | categories.parent_id | Category hierarchy |

---

## Crow's Foot Notation

\`\`\`
──||──  : Exactly 1 (mandatory)     ──|○──  : 0 or 1
──<──   : Many                       ──○<──  : 0 or more
\`\`\`

---

## PostgreSQL vs MySQL

| Feature | PostgreSQL | MySQL |
|---------|-----------|-------|
| Auto-increment PK | \`SERIAL\` / \`GENERATED ALWAYS AS IDENTITY\` | \`AUTO_INCREMENT\` |
| FK support | All tables | **InnoDB only** |
| Deferred FK | \`DEFERRABLE INITIALLY DEFERRED\` | Not supported |
| CASCADE | \`ON DELETE CASCADE / SET NULL / RESTRICT\` | Same |

---

## ER Model Deep Dive

### Weak Entity

An entity that **lacks its own primary key** and depends on an **owner entity**.

\`\`\`
[rooms] ← Weak Entity
  room_number (partial key)
  building_id → [buildings] (Owner Entity)

Primary Key: (building_id, room_number) ← composite key
\`\`\`

\`\`\`sql
CREATE TABLE buildings (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL
);

CREATE TABLE rooms (
  building_id  INTEGER NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  room_number  VARCHAR(10) NOT NULL,
  capacity     INTEGER,
  PRIMARY KEY (building_id, room_number)  -- Composite = owner PK + partial key
);
\`\`\`

**Weak entity requirements:**
- If owner is deleted, weak entities are also deleted (CASCADE)
- Identifying relationship is always **1:N** (owner 1 : weak N)
- Shown as double rectangle (▭) in ERD notation

### Types of Attributes

| Type | Description | ERD Handling |
|------|-------------|-------------|
| **Simple** | Cannot decompose (name, price) | Map directly to column |
| **Composite** | Decomposable (address → city, district) | Split into columns or separate table |
| **Multi-valued** | Multiple values (multiple phone numbers) | Separate table (1NF) |
| **Derived** | Computed from other attrs (age ← birthdate) | Don't store, or use derived column |
| **Key** | Uniquely identifies entity | PRIMARY KEY |

### E/R → Relation Conversion Rules

| ER Element | Relation Conversion |
|-----------|-------------------|
| **Strong Entity** | 1 table, attributes → columns, key → PK |
| **Weak Entity** | 1 table, PK = owner PK + partial key |
| **1:1 Relationship** | Add FK(UNIQUE) to one side, or merge tables |
| **1:N Relationship** | Add FK to the N-side |
| **N:M Relationship** | Create junction table (both FKs as composite PK) |
| **Multi-valued Attribute** | Separate table (entity FK + attribute value) |
| **Relationship Attribute** | Add column to relationship table |

\`\`\`sql
-- N:M relationship: students ↔ courses
-- Relationship attribute: grade
CREATE TABLE enrollments (
  student_id  INTEGER REFERENCES students(id),
  course_id   INTEGER REFERENCES courses(id),
  grade       CHAR(2),            -- Relationship attribute
  semester    VARCHAR(10),
  PRIMARY KEY (student_id, course_id, semester)
);
\`\`\`

### ER Design Principles

| Principle | Description |
|-----------|-------------|
| **Faithfulness** | Accurately reflect the real world |
| **Avoid Redundancy** | Don't store the same info in two places |
| **Simplicity** | Don't create unnecessary entities/relationships |
| **Right Relationships** | Carefully decide: entity vs attribute, relationship vs entity |

> **Attribute vs Entity decision:** If the data has its own attributes or relates to other entities → make it an Entity. If it's a simple value → Attribute.`,
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
        id: 'data-modeling',
        title: { ko: '데이터 모델링', en: 'Data Modeling' },
        level: 'intermediate',
        content: {
          ko: `## 데이터 모델링 (Data Modeling)

데이터 모델링은 현실 세계의 데이터를 체계적으로 구조화하여 데이터베이스에 저장하기 위한 설계 과정입니다.

### 모델링 3단계

| 단계 | 설명 | 산출물 |
|------|------|--------|
| **개념적 모델링** | 업무 요구사항을 추상적으로 표현 | ERD (엔터티-관계도) |
| **논리적 모델링** | DBMS에 독립적인 스키마 설계 | 정규화된 테이블 구조 |
| **물리적 모델링** | 특정 DBMS에 맞게 최적화 | DDL, 인덱스, 파티션 |

### 1. 개념적 모델링 (Conceptual)

비즈니스 요구사항에서 **엔터티(Entity)**, **속성(Attribute)**, **관계(Relationship)**를 도출합니다.

- **엔터티**: 고객, 주문, 상품, 카테고리
- **속성**: 고객명, 이메일, 주문일시, 가격
- **관계**: 고객→주문(1:N), 주문→상품(N:M)

### 2. 논리적 모델링 — 정규화

| 정규형 | 규칙 | 예시 |
|--------|------|------|
| **1NF** | 모든 속성이 원자값 | 전화번호 컬럼에 여러 값 X |
| **2NF** | 부분 함수적 종속 제거 | 복합키 일부에만 종속되는 컬럼 분리 |
| **3NF** | 이행적 종속 제거 | A→B→C에서 A→C 종속 분리 |
| **BCNF** | 모든 결정자가 후보키 | 더 엄격한 3NF |

\`\`\`sql
-- 비정규화 (1NF 위반)
CREATE TABLE orders_bad (
  id INT PRIMARY KEY,
  items VARCHAR(500)  -- '상품A, 상품B' ← 원자값 아님
);

-- 정규화된 구조 (3NF)
CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT REFERENCES customers(id)
);
CREATE TABLE order_items (
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity INT
);
\`\`\`

### 3. 물리적 모델링

\`\`\`sql
-- PostgreSQL 물리적 모델
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) CHECK (status IN ('pending','shipped','delivered')),
  total_amount DECIMAL(12,2)
);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_date ON orders(order_date);
\`\`\`

### 반정규화 (Denormalization)

성능을 위해 **의도적으로 정규화를 완화**하는 기법입니다.

| 기법 | 설명 | 트레이드오프 |
|------|------|-------------|
| **중복 컬럼** | FK 대신 자주 조회되는 값 복사 | JOIN↓, 일관성 위험↑ |
| **파생 컬럼** | 계산 결과를 미리 저장 | 집계 속도↑, 갱신 비용↑ |
| **테이블 병합** | 1:1 테이블을 하나로 합침 | JOIN 제거, NULL 증가 |

### PostgreSQL vs MySQL

| 항목 | PostgreSQL | MySQL |
|------|-----------|-------|
| 스키마 | 멀티 스키마 지원 | 스키마 = 데이터베이스 |
| CHECK 제약 | 완전 지원 | 8.0.16+ 지원 |
| 도메인 타입 | CREATE DOMAIN 지원 | 미지원 |
| 테이블 상속 | INHERITS 지원 | 미지원 |`,
          en: `## Data Modeling

Data modeling is the process of systematically structuring real-world data for storage in a database.

### 3 Stages of Modeling

| Stage | Description | Output |
|-------|-------------|--------|
| **Conceptual** | Abstract business requirements | ERD |
| **Logical** | DBMS-independent schema design | Normalized tables |
| **Physical** | Optimize for specific DBMS | DDL, indexes, partitions |

### 1. Conceptual Modeling

Derive **Entities**, **Attributes**, and **Relationships** from requirements.

- **Entities**: Customer, Order, Product, Category
- **Attributes**: name, email, order_date, price
- **Relationships**: Customer→Order (1:N), Order→Product (N:M)

### 2. Logical Modeling — Normalization

| Form | Rule | Example |
|------|------|---------|
| **1NF** | All attributes are atomic | No multi-valued columns |
| **2NF** | Remove partial dependencies | Separate columns dependent on part of composite key |
| **3NF** | Remove transitive dependencies | If A→B→C, separate A→C |
| **BCNF** | Every determinant is a candidate key | Stricter 3NF |

\`\`\`sql
-- Denormalized (violates 1NF)
CREATE TABLE orders_bad (
  id INT PRIMARY KEY,
  items VARCHAR(500)  -- 'Product A, Product B' ← not atomic
);

-- Normalized (3NF)
CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT REFERENCES customers(id)
);
CREATE TABLE order_items (
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity INT
);
\`\`\`

### 3. Physical Modeling

\`\`\`sql
-- PostgreSQL physical model
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) CHECK (status IN ('pending','shipped','delivered')),
  total_amount DECIMAL(12,2)
);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_date ON orders(order_date);
\`\`\`

### Denormalization

Intentionally relaxing normalization for **performance**.

| Technique | Description | Trade-off |
|-----------|-------------|-----------|
| **Redundant columns** | Copy frequently queried values | Fewer JOINs, consistency risk |
| **Derived columns** | Pre-store computed results | Faster reads, update cost |
| **Table merging** | Combine 1:1 tables | No JOIN, more NULLs |

### PostgreSQL vs MySQL

| Feature | PostgreSQL | MySQL |
|---------|-----------|-------|
| Schemas | Multi-schema support | Schema = Database |
| CHECK constraint | Fully supported | Since 8.0.16+ |
| Domain types | CREATE DOMAIN | Not supported |
| Inheritance | INHERITS supported | Not supported |`,
        },
      },
      {
        id: 'relational-algebra',
        title: { ko: '관계 대수 (Relational Algebra)', en: 'Relational Algebra' },
        level: 'intermediate',
        content: {
          ko: `## 관계 대수 (Relational Algebra)

관계 대수는 관계형 데이터베이스의 **수학적 기초**입니다. SQL이 "무엇을 원하는가"를 선언하면, DBMS 내부에서는 관계 대수 연산으로 변환하여 실행합니다.

### 기본 연산자

| 연산자 | 기호 | SQL 대응 | 설명 |
|--------|------|----------|------|
| **선택 (Selection)** | σ | WHERE | 조건에 맞는 **행** 필터링 |
| **사영 (Projection)** | π | SELECT 컬럼 | 원하는 **열**만 추출 |
| **합집합 (Union)** | ∪ | UNION | 두 릴레이션의 합집합 |
| **차집합 (Difference)** | − | EXCEPT | 한쪽에만 있는 행 |
| **카티션 곱 (Cartesian Product)** | × | CROSS JOIN | 모든 행 조합 |
| **재명명 (Rename)** | ρ | AS | 릴레이션/속성 이름 변경 |

### 선택 (Selection) — σ

조건을 만족하는 행을 필터링합니다.

**기본 선택 연산:**
\`\`\`
σ_price>100000(Products)

읽는 법: "시그마, price가 100000 초과, Products"
의미: Products 테이블에서 price > 100000 조건을 만족하는 행만 선택

→ SQL: SELECT * FROM products WHERE price > 100000;
\`\`\`

**결합 조건 (∧ 사용):**
\`\`\`
σ_(price>100000 ∧ category_id=3)(Products)

수학 기호 설명:
• ∧ (논리곱, AND): "그리고" - 양쪽 조건을 모두 만족해야 함

읽는 법: "시그마, price가 100000 초과 그리고(∧) category_id가 3, Products"

의미: Products 테이블에서
     price > 100000 이면서(AND)
     category_id = 3인 행만 선택

→ SQL: SELECT * FROM products
       WHERE price > 100000 AND category_id = 3;
\`\`\`

**논리 연산자 종류:**
- \`∧\` (AND, 논리곱): 모든 조건이 참이어야 함
- \`∨\` (OR, 논리합): 최소 하나의 조건이 참이면 됨
- \`¬\` (NOT, 부정): 조건의 반대

예시: \`σ_(price>100000 ∨ category_id=1)(Products)\`
     → SQL: \`WHERE price > 100000 OR category_id = 1\`

### 사영 (Projection) — π

원하는 열만 추출합니다. 중복 행은 자동 제거됩니다.

\`\`\`
π_name,price(Products)

→ SQL: SELECT DISTINCT name, price FROM products;
\`\`\`

**선택 + 사영 결합:**
\`\`\`
π_name,price(σ_price>100000(Products))

→ SQL: SELECT DISTINCT name, price FROM products WHERE price > 100000;
\`\`\`

### 합집합, 교집합, 차집합

두 릴레이션의 **스키마가 동일**(합집합 호환, union-compatible)해야 합니다.

\`\`\`
-- 합집합: 서울 또는 프리미엄 고객
σ_city='Seoul'(Customers) ∪ σ_is_premium=true(Customers)
→ SQL: SELECT * FROM customers WHERE city = 'Seoul'
       UNION SELECT * FROM customers WHERE is_premium = true;

-- 교집합: 서울이면서 프리미엄 고객
σ_city='Seoul'(Customers) ∩ σ_is_premium=true(Customers)
→ SQL: SELECT * FROM customers WHERE city = 'Seoul'
       INTERSECT SELECT * FROM customers WHERE is_premium = true;

-- 차집합: 서울 고객 중 프리미엄이 아닌 고객
σ_city='Seoul'(Customers) − σ_is_premium=true(Customers)
→ SQL: SELECT * FROM customers WHERE city = 'Seoul'
       EXCEPT SELECT * FROM customers WHERE is_premium = true;
\`\`\`

### 조인 (Join) — ⋈

두 릴레이션을 조건에 따라 결합합니다.

**자연 조인 (Natural Join):**
\`\`\`
Products ⋈ Categories
→ 동일 이름 속성(category_id)으로 자동 결합
→ SQL: SELECT * FROM products NATURAL JOIN categories;
\`\`\`

**세타 조인 / 동등 조인:**
\`\`\`
Products ⋈_(Products.category_id = Categories.id) Categories
→ SQL: SELECT * FROM products p
       JOIN categories c ON p.category_id = c.id;
\`\`\`

**외부 조인 (Outer Join):**
\`\`\`
Products ⟕ Categories   -- Left Outer Join
Products ⟖ Categories   -- Right Outer Join
Products ⟗ Categories   -- Full Outer Join
\`\`\`

### 관계 대수 표현식 트리

SQL 쿼리는 관계 대수 트리로 변환됩니다. 옵티마이저는 이 트리를 변환하여 최적화합니다.

\`\`\`
질의: 가격 10만 이상 상품의 카테고리명

     π_c.name
       |
     σ_p.price≥100000
       |
      ⋈ (p.category_id = c.id)
     / \\
    p    c
(products)(categories)

→ SQL:
SELECT c.name
FROM products p JOIN categories c ON p.category_id = c.id
WHERE p.price >= 100000;
\`\`\`

### 관계 대수 등가 법칙

옵티마이저가 사용하는 핵심 변환 규칙입니다:

| 법칙 | 설명 | 수식 |
|------|------|------|
| **선택 하향** | σ를 트리 아래로 내림 → 조기 필터링으로 중간 결과 축소 | 최적화를 위한 위치 이동 |
| **사영 하향** | π를 아래로 내림 → 불필요한 열 조기 제거 | 최적화를 위한 위치 이동 |
| **선택 분해** | σ_(A ∧ B) = σ_A(σ_B) → 조건 분리 | \`σ_(price>1000 ∧ stock>0) = σ_price>1000(σ_stock>0)\` |
| **조인 교환** | R ⋈ S = S ⋈ R → 조인 순서 변경 | 교환법칙 성립 |
| **조인 결합** | (R ⋈ S) ⋈ T = R ⋈ (S ⋈ T) → 결합 순서 변경 | 결합법칙 성립 |

**선택 분해 상세 설명:**

\`∧\` (AND) 조건은 분리할 수 있습니다:
\`\`\`
σ_(price>100000 ∧ category_id=3)(Products)
=
σ_price>100000(σ_category_id=3(Products))

의미: "두 조건을 한 번에 체크" = "조건을 순차적으로 체크"

장점: 인덱스가 있는 조건을 먼저 적용하여 성능 최적화 가능
      (예: category_id에 인덱스가 있다면 먼저 필터링)
\`\`\`

> 이 법칙들은 쿼리 옵티마이저가 수백 개의 실행 계획 중 최적을 선택하는 기초입니다.`,
          en: `## Relational Algebra

Relational algebra is the **mathematical foundation** of relational databases. When SQL declares "what you want," the DBMS internally converts it to relational algebra operations for execution.

### Fundamental Operators

| Operator | Symbol | SQL Equivalent | Description |
|----------|--------|---------------|-------------|
| **Selection** | σ | WHERE | Filter **rows** by condition |
| **Projection** | π | SELECT columns | Extract specific **columns** |
| **Union** | ∪ | UNION | Union of two relations |
| **Difference** | − | EXCEPT | Rows in one but not the other |
| **Cartesian Product** | × | CROSS JOIN | All row combinations |
| **Rename** | ρ | AS | Rename relation/attributes |

### Selection — σ

Filters rows that satisfy a condition.

**Basic selection operation:**
\`\`\`
σ_price>100000(Products)

How to read: "sigma, price greater than 100000, Products"
Meaning: Select from Products table only rows where price > 100000

→ SQL: SELECT * FROM products WHERE price > 100000;
\`\`\`

**Combined conditions (using ∧):**
\`\`\`
σ_(price>100000 ∧ category_id=3)(Products)

Mathematical symbol explanation:
• ∧ (conjunction, AND): "and" - both conditions must be satisfied

How to read: "sigma, price greater than 100000 and (∧) category_id equals 3, Products"

Meaning: Select from Products table rows where
        price > 100000 AND
        category_id = 3

→ SQL: SELECT * FROM products
       WHERE price > 100000 AND category_id = 3;
\`\`\`

**Logical operators:**
- \`∧\` (AND, conjunction): All conditions must be true
- \`∨\` (OR, disjunction): At least one condition must be true
- \`¬\` (NOT, negation): Opposite of the condition

Example: \`σ_(price>100000 ∨ category_id=1)(Products)\`
        → SQL: \`WHERE price > 100000 OR category_id = 1\`

### Projection — π

Extracts only desired columns. Duplicates are automatically eliminated.

\`\`\`
π_name,price(Products)

→ SQL: SELECT DISTINCT name, price FROM products;
\`\`\`

**Selection + Projection combined:**
\`\`\`
π_name,price(σ_price>100000(Products))

→ SQL: SELECT DISTINCT name, price FROM products WHERE price > 100000;
\`\`\`

### Union, Intersection, Difference

Both relations must have **identical schemas** (union-compatible).

\`\`\`
-- Union: Seoul OR premium customers
σ_city='Seoul'(Customers) ∪ σ_is_premium=true(Customers)
→ SQL: SELECT * FROM customers WHERE city = 'Seoul'
       UNION SELECT * FROM customers WHERE is_premium = true;

-- Intersection: Seoul AND premium customers
σ_city='Seoul'(Customers) ∩ σ_is_premium=true(Customers)
→ SQL: SELECT * FROM customers WHERE city = 'Seoul'
       INTERSECT SELECT * FROM customers WHERE is_premium = true;

-- Difference: Seoul customers who are NOT premium
σ_city='Seoul'(Customers) − σ_is_premium=true(Customers)
→ SQL: SELECT * FROM customers WHERE city = 'Seoul'
       EXCEPT SELECT * FROM customers WHERE is_premium = true;
\`\`\`

### Join — ⋈

Combines two relations based on a condition.

**Natural Join:**
\`\`\`
Products ⋈ Categories
→ Automatically joins on same-named attributes (category_id)
→ SQL: SELECT * FROM products NATURAL JOIN categories;
\`\`\`

**Theta Join / Equi-join:**
\`\`\`
Products ⋈_(Products.category_id = Categories.id) Categories
→ SQL: SELECT * FROM products p
       JOIN categories c ON p.category_id = c.id;
\`\`\`

**Outer Joins:**
\`\`\`
Products ⟕ Categories   -- Left Outer Join
Products ⟖ Categories   -- Right Outer Join
Products ⟗ Categories   -- Full Outer Join
\`\`\`

### Relational Algebra Expression Tree

SQL queries are converted to relational algebra trees. The optimizer transforms this tree for optimization.

\`\`\`
Query: Category names for products priced ≥ 100K

     π_c.name
       |
     σ_p.price≥100000
       |
      ⋈ (p.category_id = c.id)
     / \\
    p    c
(products)(categories)

→ SQL:
SELECT c.name
FROM products p JOIN categories c ON p.category_id = c.id
WHERE p.price >= 100000;
\`\`\`

### Relational Algebra Equivalence Laws

Core transformation rules used by the optimizer:

| Law | Description | Formula |
|-----|-------------|---------|
| **Selection pushdown** | Push σ down the tree → early filtering reduces intermediate results | Optimization via repositioning |
| **Projection pushdown** | Push π down → remove unnecessary columns early | Optimization via repositioning |
| **Selection decomposition** | σ_(A ∧ B) = σ_A(σ_B) → split conditions | \`σ_(price>1000 ∧ stock>0) = σ_price>1000(σ_stock>0)\` |
| **Join commutativity** | R ⋈ S = S ⋈ R → swap join order | Commutative property holds |
| **Join associativity** | (R ⋈ S) ⋈ T = R ⋈ (S ⋈ T) → reorder grouping | Associative property holds |

**Selection Decomposition Details:**

\`∧\` (AND) conditions can be split:
\`\`\`
σ_(price>100000 ∧ category_id=3)(Products)
=
σ_price>100000(σ_category_id=3(Products))

Meaning: "Check both conditions at once" = "Check conditions sequentially"

Benefit: Can apply indexed condition first for better performance
        (e.g., if category_id has an index, filter by it first)
\`\`\`

> These laws form the basis for the query optimizer selecting the best plan among hundreds of possible execution plans.`,
        },
      },
      {
        id: 'relational-calculus',
        title: { ko: '관계 해석 (Relational Calculus)', en: 'Relational Calculus' },
        level: 'intermediate',
        content: {
          ko: `## 관계 해석 (Relational Calculus)

관계 대수가 **"어떻게" 데이터를 가져오는가** (절차적)를 기술한다면, 관계 해석은 **"무엇을" 원하는가** (선언적)를 기술합니다. SQL은 관계 해석에 더 가깝습니다.

### 튜플 관계 해석 (Tuple Relational Calculus, TRC)

변수가 **튜플(행)**을 나타냅니다.

#### 기본 형식

\`\`\`
형식: { t | P(t) }
의미: 조건 P를 만족하는 모든 튜플 t의 집합
\`\`\`

**수학 기호 설명:**
- \`∈\` (원소) : "~에 속한다" (member of)
- \`∧\` (논리곱) : "그리고" (AND)
- \`∨\` (논리합) : "또는" (OR)
- \`∃\` (존재 한정자) : "~가 존재한다" (there exists)
- \`∀\` (전체 한정자) : "모든 ~에 대해" (for all)

#### 예시 1: 단순 조건 필터링

**문제:** 가격이 10만원 이상인 상품을 찾으시오.

\`\`\`
관계 해석:
{ t | t ∈ Products ∧ t.price > 100000 }

해석 (일반 언어):
"Products 테이블에 속하고(∈), 가격이 10만원 초과인(∧) 모든 튜플 t"

동등한 SQL:
SELECT * FROM products WHERE price > 100000;
\`\`\`

#### 예시 2: 존재 한정자 (∃) 사용

**문제:** 주문이 있는 고객을 찾으시오.

\`\`\`
관계 해석:
{ c | c ∈ Customers ∧ ∃o(o ∈ Orders ∧ o.customer_id = c.id) }

해석 (일반 언어):
"Customers에 속하는 고객 c 중에서,
 Orders에 속하는 주문 o가 존재하고(∃),
 그 주문의 customer_id가 c.id와 같은(∧) 모든 고객"

의미: "최소 한 건 이상의 주문이 있는 고객"

동등한 SQL:
SELECT * FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.id
);
\`\`\`

#### 예시 3: 전체 한정자 (∀) 사용

**문제:** 모든 상품을 주문한 고객을 찾으시오.

\`\`\`
관계 해석:
{ c | c ∈ Customers ∧
      ∀p(p ∈ Products →
          ∃oi(oi ∈ OrderItems ∧ oi.product_id = p.id ∧
              ∃o(o ∈ Orders ∧ o.id = oi.order_id ∧ o.customer_id = c.id))) }

해석 (일반 언어):
"Customers에 속하는 고객 c 중에서,
 모든 상품 p에 대해(∀),
 다음이 성립하는 고객:
   - 주문항목 oi가 존재하고(∃)
   - 그 항목의 product_id가 p.id이며(∧)
   - 주문 o가 존재하고(∃)
   - 그 주문의 id가 oi.order_id이며(∧)
   - 그 주문의 customer_id가 c.id인 경우"

의미: "상품 목록의 모든 상품을 한 번 이상 주문한 고객"

동등한 SQL (관계 나눗셈 구현):
SELECT c.*
FROM customers c
WHERE NOT EXISTS (
  SELECT p.id FROM products p
  WHERE NOT EXISTS (
    SELECT 1 FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.customer_id = c.id
      AND oi.product_id = p.id
  )
);
\`\`\`

### 도메인 관계 해석 (Domain Relational Calculus, DRC)

변수가 **도메인 값(속성값)**을 나타냅니다. TRC가 튜플 전체를 변수로 다루는 반면, DRC는 개별 속성값을 변수로 다룹니다.

#### 기본 형식

\`\`\`
형식: { <x1, x2, ...> | P(x1, x2, ...) }
의미: 조건 P를 만족하는 속성값 조합 <x1, x2, ...>의 집합
\`\`\`

#### 예시: 가격 10만원 이상 상품의 이름과 가격

**문제:** 가격이 10만원 이상인 상품의 이름과 가격만 조회하시오.

\`\`\`
관계 해석:
{ <n, p> | ∃id,cid,s(Products(id, n, cid, p, s) ∧ p > 100000) }

해석 (일반 언어):
"이름(n)과 가격(p) 쌍 중에서,
 id, cid(category_id), s(stock) 값이 존재하여(∃),
 Products 테이블에 (id, n, cid, p, s) 튜플이 있고(∧),
 가격 p가 10만원을 초과하는 모든 <n, p> 쌍"

변수 설명:
- n: name (상품명)
- p: price (가격)
- id: 상품 ID
- cid: category_id (카테고리 ID)
- s: stock (재고)

의미: "Products(id, name, category_id, price, stock) 테이블에서
      가격이 10만원 초과인 상품의 이름과 가격"

동등한 SQL:
SELECT name, price
FROM products
WHERE price > 100000;
\`\`\`

**TRC vs DRC 비교:**

| 측면 | TRC | DRC |
|------|-----|-----|
| **변수 단위** | 튜플 전체 (예: \`t ∈ Products\`) | 개별 속성값 (예: \`<n, p>\`) |
| **표현 방식** | \`{ t \| t.price > 100000 }\` | \`{ <n, p> \| Products(...) ∧ p > 100000 }\` |
| **사용 편의성** | 전체 행을 다룰 때 간단 | 특정 열만 추출할 때 명확 |
| **SQL 유사성** | SELECT * 에 가까움 | SELECT 특정컬럼 에 가까움 |

### 관계 대수 vs 관계 해석 vs SQL

| 특성 | 관계 대수 | 관계 해석 | SQL |
|------|----------|----------|-----|
| **패러다임** | 절차적 (How) | 선언적 (What) | 선언적 (What) |
| **기반** | 집합 연산 | 수학 논리 (1차 술어 논리) | 관계 해석 기반 |
| **변수** | 릴레이션 | 튜플 또는 도메인 값 | 테이블/컬럼 |
| **표현력** | 동일 | 동일 (안전한 표현식 한정) | 동일 + 확장 (집계 등) |

> **Codd의 정리:** 관계 대수와 (안전한) 관계 해석의 표현력은 동등합니다. SQL은 이 둘에 집계 함수, 정렬 등을 추가한 것입니다.

### 안전한 표현식 (Safe Expression)

관계 해석에서는 무한 결과를 반환하는 표현식이 가능합니다:
\`\`\`
{ t | ¬(t ∈ Products) }  → Products에 없는 모든 튜플 = 무한!
\`\`\`

**안전한 표현식:** 결과가 항상 유한하고 도메인 내 값만 포함하는 표현식. 실제 DBMS (SQL)는 안전한 표현식만 허용합니다.`,
          en: `## Relational Calculus

While relational algebra describes **"how" to get data** (procedural), relational calculus describes **"what" you want** (declarative). SQL is closer to relational calculus.

### Tuple Relational Calculus (TRC)

Variables represent **tuples (rows)**.

#### Basic Form

\`\`\`
Form: { t | P(t) }
Meaning: Set of all tuples t satisfying condition P
\`\`\`

**Mathematical Symbols:**
- \`∈\` (element of) : "belongs to" (member of)
- \`∧\` (conjunction) : "and" (AND)
- \`∨\` (disjunction) : "or" (OR)
- \`∃\` (existential quantifier) : "there exists"
- \`∀\` (universal quantifier) : "for all"

#### Example 1: Simple Condition Filter

**Problem:** Find products priced over 100K.

\`\`\`
Relational calculus:
{ t | t ∈ Products ∧ t.price > 100000 }

Interpretation (plain language):
"All tuples t that belong to Products (∈) and (∧) have price > 100000"

Equivalent SQL:
SELECT * FROM products WHERE price > 100000;
\`\`\`

#### Example 2: Using Existential Quantifier (∃)

**Problem:** Find customers who have placed at least one order.

\`\`\`
Relational calculus:
{ c | c ∈ Customers ∧ ∃o(o ∈ Orders ∧ o.customer_id = c.id) }

Interpretation (plain language):
"All customers c in Customers such that
 there exists (∃) an order o in Orders where (∧)
 that order's customer_id equals c.id"

Meaning: "Customers with at least one order"

Equivalent SQL:
SELECT * FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.id
);
\`\`\`

#### Example 3: Using Universal Quantifier (∀)

**Problem:** Find customers who have ordered every product.

\`\`\`
Relational calculus:
{ c | c ∈ Customers ∧
      ∀p(p ∈ Products →
          ∃oi(oi ∈ OrderItems ∧ oi.product_id = p.id ∧
              ∃o(o ∈ Orders ∧ o.id = oi.order_id ∧ o.customer_id = c.id))) }

Interpretation (plain language):
"All customers c in Customers such that
 for all products p (∀),
 the following holds:
   - there exists (∃) an order item oi where
   - that item's product_id is p.id, and (∧)
   - there exists (∃) an order o where
   - that order's id is oi.order_id, and (∧)
   - that order's customer_id is c.id"

Meaning: "Customers who have ordered all products at least once"

Equivalent SQL (relational division):
SELECT c.*
FROM customers c
WHERE NOT EXISTS (
  SELECT p.id FROM products p
  WHERE NOT EXISTS (
    SELECT 1 FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.customer_id = c.id
      AND oi.product_id = p.id
  )
);
\`\`\`

### Domain Relational Calculus (DRC)

Variables represent **domain values (attribute values)**. While TRC uses entire tuples as variables, DRC uses individual attribute values.

#### Basic Form

\`\`\`
Form: { <x1, x2, ...> | P(x1, x2, ...) }
Meaning: Set of attribute value combinations <x1, x2, ...> satisfying condition P
\`\`\`

#### Example: Name and price of products over 100K

**Problem:** Retrieve only name and price of products priced over 100K.

\`\`\`
Relational calculus:
{ <n, p> | ∃id,cid,s(Products(id, n, cid, p, s) ∧ p > 100000) }

Interpretation (plain language):
"All <name, price> pairs where
 there exist (∃) values id, cid (category_id), s (stock) such that
 tuple (id, n, cid, p, s) exists in Products and (∧)
 price p exceeds 100000"

Variable description:
- n: name (product name)
- p: price
- id: product ID
- cid: category_id
- s: stock quantity

Meaning: "From Products(id, name, category_id, price, stock) table,
         return name and price where price > 100000"

Equivalent SQL:
SELECT name, price
FROM products
WHERE price > 100000;
\`\`\`

**TRC vs DRC Comparison:**

| Aspect | TRC | DRC |
|--------|-----|-----|
| **Variable unit** | Entire tuple (e.g., \`t ∈ Products\`) | Individual attribute values (e.g., \`<n, p>\`) |
| **Expression style** | \`{ t \| t.price > 100000 }\` | \`{ <n, p> \| Products(...) ∧ p > 100000 }\` |
| **Ease of use** | Simpler for entire rows | Clearer for specific columns |
| **SQL similarity** | Closer to SELECT * | Closer to SELECT specific_columns |

### Relational Algebra vs Calculus vs SQL

| Feature | Relational Algebra | Relational Calculus | SQL |
|---------|-------------------|-------------------|-----|
| **Paradigm** | Procedural (How) | Declarative (What) | Declarative (What) |
| **Based on** | Set operations | Math logic (first-order predicate logic) | Based on calculus |
| **Variables** | Relations | Tuples or domain values | Tables/columns |
| **Expressive power** | Equal | Equal (safe expressions only) | Equal + extensions (aggregates, etc.) |

> **Codd's Theorem:** Relational algebra and (safe) relational calculus have equivalent expressive power. SQL adds aggregate functions, sorting, etc. on top of both.

### Safe Expressions

Relational calculus can express queries that return infinite results:
\`\`\`
{ t | ¬(t ∈ Products) }  → All tuples NOT in Products = infinite!
\`\`\`

**Safe expression:** An expression whose result is always finite and contains only values from the domain. Real DBMS (SQL) only allow safe expressions.`,
        },
      },
      {
        id: 'normalization-theory',
        title: { ko: '정규화 이론 심화', en: 'Normalization Theory Deep Dive' },
        level: 'intermediate',
        content: {
          ko: `## 함수적 종속 (Functional Dependency)

정규화의 핵심 이론입니다. 속성 집합 X가 Y를 **함수적으로 결정**하면 X → Y로 표기합니다.

\`\`\`
학번 → 이름         (학번이 정해지면 이름이 하나로 결정됨)
{학번, 과목} → 성적  (학번+과목이 정해지면 성적이 결정됨)
\`\`\`

### FD의 종류

| 종류 | 정의 | 예시 |
|------|------|------|
| **완전 함수적 종속** | X의 진부분집합이 Y를 결정하지 못함 | {학번,과목} → 성적 |
| **부분 함수적 종속** | X의 진부분집합이 Y를 결정함 | {학번,과목} → 이름 (학번만으로 충분) |
| **이행적 종속** | X → Y → Z (X→Z가 간접적) | 학번 → 학과 → 학과장 |

### Armstrong의 공리 (Axioms)

FD를 추론하는 기본 규칙입니다:

| 공리 | 설명 | 예시 |
|------|------|------|
| **반사 규칙** | Y ⊆ X이면 X → Y | {A,B} → A |
| **첨가 규칙** | X → Y이면 XZ → YZ | A → B이면 AC → BC |
| **이행 규칙** | X → Y, Y → Z이면 X → Z | A → B, B → C이면 A → C |

**유도 규칙:**
- **합집합**: X → Y, X → Z이면 X → YZ
- **분해**: X → YZ이면 X → Y, X → Z
- **가이행**: X → Y, WY → Z이면 WX → Z

### 클로저 (Closure)

속성 집합 X의 클로저 X⁺는 X에서 FD로 결정할 수 있는 **모든 속성의 집합**입니다.

\`\`\`
FD: A → B, B → C, C → D

A⁺ = {A, B, C, D}   (A가 후보키!)
B⁺ = {B, C, D}      (B는 A를 결정 못함 → 후보키 아님)
\`\`\`

**후보키 판별:** X⁺가 모든 속성을 포함하면 X는 **슈퍼키**, 그 중 최소 집합이 **후보키**

### 정규형 심화

**1NF (제1정규형):**
- 모든 속성값이 원자값 (반복 그룹 없음)

**2NF (제2정규형):**
- 1NF + 모든 비주요 속성이 기본키에 **완전 함수적 종속**
\`\`\`
위반 예: 수강(학번, 과목번호, 이름, 성적)
학번 → 이름 (부분 종속!) → 분리 필요
\`\`\`

**3NF (제3정규형):**
- 2NF + **이행적 종속** 없음
\`\`\`
위반 예: 학생(학번, 학과, 학과장)
학번 → 학과 → 학과장 (이행 종속!) → 학과 테이블 분리
\`\`\`

**BCNF (Boyce-Codd 정규형):**
- 모든 결정자가 **후보키**
- 3NF보다 엄격: 3NF를 만족해도 BCNF 위반 가능
\`\`\`
위반 예: 수업(학생, 과목, 교수)
FD: 교수 → 과목 (교수가 결정자이지만 후보키가 아님!)
→ 교수-과목 테이블 분리
\`\`\`

### 무손실 분해 (Lossless Decomposition)

정규화를 위해 테이블을 분해할 때, **자연 조인으로 원래 데이터를 정확히 복원**할 수 있어야 합니다.

\`\`\`
분해 조건: R을 R1, R2로 분해할 때
R1 ∩ R2 → R1 또는 R1 ∩ R2 → R2 이면 무손실 분해
\`\`\`

\`\`\`sql
-- 나쁜 분해 (정보 손실)
-- 원본: (학생, 과목, 교수)
-- T1(학생, 과목), T2(과목, 교수) → 조인하면 가짜 행 발생 가능!

-- 좋은 분해 (무손실)
-- T1(학생, 과목, 교수), T2(교수, 과목) → 교수→과목 FD가 공통 속성에 있음
\`\`\`

### 종속성 보존 (Dependency Preservation)

분해된 테이블들에서 원래 FD를 모두 **로컬하게 검증**할 수 있어야 합니다.

> **실무 지침:** BCNF와 종속성 보존을 동시에 달성할 수 없는 경우가 있습니다. 이때는 3NF로 타협하는 것이 일반적입니다.

### 다치 종속 (Multi-valued Dependency, MVD)

하나의 속성이 다른 속성의 **값 집합을 독립적으로 결정**하는 관계입니다.

\`\`\`
교수(이름, 과목, 취미)

김교수 | DB     | 등산
김교수 | DB     | 독서
김교수 | 네트워크 | 등산
김교수 | 네트워크 | 독서  ← 과목과 취미의 모든 조합이 존재해야 함

이름 →→ 과목   (이름이 과목 집합을 결정)
이름 →→ 취미   (이름이 취미 집합을 결정)
과목과 취미는 서로 독립 → 불필요한 중복!
\`\`\`

### 4NF (제4정규형)

- BCNF + **비자명 다치 종속의 결정자가 슈퍼키**

\`\`\`
위반: 교수(이름, 과목, 취미) — 이름 →→ 과목, 이름 →→ 취미
해결: 교수_과목(이름, 과목) + 교수_취미(이름, 취미) 로 분해
\`\`\`

\`\`\`sql
-- 4NF 위반 상태
CREATE TABLE professor_bad (
  name    VARCHAR(50),
  course  VARCHAR(50),
  hobby   VARCHAR(50)
);
-- 김교수 × 2과목 × 2취미 = 4행 (중복!)

-- 4NF 분해
CREATE TABLE professor_courses (
  name    VARCHAR(50),
  course  VARCHAR(50),
  PRIMARY KEY (name, course)
);
CREATE TABLE professor_hobbies (
  name    VARCHAR(50),
  hobby   VARCHAR(50),
  PRIMARY KEY (name, hobby)
);
-- 김교수: 2행 + 2행 = 4행 → 중복 없음!
\`\`\`

### 정규형 관계도

정규화는 단계적으로 진행되며, 각 단계는 이전 단계의 조건을 모두 만족합니다.

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  1NF (제1정규형) - 모든 릴레이션의 시작점                      │
│  • 원자값만 허용 (배열, 중첩 테이블 불가)                      │
└─────────────────────────────────────────────────────────────┘
                         ↓ 포함 관계 (⊃)
┌─────────────────────────────────────────────────────────────┐
│  2NF (제2정규형)                                             │
│  • 1NF 만족 + 부분 함수 종속 제거                            │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  3NF (제3정규형) ← 실무 목표                                 │
│  • 2NF 만족 + 이행 함수 종속 제거                            │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  BCNF (Boyce-Codd 정규형)                                   │
│  • 3NF 만족 + 모든 결정자가 후보키                           │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  4NF (제4정규형)                                             │
│  • BCNF 만족 + 다치 종속 제거                                │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  5NF (제5정규형)                                             │
│  • 4NF 만족 + 조인 종속 제거                                 │
└─────────────────────────────────────────────────────────────┘
\`\`\`

**포함 관계 (⊃) 의미:**
- \`1NF ⊃ 2NF\`: "1NF는 2NF를 포함한다" = "모든 2NF 릴레이션은 1NF이다"
- 상위 정규형일수록 더 엄격한 조건을 만족

**실무 권장사항:**
- 대부분의 애플리케이션: **3NF까지 정규화** (성능과 무결성의 균형)
- BCNF 이상: 특수한 경우에만 적용 (과도한 정규화는 조인 증가)
- 읽기 중심 시스템: 의도적 비정규화(denormalization)로 성능 최적화`,
          en: `## Functional Dependencies (FD)

The core theory behind normalization. If attribute set X **functionally determines** Y, we write X → Y.

\`\`\`
StudentID → Name           (Given StudentID, Name is uniquely determined)
{StudentID, Course} → Grade (Given both, Grade is determined)
\`\`\`

### Types of FDs

| Type | Definition | Example |
|------|-----------|---------|
| **Full FD** | No proper subset of X determines Y | {StudentID, Course} → Grade |
| **Partial FD** | A proper subset of X determines Y | {StudentID, Course} → Name (StudentID alone suffices) |
| **Transitive FD** | X → Y → Z (X→Z is indirect) | StudentID → Dept → DeptHead |

### Armstrong's Axioms

Fundamental rules for inferring FDs:

| Axiom | Description | Example |
|-------|-------------|---------|
| **Reflexivity** | If Y ⊆ X then X → Y | {A,B} → A |
| **Augmentation** | If X → Y then XZ → YZ | A → B implies AC → BC |
| **Transitivity** | If X → Y, Y → Z then X → Z | A → B, B → C implies A → C |

**Derived rules:**
- **Union**: X → Y, X → Z implies X → YZ
- **Decomposition**: X → YZ implies X → Y, X → Z
- **Pseudotransitivity**: X → Y, WY → Z implies WX → Z

### Closure

The closure X⁺ of attribute set X is the **set of all attributes** determinable from X via FDs.

\`\`\`
FDs: A → B, B → C, C → D

A⁺ = {A, B, C, D}   (A is a candidate key!)
B⁺ = {B, C, D}      (B cannot determine A → not a candidate key)
\`\`\`

**Candidate key test:** If X⁺ contains all attributes, X is a **superkey**; the minimal such set is a **candidate key**.

### Normal Forms In Depth

**1NF (First Normal Form):**
- All attribute values are atomic (no repeating groups)

**2NF (Second Normal Form):**
- 1NF + every non-key attribute is **fully functionally dependent** on the primary key
\`\`\`
Violation: Enrollment(StudentID, CourseID, StudentName, Grade)
StudentID → StudentName (partial dependency!) → must decompose
\`\`\`

**3NF (Third Normal Form):**
- 2NF + no **transitive dependencies**
\`\`\`
Violation: Student(StudentID, Dept, DeptHead)
StudentID → Dept → DeptHead (transitive!) → split into Dept table
\`\`\`

**BCNF (Boyce-Codd Normal Form):**
- Every determinant must be a **candidate key**
- Stricter than 3NF: a relation can satisfy 3NF but violate BCNF
\`\`\`
Violation: Class(Student, Course, Professor)
FD: Professor → Course (Professor is a determinant but NOT a candidate key!)
→ Decompose into Professor-Course table
\`\`\`

### Lossless Decomposition

When decomposing tables for normalization, **natural join must exactly reconstruct the original data**.

\`\`\`
Condition: When decomposing R into R1, R2:
R1 ∩ R2 → R1  OR  R1 ∩ R2 → R2  guarantees lossless decomposition
\`\`\`

\`\`\`sql
-- Bad decomposition (information loss)
-- Original: (Student, Course, Professor)
-- T1(Student, Course), T2(Course, Professor) → Join may produce spurious tuples!

-- Good decomposition (lossless)
-- T1(Student, Course, Professor), T2(Professor, Course) → FD Professor→Course on common attrs
\`\`\`

### Dependency Preservation

All original FDs should be verifiable **locally** within the decomposed tables.

> **Practical guideline:** It's sometimes impossible to achieve both BCNF and dependency preservation. In such cases, settling for 3NF is the common practice.

### Multi-valued Dependency (MVD)

An attribute **independently determines a set of values** for another attribute.

\`\`\`
Professor(Name, Course, Hobby)

Prof Kim | DB      | Hiking
Prof Kim | DB      | Reading
Prof Kim | Networks| Hiking
Prof Kim | Networks| Reading  ← All combinations of courses × hobbies must exist

Name →→ Course   (Name determines the set of courses)
Name →→ Hobby    (Name determines the set of hobbies)
Courses and hobbies are independent → unnecessary redundancy!
\`\`\`

### 4NF (Fourth Normal Form)

- BCNF + **every non-trivial MVD's determinant is a superkey**

\`\`\`
Violation: Professor(Name, Course, Hobby) — Name →→ Course, Name →→ Hobby
Solution: Professor_Courses(Name, Course) + Professor_Hobbies(Name, Hobby)
\`\`\`

\`\`\`sql
-- 4NF violation
CREATE TABLE professor_bad (
  name    VARCHAR(50),
  course  VARCHAR(50),
  hobby   VARCHAR(50)
);
-- Prof Kim × 2 courses × 2 hobbies = 4 rows (redundant!)

-- 4NF decomposition
CREATE TABLE professor_courses (
  name    VARCHAR(50),
  course  VARCHAR(50),
  PRIMARY KEY (name, course)
);
CREATE TABLE professor_hobbies (
  name    VARCHAR(50),
  hobby   VARCHAR(50),
  PRIMARY KEY (name, hobby)
);
-- Prof Kim: 2 rows + 2 rows = 4 rows total → no redundancy!
\`\`\`

### Normal Form Hierarchy

Normalization proceeds in stages, with each stage satisfying all conditions of the previous stages.

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│  1NF (First Normal Form) - Starting point for all relations  │
│  • Only atomic values (no arrays or nested tables)           │
└─────────────────────────────────────────────────────────────┘
                         ↓ Containment (⊃)
┌─────────────────────────────────────────────────────────────┐
│  2NF (Second Normal Form)                                    │
│  • Satisfies 1NF + eliminates partial dependencies          │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  3NF (Third Normal Form) ← Practical target                 │
│  • Satisfies 2NF + eliminates transitive dependencies       │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  BCNF (Boyce-Codd Normal Form)                              │
│  • Satisfies 3NF + every determinant is a candidate key     │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  4NF (Fourth Normal Form)                                    │
│  • Satisfies BCNF + eliminates multivalued dependencies     │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│  5NF (Fifth Normal Form)                                     │
│  • Satisfies 4NF + eliminates join dependencies             │
└─────────────────────────────────────────────────────────────┘
\`\`\`

**Containment relationship (⊃) meaning:**
- \`1NF ⊃ 2NF\`: "1NF contains 2NF" = "Every 2NF relation is also 1NF"
- Higher normal forms have stricter requirements

**Practical recommendations:**
- Most applications: **Normalize to 3NF** (balance between performance and integrity)
- BCNF and beyond: Apply only in special cases (over-normalization increases joins)
- Read-heavy systems: Intentional denormalization for performance optimization`,
        },
      },
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

예시 데이터로 각 JOIN 유형을 이해해봅시다:
- **테이블 A**: 값 `{1, 2}`
- **테이블 B**: 값 `{2, 3}`

| JOIN 유형 | 결과 | 설명 | 집합 개념 |
|-----------|------|------|----------|
| **INNER JOIN** | `2` | 양쪽 모두에 존재하는 값만 | 교집합 (A ∩ B) |
| **LEFT JOIN** | `1, 2` | A의 모든 값 + B와 일치하는 값 | A 전체 |
| **RIGHT JOIN** | `2, 3` | B의 모든 값 + A와 일치하는 값 | B 전체 |
| **FULL OUTER JOIN** | `1, 2, 3` | 양쪽 테이블의 모든 값 | 합집합 (A ∪ B) |

**💡 실전 예시:**
\`\`\`sql
-- 테이블 A (customers): id가 1, 2인 고객
-- 테이블 B (orders): customer_id가 2, 3인 주문

-- INNER JOIN: 주문이 있는 고객만 (id=2)
SELECT * FROM customers c INNER JOIN orders o ON c.id = o.customer_id;

-- LEFT JOIN: 모든 고객 + 주문 정보 (id=1은 주문 NULL, id=2는 주문 있음)
SELECT * FROM customers c LEFT JOIN orders o ON c.id = o.customer_id;
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

Let's understand each JOIN type with example data:
- **Table A**: values `{1, 2}`
- **Table B**: values `{2, 3}`

| JOIN Type | Result | Description | Set Concept |
|-----------|--------|-------------|-------------|
| **INNER JOIN** | `2` | Only values present in both | Intersection (A ∩ B) |
| **LEFT JOIN** | `1, 2` | All values from A + matching from B | All of A |
| **RIGHT JOIN** | `2, 3` | All values from B + matching from A | All of B |
| **FULL OUTER JOIN** | `1, 2, 3` | All values from both tables | Union (A ∪ B) |

**💡 Practical Example:**
\`\`\`sql
-- Table A (customers): id 1, 2
-- Table B (orders): customer_id 2, 3

-- INNER JOIN: Only customers with orders (id=2)
SELECT * FROM customers c INNER JOIN orders o ON c.id = o.customer_id;

-- LEFT JOIN: All customers + order info (id=1 has NULL orders, id=2 has orders)
SELECT * FROM customers c LEFT JOIN orders o ON c.id = o.customer_id;
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
\`\`\`

### 상관 서브쿼리 (Correlated Subquery)

외부 쿼리의 각 행에 대해 서브쿼리가 실행됩니다.

\`\`\`sql
-- 자신의 카테고리 평균보다 비싼 상품
SELECT p.name, p.price, p.category_id
FROM products p
WHERE p.price > (
  SELECT AVG(p2.price)
  FROM products p2
  WHERE p2.category_id = p.category_id  -- 외부 참조!
);
\`\`\`

**동작 원리:** 외부 테이블의 각 행마다 서브쿼리가 다시 실행됨 → 행 수 × 서브쿼리 비용

### NOT EXISTS vs NOT IN

\`\`\`sql
-- 방법 1: NOT IN (NULL 주의!)
SELECT name FROM customers
WHERE id NOT IN (SELECT customer_id FROM orders);
-- ⚠️ orders.customer_id에 NULL이 있으면 결과가 비어버림

-- 방법 2: NOT EXISTS (NULL-safe, 권장)
SELECT c.name FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);

-- 방법 3: LEFT JOIN + IS NULL
SELECT c.name FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;
\`\`\`

### 서브쿼리 vs JOIN 성능

| 패턴 | 장점 | 단점 |
|------|------|------|
| **서브쿼리** | 가독성, 논리적 분리 | 상관 서브쿼리는 행마다 실행 |
| **JOIN** | 옵티마이저 최적화에 유리 | 복잡한 조건에서 가독성 저하 |
| **CTE (WITH)** | 가독성 최고, 재사용 | 일부 DB에서 최적화 장벽 (PG 12+ 개선) |

> **팁:** 대부분의 모던 옵티마이저는 비상관(uncorrelated) 서브쿼리를 JOIN으로 자동 변환합니다. 상관 서브쿼리는 **EXISTS/NOT EXISTS** 형태가 성능상 유리합니다.`,
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
\`\`\`

### Correlated Subquery

The subquery executes once for each row of the outer query.

\`\`\`sql
-- Products more expensive than their category average
SELECT p.name, p.price, p.category_id
FROM products p
WHERE p.price > (
  SELECT AVG(p2.price)
  FROM products p2
  WHERE p2.category_id = p.category_id  -- outer reference!
);
\`\`\`

**How it works:** The subquery re-executes for each outer row → rows × subquery cost

### NOT EXISTS vs NOT IN

\`\`\`sql
-- Method 1: NOT IN (beware of NULLs!)
SELECT name FROM customers
WHERE id NOT IN (SELECT customer_id FROM orders);
-- ⚠️ If orders.customer_id contains NULL, result set is empty

-- Method 2: NOT EXISTS (NULL-safe, recommended)
SELECT c.name FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);

-- Method 3: LEFT JOIN + IS NULL
SELECT c.name FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;
\`\`\`

### Subquery vs JOIN Performance

| Pattern | Pros | Cons |
|---------|------|------|
| **Subquery** | Readability, logical separation | Correlated runs per row |
| **JOIN** | Optimizer-friendly | Complex conditions hurt readability |
| **CTE (WITH)** | Best readability, reusable | Optimization barrier in some DBs (PG 12+ improved) |

> **Tip:** Most modern optimizers automatically convert uncorrelated subqueries to JOINs. For correlated subqueries, **EXISTS/NOT EXISTS** form tends to perform better.`,
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
      {
        id: 'query-processing',
        title: { ko: '쿼리 처리와 최적화', en: 'Query Processing & Optimization' },
        level: 'advanced',
        content: {
          ko: `## 쿼리 처리 파이프라인

SQL 쿼리가 결과를 반환하기까지 DBMS 내부에서 거치는 단계입니다.

\`\`\`
SQL 문자열
    ↓
[1. 파싱 (Parsing)]           → 구문 분석, 파스 트리 생성
    ↓
[2. 의미 분석 (Semantic)]      → 테이블/컬럼 존재 확인, 타입 검사
    ↓
[3. 쿼리 재작성 (Rewriting)]   → 뷰 확장, 서브쿼리 변환, 상수 폴딩
    ↓
[4. 최적화 (Optimization)]     → 실행 계획 탐색, 비용 추정, 최적 계획 선택
    ↓
[5. 실행 (Execution)]          → 선택된 계획에 따라 데이터 접근 및 반환
\`\`\`

### 1. 파싱 (Parsing)

SQL 문자열을 **파스 트리(Parse Tree)**로 변환합니다.

\`\`\`sql
SELECT name FROM products WHERE price > 100000;
\`\`\`

\`\`\`
        SELECT
       /      \\
  target_list  FROM
     |          |
    name     products
               |
             WHERE
               |
          price > 100000
\`\`\`

- **어휘 분석(Lexer)**: SQL을 토큰으로 분리 (SELECT, name, FROM, ...)
- **구문 분석(Parser)**: 문법 규칙에 따라 트리 구성
- **구문 오류**: 이 단계에서 감지 (예: \`SELCT\` 오타)

### 2. 쿼리 재작성 (Query Rewriting)

파스 트리를 더 효율적인 형태로 변환합니다.

| 변환 | 설명 | 예시 |
|------|------|------|
| **뷰 확장** | 뷰를 원래 쿼리로 대체 | \`SELECT * FROM my_view\` → 원본 쿼리 |
| **서브쿼리 비중첩화** | 서브쿼리를 JOIN으로 변환 | \`IN (SELECT...)\` → \`JOIN\` |
| **상수 폴딩** | 상수 계산을 미리 수행 | \`WHERE x > 2+3\` → \`WHERE x > 5\` |
| **조건 하향** | WHERE 조건을 가능한 아래로 이동 | JOIN 전에 필터링 |
| **불필요 JOIN 제거** | 결과에 영향 없는 JOIN 제거 | FK가 보장된 INNER JOIN |

### 3. 옵티마이저 (Query Optimizer)

실행 계획을 탐색하고 비용을 추정하여 **최적 계획**을 선택합니다.

**비용 기반 최적화 (Cost-Based Optimization):**
\`\`\`
실행 계획 후보:
  계획 A: Seq Scan → Hash Join     비용: 1,500
  계획 B: Index Scan → Nested Loop  비용: 320   ← 선택!
  계획 C: Seq Scan → Merge Join    비용: 2,100
\`\`\`

**핵심 결정 사항:**

| 결정 | 선택지 | 영향 요인 |
|------|--------|----------|
| **접근 경로** | Seq Scan vs Index Scan vs Index Only Scan | 선택도, 테이블 크기, 인덱스 유무 |
| **조인 방법** | Nested Loop vs Hash Join vs Merge Join | 테이블 크기, 메모리, 정렬 여부 |
| **조인 순서** | n개 테이블의 조인 순서 | 중간 결과 크기 최소화 |

### 조인 알고리즘

| 알고리즘 | 원리 | 최적 상황 |
|---------|------|----------|
| **Nested Loop** | 외부 행마다 내부 테이블 스캔 | 내부 테이블에 인덱스, 작은 외부 테이블 |
| **Hash Join** | 한쪽을 해시 테이블로 빌드, 다른 쪽으로 프로빙 | 등호 조인, 메모리 충분 |
| **Merge Join** | 양쪽 정렬 후 병합 | 이미 정렬된 데이터, 범위 조인 |

\`\`\`sql
-- PostgreSQL에서 조인 알고리즘 확인
EXPLAIN ANALYZE
SELECT o.id, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.id;
-- → Hash Join, Nested Loop, Merge Join 중 하나 표시
\`\`\`

### 카디널리티 추정 (Cardinality Estimation)

옵티마이저의 비용 추정 정확도를 좌우하는 핵심입니다.

\`\`\`
테이블 products: 1,000행
조건: category_id = 3

통계 정보:
- n_distinct(category_id) = 20
- 균등 분포 가정: 1,000 / 20 = 50행 예상

실제: 300행 → 추정 오류 → 잘못된 계획 선택 가능!
\`\`\`

**추정 오류의 원인:**
- **오래된 통계** → \`ANALYZE\` 실행으로 갱신
- **상관된 컬럼** → 독립 가정의 한계 (PG 10+: \`CREATE STATISTICS\`로 다중 컬럼 통계)
- **비균등 분포** → Most Common Values (MCV) 통계로 보완

\`\`\`sql
-- 다중 컬럼 통계 생성 (PostgreSQL 10+)
CREATE STATISTICS stats_city_premium ON city, is_premium FROM customers;
ANALYZE customers;
\`\`\`

### 실행 엔진 (Execution Engine)

**Volcano / Iterator 모델:**
- 각 연산자가 \`next()\` 함수를 제공
- 상위 연산자가 하위에 \`next()\`를 호출하여 행을 한 건씩 당겨옴 (pull model)
- PostgreSQL이 사용하는 모델

\`\`\`
π_name → next() → σ_price>100000 → next() → Seq Scan → 디스크에서 행 읽기
\`\`\`

**Materialization 모델:**
- 각 연산자가 전체 결과를 메모리에 생성 후 상위에 전달
- 메모리 사용량이 큼, 단순한 쿼리에 적합`,
          en: `## Query Processing Pipeline

The stages a SQL query goes through inside the DBMS before returning results.

\`\`\`
SQL string
    ↓
[1. Parsing]                   → Syntax analysis, parse tree generation
    ↓
[2. Semantic Analysis]          → Verify tables/columns exist, type checking
    ↓
[3. Query Rewriting]            → View expansion, subquery transformation, constant folding
    ↓
[4. Optimization]               → Explore execution plans, estimate costs, select optimal plan
    ↓
[5. Execution]                  → Access data and return results per selected plan
\`\`\`

### 1. Parsing

Converts the SQL string into a **Parse Tree**.

\`\`\`sql
SELECT name FROM products WHERE price > 100000;
\`\`\`

\`\`\`
        SELECT
       /      \\
  target_list  FROM
     |          |
    name     products
               |
             WHERE
               |
          price > 100000
\`\`\`

- **Lexer**: Splits SQL into tokens (SELECT, name, FROM, ...)
- **Parser**: Builds tree according to grammar rules
- **Syntax errors**: Detected at this stage (e.g., \`SELCT\` typo)

### 2. Query Rewriting

Transforms the parse tree into a more efficient form.

| Transformation | Description | Example |
|---------------|-------------|---------|
| **View expansion** | Replace view with original query | \`SELECT * FROM my_view\` → original query |
| **Subquery unnesting** | Convert subquery to JOIN | \`IN (SELECT...)\` → \`JOIN\` |
| **Constant folding** | Pre-compute constants | \`WHERE x > 2+3\` → \`WHERE x > 5\` |
| **Predicate pushdown** | Move WHERE conditions down | Filter before JOIN |
| **Redundant JOIN elimination** | Remove JOINs that don't affect results | FK-guaranteed INNER JOINs |

### 3. Query Optimizer

Explores execution plans and estimates costs to select the **optimal plan**.

**Cost-Based Optimization (CBO):**
\`\`\`
Candidate plans:
  Plan A: Seq Scan → Hash Join     cost: 1,500
  Plan B: Index Scan → Nested Loop  cost: 320   ← Selected!
  Plan C: Seq Scan → Merge Join    cost: 2,100
\`\`\`

**Key Decisions:**

| Decision | Options | Factors |
|----------|---------|---------|
| **Access path** | Seq Scan vs Index Scan vs Index Only Scan | Selectivity, table size, index availability |
| **Join method** | Nested Loop vs Hash Join vs Merge Join | Table sizes, memory, sort order |
| **Join ordering** | Order of joining n tables | Minimize intermediate result sizes |

### Join Algorithms

| Algorithm | Principle | Best For |
|-----------|-----------|----------|
| **Nested Loop** | Scan inner table for each outer row | Index on inner table, small outer table |
| **Hash Join** | Build hash table on one side, probe with other | Equality joins, sufficient memory |
| **Merge Join** | Sort both sides, then merge | Pre-sorted data, range joins |

\`\`\`sql
-- Check join algorithm in PostgreSQL
EXPLAIN ANALYZE
SELECT o.id, c.name
FROM orders o
JOIN customers c ON o.customer_id = c.id;
-- → Shows Hash Join, Nested Loop, or Merge Join
\`\`\`

### Cardinality Estimation

The key factor determining the accuracy of the optimizer's cost estimates.

\`\`\`
Table products: 1,000 rows
Condition: category_id = 3

Statistics:
- n_distinct(category_id) = 20
- Uniform distribution assumption: 1,000 / 20 = 50 rows expected

Actual: 300 rows → estimation error → possibly wrong plan!
\`\`\`

**Sources of estimation errors:**
- **Stale statistics** → Run \`ANALYZE\` to refresh
- **Correlated columns** → Independence assumption limitation (PG 10+: \`CREATE STATISTICS\` for multi-column stats)
- **Non-uniform distribution** → Compensated by Most Common Values (MCV) statistics

\`\`\`sql
-- Create multi-column statistics (PostgreSQL 10+)
CREATE STATISTICS stats_city_premium ON city, is_premium FROM customers;
ANALYZE customers;
\`\`\`

### Execution Engine

**Volcano / Iterator Model:**
- Each operator provides a \`next()\` function
- Parent operator calls \`next()\` on child to pull one row at a time (pull model)
- Used by PostgreSQL

\`\`\`
π_name → next() → σ_price>100000 → next() → Seq Scan → read row from disk
\`\`\`

**Materialization Model:**
- Each operator produces its entire result in memory, then passes it up
- Higher memory usage, suitable for simple queries`,
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

### 해시 인덱스 (Hash Index)

해시 함수를 사용하여 키를 버킷에 매핑하는 인덱스입니다.

\`\`\`sql
-- PostgreSQL: 해시 인덱스 생성
CREATE INDEX idx_customers_email_hash ON customers USING HASH(email);
\`\`\`

**구조:**
\`\`\`
해시 함수: h(key) → 버킷 번호
버킷 0: [key1→ctid, key5→ctid, ...]
버킷 1: [key2→ctid, key8→ctid, ...]
버킷 2: [key3→ctid, ...]
...
\`\`\`

| 특성 | B-tree | Hash |
|------|--------|------|
| 등호 (=) | ✓ O(log N) | ✓ **O(1)** |
| 범위 (<, >, BETWEEN) | ✓ | ✗ 불가능 |
| 정렬 (ORDER BY) | ✓ | ✗ 불가능 |
| WAL 지원 | ✓ | ✓ (PG 10+) |
| 크기 | 더 큼 | 더 작음 |

> **실무:** PostgreSQL에서는 B-tree가 거의 모든 경우에 충분합니다. 해시 인덱스는 매우 큰 테이블의 정확 일치 검색에서만 미세한 이점이 있습니다.

### 비트맵 인덱스 (Bitmap Index)

각 값에 대해 **비트 배열**을 생성하는 인덱스입니다. 선택도가 낮은 컬럼(성별, 상태 등)에 효과적입니다.

\`\`\`
products.status 컬럼: 'active', 'inactive', 'discontinued'

active:       [1, 0, 1, 1, 0, 0, 1, 1, ...]
inactive:     [0, 1, 0, 0, 1, 0, 0, 0, ...]
discontinued: [0, 0, 0, 0, 0, 1, 0, 0, ...]

WHERE status = 'active' AND category_id = 3
→ bitmap_status_active AND bitmap_category_3 → 비트 AND 연산으로 빠른 필터링
\`\`\`

- **Oracle**: 명시적 CREATE BITMAP INDEX 지원
- **PostgreSQL**: 명시적 비트맵 인덱스는 없지만, 쿼리 실행 시 **Bitmap Index Scan**으로 여러 인덱스를 비트맵 AND/OR 결합
- **MySQL**: 비트맵 인덱스 미지원

\`\`\`sql
-- PostgreSQL: 비트맵 스캔 확인 (EXPLAIN에서 볼 수 있음)
EXPLAIN ANALYZE
SELECT * FROM products WHERE category_id = 3 AND price > 50000;
-- → Bitmap Index Scan on idx_products_category
-- → Bitmap Heap Scan on products
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
| actual time | 실제 실행 시간 (ms) |

### B-tree 내부 구조

B-tree는 거의 모든 RDBMS 인덱스의 핵심 자료구조입니다.

**구조 특징:**
- **루트(Root)** → **내부 노드(Internal)** → **리프 노드(Leaf)** 의 트리 구조
- 각 노드는 디스크의 한 페이지(보통 8KB)에 저장
- 모든 리프 노드는 같은 깊이 → **균형 트리(Balanced Tree)**
- 리프 노드는 서로 연결 리스트로 연결 → 범위 검색에 효율적

**검색 복잡도:**
- 1백만 행: ~3회 디스크 I/O (트리 높이 3)
- 1억 행: ~4회 디스크 I/O (트리 높이 4)
- Full Table Scan 대비 **수십~수백 배** 빠름

**B-tree가 지원하는 연산:**
\`\`\`
=   : 정확 일치 (루트 → 리프까지 탐색)
<,> : 범위 검색 (리프 노드 연결 리스트 순회)
BETWEEN, IN : 범위/다중 값 검색
ORDER BY : 인덱스 순서 = 정렬 순서 (Sort 생략 가능)
MIN/MAX : 리프 노드의 양 끝에서 바로 반환
\`\`\`

### 인덱스 설계 전략

**복합 인덱스의 열 순서가 중요합니다:**
\`\`\`sql
-- 인덱스: (customer_id, order_date)
SELECT * FROM orders WHERE customer_id = 5;                     -- ✓ 사용
SELECT * FROM orders WHERE customer_id = 5 AND order_date > '2024-01-01'; -- ✓ 사용
SELECT * FROM orders WHERE order_date > '2024-01-01';           -- ✗ 미사용 (선두 열 없음)
\`\`\`

**규칙: 등호(=) 조건 열을 앞에, 범위 조건 열을 뒤에 배치**

### 쿼리 비용 모델 (Cost Model)

옵티마이저는 각 실행 계획의 비용을 추정하여 최적 계획을 선택합니다:

| 요소 | 설명 | 비용 |
|------|------|------|
| **Sequential I/O** | 디스크 순차 읽기 | 1 (기준) |
| **Random I/O** | 디스크 랜덤 읽기 | ~4배 (SSD) / ~50배 (HDD) |
| **CPU 연산** | 행 비교, 필터링 | 매우 작음 |

\`\`\`sql
-- 비용 확인 예시
EXPLAIN SELECT * FROM orders WHERE customer_id = 5;
-- cost=0.29..8.31  → 시작비용 0.29, 총비용 8.31
-- 비용 단위는 seq_page_cost(1.0) 기준 상대값
\`\`\``,
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

### Hash Index

An index that maps keys to buckets using a hash function.

\`\`\`sql
-- PostgreSQL: create hash index
CREATE INDEX idx_customers_email_hash ON customers USING HASH(email);
\`\`\`

**Structure:**
\`\`\`
Hash function: h(key) → bucket number
Bucket 0: [key1→ctid, key5→ctid, ...]
Bucket 1: [key2→ctid, key8→ctid, ...]
Bucket 2: [key3→ctid, ...]
...
\`\`\`

| Feature | B-tree | Hash |
|---------|--------|------|
| Equality (=) | ✓ O(log N) | ✓ **O(1)** |
| Range (<, >, BETWEEN) | ✓ | ✗ Not possible |
| Sorting (ORDER BY) | ✓ | ✗ Not possible |
| WAL support | ✓ | ✓ (PG 10+) |
| Size | Larger | Smaller |

> **In practice:** B-tree is sufficient for almost all cases in PostgreSQL. Hash indexes offer marginal benefit only for exact-match lookups on very large tables.

### Bitmap Index

An index that creates a **bit array** for each distinct value. Effective for low-selectivity columns (gender, status, etc.).

\`\`\`
products.status column: 'active', 'inactive', 'discontinued'

active:       [1, 0, 1, 1, 0, 0, 1, 1, ...]
inactive:     [0, 1, 0, 0, 1, 0, 0, 0, ...]
discontinued: [0, 0, 0, 0, 0, 1, 0, 0, ...]

WHERE status = 'active' AND category_id = 3
→ bitmap_status_active AND bitmap_category_3 → fast filtering via bitwise AND
\`\`\`

- **Oracle**: Explicit CREATE BITMAP INDEX
- **PostgreSQL**: No explicit bitmap index, but uses **Bitmap Index Scan** at query time to combine multiple indexes via bitmap AND/OR
- **MySQL**: No bitmap index support

\`\`\`sql
-- PostgreSQL: see bitmap scan in action
EXPLAIN ANALYZE
SELECT * FROM products WHERE category_id = 3 AND price > 50000;
-- → Bitmap Index Scan on idx_products_category
-- → Bitmap Heap Scan on products
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
| actual time | Actual execution time (ms) |

### B-tree Internal Structure

B-tree is the core data structure behind nearly all RDBMS indexes.

**Structure:**
- **Root** → **Internal Nodes** → **Leaf Nodes** tree structure
- Each node is stored in one disk page (typically 8KB)
- All leaf nodes are at the same depth → **Balanced Tree**
- Leaf nodes are linked via a doubly linked list → efficient range scans

**Search Complexity:**
- 1 million rows: ~3 disk I/Os (tree height 3)
- 100 million rows: ~4 disk I/Os (tree height 4)
- **10x–100x faster** than Full Table Scan

**Operations B-tree Supports:**
\`\`\`
=       : Exact match (traverse root → leaf)
<, >    : Range scan (follow leaf linked list)
BETWEEN, IN : Range / multi-value lookup
ORDER BY : Index order = sort order (skip Sort step)
MIN/MAX : Return directly from leaf endpoints
\`\`\`

### Index Design Strategy

**Column order in composite indexes matters:**
\`\`\`sql
-- Index: (customer_id, order_date)
SELECT * FROM orders WHERE customer_id = 5;                     -- ✓ Used
SELECT * FROM orders WHERE customer_id = 5 AND order_date > '2024-01-01'; -- ✓ Used
SELECT * FROM orders WHERE order_date > '2024-01-01';           -- ✗ Not used (leading column missing)
\`\`\`

**Rule: Place equality (=) columns first, range columns last**

### Query Cost Model

The optimizer estimates the cost of each execution plan to choose the best one:

| Factor | Description | Cost |
|--------|-------------|------|
| **Sequential I/O** | Sequential disk reads | 1 (baseline) |
| **Random I/O** | Random disk reads | ~4x (SSD) / ~50x (HDD) |
| **CPU** | Row comparison, filtering | Very small |

\`\`\`sql
-- Cost example
EXPLAIN SELECT * FROM orders WHERE customer_id = 5;
-- cost=0.29..8.31  → startup cost 0.29, total cost 8.31
-- Cost units are relative to seq_page_cost (1.0)
\`\`\``,
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
\`\`\`

### 잠금 유형 (Lock Types)

동시성 제어를 위해 데이터베이스는 다양한 잠금을 사용합니다.

**행 수준 잠금 (Row-Level Locks):**
| 잠금 모드 | 설명 | 호환성 |
|-----------|------|--------|
| **FOR SHARE** (공유 잠금) | 다른 트랜잭션도 읽기 가능 | 공유 ↔ 공유: 호환 |
| **FOR UPDATE** (배타적 잠금) | 다른 트랜잭션의 읽기/수정 차단 | 배타 ↔ 모든 잠금: 비호환 |

\`\`\`sql
-- 잠금 걸기 예시
BEGIN;
SELECT * FROM products WHERE id = 1 FOR UPDATE;
-- 이 행은 COMMIT/ROLLBACK까지 다른 트랜잭션이 수정할 수 없음
UPDATE products SET price = 50000 WHERE id = 1;
COMMIT;
\`\`\`

**테이블 수준 잠금 (Table-Level Locks, PostgreSQL):**
| 잠금 모드 | 용도 | 충돌 대상 |
|-----------|------|----------|
| ACCESS SHARE | SELECT | ACCESS EXCLUSIVE |
| ROW SHARE | SELECT FOR UPDATE | EXCLUSIVE, ACCESS EXCLUSIVE |
| ROW EXCLUSIVE | INSERT/UPDATE/DELETE | SHARE, EXCLUSIVE, ACCESS EXCLUSIVE |
| ACCESS EXCLUSIVE | VACUUM FULL, DROP TABLE | 모든 잠금 |

### 교착 상태 (Deadlock)

두 트랜잭션이 서로의 잠금을 기다리는 상태입니다.

\`\`\`
트랜잭션 A: Lock(행1) → 행2 잠금 대기...
트랜잭션 B: Lock(행2) → 행1 잠금 대기...
→ 영원히 대기 = Deadlock!
\`\`\`

\`\`\`sql
-- 교착 상태 예시
-- 트랜잭션 A                    -- 트랜잭션 B
BEGIN;                           BEGIN;
UPDATE accounts SET balance=0    UPDATE accounts SET balance=0
WHERE id = 1;                    WHERE id = 2;
-- A가 행1 잠금                  -- B가 행2 잠금
UPDATE accounts SET balance=0    UPDATE accounts SET balance=0
WHERE id = 2;                    WHERE id = 1;
-- A가 행2 대기 (B가 잠금 중)    -- B가 행1 대기 (A가 잠금 중)
-- → DEADLOCK 감지 → 한 트랜잭션 강제 ROLLBACK
\`\`\`

**교착 상태 방지 전략:**
- 모든 트랜잭션에서 **같은 순서**로 리소스에 접근
- 트랜잭션을 **가능한 짧게** 유지
- \`lock_timeout\` 설정으로 대기 시간 제한

### 2단계 잠금 (Two-Phase Locking, 2PL)

직렬 가능성(Serializability)을 보장하는 동시성 제어 프로토콜입니다.

\`\`\`
[확장 단계 (Growing Phase)] → [축소 단계 (Shrinking Phase)]
잠금 획득만 가능              잠금 해제만 가능
잠금 해제 불가                잠금 획득 불가
\`\`\`

| 변형 | 설명 |
|------|------|
| **Basic 2PL** | 축소 단계에서 잠금 해제 시작 |
| **Strict 2PL** | 커밋/롤백 시 모든 배타적 잠금 해제 |
| **Rigorous 2PL** | 커밋/롤백 시 모든 잠금(공유+배타) 해제 |

> 대부분의 상용 RDBMS는 **Strict 2PL**을 사용합니다.`,
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
\`\`\`

### Lock Types

Databases use various locks for concurrency control.

**Row-Level Locks:**
| Lock Mode | Description | Compatibility |
|-----------|-------------|---------------|
| **FOR SHARE** (Shared Lock) | Other transactions can still read | Shared ↔ Shared: Compatible |
| **FOR UPDATE** (Exclusive Lock) | Blocks other read/write | Exclusive ↔ Any lock: Incompatible |

\`\`\`sql
-- Locking example
BEGIN;
SELECT * FROM products WHERE id = 1 FOR UPDATE;
-- This row cannot be modified by others until COMMIT/ROLLBACK
UPDATE products SET price = 50000 WHERE id = 1;
COMMIT;
\`\`\`

**Table-Level Locks (PostgreSQL):**
| Lock Mode | Purpose | Conflicts With |
|-----------|---------|---------------|
| ACCESS SHARE | SELECT | ACCESS EXCLUSIVE |
| ROW SHARE | SELECT FOR UPDATE | EXCLUSIVE, ACCESS EXCLUSIVE |
| ROW EXCLUSIVE | INSERT/UPDATE/DELETE | SHARE, EXCLUSIVE, ACCESS EXCLUSIVE |
| ACCESS EXCLUSIVE | VACUUM FULL, DROP TABLE | All locks |

### Deadlock

Two transactions waiting for each other's locks indefinitely.

\`\`\`
Transaction A: Lock(row1) → waiting for row2...
Transaction B: Lock(row2) → waiting for row1...
→ Wait forever = Deadlock!
\`\`\`

\`\`\`sql
-- Deadlock example
-- Transaction A                 -- Transaction B
BEGIN;                           BEGIN;
UPDATE accounts SET balance=0    UPDATE accounts SET balance=0
WHERE id = 1;                    WHERE id = 2;
-- A locks row 1                 -- B locks row 2
UPDATE accounts SET balance=0    UPDATE accounts SET balance=0
WHERE id = 2;                    WHERE id = 1;
-- A waits for row 2 (B holds)  -- B waits for row 1 (A holds)
-- → DEADLOCK detected → one transaction force-ROLLED BACK
\`\`\`

**Deadlock Prevention Strategies:**
- Access resources in the **same order** across all transactions
- Keep transactions **as short as possible**
- Set \`lock_timeout\` to limit wait time

### Two-Phase Locking (2PL)

A concurrency control protocol that guarantees Serializability.

\`\`\`
[Growing Phase]          → [Shrinking Phase]
Can only acquire locks     Can only release locks
Cannot release locks       Cannot acquire locks
\`\`\`

| Variant | Description |
|---------|-------------|
| **Basic 2PL** | Release locks during shrinking phase |
| **Strict 2PL** | Release all exclusive locks at commit/rollback |
| **Rigorous 2PL** | Release all locks (shared + exclusive) at commit/rollback |

> Most commercial RDBMS use **Strict 2PL**.`,
        },
      },
      {
        id: 'concurrency-theory',
        title: { ko: '동시성 제어 이론', en: 'Concurrency Control Theory' },
        level: 'expert',
        content: {
          ko: `## 스케줄과 직렬 가능성 (Serializability)

동시에 실행되는 트랜잭션의 연산 순서를 **스케줄(Schedule)**이라 합니다.

### 스케줄의 유형

| 유형 | 정의 | 특징 |
|------|------|------|
| **직렬 스케줄** | 트랜잭션이 순차적으로 실행 | 항상 정확, 성능 최악 |
| **직렬 가능 스케줄** | 직렬 스케줄과 동일한 결과 | 정확하면서 동시성 허용 |
| **비직렬 가능 스케줄** | 직렬 스케줄과 다른 결과 | 데이터 불일치 발생! |

\`\`\`
직렬 스케줄 (T1 → T2):
T1: R(A) W(A)           R(B) W(B)
T2:              R(A) W(A)           R(B) W(B)

비직렬 스케줄 (인터리빙):
T1: R(A) W(A)      R(B) W(B)
T2:           R(A)            W(A) R(B) W(B)
→ 이 스케줄이 직렬 가능한가? → 충돌 그래프로 판별
\`\`\`

### 충돌 직렬 가능성 (Conflict Serializability)

두 연산이 **충돌(Conflict)**하는 조건:
1. 서로 다른 트랜잭션에 속함
2. 같은 데이터 항목에 접근
3. 둘 중 하나 이상이 쓰기(Write)

| 연산 쌍 | 충돌 여부 |
|---------|----------|
| R(A), R(A) | 비충돌 (읽기-읽기) |
| R(A), W(A) | **충돌** (읽기-쓰기) |
| W(A), R(A) | **충돌** (쓰기-읽기) |
| W(A), W(A) | **충돌** (쓰기-쓰기) |

### 선행 그래프 (Precedence Graph)

충돌 직렬 가능성을 판별하는 그래프입니다.

\`\`\`
구성 방법:
1. 각 트랜잭션을 노드로
2. Ti의 연산이 Tj의 충돌 연산보다 앞서면 Ti → Tj 간선 추가

판별:
- 사이클 없음 → 충돌 직렬 가능 ✓
- 사이클 있음 → 충돌 직렬 불가능 ✗
\`\`\`

\`\`\`
예시:
T1: R(A) W(A)      R(B) W(B)
T2:           R(A)            W(A) R(B) W(B)

충돌 쌍:
- T1.W(A) < T2.R(A) → T1 → T2
- T2.W(A) < T1.R(B) → T2 → T1  (B는 별개 데이터이므로 이건 충돌 아님!)

실제로 A에 대해만: T1 → T2
B에 대해: T1.W(B) < T2.R(B) → T1 → T2

그래프: T1 → T2 (사이클 없음 → 직렬 가능!)
\`\`\`

### 타임스탬프 순서 (Timestamp Ordering, T/O)

잠금을 사용하지 않는 동시성 제어 방식입니다.

\`\`\`
각 트랜잭션 Ti에 타임스탬프 TS(Ti) 부여
각 데이터 X에 기록:
  - W_TS(X): X를 마지막으로 쓴 트랜잭션의 타임스탬프
  - R_TS(X): X를 마지막으로 읽은 트랜잭션의 타임스탬프
\`\`\`

**규칙:**
| 연산 | 조건 | 처리 |
|------|------|------|
| Ti가 Read(X) | TS(Ti) < W_TS(X) | Ti 중단 (미래 값을 읽으려 함) |
| Ti가 Write(X) | TS(Ti) < R_TS(X) | Ti 중단 (과거 값을 덮으려 함) |
| Ti가 Write(X) | TS(Ti) < W_TS(X) | **Thomas Write Rule**: 쓰기 무시 (이미 더 최신 값 존재) |

### MVCC (다중 버전 동시성 제어)

현대 DBMS (PostgreSQL, MySQL InnoDB)가 사용하는 방식입니다.

\`\`\`
핵심 아이디어:
- 각 쓰기는 데이터의 새 버전을 생성
- 각 읽기는 트랜잭션 시작 시점의 스냅샷에서 적절한 버전을 선택
- 읽기가 쓰기를 차단하지 않음!
\`\`\`

| 방식 | 장점 | 단점 |
|------|------|------|
| **Lock-Based (2PL)** | 구현 단순, 직렬 가능성 보장 | 교착 상태, 읽기도 차단 |
| **Timestamp Ordering** | 교착 상태 없음 | 재시작(abort) 빈번 |
| **MVCC** | 읽기 비차단, 높은 동시성 | 오래된 버전 정리 필요 (VACUUM) |

> PostgreSQL은 **MVCC + SSI(Serializable Snapshot Isolation)**로 SERIALIZABLE 수준을 구현합니다.`,
          en: `## Schedules and Serializability

The order of operations from concurrent transactions is called a **Schedule**.

### Types of Schedules

| Type | Definition | Characteristics |
|------|-----------|----------------|
| **Serial Schedule** | Transactions execute sequentially | Always correct, worst performance |
| **Serializable Schedule** | Produces same result as some serial schedule | Correct with concurrency |
| **Non-serializable Schedule** | Produces different result than any serial | Data inconsistency! |

\`\`\`
Serial Schedule (T1 → T2):
T1: R(A) W(A)           R(B) W(B)
T2:              R(A) W(A)           R(B) W(B)

Non-serial Schedule (interleaved):
T1: R(A) W(A)      R(B) W(B)
T2:           R(A)            W(A) R(B) W(B)
→ Is this serializable? → Use precedence graph to determine
\`\`\`

### Conflict Serializability

Two operations **conflict** when:
1. They belong to different transactions
2. They access the same data item
3. At least one is a Write

| Operation Pair | Conflict? |
|---------------|-----------|
| R(A), R(A) | No (read-read) |
| R(A), W(A) | **Yes** (read-write) |
| W(A), R(A) | **Yes** (write-read) |
| W(A), W(A) | **Yes** (write-write) |

### Precedence Graph

A graph used to test conflict serializability.

\`\`\`
Construction:
1. Create a node for each transaction
2. If Ti's operation precedes a conflicting operation in Tj, add edge Ti → Tj

Test:
- No cycle → Conflict serializable ✓
- Has cycle → NOT conflict serializable ✗
\`\`\`

\`\`\`
Example:
T1: R(A) W(A)      R(B) W(B)
T2:           R(A)            W(A) R(B) W(B)

Conflicts on A: T1.W(A) before T2.R(A) → T1 → T2
Conflicts on B: T1.W(B) before T2.R(B) → T1 → T2

Graph: T1 → T2 (no cycle → serializable!)
\`\`\`

### Timestamp Ordering (T/O)

A concurrency control method that does NOT use locks.

\`\`\`
Each transaction Ti receives timestamp TS(Ti)
Each data item X tracks:
  - W_TS(X): timestamp of last transaction that wrote X
  - R_TS(X): timestamp of last transaction that read X
\`\`\`

**Rules:**
| Operation | Condition | Action |
|-----------|-----------|--------|
| Ti reads X | TS(Ti) < W_TS(X) | Abort Ti (trying to read a future value) |
| Ti writes X | TS(Ti) < R_TS(X) | Abort Ti (trying to overwrite a past value) |
| Ti writes X | TS(Ti) < W_TS(X) | **Thomas Write Rule**: skip write (newer value exists) |

### MVCC (Multi-Version Concurrency Control)

The approach used by modern DBMS (PostgreSQL, MySQL InnoDB).

\`\`\`
Core idea:
- Each write creates a new version of the data
- Each read selects the appropriate version from the transaction's start snapshot
- Reads never block writes!
\`\`\`

| Approach | Pros | Cons |
|----------|------|------|
| **Lock-Based (2PL)** | Simple, guarantees serializability | Deadlocks, reads blocked |
| **Timestamp Ordering** | No deadlocks | Frequent aborts |
| **MVCC** | Non-blocking reads, high concurrency | Old versions need cleanup (VACUUM) |

> PostgreSQL implements SERIALIZABLE level using **MVCC + SSI (Serializable Snapshot Isolation)**.`,
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
          ko: `## MVCC와 Dead Tuple

PostgreSQL은 **MVCC(Multi-Version Concurrency Control)** 방식으로 동작합니다. 행을 UPDATE하면 기존 행을 수정하지 않고 **새 버전을 생성**합니다.

\`\`\`
[INSERT] → Tuple(xmin=100, xmax=∞)       -- 살아있는 행
[UPDATE] → Tuple(xmin=100, xmax=200)     -- Dead Tuple (이전 버전)
           Tuple(xmin=200, xmax=∞)       -- 새 버전 (살아있는 행)
[DELETE] → Tuple(xmin=100, xmax=300)     -- Dead Tuple
\`\`\`

- **xmin**: 해당 행을 생성한 트랜잭션 ID
- **xmax**: 해당 행을 삭제/수정한 트랜잭션 ID (∞이면 현재 유효)
- **Dead Tuple**: 어떤 트랜잭션에서도 볼 수 없는 이전 버전 → VACUUM이 정리

### 테이블 팽창 (Table Bloat)

Dead tuple이 축적되면 테이블이 불필요하게 커집니다.

\`\`\`sql
-- Dead tuple 비율 확인
SELECT relname,
  n_live_tup,
  n_dead_tup,
  ROUND(n_dead_tup * 100.0 / NULLIF(n_live_tup + n_dead_tup, 0), 1) AS dead_pct,
  last_vacuum, last_autovacuum
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
\`\`\`

**팽창의 영향:**
- Sequential Scan이 불필요한 페이지를 읽어 느려짐
- 인덱스도 dead tuple을 가리켜 비효율적
- 디스크 공간 낭비

## VACUUM 종류

\`\`\`sql
-- 기본 VACUUM (공간 재사용 가능하게 표시)
VACUUM products;

-- VACUUM ANALYZE (통계 정보도 갱신)
VACUUM ANALYZE products;

-- VACUUM FULL (물리적 공간 회수 - 배타적 잠금 발생!)
VACUUM FULL products;

-- VACUUM VERBOSE (상세 로그 출력)
VACUUM VERBOSE products;
\`\`\`

| 명령 | 잠금 | 공간 회수 | 속도 | 사용 시기 |
|------|------|----------|------|----------|
| **VACUUM** | ShareUpdateExclusiveLock | 재사용 표시 | 빠름 | 일상적 유지보수 |
| **VACUUM FULL** | AccessExclusiveLock (읽기/쓰기 차단!) | 물리적 회수 (테이블 재작성) | 느림 | 대규모 DELETE 후 공간 회수 |
| **VACUUM ANALYZE** | ShareUpdateExclusiveLock | 재사용 표시 + 통계 갱신 | 빠름 | 대량 DML 후 |
| **VACUUM FREEZE** | ShareUpdateExclusiveLock | 트랜잭션 ID wraparound 방지 | 보통 | XID 임계치 도달 시 |

> ⚠️ **VACUUM FULL**은 테이블 전체를 새로 작성하므로 운영 시간에 실행하면 서비스 중단이 발생할 수 있습니다.

### ANALYZE (통계 갱신)

쿼리 옵티마이저가 최적의 실행 계획을 선택하려면 정확한 통계가 필요합니다.

\`\`\`sql
ANALYZE products;  -- 특정 테이블 통계 갱신
ANALYZE;           -- 전체 데이터베이스

-- 통계 정보 확인
SELECT attname, n_distinct, most_common_vals, correlation
FROM pg_stats
WHERE tablename = 'products';
\`\`\`

**통계가 오래되면:**
- 옵티마이저가 잘못된 실행 계획을 선택 (예: Seq Scan 대신 Index Scan이 최적인데 잘못 판단)
- JOIN 순서가 비최적
- 메모리 할당이 부정확

### autovacuum 설정과 튜닝

PostgreSQL은 **autovacuum 데몬**이 자동으로 VACUUM과 ANALYZE를 실행합니다.

\`\`\`sql
-- autovacuum 설정 확인
SELECT name, setting, short_desc FROM pg_settings
WHERE name LIKE 'autovacuum%';
\`\`\`

**핵심 파라미터:**

| 파라미터 | 기본값 | 설명 |
|---------|--------|------|
| \`autovacuum_vacuum_threshold\` | 50 | VACUUM 트리거 최소 dead tuple 수 |
| \`autovacuum_vacuum_scale_factor\` | 0.2 | 테이블 크기의 20%가 dead tuple이면 VACUUM |
| \`autovacuum_analyze_threshold\` | 50 | ANALYZE 트리거 최소 변경 행 수 |
| \`autovacuum_analyze_scale_factor\` | 0.1 | 테이블 크기의 10%가 변경되면 ANALYZE |

**트리거 공식:**
\`\`\`
VACUUM 실행 조건: dead_tuples ≥ threshold + scale_factor × n_live_tup
예) 10만 행 테이블: 50 + 0.2 × 100,000 = 20,050개 dead tuple 시 VACUUM
\`\`\`

**대용량 테이블 튜닝:**
\`\`\`sql
-- 특정 테이블에 개별 설정 적용
ALTER TABLE orders SET (
  autovacuum_vacuum_scale_factor = 0.05,  -- 5%로 낮춤 (더 자주 실행)
  autovacuum_vacuum_threshold = 100
);
\`\`\`

## MySQL 유지보수

\`\`\`sql
-- 테이블 최적화 (VACUUM FULL과 유사, 테이블 재구성)
OPTIMIZE TABLE products;

-- 테이블 분석 (통계 갱신)
ANALYZE TABLE products;

-- 테이블 점검 (무결성 검사)
CHECK TABLE products;

-- InnoDB 버퍼 풀 상태
SHOW ENGINE INNODB STATUS;
\`\`\`

### MySQL vs PostgreSQL 유지보수 비교

| 작업 | PostgreSQL | MySQL (InnoDB) |
|------|-----------|---------------|
| Dead row 정리 | VACUUM | 자동 (purge thread) |
| 공간 회수 | VACUUM FULL | OPTIMIZE TABLE |
| 통계 갱신 | ANALYZE | ANALYZE TABLE |
| 자동화 | autovacuum | 자동 purge + innodb_stats_auto_recalc |`,
          en: `## MVCC and Dead Tuples

PostgreSQL uses **MVCC (Multi-Version Concurrency Control)**. When a row is UPDATEd, the old row is not modified — a **new version is created** instead.

\`\`\`
[INSERT] → Tuple(xmin=100, xmax=∞)       -- Live row
[UPDATE] → Tuple(xmin=100, xmax=200)     -- Dead Tuple (old version)
           Tuple(xmin=200, xmax=∞)       -- New version (live row)
[DELETE] → Tuple(xmin=100, xmax=300)     -- Dead Tuple
\`\`\`

- **xmin**: Transaction ID that created this row
- **xmax**: Transaction ID that deleted/updated this row (∞ means currently valid)
- **Dead Tuple**: Old version invisible to all transactions → VACUUM cleans these up

### Table Bloat

When dead tuples accumulate, the table grows unnecessarily large.

\`\`\`sql
-- Check dead tuple ratio
SELECT relname,
  n_live_tup,
  n_dead_tup,
  ROUND(n_dead_tup * 100.0 / NULLIF(n_live_tup + n_dead_tup, 0), 1) AS dead_pct,
  last_vacuum, last_autovacuum
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
\`\`\`

**Impact of bloat:**
- Sequential Scans read unnecessary pages → slower queries
- Indexes point to dead tuples → inefficient
- Wasted disk space

## VACUUM Types

\`\`\`sql
-- Basic VACUUM (marks space as reusable)
VACUUM products;

-- VACUUM ANALYZE (also updates statistics)
VACUUM ANALYZE products;

-- VACUUM FULL (physically reclaims space - exclusive lock!)
VACUUM FULL products;

-- VACUUM VERBOSE (detailed log output)
VACUUM VERBOSE products;
\`\`\`

| Command | Lock | Space Reclaim | Speed | When to Use |
|---------|------|--------------|-------|-------------|
| **VACUUM** | ShareUpdateExclusiveLock | Marks reusable | Fast | Routine maintenance |
| **VACUUM FULL** | AccessExclusiveLock (blocks reads/writes!) | Physical reclaim (table rewrite) | Slow | After massive DELETE to reclaim space |
| **VACUUM ANALYZE** | ShareUpdateExclusiveLock | Marks reusable + stats update | Fast | After bulk DML |
| **VACUUM FREEZE** | ShareUpdateExclusiveLock | Prevents txn ID wraparound | Moderate | When XID threshold reached |

> ⚠️ **VACUUM FULL** rewrites the entire table — running it during production hours can cause service outages.

### ANALYZE (Update Statistics)

The query optimizer needs accurate statistics to choose optimal execution plans.

\`\`\`sql
ANALYZE products;  -- Update specific table stats
ANALYZE;           -- Entire database

-- View statistics
SELECT attname, n_distinct, most_common_vals, correlation
FROM pg_stats
WHERE tablename = 'products';
\`\`\`

**When statistics are stale:**
- Optimizer chooses wrong plans (e.g., picks Seq Scan when Index Scan is optimal)
- Suboptimal JOIN ordering
- Inaccurate memory allocation

### autovacuum Configuration & Tuning

PostgreSQL's **autovacuum daemon** automatically runs VACUUM and ANALYZE.

\`\`\`sql
-- Check autovacuum settings
SELECT name, setting, short_desc FROM pg_settings
WHERE name LIKE 'autovacuum%';
\`\`\`

**Key Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| \`autovacuum_vacuum_threshold\` | 50 | Min dead tuples before triggering VACUUM |
| \`autovacuum_vacuum_scale_factor\` | 0.2 | VACUUM when 20% of table is dead tuples |
| \`autovacuum_analyze_threshold\` | 50 | Min changed rows before triggering ANALYZE |
| \`autovacuum_analyze_scale_factor\` | 0.1 | ANALYZE when 10% of table has changed |

**Trigger Formula:**
\`\`\`
VACUUM triggers when: dead_tuples ≥ threshold + scale_factor × n_live_tup
Example) 100K row table: 50 + 0.2 × 100,000 = 20,050 dead tuples trigger VACUUM
\`\`\`

**Large Table Tuning:**
\`\`\`sql
-- Apply per-table settings
ALTER TABLE orders SET (
  autovacuum_vacuum_scale_factor = 0.05,  -- Lower to 5% (runs more often)
  autovacuum_vacuum_threshold = 100
);
\`\`\`

## MySQL Maintenance

\`\`\`sql
-- Optimize table (similar to VACUUM FULL, rebuilds table)
OPTIMIZE TABLE products;

-- Analyze table (update statistics)
ANALYZE TABLE products;

-- Check table (integrity check)
CHECK TABLE products;

-- InnoDB buffer pool status
SHOW ENGINE INNODB STATUS;
\`\`\`

### MySQL vs PostgreSQL Maintenance Comparison

| Task | PostgreSQL | MySQL (InnoDB) |
|------|-----------|---------------|
| Dead row cleanup | VACUUM | Automatic (purge thread) |
| Space reclaim | VACUUM FULL | OPTIMIZE TABLE |
| Stats update | ANALYZE | ANALYZE TABLE |
| Automation | autovacuum | Auto purge + innodb_stats_auto_recalc |`,
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
      {
        id: 'data-mart',
        title: { ko: '데이터 마트', en: 'Data Mart' },
        level: 'database',
        content: {
          ko: `## 데이터 마트 (Data Mart)

데이터 마트는 **특정 부서나 업무 영역**에 최적화된 소규모 데이터 저장소입니다. 데이터 웨어하우스의 부분 집합으로, 분석 목적에 맞게 가공된 데이터를 제공합니다.

### 데이터 마트 vs 데이터 웨어하우스

| 항목 | 데이터 마트 | 데이터 웨어하우스 |
|------|-----------|-----------------|
| **범위** | 단일 부서/주제 | 전사 통합 |
| **크기** | 수 GB ~ 수백 GB | 수 TB ~ 수 PB |
| **설계 시간** | 수 주 | 수 개월 |
| **데이터 원천** | DW 또는 운영 DB | 다양한 원천 시스템 |
| **사용자** | 부서 분석가 | 전사 분석 팀 |

### 마트 유형

| 유형 | 설명 |
|------|------|
| **종속형 (Dependent)** | DW에서 데이터를 추출하여 구성 |
| **독립형 (Independent)** | 운영 시스템에서 직접 ETL로 구성 |
| **하이브리드 (Hybrid)** | DW + 운영 시스템 혼합 |

### 스타 스키마 (Star Schema)

마트에서 가장 많이 사용하는 모델링 패턴입니다.

\`\`\`sql
-- 팩트 테이블 (Fact Table) — 측정값
CREATE TABLE fact_sales (
  sale_id SERIAL PRIMARY KEY,
  date_key INT REFERENCES dim_date(date_key),
  product_key INT REFERENCES dim_product(product_key),
  customer_key INT REFERENCES dim_customer(customer_key),
  quantity INT,
  amount DECIMAL(12,2)
);

-- 디멘션 테이블 (Dimension Table) — 분석 축
CREATE TABLE dim_date (
  date_key INT PRIMARY KEY,
  full_date DATE,
  year INT, quarter INT, month INT, day INT,
  day_of_week VARCHAR(10),
  is_holiday BOOLEAN
);

CREATE TABLE dim_product (
  product_key INT PRIMARY KEY,
  product_name VARCHAR(200),
  category VARCHAR(50),
  brand VARCHAR(100)
);
\`\`\`

### 스노우플레이크 스키마 (Snowflake Schema)

디멘션 테이블을 추가로 **정규화**한 형태입니다.

\`\`\`sql
-- 스타: dim_product에 category 직접 포함
-- 스노우플레이크: category를 별도 테이블로 분리
CREATE TABLE dim_category (
  category_key INT PRIMARY KEY,
  category_name VARCHAR(50),
  department VARCHAR(50)
);
CREATE TABLE dim_product (
  product_key INT PRIMARY KEY,
  product_name VARCHAR(200),
  category_key INT REFERENCES dim_category(category_key)
);
\`\`\`

### 마트 구축 예시 — 월별 매출 마트

\`\`\`sql
-- 운영 DB에서 마트 테이블로 집계
CREATE TABLE mart_monthly_sales AS
SELECT
  DATE_TRUNC('month', o.order_date) AS sale_month,
  c.country,
  cat.name AS category,
  COUNT(DISTINCT o.id) AS order_count,
  SUM(oi.quantity) AS total_quantity,
  SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
JOIN categories cat ON p.category_id = cat.id
JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'delivered'
GROUP BY 1, 2, 3;

-- 인덱스 추가
CREATE INDEX idx_mart_month ON mart_monthly_sales(sale_month);
CREATE INDEX idx_mart_country ON mart_monthly_sales(country);
\`\`\`

### PostgreSQL vs MySQL

| 항목 | PostgreSQL | MySQL |
|------|-----------|-------|
| Materialized View | \`CREATE MATERIALIZED VIEW\` 지원 | 미지원 (테이블로 대체) |
| REFRESH | \`REFRESH MATERIALIZED VIEW CONCURRENTLY\` | 수동 TRUNCATE + INSERT |
| 파티셔닝 | 선언적 파티셔닝 | RANGE/LIST/HASH 파티셔닝 |`,
          en: `## Data Mart

A data mart is a small-scale data store optimized for a **specific department or business area**. It is a subset of a data warehouse, providing curated data for analytical purposes.

### Data Mart vs Data Warehouse

| Aspect | Data Mart | Data Warehouse |
|--------|-----------|----------------|
| **Scope** | Single dept/subject | Enterprise-wide |
| **Size** | GBs to hundreds of GBs | TBs to PBs |
| **Build time** | Weeks | Months |
| **Source** | DW or operational DB | Multiple source systems |
| **Users** | Dept analysts | Enterprise analytics team |

### Mart Types

| Type | Description |
|------|-------------|
| **Dependent** | Built from DW data |
| **Independent** | ETL directly from operational systems |
| **Hybrid** | Mix of DW + operational sources |

### Star Schema

The most common modeling pattern for data marts.

\`\`\`sql
-- Fact Table — measurements
CREATE TABLE fact_sales (
  sale_id SERIAL PRIMARY KEY,
  date_key INT REFERENCES dim_date(date_key),
  product_key INT REFERENCES dim_product(product_key),
  customer_key INT REFERENCES dim_customer(customer_key),
  quantity INT,
  amount DECIMAL(12,2)
);

-- Dimension Table — analysis axes
CREATE TABLE dim_date (
  date_key INT PRIMARY KEY,
  full_date DATE,
  year INT, quarter INT, month INT, day INT,
  day_of_week VARCHAR(10),
  is_holiday BOOLEAN
);

CREATE TABLE dim_product (
  product_key INT PRIMARY KEY,
  product_name VARCHAR(200),
  category VARCHAR(50),
  brand VARCHAR(100)
);
\`\`\`

### Snowflake Schema

A **normalized** form of star schema dimensions.

\`\`\`sql
-- Star: category directly in dim_product
-- Snowflake: category as separate table
CREATE TABLE dim_category (
  category_key INT PRIMARY KEY,
  category_name VARCHAR(50),
  department VARCHAR(50)
);
CREATE TABLE dim_product (
  product_key INT PRIMARY KEY,
  product_name VARCHAR(200),
  category_key INT REFERENCES dim_category(category_key)
);
\`\`\`

### Mart Build Example — Monthly Sales

\`\`\`sql
CREATE TABLE mart_monthly_sales AS
SELECT
  DATE_TRUNC('month', o.order_date) AS sale_month,
  c.country,
  cat.name AS category,
  COUNT(DISTINCT o.id) AS order_count,
  SUM(oi.quantity) AS total_quantity,
  SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
JOIN categories cat ON p.category_id = cat.id
JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'delivered'
GROUP BY 1, 2, 3;

CREATE INDEX idx_mart_month ON mart_monthly_sales(sale_month);
CREATE INDEX idx_mart_country ON mart_monthly_sales(country);
\`\`\`

### PostgreSQL vs MySQL

| Feature | PostgreSQL | MySQL |
|---------|-----------|-------|
| Materialized View | \`CREATE MATERIALIZED VIEW\` | Not supported (use tables) |
| REFRESH | \`REFRESH MATERIALIZED VIEW CONCURRENTLY\` | Manual TRUNCATE + INSERT |
| Partitioning | Declarative partitioning | RANGE/LIST/HASH partitioning |`,
        },
      },
      {
        id: 'data-warehouse',
        title: { ko: '데이터 웨어하우스', en: 'Data Warehouse' },
        level: 'database',
        content: {
          ko: `## 데이터 웨어하우스 (Data Warehouse)

데이터 웨어하우스(DW)는 **의사결정 지원**을 위해 다양한 원천 시스템의 데이터를 통합·저장하는 중앙 저장소입니다.

### DW의 4가지 특성 (Bill Inmon)

| 특성 | 설명 |
|------|------|
| **주제 지향적 (Subject-Oriented)** | 업무 주제(매출, 고객 등) 중심으로 구성 |
| **통합적 (Integrated)** | 여러 원천의 데이터를 일관된 형식으로 통합 |
| **시간 가변적 (Time-Variant)** | 시간에 따른 데이터 변화 이력 보존 |
| **비휘발성 (Non-Volatile)** | 적재 후 변경/삭제 없이 읽기 전용 |

### DW 아키텍처

\`\`\`
원천 시스템        ETL/ELT        DW           마트        사용자
┌─────────┐    ┌─────────┐   ┌──────┐    ┌──────┐    ┌──────┐
│ 운영 DB  │───→│ Extract │──→│      │───→│ 매출  │───→│ BI   │
│ ERP     │───→│ Transform│──→│  DW  │───→│ 마케팅│───→│ 분석  │
│ CRM     │───→│ Load    │──→│      │───→│ 재무  │───→│ 리포트│
│ 외부 API │───→│         │──→│      │    └──────┘    └──────┘
└─────────┘    └─────────┘   └──────┘
\`\`\`

### ETL vs ELT

| 항목 | ETL | ELT |
|------|-----|-----|
| **순서** | Extract → Transform → Load | Extract → Load → Transform |
| **변환 위치** | ETL 서버 (중간 단계) | DW 내부 (타겟 DB) |
| **장점** | 깨끗한 데이터만 적재 | DW 엔진의 처리 능력 활용 |
| **적합 환경** | 전통적 온프레미스 | 클라우드 DW (BigQuery, Redshift) |

### ETL 예시 — PostgreSQL

\`\`\`sql
-- 1. Extract: 원천 테이블에서 신규 데이터 추출
CREATE TEMP TABLE stg_orders AS
SELECT * FROM dblink('host=source_db', '
  SELECT id, customer_id, order_date, total_amount
  FROM orders WHERE order_date >= CURRENT_DATE - INTERVAL ''1 day''
') AS t(id INT, customer_id INT, order_date TIMESTAMP, total_amount DECIMAL);

-- 2. Transform: 데이터 정제 및 변환
CREATE TEMP TABLE tfm_orders AS
SELECT
  id,
  customer_id,
  order_date,
  DATE_TRUNC('month', order_date) AS order_month,
  total_amount,
  CASE WHEN total_amount >= 1000000 THEN 'high'
       WHEN total_amount >= 100000 THEN 'medium'
       ELSE 'low' END AS amount_tier
FROM stg_orders
WHERE total_amount > 0;

-- 3. Load: DW 팩트 테이블에 적재
INSERT INTO dw_fact_orders
SELECT * FROM tfm_orders
ON CONFLICT (id) DO NOTHING;
\`\`\`

### SCD (Slowly Changing Dimension)

디멘션 데이터의 변경 이력을 관리하는 방법입니다.

| 유형 | 설명 | 예시 |
|------|------|------|
| **SCD Type 1** | 기존 값을 덮어씀 | 고객 주소 최신값만 유지 |
| **SCD Type 2** | 이력 행 추가 (유효기간) | 고객 주소 변경 이력 전체 보존 |
| **SCD Type 3** | 이전/현재 컬럼 분리 | current_address + previous_address |

\`\`\`sql
-- SCD Type 2 예시
CREATE TABLE dim_customer (
  customer_key SERIAL PRIMARY KEY,
  customer_id INT,          -- 원천 시스템 ID
  name VARCHAR(100),
  city VARCHAR(50),
  valid_from DATE NOT NULL,
  valid_to DATE DEFAULT '9999-12-31',
  is_current BOOLEAN DEFAULT TRUE
);

-- 주소 변경 시: 기존 행 만료 + 새 행 삽입
UPDATE dim_customer SET valid_to = CURRENT_DATE, is_current = FALSE
WHERE customer_id = 1 AND is_current = TRUE;

INSERT INTO dim_customer (customer_id, name, city, valid_from)
VALUES (1, 'Kim Cheolsu', 'Busan', CURRENT_DATE);
\`\`\`

### 클라우드 DW 서비스

| 클라우드 | 서비스 | 특징 |
|---------|--------|------|
| AWS | Redshift | 컬럼 기반, Spectrum으로 S3 직접 쿼리 |
| GCP | BigQuery | 서버리스, 표준 SQL, 슬롯 기반 과금 |
| Azure | Synapse | 전용/서버리스 SQL 풀 |`,
          en: `## Data Warehouse (DW)

A data warehouse is a central repository that integrates data from multiple source systems for **decision support**.

### 4 Characteristics (Bill Inmon)

| Property | Description |
|----------|-------------|
| **Subject-Oriented** | Organized by business subjects (sales, customers) |
| **Integrated** | Consistent format across diverse sources |
| **Time-Variant** | Preserves historical data changes |
| **Non-Volatile** | Read-only after loading |

### DW Architecture

\`\`\`
Sources            ETL/ELT        DW           Marts       Users
┌─────────┐    ┌─────────┐   ┌──────┐    ┌──────┐    ┌──────┐
│ OLTP DB  │───→│ Extract │──→│      │───→│ Sales │───→│ BI   │
│ ERP     │───→│Transform│──→│  DW  │───→│Market │───→│Report│
│ CRM     │───→│ Load    │──→│      │───→│Finance│───→│Dashbd│
│ APIs    │───→│         │──→│      │    └──────┘    └──────┘
└─────────┘    └─────────┘   └──────┘
\`\`\`

### ETL vs ELT

| Aspect | ETL | ELT |
|--------|-----|-----|
| **Order** | Extract → Transform → Load | Extract → Load → Transform |
| **Transform location** | ETL server (middle tier) | Inside DW (target DB) |
| **Pros** | Only clean data loaded | Leverage DW engine power |
| **Best for** | Traditional on-premise | Cloud DW (BigQuery, Redshift) |

### ETL Example — PostgreSQL

\`\`\`sql
-- 1. Extract: pull new data from source
CREATE TEMP TABLE stg_orders AS
SELECT * FROM dblink('host=source_db', '
  SELECT id, customer_id, order_date, total_amount
  FROM orders WHERE order_date >= CURRENT_DATE - INTERVAL ''1 day''
') AS t(id INT, customer_id INT, order_date TIMESTAMP, total_amount DECIMAL);

-- 2. Transform: cleanse and enrich
CREATE TEMP TABLE tfm_orders AS
SELECT
  id, customer_id, order_date,
  DATE_TRUNC('month', order_date) AS order_month,
  total_amount,
  CASE WHEN total_amount >= 1000000 THEN 'high'
       WHEN total_amount >= 100000 THEN 'medium'
       ELSE 'low' END AS amount_tier
FROM stg_orders WHERE total_amount > 0;

-- 3. Load: insert into DW fact table
INSERT INTO dw_fact_orders
SELECT * FROM tfm_orders
ON CONFLICT (id) DO NOTHING;
\`\`\`

### SCD (Slowly Changing Dimension)

Methods for managing historical changes in dimension data.

| Type | Description | Example |
|------|-------------|---------|
| **SCD Type 1** | Overwrite old value | Keep only latest customer address |
| **SCD Type 2** | Add history row (validity period) | Full address change history |
| **SCD Type 3** | Separate current/previous columns | current_address + previous_address |

\`\`\`sql
-- SCD Type 2 example
CREATE TABLE dim_customer (
  customer_key SERIAL PRIMARY KEY,
  customer_id INT,
  name VARCHAR(100),
  city VARCHAR(50),
  valid_from DATE NOT NULL,
  valid_to DATE DEFAULT '9999-12-31',
  is_current BOOLEAN DEFAULT TRUE
);

-- On address change: expire old row + insert new
UPDATE dim_customer SET valid_to = CURRENT_DATE, is_current = FALSE
WHERE customer_id = 1 AND is_current = TRUE;

INSERT INTO dim_customer (customer_id, name, city, valid_from)
VALUES (1, 'Kim Cheolsu', 'Busan', CURRENT_DATE);
\`\`\`

### Cloud DW Services

| Cloud | Service | Features |
|-------|---------|----------|
| AWS | Redshift | Columnar, Spectrum for S3 queries |
| GCP | BigQuery | Serverless, standard SQL, slot-based pricing |
| Azure | Synapse | Dedicated/serverless SQL pools |`,
        },
      },
      {
        id: 'data-migration',
        title: { ko: '데이터 이관', en: 'Data Migration' },
        level: 'database',
        content: {
          ko: `## 데이터 이관 (Data Migration)

데이터 이관은 하나의 시스템에서 다른 시스템으로 **데이터를 옮기는 과정**입니다. DB 업그레이드, 클라우드 전환, 시스템 통합 시 필수적입니다.

### 이관 유형

| 유형 | 설명 | 예시 |
|------|------|------|
| **동종 이관** | 같은 DBMS 간 | PostgreSQL 14 → 17 |
| **이종 이관** | 다른 DBMS 간 | Oracle → PostgreSQL |
| **클라우드 이관** | 온프레미스 → 클라우드 | MySQL → Amazon RDS |
| **스토리지 이관** | 저장소 변경 | HDD → SSD, 로컬 → S3 |

### 이관 전략

| 전략 | 설명 | 다운타임 |
|------|------|---------|
| **빅뱅 (Big Bang)** | 한 번에 전체 이관 | 길다 |
| **점진적 (Trickle)** | 단계별로 나눠 이관 | 짧다 |
| **병행 운영 (Parallel)** | 양쪽 시스템 동시 운영 | 없음 |
| **블루-그린** | 새 환경 준비 후 전환 | 매우 짧다 |

### PostgreSQL 이관 도구

\`\`\`bash
# pg_dump — 논리적 백업
pg_dump -h source_host -U postgres mydb > backup.sql
pg_dump -Fc mydb > backup.custom          # 커스텀 포맷 (압축)
pg_dump -Fd -j 4 mydb -f backup_dir/      # 디렉토리 포맷 (병렬)

# pg_restore — 복원
pg_restore -h target_host -U postgres -d mydb backup.custom
pg_restore -j 4 -d mydb backup_dir/       # 병렬 복원

# pg_upgrade — 메이저 버전 업그레이드
pg_upgrade --old-datadir /var/lib/pgsql/14/data \\
           --new-datadir /var/lib/pgsql/17/data \\
           --old-bindir /usr/pgsql-14/bin \\
           --new-bindir /usr/pgsql-17/bin
\`\`\`

### MySQL 이관 도구

\`\`\`bash
# mysqldump — 논리적 백업
mysqldump -h source_host -u root -p mydb > backup.sql
mysqldump --single-transaction mydb > backup.sql  # InnoDB 일관성 보장

# mysqlpump — 병렬 덤프 (MySQL 5.7+)
mysqlpump --default-parallelism=4 mydb > backup.sql

# mysql_upgrade — 업그레이드 후 시스템 테이블 갱신
mysql_upgrade -u root -p

# MySQL Shell — 유틸리티 (MySQL 8.0+)
mysqlsh -- util dump-instance /backup/full
mysqlsh -- util load-dump /backup/full
\`\`\`

### 이종 DB 이관 (Cross-Platform)

\`\`\`sql
-- pgloader: MySQL → PostgreSQL 이관
-- pgloader mysql://user:pass@mysql_host/mydb
--          postgresql://user:pass@pg_host/mydb

-- AWS DMS (Database Migration Service) 설정 예시
-- 원천: MySQL (Source Endpoint)
-- 타겟: PostgreSQL (Target Endpoint)
-- 복제 유형: Full Load + CDC (Change Data Capture)
\`\`\`

### 이관 체크리스트

| 단계 | 확인 사항 |
|------|----------|
| **계획** | 데이터 양, 다운타임 허용 시간, 롤백 계획 |
| **스키마 변환** | 데이터 타입 호환성, 제약조건, 시퀀스/AUTO_INCREMENT |
| **데이터 검증** | 행 수 비교, 체크섬, 샘플 데이터 검증 |
| **성능 테스트** | 주요 쿼리 실행 계획 비교, 인덱스 유효성 |
| **전환** | DNS 전환, 커넥션 풀 재설정, 애플리케이션 배포 |

\`\`\`sql
-- 이관 후 데이터 검증 예시
-- 행 수 비교
SELECT 'customers' AS tbl, COUNT(*) FROM customers
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'products', COUNT(*) FROM products;

-- 체크섬 비교 (PostgreSQL)
SELECT md5(string_agg(t::text, ''))
FROM (SELECT * FROM customers ORDER BY id) t;
\`\`\``,
          en: `## Data Migration

Data migration is the process of **moving data** from one system to another. Essential for DB upgrades, cloud transitions, and system consolidation.

### Migration Types

| Type | Description | Example |
|------|-------------|---------|
| **Homogeneous** | Same DBMS | PostgreSQL 14 → 17 |
| **Heterogeneous** | Different DBMS | Oracle → PostgreSQL |
| **Cloud** | On-premise → Cloud | MySQL → Amazon RDS |
| **Storage** | Storage change | HDD → SSD, Local → S3 |

### Migration Strategies

| Strategy | Description | Downtime |
|----------|-------------|----------|
| **Big Bang** | Migrate everything at once | Long |
| **Trickle** | Migrate in phases | Short |
| **Parallel Run** | Both systems run simultaneously | None |
| **Blue-Green** | Prepare new env, then switch | Very short |

### PostgreSQL Migration Tools

\`\`\`bash
# pg_dump — logical backup
pg_dump -h source_host -U postgres mydb > backup.sql
pg_dump -Fc mydb > backup.custom            # custom format (compressed)
pg_dump -Fd -j 4 mydb -f backup_dir/        # directory format (parallel)

# pg_restore — restore
pg_restore -h target_host -U postgres -d mydb backup.custom
pg_restore -j 4 -d mydb backup_dir/         # parallel restore

# pg_upgrade — major version upgrade
pg_upgrade --old-datadir /var/lib/pgsql/14/data \\
           --new-datadir /var/lib/pgsql/17/data \\
           --old-bindir /usr/pgsql-14/bin \\
           --new-bindir /usr/pgsql-17/bin
\`\`\`

### MySQL Migration Tools

\`\`\`bash
# mysqldump — logical backup
mysqldump -h source_host -u root -p mydb > backup.sql
mysqldump --single-transaction mydb > backup.sql  # InnoDB consistency

# mysqlpump — parallel dump (MySQL 5.7+)
mysqlpump --default-parallelism=4 mydb > backup.sql

# MySQL Shell utilities (8.0+)
mysqlsh -- util dump-instance /backup/full
mysqlsh -- util load-dump /backup/full
\`\`\`

### Cross-Platform Migration

\`\`\`sql
-- pgloader: MySQL → PostgreSQL
-- pgloader mysql://user:pass@mysql_host/mydb
--          postgresql://user:pass@pg_host/mydb

-- AWS DMS (Database Migration Service)
-- Source: MySQL endpoint
-- Target: PostgreSQL endpoint
-- Replication type: Full Load + CDC (Change Data Capture)
\`\`\`

### Migration Checklist

| Phase | Items |
|-------|-------|
| **Planning** | Data volume, downtime window, rollback plan |
| **Schema conversion** | Data type compatibility, constraints, sequences |
| **Data validation** | Row count comparison, checksums, sample verification |
| **Performance test** | Execution plan comparison, index effectiveness |
| **Cutover** | DNS switch, connection pool reset, app deployment |

\`\`\`sql
-- Post-migration validation
SELECT 'customers' AS tbl, COUNT(*) FROM customers
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'products', COUNT(*) FROM products;

-- Checksum comparison (PostgreSQL)
SELECT md5(string_agg(t::text, ''))
FROM (SELECT * FROM customers ORDER BY id) t;
\`\`\``,
        },
      },
      {
        id: 'disk-page-structure',
        title: { ko: '디스크와 페이지 구조', en: 'Disk & Page Structure' },
        level: 'database',
        content: {
          ko: `## 메모리 계층 구조

데이터베이스 성능의 핵심은 **디스크 I/O를 최소화**하는 것입니다.

### 스토리지 계층 (속도 순서)

컴퓨터 시스템은 다음과 같은 계층 구조로 데이터를 저장합니다:

1. **CPU 레지스터**
   - 가장 빠르지만 가장 작음
   - CPU 내부에서 직접 사용

2. **CPU 캐시 (L1/L2/L3)**
   - L1: ~1ns, 64KB
   - CPU와 메모리 사이의 고속 버퍼

3. **메인 메모리 (RAM)** 🎯
   - ~100ns, 16-512GB
   - **버퍼 풀이 여기에 위치** (DB 성능의 핵심!)

4. **SSD (Solid State Drive)**
   - ~100μs (100,000ns), 1-16TB
   - 데이터 파일의 영구 저장소
   - **RAM보다 1,000배 느림**

5. **HDD (Hard Disk Drive)**
   - ~10ms (10,000,000ns), 1-20TB
   - 기계적 동작으로 인해 SSD보다 느림

6. **네트워크 스토리지 (NAS/SAN)**
   - 가장 느리지만 가장 큰 용량
   - 네트워크 지연 추가

### 성능 비교

| 계층 | 접근 시간 | 용량 | 상대 속도 |
|------|----------|------|----------|
| L1 캐시 | ~1ns | 64KB | 1× |
| 메인 메모리 (RAM) | ~100ns | 16-512GB | 100× |
| SSD | ~100μs | 1-16TB | 100,000× |
| HDD | ~10ms | 1-20TB | 10,000,000× |

> **핵심**: RAM과 SSD는 약 **1,000배** 속도 차이가 있습니다. 이것이 **인덱스**, **버퍼 풀**, **쿼리 최적화**가 중요한 이유입니다. 디스크 접근을 1번만 줄여도 엄청난 성능 향상을 얻을 수 있습니다.

## 페이지 (Page / Block)

DBMS가 디스크와 메모리 사이에서 **데이터를 주고받는 최소 단위**입니다.

\`\`\`
페이지 크기:
  PostgreSQL: 8KB (기본, 컴파일 시 변경 가능)
  MySQL/InnoDB: 16KB (기본, innodb_page_size로 변경)
\`\`\`

### 슬롯 페이지 (Slotted Page) 구조

대부분의 RDBMS가 사용하는 페이지 내부 구조입니다.

**페이지 레이아웃:**

1. **Page Header** (페이지 상단)
   - 페이지 메타데이터: LSN, checksum, 페이지 버전 등

2. **Line Pointer Array** (슬롯 디렉토리)
   - 각 행의 오프셋(offset)과 길이(length)를 저장하는 포인터 배열
   - 예: \`[Slot1: offset=7800, len=120]\`, \`[Slot2: offset=7680, len=95]\`
   - 위에서 아래로 증가

3. **Free Space** (빈 공간)
   - 새로운 행 삽입에 사용되는 여유 공간

4. **Tuple Data** (실제 행 데이터, 페이지 하단)
   - 실제 행 데이터는 페이지 하단부터 위로 채워짐
   - 예: Row 1, Row 2, Row 3 순서대로 아래→위

**🔑 핵심 포인트:**
- **Slotted 구조**: 슬롯 포인터는 위→아래로 증가하고, 실제 데이터는 아래→위로 증가하여 중간의 Free Space를 공유
- **삭제 처리**: 행을 삭제하면 슬롯을 "사용 안 함"으로 표시 (PostgreSQL: dead tuple)
- **행 이동**: 행이 이동해도 슬롯 포인터만 갱신하면 되므로 인덱스의 CTID가 유효하게 유지됨

### PostgreSQL 페이지 구조

\`\`\`sql
-- 페이지 크기 확인
SHOW block_size;  -- 8192 (8KB)

-- 페이지 헤더 정보 (pageinspect 확장)
CREATE EXTENSION IF NOT EXISTS pageinspect;
SELECT * FROM page_header(get_raw_page('products', 0));
-- lsn, checksum, flags, lower, upper, special, pagesize, version

-- 행 포인터 (line pointer) 확인
SELECT * FROM heap_page_item_attrs(get_raw_page('products', 0), 'products');
\`\`\`

## 레코드 (Tuple / Row) 형식

### 고정 길이 vs 가변 길이

| 타입 | 예시 | 저장 |
|------|------|------|
| **고정 길이** | INTEGER(4B), CHAR(10)(10B), BOOLEAN(1B) | 항상 동일한 크기 |
| **가변 길이** | VARCHAR(n), TEXT, JSONB | 헤더에 길이 정보 포함 |

### PostgreSQL 튜플 구조 (HeapTupleHeader)

PostgreSQL의 각 행(튜플)은 다음과 같은 구조로 저장됩니다:

**1. HeapTupleHeader (23 bytes)**
   - \`t_xmin\`: 이 행을 삽입한 트랜잭션 ID (MVCC 가시성 판단용)
   - \`t_xmax\`: 이 행을 삭제/갱신한 트랜잭션 ID (0이면 유효)
   - \`t_ctid\`: 튜플의 물리적 위치 (페이지 번호, 슬롯 번호)
   - \`t_infomask\`: 행 상태 플래그 (커밋 여부, NULL 존재 등)
   - \`t_hoff\`: 사용자 데이터가 시작되는 오프셋

**2. NULL 비트맵 (선택적)**
   - 어떤 컬럼이 NULL인지를 비트맵으로 표시
   - NULL이 하나도 없으면 생략 가능

**3. 사용자 데이터 (실제 컬럼 값)**
   - 컬럼 값들이 순서대로 저장: \`[col1_value][col2_value][col3_value]...\`
   - 가변 길이 컬럼(VARCHAR, TEXT)은 길이 헤더를 포함

> **MVCC의 핵심**: \`t_xmin\`과 \`t_xmax\`를 통해 각 트랜잭션이 어떤 버전의 행을 볼 수 있는지 결정합니다. 이로 인해 읽기와 쓰기가 서로 차단하지 않습니다.

## 파일 구조 (File Organization)

### 힙 파일 (Heap File)

가장 기본적인 저장 방식입니다. 행이 **삽입 순서대로** 페이지에 저장됩니다.

**구조**: 페이지들이 순차적으로 연결됨
- 형태: \`[Page 0] → [Page 1] → [Page 2] → ... → [Page N]\`
- 각 페이지는 여러 행(레코드)을 포함

**특징:**
- ✅ **장점**: 삽입이 매우 빠름 (빈 공간이 있는 페이지에 추가하거나 새 페이지 할당)
- ❌ **단점**: 특정 행을 찾으려면 전체 스캔 필요 (인덱스 없으면)
- 대부분의 RDBMS가 기본으로 사용하는 방식 (PostgreSQL, MySQL 등)

### 기타 파일 구조

| 구조 | 원리 | 용도 |
|------|------|------|
| **힙 파일** | 순서 없이 저장 | 범용 (RDBMS 기본) |
| **정렬 파일** | 특정 키로 정렬 저장 | 범위 검색 최적화 |
| **해시 파일** | 해시 함수로 버킷에 분배 | 정확 일치 검색 |
| **클러스터 인덱스** | 인덱스 순서 = 데이터 물리 순서 | InnoDB의 PK |

\`\`\`sql
-- PostgreSQL: 테이블의 물리적 크기와 페이지 수
SELECT pg_relation_size('products') AS bytes,
       pg_relation_size('products') / 8192 AS pages;

-- InnoDB: 클러스터 인덱스 (PK = 물리적 정렬 키)
-- MySQL에서는 PK가 곧 데이터 정렬 순서를 결정
\`\`\``,
          en: `## Memory Hierarchy

The key to database performance is **minimizing disk I/O**.

### Storage Hierarchy (By Speed)

Computer systems store data in the following hierarchical structure:

1. **CPU Registers**
   - Fastest but smallest
   - Used directly within the CPU

2. **CPU Cache (L1/L2/L3)**
   - L1: ~1ns, 64KB
   - High-speed buffer between CPU and memory

3. **Main Memory (RAM)** 🎯
   - ~100ns, 16-512GB
   - **Buffer pool resides here** (Critical for DB performance!)

4. **SSD (Solid State Drive)**
   - ~100μs (100,000ns), 1-16TB
   - Persistent storage for data files
   - **1,000× slower than RAM**

5. **HDD (Hard Disk Drive)**
   - ~10ms (10,000,000ns), 1-20TB
   - Slower than SSD due to mechanical operation

6. **Network Storage (NAS/SAN)**
   - Slowest but largest capacity
   - Additional network latency

### Performance Comparison

| Level | Access Time | Capacity | Relative Speed |
|-------|------------|----------|----------------|
| L1 Cache | ~1ns | 64KB | 1× |
| Main Memory (RAM) | ~100ns | 16-512GB | 100× |
| SSD | ~100μs | 1-16TB | 100,000× |
| HDD | ~10ms | 1-20TB | 10,000,000× |

> **Key Point**: RAM and SSD have about a **1,000× speed difference**. This is why **indexes**, **buffer pools**, and **query optimization** are critical. Reducing just one disk access can result in massive performance gains.

## Page / Block

The **minimum unit of data transfer** between disk and memory in a DBMS.

\`\`\`
Page sizes:
  PostgreSQL: 8KB (default, configurable at compile time)
  MySQL/InnoDB: 16KB (default, innodb_page_size)
\`\`\`

### Slotted Page Structure

The internal page format used by most RDBMS.

\`\`\`
┌─────────────────────────────────────┐
│ Page Header                          │ ← Page metadata (LSN, checksum, etc.)
├─────────────────────────────────────┤
│ Line Pointer Array (Slot Directory)  │ ← Offset and length of each row
│ [Slot1: offset=7800, len=120]       │
│ [Slot2: offset=7680, len=95]        │
│ [Slot3: offset=7580, len=100]       │
├─────────────────────────────────────┤
│                                      │
│         Free Space                    │ ← Used for new row inserts
│                                      │
├─────────────────────────────────────┤
│ [Row 3 data] (offset 7580)          │ ← Fills bottom-up
│ [Row 2 data] (offset 7680)          │
│ [Row 1 data] (offset 7800)          │
└─────────────────────────────────────┘
\`\`\`

**Key points:**
- Slot pointers grow top→down, actual data fills bottom→up
- Deleting a row marks the slot as "unused" (PostgreSQL: dead tuple)
- When a row moves, only the slot pointer updates → index CTIDs remain valid

### PostgreSQL Page Structure

\`\`\`sql
-- Check page size
SHOW block_size;  -- 8192 (8KB)

-- Page header info (pageinspect extension)
CREATE EXTENSION IF NOT EXISTS pageinspect;
SELECT * FROM page_header(get_raw_page('products', 0));
-- lsn, checksum, flags, lower, upper, special, pagesize, version

-- Line pointers
SELECT * FROM heap_page_item_attrs(get_raw_page('products', 0), 'products');
\`\`\`

## Record (Tuple / Row) Format

### Fixed-Length vs Variable-Length

| Type | Examples | Storage |
|------|---------|---------|
| **Fixed-length** | INTEGER(4B), CHAR(10)(10B), BOOLEAN(1B) | Always same size |
| **Variable-length** | VARCHAR(n), TEXT, JSONB | Length info in header |

### PostgreSQL Tuple Structure (HeapTupleHeader)

\`\`\`
┌──────────────────────────────────┐
│ HeapTupleHeader (23 bytes)        │
│ - t_xmin: Transaction that inserted│
│ - t_xmax: Transaction that deleted │
│ - t_ctid: (page_number, slot_num) │
│ - t_infomask: Row status flags     │
│ - t_hoff: Offset to user data     │
├──────────────────────────────────┤
│ NULL Bitmap (optional)             │ ← Which columns are NULL
├──────────────────────────────────┤
│ User Data (actual column values)   │
│ [col1_value][col2_value][...]     │
└──────────────────────────────────┘
\`\`\`

## File Organization

### Heap File

The most basic storage method. Rows are stored in pages in **insertion order**.

**Structure**: Pages are linked sequentially
- Format: \`[Page 0] → [Page 1] → [Page 2] → ... → [Page N]\`
- Each page contains multiple rows (records)

**Characteristics:**
- ✅ **Pros**: Very fast inserts (append to page with free space or allocate new page)
- ❌ **Cons**: Finding a specific row requires full scan (without indexes)
- Used as the default method by most RDBMS (PostgreSQL, MySQL, etc.)

### Other File Organizations

| Structure | Principle | Use Case |
|-----------|-----------|----------|
| **Heap file** | Unordered storage | General purpose (RDBMS default) |
| **Sorted file** | Stored sorted by key | Range query optimization |
| **Hash file** | Hash function distributes to buckets | Exact match lookups |
| **Clustered index** | Index order = physical data order | InnoDB's primary key |

\`\`\`sql
-- PostgreSQL: table physical size and page count
SELECT pg_relation_size('products') AS bytes,
       pg_relation_size('products') / 8192 AS pages;

-- InnoDB: clustered index (PK = physical sort order)
-- In MySQL, the PK determines the physical row ordering
\`\`\``,
        },
      },
      {
        id: 'db-engine-storage',
        title: { ko: '데이터베이스 엔진과 스토리지', en: 'Database Engine & Storage' },
        level: 'database',
        content: {
          ko: `## 데이터베이스 엔진과 스토리지

데이터베이스 엔진은 **데이터를 저장·검색·수정하는 핵심 소프트웨어**이며, 스토리지 구조는 데이터가 디스크에 저장되는 방식을 결정합니다.

### MySQL 스토리지 엔진

MySQL은 **플러거블 스토리지 엔진** 아키텍처를 채택하여 테이블별로 다른 엔진을 사용할 수 있습니다.

| 엔진 | 트랜잭션 | 잠금 수준 | 용도 |
|------|---------|----------|------|
| **InnoDB** | O | 행 잠금 | 기본 엔진, OLTP |
| **MyISAM** | X | 테이블 잠금 | 읽기 집중 (레거시) |
| **Memory** | X | 테이블 잠금 | 임시 데이터, 캐시 |
| **Archive** | X | 행 잠금 | 로그/감사 데이터 |
| **NDB (Cluster)** | O | 행 잠금 | 분산 클러스터 |

\`\`\`sql
-- 현재 테이블의 엔진 확인
SHOW TABLE STATUS FROM mydb;

-- 엔진 변경
ALTER TABLE orders ENGINE = InnoDB;

-- 사용 가능한 엔진 목록
SHOW ENGINES;
\`\`\`

#### InnoDB 내부 구조

InnoDB는 메모리와 디스크를 계층적으로 관리합니다:

**메모리 계층 (In-Memory):**
- **Buffer Pool**: 데이터 페이지와 인덱스를 캐시 (RAM의 70-80%)
- **Change Buffer**: 보조 인덱스 변경사항을 버퍼링
- **Log Buffer**: Redo Log를 메모리에서 버퍼링
- **Adaptive Hash Index**: 자주 접근하는 페이지에 대한 해시 인덱스

**디스크 계층 (On-Disk):**
- **Redo Log (WAL)**: Write-Ahead Logging으로 장애 복구 보장
- **Tablespace (.ibd 파일)**: 테이블과 인덱스 데이터를 저장
  - Data Pages: 실제 행 데이터
  - Index Pages: B-tree 인덱스
  - Undo Log: MVCC와 롤백을 위한 이전 버전 데이터

\`\`\`sql
-- InnoDB 버퍼 풀 상태
SHOW STATUS LIKE 'Innodb_buffer_pool%';

-- 버퍼 풀 크기 설정 (전체 RAM의 70~80% 권장)
-- my.cnf: innodb_buffer_pool_size = 4G
\`\`\`

### PostgreSQL 스토리지 구조

PostgreSQL은 단일 스토리지 엔진을 사용하며 **MVCC(다중 버전 동시성 제어)** 를 기반으로 합니다.

**메모리 계층 (Shared Memory):**
- **Shared Buffers**: 테이블과 인덱스 페이지를 캐시 (RAM의 25%)
- **WAL Buffers**: Write-Ahead Log를 메모리에서 버퍼링 (16MB)
- **Work Memory**: 쿼리별 정렬, 해시, 조인에 사용

**디스크 계층 (Data Directory - PGDATA):**
- **WAL (Write-Ahead Log)**: 트랜잭션 로그로 장애 복구와 복제에 사용
- **Heap Files**: 테이블 데이터를 페이지 단위로 저장
- **Index Files**: B-tree, GiST, GIN 등 다양한 인덱스 파일
- **TOAST (The Oversized-Attribute Storage Technique)**: 큰 값(>2KB)을 별도 파일에 저장

**특징:**
- 멀티 프로세스 아키텍처 (연결당 1개 프로세스)
- MVCC: xmin/xmax를 통한 행 버전 관리
- VACUUM을 통한 Dead Tuple 정리 필요

\`\`\`sql
-- 테이블의 물리적 파일 위치
SELECT pg_relation_filepath('orders');

-- 테이블스페이스 관리
CREATE TABLESPACE fast_ssd LOCATION '/mnt/ssd/pgdata';
CREATE TABLE hot_data (...) TABLESPACE fast_ssd;

-- Shared Buffers 설정 확인
SHOW shared_buffers;      -- 전체 RAM의 25% 권장
SHOW effective_cache_size; -- OS 캐시 포함 전체 캐시
SHOW work_mem;            -- 쿼리별 정렬/해시 메모리
\`\`\`

### 행 기반 vs 컬럼 기반 스토리지

| 항목 | 행 기반 (Row Store) | 컬럼 기반 (Column Store) |
|------|-------------------|------------------------|
| **저장 방식** | 행 단위로 저장 | 컬럼 단위로 저장 |
| **OLTP** | 적합 (단건 CRUD) | 비효율 |
| **OLAP** | 비효율 (불필요한 컬럼 읽기) | 적합 (필요한 컬럼만 읽기) |
| **압축** | 보통 | 우수 (같은 타입 데이터 연속) |
| **예시** | PostgreSQL, MySQL | ClickHouse, Redshift, BigQuery |

### WAL (Write-Ahead Logging)

데이터 변경 전에 **로그를 먼저 기록**하여 장애 복구를 보장합니다.

\`\`\`sql
-- PostgreSQL WAL 상태
SELECT pg_current_wal_lsn(), pg_wal_lsn_diff(
  pg_current_wal_lsn(), '0/0') AS wal_bytes;

-- WAL 아카이브 설정 확인
SHOW archive_mode;
SHOW archive_command;
SHOW wal_level;  -- minimal, replica, logical
\`\`\`

\`\`\`sql
-- MySQL Redo Log 상태
SHOW STATUS LIKE 'Innodb_redo_log%';
-- Binary Log (복제/복구용)
SHOW BINARY LOGS;
SHOW VARIABLES LIKE 'binlog_format';  -- ROW, STATEMENT, MIXED
\`\`\`

### TOAST (PostgreSQL)

큰 데이터 값을 별도 테이블에 압축·저장하는 PostgreSQL 고유 메커니즘입니다.

\`\`\`sql
-- TOAST 전략 확인
SELECT attname, atttypid::regtype,
  CASE attstorage
    WHEN 'p' THEN 'plain'
    WHEN 'e' THEN 'external'
    WHEN 'm' THEN 'main'
    WHEN 'x' THEN 'extended'
  END AS storage
FROM pg_attribute
WHERE attrelid = 'reviews'::regclass AND attnum > 0;

-- TOAST 테이블 크기
SELECT pg_size_pretty(pg_total_relation_size('reviews')) AS total,
       pg_size_pretty(pg_relation_size('reviews')) AS main,
       pg_size_pretty(pg_total_relation_size('reviews')
         - pg_relation_size('reviews')) AS toast_and_index;
\`\`\``,
          en: `## Database Engine & Storage

A database engine is the **core software that stores, retrieves, and modifies data**. Storage architecture determines how data is physically stored on disk.

### MySQL Storage Engines

MySQL uses a **pluggable storage engine** architecture — each table can use a different engine.

| Engine | Transactions | Lock Level | Use Case |
|--------|-------------|------------|----------|
| **InnoDB** | Yes | Row-level | Default, OLTP |
| **MyISAM** | No | Table-level | Read-heavy (legacy) |
| **Memory** | No | Table-level | Temp data, caching |
| **Archive** | No | Row-level | Log/audit data |
| **NDB (Cluster)** | Yes | Row-level | Distributed cluster |

\`\`\`sql
-- Check table engines
SHOW TABLE STATUS FROM mydb;

-- Change engine
ALTER TABLE orders ENGINE = InnoDB;

-- List available engines
SHOW ENGINES;
\`\`\`

#### InnoDB Internal Structure

\`\`\`
┌─────────────────────────────────┐
│         InnoDB Buffer Pool      │  ← Memory (cache)
│  ┌──────────┐ ┌──────────────┐  │
│  │ Data Page │ │ Change Buffer│  │
│  └──────────┘ └──────────────┘  │
├─────────────────────────────────┤
│         Redo Log (WAL)          │  ← Crash recovery
├─────────────────────────────────┤
│  Tablespace (.ibd files)        │  ← Disk
│  ┌──────┐ ┌──────┐ ┌────────┐  │
│  │ Data │ │Index │ │Undo Log│  │
│  └──────┘ └──────┘ └────────┘  │
└─────────────────────────────────┘
\`\`\`

\`\`\`sql
-- InnoDB buffer pool status
SHOW STATUS LIKE 'Innodb_buffer_pool%';

-- Buffer pool size (70-80% of total RAM recommended)
-- my.cnf: innodb_buffer_pool_size = 4G
\`\`\`

### PostgreSQL Storage Structure

PostgreSQL uses a single storage engine based on **MVCC (Multi-Version Concurrency Control)**.

\`\`\`
┌─────────────────────────────────┐
│       Shared Buffers            │  ← Memory (cache)
│  ┌──────────┐ ┌──────────────┐  │
│  │ Data Page │ │   WAL Buffer │  │
│  └──────────┘ └──────────────┘  │
├─────────────────────────────────┤
│         WAL (Write-Ahead Log)   │  ← Crash recovery
├─────────────────────────────────┤
│  Data Directory (PGDATA)        │  ← Disk
│  ┌──────┐ ┌──────┐ ┌────────┐  │
│  │Heap  │ │Index │ │TOAST   │  │
│  │File  │ │File  │ │(large) │  │
│  └──────┘ └──────┘ └────────┘  │
└─────────────────────────────────┘
\`\`\`

\`\`\`sql
-- Physical file location of a table
SELECT pg_relation_filepath('orders');

-- Tablespace management
CREATE TABLESPACE fast_ssd LOCATION '/mnt/ssd/pgdata';
CREATE TABLE hot_data (...) TABLESPACE fast_ssd;

-- Memory configuration
SHOW shared_buffers;        -- 25% of RAM recommended
SHOW effective_cache_size;  -- Total cache incl. OS
SHOW work_mem;              -- Per-query sort/hash memory
\`\`\`

### Row Store vs Column Store

| Aspect | Row Store | Column Store |
|--------|-----------|-------------|
| **Storage** | Row by row | Column by column |
| **OLTP** | Ideal (single-row CRUD) | Inefficient |
| **OLAP** | Inefficient (reads unused cols) | Ideal (reads only needed cols) |
| **Compression** | Average | Excellent (same-type data) |
| **Examples** | PostgreSQL, MySQL | ClickHouse, Redshift, BigQuery |

### WAL (Write-Ahead Logging)

Ensures crash recovery by **writing logs before data changes**.

\`\`\`sql
-- PostgreSQL WAL status
SELECT pg_current_wal_lsn(), pg_wal_lsn_diff(
  pg_current_wal_lsn(), '0/0') AS wal_bytes;

-- WAL archive settings
SHOW archive_mode;
SHOW wal_level;  -- minimal, replica, logical
\`\`\`

\`\`\`sql
-- MySQL Redo Log status
SHOW STATUS LIKE 'Innodb_redo_log%';
-- Binary Log (replication/recovery)
SHOW BINARY LOGS;
SHOW VARIABLES LIKE 'binlog_format';  -- ROW, STATEMENT, MIXED
\`\`\`

### TOAST (PostgreSQL)

PostgreSQL mechanism for compressing and storing **large values** in a separate table.

\`\`\`sql
-- Check TOAST strategy
SELECT attname, atttypid::regtype,
  CASE attstorage
    WHEN 'p' THEN 'plain'
    WHEN 'e' THEN 'external'
    WHEN 'm' THEN 'main'
    WHEN 'x' THEN 'extended'
  END AS storage
FROM pg_attribute
WHERE attrelid = 'reviews'::regclass AND attnum > 0;
\`\`\``,
        },
      },
      {
        id: 'backup-recovery',
        title: { ko: '백업과 복구', en: 'Backup & Recovery' },
        level: 'database',
        content: {
          ko: `## 백업과 복구 (Backup & Recovery)

데이터 손실에 대비하여 백업을 수행하고, 장애 발생 시 복구하는 DBA 핵심 업무입니다.

### 백업 유형

| 유형 | 설명 | 특징 |
|------|------|------|
| **논리적 백업** | SQL 형태로 덤프 | 이식성 높음, 느림 |
| **물리적 백업** | 데이터 파일 직접 복사 | 빠름, 동일 DBMS만 |
| **전체 백업 (Full)** | 전체 DB 백업 | 복구 단순, 저장 공간 큼 |
| **증분 백업 (Incremental)** | 변경분만 백업 | 공간 절약, 복구 복잡 |
| **차등 백업 (Differential)** | 마지막 전체 백업 이후 변경분 | Full + Diff로 복구 |

### PostgreSQL 백업

#### pg_dump (논리적 백업)

\`\`\`bash
# 텍스트 형식 (사람이 읽기 가능)
pg_dump -h localhost -U postgres mydb > backup.sql

# 커스텀 형식 (압축, 병렬 복원 가능) ← 권장
pg_dump -Fc -h localhost -U postgres mydb > backup.custom

# 디렉토리 형식 (병렬 덤프 가능)
pg_dump -Fd -j 4 mydb -f backup_dir/

# 특정 테이블만
pg_dump -t orders -t order_items mydb > orders_backup.sql

# 스키마만 (데이터 제외)
pg_dump --schema-only mydb > schema.sql

# 데이터만 (스키마 제외)
pg_dump --data-only mydb > data.sql
\`\`\`

#### pg_restore (복원)

\`\`\`bash
# 커스텀 포맷 복원
pg_restore -d mydb backup.custom

# 병렬 복원 (4 프로세스)
pg_restore -j 4 -d mydb backup.custom

# 클린 복원 (기존 객체 삭제 후 복원)
pg_restore --clean --if-exists -d mydb backup.custom

# 텍스트 형식 복원
psql -d mydb < backup.sql
\`\`\`

#### pg_basebackup (물리적 백업)

\`\`\`bash
# 전체 클러스터 물리적 백업
pg_basebackup -h localhost -U replicator \\
  -D /backup/base -Ft -z -P

# WAL 포함 백업 (독립 복구 가능)
pg_basebackup -D /backup/base -Ft -z \\
  --wal-method=stream -P
\`\`\`

#### PITR (Point-In-Time Recovery)

\`\`\`bash
# 1. postgresql.conf에서 WAL 아카이빙 설정
# archive_mode = on
# archive_command = 'cp %p /archive/%f'
# wal_level = replica

# 2. 기본 백업 수행
pg_basebackup -D /backup/base -Ft -z

# 3. 장애 발생 시 복구
# recovery.signal 파일 생성 후 postgresql.conf에:
# restore_command = 'cp /archive/%f %p'
# recovery_target_time = '2024-08-15 14:30:00'
\`\`\`

### MySQL 백업

#### mysqldump (논리적 백업)

\`\`\`bash
# 전체 데이터베이스
mysqldump -u root -p mydb > backup.sql

# InnoDB 일관성 보장 (--single-transaction)
mysqldump --single-transaction -u root -p mydb > backup.sql

# 모든 데이터베이스
mysqldump --all-databases -u root -p > full_backup.sql

# 특정 테이블
mysqldump -u root -p mydb orders order_items > orders.sql

# 압축 백업
mysqldump --single-transaction mydb | gzip > backup.sql.gz
\`\`\`

#### MySQL Shell (8.0+)

\`\`\`bash
# 병렬 덤프 (mysqldump보다 훨씬 빠름)
mysqlsh -- util dump-instance /backup/full \\
  --threads=4

# 특정 DB만
mysqlsh -- util dump-schemas mydb \\
  --outputUrl=/backup/mydb --threads=4

# 복원
mysqlsh -- util load-dump /backup/full \\
  --threads=4
\`\`\`

#### MySQL Enterprise Backup / Percona XtraBackup

\`\`\`bash
# Percona XtraBackup (물리적, 핫 백업)
xtrabackup --backup --target-dir=/backup/full

# 증분 백업
xtrabackup --backup --target-dir=/backup/inc1 \\
  --incremental-basedir=/backup/full

# 복구 준비
xtrabackup --prepare --target-dir=/backup/full
xtrabackup --prepare --target-dir=/backup/full \\
  --incremental-dir=/backup/inc1

# 복원
xtrabackup --copy-back --target-dir=/backup/full
\`\`\`

#### MySQL Binlog PITR

\`\`\`bash
# Binary Log 기반 시점 복구
mysqlbinlog --start-datetime="2024-08-15 14:00:00" \\
            --stop-datetime="2024-08-15 14:30:00" \\
            binlog.000042 | mysql -u root -p

# GTID 기반 복구
mysqlbinlog --include-gtids="uuid:1-100" \\
            binlog.000042 | mysql -u root -p
\`\`\`

### 백업 전략 비교

| 항목 | PostgreSQL | MySQL |
|------|-----------|-------|
| 논리적 백업 | pg_dump (-Fc 권장) | mysqldump (--single-transaction) |
| 물리적 백업 | pg_basebackup | XtraBackup / MySQL Enterprise |
| 병렬 백업 | pg_dump -Fd -j N | MySQL Shell dump-instance |
| PITR | WAL 아카이빙 + restore_command | Binary Log + mysqlbinlog |
| 자동화 | pgBackRest, Barman | Percona XtraBackup, mysqlbackup |`,
          en: `## Backup & Recovery

Performing backups to protect against data loss and restoring after failures is a core DBA responsibility.

### Backup Types

| Type | Description | Features |
|------|-------------|----------|
| **Logical** | Dump as SQL statements | Portable, slower |
| **Physical** | Direct data file copy | Fast, same DBMS only |
| **Full** | Entire DB backup | Simple recovery, large storage |
| **Incremental** | Only changed data | Space efficient, complex recovery |
| **Differential** | Changes since last full | Recover with Full + Diff |

### PostgreSQL Backup

#### pg_dump (Logical)

\`\`\`bash
# Text format (human readable)
pg_dump -h localhost -U postgres mydb > backup.sql

# Custom format (compressed, parallel restore) ← recommended
pg_dump -Fc -h localhost -U postgres mydb > backup.custom

# Directory format (parallel dump)
pg_dump -Fd -j 4 mydb -f backup_dir/

# Specific tables only
pg_dump -t orders -t order_items mydb > orders_backup.sql

# Schema only / Data only
pg_dump --schema-only mydb > schema.sql
pg_dump --data-only mydb > data.sql
\`\`\`

#### pg_restore

\`\`\`bash
# Restore custom format
pg_restore -d mydb backup.custom

# Parallel restore (4 processes)
pg_restore -j 4 -d mydb backup.custom

# Clean restore (drop existing objects first)
pg_restore --clean --if-exists -d mydb backup.custom
\`\`\`

#### pg_basebackup (Physical)

\`\`\`bash
# Full cluster physical backup
pg_basebackup -h localhost -U replicator \\
  -D /backup/base -Ft -z -P

# With WAL streaming (standalone recovery)
pg_basebackup -D /backup/base -Ft -z \\
  --wal-method=stream -P
\`\`\`

#### PITR (Point-In-Time Recovery)

\`\`\`bash
# 1. Enable WAL archiving in postgresql.conf
# archive_mode = on
# archive_command = 'cp %p /archive/%f'
# wal_level = replica

# 2. Take base backup
pg_basebackup -D /backup/base -Ft -z

# 3. On failure, recover to specific time
# Create recovery.signal, add to postgresql.conf:
# restore_command = 'cp /archive/%f %p'
# recovery_target_time = '2024-08-15 14:30:00'
\`\`\`

### MySQL Backup

#### mysqldump (Logical)

\`\`\`bash
# Full database with InnoDB consistency
mysqldump --single-transaction -u root -p mydb > backup.sql

# All databases
mysqldump --all-databases -u root -p > full_backup.sql

# Compressed backup
mysqldump --single-transaction mydb | gzip > backup.sql.gz
\`\`\`

#### MySQL Shell (8.0+)

\`\`\`bash
# Parallel dump (much faster than mysqldump)
mysqlsh -- util dump-instance /backup/full --threads=4

# Restore
mysqlsh -- util load-dump /backup/full --threads=4
\`\`\`

#### Percona XtraBackup (Physical, Hot)

\`\`\`bash
xtrabackup --backup --target-dir=/backup/full

# Incremental
xtrabackup --backup --target-dir=/backup/inc1 \\
  --incremental-basedir=/backup/full

# Prepare and restore
xtrabackup --prepare --target-dir=/backup/full
xtrabackup --copy-back --target-dir=/backup/full
\`\`\`

#### MySQL Binlog PITR

\`\`\`bash
mysqlbinlog --start-datetime="2024-08-15 14:00:00" \\
            --stop-datetime="2024-08-15 14:30:00" \\
            binlog.000042 | mysql -u root -p
\`\`\`

### Backup Strategy Comparison

| Feature | PostgreSQL | MySQL |
|---------|-----------|-------|
| Logical | pg_dump (-Fc recommended) | mysqldump (--single-transaction) |
| Physical | pg_basebackup | XtraBackup / MySQL Enterprise |
| Parallel | pg_dump -Fd -j N | MySQL Shell dump-instance |
| PITR | WAL archiving + restore_command | Binary Log + mysqlbinlog |
| Automation | pgBackRest, Barman | Percona XtraBackup, mysqlbackup |`,
        },
      },
      {
        id: 'aries-recovery',
        title: { ko: 'WAL과 ARIES 복구 알고리즘', en: 'WAL & ARIES Recovery Algorithm' },
        level: 'database',
        content: {
          ko: `## Write-Ahead Logging (WAL)

데이터베이스 복구의 핵심 원칙: **데이터를 디스크에 쓰기 전에, 로그를 먼저 디스크에 쓴다.**

\`\`\`
트랜잭션 실행:
  1. 변경 내용을 WAL 로그에 기록 (디스크)
  2. 변경된 페이지는 버퍼 풀에만 반영 (메모리)
  3. 체크포인트 시 또는 비동기로 데이터 파일에 반영 (디스크)
\`\`\`

### WAL 레코드 구조

\`\`\`
[LSN] [TransactionID] [Type] [PageID] [Offset] [Before Image] [After Image]

예시:
LSN=101  T1  UPDATE  Page5  Offset=200  Before='old_value'  After='new_value'
LSN=102  T1  COMMIT
LSN=103  T2  INSERT  Page8  Offset=400  Before=NULL  After='row_data'
LSN=104  T2  ABORT
\`\`\`

- **LSN (Log Sequence Number)**: 로그 레코드의 고유 순번 (단조 증가)
- **Before Image**: 변경 전 데이터 (UNDO에 사용)
- **After Image**: 변경 후 데이터 (REDO에 사용)

### 체크포인트 (Checkpoint)

주기적으로 메모리의 더티 페이지를 디스크에 반영하고 로그에 기록합니다.

\`\`\`
[체크포인트 기록 내용]
- 활성 트랜잭션 목록 (Active Transaction Table, ATT)
- 더티 페이지 목록 (Dirty Page Table, DPT)
- 각 더티 페이지의 recLSN (최초 수정 시점)
\`\`\`

\`\`\`sql
-- PostgreSQL 체크포인트 설정
SHOW checkpoint_timeout;     -- 기본: 5분
SHOW max_wal_size;           -- 기본: 1GB (초과 시 체크포인트)

-- 수동 체크포인트
CHECKPOINT;
\`\`\`

## ARIES 복구 알고리즘

**ARIES (Algorithm for Recovery and Isolation Exploiting Semantics)**는 대부분의 상용 DBMS가 사용하는 복구 알고리즘입니다.

### 3단계 복구 프로세스

\`\`\`
장애 발생!
    ↓
[1. 분석 단계 (Analysis)]
- 마지막 체크포인트부터 로그를 순방향 스캔
- 장애 시점의 활성 트랜잭션 목록 (ATT) 재구성
- 더티 페이지 목록 (DPT) 재구성
    ↓
[2. REDO 단계 (Redo)]
- DPT의 가장 작은 recLSN부터 로그를 순방향 재실행
- 커밋된 트랜잭션과 미커밋 트랜잭션 모두 REDO
- "Repeating history" — 장애 직전 상태를 정확히 복원
    ↓
[3. UNDO 단계 (Undo)]
- ATT에 남은 미커밋 트랜잭션을 역방향으로 취소
- 각 UNDO 작업도 CLR(Compensation Log Record)로 기록
- 모든 미커밋 트랜잭션이 롤백되면 복구 완료
\`\`\`

### REDO 판단 로직

\`\`\`
페이지 P에 대한 로그 레코드(LSN=L)를 REDO할지 판단:

1. P가 DPT에 없으면 → SKIP (더티 아님)
2. DPT[P].recLSN > L → SKIP (이미 반영됨)
3. 디스크 페이지의 pageLSN ≥ L → SKIP (이미 반영됨)
4. 위 조건 모두 해당 없으면 → REDO!
\`\`\`

### CLR (Compensation Log Record)

UNDO 중에 생성되는 보상 로그입니다.

\`\`\`
LSN=105  T2  CLR  Page8  UNDO of LSN=103  undoNextLSN=NULL

의미: T2의 LSN=103 작업을 취소함
undoNextLSN: 다음에 UNDO할 로그 (NULL이면 T2의 UNDO 완료)
\`\`\`

> CLR이 있기에 **복구 중 다시 장애가 발생해도** 안전합니다. 이미 UNDO된 작업은 다시 UNDO하지 않습니다.

### 실무에서의 WAL

\`\`\`sql
-- PostgreSQL WAL 상태 확인
SELECT pg_current_wal_lsn();           -- 현재 WAL 위치
SELECT pg_walfile_name(pg_current_wal_lsn()); -- 현재 WAL 파일명
SELECT pg_wal_lsn_diff(
  pg_current_wal_lsn(),
  '0/0'::pg_lsn
) / 1024 / 1024 AS wal_mb;            -- WAL 총 생성량 (MB)

-- WAL 관련 설정
SHOW wal_level;              -- minimal, replica, logical
SHOW wal_buffers;            -- WAL 버퍼 크기
SHOW synchronous_commit;     -- 동기 커밋 여부
\`\`\`

| 설정 | 기본값 | 설명 |
|------|--------|------|
| \`wal_level\` | replica | WAL 기록 수준 (PITR/복제에 필요) |
| \`synchronous_commit\` | on | off: 성능↑, 장애 시 최근 커밋 유실 가능 |
| \`full_page_writes\` | on | 체크포인트 후 첫 수정 시 전체 페이지 기록 (torn page 방지) |`,
          en: `## Write-Ahead Logging (WAL)

The core principle of database recovery: **Write the log to disk BEFORE writing the data to disk.**

\`\`\`
Transaction execution:
  1. Write changes to WAL log (disk)
  2. Modified pages only reflected in buffer pool (memory)
  3. Data files written at checkpoint or asynchronously (disk)
\`\`\`

### WAL Record Structure

\`\`\`
[LSN] [TransactionID] [Type] [PageID] [Offset] [Before Image] [After Image]

Example:
LSN=101  T1  UPDATE  Page5  Offset=200  Before='old_value'  After='new_value'
LSN=102  T1  COMMIT
LSN=103  T2  INSERT  Page8  Offset=400  Before=NULL  After='row_data'
LSN=104  T2  ABORT
\`\`\`

- **LSN (Log Sequence Number)**: Unique monotonically increasing ID for each log record
- **Before Image**: Data before modification (used for UNDO)
- **After Image**: Data after modification (used for REDO)

### Checkpoint

Periodically flushes dirty pages from memory to disk and records this in the log.

\`\`\`
[Checkpoint records]
- Active Transaction Table (ATT)
- Dirty Page Table (DPT)
- recLSN for each dirty page (first modification time)
\`\`\`

\`\`\`sql
-- PostgreSQL checkpoint settings
SHOW checkpoint_timeout;     -- Default: 5min
SHOW max_wal_size;           -- Default: 1GB (triggers checkpoint when exceeded)

-- Manual checkpoint
CHECKPOINT;
\`\`\`

## ARIES Recovery Algorithm

**ARIES (Algorithm for Recovery and Isolation Exploiting Semantics)** is the recovery algorithm used by most commercial DBMS.

### 3-Phase Recovery Process

\`\`\`
Crash!
    ↓
[1. Analysis Phase]
- Forward scan log from last checkpoint
- Reconstruct Active Transaction Table (ATT) at crash time
- Reconstruct Dirty Page Table (DPT)
    ↓
[2. REDO Phase]
- Forward replay log from smallest recLSN in DPT
- REDO both committed AND uncommitted transactions
- "Repeating history" — exactly restore pre-crash state
    ↓
[3. UNDO Phase]
- Reverse uncommitted transactions remaining in ATT
- Each UNDO action is logged as a CLR (Compensation Log Record)
- Recovery complete when all uncommitted transactions are rolled back
\`\`\`

### REDO Decision Logic

\`\`\`
For log record (LSN=L) on page P:

1. P not in DPT → SKIP (not dirty)
2. DPT[P].recLSN > L → SKIP (already applied)
3. Disk page's pageLSN ≥ L → SKIP (already applied)
4. None of the above → REDO!
\`\`\`

### CLR (Compensation Log Record)

Compensation logs generated during UNDO.

\`\`\`
LSN=105  T2  CLR  Page8  UNDO of LSN=103  undoNextLSN=NULL

Meaning: Undid T2's operation at LSN=103
undoNextLSN: Next log to UNDO (NULL means T2's UNDO is complete)
\`\`\`

> CLRs ensure safety even if **another crash occurs during recovery**. Already-undone operations won't be undone again.

### WAL in Practice

\`\`\`sql
-- PostgreSQL WAL status
SELECT pg_current_wal_lsn();           -- Current WAL position
SELECT pg_walfile_name(pg_current_wal_lsn()); -- Current WAL filename
SELECT pg_wal_lsn_diff(
  pg_current_wal_lsn(),
  '0/0'::pg_lsn
) / 1024 / 1024 AS wal_mb;            -- Total WAL generated (MB)

-- WAL settings
SHOW wal_level;              -- minimal, replica, logical
SHOW wal_buffers;            -- WAL buffer size
SHOW synchronous_commit;     -- Synchronous commit flag
\`\`\`

| Setting | Default | Description |
|---------|---------|-------------|
| \`wal_level\` | replica | WAL recording level (needed for PITR/replication) |
| \`synchronous_commit\` | on | off: better performance, risk of losing recent commits on crash |
| \`full_page_writes\` | on | Write full page on first modification after checkpoint (prevents torn pages) |`,
        },
      },
      {
        id: 'replication-ha',
        title: { ko: '복제와 고가용성', en: 'Replication & High Availability' },
        level: 'database',
        content: {
          ko: `## 복제와 고가용성 (Replication & HA)

복제(Replication)는 데이터를 여러 서버에 동기화하여 **읽기 분산**과 **장애 대비**를 구현하는 기술입니다.

### 복제 유형

| 유형 | 설명 | 데이터 손실 |
|------|------|-----------|
| **동기식 (Synchronous)** | 커밋 전 복제본 확인 | 없음 (zero data loss) |
| **비동기식 (Asynchronous)** | 커밋 후 나중에 복제 | 가능 (약간의 지연) |
| **반동기식 (Semi-sync)** | 최소 1개 복제본 확인 | 거의 없음 |

### PostgreSQL 복제

#### Streaming Replication (물리적 복제)

\`\`\`bash
# === Primary 서버 설정 ===
# postgresql.conf
# wal_level = replica
# max_wal_senders = 5
# synchronous_standby_names = 'standby1'  # 동기식

# pg_hba.conf (복제 접속 허용)
# host replication replicator standby_ip/32 scram-sha-256
\`\`\`

\`\`\`bash
# === Standby 서버 구성 ===
# 1. Primary에서 기본 백업
pg_basebackup -h primary_host -U replicator \\
  -D /var/lib/postgresql/17/main -Fp -Xs -P -R

# -R 옵션이 자동으로 standby.signal 생성 +
# postgresql.auto.conf에 primary_conninfo 설정
\`\`\`

\`\`\`sql
-- Primary에서 복제 상태 확인
SELECT client_addr, state, sync_state,
  sent_lsn, write_lsn, flush_lsn, replay_lsn,
  pg_wal_lsn_diff(sent_lsn, replay_lsn) AS lag_bytes
FROM pg_stat_replication;

-- Standby에서 복제 지연 확인
SELECT now() - pg_last_xact_replay_timestamp() AS replication_lag;
\`\`\`

#### Logical Replication (논리적 복제)

\`\`\`sql
-- Publisher (원본) 설정
-- postgresql.conf: wal_level = logical

-- Publication 생성
CREATE PUBLICATION my_pub FOR TABLE orders, products;
-- 전체 테이블 발행
CREATE PUBLICATION all_pub FOR ALL TABLES;

-- Subscriber (구독자) 설정
CREATE SUBSCRIPTION my_sub
  CONNECTION 'host=primary_host dbname=mydb user=replicator'
  PUBLICATION my_pub;

-- 구독 상태 확인
SELECT * FROM pg_stat_subscription;
\`\`\`

| 항목 | 스트리밍 복제 | 논리적 복제 |
|------|-------------|-----------|
| 복제 단위 | 전체 클러스터 | 테이블 단위 선택 |
| 버전 호환 | 동일 메이저 버전 | 다른 버전 가능 |
| DDL 복제 | 자동 | 수동 적용 필요 |
| 쓰기 가능 | Standby 읽기 전용 | Subscriber 쓰기 가능 |
| 용도 | HA, 읽기 분산 | 부분 복제, 데이터 통합 |

### MySQL 복제

#### Source-Replica (비동기 복제)

\`\`\`sql
-- === Source (Primary) 설정 ===
-- my.cnf:
-- server-id = 1
-- log_bin = mysql-bin
-- binlog_format = ROW
-- gtid_mode = ON
-- enforce_gtid_consistency = ON

-- 복제 계정 생성
CREATE USER 'repl'@'replica_ip' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'replica_ip';
\`\`\`

\`\`\`sql
-- === Replica 설정 ===
-- my.cnf:
-- server-id = 2
-- relay_log = relay-bin
-- read_only = ON

-- GTID 기반 복제 시작
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST = 'primary_host',
  SOURCE_USER = 'repl',
  SOURCE_PASSWORD = 'password',
  SOURCE_AUTO_POSITION = 1;

START REPLICA;

-- 복제 상태 확인
SHOW REPLICA STATUS\\G
\`\`\`

#### Group Replication (MySQL 8.0+)

\`\`\`sql
-- 멀티 소스, 자동 장애 복구
-- 3~9개 노드로 구성
-- Single-Primary 또는 Multi-Primary 모드

-- Group Replication 시작
SET GLOBAL group_replication_bootstrap_group = ON;
START GROUP_REPLICATION;
SET GLOBAL group_replication_bootstrap_group = OFF;

-- 그룹 멤버 확인
SELECT MEMBER_HOST, MEMBER_PORT, MEMBER_STATE, MEMBER_ROLE
FROM performance_schema.replication_group_members;
\`\`\`

#### Semi-Synchronous Replication

\`\`\`sql
-- Source에서 플러그인 설치
INSTALL PLUGIN rpl_semi_sync_source SONAME 'semisync_source.so';
SET GLOBAL rpl_semi_sync_source_enabled = ON;

-- Replica에서 플러그인 설치
INSTALL PLUGIN rpl_semi_sync_replica SONAME 'semisync_replica.so';
SET GLOBAL rpl_semi_sync_replica_enabled = ON;
\`\`\`

### 고가용성 (HA) 아키텍처

고가용성은 시스템 장애 시에도 서비스를 지속하기 위한 아키텍처입니다.

#### 주요 HA 솔루션

| 구성 | 설명 | 자동 Failover |
|------|------|-------------|
| **PostgreSQL + Patroni** | etcd/Consul 기반 클러스터 관리, 자동 리더 선출 | ✅ |
| **PostgreSQL + pgpool-II** | 로드밸런싱 + 커넥션 풀링 + 자동 장애조치 | ✅ |
| **MySQL InnoDB Cluster** | Group Replication + MySQL Router + Shell | ✅ |
| **MySQL + ProxySQL** | 쿼리 라우팅 + 로드밸런싱 (수동 설정) | ⚠️ 수동/스크립트 |
| **클라우드 관리형** | RDS Multi-AZ, Aurora, Cloud SQL | ✅ 완전 자동 |

#### 일반적인 HA 아키텍처

**계층 구조:**
1. **애플리케이션 레이어**
   - 다수의 애플리케이션 서버에서 DB 연결

2. **프록시/로드밸런서 레이어**
   - pgpool-II, ProxySQL, HAProxy 등
   - 쓰기는 Primary로, 읽기는 Standby로 자동 라우팅
   - 연결 풀링 및 헬스체크

3. **데이터베이스 레이어**
   - **Primary (주 서버)**: 읽기/쓰기 모두 처리
   - **Standby (대기 서버)**: 읽기 전용, Primary 장애 시 승격
   - Primary → Standby 간 실시간 복제 (Streaming/Binlog)

**Failover 시나리오:**
1. Primary 서버 장애 감지
2. 자동으로 Standby 중 하나를 새로운 Primary로 승격
3. 애플리케이션 연결을 새 Primary로 재라우팅
4. 서비스 다운타임 최소화 (일반적으로 30초 이내)`,
          en: `## Replication & High Availability (HA)

Replication synchronizes data across multiple servers for **read scaling** and **fault tolerance**.

### Replication Types

| Type | Description | Data Loss |
|------|-------------|-----------|
| **Synchronous** | Confirm replica before commit | None (zero data loss) |
| **Asynchronous** | Replicate after commit | Possible (slight lag) |
| **Semi-synchronous** | Confirm at least 1 replica | Nearly none |

### PostgreSQL Replication

#### Streaming Replication (Physical)

\`\`\`bash
# === Primary server config ===
# postgresql.conf
# wal_level = replica
# max_wal_senders = 5
# synchronous_standby_names = 'standby1'  # sync mode
\`\`\`

\`\`\`bash
# === Build Standby ===
pg_basebackup -h primary_host -U replicator \\
  -D /var/lib/postgresql/17/main -Fp -Xs -P -R
# -R auto-creates standby.signal + primary_conninfo
\`\`\`

\`\`\`sql
-- Check replication status on Primary
SELECT client_addr, state, sync_state,
  sent_lsn, replay_lsn,
  pg_wal_lsn_diff(sent_lsn, replay_lsn) AS lag_bytes
FROM pg_stat_replication;

-- Check lag on Standby
SELECT now() - pg_last_xact_replay_timestamp() AS replication_lag;
\`\`\`

#### Logical Replication

\`\`\`sql
-- Publisher: wal_level = logical
CREATE PUBLICATION my_pub FOR TABLE orders, products;

-- Subscriber
CREATE SUBSCRIPTION my_sub
  CONNECTION 'host=primary_host dbname=mydb user=replicator'
  PUBLICATION my_pub;

SELECT * FROM pg_stat_subscription;
\`\`\`

| Feature | Streaming | Logical |
|---------|-----------|---------|
| Scope | Entire cluster | Selected tables |
| Version compat | Same major | Cross-version |
| DDL replication | Automatic | Manual |
| Writable | Standby read-only | Subscriber writable |
| Use case | HA, read scaling | Partial replication, data integration |

### MySQL Replication

#### Source-Replica (Async)

\`\`\`sql
-- Source: server-id=1, log_bin, gtid_mode=ON
CREATE USER 'repl'@'replica_ip' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'replica_ip';

-- Replica: server-id=2, read_only=ON
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='primary_host', SOURCE_USER='repl',
  SOURCE_PASSWORD='password', SOURCE_AUTO_POSITION=1;
START REPLICA;
SHOW REPLICA STATUS\\G
\`\`\`

#### Group Replication (MySQL 8.0+)

\`\`\`sql
-- Multi-source, automatic failover, 3-9 nodes
SET GLOBAL group_replication_bootstrap_group = ON;
START GROUP_REPLICATION;

SELECT MEMBER_HOST, MEMBER_STATE, MEMBER_ROLE
FROM performance_schema.replication_group_members;
\`\`\`

### HA Architecture

High availability ensures continuous service even during system failures.

#### Major HA Solutions

| Setup | Description | Auto Failover |
|-------|-------------|---------------|
| **PG + Patroni** | etcd/Consul-based cluster management with automatic leader election | ✅ |
| **PG + pgpool-II** | Load balancing + connection pooling + automatic failover | ✅ |
| **MySQL InnoDB Cluster** | Group Replication + MySQL Router + Shell | ✅ |
| **MySQL + ProxySQL** | Query routing + load balancing (manual configuration) | ⚠️ Manual/Script |
| **Cloud Managed** | RDS Multi-AZ, Aurora, Cloud SQL | ✅ Fully automatic |

#### Typical HA Architecture

**Layer Structure:**
1. **Application Layer**
   - Multiple application servers connecting to the database

2. **Proxy/Load Balancer Layer**
   - pgpool-II, ProxySQL, HAProxy, etc.
   - Automatically routes writes to Primary, reads to Standby
   - Connection pooling and health checks

3. **Database Layer**
   - **Primary (Master)**: Handles both reads and writes
   - **Standby (Replica)**: Read-only, promoted on Primary failure
   - Real-time replication between Primary → Standby (Streaming/Binlog)

**Failover Scenario:**
1. Detect Primary server failure
2. Automatically promote one Standby to new Primary
3. Reroute application connections to new Primary
4. Minimize service downtime (typically < 30 seconds)`,
        },
      },
      {
        id: 'innodb-deep-dive',
        title: { ko: 'InnoDB 심화', en: 'InnoDB Deep Dive' },
        level: 'database',
        content: {
          ko: `## InnoDB 심화 (MySQL)

InnoDB는 MySQL의 기본 스토리지 엔진으로, **ACID 트랜잭션**, **행 수준 잠금**, **MVCC**, **외래키**를 지원합니다.

### InnoDB 아키텍처

> 상단의 **인터랙티브 다이어그램**을 통해 InnoDB 아키텍처를 시각적으로 확인하세요.

#### 주요 컴포넌트

**🧠 메모리 영역 (In-Memory)**
- **Buffer Pool** (RAM의 70-80%): 데이터 페이지와 인덱스를 캐시하는 핵심 메모리 영역. LRU 알고리즘으로 관리되며, 히트율 99% 이상이 목표입니다.
- **Log Buffer** (16MB): Redo Log를 디스크에 쓰기 전 버퍼링합니다.
- **Change Buffer**: 보조 인덱스 변경사항을 버퍼링하여 디스크 I/O를 최적화합니다.
- **Adaptive Hash Index (AHI)**: 자주 조회되는 페이지에 대한 해시 인덱스를 자동으로 생성합니다.

**💿 디스크 영역 (On-Disk)**
- **Data Files (.ibd)**: 테이블 데이터를 PK 기준 클러스터드 인덱스로 저장합니다.
- **Redo Logs (ib_logfile)**: WAL 방식으로 트랜잭션 변경사항을 기록. 크래시 복구에 사용됩니다.
- **Undo Logs**: 트랜잭션 롤백과 MVCC 읽기 일관성을 제공합니다.
- **System Tablespace (ibdata1)**: 시스템 정보 및 데이터 딕셔너리를 저장합니다.

**⚙️ 백그라운드 스레드**
- **Master Thread**: 전반적인 작업을 조율합니다.
- **IO Threads**: 비동기 I/O를 처리합니다 (읽기/쓰기).
- **Purge Thread**: MVCC를 위한 구 버전 데이터를 정리합니다.
- **Page Cleaner Thread**: Dirty 페이지를 디스크로 플러시합니다.

### 클러스터드 인덱스 (Clustered Index)

InnoDB는 **PK 기준으로 데이터를 물리적으로 정렬**하여 저장합니다.

\`\`\`sql
-- 테이블 = 클러스터드 인덱스 (PK 순서 저장)
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,  -- 클러스터드 인덱스
  customer_id INT,
  order_date TIMESTAMP,
  INDEX idx_customer (customer_id),   -- 보조 인덱스 → PK 참조
  INDEX idx_date (order_date)
);

-- 보조 인덱스 구조: [order_date 값] → [PK(id) 값]
-- 보조 인덱스 조회 시 PK로 다시 조회 (Bookmark Lookup)
\`\`\`

| 항목 | 클러스터드 인덱스 | 보조 인덱스 |
|------|-----------------|-----------|
| 저장 구조 | 리프 노드 = 실제 데이터 행 | 리프 노드 = PK 값 |
| 정렬 | PK 순서로 물리 정렬 | 인덱스 키 순서 |
| 개수 | 테이블당 1개 (PK) | 여러 개 가능 |
| 범위 검색 | 매우 빠름 (연속 읽기) | PK 참조 필요 |

### Buffer Pool 관리

\`\`\`sql
-- Buffer Pool 크기 설정 (동적 변경 가능)
SET GLOBAL innodb_buffer_pool_size = 4 * 1024 * 1024 * 1024; -- 4GB

-- Buffer Pool 상태 모니터링
SHOW STATUS LIKE 'Innodb_buffer_pool%';

-- 주요 메트릭
-- Innodb_buffer_pool_read_requests  : 논리적 읽기 (캐시 히트 포함)
-- Innodb_buffer_pool_reads          : 디스크 읽기 (캐시 미스)
-- 히트율 = 1 - (reads / read_requests) → 99% 이상 권장

-- Buffer Pool 내용 확인
SELECT TABLE_NAME,
  COUNT(*) AS pages,
  SUM(IF(IS_OLD='YES', 1, 0)) AS old_pages
FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
WHERE TABLE_NAME IS NOT NULL
GROUP BY TABLE_NAME
ORDER BY pages DESC LIMIT 10;
\`\`\`

### Redo Log & Undo Log

\`\`\`sql
-- Redo Log: 커밋된 트랜잭션의 장애 복구 보장
SHOW VARIABLES LIKE 'innodb_redo_log_capacity'; -- 8.0.30+
SHOW STATUS LIKE 'Innodb_redo_log%';

-- Undo Log: 트랜잭션 롤백 + MVCC 읽기 일관성
SHOW VARIABLES LIKE 'innodb_undo%';
-- innodb_undo_tablespaces: Undo 테이블스페이스 수
-- innodb_max_undo_log_size: 자동 truncate 크기
\`\`\`

### 잠금 (Locking) 상세

\`\`\`sql
-- InnoDB 잠금 유형
-- Record Lock: 인덱스 레코드에 대한 잠금
-- Gap Lock: 인덱스 레코드 사이 간격 잠금 (Phantom 방지)
-- Next-Key Lock: Record + Gap 결합 (기본 동작)

-- 현재 잠금 상태 확인
SELECT * FROM performance_schema.data_locks;

-- 잠금 대기 확인
SELECT * FROM performance_schema.data_lock_waits;

-- 데드락 최근 정보
SHOW ENGINE INNODB STATUS\\G
-- LATEST DETECTED DEADLOCK 섹션 확인

-- 트랜잭션 격리 수준별 잠금
-- READ UNCOMMITTED: 잠금 없음 (Dirty Read 가능)
-- READ COMMITTED: Record Lock만 (Oracle 기본)
-- REPEATABLE READ: Next-Key Lock (MySQL 기본)
-- SERIALIZABLE: 모든 SELECT에 공유 잠금
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
\`\`\`

### InnoDB 주요 설정

\`\`\`sql
-- 성능 관련 핵심 변수
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';     -- RAM의 70-80%
SHOW VARIABLES LIKE 'innodb_log_file_size';        -- Redo Log 크기
SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit'; -- 1=안전, 2=빠름
SHOW VARIABLES LIKE 'innodb_flush_method';         -- O_DIRECT 권장
SHOW VARIABLES LIKE 'innodb_io_capacity';          -- IOPS 설정
SHOW VARIABLES LIKE 'innodb_read_io_threads';      -- 읽기 스레드
SHOW VARIABLES LIKE 'innodb_write_io_threads';     -- 쓰기 스레드
\`\`\``,
          en: `## InnoDB Deep Dive (MySQL)

InnoDB is MySQL's default storage engine, supporting **ACID transactions**, **row-level locking**, **MVCC**, and **foreign keys**.

### InnoDB Architecture Detail

\`\`\`
┌─────────────── InnoDB Memory ─────────────────┐
│  ┌──────────────────────────────────────────┐  │
│  │         Buffer Pool (up to 80% RAM)      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ │  │
│  │  │Data Pages│ │Idx Pages │ │Change Buf│ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ │  │
│  │  ┌──────────────────┐ ┌──────────────┐  │  │
│  │  │Adaptive Hash Idx │ │Lock Info     │  │  │
│  │  └──────────────────┘ └──────────────┘  │  │
│  └──────────────────────────────────────────┘  │
│  ┌────────────┐  ┌──────────────┐              │
│  │ Log Buffer │  │ Double Write │              │
│  └────────────┘  └──────────────┘              │
└────────────────────────────────────────────────┘

┌─────────────── InnoDB Disk ───────────────────┐
│  ┌──────────┐ ┌───────────┐ ┌──────────────┐  │
│  │System    │ │Per-Table  │ │Redo Log Files│  │
│  │Tablespace│ │(.ibd)     │ │              │  │
│  └──────────┘ └───────────┘ └──────────────┘  │
│  ┌──────────────┐ ┌───────────────────────┐   │
│  │Undo          │ │Doublewrite Files      │   │
│  │Tablespace    │ │(partial write protect) │   │
│  └──────────────┘ └───────────────────────┘   │
└────────────────────────────────────────────────┘
\`\`\`

### Clustered Index

InnoDB **physically sorts data by the PK**.

\`\`\`sql
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,  -- clustered index
  customer_id INT,
  order_date TIMESTAMP,
  INDEX idx_customer (customer_id),   -- secondary → references PK
  INDEX idx_date (order_date)
);
-- Secondary index leaf: [key value] → [PK value]
-- Secondary lookup requires PK lookup (Bookmark Lookup)
\`\`\`

| Aspect | Clustered Index | Secondary Index |
|--------|----------------|-----------------|
| Leaf node | Actual data row | PK value |
| Sorting | Physical PK order | Index key order |
| Count | 1 per table (PK) | Multiple allowed |
| Range scan | Very fast (sequential) | Needs PK lookup |

### Buffer Pool Management

\`\`\`sql
SET GLOBAL innodb_buffer_pool_size = 4 * 1024 * 1024 * 1024; -- 4GB

SHOW STATUS LIKE 'Innodb_buffer_pool%';
-- Hit ratio = 1 - (reads / read_requests) → target 99%+

SELECT TABLE_NAME, COUNT(*) AS pages
FROM INFORMATION_SCHEMA.INNODB_BUFFER_PAGE
WHERE TABLE_NAME IS NOT NULL
GROUP BY TABLE_NAME ORDER BY pages DESC LIMIT 10;
\`\`\`

### Redo Log & Undo Log

\`\`\`sql
-- Redo: crash recovery for committed txns
SHOW VARIABLES LIKE 'innodb_redo_log_capacity';
-- Undo: rollback + MVCC read consistency
SHOW VARIABLES LIKE 'innodb_undo%';
\`\`\`

### Locking Detail

\`\`\`sql
-- Record Lock: on index record
-- Gap Lock: between index records (prevents phantoms)
-- Next-Key Lock: Record + Gap (default in REPEATABLE READ)

SELECT * FROM performance_schema.data_locks;
SELECT * FROM performance_schema.data_lock_waits;
SHOW ENGINE INNODB STATUS\\G  -- LATEST DETECTED DEADLOCK

-- Isolation levels and locking
-- READ UNCOMMITTED: no locks
-- READ COMMITTED: record locks only
-- REPEATABLE READ: next-key locks (MySQL default)
-- SERIALIZABLE: shared locks on all SELECTs
\`\`\`

### Key InnoDB Settings

\`\`\`sql
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';        -- 70-80% RAM
SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit'; -- 1=safe, 2=fast
SHOW VARIABLES LIKE 'innodb_flush_method';            -- O_DIRECT recommended
SHOW VARIABLES LIKE 'innodb_io_capacity';             -- IOPS setting
\`\`\``,
        },
      },
      {
        id: 'postgresql-internals',
        title: { ko: 'PostgreSQL 심화', en: 'PostgreSQL Internals' },
        level: 'database',
        content: {
          ko: `## PostgreSQL 심화

PostgreSQL은 **MVCC 기반 단일 스토리지 엔진**을 사용하며, 확장성이 뛰어난 오픈소스 RDBMS입니다.

### 프로세스 아키텍처

> 상단의 **인터랙티브 다이어그램**을 통해 PostgreSQL 프로세스 아키텍처를 시각적으로 확인하세요.

PostgreSQL은 **멀티 프로세스 아키텍처**를 사용합니다 (MySQL InnoDB의 멀티 스레드와 대조적).

#### 주요 프로세스

**👑 Postmaster**: 메인 데몬 프로세스. 클라이언트 연결을 수신하고 각 연결마다 새로운 Backend 프로세스를 생성합니다.

**👥 Backend Processes**: 각 클라이언트 연결마다 별도의 프로세스가 생성됩니다. 각 Backend는 독립적인 메모리 공간을 가지며 쿼리 실행을 담당합니다.

**⚙️ Background Workers**:
- **Background Writer**: Dirty 페이지를 주기적으로 디스크에 기록하여 Checkpoint 시 부하를 분산시킵니다.
- **WAL Writer**: WAL 버퍼를 디스크에 기록합니다. 트랜잭션 커밋 시 즉시 플러시됩니다.
- **Checkpointer**: 주기적으로 체크포인트를 수행하여 Shared Buffers의 Dirty 페이지를 디스크에 동기화합니다.
- **Autovacuum Launcher/Workers**: MVCC로 생성된 Dead Tuple을 자동으로 정리하고 통계 정보를 업데이트합니다.

**💭 공유 메모리 구조**:
- **Shared Buffers** (RAM의 25%): 테이블과 인덱스 페이지를 캐시하는 공유 메모리. 모든 Backend 프로세스가 공유합니다.
- **WAL Buffers** (16MB): Write-Ahead Log 버퍼. 트랜잭션 로그를 디스크에 쓰기 전 메모리에서 버퍼링합니다.

### MVCC (Multi-Version Concurrency Control)

PostgreSQL은 **행의 여러 버전**을 유지하여 읽기와 쓰기가 서로 차단하지 않습니다.

\`\`\`sql
-- 각 행에는 숨겨진 시스템 컬럼이 있음
-- xmin: 행을 생성한 트랜잭션 ID
-- xmax: 행을 삭제/갱신한 트랜잭션 ID (0이면 유효)
-- ctid: 물리적 위치 (page, offset)

SELECT xmin, xmax, ctid, * FROM orders LIMIT 5;

-- MVCC 동작 예시:
-- 1. TX1: UPDATE orders SET status='shipped' WHERE id=1;
--    → 기존 행의 xmax = TX1_ID (old version)
--    → 새 행의 xmin = TX1_ID (new version)
-- 2. TX2 (TX1 커밋 전): SELECT * FROM orders WHERE id=1;
--    → xmax가 아직 커밋되지 않았으므로 old version 읽음
\`\`\`

### VACUUM 상세

MVCC로 인해 **Dead Tuple**(이전 버전 행)이 쌓이므로 VACUUM으로 정리합니다.

\`\`\`sql
-- Dead Tuple 확인
SELECT schemaname, relname,
  n_live_tup, n_dead_tup,
  ROUND(n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup, 0) * 100, 2) AS dead_pct,
  last_vacuum, last_autovacuum
FROM pg_stat_user_tables
WHERE n_dead_tup > 0
ORDER BY n_dead_tup DESC;

-- VACUUM 유형
VACUUM orders;                    -- 일반: 공간 재사용 가능 표시
VACUUM FULL orders;               -- FULL: 테이블 재작성 (배타적 잠금!)
VACUUM ANALYZE orders;            -- + 통계 갱신
VACUUM (VERBOSE, PARALLEL 4) orders; -- 병렬 VACUUM (PG 13+)
\`\`\`

\`\`\`sql
-- Autovacuum 설정 확인
SHOW autovacuum;                          -- on/off
SHOW autovacuum_vacuum_threshold;         -- 50 (최소 dead tuple 수)
SHOW autovacuum_vacuum_scale_factor;      -- 0.2 (20% dead ratio)
-- 실행 조건: dead tuples > threshold + scale_factor * n_live_tup

-- 테이블별 Autovacuum 커스텀 설정
ALTER TABLE orders SET (
  autovacuum_vacuum_scale_factor = 0.05,  -- 5%로 더 자주
  autovacuum_analyze_scale_factor = 0.02
);
\`\`\`

### 인덱스 유형

| 인덱스 | 용도 | 예시 |
|--------|------|------|
| **B-tree** | 범위/등호 검색 (기본) | WHERE price > 1000 |
| **Hash** | 등호 검색만 | WHERE id = 42 |
| **GIN** | 배열, JSONB, 전문검색 | WHERE tags @> '{sql}' |
| **GiST** | 지리/범위/근접 검색 | WHERE point <-> '(0,0)' |
| **BRIN** | 물리적 순서 상관 큰 컬럼 | WHERE created_at > '2024-01-01' |
| **SP-GiST** | 비균형 트리 구조 | IP 범위, 전화번호 |

\`\`\`sql
-- B-tree (기본)
CREATE INDEX idx_orders_date ON orders(order_date);

-- 복합 인덱스
CREATE INDEX idx_orders_status_date ON orders(status, order_date);

-- 부분 인덱스 (조건부)
CREATE INDEX idx_active_orders ON orders(order_date)
  WHERE status IN ('pending', 'processing');

-- GIN (JSONB)
CREATE INDEX idx_products_meta ON products USING GIN (metadata jsonb_path_ops);

-- BRIN (시계열 데이터에 효과적)
CREATE INDEX idx_orders_date_brin ON orders USING BRIN (order_date);

-- 표현식 인덱스
CREATE INDEX idx_customers_lower_email ON customers (LOWER(email));

-- 커버링 인덱스 (INCLUDE)
CREATE INDEX idx_orders_cover ON orders(customer_id)
  INCLUDE (order_date, total_amount);
\`\`\`

### 쿼리 실행 계획 분석

\`\`\`sql
-- 기본 실행 계획
EXPLAIN SELECT * FROM orders WHERE customer_id = 1;

-- 실제 실행 통계 포함
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
  SELECT c.name, COUNT(o.id) AS order_count
  FROM customers c
  JOIN orders o ON c.id = o.customer_id
  GROUP BY c.name;

-- 주요 확인 포인트:
-- Seq Scan vs Index Scan (순차 탐색 vs 인덱스)
-- Nested Loop vs Hash Join vs Merge Join
-- actual time vs estimated (예측 정확도)
-- Buffers: shared hit (캐시) vs read (디스크)
\`\`\`

### PostgreSQL 고유 기능

\`\`\`sql
-- 테이블 상속
CREATE TABLE orders_2024 () INHERITS (orders);

-- 도메인 타입
CREATE DOMAIN email_type AS VARCHAR(150)
  CHECK (VALUE ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z]{2,}$');

-- LISTEN / NOTIFY (실시간 이벤트)
LISTEN order_events;
NOTIFY order_events, '{"order_id": 42, "status": "shipped"}';

-- Advisory Lock (애플리케이션 레벨 잠금)
SELECT pg_advisory_lock(42);       -- 잠금 획득
SELECT pg_advisory_unlock(42);     -- 잠금 해제

-- RETURNING (INSERT/UPDATE/DELETE 결과 반환)
INSERT INTO orders (customer_id, order_date, status, total_amount)
VALUES (1, NOW(), 'pending', 50000)
RETURNING id, order_date;

UPDATE orders SET status = 'shipped'
WHERE id = 1 RETURNING *;

-- Generate Series (데이터 생성)
SELECT generate_series(1, 12) AS month,
       date_trunc('month', make_date(2024, generate_series(1,12), 1)) AS month_start;
\`\`\`

### 주요 시스템 설정

\`\`\`sql
-- 메모리
SHOW shared_buffers;             -- RAM의 25% (캐시)
SHOW effective_cache_size;       -- RAM의 50-75% (OS 캐시 포함)
SHOW work_mem;                   -- 쿼리별 정렬/해시 (4MB~256MB)
SHOW maintenance_work_mem;       -- VACUUM/인덱스 생성 (256MB~1GB)

-- WAL
SHOW wal_level;                  -- minimal/replica/logical
SHOW max_wal_size;               -- 체크포인트 간 WAL 최대 크기
SHOW min_wal_size;               -- WAL 최소 유지 크기

-- 연결
SHOW max_connections;            -- 기본 100
SHOW superuser_reserved_connections; -- 슈퍼유저 예약 (기본 3)

-- 쿼리 최적화
SHOW random_page_cost;           -- SSD: 1.1, HDD: 4.0
SHOW effective_io_concurrency;   -- SSD: 200, HDD: 2
\`\`\``,
          en: `## PostgreSQL Internals

PostgreSQL uses a **single MVCC-based storage engine** and is a highly extensible open-source RDBMS.

### Process Architecture

\`\`\`
┌──────── PostgreSQL Process Structure ────┐
│                                          │
│  Postmaster (main process)               │
│  ├── Backend Process (1 per client)      │
│  ├── Background Writer (dirty pages)     │
│  ├── WAL Writer (WAL buffer → disk)      │
│  ├── Checkpointer                        │
│  ├── Autovacuum Launcher                 │
│  │   └── Autovacuum Worker(s)            │
│  ├── Stats Collector                     │
│  ├── Logical Replication Launcher        │
│  └── WAL Sender (streaming replication)  │
│                                          │
└──────────────────────────────────────────┘
\`\`\`

### MVCC (Multi-Version Concurrency Control)

PostgreSQL maintains **multiple row versions** so reads and writes don't block each other.

\`\`\`sql
-- Each row has hidden system columns
-- xmin: creating transaction ID
-- xmax: deleting/updating transaction ID (0 = valid)
-- ctid: physical location (page, offset)
SELECT xmin, xmax, ctid, * FROM orders LIMIT 5;
\`\`\`

### VACUUM Detail

MVCC accumulates **Dead Tuples** (old row versions); VACUUM reclaims them.

\`\`\`sql
SELECT schemaname, relname,
  n_live_tup, n_dead_tup,
  ROUND(n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup, 0) * 100, 2) AS dead_pct,
  last_vacuum, last_autovacuum
FROM pg_stat_user_tables WHERE n_dead_tup > 0 ORDER BY n_dead_tup DESC;

VACUUM orders;                        -- standard
VACUUM FULL orders;                   -- rewrite (exclusive lock!)
VACUUM ANALYZE orders;                -- + update stats
VACUUM (VERBOSE, PARALLEL 4) orders;  -- parallel (PG 13+)
\`\`\`

\`\`\`sql
-- Autovacuum tuning
SHOW autovacuum_vacuum_threshold;      -- 50
SHOW autovacuum_vacuum_scale_factor;   -- 0.2 (20%)
-- Triggers when: dead > threshold + scale_factor * live

ALTER TABLE orders SET (
  autovacuum_vacuum_scale_factor = 0.05
);
\`\`\`

### Index Types

| Index | Use Case | Example |
|-------|----------|---------|
| **B-tree** | Range/equality (default) | price > 1000 |
| **Hash** | Equality only | id = 42 |
| **GIN** | Arrays, JSONB, full-text | tags @> '{sql}' |
| **GiST** | Geometry, range, proximity | point <-> '(0,0)' |
| **BRIN** | Physically ordered columns | created_at ranges |
| **SP-GiST** | Unbalanced tree structures | IP ranges |

\`\`\`sql
CREATE INDEX idx_orders_date ON orders(order_date);

-- Partial index
CREATE INDEX idx_active_orders ON orders(order_date)
  WHERE status IN ('pending', 'processing');

-- GIN for JSONB
CREATE INDEX idx_meta ON products USING GIN (metadata jsonb_path_ops);

-- BRIN for time-series
CREATE INDEX idx_date_brin ON orders USING BRIN (order_date);

-- Covering index (INCLUDE)
CREATE INDEX idx_cover ON orders(customer_id)
  INCLUDE (order_date, total_amount);

-- Expression index
CREATE INDEX idx_lower_email ON customers (LOWER(email));
\`\`\`

### Query Plan Analysis

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
  SELECT c.name, COUNT(o.id) AS order_count
  FROM customers c
  JOIN orders o ON c.id = o.customer_id
  GROUP BY c.name;

-- Key checks:
-- Seq Scan vs Index Scan
-- Nested Loop vs Hash Join vs Merge Join
-- actual time vs estimated
-- Buffers: shared hit (cache) vs read (disk)
\`\`\`

### PostgreSQL-Specific Features

\`\`\`sql
-- Table inheritance
CREATE TABLE orders_2024 () INHERITS (orders);

-- Domain types
CREATE DOMAIN email_type AS VARCHAR(150)
  CHECK (VALUE ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z]{2,}$');

-- LISTEN / NOTIFY (real-time events)
LISTEN order_events;
NOTIFY order_events, '{"order_id": 42, "status": "shipped"}';

-- Advisory Lock (application-level locking)
SELECT pg_advisory_lock(42);
SELECT pg_advisory_unlock(42);

-- RETURNING clause
INSERT INTO orders (customer_id, order_date, status, total_amount)
VALUES (1, NOW(), 'pending', 50000) RETURNING id, order_date;

-- Generate Series
SELECT generate_series(1, 12) AS month;
\`\`\`

### Key System Settings

\`\`\`sql
SHOW shared_buffers;           -- 25% RAM (cache)
SHOW effective_cache_size;     -- 50-75% RAM (incl OS cache)
SHOW work_mem;                 -- per-query sort/hash (4MB-256MB)
SHOW maintenance_work_mem;     -- VACUUM/index build (256MB-1GB)
SHOW wal_level;                -- minimal/replica/logical
SHOW random_page_cost;         -- SSD: 1.1, HDD: 4.0
SHOW effective_io_concurrency; -- SSD: 200, HDD: 2
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
