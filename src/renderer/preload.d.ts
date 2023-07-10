import { ElectronHandler } from 'main/preload';

declare global {
  interface Window {
    electron: ElectronHandler;
    ipcRenderer: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      on: (
        channel: string,
        listener: (event: any, ...args: any[]) => void
      ) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}

export type Channels =
  | 'ipc-example'
  | 'get-directory-path'
  | 'start-anvil'
  | 'kill-anvil';

export {};
