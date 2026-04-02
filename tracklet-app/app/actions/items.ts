'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type ItemActionState = {
  error?: string;
  success?: boolean;
};

async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: '', ...options });
      },
    },
  });
}

export async function addItem(
  _prevState: ItemActionState,
  formData: FormData,
): Promise<ItemActionState> {
  const name = formData.get('name') as string | null;
  const store = formData.get('store') as string | null;
  const purchaseDate = formData.get('purchase_date') as string | null;
  const category = formData.get('category') as string | null;
  const price = formData.get('price') as string | null;
  const returnPolicyDays = formData.get('return_policy_days') as string | null;
  const warrantyDurationMonths = formData.get('warranty_duration_months') as string | null;

  if (!name || name.trim() === '') {
    return { error: 'Item name is required.' };
  }

  const parsedReturnDays = returnPolicyDays ? parseInt(returnPolicyDays, 10) : null;
  const parsedWarrantyMonths = warrantyDurationMonths ? parseInt(warrantyDurationMonths, 10) : null;

  let returnDeadline: string | null = null;
  if (purchaseDate && parsedReturnDays) {
    const d = new Date(purchaseDate);
    d.setDate(d.getDate() + parsedReturnDays);
    returnDeadline = d.toISOString().split('T')[0];
  }

  let warrantyExpiration: string | null = null;
  if (purchaseDate && parsedWarrantyMonths) {
    const d = new Date(purchaseDate);
    d.setMonth(d.getMonth() + parsedWarrantyMonths);
    warrantyExpiration = d.toISOString().split('T')[0];
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('items').insert({
    name: name.trim(),
    store: store?.trim() || null,
    purchase_date: purchaseDate || null,
    category: category?.trim() || null,
    price: price ? parseFloat(price) : null,
    return_policy_days: parsedReturnDays,
    return_deadline: returnDeadline,
    warranty_duration_months: parsedWarrantyMonths,
    warranty_expiration: warrantyExpiration,
  });

  if (error) {
    return { error: error.message || 'Failed to add item.' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateItem(
  _prevState: ItemActionState,
  formData: FormData,
): Promise<ItemActionState> {
  const id = formData.get('id') as string | null;
  const name = formData.get('name') as string | null;
  const store = formData.get('store') as string | null;
  const purchaseDate = formData.get('purchase_date') as string | null;
  const category = formData.get('category') as string | null;
  const price = formData.get('price') as string | null;
  const returnPolicyDays = formData.get('return_policy_days') as string | null;
  const warrantyDurationMonths = formData.get('warranty_duration_months') as string | null;

  if (!id) {
    return { error: 'Item ID is required.' };
  }

  if (!name || name.trim() === '') {
    return { error: 'Item name is required.' };
  }

  const parsedReturnDays = returnPolicyDays ? parseInt(returnPolicyDays, 10) : null;
  const parsedWarrantyMonths = warrantyDurationMonths ? parseInt(warrantyDurationMonths, 10) : null;

  let returnDeadline: string | null = null;
  if (purchaseDate && parsedReturnDays) {
    const d = new Date(purchaseDate);
    d.setDate(d.getDate() + parsedReturnDays);
    returnDeadline = d.toISOString().split('T')[0];
  }

  let warrantyExpiration: string | null = null;
  if (purchaseDate && parsedWarrantyMonths) {
    const d = new Date(purchaseDate);
    d.setMonth(d.getMonth() + parsedWarrantyMonths);
    warrantyExpiration = d.toISOString().split('T')[0];
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('items')
    .update({
      name: name.trim(),
      store: store?.trim() || null,
      purchase_date: purchaseDate || null,
      category: category?.trim() || null,
      price: price ? parseFloat(price) : null,
      return_policy_days: parsedReturnDays,
      return_deadline: returnDeadline,
      warranty_duration_months: parsedWarrantyMonths,
      warranty_expiration: warrantyExpiration,
    })
    .eq('id', id);

  if (error) {
    return { error: error.message || 'Failed to update item.' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteItem(itemId: string): Promise<ItemActionState> {
  if (!itemId) {
    return { error: 'Item ID is required.' };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('items').delete().eq('id', itemId);

  if (error) {
    return { error: error.message || 'Failed to delete item.' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}