export type ParsedReceiptFields = {
  name: string;
  store: string;
  purchase_date: string;
  category: string;
  price: string;
  return_policy_days: string;
  warranty_duration_months: string;
};

const EMPTY_FIELDS: ParsedReceiptFields = {
  name: '',
  store: '',
  purchase_date: '',
  category: '',
  price: '',
  return_policy_days: '',
  warranty_duration_months: '',
};

function numOrEmpty(n: unknown): string {
  if (n == null || n === '') return '';
  const x = typeof n === 'number' ? n : parseFloat(String(n));
  if (Number.isNaN(x)) return '';
  return String(Math.round(x * 100) / 100);
}

function intOrEmpty(n: unknown): string {
  if (n == null || n === '') return '';
  const x = typeof n === 'number' ? n : parseInt(String(n), 10);
  if (Number.isNaN(x) || x < 0) return '';
  return String(x);
}

function normalizeDate(s: unknown): string {
  if (s == null || typeof s !== 'string') return '';
  const t = s.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  return '';
}

export function normalizeParsedReceipt(raw: Record<string, unknown>): ParsedReceiptFields {
  const name = typeof raw.name === 'string' ? raw.name.trim() : '';
  const store = typeof raw.store === 'string' ? raw.store.trim() : '';
  const category = typeof raw.category === 'string' ? raw.category.trim() : '';
  return {
    name,
    store,
    purchase_date: normalizeDate(raw.purchase_date),
    category,
    price: numOrEmpty(raw.price),
    return_policy_days: intOrEmpty(raw.return_policy_days),
    warranty_duration_months: intOrEmpty(raw.warranty_duration_months),
  };
}

export async function parseReceiptImageWithOpenAI(
  imageBytes: Uint8Array,
  mimeType: string,
): Promise<{ ok: true; fields: ParsedReceiptFields } | { ok: false; error: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    return { ok: false, error: 'Receipt reading is not configured on the server.' };
  }

  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
  if (!allowed.has(mimeType)) {
    return {
      ok: false,
      error: 'Use a photo (JPG, PNG, or WebP) for automatic reading. PDF is not supported here.',
    };
  }

  const b64 = Buffer.from(imageBytes).toString('base64');
  const dataUrl = `data:${mimeType};base64,${b64}`;

  const prompt = `You read shopping receipts. Return ONLY valid JSON (no markdown) with exactly these keys:
"name": string — main product name or short description of the purchase (required; if unclear use the merchant line item or "Purchase").
"store": string — store or merchant name, or "".
"purchase_date": string — YYYY-MM-DD if visible, else "".
"category": string — one short category such as Electronics, Clothing, Food, Home, or "".
"price": number or null — total amount paid (number only).
"return_policy_days": integer or null — return window in days if stated (e.g. "30 day return" → 30).
"warranty_duration_months": integer or null — warranty length in months if stated.

Use null only where specified. Use empty string "" for missing text dates. If multiple items, describe the primary purchase in name.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 600,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: dataUrl, detail: 'high' },
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return {
      ok: false,
      error: `Could not read receipt (${res.status}). ${errText.slice(0, 200)}`,
    };
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    return { ok: false, error: 'No response from receipt reader.' };
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { ok: false, error: 'Receipt reader returned invalid data. Try another photo.' };
  }

  const fields = normalizeParsedReceipt(parsed);
  if (!fields.name.trim()) {
    return { ok: false, error: 'Could not detect an item name on this receipt.' };
  }

  return { ok: true, fields };
}

export { EMPTY_FIELDS };
