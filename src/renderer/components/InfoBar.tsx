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
  const [highlight, setHighlight] = useState(false); // state to control highlight

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
    <div className="flex gap-10 w-full bg-green-400 justify-between">
      <div className="flex gap-10">
        <div>
          Current block:{' '}
          <span className={` ${highlight ? 'animate-pulse bg-pink-300' : ''}`}>
            {blockNumber}
          </span>
        </div>
        <button type="button" className="bg-pink-300" onClick={toggleAutomine}>
          AutoMining = {autoMining ? 'ON' : 'OFF'}
        </button>
        <button
          type="button"
          className="bg-pink-300"
          onClick={() => mineBlock()}
        >
          Mine a block
        </button>

        <div>searchbar?</div>
      </div>
      <div className=" justify-end">
        {anvilRunning ? (
          <div className="bg-green-300">Anvil is running</div>
        ) : (
          <div className="bg-red-300">Anvil is not running</div>
        )}
      </div>
    </div>
  );
};
