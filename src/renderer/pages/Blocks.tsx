import { useState } from 'react';
import { toast } from 'react-toastify';
import { anvilClient } from 'renderer/client';
import { TxHashComp } from 'renderer/components/TxHashComp';
import { Block, Address } from 'viem';

export const Blocks = ({ blocks }: { blocks: Block[] }) => {
  const [intervalMining, setIntervalMining] = useState<number>(0);
  const [gasLimit, setGasLimit] = useState<number>(30000000);
  const [jumpTime, setJumpTime] = useState<number>(0);
  const [blockTimestampInterval, setBlockTimestampInterval] =
    useState<number>(0);
  const [coinbase, setCoinbase] = useState<string>('');

  const handleSetIntervalMining = async () => {
    try {
      await anvilClient.setIntervalMining({
        interval: intervalMining,
      });
      toast.info(`Set automatic mining interval to ${intervalMining}`);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleSetJumpTime = async () => {
    try {
      await anvilClient.increaseTime({
        seconds: jumpTime,
      });
      toast.info(`Jumped ${jumpTime} seconds`);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleSetBlockTimestampInterval = async () => {
    try {
      await anvilClient.setBlockTimestampInterval({
        interval: blockTimestampInterval,
      });
      toast.info(`Set block timestamp interval to ${blockTimestampInterval}`);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleRemoveBlockTimestampInterval = async () => {
    try {
      await anvilClient.removeBlockTimestampInterval();
      toast.info(`Removed block timestamp interval`);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleSetGasLimit = async () => {
    try {
      await anvilClient.setBlockGasLimit({
        gasLimit: BigInt(gasLimit),
      });
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleSetCoinbase = async () => {
    try {
      await anvilClient.setCoinbase({
        address: coinbase as Address,
      });
      toast.info(`Set coinbase to ${coinbase}`);
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div className="flex h-full">
      <div className="px-3 py-2 flex flex-col gap-7 bg-secondary w-1/5">
        <div className="flex flex-col gap-1">
          <p>Set interval for mining</p>
          <input
            type="number"
            value={intervalMining}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              setIntervalMining(newValue >= 0 ? newValue : 0);
            }}
            placeholder="Enter interval in seconds"
            className="input input-bordered input-sm w-full"
          />
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleSetIntervalMining}
          >
            Set interval mining
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <p>Set block gas limit</p>
          <input
            type="bigint"
            value={gasLimit}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              setGasLimit(newValue >= 0 ? newValue : 0);
            }}
            placeholder="Enter gas limit"
            className="input input-bordered input-sm w-full"
          />
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleSetGasLimit}
          >
            Set block gas limit
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <p>Jump Time (seconds):</p>
          <input
            type="number"
            value={jumpTime}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              setJumpTime(newValue >= 0 ? newValue : 0);
            }}
            placeholder="Enter seconds to jump"
            className="input input-bordered input-sm w-full"
          />
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleSetJumpTime}
          >
            Jump
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <p>Block Timestamp Interval (seconds):</p>
          <input
            type="number"
            value={blockTimestampInterval}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              setBlockTimestampInterval(newValue >= 0 ? newValue : 0);
            }}
            placeholder="Enter seconds"
            className="input input-bordered input-sm w-full"
          />
          <button
            className="btn btn-xs w-full"
            onClick={handleRemoveBlockTimestampInterval}
          >
            Remove Interval
          </button>
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleSetBlockTimestampInterval}
          >
            Set Interval
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <p>Set coinbase</p>
          <input
            type="text"
            value={coinbase}
            onChange={(e) => setCoinbase(e.target.value)}
            placeholder="Enter coinbase address"
            className="input input-bordered input-sm w-full"
          />
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleSetCoinbase}
          >
            Set coinbase
          </button>
        </div>
      </div>
      <div className="px-5 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary">
        <table className="table w-full table-compact">
          <thead>
            <tr>
              <th>Block hash</th>
              <th>Gas limit</th>
              <th>Gas used</th>
              <th>Timestamp</th>
              <th>Transactions</th>
            </tr>
          </thead>
          <tbody>
            {blocks.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center">
                  No blocks found
                </td>
              </tr>
            )}
            {blocks.map((block) => (
              <tr key={block.hash} className="">
                <td>
                  <TxHashComp txHash={block.hash} disableTxHashLink={true} />
                </td>
                <td>{Number(block.gasLimit)}</td>
                <td>{Number(block.gasUsed)}</td>
                <td>
                  {new Date(Number(block.timestamp) * 1000).toLocaleString()}
                </td>
                <td>
                  {block.transactions.map((tx) => (
                    <div key={tx.toString()} className="p-2">
                      {tx.toString()}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
