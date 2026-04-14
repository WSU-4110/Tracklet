import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addItem, updateItem, deleteItem } from '@/app/actions/items';

// isolate the unit under test from Next.js and Supabase internals
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();

const mockSupabaseClient = {
  from: vi.fn((table: string) => ({
    insert: mockInsert,
    update: (...args: unknown[]) => {
      mockUpdate(...args);
      return { eq: mockEq };
    },
    delete: () => {
      mockDelete();
      return { eq: mockEq };
    },
  })),
};

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => mockSupabaseClient),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    get: vi.fn(),
    set: vi.fn(),
  })),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

// Utility to build FormData for tests
function buildFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.set(key, value);
  }
  return fd;
}

// addItem
describe('addItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns an error when the item name is missing', async () => {
    const formData = buildFormData({ store: 'Amazon' });

    const result = await addItem({}, formData);

    expect(result).toEqual({ error: 'Item name is required.' });
    expect(mockSupabaseClient.from).not.toHaveBeenCalled();
  });

  it('returns an error when the item name is only whitespace', async () => {
    const formData = buildFormData({ name: '   ' });

    const result = await addItem({}, formData);

    expect(result).toEqual({ error: 'Item name is required.' });
    expect(mockSupabaseClient.from).not.toHaveBeenCalled();
  });

  it('inserts a trimmed item and returns success', async () => {
    mockInsert.mockResolvedValue({ error: null });

    const formData = buildFormData({
      name: '  Laptop  ',
      store: ' Best Buy ',
      purchase_date: '2026-01-15',
      category: ' Electronics ',
      price: '999.99',
    });

    const result = await addItem({}, formData);

    expect(result).toEqual({ success: true });
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('items');
    expect(mockInsert).toHaveBeenCalledWith({
      name: 'Laptop',
      store: 'Best Buy',
      purchase_date: '2026-01-15',
      category: 'Electronics',
      price: 999.99,
    });
  });

  it('returns the Supabase error message on insert failure', async () => {
    mockInsert.mockResolvedValue({
      error: { message: 'Row-level security violation' },
    });

    const formData = buildFormData({ name: 'Headphones' });

    const result = await addItem({}, formData);

    expect(result).toEqual({ error: 'Row-level security violation' });
  });

  it('handles optional fields as null when omitted', async () => {
    mockInsert.mockResolvedValue({ error: null });

    const formData = buildFormData({ name: 'Charger' });

    const result = await addItem({}, formData);

    expect(result).toEqual({ success: true });
    expect(mockInsert).toHaveBeenCalledWith({
      name: 'Charger',
      store: null,
      purchase_date: null,
      category: null,
      price: null,
    });
  });
});

// updateItem

describe('updateItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns an error when the item ID is missing', async () => {
    const formData = buildFormData({ name: 'Laptop' });

    const result = await updateItem({}, formData);

    expect(result).toEqual({ error: 'Item ID is required.' });
    expect(mockSupabaseClient.from).not.toHaveBeenCalled();
  });

  it('returns an error when the item name is missing', async () => {
    const formData = buildFormData({ id: 'abc-123' });

    const result = await updateItem({}, formData);

    expect(result).toEqual({ error: 'Item name is required.' });
    expect(mockSupabaseClient.from).not.toHaveBeenCalled();
  });

  it('updates the item and returns success', async () => {
    mockEq.mockResolvedValue({ error: null });

    const formData = buildFormData({
      id: 'abc-123',
      name: '  Updated Laptop  ',
      store: ' Amazon ',
      purchase_date: '2026-03-01',
      category: ' Tech ',
      price: '1299.00',
    });

    const result = await updateItem({}, formData);

    expect(result).toEqual({ success: true });
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('items');
    expect(mockUpdate).toHaveBeenCalledWith({
      name: 'Updated Laptop',
      store: 'Amazon',
      purchase_date: '2026-03-01',
      category: 'Tech',
      price: 1299.0,
    });
    expect(mockEq).toHaveBeenCalledWith('id', 'abc-123');
  });

  it('returns the Supabase error message on update failure', async () => {
    mockEq.mockResolvedValue({
      error: { message: 'Item not found' },
    });

    const formData = buildFormData({
      id: 'bad-id',
      name: 'Phone',
    });

    const result = await updateItem({}, formData);

    expect(result).toEqual({ error: 'Item not found' });
  });

  it('returns an error when the name is only whitespace', async () => {
    const formData = buildFormData({ id: 'abc-123', name: '   ' });

    const result = await updateItem({}, formData);

    expect(result).toEqual({ error: 'Item name is required.' });
  });
});

// deleteItem

describe('deleteItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns an error when itemId is empty', async () => {
    const result = await deleteItem('');

    expect(result).toEqual({ error: 'Item ID is required.' });
    expect(mockSupabaseClient.from).not.toHaveBeenCalled();
  });

  it('deletes the item and returns success', async () => {
    mockEq.mockResolvedValue({ error: null });

    const result = await deleteItem('abc-123');

    expect(result).toEqual({ success: true });
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('items');
    expect(mockEq).toHaveBeenCalledWith('id', 'abc-123');
  });

  it('returns the Supabase error message on delete failure', async () => {
    mockEq.mockResolvedValue({
      error: { message: 'Permission denied' },
    });

    const result = await deleteItem('abc-123');

    expect(result).toEqual({ error: 'Permission denied' });
  });
});
