// Wrapper that ensures DATABASE_URL is in the OS environment before
// launching `next build`, so Turbopack workers can inherit it.
import { config } from "dotenv";
import { spawn } from "child_process";
import { existsSync } from "fs";

if (existsSync(".env.local")) config({ path: ".env.local", override: true });
config(); // .env fallback

const child = spawn("npx", ["next", "build"], {
  stdio: "inherit",
  env: process.env,
  shell: false,
});

child.on("exit", (code) => process.exit(code ?? 0));
