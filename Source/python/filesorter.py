import os
import shutil
from collections import Counter

def organize_files_by_extension(folder_path):
    if folder_path == None:
        return
    files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    extensions = []

    for file in files:
        file_path = os.path.join(folder_path, file)
        name, ext = os.path.splitext(file)
        ext = ext.lower()

        if not ext:
            ext = '[no extension]'
            target_folder = os.path.join(folder_path, 'NO_EXTENSION')
        else:
            ext_name = ext.lstrip('.').upper() + 's'  # e.g., '.png' -> 'PNGs'
            target_folder = os.path.join(folder_path, ext_name)

        # Track extensions for counting
        extensions.append(ext if ext else '[no extension]')

        # Make sure the target folder exists
        os.makedirs(target_folder, exist_ok=True)

        # Move the file
        shutil.move(file_path, os.path.join(target_folder, file))

    # Count and print results
    extension_counts = Counter(extensions)
    print("Extension counts:")
    for ext, count in extension_counts.items():
        print(f"{ext}: {count}")


