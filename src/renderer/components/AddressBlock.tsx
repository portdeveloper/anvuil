import { useBalance } from 'wagmi';
import React from 'react';

function AddressBlock({ address }: { address: string }) {
  const { data } = useBalance({
    address: address as any,
  });

  return (
    <div className="px-2">
      <p className="text-indigo-300 font-mono">Ether: {data?.formatted}</p>
    </div>
  );
}

export default React.memo(AddressBlock);
