import { useEffect, useState } from 'react';

export default function Home() {
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
    <div className="flex flex-col items-center justify-center h-full p-10 bg-gray-900 text-white">
      <div className="flex flex-col items-center justify-center bg-gray-800 p-5 shadow-lg rounded">
        <button
          className=" bg-orange-500 text-white px-5 py-2 rounded mb-5"
          type="button"
          onClick={selectDirectory}
        >
          Select Project Directory
        </button>
        <div className="ml-5">
          <input
            className="border-2 border-orange-400 px-2 py-1 rounded mr-2 text-white"
            type="text"
            value={anvilParams}
            onChange={(e) => setAnvilParams(e.target.value)}
            placeholder="Enter Anvil parameters"
          />
          <button
            className="bg-orange-500 text-white px-5 py-2 rounded mb-5"
            type="button"
            onClick={startAnvil}
          >
            Ignite Anvil
          </button>
        </div>
        <button
          className="bg-red-500 text-white px-5 py-2 rounded"
          type="button"
          onClick={killAnvil}
        >
          Extinguish Anvil
        </button>
      </div>
    </div>
  );
}
