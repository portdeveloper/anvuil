import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { anvilClient } from 'renderer/client';
import {
  AddressInput,
  BlockDetails,
  HashComp,
  Pagination,
} from 'renderer/components';
import { Block, Address, Hash, isAddress } from 'viem';
import { ITEMS_PER_PAGE } from 'renderer/constants';
import { usePagination } from 'renderer/hooks/usePagination';

export const Blocks = ({ blocks }: { blocks: Block[] }) => {
  const [intervalMining, setIntervalMining] = useState<number>(0);
  const [gasLimit, setGasLimit] = useState<number>(30000000);
  const [jumpTime, setJumpTime] = useState<number>(0);
  const [blockTimestampInterval, setBlockTimestampInterval] =
    useState<number>(0);
  const [coinbase, setCoinbase] = useState<string>('');

  let { blockHash } = useParams();

  const {
    currentItems: currentBlocks,
    currentPage,
    paginate,
  } = usePagination(blocks, ITEMS_PER_PAGE);

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
          <p>Set interval for mining (s)</p>
          <input
            type="number"
            value={intervalMining}
            onChange={(e) => setIntervalMining(Number(e.target.value))}
            placeholder="Enter interval in seconds"
            className="input input-bordered input-sm w-full"
          />
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleSetIntervalMining}
            disabled={!intervalMining}
          >
            Set interval mining
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <p>Set block gas limit</p>
          <input
            type="bigint"
            value={gasLimit}
            onChange={(e) => setGasLimit(Number(e.target.value))}
            placeholder="Enter gas limit"
            className="input input-bordered input-sm w-full"
            min={0}
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
          <p>Jump Time (s)</p>
          <input
            type="number"
            value={jumpTime}
            onChange={(e) => setJumpTime(Number(e.target.value))}
            placeholder="Enter seconds to jump"
            className="input input-bordered input-sm w-full"
            min={0}
          />
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleSetJumpTime}
            disabled={!jumpTime}
          >
            Jump
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <p>Block Timestamp Interval (s)</p>
          <input
            type="number"
            value={blockTimestampInterval}
            onChange={(e) => setBlockTimestampInterval(Number(e.target.value))}
            placeholder="Enter seconds"
            className="input input-bordered input-sm w-full"
          />
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleSetBlockTimestampInterval}
            disabled={!blockTimestampInterval}
          >
            Set Interval
          </button>
          <button
            className="btn btn-xs w-full"
            onClick={handleRemoveBlockTimestampInterval}
            disabled={!blockTimestampInterval}
          >
            Remove Interval
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <p>Set coinbase</p>
          <AddressInput
            value={coinbase}
            onChange={setCoinbase}
            name="coinbase"
            placeholder="Enter address"
          />
          <button
            type="button"
            className="btn btn-xs w-full"
            onClick={handleSetCoinbase}
            disabled={!isAddress(coinbase)}
          >
            Set coinbase
          </button>
        </div>
      </div>
      <div className="px-5 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary ">
        <div>
          {blockHash ? (
            <BlockDetails />
          ) : (
            <div>
              <div className="min-h-[550px]">
                <table className="table w-full table-compact">
                  <thead>
                    <tr>
                      <th>Block hash</th>
                      <th>Block number</th>
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
                    {currentBlocks.map((block: Block) => (
                      <tr key={block.hash} className="h-[50px]">
                        <td>
                          <HashComp hash={block.hash} type="block" />
                        </td>
                        <td>{Number(block.number)}</td>
                        <td>{Number(block.gasLimit)}</td>
                        <td>{Number(block.gasUsed)}</td>
                        <td>
                          {new Date(
                            Number(block.timestamp) * 1000
                          ).toLocaleString()}
                        </td>
                        <td>
                          <div className="max-h-[50px] overflow-y-auto scrollbar-thin font-mono">
                            {block.transactions.map((tx) => (
                              <div key={tx.toString()}>
                                <HashComp
                                  hash={tx as Hash}
                                  type="transaction"
                                />
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={currentPage}
                totalItems={blocks.length}
                paginate={paginate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
