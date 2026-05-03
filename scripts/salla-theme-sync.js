/**
 * Syncs all Twig templates + twilight.json to the Salla theme draft via CLI.
 * Used on first webpack --watch run so preview shows your layouts (not stale Raed).
 */
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { globSync } = require("glob");

const color = {
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  normal: "\x1b[0m",
};

function loadSallaCliParams() {
  const p = path.join(process.cwd(), "node_modules", ".salla-cli");
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function buildFileList() {
  const cwd = process.cwd();
  return globSync("src/views/**/*.twig", { cwd, absolute: true });
}

function syncAllTwigs() {
  const params = loadSallaCliParams();
  if (!params || !params.theme_id) {
    console.log(
      color.yellow,
      "⚠ Twig sync skipped: no node_modules/.salla-cli — start `salla theme preview` from this folder first.",
      color.normal
    );
    return { ok: false, reason: "no-cli" };
  }

  const {
    theme_id,
    store_id,
    draft_id,
    upload_url,
    sallaCli = "salla",
  } = params;

  const bin = String(sallaCli || "salla").trim() || "salla";
  const files = buildFileList();
  if (!files.length) {
    console.log(color.yellow, "⚠ No files found under src/views/**/*.twig", color.normal);
    return { ok: false, reason: "no-files" };
  }

  console.log(
    color.cyan,
    `↗ Uploading ${files.length} file(s) to your theme draft (Salla theme sync)…`,
    color.normal
  );

  const cwd = process.cwd();
  let failures = 0;

  for (const absFile of files) {
    const rel = path.relative(cwd, absFile).replace(/\\/g, "/");
    const args = [
      "theme",
      "sync",
      "-f",
      rel,
      "--theme_id",
      String(theme_id),
      "--store_id",
      String(store_id),
      "--draft_id",
      String(draft_id),
      "--upload_url",
      String(upload_url),
    ];
    const r = spawnSync(bin, args, {
      encoding: "utf8",
      shell: process.platform === "win32",
      cwd,
    });
    const combined = `${r.stdout || ""}${r.stderr || ""}`;
    if (combined && process.env.SALLA_SYNC_VERBOSE === "1") {
      process.stdout.write(combined);
    }

    const code = r.status;
    const looksFailed = Boolean(r.error) || code === null || code !== 0;

    if (looksFailed) {
      if (combined) {
        process.stdout.write(combined);
      }
      failures++;
      const detail = r.error ? r.error.message : r.status;
      console.log(
        color.yellow,
        `⚠ Sync reported failure for ${rel}` + (detail != null ? ` (exit ${detail})` : ""),
        color.normal
      );
    }
  }

  if (failures === 0) {
    console.log(color.green, "✓ Theme files synced. Reload the preview tab.", color.normal);
  } else {
    console.log(
      color.yellow,
      `⚠ ${failures}/${files.length} sync(s) failed. Try: salla login again, then preview — or push to GitHub so Partners pulls the theme.`,
      color.normal
    );
  }

  return { ok: failures === 0, failures };
}

class InitialTwigSyncPlugin {
  constructor() {
    this.ran = false;
  }

  apply(compiler) {
    if (!compiler.options.watch) return;

    compiler.hooks.watchRun.tapAsync("InitialTwigSyncPlugin", (_c, callback) => {
      if (this.ran) return callback();
      this.ran = true;
      try {
        syncAllTwigs();
      } catch (e) {
        console.log(color.yellow, "⚠ Initial Twig sync error:", e.message, color.normal);
      }
      callback();
    });
  }
}

module.exports = { InitialTwigSyncPlugin, syncAllTwigs };

if (require.main === module) {
  syncAllTwigs();
}
