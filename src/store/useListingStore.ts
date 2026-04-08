import { create } from 'zustand';

interface FilterState {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minSqft?: number;
  maxSqft?: number;
  activeBedRoom?: string;
  activeBathRoom?: string;
  status?: string;
  [key: string]: any;
}

interface ListingState {
  instances: Record<string, FilterState>;
  
  // Instance-specific actions
  getInstanceFilters: (id: string) => FilterState;
  setInstanceFilters: (id: string, filters: FilterState) => void;
  updateInstanceFilter: (id: string, key: string, value: any) => void;
  clearInstanceFilters: (id: string) => void;
  clearAllFilters: () => void;
  
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const DEFAULT_FILTERS: FilterState = { 
  location: "",
  minPrice: 0,
  maxPrice: 20000000,
  minSqft: 0,
  maxSqft: 15000,
  activeBedRoom: "any",
  activeBathRoom: "any",
  status: ""
};

export const useListingStore = create<ListingState>((set, get) => ({
  instances: {},

  getInstanceFilters: (id) => {
    return get().instances[id] || DEFAULT_FILTERS;
  },

  setInstanceFilters: (id, filters) => set((state) => ({
    instances: {
      ...state.instances,
      [id]: filters
    }
  })),

  updateInstanceFilter: (id, key, value) => set((state) => {
    const currentFilters = state.instances[id] || DEFAULT_FILTERS;
    return {
      instances: {
        ...state.instances,
        [id]: { ...currentFilters, [key]: value }
      }
    };
  }),

  clearInstanceFilters: (id) => set((state) => ({
    instances: {
      ...state.instances,
      [id]: DEFAULT_FILTERS
    }
  })),

  clearAllFilters: () => set({ instances: {} }),
  
  viewMode: 'grid',
  setViewMode: (viewMode) => set({ viewMode }),
}));
