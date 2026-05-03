const { spawn } = require("node:child_process");
const readline = require("node:readline");

const npmCommand = process.env.npm_execpath ? process.execPath : process.platform === "win32" ? "npm.cmd" : "npm";

const commands = [
    ["connector", "cyan", ["run", "watch", "-w", "@atlasacademy/api-connector"]],
    ["descriptor", "magenta", ["run", "watch", "-w", "@atlasacademy/api-descriptor"]],
    ["db", "yellow", ["run", "start", "-w", "@atlasacademy/db"]],
];
const prefixWidth = Math.max(...commands.map(([name]) => name.length));

const colors = {
    cyan: "\x1b[36m",
    magenta: "\x1b[35m",
    yellow: "\x1b[33m",
    reset: "\x1b[0m",
};

const children = new Set();
let shuttingDown = false;

function prefixStream(stream, name, color, output) {
    const prefix = name.padEnd(prefixWidth);
    const reader = readline.createInterface({ input: stream });
    reader.on("line", (line) => {
        output.write(`${colors[color]}[${prefix}]${colors.reset} ${line}\n`);
    });
}

function stop(exitCode) {
    if (shuttingDown) {
        return;
    }

    shuttingDown = true;

    for (const child of children) {
        if (!child.killed) {
            child.kill("SIGINT");
        }
    }

    setTimeout(() => process.exit(exitCode), 500);
}

for (const [name, color, args] of commands) {
    const child = spawn(npmCommand, process.env.npm_execpath ? [process.env.npm_execpath, ...args] : args, {
        cwd: process.cwd(),
        stdio: ["inherit", "pipe", "pipe"],
    });

    children.add(child);
    prefixStream(child.stdout, name, color, process.stdout);
    prefixStream(child.stderr, name, color, process.stderr);

    child.on("error", (error) => {
        if (!shuttingDown) {
            console.error(`${colors[color]}[${name.padEnd(prefixWidth)}]${colors.reset} ${error.message}`);
            stop(1);
        }
    });

    child.on("exit", (code, signal) => {
        children.delete(child);

        if (shuttingDown) {
            return;
        }

        const reason = signal ? `signal ${signal}` : `code ${code}`;
        console.error(`${colors[color]}[${name.padEnd(prefixWidth)}]${colors.reset} exited with ${reason}`);
        stop(code ?? 1);
    });
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
