import { useContext } from 'react';
import { BlocksContext } from '../BlocksContext';
import { Transaction } from 'viem';

export const Mempool = () => {
  const { mempool, anvilStatus } = useContext(BlocksContext);

  const pending: { [address: string]: { [nonce: string]: Transaction } } =
    mempool.pending as any;
  const queued: { [address: string]: { [nonce: string]: Transaction } } =
    mempool.queued as any;

  return Object.keys(pending).length === 0 &&
    Object.keys(queued).length === 0 ? (
    <div className="h-full flex items-center justify-center p-5 bg-gray-900 text-white">
      {anvilStatus
        ? 'No transactions in the mempool yet.'
        : 'Anvil is not running.'}
    </div>
  ) : (
    <div className="flex items-center p-5 bg-gray-900 text-white overflow-hidden h-full">
      <div className="flex flex-col h-full w-1/2 gap-4 p-5">
        <h1 className="text-center">Pending Transactions</h1>
        {Object.entries(pending).map(([address, txs]) => (
          <details key={address}>
            <summary className="text-xl">Address: {address}</summary>
            {Object.entries(txs).map(([nonce, tx]) => (
              <details key={tx.hash} className="ml-4">
                <summary>Txhash: {tx.hash}</summary>
                <div className="ml-4">
                  <p>From: {tx.from}</p>
                  <p>To: {tx.to}</p>
                  <p>Value: {Number(tx.value)}</p>
                </div>
              </details>
            ))}
          </details>
        ))}
      </div>
      <div className="flex flex-col h-full w-1/2 gap-4 p-5">
        <h1 className="text-center">Queued Transactions</h1>
        {Object.entries(queued).map(([address, txs]) => (
          <details key={address}>
            <summary className="text-xl">Address: {address}</summary>
            {Object.entries(txs).map(([nonce, tx]) => (
              <details key={tx.hash} className="ml-4">
                <summary>Txhash: {tx.hash}</summary>
                <div className="ml-4">
                  <p>From: {tx.from}</p>
                  <p>To: {tx.to}</p>
                  <p>Value: {Number(tx.value)}</p>
                </div>
              </details>
            ))}
          </details>
        ))}
      </div>
    </div>
  );
};
