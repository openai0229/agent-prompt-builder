#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");
const skillName = "agent-prompt-builder";
const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);
const force = args.has("--force");
const dryRun = args.has("--dry-run");
const help = args.has("--help") || args.has("-h");

function readOption(name) {
  const index = rawArgs.indexOf(name);
  if (index === -1) return null;
  const value = rawArgs[index + 1];
  if (!value || value.startsWith("--")) {
    console.error(`Missing value for ${name}`);
    process.exit(1);
  }
  return value;
}

if (help) {
  console.log(`Usage:
  agent-prompt-builder-skill [--force] [--dry-run] [--dest <skills-dir>]

Installs the Codex skill into:
  \${CODEX_SKILLS_DIR:-~/.agents/skills}/agent-prompt-builder

If CODEX_HOME is set and CODEX_SKILLS_DIR is not set, it installs into:
  \${CODEX_HOME}/skills/agent-prompt-builder

Options:
  --force    Replace an existing installed copy.
  --dry-run  Print the target path without writing files.
  --dest     Install into a specific skills directory.
`);
  process.exit(0);
}

const explicitDest = readOption("--dest");
const skillsDir =
  explicitDest ||
  process.env.CODEX_SKILLS_DIR ||
  (process.env.CODEX_HOME
    ? path.join(process.env.CODEX_HOME, "skills")
    : path.join(os.homedir(), ".agents", "skills"));
const destDir = path.join(skillsDir, skillName);
const requiredPaths = ["SKILL.md", "agents", "references"];

for (const relativePath of requiredPaths) {
  const sourcePath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(sourcePath)) {
    console.error(`Missing required skill path: ${sourcePath}`);
    process.exit(1);
  }
}

if (dryRun) {
  console.log(`Would install ${skillName} to ${destDir}`);
  process.exit(0);
}

fs.mkdirSync(skillsDir, { recursive: true });

if (fs.existsSync(destDir)) {
  if (!force) {
    console.error(`Destination already exists: ${destDir}`);
    console.error("Re-run with --force to replace it.");
    process.exit(1);
  }
  fs.rmSync(destDir, { recursive: true, force: true });
}

fs.mkdirSync(destDir, { recursive: true });

for (const relativePath of requiredPaths) {
  fs.cpSync(path.join(repoRoot, relativePath), path.join(destDir, relativePath), {
    recursive: true,
    force: true
  });
}

console.log(`Installed ${skillName} to ${destDir}`);
console.log("Restart Codex or start a new turn, then invoke with $agent-prompt-builder.");
