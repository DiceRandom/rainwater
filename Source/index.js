import { promises as fs } from "fs";
import path from "path";
import chokidar from "chokidar";
import * as filesort from "./filesorter.js";

/// --------- Load Config ---------
const raw = await fs.readFile("./config.json", "utf8");
const cfg = JSON.parse(raw);

const baseDir = cfg["relative-folder"] === "true"
  ? path.resolve("..")     // parent of Source
  : process.cwd();

const filesDir = path.resolve(baseDir, cfg["file-location"]);
const foldersDir = path.resolve(baseDir, cfg["folder-location"]);
const sourceDir = path.resolve("./"); // the "source" folder

/// --------- Helpers ---------
async function handleEntry(entryPath, stats) {
  const name = path.basename(entryPath);
  if (entryPath.startsWith(sourceDir)) return; // skip Source

  if (stats.isDirectory()) {
    await fs.mkdir(foldersDir, { recursive: true });

    let dest = path.join(foldersDir, name);
    let counter = 1;
    // if folder already exists, add a suffix
    while (true) {
      try {
        await fs.access(dest);
        // exists -> try new name
        dest = path.join(foldersDir, `${name}_${counter}`);
        counter++;
      } catch {
        break; // doesn't exist -> good to use
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

/// --------- Watcher ---------
async function startWatcher() {
  await fs.mkdir(filesDir, { recursive: true });
  await fs.mkdir(foldersDir, { recursive: true });

  const watcher = chokidar.watch(baseDir, {
    ignoreInitial: true,
    depth: 0,
  });

  watcher.on("add", (p, s) => handleEntry(p, s));
  watcher.on("addDir", (p, s) => handleEntry(p, s));

  console.log(`Watching ${baseDir} …`);
}

startWatcher().catch(console.error);