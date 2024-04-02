import { readFile } from "node:fs/promises";

const readFileContent = async (filename) => {
  const file_path = new URL(
    `../../public/view/${filename}.ejs`,
    import.meta.url
  ).pathname;
  return await readFile(file_path, "utf-8");
};

export { readFileContent };
