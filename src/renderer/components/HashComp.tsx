import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  CheckCircleIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { Hash } from 'viem';

type THashProps = {
  hash: Hash | null;
  type: 'transaction' | 'block';
  disableHashLink?: boolean;
  format?: 'short' | 'long';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
};

export const HashComp = ({
  hash,
  type,
  disableHashLink,
  format,
  size = 'base',
}: THashProps) => {
  const [hashCopied, setHashCopied] = useState(false);

  // Skeleton UI
  if (!hash) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  let displayHash = hash?.slice(0, 5) + '...' + hash?.slice(-4);

  if (format === 'long') {
    displayHash = hash;
  }

  const linkTo =
    type === 'transaction' ? `/transactions/${hash}` : `/blocks/${hash}`;

  return (
    <div className="flex h-full font-mono">
      {disableHashLink ? (
        <span className={`ml-1.5 text-${size} font-normal`}>{displayHash}</span>
      ) : (
        <Link className={`ml-1.5 text-${size} font-normal`} to={linkTo}>
          {displayHash}
        </Link>
      )}
      {hashCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <CopyToClipboard
          text={hash}
          onCopy={() => {
            setHashCopied(true);
            setTimeout(() => {
              setHashCopied(false);
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
