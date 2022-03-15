import axios from "axios";
import fs from "fs";
import glob from "glob";
import tar from "tar";

const repo = "https://github.com/atlasacademy/battle-test-data",
    hash = "74af1890ba4d13231f2a4180dc7970f3c00a4708",
    path = "./test-data/data",
    tarPath = `${path}/${hash}.tar.gz`;

(async () => {
    if (fs.existsSync(tarPath)) {
        console.log("TEST DATA ALREADY EXISTS.");
        return;
    }

    console.log("DELETING OLD DATA");
    glob.sync(`${path}/*.tar.gz`).forEach((file) => {
        fs.unlinkSync(file);
    });

    console.log("DOWNLOADING DATA");
    await new Promise<void>((resolve) => {
        const file = fs.createWriteStream(tarPath);

        axios.get(`${repo}/tarball/${hash}`, { responseType: "stream" }).then((response) => {
            response.data.pipe(file);
            file.on("finish", () => {
                file.close();
                resolve();
            });
        });
    });

    console.log("EXTRACTING DATA");
    tar.x({
        cwd: path,
        file: tarPath,
        strip: 1,
        sync: true,
    });
})();
