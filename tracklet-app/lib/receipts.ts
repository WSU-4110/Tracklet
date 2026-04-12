import type { SupabaseClient } from '@supabase/supabase-js';
import type { ValidationResult } from './validators';

export const RECEIPT_BUCKET = 'receipts';
export const MAX_RECEIPT_BYTES = 5 * 1024 * 1024;

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

export function validateReceiptFile(file: File | null | undefined): ValidationResult {
  if (file == null || file.size === 0) {
    return { valid: true };
  }
  if (file.size > MAX_RECEIPT_BYTES) {
    return { valid: false, error: 'Receipt must be 5 MB or smaller.' };
  }
  if (!ALLOWED.has(file.type)) {
    return {
      valid: false,
      error: 'Receipt must be a JPG, PNG, WebP, or PDF file.',
    };
  }
  return { valid: true };
}

export function publicUrlToStoragePath(publicUrl: string, bucket: string): string | null {
  const marker = `/object/public/${bucket}/`;
  const i = publicUrl.indexOf(marker);
  if (i === -1) {
    return null;
  }
  return decodeURIComponent(publicUrl.slice(i + marker.length).split('?')[0] ?? '');
}

export async function removeReceiptObject(
  supabase: SupabaseClient,
  publicUrl: string | null | undefined,
): Promise<void> {
  if (!publicUrl) {
    return;
  }
  const path = publicUrlToStoragePath(publicUrl, RECEIPT_BUCKET);
  if (!path) {
    return;
  }
  await supabase.storage.from(RECEIPT_BUCKET).remove([path]);
}

export async function attachReceiptToItem(
  supabase: SupabaseClient,
  userId: string,
  itemId: string,
  file: File,
  previousPublicUrl: string | null,
): Promise<{ error?: string }> {
  const check = validateReceiptFile(file);
  if (!check.valid) {
    return { error: check.error };
  }
  if (file.size === 0) {
    return {};
  }

  const ext =
    file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'bin';
  const safeExt = ext.length > 8 ? 'bin' : ext;
  const path = `${userId}/${itemId}/${crypto.randomUUID()}.${safeExt}`;

  const { error: uploadError } = await supabase.storage.from(RECEIPT_BUCKET).upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });
  if (uploadError) {
    return { error: uploadError.message || 'Failed to upload receipt.' };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(RECEIPT_BUCKET).getPublicUrl(path);

  if (previousPublicUrl) {
    await removeReceiptObject(supabase, previousPublicUrl);
  }

  const { error: updateError } = await supabase
    .from('items')
    .update({ receipt_url: publicUrl, updated_at: new Date().toISOString() })
    .eq('id', itemId);

  if (updateError) {
    await supabase.storage.from(RECEIPT_BUCKET).remove([path]);
    return { error: updateError.message || 'Failed to save receipt link.' };
  }

  return {};
}
