'use client';

import { useState } from 'react';
import { deleteItem, updateItem, type ItemActionState } from '../actions/items';
import { useFormState, useFormStatus } from 'react-dom';
import type { Item } from '@/lib/items';

const initialState: ItemActionState = {};

function EditSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
    >
      {pending ? 'Saving...' : 'Save'}
    </button>
  );
}

export default function ItemCard({ item }: { item: Item }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteState, setDeleteState] = useState<ItemActionState>({});
  const [state, formAction] = useFormState(updateItem, initialState);

  const handleDelete = async () => {
    const result = await deleteItem(item.id);
    setDeleteState(result);
    if (result.success) {
      setShowDeleteConfirm(false);
    }
  };

  if (isEditing) {
    return (
      <div className="glass rounded-2xl border border-gray-400/80 bg-white/45 shadow-md p-4">
        {state.error && (
          <div className="mb-4 p-3 bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-700 rounded-xl text-sm">
            {state.error}
          </div>
        )}
        {state.success && (
          <div className="mb-4 p-3 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-emerald-700 rounded-xl text-sm">
            Item updated!
          </div>
        )}
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="id" value={item.id} />
          <div>
            <input
              type="text"
              name="name"
              defaultValue={item.name}
              required
              className="w-full text-gray-700 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              placeholder="Item name"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="store"
              defaultValue={item.store || ''}
              className="w-full text-gray-700 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              placeholder="Store"
            />
            <input
              type="date"
              name="purchase_date"
              defaultValue={item.purchase_date || ''}
              className="w-full text-gray-700 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="category"
              defaultValue={item.category || ''}
              className="w-full text-gray-700 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              placeholder="Category"
            />
            <input
              type="number"
              name="price"
              step="0.01"
              defaultValue={item.price || ''}
              className="w-full text-gray-700 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              placeholder="Price"
            />
          </div>
          <div className="flex gap-2">
            <EditSubmitButton />
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 glass border border-white/30 text-gray-700 text-sm font-semibold rounded-xl hover:bg-white/30 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl border border-gray-400/80 bg-white/45 shadow-md p-4">
      {deleteState.error && (
        <div className="mb-3 p-3 bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-700 rounded-xl text-sm">
          {deleteState.error}
        </div>
      )}

      {showDeleteConfirm ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            Are you sure you want to delete &quot;{item.name}&quot;?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 shadow-lg transition-all"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 glass border border-white/30 text-gray-700 text-sm font-semibold rounded-xl hover:bg-white/30 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{item.name}</p>
            <p className="text-xs text-gray-600 mt-1">
              {item.store ?? 'Unknown store'}
              {item.purchase_date ? ` • ${item.purchase_date}` : ''}
              {item.category ? ` • ${item.category}` : ''}
            </p>
            {item.price && (
              <p className="text-sm font-semibold text-emerald-600 mt-1">
                ${item.price}
              </p>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 glass border border-white/30 text-gray-700 text-xs font-semibold rounded-lg hover:bg-white/30 transition-all"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 shadow-lg transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
