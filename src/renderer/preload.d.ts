import { ElectronHandler } from 'main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    ipcRenderer: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      // add any other methods you need
    };
  }
}

export type Channels =
  | 'ipc-example'
  | 'get-directory-path'
  | 'start-anvil'
  | 'kill-anvil';

export {};
