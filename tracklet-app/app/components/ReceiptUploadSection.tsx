'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { uploadItemReceipt, type ItemActionState } from '../actions/items';
import type { Item } from '@/lib/items';

const initialState: ItemActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all text-sm"
    >
      {pending ? 'Uploading…' : 'Upload receipt'}
    </button>
  );
}

export default function ReceiptUploadSection({ items }: { items: Item[] }) {
  const [state, formAction] = useFormState(uploadItemReceipt, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <div className="glass rounded-3xl border border-white/30 shadow-2xl p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Upload receipt</h2>
        <p className="text-sm text-gray-600 mt-1">
          Attach a JPG, PNG, or PDF to any item. Files are stored in your account and
          linked on the item card.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-600">
          Add an item first, then you can attach a receipt here or while adding the item.
        </p>
      ) : (
        <>
          {state.error && (
            <div className="p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-700 rounded-xl">
              <p className="text-sm font-medium">{state.error}</p>
            </div>
          )}
          {state.success && (
            <div className="p-4 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-emerald-800 rounded-xl">
              <p className="text-sm font-medium">Receipt uploaded.</p>
            </div>
          )}

          <form ref={formRef} action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="receipt-item"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Item
              </label>
              <select
                id="receipt-item"
                name="item_id"
                required
                className="w-full text-gray-700 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:bg-white/70 transition-all text-sm"
                defaultValue=""
              >
                <option value="" disabled>
                  Select an item
                </option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="receipt-file"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Receipt file
              </label>
              <input
                id="receipt-file"
                name="receipt"
                type="file"
                required
                accept="image/jpeg,image/png,application/pdf"
                capture="environment"
                className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-100 file:text-violet-800 hover:file:bg-violet-200"
              />
              <p className="text-xs text-gray-500 mt-2">Up to 5 MB.</p>
            </div>

            <SubmitButton />
          </form>
        </>
      )}
    </div>
  );
}
