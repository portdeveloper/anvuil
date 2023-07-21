import { useContext, useEffect, useState } from 'react';
import { anvilClient } from 'renderer/client';

export const InfoBar = ({
  blockNumber,
  anvilRunning,
}: {
  blockNumber: number;
  anvilRunning: boolean;
}) => {
  const [autoMining, setAutoMining] = useState<boolean>(false);

  const fetchAutomineStatus = async () => {
    try {
      const status = await anvilClient.getAutomine();
      setAutoMining(status);
    } catch (error) {
      console.error('Failed to fetch automine status: ', error);
    }
  };

  const toggleAutomine = async () => {
    try {
      await anvilClient.setAutomine(!autoMining);
      fetchAutomineStatus();
    } catch (error) {
      console.error('Failed to set automine status: ', error);
    }
  };

  useEffect(() => {
    fetchAutomineStatus();
  }, []);

  const mineBlock = async () => {
    try {
      await anvilClient.mine({
        blocks: 1,
      });
    } catch (error) {
      console.error('Failed to mine block: ', error);
    }
  };

  return (
    <div className="flex justify-between items-center gap-6 py-2 px-4 bg-base-200 text-base-content shadow-md w-full">
      <div className="flex items-center gap-4">
        <div className="flex gap-2 items-center">
          <div className="text-sm">Current block:</div>
          <div className="text-primary rounded-full p-1 text-sm font-semibold">
            {blockNumber}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-xs py-1 px-2"
          onClick={() => mineBlock()}
        >
          Mine
        </button>
        <button
          type="button"
          className={`btn btn-xs py-1 px-2 ${
            autoMining ? 'btn-success' : 'btn-error'
          }`}
          onClick={toggleAutomine}
        >
          AutoMining = {autoMining ? 'ON' : 'OFF'}
        </button>
        <div className="form-control w-1/3">
          <input
            type="text"
            placeholder="Search..."
            className="input input-xs input-bordered text-sm"
          />
        </div>
      </div>
      <div className="text-xs font-semibold">
        {anvilRunning ? (
          <div className="text-success">Anvil is running</div>
        ) : (
          <div className="text-error">Anvil is not running</div>
        )}
      </div>
    </div>
  );
};
