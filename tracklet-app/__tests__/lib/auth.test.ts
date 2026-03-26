import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockFns = vi.hoisted(() => {
  const getUser = vi.fn();
  const createServerClient = vi.fn(() => ({
    auth: { getUser },
  }));
  const cookies = vi.fn();

  return { getUser, createServerClient, cookies };
});

vi.mock('@supabase/ssr', () => ({
  createServerClient: mockFns.createServerClient,
}));

vi.mock('next/headers', () => ({
  cookies: mockFns.cookies,
}));

import { getCurrentUser } from '@/lib/auth';

describe('getCurrentUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key';

    mockFns.cookies.mockResolvedValue({
      get: vi.fn(),
      set: vi.fn(),
    });
  });

  it('returns the authenticated user', async () => {
    const user = { id: 'user-1', email: 'student@example.com' };
    mockFns.getUser.mockResolvedValue({ data: { user } });

    const result = await getCurrentUser();

    expect(result).toEqual(user);
  });

  it('returns null when Supabase user is null', async () => {
    mockFns.getUser.mockResolvedValue({ data: { user: null } });

    const result = await getCurrentUser();

    expect(result).toBeNull();
  });

  it('returns undefined when Supabase user is undefined', async () => {
    mockFns.getUser.mockResolvedValue({ data: { user: undefined } });

    const result = await getCurrentUser();

    expect(result).toBeUndefined();
  });

  it('calls auth.getUser exactly once', async () => {
    mockFns.getUser.mockResolvedValue({ data: { user: null } });

    await getCurrentUser();

    expect(mockFns.getUser).toHaveBeenCalledTimes(1);
  });
});
