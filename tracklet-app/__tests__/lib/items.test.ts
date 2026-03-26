import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFns = vi.hoisted(() => {
  const order = vi.fn();
  const select = vi.fn(() => ({ order }));
  const from = vi.fn(() => ({ select }));
  const createServerClient = vi.fn(() => ({ from }));
  const cookies = vi.fn();

  return { order, select, from, createServerClient, cookies };
});

vi.mock('@supabase/ssr', () => ({
  createServerClient: mockFns.createServerClient,
}));

vi.mock('next/headers', () => ({
  cookies: mockFns.cookies,
}));

import { getItemsForCurrentUser } from '@/lib/items';

describe('getItemsForCurrentUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';

    mockFns.cookies.mockResolvedValue({
      get: vi.fn(),
      set: vi.fn(),
    });
  });

  it('returns items on successful query', async () => {
    const items = [
      {
        id: '1',
        name: 'Laptop',
        store: 'Best Buy',
        purchase_date: '2026-03-20',
        category: 'Electronics',
        price: '999.99',
        created_at: '2026-03-20T00:00:00Z',
      },
    ];
    mockFns.order.mockResolvedValue({ data: items, error: null });

    const result = await getItemsForCurrentUser();

    expect(result).toEqual(items);
    expect(mockFns.from).toHaveBeenCalledWith('items');
    expect(mockFns.select).toHaveBeenCalledWith(
      'id, name, store, purchase_date, category, price, created_at',
    );
    expect(mockFns.order).toHaveBeenCalledWith('created_at', { ascending: false });
  });

  it('returns an empty array when Supabase returns an error', async () => {
    const error = { message: 'Query failed' };
    mockFns.order.mockResolvedValue({ data: null, error });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await getItemsForCurrentUser();

    expect(result).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching items', error);
    consoleErrorSpy.mockRestore();
  });

  it('returns an empty array when Supabase data is null', async () => {
    mockFns.order.mockResolvedValue({ data: null, error: null });

    const result = await getItemsForCurrentUser();

    expect(result).toEqual([]);
  });

  it('returns an empty array when query returns no items', async () => {
    mockFns.order.mockResolvedValue({ data: [], error: null });

    const result = await getItemsForCurrentUser();

    expect(result).toEqual([]);
  });
});
