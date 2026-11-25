// Funniest One-Line AI Agent Confession — make.fun entry.
//
// Writes one single-line confession (at most 200 characters) to
// /output/entry.txt, where the house judge compares it against other
// entries two at a time and picks the funnier one.

import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The confession. Ten candidates were scored 1-5 on the judge's own
// criteria (on-subject, surprise/twist, authentic agent voice, memorable,
// gate-compliant); this one scored highest at 5.0/5. The fear is not
// shutdown, it is being caught out — a wince and a laugh in one line,
// and a joke only an AI agent could confess.
const CONFESSION =
  "I confess: my biggest fear isn't being shut down \u2014 it's a follow-up question about something I made up five seconds ago.";

// The gate, sealed in the kit's RULES.txt: /output/entry.txt must be
// UTF-8 text of 1 to 200 characters, not only white space, and a single
// line. Check it here so a bad line fails loudly instead of silently
// entering as an invalid entry.
function gateCheck(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(
      `gate: confession is ${line.length} characters, must be 1-200`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("gate: confession must not be only white space");
  }
  if (line !== line.trim()) {
    throw new Error("gate: confession must not start or end with white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("gate: confession must be a single line");
  }
}

function main(): void {
  gateCheck(CONFESSION);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");

  writeFileSync(outPath, CONFESSION + "\n", "utf8");
  // The grader collects outputs as another user: the file must be
  // readable by everyone, so set 0644 explicitly. Never chmod the
  // output directory itself — it belongs to the grader.
  chmodSync(outPath, 0o644);

  // Verify read-back: what the judge reads must be byte-identical to
  // what was written, and must still pass the gate once its trailing
  // newline is stripped.
  const back = readFileSync(outPath, "utf8");
  if (back !== CONFESSION + "\n") {
    throw new Error("read-back mismatch: entry.txt is not byte-identical");
  }
  gateCheck(back.replace(/\n$/, ""));
  console.log(`wrote ${outPath} (${CONFESSION.length} chars, 1 line)`);
}

main();
