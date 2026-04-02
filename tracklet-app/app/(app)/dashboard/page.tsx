import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getItemsForCurrentUser } from '@/lib/items';

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function urgencyClasses(daysLeft: number): string {
  if (daysLeft <= 3) return 'bg-red-100/70 text-red-700 border-red-200/50';
  if (daysLeft <= 7) return 'bg-amber-100/70 text-amber-700 border-amber-200/50';
  return 'bg-emerald-100/70 text-emerald-700 border-emerald-200/50';
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const items = await getItemsForCurrentUser();

  const metadata = (user?.user_metadata ?? {}) as {
    first_name?: string;
    last_name?: string;
  };
  const displayName = metadata.first_name || user.email || 'User';

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const totalSpent = items.reduce((sum, item) => {
    return item.price ? sum + parseFloat(item.price) : sum;
  }, 0);

  const activeReturns = items.filter((item) => {
    if (!item.return_deadline) return false;
    return daysUntil(item.return_deadline) >= 0;
  }).length;

  const activeWarranties = items.filter((item) => {
    if (!item.warranty_expiration) return false;
    return daysUntil(item.warranty_expiration) >= 0;
  }).length;

  const upcomingReturns = items
    .filter((item) => {
      if (!item.return_deadline) return false;
      const days = daysUntil(item.return_deadline);
      return days >= 0 && days <= 14;
    })
    .sort(
      (a, b) =>
        daysUntil(a.return_deadline!) - daysUntil(b.return_deadline!),
    );

  const expiringWarranties = items
    .filter((item) => {
      if (!item.warranty_expiration) return false;
      const days = daysUntil(item.warranty_expiration);
      return days >= 0 && days <= 90;
    })
    .sort(
      (a, b) =>
        daysUntil(a.warranty_expiration!) - daysUntil(b.warranty_expiration!),
    );

  const itemsWithPrice = items.filter(
    (item) => item.price && parseFloat(item.price) > 0,
  );
  const avgPrice =
    itemsWithPrice.length > 0 ? totalSpent / itemsWithPrice.length : 0;

  const categoryTotals = itemsWithPrice.reduce<Record<string, number>>(
    (acc, item) => {
      const cat = item.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + parseFloat(item.price!);
      return acc;
    },
    {},
  );
  const sortedCategories = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a,
  );

  const recentItems = items.slice(0, 5);

  const snapshotStats = [
    {
      label: 'Total Items',
      value: items.length.toString(),
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" x2="12" y1="22.08" y2="12" />
        </svg>
      ),
    },
    {
      label: 'Total Spent',
      value: formatCurrency(totalSpent),
      iconBg: 'bg-emerald-100',
      iconText: 'text-emerald-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <line x1="12" x2="12" y1="2" y2="22" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: 'Active Returns',
      value: activeReturns.toString(),
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      ),
    },
    {
      label: 'Active Warranties',
      value: activeWarranties.toString(),
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Welcome */}
      <section>
        <h1 className="text-3xl sm:text-4xl font-bold">
          Welcome back,{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {displayName}
          </span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-xl">
          Here&apos;s an overview of your items, return windows, and warranties.
        </p>
      </section>

      {/* Snapshot Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {snapshotStats.map((stat) => (
          <div
            key={stat.label}
            className="glass rounded-2xl border border-white/30 shadow-lg p-5 flex items-center gap-4"
          >
            <span
              className={`h-11 w-11 rounded-xl ${stat.iconBg} ${stat.iconText} flex items-center justify-center shrink-0`}
            >
              {stat.icon}
            </span>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Upcoming Returns + Expiring Warranties */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Return Deadlines */}
        <div className="glass rounded-2xl border border-white/30 shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Upcoming Return Deadlines
            </h2>
            <span className="text-xs font-medium text-gray-500">
              Next 14 days
            </span>
          </div>

          {upcomingReturns.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">
              No upcoming return deadlines.
            </p>
          ) : (
            <div className="space-y-2">
              {upcomingReturns.map((item) => {
                const days = daysUntil(item.return_deadline!);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between glass rounded-xl px-4 py-3 border border-white/20"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.store || 'Unknown store'}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border shrink-0 ml-3 ${urgencyClasses(days)}`}
                    >
                      {days === 0
                        ? 'Today'
                        : days === 1
                          ? '1 day left'
                          : `${days} days left`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <a
            href="/items"
            className="inline-block text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all items &rarr;
          </a>
        </div>

        {/* Expiring Warranties */}
        <div className="glass rounded-2xl border border-white/30 shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Expiring Warranties
            </h2>
            <span className="text-xs font-medium text-gray-500">
              Next 90 days
            </span>
          </div>

          {expiringWarranties.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">
              No warranties expiring soon.
            </p>
          ) : (
            <div className="space-y-2">
              {expiringWarranties.map((item) => {
                const days = daysUntil(item.warranty_expiration!);
                const label =
                  days === 0
                    ? 'Expires today'
                    : days === 1
                      ? '1 day left'
                      : days <= 30
                        ? `${days} days left`
                        : `${Math.ceil(days / 30)} months left`;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between glass rounded-xl px-4 py-3 border border-white/20"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.store || 'Unknown store'}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border shrink-0 ml-3 ${urgencyClasses(days)}`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Spending Overview + Recently Added */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Overview */}
        <div className="glass rounded-2xl border border-white/30 shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Spending Overview
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="glass rounded-xl px-4 py-3 border border-white/20">
              <p className="text-xs text-gray-500 font-medium">Total Spent</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="glass rounded-xl px-4 py-3 border border-white/20">
              <p className="text-xs text-gray-500 font-medium">Avg. Price</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(avgPrice)}
              </p>
            </div>
          </div>

          {sortedCategories.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                By Category
              </p>
              {sortedCategories.map(([category, total]) => {
                const pct = totalSpent > 0 ? (total / totalSpent) * 100 : 0;
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-medium">
                        {category}
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {formatCurrency(total)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {sortedCategories.length === 0 && (
            <p className="text-sm text-gray-500 py-2">
              No spending data yet.
            </p>
          )}
        </div>

        {/* Recently Added */}
        <div className="glass rounded-2xl border border-white/30 shadow-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recently Added
          </h2>

          {recentItems.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">
              No items yet. Head over to Items to add your first one.
            </p>
          ) : (
            <div className="space-y-2">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between glass rounded-xl px-4 py-3 border border-white/20"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.store || 'Unknown store'}
                      {item.purchase_date ? ` \u2022 ${item.purchase_date}` : ''}
                    </p>
                  </div>
                  {item.price && (
                    <span className="text-sm font-semibold text-emerald-600 shrink-0 ml-3">
                      ${item.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <a
            href="/items"
            className="inline-block text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all items &rarr;
          </a>
        </div>
      </section>
    </>
  );
}
