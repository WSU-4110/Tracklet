'use client';

import { useFormState } from 'react-dom';
import { addItem, type ItemActionState } from '../actions/items';
import { parseReceiptFromImage } from '../actions/receiptParse';
import { EMPTY_FIELDS, type ParsedReceiptFields } from '@/lib/receiptParse';
import { useEffect, useRef, useState, useTransition } from 'react';

const initialState: ItemActionState = {};

export default function AddItemForm() {
  const [addState, addItemFormAction] = useFormState(addItem, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const receiptInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<ParsedReceiptFields>(EMPTY_FIELDS);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parseHint, setParseHint] = useState<string | null>(null);
  const [isParsing, startParse] = useTransition();
  const [isAdding, startAdd] = useTransition();

  useEffect(() => {
    if (addState.success) {
      setValues(EMPTY_FIELDS);
      setReceiptFile(null);
      setParseError(null);
      setParseHint(null);
      setFileInputKey((k) => k + 1);
      setIsOpen(false);
    }
  }, [addState.success]);

  const handleReadReceipt = () => {
    setParseError(null);
    setParseHint(null);
    const file = receiptFile ?? receiptInputRef.current?.files?.[0] ?? null;
    if (!file) {
      setParseError('Choose or capture a receipt photo first.');
      return;
    }
    startParse(async () => {
      const result = await parseReceiptFromImage(file);
      if (result.ok) {
        setValues(result.fields);
        setReceiptFile(file);
        setParseHint('Fields filled from receipt. Review and edit if needed, then add the item.');
      } else {
        setParseError(result.error);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setParseError(null);
    const fd = new FormData();
    fd.set('name', values.name.trim());
    fd.set('store', values.store.trim());
    fd.set('purchase_date', values.purchase_date.trim());
    fd.set('category', values.category.trim());
    fd.set('price', values.price.trim());
    fd.set('return_policy_days', values.return_policy_days.trim());
    fd.set('warranty_duration_months', values.warranty_duration_months.trim());
    const file = receiptFile ?? receiptInputRef.current?.files?.[0] ?? null;
    if (file && file.size > 0) {
      fd.set('receipt', file);
    }
    startAdd(() => {
      addItemFormAction(fd);
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm"
        >
          {isOpen ? 'Close form' : 'Add item'}
        </button>
        {addState.success && !isOpen && (
          <span className="text-sm text-emerald-700">Item added successfully.</span>
        )}
      </div>

      {isOpen && (
        <div className="glass rounded-3xl border border-white/30 shadow-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Add New Item</h3>

          {addState.error && (
            <div className="p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-700 rounded-xl">
              <p className="text-sm font-medium">{addState.error}</p>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-2xl border border-violet-200/60 bg-violet-50/40 p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-900">Receipt photo</p>
              <p className="text-xs text-gray-600">
                Take a picture or choose an image. We read the receipt to fill the form; the same
                image is stored when you add the item.
              </p>
              <input
                key={fileInputKey}
                ref={receiptInputRef}
                id="receipt-scan"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setReceiptFile(f);
                  setParseError(null);
                  setParseHint(null);
                }}
                className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-100 file:text-violet-900 hover:file:bg-violet-200"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isParsing}
                  onClick={handleReadReceipt}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-semibold rounded-xl hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-50 shadow-md"
                >
                  {isParsing ? 'Reading receipt…' : 'Read receipt & fill fields'}
                </button>
              </div>
              {parseError && (
                <p className="text-sm text-red-700">{parseError}</p>
              )}
              {parseHint && (
                <p className="text-sm text-emerald-800">{parseHint}</p>
              )}
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                required
                value={values.name}
                onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                className="w-full text-gray-700 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/70 transition-all"
                placeholder='e.g., MacBook Pro 14"'
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
                  value={values.store}
                  onChange={(e) => setValues((v) => ({ ...v, store: e.target.value }))}
                  className="w-full text-gray-700 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/70 transition-all"
                  placeholder="e.g., Apple Store"
                />
              </div>

              <div>
                <label
                  htmlFor="purchase_date"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Purchase Date
                </label>
                <input
                  id="purchase_date"
                  type="date"
                  name="purchase_date"
                  value={values.purchase_date}
                  onChange={(e) => setValues((v) => ({ ...v, purchase_date: e.target.value }))}
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
                  value={values.category}
                  onChange={(e) => setValues((v) => ({ ...v, category: e.target.value }))}
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
                  value={values.price}
                  onChange={(e) => setValues((v) => ({ ...v, price: e.target.value }))}
                  className="w-full text-gray-700 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/70 transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="return_policy_days"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Return Window (days)
                </label>
                <input
                  id="return_policy_days"
                  type="number"
                  name="return_policy_days"
                  min="0"
                  value={values.return_policy_days}
                  onChange={(e) => setValues((v) => ({ ...v, return_policy_days: e.target.value }))}
                  className="w-full text-gray-700 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/70 transition-all"
                  placeholder="e.g., 30"
                />
              </div>

              <div>
                <label
                  htmlFor="warranty_duration_months"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Warranty (months)
                </label>
                <input
                  id="warranty_duration_months"
                  type="number"
                  name="warranty_duration_months"
                  min="0"
                  value={values.warranty_duration_months}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, warranty_duration_months: e.target.value }))
                  }
                  className="w-full text-gray-700 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/70 transition-all"
                  placeholder="e.g., 12"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAdding}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm"
            >
              {isAdding ? 'Adding...' : 'Add Item'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
