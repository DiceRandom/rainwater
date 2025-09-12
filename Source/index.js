import {
    promises as fs
} from "fs";
import path from "path";
import chokidar from "chokidar";
import * as filesort from "./filesorter.js";

// --------- Load Config ---------
const raw = await fs.readFile("./config.json", "utf8");
const cfg = JSON.parse(raw);

const baseDir = cfg["relative-folder"] === "true" ?
    path.resolve("..") :
    process.cwd();

const filesDir = path.resolve(baseDir, cfg["file-location"]);
const foldersDir = path.resolve(baseDir, cfg["folder-location"]);
const sourceDir = path.resolve("./"); // the source folder

// --------- Helpers ---------
async function handleEntry(entryPath, stats) {
    const name = path.basename(entryPath);

    // if (entryPath.startsWith(sourceDir)) return; // skip 
    // force skip folder
    if (
        entryPath === sourceDir ||
        entryPath === filesDir ||
        entryPath === foldersDir
    ) {
        return;
    }

    if (stats.isDirectory()) {
        // Move folder into Folders/
        await fs.mkdir(foldersDir, {
            recursive: true
        });

        let dest = path.join(foldersDir, name);
        let counter = 1;

        // Avoid overwriting existing folders
        while (true) {
            try {
                await fs.access(dest);
                dest = path.join(foldersDir, `${name}_${counter}`);
                counter++;
            } catch {
                break;
            }
        }

        console.log(`Moving folder: ${entryPath} -> ${dest}`);
        await fs.rename(entryPath, dest);
    } else if (stats.isFile()) {
        // Move file into Files/ and sort
        await fs.mkdir(filesDir, {
            recursive: true
        });
        const dest = path.join(filesDir, name);
        console.log(`Moving file: ${entryPath} -> ${dest}`);
        await fs.rename(entryPath, dest);
        await filesort.organizeFilesByExtension(filesDir);
    }
}


// --------- Run Once ---------
async function runOnce() {
    const entries = await fs.readdir(baseDir, {
        withFileTypes: true
    });
    for (const entry of entries) {
        const entryPath = path.join(baseDir, entry.name);
        await handleEntry(entryPath, entry);
    }
    console.log("One-time organization complete!");
}

// --------- Watcher ---------
async function startWatcher() {
    await fs.mkdir(filesDir, {
        recursive: true
    });
    await fs.mkdir(foldersDir, {
        recursive: true
    });

    const watcher = chokidar.watch(baseDir, {
        ignoreInitial: true,
        depth: 0,
    });

    watcher.on("add", (p, s) => handleEntry(p, s));
    watcher.on("addDir", (p, s) => handleEntry(p, s));

    console.log(`Watching ${baseDir} …`);
}

// --------- Main ---------
const args = process.argv.slice(2);
if (args.includes("--once")) {
    await runOnce();
} else {
    await startWatcher();
}