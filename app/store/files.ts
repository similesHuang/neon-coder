import { computeFileModifications } from "@/utils/diff";
import type { WebContainer } from "@webcontainer/api";
import { type MapStore, map } from "nanostores";
import * as nodePath from "node:path";

const utf8TextDecoder = new TextDecoder("utf8", { fatal: true });

export interface File {
  type: "file";
  content: string;
  isBinary: boolean;
}

export interface Folder {
  type: "folder";
}

type Dirent = File | Folder;

export type FileMap = Record<string, Dirent | undefined>;

export class FilesStore {
  #webcontainer: Promise<WebContainer>;
  #size = 0;
  #modifiedFiles: Map<string, string> = new Map();
  files: MapStore<FileMap> = map({});
  get filesCount() {
    return this.#size;
  }
  constructor(webcontainerPromise: Promise<WebContainer>) {
    this.#webcontainer = webcontainerPromise;
    this.#init();
  }
  getFile(filePath: string) {
    const dirent = this.files.get()[filePath];
    if (dirent?.type !== "file") {
      return undefined;
    }

    return dirent;
  }
  getFileModifications() {
    return computeFileModifications(this.files.get(), this.#modifiedFiles);
  }
  resetFileModifications() {
    this.#modifiedFiles.clear();
  }
  async saveFile(filePath: string, content: string) {
    const webcontainer = await this.#webcontainer;

    try {
      const relativePath = nodePath.relative(webcontainer.workdir, filePath);

      if (!relativePath) {
        throw new Error(`EINVAL: invalid file path, write '${relativePath}'`);
      }

      const oldContent = this.getFile(filePath)?.content;

      if (!oldContent) {
        throw new Error(`File ${filePath} does not exist`);
      }

      await webcontainer.fs.writeFile(relativePath, content);

      if (!this.#modifiedFiles.has(filePath)) {
        this.#modifiedFiles.set(filePath, oldContent);
      }

      // we immediately update the file and don't rely on the `change` event coming from the watcher
      this.files.setKey(filePath, { type: "file", content, isBinary: false });
      console.log("File updated");
    } catch (error) {
      console.error("Failed to update file content\n\n", error);

      throw error;
    }
  }

  // 这里需要修改
  async #init() {
    const webcontainer = await this.#webcontainer;
    const rootDir = webcontainer.workdir || "/";
  }
}
