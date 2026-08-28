-- ============================================================
-- BIBLE APP — FULL POSTGRES SCHEMA (v1)
-- ============================================================

-- ---------- CONTENT TABLES ----------
-- These are populated by the ingestion pipeline, not by users.

CREATE TABLE translations (
    id            SERIAL PRIMARY KEY,
    code          VARCHAR(20) UNIQUE NOT NULL,   -- e.g. 'kjv', 'am-1875', 'heb-wlc', 'grc-sblgnt'
    language      VARCHAR(50) NOT NULL,          -- 'English', 'Amharic', 'Hebrew', 'Greek'
    name          VARCHAR(200) NOT NULL,         -- display name, e.g. 'King James Version'
    license_type  VARCHAR(50) NOT NULL,          -- 'public_domain', 'creative_commons', 'licensed'
    source_url    TEXT,                          -- where the text came from, for attribution
    is_active     BOOLEAN NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE books (
    id            SERIAL PRIMARY KEY,
    testament     VARCHAR(10) NOT NULL CHECK (testament IN ('old', 'new')),
    book_order    SMALLINT NOT NULL,             -- canonical order, 1-66
    slug          VARCHAR(30) UNIQUE NOT NULL,   -- URL-safe id, e.g. 'ruth', 'song-of-solomon', '1-corinthians'
    name_en       VARCHAR(50) NOT NULL,
    name_am       VARCHAR(50),                   -- Amharic name
    name_he       VARCHAR(50),                   -- Hebrew name (OT books only)
    name_gr       VARCHAR(50),                   -- Greek name (NT books only)
    chapter_count SMALLINT NOT NULL
);

CREATE TABLE verses (
    id             BIGSERIAL PRIMARY KEY,
    book_id        INT NOT NULL REFERENCES books(id),
    chapter        SMALLINT NOT NULL,
    verse_num      SMALLINT NOT NULL,
    translation_id INT NOT NULL REFERENCES translations(id),
    text           TEXT NOT NULL,
    -- Generated search column for FR-P1-05 (full-text search).
    -- Uses 'simple' config (not 'english') since three of the four
    -- languages here aren't English — language-aware stemming would
    -- hurt search quality for Amharic/Hebrew/Greek text.
    text_search    tsvector GENERATED ALWAYS AS (to_tsvector('simple', text)) STORED,
    UNIQUE (book_id, chapter, verse_num, translation_id)
);

-- Hottest query path in the whole app: fetching a chapter in N translations
CREATE INDEX idx_verses_lookup ON verses (book_id, chapter, translation_id);

-- Full-text search index (FR-P1-05)
CREATE INDEX idx_verses_search ON verses USING GIN (text_search);

-- ---------- DAILY VERSE ----------
-- Precomputed so every user sees the same verse on a given date,
-- and so the notification job and the in-app "today" view agree.

CREATE TABLE daily_verses (
    date           DATE PRIMARY KEY,
    book_id        INT NOT NULL REFERENCES books(id),
    chapter        SMALLINT NOT NULL,
    verse_num      SMALLINT NOT NULL
);

-- ---------- INGESTION AUDIT LOG ----------
-- Satisfies NFR-P1-09: every ingestion pipeline run must be logged
-- (source, timing, verse count, outcome) so content updates are auditable.

CREATE TABLE ingestion_logs (
    id           SERIAL PRIMARY KEY,
    source       VARCHAR(100) NOT NULL,      -- e.g. 'sefaria', 'sblgnt', 'amharic-1875'
    started_at   TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    verse_count  INT,
    status       VARCHAR(20) NOT NULL,       -- 'success', 'failed', 'partial'
    error_detail TEXT
);

-- ---------- USER TABLES ----------

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    display_name  VARCHAR(100),
    auth_provider VARCHAR(20) NOT NULL DEFAULT 'email', -- 'email', 'google', 'apple'
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE bookmarks (
    id         BIGSERIAL PRIMARY KEY,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id    INT NOT NULL REFERENCES books(id),
    chapter    SMALLINT NOT NULL,
    verse_num  SMALLINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, book_id, chapter, verse_num)
);

CREATE INDEX idx_bookmarks_user ON bookmarks (user_id);

CREATE TABLE highlights (
    id         BIGSERIAL PRIMARY KEY,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id    INT NOT NULL REFERENCES books(id),
    chapter    SMALLINT NOT NULL,
    verse_num  SMALLINT NOT NULL,
    color      VARCHAR(20) NOT NULL DEFAULT 'yellow',
    note       TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, book_id, chapter, verse_num)
);

CREATE INDEX idx_highlights_user ON highlights (user_id);

CREATE TABLE reading_progress (
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id      INT NOT NULL REFERENCES books(id),
    chapter      SMALLINT NOT NULL,
    last_read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, book_id)
);

-- ---------- NOTIFICATIONS ----------

CREATE TABLE push_subscriptions (
    id         BIGSERIAL PRIMARY KEY,
    user_id    UUID REFERENCES users(id) ON DELETE CASCADE, -- nullable: allow anonymous push before login
    endpoint   TEXT NOT NULL UNIQUE,
    p256dh     TEXT NOT NULL,   -- Web Push encryption key
    auth       TEXT NOT NULL,   -- Web Push auth secret
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_push_subscriptions_user ON push_subscriptions (user_id);

-- ---------- OPTIONAL: READING PLANS (phase 2) ----------

CREATE TABLE reading_plans (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE reading_plan_days (
    id             SERIAL PRIMARY KEY,
    plan_id        INT NOT NULL REFERENCES reading_plans(id) ON DELETE CASCADE,
    day_number      SMALLINT NOT NULL,
    book_id        INT NOT NULL REFERENCES books(id),
    chapter_start  SMALLINT NOT NULL,
    chapter_end    SMALLINT NOT NULL,
    UNIQUE (plan_id, day_number)
);
