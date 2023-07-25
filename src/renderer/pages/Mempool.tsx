import { Hash, Transaction } from 'viem';
import { anvilClient } from 'renderer/client';
import { useEffect, useState } from 'react';
import { AddressComp, HashComp } from 'renderer/components/';

export const Mempool = () => {
  const [mempool, setMempool] = useState({ pending: {}, queued: {} });
  const [updateInterval, setUpdateInterval] = useState<number>(5000); // default to updating every 5 seconds
  const [triggerFetch, setTriggerFetch] = useState(0);
  const [txToBeDropped, setTxToBeDropped] = useState<string>('');

  const pending: { [address: string]: { [nonce: string]: Transaction } } =
    mempool.pending as any;
  const queued: { [address: string]: { [nonce: string]: Transaction } } =
    mempool.queued as any;

  useEffect(() => {
    const fetchMempool = async () => {
      try {
        const memorypool = await anvilClient.getTxpoolContent();
        console.log(
          '⚠️⚠️⚠️ Mempool is fetched inside Mempool.tsx',
          'memorypool:',
          memorypool,
          'mempool:',
          mempool
        );

        setMempool(memorypool);
      } catch (error) {
        console.error('Failed to fetch mempool: ', error);
      }
    };

    console.log('⚠️⚠️⚠️ Mempool.tsx is called', mempool);

    fetchMempool();
    const intervalId = setInterval(fetchMempool, updateInterval);
    return () => clearInterval(intervalId);
  }, [triggerFetch]);

  const handleDropTxByHash = async () => {
    try {
      await anvilClient.dropTransaction({ hash: txToBeDropped as Hash });
      console.log('⚠️⚠️⚠️ Transaction dropped', txToBeDropped);
      setTriggerFetch((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to drop transaction: ', error);
    }
  };

  return (
    <div className="flex h-full">
      <div className="px-3 py-2 flex flex-col gap-7 bg-secondary w-1/5 justify-between">
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-1">
            <p>Drop Transaction by hash</p>
            <input
              type="bigint"
              value={txToBeDropped}
              onChange={(e) => setTxToBeDropped(e.target.value)}
              placeholder="Enter tx hash"
              className="input input-bordered input-sm w-full"
            />
            <button
              type="button"
              className="btn btn-xs w-full"
              onClick={handleDropTxByHash}
            >
              Drop transaction
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1 mb-2">
          <p>Set update interval (s)</p>
          <input
            type="range"
            min={1000}
            max={10000}
            step="1000"
            value={updateInterval}
            onChange={(e) => {
              setUpdateInterval(Number(e.target.value));
              setTriggerFetch((prev) => prev + 1);
            }}
            className="range range-xs"
          />
          <div className="w-full flex justify-between text-xs">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
          </div>
        </div>
      </div>
      <div className="px-5 py-2 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary">
        <h1 className="text-center text-xl">Pending Transactions</h1>
        <table className="table w-full table-compact">
          <thead>
            <tr>
              <th>Transaction Hash</th>
              <th>From</th>
              <th>To</th>
              <th>Value</th>
              <th>Drop Transaction</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(pending).flatMap(([address, txs]) =>
              Object.entries(txs).map(([nonce, tx]) => (
                <tr key={tx.hash}>
                  <td className="font-mono">
                    <HashComp hash={tx.hash} type="transaction" />
                  </td>
                  <td>
                    <AddressComp address={tx.from} />
                  </td>
                  <td>
                    {tx.to === null ? (
                      <span className="text-xs">Contract Creation</span>
                    ) : (
                      <AddressComp address={tx.to} />
                    )}
                  </td>
                  <td>{Number(tx.value)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-error btn-xs"
                      onClick={() => {
                        anvilClient.dropTransaction({ hash: tx.hash });
                        console.log('⚠️⚠️⚠️ Transaction dropped', tx.hash);
                        setTriggerFetch((prev) => prev + 1);
                      }}
                    >
                      Drop
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <h1 className="text-center text-xl mt-5">Queued Transactions</h1>
        <table className="table w-full table-compact">
          <thead>
            <tr>
              <th>Transaction Hash</th>
              <th>From</th>
              <th>To</th>
              <th>Value</th>
              <th>Nonce</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(queued).flatMap(([address, txs]) =>
              Object.entries(txs).map(([nonce, tx]) => (
                <tr key={tx.hash}>
                  <td className="font-mono">
                    <HashComp hash={tx.hash} type="transaction" />
                  </td>
                  <td>
                    <AddressComp address={tx.from} />
                  </td>
                  <td>
                    <AddressComp address={tx.to} />
                  </td>
                  <td>{Number(tx.value)}</td>
                  <td>{nonce}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
