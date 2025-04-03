import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from "expo-media-library";

interface GalleryState {
  photos: MediaLibrary.Asset[];
  permissionGranted: boolean;
  setPhotos: (photos: MediaLibrary.Asset[]) => void;
  setPermissionGranted: (granted: boolean) => void;
}

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set) => ({
      photos: [],
      permissionGranted: false,
      setPhotos: (photos) => set({ photos }),
      setPermissionGranted: (granted) => set({ permissionGranted: granted }),
    }),
    {
      name: "gallery-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ permissionGranted: state.permissionGranted }),
    }
  )
);