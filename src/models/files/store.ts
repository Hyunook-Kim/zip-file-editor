import { create } from "zustand";
import type { ZipData, ZipItem } from "./file";

export interface Tab {
  id: string;
  file: ZipItem;
  isEdited?: boolean;
}

interface FileStore {
  zipData: ZipData | null;
  isLoading: boolean;
  currentFile: ZipItem | null;
  expandedFolders: Set<string>;
  openTabs: Tab[];
  activeTabId: string | null;
  setZipData: (data: ZipData | null) => void;
  setIsLoading: (loading: boolean) => void;
  setCurrentFile: (file: ZipItem | null) => void;
  toggleFolder: (folderPath: string) => void;
  isExpanded: (folderPath: string) => boolean;
  setActiveTab: (tabId: string | null) => void;
  openNewTab: (file: ZipItem) => void;
  closeTab: (tabId: string) => void;
  markTabAsEdited: (tabId: string, isEdited: boolean) => void;
}

export const useFileStore = create<FileStore>((set, get) => ({
  zipData: null,
  isLoading: false,
  currentFile: null,
  expandedFolders: new Set<string>(),
  openTabs: [],
  activeTabId: null,

  setZipData: (data) => set({ zipData: data }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setCurrentFile: (file) => {
    set({ currentFile: file });
  },

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

  setActiveTab: (tabId) => {
    const activeTab = get().openTabs.find((tab) => tab.id === tabId);
    set({ activeTabId: tabId, currentFile: activeTab?.file || null });
  },
  openNewTab: (file) =>
    set((state) => {
      const existingTab = state.openTabs.find((tab) => tab.id === file.path);
      if (existingTab) {
        return { activeTabId: existingTab.id, currentFile: existingTab.file };
      }
      const newTab: Tab = { id: file.path, file, isEdited: false };
      return {
        openTabs: [...state.openTabs, newTab],
        activeTabId: newTab.id,
        currentFile: newTab.file,
      };
    }),
  closeTab: (tabId) =>
    set((state) => {
      const newTabs = state.openTabs.filter((tab) => tab.id !== tabId);
      let newActiveTabId = state.activeTabId;
      let newCurrentFile = state.currentFile;

      if (state.activeTabId === tabId) {
        if (newTabs.length > 0) {
          const lastTabIndex = newTabs.length - 1;
          newActiveTabId = newTabs[lastTabIndex].id;
          newCurrentFile = newTabs[lastTabIndex].file;
        } else {
          newActiveTabId = null;
          newCurrentFile = null;
        }
      }
      return {
        openTabs: newTabs,
        activeTabId: newActiveTabId,
        currentFile: newCurrentFile,
      };
    }),
  markTabAsEdited: (tabId, isEdited) =>
    set((state) => ({
      openTabs: state.openTabs.map((tab) =>
        tab.id === tabId ? { ...tab, isEdited } : tab
      ),
    })),
}));
