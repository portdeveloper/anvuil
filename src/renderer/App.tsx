import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { useState } from 'react';

function Hello() {
  const [directory, setDirectory] = useState(null);

  const selectDirectory = async () => {
    const result = await window.ipcRenderer.invoke('get-directory-path');
    setDirectory(result.filePaths[0]);
  };

  const startAnvil = async () => {
    if (!directory) {
      alert('Please select a directory first');
      return;
    }
    await window.ipcRenderer.invoke('start-anvil', directory);
  };

  const killAnvil = async () => {
    await window.ipcRenderer.invoke('kill-anvil');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-blue-500">
      <p className="text-5xl font-bold mb-4">Hello Electron!</p>
      <div className="flex gap-10 text-red-500">
        <button type="button" onClick={selectDirectory}>
          Select Project Directory
        </button>
        <button type="button" onClick={startAnvil}>
          Start Anvil
        </button>

        <button type="button" onClick={killAnvil}>
          Kill Anvil
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
