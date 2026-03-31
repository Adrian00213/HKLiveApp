import { create } from 'zustand';
import { User, Incident, Deal, Discussion, Weather, AQHI, MTRStatus } from '../types';

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  updateLanguage: (language: User['language']) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;

  // Location
  currentLocation: { lat: number; lng: number } | null;
  setCurrentLocation: (location: { lat: number; lng: number } | null) => void;

  // Incidents
  incidents: Incident[];
  setIncidents: (incidents: Incident[]) => void;
  addIncident: (incident: Incident) => void;

  // Deals
  deals: Deal[];
  setDeals: (deals: Deal[]) => void;

  // Discussions
  discussions: Discussion[];
  setDiscussions: (discussions: Discussion[]) => void;
  addDiscussion: (discussion: Discussion) => void;

  // Weather
  weather: Weather | null;
  setWeather: (weather: Weather | null) => void;
  aqhi: AQHI[];
  setAqhi: (aqhi: AQHI[]) => void;

  // MTR Status
  mtrStatus: MTRStatus[];
  setMtrStatus: (status: MTRStatus[]) => void;

  // UI
  selectedLanguage: 'zh-TW' | 'zh-CN' | 'en';
  setSelectedLanguage: (lang: 'zh-TW' | 'zh-CN' | 'en') => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),
  updateLanguage: (language) =>
    set((state) => ({
      user: state.user ? { ...state.user, language } : null,
    })),
  addFavorite: (id) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, favorites: [...state.user.favorites, id] }
        : null,
    })),
  removeFavorite: (id) =>
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            favorites: state.user.favorites.filter((f) => f !== id),
          }
        : null,
    })),

  // Location
  currentLocation: { lat: 22.3193, lng: 114.1694 }, // Hong Kong default
  setCurrentLocation: (location) => set({ currentLocation: location }),

  // Incidents
  incidents: [],
  setIncidents: (incidents) => set({ incidents }),
  addIncident: (incident) =>
    set((state) => ({ incidents: [...state.incidents, incident] })),

  // Deals
  deals: [],
  setDeals: (deals) => set({ deals }),

  // Discussions
  discussions: [],
  setDiscussions: (discussions) => set({ discussions }),
  addDiscussion: (discussion) =>
    set((state) => ({ discussions: [...state.discussions, discussion] })),

  // Weather
  weather: null,
  setWeather: (weather) => set({ weather }),
  aqhi: [],
  setAqhi: (aqhi) => set({ aqhi }),

  // MTR Status
  mtrStatus: [],
  setMtrStatus: (mtrStatus) => set({ mtrStatus }),

  // UI
  selectedLanguage: 'zh-TW',
  setSelectedLanguage: (selectedLanguage) => set({ selectedLanguage }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
