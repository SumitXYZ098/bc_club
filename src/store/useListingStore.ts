import { create } from 'zustand';

interface ListingState {
  filters: any;
  setFilters: (filters: any) => void;
  updateFilter: (key: string, value: any) => void;
  clearFilters: () => void;
  
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export const useListingStore = create<ListingState>((set) => ({
  filters: {},
  setFilters: (filters) => set({ filters }),
  updateFilter: (key, value) => set((state) => ({ 
    filters: { ...state.filters, [key]: value } 
  })),
  clearFilters: () => set({ filters: {} }),
  
  viewMode: 'grid',
  setViewMode: (viewMode) => set({ viewMode }),
}));
