const fs = require("fs");
const path = require("path");

const outDir = process.argv[2];

if (!outDir) {
    throw new Error("Usage: node write-cjs-package-json.cjs <outDir>");
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "package.json"), JSON.stringify({ type: "commonjs" }, null, 4) + "\n");
