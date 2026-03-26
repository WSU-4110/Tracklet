import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockFns = vi.hoisted(() => {
  const deleteItem = vi.fn();
  const updateItem = vi.fn();
  const addItem = vi.fn();
  const useFormState = vi.fn();
  const useFormStatus = vi.fn();
  const revalidatePath = vi.fn();
  const redirect = vi.fn();
  const createServerClient = vi.fn();
  const cookies = vi.fn();

  return {
    deleteItem,
    updateItem,
    addItem,
    useFormState,
    useFormStatus,
    revalidatePath,
    redirect,
    createServerClient,
    cookies,
  };
});

vi.mock('@/app/actions/items', () => ({
  deleteItem: mockFns.deleteItem,
  updateItem: mockFns.updateItem,
  addItem: mockFns.addItem,
}));

vi.mock('react-dom', () => ({
  useFormState: mockFns.useFormState,
  useFormStatus: mockFns.useFormStatus,
}));

vi.mock('next/cache', () => ({
  revalidatePath: mockFns.revalidatePath,
}));

vi.mock('next/navigation', () => ({
  redirect: mockFns.redirect,
}));

vi.mock('@supabase/ssr', () => ({
  createServerClient: mockFns.createServerClient,
}));

vi.mock('next/headers', () => ({
  cookies: mockFns.cookies,
}));

import ItemCard from '@/app/components/ItemCard';

const baseItem = {
  id: 'item-123',
  name: 'MacBook Pro',
  store: 'Apple Store',
  purchase_date: '2026-03-20',
  category: 'Electronics',
  price: '1999.99',
  created_at: '2026-03-20T00:00:00Z',
};

describe('ItemCard', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockFns.useFormState.mockReturnValue([{}, vi.fn()]);
    mockFns.useFormStatus.mockReturnValue({ pending: false });
    mockFns.deleteItem.mockResolvedValue({ success: true });
  });

  it('renders item details with Edit and Delete buttons', () => {
    render(<ItemCard item={baseItem} />);

    expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    expect(screen.getByText('Apple Store • 2026-03-20 • Electronics')).toBeInTheDocument();
    expect(screen.getByText('$1999.99')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('shows delete confirmation dialog and cancels it', () => {
    render(<ItemCard item={baseItem} />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByText('Are you sure you want to delete "MacBook Pro"?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByText('Are you sure you want to delete "MacBook Pro"?')).not.toBeInTheDocument();
  });

  it('enters edit mode and shows form fields with Save button', () => {
    render(<ItemCard item={baseItem} />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByDisplayValue('MacBook Pro')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Apple Store')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-03-20')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Electronics')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1999.99')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('uses fallback text when store is null', () => {
    render(<ItemCard item={{ ...baseItem, store: null }} />);

    expect(screen.getByText(/Unknown store/)).toBeInTheDocument();
  });

  it('calls deleteItem with the correct item ID', async () => {
    render(<ItemCard item={baseItem} />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);

    await waitFor(() => {
      expect(mockFns.deleteItem).toHaveBeenCalledWith('item-123');
    });
  });
});
