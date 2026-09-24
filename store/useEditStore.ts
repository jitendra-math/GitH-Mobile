import { create } from 'zustand';

export type QueueItem = {
  path: string;
  sha: string | null; 
  contentBase64?: string;
  isDelete?: boolean;
  sizeDiff?: number; 
};

export type EditingFile = {
  path: string;
  sha: string | null;
  content: string;
  oldSize: number;
};

interface EditState {
  isOpen: boolean;
  owner: string;
  repo: string;
  branch: string;
  queue: QueueItem[];
  
  // New States for Live Editor
  isEditMode: boolean;
  editingFile: EditingFile | null;
  toggleEditMode: () => void;
  setEditingFile: (file: EditingFile | null) => void;

  openModal: (owner: string, repo: string, branch: string) => void;
  closeModal: () => void;
  addToQueue: (item: QueueItem) => void;
  removeFromQueue: (path: string) => void;
  clearQueue: () => void;
}

export const useEditStore = create<EditState>((set) => ({
  isOpen: false,
  owner: "",
  repo: "",
  branch: "main",
  queue: [],
  
  isEditMode: false,
  editingFile: null,
  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
  setEditingFile: (file) => set({ editingFile: file }),

  openModal: (owner, repo, branch) => set({ isOpen: true, owner, repo, branch, queue: [], isEditMode: false, editingFile: null }),
  closeModal: () => set({ isOpen: false, owner: "", repo: "", branch: "main", queue: [], isEditMode: false, editingFile: null }),
  
  addToQueue: (item) => set((state) => {
    const existingIndex = state.queue.findIndex(q => q.path === item.path);
    if (existingIndex !== -1) {
      const newQueue = [...state.queue];
      newQueue[existingIndex] = item;
      return { queue: newQueue };
    }
    return { queue: [...state.queue, item] };
  }),
  removeFromQueue: (path) => set((state) => ({ queue: state.queue.filter(q => q.path !== path) })),
  clearQueue: () => set({ queue: [] }),
}));
