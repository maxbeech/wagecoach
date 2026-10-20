-- Wage Watch schema. Applied to the Helm7 production database (db_krt6c38e741vwez01m4k)
-- through the Helm7 MCP `database_execute`; this file is the reference copy and is
-- what local development applies. Idempotent: safe to run again.

CREATE TABLE IF NOT EXISTS watchers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  token_hash text NOT NULL UNIQUE,          -- sha256 of the manage-link token; the raw token only lives in email
  locations text[] NOT NULL DEFAULT '{}',   -- "state:CA" / "city:seattle-wa" (lib/locations.ts)
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free','watch')),
  confirmed_at timestamptz,                 -- double opt-in; unconfirmed rows get no alerts
  unsubscribed_at timestamptz,
  stripe_customer text,
  stripe_subscription text UNIQUE,
  subscription_status text,                 -- Stripe's subscription.status, mirrored by the webhook
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS watchers_email_lower ON watchers (lower(email));
-- v2: a repeat signup for an active subscriber only mails them a new link; that link's
-- hash waits here and becomes token_hash when used, so a stranger who knows the email
-- can't change anything. last_mailed_at throttles signup mail to one a minute.
ALTER TABLE watchers ADD COLUMN IF NOT EXISTS pending_token_hash text UNIQUE;
ALTER TABLE watchers ADD COLUMN IF NOT EXISTS last_mailed_at timestamptz;

-- One row per alert actually sent, so the daily job never mails the same notice twice.
CREATE TABLE IF NOT EXISTS watch_alerts_sent (
  watcher_id uuid NOT NULL REFERENCES watchers(id) ON DELETE CASCADE,
  change_key text NOT NULL,
  lead_days int NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (watcher_id, change_key, lead_days)
);

-- Durable Stripe webhook ledger (replaces the per-process memory ledger when DATABASE_URL is set).
CREATE TABLE IF NOT EXISTS stripe_events (
  event_id text PRIMARY KEY,
  claimed_at timestamptz NOT NULL DEFAULT now()
);
