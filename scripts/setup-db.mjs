// Runs at Vercel build time to create the schema in Neon Postgres.
// Skipped automatically when DATABASE_URL is not a postgres connection.
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL ?? "";

if (!url.startsWith("postgres")) {
  console.log("Non-postgres DATABASE_URL — skipping Neon setup.");
  process.exit(0);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS "QuizSession" (
    "id"             TEXT NOT NULL PRIMARY KEY,
    "playerName"     TEXT NOT NULL,
    "quizId"         TEXT NOT NULL,
    "score"          INTEGER NOT NULL DEFAULT 0,
    "totalQuestions" INTEGER NOT NULL,
    "percentage"     DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startedAt"      TIMESTAMPTZ NOT NULL,
    "completedAt"    TIMESTAMPTZ,
    "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

console.log("Database schema ready.");
