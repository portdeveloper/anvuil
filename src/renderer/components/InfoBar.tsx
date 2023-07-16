import { useContext, useEffect, useState } from 'react';
import { BlocksContext } from 'renderer/BlocksContext';
import { anvilClient } from 'renderer/client';

export const InfoBar = () => {
  const [autoMining, setAutoMining] = useState<boolean>(false);
  const [highlight, setHighlight] = useState(false); // state to control highlight

  const { blockNumber } = useContext(BlocksContext);

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

  // useEffect to listen to blockNumber changes
  useEffect(() => {
    setHighlight(true);
    const timer = setTimeout(() => {
      setHighlight(false);
    }, 300); // change color for 500ms
    return () => clearTimeout(timer);
  }, [blockNumber]);

  return (
    <div className="flex gap-10 bg-green-400">
      <div>
        Current block:{' '}
        <span className={` ${highlight ? 'animate-pulse bg-pink-300' : ''}`}>
          {blockNumber}
        </span>
      </div>
      <button type="button" className="bg-pink-300" onClick={toggleAutomine}>
        AutoMining = {autoMining ? 'ON' : 'OFF'}
      </button>
      <button type="button" className="bg-pink-300" onClick={() => mineBlock()}>
        Mine a block
      </button>

      <div>searchbar?</div>
    </div>
  );
};
