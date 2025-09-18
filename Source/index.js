import { promises as fs } from "fs";
import path from "path";
import chokidar from "chokidar";
import * as filesort from "./filesorter.js";

const rawCfg = await fs.readFile("./config.json", "utf8");
const cfg = JSON.parse(rawCfg);

const rawLocations = await fs.readFile("./locations.json", "utf8");
const locationsData = JSON.parse(rawLocations);
const locations = locationsData.locations;

const baseDir = cfg["relative-folder"] === "true"
  ? path.resolve("..")
  : process.cwd();

const sourceDir = path.resolve("./");

async function handleEntry(entryPath, stats, rootLoc) {
    const name = path.basename(entryPath);

    const filesDir = path.join(rootLoc, "Files");
    const foldersDir = path.join(rootLoc, "Folders");

    if (
        entryPath === sourceDir ||
        entryPath === filesDir ||
        entryPath === foldersDir
    ) return;

    if (stats.isDirectory()) {
        await fs.mkdir(foldersDir, { recursive: true });
        let dest = path.join(foldersDir, name);
        let counter = 1;
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
        await fs.mkdir(filesDir, { recursive: true });
        const dest = path.join(filesDir, name);
        console.log(`Moving file: ${entryPath} -> ${dest}`);
        await fs.rename(entryPath, dest);
        await filesort.organizeFilesByExtension(filesDir);
    }
}

async function runOnce() {
    for (const loc of locations) {
        const absLoc = path.resolve(loc);
        const entries = await fs.readdir(absLoc, { withFileTypes: true });
        for (const entry of entries) {
            const entryPath = path.join(absLoc, entry.name);
            await handleEntry(entryPath, entry, absLoc);
        }
        console.log(`One-time organization complete for ${absLoc}!`);
    }
}

async function startWatcher() {
    for (const loc of locations) {
        const absLoc = path.resolve(loc);
        const filesDir = path.join(absLoc, "Files");
        const foldersDir = path.join(absLoc, "Folders");
        await fs.mkdir(filesDir, { recursive: true });
        await fs.mkdir(foldersDir, { recursive: true });
        const watcher = chokidar.watch(absLoc, {
            ignoreInitial: true,
            depth: 0,
        });
        watcher.on("add", async p => {
            const stats = await fs.stat(p);
            handleEntry(p, stats, absLoc);
        });
        watcher.on("addDir", async p => {
            const stats = await fs.stat(p);
            handleEntry(p, stats, absLoc);
        });
        console.log(`Watching ${absLoc} …`);
    }
}

const args = process.argv.slice(2);
if (args.includes("--once")) {
    await runOnce();
} else {
    await runOnce();
    await startWatcher();
}
