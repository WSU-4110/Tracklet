import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getItemsForCurrentUser } from '@/lib/items';
import { signOut } from '../actions/auth';

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
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || user.email;
    const displayName = firstName || user.email;

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            {/* Navbar */}
            <nav className="sticky top-0 z-50 glass-dark border-b border-white/20 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Tracklet
                        </span>

                        <div className="flex items-center gap-3">
                            <span className="hidden sm:inline text-xs sm:text-sm text-gray-700 px-3 py-1.5 glass rounded-xl border border-white/20">
                                {fullName}
                            </span>
                            <form action={signOut}>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                                >
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
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
                            <Link
                                href="#items"
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm"
                            >
                                View items
                            </Link>
                            <span className="px-6 py-3 glass border border-white/30 text-gray-700 rounded-xl text-xs sm:text-sm">
                                Add / edit / delete items UI coming next.
                            </span>
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

                <section id="items" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Your items</h2>
                        <span className="text-xs text-gray-500">
                            CRUD UI coming soon in this section.
                        </span>
                    </div>

                    {items.length === 0 ? (
                        <div className="glass rounded-2xl border border-dashed border-white/40 p-6 text-sm text-gray-600">
                            You don&apos;t have any items yet. Soon you&apos;ll be able to add
                            purchases here and see them in this list.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="glass rounded-2xl border border-white/30 p-4 flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-900">{item.name}</p>
                                        <p className="text-xs text-gray-600">
                                            {item.store ?? 'Unknown store'}
                                            {item.purchase_date
                                                ? ` • Purchased ${item.purchase_date}`
                                                : ''}
                                        </p>
                                    </div>
                                    {item.price && (
                                        <p className="text-sm font-semibold text-emerald-600">
                                            ${item.price}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

