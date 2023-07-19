import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useReducer, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
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
import useAnvil from './hooks/useAnvil';

export default function App() {
  const [output, dispatchOutput] = useReducer(outputReducer, []);
  const [directory, setDirectory] = useState(null);
  const [anvilParams, setAnvilParams] = useState('');
  const [anvilRunning, setAnvilRunning] = useState(false);

  const { accounts, blockNumber, blocks, transactions, logs } = useAnvil();

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
      setAnvilRunning(true);
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  useEffect(() => {
    startAnvil();
    setAnvilRunning(true);
  }, []);

  const killAnvil = async () => {
    try {
      const message = await window.electron.ipcRenderer.invoke('kill-anvil');
      dispatchOutput({ type: 'reset' });
      setAnvilRunning(false);
      toast.info(message);
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
            <InfoBar blockNumber={blockNumber} anvilRunning={anvilRunning} />
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
            <Route path="/blocks" element={<Blocks blocks={blocks} />} />
            <Route
              path="/transactions"
              element={<Transactions transactions={transactions} />}
            />
            <Route path="/mempool" element={<Mempool />} />
            <Route path="/events" element={<Events logs={logs} />} />
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
