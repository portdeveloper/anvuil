import { useBalance } from 'wagmi';

function AddressBlock({ address }: { address: string }) {
  const { data } = useBalance({ address: address as any });

  return (
    <div className="flex justify-between px-4 py-2 bg-slate-500">
      <div>{address}</div>
      <p>Ether: {data?.formatted}</p>
    </div>
  );
}

export default AddressBlock;
