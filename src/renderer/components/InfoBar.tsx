import { useContext, useEffect, useState } from 'react';
import { BlocksContext } from 'renderer/BlocksContext';
import { anvilClient } from 'renderer/client';

export const InfoBar = () => {
  const [autoMining, setAutoMining] = useState<boolean>(false); // @todo type

  const { blockNumber } = useContext(BlocksContext);

  const fetchAutomineStatus = async () => {
    try {
      const status = await anvilClient.getAutomine();
      setAutoMining(status);
    } catch (error) {
      console.error('Failed to fetch automine status: ', error);
    }
  };

  useEffect(() => {
    fetchAutomineStatus();
  }, []);

  return (
    <div className="flex gap-10 bg-green-400">
      <div>Current block: {blockNumber}</div>
      <div>Mining status: {autoMining ? 'true' : 'false'}</div>
      <div>other info about current state of local node</div>
      <div>searchbar?</div>
    </div>
  );
};
