import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { isAddress, Hash } from 'viem';
import { anvilClient } from 'renderer/client';
import { toast } from 'react-toastify';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  const generateLinkClass = (path: string) => {
    if (path === '/') {
      return `tab ${location.pathname === path ? 'tab-active' : ''}`;
    } else {
      return `tab ${location.pathname.startsWith(path) ? 'tab-active' : ''}`;
    }
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isAddress(searchInput)) {
      navigate(`/accounts/${searchInput}`);
      return;
    } else {
      try {
        const block = await anvilClient.getBlock({
          blockHash: searchInput as Hash,
        });
        if (block) {
          navigate(`/blocks/${searchInput}`);
          return;
        }
      } catch (error: any) {
        toast.error(error);
      }

      try {
        const transaction = await anvilClient.getTransaction({
          hash: searchInput as Hash,
        });
        if (transaction) {
          navigate(`/transactions/${searchInput}`);
          return;
        }
      } catch (error: any) {
        toast.error(error);
      }
    }
    toast.error('No matching block, transaction, or address found.');
  };

  return (
    <div className="tabs flex justify-between items-center">
      <div>
        <Link className={generateLinkClass('/')} to="/">
          Home
        </Link>
        <Link className={generateLinkClass('/accounts')} to="/accounts">
          Accounts
        </Link>
        <Link className={generateLinkClass('/blocks')} to="/blocks">
          Blocks
        </Link>
        <Link className={generateLinkClass('/transactions')} to="/transactions">
          Transactions
        </Link>
        <Link className={generateLinkClass('/mempool')} to="/mempool">
          Mempool
        </Link>
        <Link className={generateLinkClass('/events')} to="/events">
          Events
        </Link>
        <Link className={generateLinkClass('/logs-window')} to="/logs-window">
          Logs
        </Link>
      </div>
      <form className="relative w-6/12 flex" onSubmit={handleSearch}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-4 w-4" aria-hidden="true" />
        </div>
        <input
          type="text"
          placeholder="Search with hash or address"
          className="input input-xs my-1 mr-1 input-bordered text-sm pl-10 py-3 block w-full shadow-sm sm:text-sm rounded-md"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-xs btn-primary self-center mr-1"
        >
          Search
        </button>
      </form>
    </div>
  );
};
