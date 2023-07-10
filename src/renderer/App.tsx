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
          <Route path="/" element={<Home />} />
          <Route path="/logs-window" element={<LogsWindow output={output} />} />
        </Routes>
      </div>
    </Router>
  );
}
