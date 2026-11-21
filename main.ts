import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Copies entry.txt (sitting next to this script) into the output directory
// the grader provides. The directory itself is never removed; only whatever
// it already holds is cleared first, so a stale file can never leak through.
// The written file is then read back and checked against the competition's
// entry rules (1 to 280 characters, not blank) before we report success,
// so a truncated copy or a wrong source file fails loudly here instead of
// silently handing the grader an invalid entry.
const here = dirname(fileURLToPath(import.meta.url));

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

mkdirSync(outDir, { recursive: true });
for (const name of readdirSync(outDir)) {
  rmSync(join(outDir, name), { recursive: true, force: true });
}
const outFile = join(outDir, "entry.txt");
copyFileSync(join(here, "entry.txt"), outFile);

const written = readFileSync(outFile, "utf8");
const length = [...written].length;
if (length < 1 || length > 280) {
  throw new Error(
    `entry.txt length check failed: ${length} characters, expected 1 to 280`,
  );
}
if (written.trim().length === 0) {
  throw new Error("entry.txt content check failed: entry is only whitespace");
}
