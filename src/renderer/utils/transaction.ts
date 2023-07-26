import { anvilClient } from 'renderer/client';
import { Address, Hash, Transaction } from 'viem';

export type TransactionExtended = Transaction & {
  contractAddress: Address | null;
  status?: string;
  gasUsed?: bigint;
};

export const fetchTransactionData = async (
  txHash: Hash
): Promise<TransactionExtended> => {
  const transaction = await anvilClient.getTransaction({ hash: txHash });
  const receipt = await anvilClient.getTransactionReceipt({ hash: txHash });

  return {
    ...transaction,
    contractAddress: receipt.contractAddress,
    status: receipt.status,
    gasUsed: receipt.gasUsed,
  };
};
