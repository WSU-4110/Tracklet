'use server';

import { parseReceiptImageWithOpenAI, type ParsedReceiptFields } from '@/lib/receiptParse';

export type ParseReceiptResult =
  | { ok: true; fields: ParsedReceiptFields }
  | { ok: false; error: string };

const MAX_PARSE_BYTES = 4 * 1024 * 1024;

export async function parseReceiptFromImage(file: File): Promise<ParseReceiptResult> {
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'Choose a receipt image first.' };
  }
  if (file.size > MAX_PARSE_BYTES) {
    return { ok: false, error: 'Image must be 4 MB or smaller for reading.' };
  }

  const mime = file.type || 'application/octet-stream';
  const buf = new Uint8Array(await file.arrayBuffer());
  return parseReceiptImageWithOpenAI(buf, mime);
}
