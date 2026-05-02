import glob from "glob";
import Mocha from "mocha";
import path from "path";
import { pathToFileURL } from "url";

const mocha = new Mocha(),
    files = glob.sync("tests/**/*.ts").sort();

for (const file of files) {
    const resolved = path.resolve(file);

    mocha.suite.emit("pre-require", global, resolved, mocha);
    mocha.suite.emit("require", await import(pathToFileURL(resolved).href), resolved, mocha);
    mocha.suite.emit("post-require", global, resolved, mocha);
}

process.exitCode = await new Promise<number>((resolve) => {
    mocha.run(resolve);
});
