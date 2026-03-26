import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockFns = vi.hoisted(() => {
  const addItem = vi.fn();
  const updateItem = vi.fn();
  const deleteItem = vi.fn();
  const useFormState = vi.fn();
  const useFormStatus = vi.fn();
  const revalidatePath = vi.fn();
  const redirect = vi.fn();
  const createServerClient = vi.fn();
  const cookies = vi.fn();

  return {
    addItem,
    updateItem,
    deleteItem,
    useFormState,
    useFormStatus,
    revalidatePath,
    redirect,
    createServerClient,
    cookies,
  };
});

vi.mock('@/app/actions/items', () => ({
  addItem: mockFns.addItem,
  updateItem: mockFns.updateItem,
  deleteItem: mockFns.deleteItem,
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

import AddItemForm from '@/app/components/AddItemForm';

describe('AddItemForm', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockFns.useFormState.mockReturnValue([{}, vi.fn()]);
    mockFns.useFormStatus.mockReturnValue({ pending: false });
  });

  it('renders toggle button and keeps form hidden initially', () => {
    render(<AddItemForm />);

    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
    expect(screen.queryByText('Add New Item')).not.toBeInTheDocument();
  });

  it('expands form on click and shows all fields', () => {
    render(<AddItemForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Add item' }));

    expect(screen.getByText('Add New Item')).toBeInTheDocument();
    expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Store')).toBeInTheDocument();
    expect(screen.getByLabelText('Purchase Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toBeInTheDocument();
  });

  it('collapses the form on second toggle click', () => {
    render(<AddItemForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Add item' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close form' }));

    expect(screen.queryByText('Add New Item')).not.toBeInTheDocument();
  });

  it('marks Item Name as required', () => {
    render(<AddItemForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Add item' }));
    expect(screen.getByLabelText(/Item Name/i)).toBeRequired();
  });

  it('renders Add Item submit button when form is open', () => {
    render(<AddItemForm />);

    fireEvent.click(screen.getByRole('button', { name: 'Add item' }));
    expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument();
  });
});
