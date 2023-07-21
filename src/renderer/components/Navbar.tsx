import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();

  const generateLinkClass = (path: string) =>
    `tab ${location.pathname === path ? 'tab-active' : ''}`;

  return (
    <div className="tabs">
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
  );
};
