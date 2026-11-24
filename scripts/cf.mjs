// Runs Wrangler with the Cloudflare credentials (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID) from an .env file:
// $CF_ENV_FILE, this repo's .env, or the main Oddvale site repo's .env. Without one, Wrangler falls back to its own login (`npx wrangler login`). Values are never printed.
// Usage: node scripts/cf.mjs pages deploy dist --project-name oddvale-games
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const envFile = [process.env.CF_ENV_FILE, path.resolve(here, "../.env"), path.resolve(here, "../../../Oddvale/.env"), path.resolve(here, "../../oddvale-site/.env")].find((f) => f && fs.existsSync(f));

const env = { ...process.env };
for (const line of envFile ? fs.readFileSync(envFile, "utf8").split(/\r?\n/) : []) {
  const m = line.match(/^\s*(CLOUDFLARE_[A-Z_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const r = spawnSync("npx", ["wrangler", ...process.argv.slice(2)], { stdio: "inherit", env, shell: true });
process.exit(r.status ?? 1);
