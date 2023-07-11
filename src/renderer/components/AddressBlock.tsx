import { useBalance } from 'wagmi';

export default function AddressBlock({ address }: { address: string }) {
  const { data } = useBalance({
    address: address as any,
  });

  return <span>ETH BALANCE:{data?.formatted}</span>;
}
