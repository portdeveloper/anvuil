import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { useEffect, useState } from 'react';
import LogsWindow from './pages/LogsWindow';
import Home from './pages/Home';

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
      <div className="flex flex-col h-screen">
        <nav className="bg-gray-800 p-4 text-white">
          <ul className="flex gap-5">
            <li>
              <Link
                className="text-white hover:text-red-400 transition duration-200"
                to="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="text-white hover:text-red-400 transition duration-200"
                to="/logs-window"
              >
                Logs
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex-grow overflow-auto bg-gray-200">
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
