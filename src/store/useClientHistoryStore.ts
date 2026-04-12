import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryEntry {
  id: string;
  clientName: string;
  contactPerson: string;
  email: string;
  date: string;
  docType: 'quotation' | 'invoice' | 'proposal';
  refNumber: string;
  amount: number;
  data?: unknown;
}

interface ClientHistoryState {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, 'id'>) => void;
  removeEntry: (id: string) => void;
  clearAll: () => void;
}

export const useClientHistoryStore = create<ClientHistoryState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) => set((s) => ({
        entries: [{ ...entry, id: crypto.randomUUID() }, ...s.entries],
      })),
      removeEntry: (id) => set((s) => ({
        entries: s.entries.filter((e) => e.id !== id),
      })),
      clearAll: () => set({ entries: [] }),
    }),
    { name: 'hnv:client-history' }
  )
);
