import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export type Item = {
    id: string;
    name: string;
    store: string | null;
    purchase_date: string | null;
    category: string | null;
    price: string | null;
    receipt_url: string | null;
    return_policy_days: number | null;
    return_deadline: string | null;
    warranty_duration_months: number | null;
    warranty_expiration: string | null;
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
        .select('id, name, store, purchase_date, category, price, receipt_url, return_policy_days, return_deadline, warranty_duration_months, warranty_expiration, created_at')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching items', error);
        return [];
    }

    return data ?? [];
}