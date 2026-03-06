'use client';

import { useFormStatus } from 'react-dom';
import { addItem } from '../actions/items';
import { useRef, useState } from 'react';
import { useFormObserver } from './useFormObserver';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm"
    >
      {pending ? 'Adding...' : 'Add Item'}
    </button>
  );
}

export default function AddItemForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [state, formAction] = useFormObserver(addItem, {
    onSuccess: () => {
      formRef.current?.reset();
      setIsOpen(false);
    },
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm"
        >
          {isOpen ? 'Close form' : 'Add item'}
        </button>
        {state.success && !isOpen && (
          <span className="text-sm text-emerald-700">
            Item added successfully.
          </span>
        )}
      </div>

      {isOpen && (
        <div className="glass rounded-3xl border border-white/30 shadow-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Add New Item</h3>

          {state.error && (
            <div className="p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-700 rounded-xl">
              <p className="text-sm font-medium">{state.error}</p>
            </div>
          )}

          <form ref={formRef} action={formAction} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                required
                className="w-full text-gray-700 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/70 transition-all"
                placeholder="e.g., MacBook Pro 14&quot;"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="store" className="block text-sm font-semibold text-gray-700 mb-2">
                  Store
                </label>
                <input
                  id="store"
                  type="text"
                  name="store"
                  className="w-full text-gray-700 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/70 transition-all"
                  placeholder="e.g., Apple Store"
                />
              </div>

              <div>
                <label htmlFor="purchase_date" className="block text-sm font-semibold text-gray-700 mb-2">
                  Purchase Date
                </label>
                <input
                  id="purchase_date"
                  type="date"
                  name="purchase_date"
                  className="w-full text-gray-700 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/70 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <input
                  id="category"
                  type="text"
                  name="category"
                  className="w-full text-gray-700 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/70 transition-all"
                  placeholder="e.g., Electronics"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  className="w-full text-gray-700 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/70 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <SubmitButton />
          </form>
        </div>
      )}
    </div>
  );
}