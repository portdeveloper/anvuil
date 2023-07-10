import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'anvil-data'
  | 'kill-anvil'
  | 'start-anvil'
  | 'get-directory-path';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (data: any) => void) {
      const subscription = (_event: IpcRendererEvent, data: any) => func(data);
      ipcRenderer.on(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channels, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, ...args);
    },
    removeListener(channel: Channels, func: (data: any) => void) {
      const subscription = (_event: IpcRendererEvent, data: any) => func(data);
      ipcRenderer.removeListener(channel, subscription);
    },
  },
  buffer: {
    from(data: Uint8Array) {
      return Buffer.from(data).toString();
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
