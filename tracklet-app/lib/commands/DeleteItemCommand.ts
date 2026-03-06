import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export class DeleteItemCommand {
  private itemId: string;

  constructor(itemId: string) {
    this.itemId = itemId;
  }

  async execute(): Promise<void> {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
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
      }
    );

    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', this.itemId);

    if (error) {
      throw new Error(error.message);
    }
  }
}
