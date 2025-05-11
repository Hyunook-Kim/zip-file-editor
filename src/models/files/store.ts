import { create } from "zustand";
import type { ZipData, ZipItem } from "./file";

interface FileStore {
  zipData: ZipData | null;
  isLoading: boolean;
  currentFile: ZipItem | null;
  expandedFolders: Set<string>;
  setZipData: (data: ZipData | null) => void;
  setIsLoading: (loading: boolean) => void;
  setCurrentFile: (file: ZipItem | null) => void;
  toggleFolder: (folderPath: string) => void;
  isExpanded: (folderPath: string) => boolean;
}

export const useFileStore = create<FileStore>((set, get) => ({
  zipData: null,
  isLoading: false,
  currentFile: null,
  expandedFolders: new Set<string>(),

  setZipData: (data) => set({ zipData: data }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setCurrentFile: (file) => set({ currentFile: file }),

  toggleFolder: (folderPath) =>
    set((state) => {
      const newExpandedFolders = new Set(state.expandedFolders);
      if (newExpandedFolders.has(folderPath)) {
        newExpandedFolders.delete(folderPath);
      } else {
        newExpandedFolders.add(folderPath);
      }
      return { expandedFolders: newExpandedFolders };
    }),

  isExpanded: (folderPath) => get().expandedFolders.has(folderPath),
}));
