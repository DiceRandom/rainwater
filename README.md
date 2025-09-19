# rainwater
Automatically sorts files and folders in a parent directory into separate folders and organizes files by extension.

## Roadmap
### *Already planed features.*
-   Ignores browser download artifacts (.part, .crdownload, etc.)
-   Wait for files to finish downloading/copying before acting
-   Match files by extension, glob patterns, regex, size, or content
-   Use dynamic placeholders in file paths and names
-   File that can be autoran at start.


## Configuration
```json
{
    
    "relative-folder": "true",
    
    "file-location": "../Files",
    
    "folder-location": "../Folders"
    
}
```
-   "relative-folder": "true" → paths are relative to the script’s parent folder.
-   "false" → paths are treated as absolute or relative to the current working directory.
-   "file-location": location of the main file folder.
-   "folder-location": location of the main folders directory.

## Usage

### Locations

1. Open terminal in the source folder.

2. Run the script:
   
	```shell
	node locations.js
 	```

3. This will let you populate the locations for the watcher to look out for.

4. Run the watcher:

	```shell
	node index.js
 	```


5. Drop files or folders into the directory.


<br/>

> *Files will be moved into Files/ and sorted by extension.*

> *Folders will be moved into Folders/.*


## Notes:


- Existing folders with the same name in Folders/ will be renamed automatically (e.g., Folder_1).

- Files without extensions are placed in Files/NO_EXTENSION/.

- The folder holding the code is always ignored.
