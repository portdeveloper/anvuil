import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();
  return (
    <div>
      <Link
        className={`bg-slate-500 px-3 py-2 hover:bg-slate-600 ${
          location.pathname === '/' ? 'bg-slate-700 text-white' : ''
        }`}
        to="/"
      >
        Home
      </Link>
      <Link
        className={`bg-slate-500 px-3 py-2 hover:bg-slate-600 ${
          location.pathname === '/accounts' ? 'bg-slate-700 text-white' : ''
        }`}
        to="/accounts"
      >
        Accounts
      </Link>
      <Link
        className={`bg-slate-500 px-3 py-2 hover:bg-slate-600 ${
          location.pathname === '/blocks'
            ? 'bg-slate-700 text-white'
            : ''
        }`}
        to="/blocks"
      >
        Blocks
      </Link>
      <Link
        className={`bg-slate-500 px-3 py-2 hover:bg-slate-600 ${
          location.pathname === '/transactions'
            ? 'bg-slate-700 text-white'
            : ''
        }`}
        to="/transactions"
      >
        Transactions
      </Link>
      <Link
        className={`bg-slate-500 px-3 py-2 hover:bg-slate-600 ${
          location.pathname === '/events'
            ? 'bg-slate-700 text-white'
            : ''
        }`}
        to="/events"
      >
        Events
      </Link>
      <Link
        className={`bg-slate-500 px-3 py-2 hover:bg-slate-600 ${
          location.pathname === '/logs-window' ? 'bg-slate-700 text-white' : ''
        }`}
        to="/logs-window"
      >
        Logs
      </Link>
    </div>
  );
};
