import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export type Item = {
  id: string;
  name: string;
  store: string | null;
  purchase_date: string | null;
  category: string | null;
  price: string | null;
  created_at: string;
};

export class ItemRepository {

  async getItemsForCurrentUser(): Promise<Item[]> {

    const cookieStore = await cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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

    const { data, error } = await supabase
      .from('items')
      .select('id, name, store, purchase_date, category, price, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items', error);
      return [];
    }

    return data ?? [];
  }
}