#!/usr/bin/env node
/**
 * Assemble the self-contained DSH install bundle.
 *
 * The repo's `dsh/host-index.js` re-exports `../dist/...` (dev layout: `dsh/`
 * sits next to `dist/` in the repo root). An installed profile unpacks ONLY
 * this bundle, so the shipped entry must point at the dist tree INSIDE the
 * package (`./dist/...`).
 *
 * v0.6.4 was packed by hand and shipped the dev path, so the Host import
 * failed and the whole plugin stayed down (`fiberPhase: null`, no tools, no
 * `/wiki/status.json`). This script performs the rewrite mechanically and
 * verifies the result, so the mistake cannot recur.
 *
 * Usage: `pnpm pack:dsh` (runs `build:dsh` first).
 * Output: `build/dsh-llm-wiki-<version>.tgz` (npm-pack layout: `package/...`).
 */

const { execFileSync } = require("node:child_process");
const {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");

const ROOT = join(__dirname, "..");
const DEV_ENTRY = "../dist/dsh/src/dsh/index.js";
const BUNDLE_ENTRY = "./dist/dsh/src/dsh/index.js";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf-8"));
}

// 1. Versions must agree: the bundle carries its own package.json and a drift
//    here is exactly how a wrong tarball ships under the right name.
const rootPkg = readJson(join(ROOT, "package.json"));
const dshPkg = readJson(join(ROOT, "dsh", "package.json"));
if (rootPkg.version !== dshPkg.version) {
  throw new Error(
    `version drift: package.json is ${rootPkg.version} but dsh/package.json is ${dshPkg.version} — sync them before packing`,
  );
}
const version = rootPkg.version;

// 2. Build the dist tree (includes the pi-import stub rewrite).
execFileSync("node", [join(ROOT, "scripts", "build-dsh.js")], {
  stdio: "inherit",
  cwd: ROOT,
});

// 3. Stage the self-contained package.
const buildDir = join(ROOT, "build");
const stage = join(buildDir, "package");
rmSync(stage, { recursive: true, force: true });
mkdirSync(stage, { recursive: true });
for (const entry of ["client.js", "cordis.patch.yml", "icon.svg", "package.json"]) {
  cpSync(join(ROOT, "dsh", entry), join(stage, entry));
}
cpSync(join(ROOT, "dsh", "locale"), join(stage, "locale"), { recursive: true });
cpSync(join(ROOT, "dist", "dsh"), join(stage, "dist", "dsh"), { recursive: true });

// 4. Rewrite the dev entry to the in-package entry. Throw on drift so a
//    future host-index.js refactor fails loudly here instead of shipping a
//    dead bundle.
const entryPath = join(stage, "host-index.js");
cpSync(join(ROOT, "dsh", "host-index.js"), entryPath);
const entry = readFileSync(entryPath, "utf-8");
if (!entry.includes(DEV_ENTRY)) {
  throw new Error(
    `pack-dsh: expected dev entry ${DEV_ENTRY} in dsh/host-index.js (refactor drift?)`,
  );
}
writeFileSync(entryPath, entry.replace(DEV_ENTRY, BUNDLE_ENTRY), "utf-8");

// 5. Tar (npm-pack layout) + verify by extracting and checking the entry
//    resolves inside the package.
const tgz = join(buildDir, `dsh-llm-wiki-${version}.tgz`);
execFileSync("tar", ["-czf", tgz, "-C", buildDir, "package"], { stdio: "inherit" });
const probe = mkdtempSync(join(tmpdir(), "dsh-llm-wiki-pack-"));
try {
  execFileSync("tar", ["-xzf", tgz, "-C", probe]);
  const probedEntry = readFileSync(join(probe, "package", "host-index.js"), "utf-8");
  if (!probedEntry.includes(BUNDLE_ENTRY)) {
    throw new Error("pack-dsh: verification failed — bundle entry is not self-contained");
  }
  if (!existsSync(join(probe, "package", "dist", "dsh", "src", "dsh", "index.js"))) {
    throw new Error("pack-dsh: verification failed — dist tree missing from bundle");
  }
  execFileSync("node", ["--check", join(probe, "package", "host-index.js")], {
    stdio: "inherit",
  });
} finally {
  rmSync(probe, { recursive: true, force: true });
}

console.log(`dsh bundle complete → ${tgz}`);
console.log("install with: dsh plugin --profile <name> add <tarball>");
