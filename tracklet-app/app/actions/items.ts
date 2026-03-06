'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { DeleteItemCommand } from '@/lib/commands/DeleteItemCommand';

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
  formData: FormData
): Promise<ItemActionState> {
  const name = formData.get('name')?.toString().trim();

  if (!name) {
    return { error: 'Item name is required.' };
  }

  const store = formData.get('store')?.toString().trim() || null;
  const purchase_date = formData.get('purchase_date')?.toString() || null;
  const category = formData.get('category')?.toString().trim() || null;
  const priceValue = formData.get('price')?.toString().trim();
  const price = priceValue ? Number(priceValue) : null;

  if (priceValue && Number.isNaN(price)) {
    return { error: 'Price must be a valid number.' };
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in.' };
  }

  const { error } = await supabase.from('items').insert({
    user_id: user.id,
    name,
    store,
    purchase_date,
    category,
    price,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function updateItem(
  _prevState: ItemActionState,
  formData: FormData
): Promise<ItemActionState> {
  const id = formData.get('id')?.toString();
  const name = formData.get('name')?.toString().trim();

  if (!id) {
    return { error: 'Item ID is required.' };
  }

  if (!name) {
    return { error: 'Item name is required.' };
  }

  const store = formData.get('store')?.toString().trim() || null;
  const purchase_date = formData.get('purchase_date')?.toString() || null;
  const category = formData.get('category')?.toString().trim() || null;
  const priceValue = formData.get('price')?.toString().trim();
  const price = priceValue ? Number(priceValue) : null;

  if (priceValue && Number.isNaN(price)) {
    return { error: 'Price must be a valid number.' };
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be signed in.' };
  }

  const { error } = await supabase
    .from('items')
    .update({
      name,
      store,
      purchase_date,
      category,
      price,
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteItem(id: string) {
  const command = new DeleteItemCommand(id);
  await command.execute();
  revalidatePath('/dashboard');
}