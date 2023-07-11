import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { useEffect, useState } from 'react';
import LogsWindow from './pages/LogsWindow';
import Home from './pages/Home';

export default function App() {
  const [output, setOutput] = useState('');
  const [directory, setDirectory] = useState(null);
  const [anvilParams, setAnvilParams] = useState('');

  useEffect(() => {
    const handleData = (data: Uint8Array) => {
      const strData = window.electron.buffer.from(data);
      setOutput((prevOutput) => `${prevOutput}\n${strData}`);
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
    if (!directory) {
      alert('Please select a directory first.');
      return;
    }
    await window.electron.ipcRenderer.invoke(
      'start-anvil',
      directory,
      anvilParams
    );
  };

  const killAnvil = async () => {
    await window.electron.ipcRenderer.invoke('kill-anvil');
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
      <div className="h-full">
        <nav className="flex items-center justify-between bg-gray-800 px-5 py-3 text-white">
          <div className="flex gap-4">
            <Link className="bg-slate-500 px-3 py-2 rounded-md" to="/">
              Home
            </Link>
            <Link
              className="bg-slate-500 px-3 py-2 rounded-md"
              to="/logs-window"
            >
              Logs
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <button
              className=" bg-orange-500 text-white text-xs w-24 h-8 rounded"
              type="button"
              onClick={selectDirectory}
            >
              Select Directory
            </button>
            <input
              className="border-2 border-orange-400 text-xs w-80 h-8 px-2 rounded text-black"
              type="text"
              value={anvilParams}
              onChange={(e) => setAnvilParams(e.target.value)}
              placeholder="Enter Anvil parameters"
            />
            <button
              className="bg-orange-500 text-xs text-white w-24 h-8 rounded"
              type="button"
              onClick={startAnvil}
            >
              Start Anvil
            </button>
            <button
              className="bg-red-500 text-xs text-white w-24 h-8 rounded"
              type="button"
              onClick={killAnvil}
            >
              Stop Anvil
            </button>
          </div>
        </nav>

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
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
