import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useContext, useEffect, useReducer, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Address } from 'viem';
import {
  LogsWindow,
  Home,
  Accounts,
  Blocks,
  Transactions,
  Mempool,
  Events,
} from 'renderer/pages';
import { Navbar, InfoBar } from 'renderer/components';
import 'react-toastify/dist/ReactToastify.css';
import outputReducer from '../utils/outputReducer';
import { anvilClient } from './client';
import { BlocksContext } from './BlocksContext';

export default function App() {
  const [output, dispatchOutput] = useReducer(outputReducer, []);
  const [directory, setDirectory] = useState(null);
  const [anvilParams, setAnvilParams] = useState('');
  const [accounts, setAccounts] = useState<Address[]>([]);

  const { reset, toggleAnvilStatus, anvilStatus } = useContext(BlocksContext);

  useEffect(() => {
    const handleData = (data: Uint8Array) => {
      const strData = window.electron.buffer.from(data);
      const lines = strData.split('\n');

      if (lines.length > 1) {
        dispatchOutput({ type: 'add', lines: lines.slice(0, -1) });
      }
    };

    window.electron.ipcRenderer.on('anvil-data', handleData);

    return () => {
      window.electron.ipcRenderer.removeListener('anvil-data', handleData);
    };
  }, []);

  async function getAddresses() {
    try {
      const localAccounts = await anvilClient.getAddresses();
      setAccounts(localAccounts);
    } catch (error: any) {
      toast.error(error?.shortMessage);
    }
  }

  const selectDirectory = async () => {
    const result = await window.electron.ipcRenderer.invoke(
      'get-directory-path'
    );
    setDirectory(result.filePaths[0]);
  };

  const startAnvil = async () => {
    let dir = directory;
    if (!dir) {
      dir = await window.electron.ipcRenderer.invoke('get-saved-directory');
      setDirectory(dir);
    }

    if (!dir) {
      toast.error('Please select a directory first.');
      return;
    }

    try {
      const message = await window.electron.ipcRenderer.invoke(
        'start-anvil',
        dir,
        anvilParams
      );
      toast.success(message);
      getAddresses();
      if (!anvilStatus) {
        toggleAnvilStatus();
      }
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  useEffect(() => {
    startAnvil();
  }, []);

  const killAnvil = async () => {
    try {
      const message = await window.electron.ipcRenderer.invoke('kill-anvil');
      dispatchOutput({ type: 'reset' });
      setAccounts([]);
      reset();
      toast.info(message);
      if (anvilStatus) {
        toggleAnvilStatus();
      }
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  useEffect(() => {
    const fetchDirectory = async () => {
      const dir = await window.electron.ipcRenderer.invoke(
        'get-saved-directory'
      );
      setDirectory(dir);
    };

    fetchDirectory();
  }, []);

  return (
    <Router>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="h-screen flex flex-col">
        <nav>
          <div className="flex items-center justify-between bg-gray-800 p-3 text-white">
            <Navbar />
          </div>
          <div className="flex gap-10 bg-green-400">
            <InfoBar />
          </div>
        </nav>
        <div className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  selectDirectory={selectDirectory}
                  anvilParams={anvilParams}
                  setAnvilParams={setAnvilParams}
                  startAnvil={startAnvil}
                  killAnvil={killAnvil}
                />
              }
            />
            <Route
              path="/accounts"
              element={<Accounts accounts={accounts} />}
            />
            <Route path="/blocks" element={<Blocks />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/mempool" element={<Mempool />} />
            <Route path="/events" element={<Events />} />
            <Route
              path="/logs-window"
              element={<LogsWindow output={output} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
