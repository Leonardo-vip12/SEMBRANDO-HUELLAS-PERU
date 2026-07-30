import { Search, Bell, Moon, Sun, Menu } from 'lucide-react';
import { useState } from 'react';

interface AdminNavbarProps {
  onMenuToggle: () => void;
}

export default function AdminNavbar({ onMenuToggle }: AdminNavbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 lg:hidden dark:hover:bg-neutral-800">
          <Menu size={20} />
        </button>
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Buscar en el panel..."
            className="w-64 rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-4 text-sm text-neutral-900 outline-none placeholder-neutral-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          />
          <kbd className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-neutral-300 px-1.5 text-[10px] text-neutral-400 md:inline-block dark:border-neutral-600">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={toggleDark} className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Bell size={18} />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
              <div className="border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Notificaciones</p>
              </div>
              <div className="max-h-60 overflow-y-auto p-2">
                {[
                  { title: 'Nuevo voluntario', desc: 'María López se registró como voluntaria', time: '2 min' },
                  { title: 'Donación recibida', desc: 'S/ 500.00 de Juan Pérez', time: '15 min' },
                  { title: 'Publicación programada', desc: 'Artículo "Reforestación 2025" listo', time: '1 h' },
                ].map((n, i) => (
                  <div key={i} className="rounded-lg px-3 py-2.5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{n.title}</p>
                    <p className="text-xs text-neutral-500">{n.desc}</p>
                    <p className="mt-0.5 text-[10px] text-neutral-400">Hace {n.time}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-200 p-2 dark:border-neutral-700">
                <button className="w-full rounded-lg px-3 py-2 text-center text-xs font-medium text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20">
                  Ver todas
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="ml-2 flex items-center gap-3 border-l border-neutral-200 pl-3 dark:border-neutral-700">
          <div className="text-right">
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Admin</p>
            <p className="text-xs text-neutral-400">Super Administrador</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
