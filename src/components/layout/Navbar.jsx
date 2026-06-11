import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlobalSearch from '../ui/GlobalSearch';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-surface-border bg-white/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        {user?.role === 'Admin' && <GlobalSearch />}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{user?.name}</p>
          <p className="text-xs text-slate-500">{user?.role}</p>
        </div>
        <button type="button" onClick={logout} className="btn-secondary !px-3" title="Logout">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
