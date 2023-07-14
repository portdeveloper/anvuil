import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { useEffect, useReducer, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {
  createTestClient,
  http,
  publicActions,
  walletActions,
  Address,
} from 'viem';
import {
  LogsWindow,
  Home,
  Accounts,
  Blocks,
  Transactions,
  Mempool,
  Events,
} from 'renderer/pages';
import { Navbar } from 'renderer/components';
import { foundry } from 'viem/chains';
import 'react-toastify/dist/ReactToastify.css';
import outputReducer from '../utils/outputReducer';

const anvilClient = createTestClient({
  chain: foundry,
  mode: 'anvil',
  transport: http(),
})
  .extend(publicActions)
  .extend(walletActions);

// @todo disable buttons when anvil is running/stopped ?

export default function App() {
  const [output, dispatchOutput] = useReducer(outputReducer, []);
  const [directory, setDirectory] = useState(null);
  const [anvilParams, setAnvilParams] = useState('');
  const [accounts, setAccounts] = useState<Address[]>([]);
  const [isRunning, setIsRunning] = useState(false);

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
    if (!directory) {
      toast.error('Please select a directory first.');
      return;
    }

    try {
      const message = await window.electron.ipcRenderer.invoke(
        'start-anvil',
        directory,
        anvilParams
      );
      setIsRunning(true);
      localStorage.setItem('anvilRunning', 'true');
      toast.success(message);
      getAddresses();
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  const killAnvil = async () => {
    try {
      const message = await window.electron.ipcRenderer.invoke('kill-anvil');
      setIsRunning(false);
      localStorage.setItem('anvilRunning', 'false');
      dispatchOutput({ type: 'reset' });
      setAccounts([]);
      toast.info(message);
    } catch (err: any) {
      toast.error(err.toString());
    }
  };

  useEffect(() => {
    const anvilRunning = localStorage.getItem('anvilRunning');
    setIsRunning(anvilRunning === 'true');

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
            <div className="flex items-center space-x-2">
              <button
                className=" bg-orange-500 text-white text-xs w-24 h-8 active:scale-95 transition-transform duration-100"
                type="button"
                onClick={selectDirectory}
              >
                Select Directory
              </button>
              <input
                disabled={isRunning}
                className="border-2 border-orange-400 text-xs w-60 h-8 px-2 text-black"
                type="text"
                value={anvilParams}
                onChange={(e) => setAnvilParams(e.target.value)}
                placeholder="Enter Anvil parameters"
              />

              <button
                disabled={isRunning}
                className={`bg-orange-500 text-white text-xs w-24 h-8 active:scale-95 transition-transform duration-100 ${
                  isRunning ? 'opacity-50' : ''
                }`}
                type="button"
                onClick={startAnvil}
              >
                Start Anvil
              </button>

              <button
                disabled={!isRunning}
                className={`bg-red-500 text-xs text-white w-24 h-8 active:scale-95 transition-transform duration-100 ${
                  !isRunning ? 'opacity-50' : ''
                }`}
                type="button"
                onClick={killAnvil}
              >
                Stop Anvil
              </button>
            </div>
          </div>
          <div className="flex gap-10 bg-green-400">
            <div>Current block:</div>
            <div>Mining status:</div>
            <div>other info about current state of local node</div>
            <div>searchbar?</div>
          </div>
        </nav>

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
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
