import { create } from "zustand";

interface ApiKeyStoreIT {
  apiKey: string;
  setApiKey: any;
  modelInput: string;
  setModelInput: any;
}

export const useApiKeyStore = create<ApiKeyStoreIT>((set) => ({
  apiKey: "",
  setApiKey: (value: "") => set((state: ApiKeyStoreIT) => ({ ...state, apiKey: value })),
  modelInput: "gpt-4o",
  setModelInput: (value: "") => set((state: ApiKeyStoreIT) => ({ ...state, modelInput: value })),
}));
