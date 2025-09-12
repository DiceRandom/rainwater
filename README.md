# rainwater
Automatically sorts files and folders in a parent directory into separate folders and organizes files by extension.

## Roadmap
*Already planed features.*
-   Ignores browser download artifacts (.part, .crdownload, etc.)
-   Wait for files to finish downloading/copying before acting
-   Match files by extension, glob patterns, regex, size, or content
-   Use dynamic placeholders in file paths and names
-   File that can be autoran at start.


## Configuration

    {
    
    "relative-folder": "true",
    
    "file-location": "../Files",
    
    "folder-location": "../Folders"
    
    }

"relative-folder": "true" → paths are relative to the script’s parent folder.
"false" → paths are treated as absolute or relative to the current working directory.
"file-location": location of the main file folder.
"folder-location": location of the main folders directory.

## Usage

1. Open terminal in the Source folder.
2. Run the watcher:
		

    node index.js

3. Drop files or folders into the parent directory (one level above Source).
   

*Files will be moved into Files/ and sorted by extension.*

*Folders will be moved into Folders/.*

## Notes:


- Existing folders with the same name in Folders/ will be renamed

automatically (e.g., Folder_1).

- Files without extensions are placed

in Files/NO_EXTENSION/.

- The watcher ignores the Source/ folder.
