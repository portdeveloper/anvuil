import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  return (
    <div className="">
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
          location.pathname === '/block-explorer'
            ? 'bg-slate-700 text-white'
            : ''
        }`}
        to="/block-explorer"
      >
        Block Explorer
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
}
