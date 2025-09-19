import {
    promises as fs
} from "fs";
import path from "path";

/**
 * Organize files in a folder by their extension.
 * Creates subfolders (e.g., "PNGs", "TXTs") or "NO_EXTENSION".
 */
export async function organizeFilesByExtension(folderPath) {
    if (!folderPath) {
        console.log("Error: File path null");
        return;
    }

    // Get only files (skip subdirectories)
    const entries = await fs.readdir(folderPath, {
        withFileTypes: true
    });
    const files = entries.filter((e) => e.isFile()).map((e) => e.name);

    const extensions = [];

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        let ext = path.extname(file).toLowerCase();
        let targetFolder;

        if (!ext) {
            ext = "[no extension]";
            targetFolder = path.join(folderPath, "NO_EXTENSION");
        } else {
            const extName = ext.slice(1).toUpperCase() + "s"; // e.g., ".png" → "PNGs"
            targetFolder = path.join(folderPath, extName);
        }

        extensions.push(ext || "[no extension]");

        await fs.mkdir(targetFolder, {
            recursive: true
        });
        await fs.rename(filePath, path.join(targetFolder, file));
    }

    // Count and print results
    const counts = extensions.reduce((acc, ext) => {
        acc[ext] = (acc[ext] || 0) + 1;
        return acc;
    }, {});

    console.log("Extension counts:");
    for (const [ext, count] of Object.entries(counts)) {
        console.log(`${ext}: ${count}`);
    }
}

// Example usage
// (Uncomment the next line and set the folder you want)
// organizeFilesByExtension("C:/path/to/your/folder");