'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { signOut } from '../actions/auth';

interface SidebarProps {
  displayName: string;
  fullName: string;
}

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-700',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: '/items',
    label: 'Items',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-700',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden
      >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" x2="12" y1="22.08" y2="12" />
      </svg>
    ),
  },
  {
    href: '/items#upload-receipt',
    label: 'Upload Receipt',
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-700',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden
      >
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M12 12v9" />
        <path d="m16 16-4-4-4 4" />
      </svg>
    ),
  },
];

export default function Sidebar({ displayName, fullName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="group fixed left-0 top-0 z-50 h-screen w-16 hover:w-56 transition-all duration-300 ease-out glass-dark border-r border-white/20 backdrop-blur-xl shadow-xl">
      <div className="h-full flex flex-col justify-between p-2">
        <div>
          <div className="h-14 flex items-center justify-center group-hover:justify-start group-hover:px-1 mb-3">
            <span className="inline-flex items-center justify-center rounded-xl bg-white/45 px-1.5 py-1 backdrop-blur-md ring-1 ring-white/50 shadow-sm shrink-0">
              <Image
                src="/logo.png"
                alt="Tracklet"
                width={144}
                height={144}
                className="h-9 w-auto object-contain"
                priority
                unoptimized
              />
            </span>
            <span className="ml-3 text-lg font-semibold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap w-0 group-hover:w-auto overflow-hidden">
              Tracklet
            </span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = item.href.startsWith('/')
                ? pathname === item.href
                : false;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`mx-auto w-11 h-11 group-hover:mx-0 group-hover:w-full group-hover:h-auto flex items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3 rounded-xl px-0 group-hover:px-3 py-0 group-hover:py-2.5 transition-all ${
                    isActive
                      ? 'bg-white/60 border border-white/40 text-gray-900'
                      : 'hover:bg-white/45 border border-transparent hover:border-white/30 text-gray-700'
                  }`}
                >
                  <span
                    className={`h-8 w-8 rounded-lg ${item.iconBg} ${item.iconText} flex items-center justify-center shrink-0`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm whitespace-nowrap w-0 group-hover:w-auto overflow-hidden ${
                      isActive ? 'font-semibold' : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2">
          <div className="rounded-xl border border-white/30 bg-white/40 p-2 flex items-center justify-center gap-0 group-hover:justify-start group-hover:gap-2 group-hover:px-2.5">
            <span className="h-7 w-7 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </span>
            <p className="ml-0 group-hover:ml-0 text-sm font-semibold text-gray-800 truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-0 group-hover:w-auto overflow-hidden">
              {fullName}
            </p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full flex items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3 rounded-xl px-2 group-hover:px-3 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-md transition-all"
            >
              <span className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <path d="M14 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9" />
                  <path d="M10 12h11" />
                  <path d="m18 8 4 4-4 4" />
                </svg>
              </span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-semibold whitespace-nowrap w-0 group-hover:w-auto overflow-hidden">
                Logout
              </span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
