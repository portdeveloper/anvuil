import { Transaction } from 'viem';
import { anvilClient } from 'renderer/client';
import { useEffect, useState } from 'react';
import { TxHashComp, AddressComp } from 'renderer/components/';

export const Mempool = () => {
  const [mempool, setMempool] = useState({ pending: {}, queued: {} });

  useEffect(() => {
    const fetchMempool = async () => {
      try {
        const memorypool = await anvilClient.getTxpoolContent();
        console.log('⚠️⚠️⚠️ Mempool is fetched inside Mempool.tsx');

        setMempool(memorypool);
      } catch (error) {
        console.error('Failed to fetch mempool: ', error);
      }
    };

    fetchMempool();
    const intervalId = setInterval(fetchMempool, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const pending: { [address: string]: { [nonce: string]: Transaction } } =
    mempool.pending as any;
  const queued: { [address: string]: { [nonce: string]: Transaction } } =
    mempool.queued as any;

  return (
    <div className="flex h-full">
      <div className="px-3 py-2 flex flex-col gap-7 bg-secondary w-1/5">
        {/* Here you can add whatever controls you want, like in Blocks.tsx */}
      </div>
      <div className="px-5 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-secondary">
        <h1 className="text-center text-xl">Pending Transactions</h1>
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
            {Object.entries(pending).flatMap(([address, txs]) =>
              Object.entries(txs).map(([nonce, tx]) => (
                <tr key={tx.hash}>
                  <td className="font-mono">
                    <TxHashComp txHash={tx.hash} />
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
                    <TxHashComp txHash={tx.hash} />
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
