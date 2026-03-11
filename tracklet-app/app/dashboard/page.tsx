import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getItemsForCurrentUser } from '@/lib/items';
import { signOut } from '../actions/auth';
import AddItemForm from '../components/AddItemForm';
import ItemCard from '../components/ItemCard';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const items = await getItemsForCurrentUser();

  const metadata = (user?.user_metadata ?? {}) as {
    first_name?: string;
    last_name?: string;
  };
  const firstName = metadata.first_name || '';
  const lastName = metadata.last_name || '';
  const fullName =
    [firstName, lastName].filter(Boolean).join(' ') || user.email || 'User';
  const displayName = firstName || user.email || 'User';

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Left Sidebar Navigation */}
      <aside className="group fixed left-0 top-0 z-50 h-screen w-16 hover:w-56 transition-all duration-300 ease-out glass-dark border-r border-white/20 backdrop-blur-xl shadow-xl">
        <div className="h-full flex flex-col justify-between p-2">
          <div>
            <div className="h-14 flex items-center justify-center group-hover:justify-start group-hover:px-1 mb-3">
              <span className="h-9 w-9 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center text-base shadow-md shrink-0">
                T
              </span>
              <span className="ml-3 text-lg font-semibold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap w-0 group-hover:w-auto overflow-hidden">
                Tracklet
              </span>
            </div>

            <nav className="space-y-1.5">
              <a
                href="/dashboard"
                className="mx-auto w-11 h-11 group-hover:mx-0 group-hover:w-full group-hover:h-auto flex items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3 rounded-xl px-0 group-hover:px-3 py-0 group-hover:py-2.5 bg-white/60 border border-white/40 text-gray-900"
              >
                <span className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center shrink-0">
                  D
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-semibold whitespace-nowrap w-0 group-hover:w-auto overflow-hidden">
                  Dashboard
                </span>
              </a>

              <a
                href="#items"
                className="mx-auto w-11 h-11 group-hover:mx-0 group-hover:w-full group-hover:h-auto flex items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3 rounded-xl px-0 group-hover:px-3 py-0 group-hover:py-2.5 hover:bg-white/45 border border-transparent hover:border-white/30 text-gray-700"
              >
                <span className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center shrink-0">
                  I
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium whitespace-nowrap w-0 group-hover:w-auto overflow-hidden">
                  Items
                </span>
              </a>

              <a
                href="#upload-receipt"
                className="mx-auto w-11 h-11 group-hover:mx-0 group-hover:w-full group-hover:h-auto flex items-center justify-center group-hover:justify-start gap-0 group-hover:gap-3 rounded-xl px-0 group-hover:px-3 py-0 group-hover:py-2.5 hover:bg-white/45 border border-transparent hover:border-white/30 text-gray-700"
              >
                <span className="h-8 w-8 rounded-lg bg-purple-100 text-purple-700 text-sm font-bold flex items-center justify-center shrink-0">
                  U
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium whitespace-nowrap w-0 group-hover:w-auto overflow-hidden">
                  Upload Receipt
                </span>
              </a>
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

      <main className="relative ml-16 px-6 sm:px-10 lg:px-14 py-10 space-y-10">
        <section className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {displayName}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl">
              This is your Tracklet dashboard. From here you&apos;ll be able to
              manage your items, receipts, return windows, and warranties.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <a
                href="#items"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm"
              >
                View items
              </a>
            </div>
          </div>

          <div className="w-full lg:w-80 glass rounded-3xl border border-white/30 shadow-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">
              Snapshot
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center glass rounded-2xl px-4 py-3 border border-white/30">
                <span className="text-gray-600">Total items</span>
                <span className="font-semibold text-gray-900">
                  {items.length}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="items" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your items</h2>
          </div>

          <AddItemForm />

          {items.length === 0 ? (
            <div className="glass rounded-2xl border border-dashed border-white/40 p-6 text-sm text-gray-600">
              You don&apos;t have any items yet. Add your first item above!
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <section id="upload-receipt" className="space-y-4">
          <h2 className="text-xl font-semibold">Upload Receipt</h2>
          <div className="glass rounded-2xl border border-dashed border-white/40 p-6 text-sm text-gray-600">
            Receipt upload section is coming next. This nav item is ready and
            will take users here once we implement file uploads.
          </div>
        </section>
      </main>
    </div>
  );
}