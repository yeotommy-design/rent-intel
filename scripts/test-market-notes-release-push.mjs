import assert from "node:assert/strict";
import { pushRelease } from "./release-market-notes.mjs";

const calls = [];
let pushAttempts = 0;

pushRelease("main", 3, (command, args) => {
  calls.push([command, ...args].join(" "));
  if (args[0] === "push") {
    pushAttempts += 1;
    if (pushAttempts === 1) throw new Error("non-fast-forward");
  }
});

assert.deepEqual(calls, [
  "git push origin main",
  "git fetch origin main",
  "git rebase origin/main",
  "git push origin main"
]);

console.log("Market Notes release push retry passed.");
