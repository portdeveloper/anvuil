import { useState } from 'react';
import Blockies from 'react-blockies';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Address } from 'viem';
import {
  CheckCircleIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

type TAddressProps = {
  address: Address | null;
  disableAddressLink?: boolean;
  format?: 'short' | 'long';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
};

export const AddressComp = ({
  address,
  disableAddressLink,
  format,
  size = 'base',
}: TAddressProps) => {
  const [addressCopied, setAddressCopied] = useState(false);

  // Skeleton UI
  if (!address) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  let displayAddress = address?.slice(0, 5) + '...' + address?.slice(-4);

  if (format === 'long') {
    displayAddress = address;
  }

  return (
    <div className="flex h-full font-mono">
      <div className="flex-shrink-0">
        <Blockies
          className="mx-auto rounded-md"
          size={8}
          seed={address.toLowerCase()}
          scale={3}
        />
      </div>
      {disableAddressLink ? (
        <span className={`ml-1.5 text-${size} font-normal`}>
          {displayAddress}
        </span>
      ) : (
        <a
          className={`ml-1.5 text-${size} font-normal`}
          target="_blank"
          // href={blockExplorerAddressLink} //@todo
          rel="noopener noreferrer"
        >
          {displayAddress}
        </a>
      )}
      {addressCopied ? (
        <CheckCircleIcon
          className="ml-1.5 text-xl font-normal h-5 w-5 cursor-pointer"
          aria-hidden="true"
        />
      ) : (
        <CopyToClipboard
          text={address}
          onCopy={() => {
            setAddressCopied(true);
            setTimeout(() => {
              setAddressCopied(false);
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
