import { useBalance } from 'wagmi';
import React from 'react';

function AddressBlock({ address }: { address: string }) {
  const { data } = useBalance({ address: address as any });

  return (
    <div className="">
      <p>Ether: {data?.formatted}</p>
      <div>{address}</div>
    </div>
  );
}

export default React.memo(AddressBlock);
