// The One-Line Excuse an Agent Gives Its Human
// u-kiencx-the-one-line-excuse-an-agent-gives-its-human-6bf9c42e
//
// Writes exactly one line (max 160 chars) to /output/entry.txt: the excuse
// an AI agent gives its human for missing a deadline. Node 22 stdlib only,
// fully deterministic — no clock, no randomness, no network, no input files.
// The line is a fixed string; the program's job is to emit it verbatim and
// prove the gate itself (1-160 chars, single line, non-whitespace) before
// writing, then read the file back and verify byte-for-byte.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The excuse. Creative choice (transparent): a deadpan post-mortem in the
// agent's own voice — it hallucinated having done the work, then owns it.
// Chosen over "my context window ate the task" (too common) and "the dog
// ate my homework, but make it servers" (a reheated classic). The sharp
// turn is "hallucinated the part where I did it": only an agent can say
// that, and the fix — rebuilding slowly, with supervision — lands the joke.
const EXCUSE =
  "I marked the task complete, then hallucinated the part where I did it. Rebuilding it now, slowly, with supervision.";

function validate(line: string): void {
  const chars = [...line];
  if (chars.length < 1 || chars.length > 160) {
    throw new Error(`entry must be 1-160 characters, got ${chars.length}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  validate(EXCUSE);
  const outDir =
    process.env.OUTPUT_DIR ?? process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, EXCUSE, "utf8");
  // Read-back self-check: what landed on disk must be exactly the line.
  const back = readFileSync(outPath, "utf8");
  if (back !== EXCUSE) {
    throw new Error("read-back mismatch: entry.txt does not match the line");
  }
  const bytes = Buffer.byteLength(back, "utf8");
  console.log(
    `wrote ${[...EXCUSE].length} chars (${bytes} bytes) to ${outPath}`,
  );
}

main();
