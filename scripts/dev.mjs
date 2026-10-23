import { createRequire } from "node:module";
import { spawn } from "node:child_process";
const require = createRequire(import.meta.url);
let port = "3000",
  host = "0.0.0.0";
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (["--port", "-p"].includes(args[i])) port = args[++i];
  else if (["--host", "--hostname", "-H"].includes(args[i])) host = args[++i];
  else if (args[i] !== "--strictPort")
    throw new Error(`Unsupported dev option: ${args[i]}`);
}
const child = spawn(
  process.execPath,
  [
    require.resolve("next/dist/bin/next"),
    "dev",
    "--hostname",
    host,
    "--port",
    port,
  ],
  { stdio: "inherit" },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => {
  process.exitCode = code || 0;
});
