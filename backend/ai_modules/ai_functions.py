import os

import os


def read_file(*path_components, full_path: str = None) -> str:
    """
    Reads and returns the content of a file.

    Parameters:
        *path_components (str): Parts of the file path to be joined (if 'full_path' is not provided).
        full_path (str, optional): The complete file path. If provided, it takes precedence over 'path_components'.

    Returns:
        str: The content of the file as a string.

    Behavior:
        - If 'full_path' is provided, the function reads the file from this exact location.
        - If 'full_path' is not provided, the function constructs the file path using 'path_components'.
        - The file path is resolved relative to the script from which this function is called.
        - The file is opened in read mode with UTF-8 encoding.

    Example:
        read_file("folder", "subfolder", "file.txt")
        -> Reads content from "folder/subfolder/file.txt" relative to the caller's script.

        read_file(full_path="/absolute/path/to/file.txt")
        -> Reads content from "/absolute/path/to/file.txt".
    """
    if full_path is None:
        # Resolve relative to the script where the function is called
        caller_directory = os.path.dirname(os.path.abspath(__file__))
        full_path = os.path.join(caller_directory, *path_components)

    with open(full_path, mode="r", encoding="utf-8") as file:
        return file.read()


def build_instructions(instructions_dir) -> str:
    """
        Constructs a complete instruction set by reading and combining all instruction files in a directory.

        Parameters:
            instructions_dir (str): The directory containing instruction files.

        Returns:
            str: The combined instructions as a single string.

        Behavior:
            - Retrieves all instruction file names from the specified directory.
            - Sorts the files numerically based on the prefix before the underscore.
            - Reads and concatenates the content of each file with spacing in between.
    """
    instructions_file_names = os.listdir(instructions_dir)
    sorted_instructions_file_names = sorted(instructions_file_names,
                                            key=lambda file_name: int(file_name.split("_")[0]))
    instructions = ""
    for instruction_file_name in sorted_instructions_file_names:
        instructions += read_file(instructions_dir, instruction_file_name)
        instructions += "\n\n"
    return instructions


def read_file_smart(*path_components, full_path: str = None) -> str:
    """
    Reads and returns the content of a file relative to the script that calls this function.

    Parameters:
        *path_components (str): Parts of the file path to be joined.

    Returns:
        str: The content of the file as a string.
    """
    if full_path is not None:
        path_components = full_path.split("/")

    # Get the absolute path relative to this script's directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    full_path = os.path.join(base_dir, *path_components)

    with open(full_path, mode="r", encoding="utf-8") as file:
        return file.read()
