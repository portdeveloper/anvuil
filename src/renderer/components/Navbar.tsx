import { Link, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const Navbar = () => {
  const location = useLocation();

  const generateLinkClass = (path: string) => {
    if (path === '/') {
      return `tab ${location.pathname === path ? 'tab-active' : ''}`;
    } else {
      return `tab ${location.pathname.startsWith(path) ? 'tab-active' : ''}`;
    }
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
      <div className="relative w-5/12 flex">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-4 w-4" aria-hidden="true" />
        </div>
        <input
          type="text"
          placeholder="Search with hash or address"
          className="input input-xs my-1 mr-1 input-bordered text-sm pl-10 py-3 block w-full shadow-sm sm:text-sm rounded-md"
        />
      </div>
    </div>
  );
};
