'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { attachReceiptToItem, removeReceiptObject, validateReceiptFile } from '@/lib/receipts';

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
  const receiptField = formData.get('receipt');
  const receipt =
    receiptField instanceof File && receiptField.size > 0 ? receiptField : null;

  if (!name || name.trim() === '') {
    return { error: 'Item name is required.' };
  }

  if (receipt) {
    const receiptCheck = validateReceiptFile(receipt);
    if (!receiptCheck.valid) {
      return { error: receiptCheck.error ?? 'Invalid receipt file.' };
    }
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
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'You must be signed in.' };
  }

  const { data: inserted, error } = await supabase
    .from('items')
    .insert({
      user_id: user.id,
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
    .select('id')
    .single();

  if (error || !inserted) {
    return { error: error?.message || 'Failed to add item.' };
  }

  if (receipt) {
    const attach = await attachReceiptToItem(supabase, user.id, inserted.id, receipt, null);
    if (attach.error) {
      return { error: attach.error };
    }
  }

  revalidatePath('/dashboard');
  revalidatePath('/items');
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
  const receiptField = formData.get('receipt');
  const receipt =
    receiptField instanceof File && receiptField.size > 0 ? receiptField : null;

  if (!id) {
    return { error: 'Item ID is required.' };
  }

  if (!name || name.trim() === '') {
    return { error: 'Item name is required.' };
  }

  if (receipt) {
    const receiptCheck = validateReceiptFile(receipt);
    if (!receiptCheck.valid) {
      return { error: receiptCheck.error ?? 'Invalid receipt file.' };
    }
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
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'You must be signed in.' };
  }

  const { data: existing } = await supabase
    .from('items')
    .select('receipt_url')
    .eq('id', id)
    .single();

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
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { error: error.message || 'Failed to update item.' };
  }

  if (receipt) {
    const attach = await attachReceiptToItem(
      supabase,
      user.id,
      id,
      receipt,
      existing?.receipt_url ?? null,
    );
    if (attach.error) {
      return { error: attach.error };
    }
  }

  revalidatePath('/dashboard');
  revalidatePath('/items');
  return { success: true };
}

export async function uploadItemReceipt(
  _prevState: ItemActionState,
  formData: FormData,
): Promise<ItemActionState> {
  const itemId = formData.get('item_id') as string | null;
  const receiptField = formData.get('receipt');
  const receipt =
    receiptField instanceof File && receiptField.size > 0 ? receiptField : null;

  if (!itemId || itemId.trim() === '') {
    return { error: 'Choose an item.' };
  }
  if (!receipt) {
    return { error: 'Choose a receipt file.' };
  }

  const receiptCheck = validateReceiptFile(receipt);
  if (!receiptCheck.valid) {
    return { error: receiptCheck.error ?? 'Invalid receipt file.' };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'You must be signed in.' };
  }

  const { data: existing, error: fetchError } = await supabase
    .from('items')
    .select('receipt_url')
    .eq('id', itemId)
    .single();

  if (fetchError || !existing) {
    return { error: fetchError?.message || 'Item not found.' };
  }

  const attach = await attachReceiptToItem(
    supabase,
    user.id,
    itemId,
    receipt,
    existing.receipt_url,
  );
  if (attach.error) {
    return { error: attach.error };
  }

  revalidatePath('/dashboard');
  revalidatePath('/items');
  return { success: true };
}

export async function removeItemReceipt(itemId: string): Promise<ItemActionState> {
  if (!itemId) {
    return { error: 'Item ID is required.' };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: 'You must be signed in.' };
  }

  const { data: row, error: fetchError } = await supabase
    .from('items')
    .select('receipt_url')
    .eq('id', itemId)
    .single();

  if (fetchError) {
    return { error: fetchError.message || 'Failed to load item.' };
  }

  if (row?.receipt_url) {
    await removeReceiptObject(supabase, row.receipt_url);
  }

  const { error } = await supabase
    .from('items')
    .update({ receipt_url: null, updated_at: new Date().toISOString() })
    .eq('id', itemId);

  if (error) {
    return { error: error.message || 'Failed to remove receipt.' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/items');
  return { success: true };
}

export async function deleteItem(itemId: string): Promise<ItemActionState> {
  if (!itemId) {
    return { error: 'Item ID is required.' };
  }

  const supabase = await createSupabaseServerClient();

  const { data: row } = await supabase
    .from('items')
    .select('receipt_url')
    .eq('id', itemId)
    .single();

  if (row?.receipt_url) {
    await removeReceiptObject(supabase, row.receipt_url);
  }

  const { error } = await supabase.from('items').delete().eq('id', itemId);

  if (error) {
    return { error: error.message || 'Failed to delete item.' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/items');
  return { success: true };
}