import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { useEffect, useState } from 'react';
import LogsWindow from './components/LogsWindow';

function Hello() {
  const [directory, setDirectory] = useState(null);
  const [anvilParams, setAnvilParams] = useState('');

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-blue-500">
      <p className="text-5xl font-bold mb-4">Hello Electron!</p>
      <div className="flex gap-10 text-red-500">
        <button type="button" onClick={selectDirectory}>
          Select Project Directory
        </button>
        <div className="flex flex-col">
          <input
            type="text"
            value={anvilParams}
            onChange={(e) => setAnvilParams(e.target.value)}
            placeholder="Enter Anvil parameters"
          />
          <button type="button" onClick={startAnvil}>
            Start Anvil
          </button>
        </div>

        <button type="button" onClick={killAnvil}>
          Kill Anvil
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [output, setOutput] = useState('');

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

  return (
    <Router>
      <div>
        <nav>
          <ul className="flex gap-5">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/logs-window">Logs</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Hello />} />
          <Route path="/logs-window" element={<LogsWindow output={output} />} />
        </Routes>
      </div>
    </Router>
  );
}
