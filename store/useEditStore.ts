import { create } from 'zustand';

export type QueueItem = {
  path: string;
  sha: string | null; // null means delete
  contentBase64?: string;
  isDelete?: boolean;
  sizeDiff?: number; // Added to track size changes (in bytes)
};

interface EditState {
  isOpen: boolean;
  owner: string;
  repo: string;
  branch: string;
  queue: QueueItem[];
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
  openModal: (owner, repo, branch) => set({ isOpen: true, owner, repo, branch, queue: [] }),
  closeModal: () => set({ isOpen: false, owner: "", repo: "", branch: "main", queue: [] }),
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
