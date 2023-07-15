import { useContext } from 'react';
import { BlocksContext } from 'renderer/BlocksContext';

export const InfoBar = () => {
  const { blockNumber } = useContext(BlocksContext);

  return (
    <div className="flex gap-10 bg-green-400">
      <div>Current block: {blockNumber}</div>
      <div>Mining status:</div>
      <div>other info about current state of local node</div>
      <div>searchbar?</div>
    </div>
  );
};
