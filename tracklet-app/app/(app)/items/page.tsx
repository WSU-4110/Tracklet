import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getItemsForCurrentUser } from '@/lib/items';
import AddItemForm from '../../components/AddItemForm';
import ItemCard from '../../components/ItemCard';

export default async function ItemsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const items = await getItemsForCurrentUser();

  return (
    <>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Your Items
          </h1>
          <span className="text-sm text-gray-500">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
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
    </>
  );
}
