/// <reference types="vite/client" />

interface WindowStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, shared: boolean): Promise<void>;
}

declare global {
  interface Window {
    storage?: WindowStorage;
  }
}
