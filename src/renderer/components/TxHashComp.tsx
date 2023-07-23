import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  CheckCircleIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { Hash } from 'viem';

type TTxHashProps = {
  txHash: Hash | null;
  disableTxHashLink?: boolean;
  format?: 'short' | 'long';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
};

export const TxHashComp = ({
  txHash,
  disableTxHashLink,
  format,
  size = 'base',
}: TTxHashProps) => {
  const [txHashCopied, setTxHashCopied] = useState(false);

  // Skeleton UI
  if (!txHash) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  let displayTxHash = txHash?.slice(0, 5) + '...' + txHash?.slice(-4);

  if (format === 'long') {
    displayTxHash = txHash;
  }

  return (
    <div className="flex h-full font-mono">
      {disableTxHashLink ? (
        <span className={`ml-1.5 text-${size} font-normal`}>
          {displayTxHash}
        </span>
      ) : (
        <Link
          className={`ml-1.5 text-${size} font-normal`}
          to={`/transactions/${txHash}`}
        >
          {displayTxHash}
        </Link>
      )}
      {txHashCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <CopyToClipboard
          text={txHash}
          onCopy={() => {
            setTxHashCopied(true);
            setTimeout(() => {
              setTxHashCopied(false);
            }, 800);
          }}
        >
          <DocumentDuplicateIcon
            className="ml-1.5 text-xl font-normal h-5 w-5 cursor-pointer"
            aria-hidden="true"
          />
        </CopyToClipboard>
      )}
    </div>
  );
};
