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

export async function getItemsForCurrentUser(): Promise<Item[]> {
    const cookieStore = await cookies();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options),
                    );
                } catch {
                    // Server Components cannot write cookies directly.
                }
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