import { createClient, SupabaseClient } from '@supabase/supabase-js';

class SupabaseClientSingleton {

  private static instance: SupabaseClient;

  public static getInstance(): SupabaseClient {

    if (!SupabaseClientSingleton.instance) {

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables');
      }

      SupabaseClientSingleton.instance =
        createClient(supabaseUrl, supabaseAnonKey);
    }

    return SupabaseClientSingleton.instance;
  }
}

export const supabase = SupabaseClientSingleton.getInstance();