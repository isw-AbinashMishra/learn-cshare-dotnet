import express from "express";
import { spawn } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

const PORT = process.env.PORT || 5100;
const TIMEOUT_MS = 10_000;
const MAX_CODE_LENGTH = 20_000;

const app = express();
app.use(express.json({ limit: "256kb" }));

// Local-only tool: bind to loopback and reject anything not from localhost.
app.use((req, res, next) => {
  const ip = req.socket.remoteAddress || "";
  if (!ip.includes("127.0.0.1") && !ip.includes("::1")) {
    return res.status(403).json({ error: "This server only accepts local requests." });
  }
  next();
});

app.post("/run", async (req, res) => {
  const { code } = req.body ?? {};

  if (typeof code !== "string" || !code.trim()) {
    return res.status(400).json({ error: "Missing `code` string in request body." });
  }
  if (code.length > MAX_CODE_LENGTH) {
    return res.status(400).json({ error: `Code exceeds ${MAX_CODE_LENGTH} character limit.` });
  }

  const dir = await mkdtemp(join(tmpdir(), "csx-run-"));
  const scriptPath = join(dir, `${randomUUID()}.csx`);

  try {
    await writeFile(scriptPath, code, "utf8");

    const result = await runScript(scriptPath);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: String(err?.message ?? err) });
  } finally {
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
});

function runScript(scriptPath) {
  return new Promise((resolve) => {
    const child = spawn("dotnet-script", [scriptPath], { shell: true });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, TIMEOUT_MS);

    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });

    child.on("close", (exitCode) => {
      clearTimeout(timer);
      resolve({
        stdout,
        stderr: timedOut ? `${stderr}\n[Execution timed out after ${TIMEOUT_MS / 1000}s]` : stderr,
        exitCode: timedOut ? null : exitCode,
      });
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ stdout, stderr: `Failed to start dotnet-script: ${err.message}`, exitCode: null });
    });
  });
}

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Playground run server listening on http://localhost:${PORT}`);
});
