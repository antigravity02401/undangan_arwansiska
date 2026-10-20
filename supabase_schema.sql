-- ============================================================
-- SCHEMA: Undangan Digital Anwar & Siska
-- Supabase Project: xabmzlvehwmpsqmejvhv
-- ============================================================

-- ============================================================
-- 1. TABEL RSVP — Konfirmasi Kehadiran
-- ============================================================
CREATE TABLE IF NOT EXISTS rsvp (
  id          BIGSERIAL PRIMARY KEY,
  nama        VARCHAR(100)  NOT NULL,
  kehadiran   VARCHAR(10)   NOT NULL CHECK (kehadiran IN ('hadir', 'tidak')),
  jumlah      SMALLINT      NOT NULL DEFAULT 1 CHECK (jumlah BETWEEN 1 AND 10),
  nama_tamu   VARCHAR(100),           -- nama tamu dari URL param ?to=
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rsvp_kehadiran  ON rsvp (kehadiran);
CREATE INDEX IF NOT EXISTS idx_rsvp_created_at ON rsvp (created_at DESC);

-- ============================================================
-- 2. TABEL GIFT CONFIRM — Konfirmasi Transfer Gift
-- ============================================================
CREATE TABLE IF NOT EXISTS gift_confirm (
  id          BIGSERIAL PRIMARY KEY,
  nama        VARCHAR(100)  NOT NULL,
  nama_bank   VARCHAR(50)   NOT NULL,
  nominal     VARCHAR(50)   NOT NULL,
  ucapan      TEXT,
  bukti_url   TEXT,                   -- URL foto bukti TF (Supabase Storage)
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gift_created_at ON gift_confirm (created_at DESC);

-- ============================================================
-- 3. TABEL GUESTBOOK — Ucapan & Doa
-- ============================================================
CREATE TABLE IF NOT EXISTS guestbook (
  id          BIGSERIAL PRIMARY KEY,
  nama        VARCHAR(80)   NOT NULL,
  pesan       TEXT          NOT NULL,
  approved    BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guestbook_approved   ON guestbook (approved);
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook (created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- RSVP
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rsvp_insert_public" ON rsvp FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "rsvp_select_public" ON rsvp FOR SELECT TO anon USING (true);

-- Gift Confirm
ALTER TABLE gift_confirm ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gift_insert_public" ON gift_confirm FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "gift_select_public" ON gift_confirm FOR SELECT TO anon USING (true);

-- Guestbook
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gb_insert_public"   ON guestbook FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "gb_select_approved" ON guestbook FOR SELECT TO anon USING (approved = true);

-- ============================================================
-- STORAGE BUCKET (jalankan via Supabase Dashboard > Storage)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('gift-bukti', 'gift-bukti', true);
