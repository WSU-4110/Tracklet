import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.hoisted runs before the hoisted vi.mock factories
const {
  mockSignInWithPassword,
  mockSignUp,
  mockSignOut,
  mockRevalidatePath,
  mockRedirect,
} = vi.hoisted(() => ({
  mockSignInWithPassword: vi.fn(),
  mockSignUp: vi.fn(),
  mockSignOut: vi.fn(),
  mockRevalidatePath: vi.fn(),
  mockRedirect: vi.fn(),
}));

// isolate the unit under test from Next.js and Supabase internals


vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signOut: mockSignOut,
    },
  })),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    get: vi.fn(),
    set: vi.fn(),
  })),
}));

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

import { login, register, signOut } from '@/app/actions/auth';

// Utility to build FormData for tests
function buildFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.set(key, value);
  }
  return fd;
}

// login

describe('login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns an error when email is missing', async () => {
    const formData = buildFormData({ password: 'secret123' });

    const result = await login({}, formData);

    expect(result).toEqual({ error: 'Email and password are required.' });
    expect(mockSignInWithPassword).not.toHaveBeenCalled();
  });

  it('returns an error when password is missing', async () => {
    const formData = buildFormData({ email: 'user@example.com' });

    const result = await login({}, formData);

    expect(result).toEqual({ error: 'Email and password are required.' });
    expect(mockSignInWithPassword).not.toHaveBeenCalled();
  });

  it('returns an error when both email and password are missing', async () => {
    const formData = buildFormData({});

    const result = await login({}, formData);

    expect(result).toEqual({ error: 'Email and password are required.' });
  });

  it('returns the Supabase error when sign-in fails', async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: { message: 'Invalid login credentials' },
    });

    const formData = buildFormData({
      email: 'user@example.com',
      password: 'wrongpassword',
    });

    const result = await login({}, formData);

    expect(result).toEqual({ error: 'Invalid login credentials' });
    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'wrongpassword',
    });
  });

  it('redirects to /dashboard on successful login', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });

    const formData = buildFormData({
      email: 'user@example.com',
      password: 'correct-password',
    });

    await login({}, formData);

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'correct-password',
    });
    expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
  });
});

// register

describe('register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns an error when email is missing', async () => {
    const formData = buildFormData({ password: 'secret123' });

    const result = await register({}, formData);

    expect(result).toEqual({ error: 'Email and password are required.' });
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('returns an error when password is missing', async () => {
    const formData = buildFormData({ email: 'new@example.com' });

    const result = await register({}, formData);

    expect(result).toEqual({ error: 'Email and password are required.' });
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it('returns the Supabase error when sign-up fails', async () => {
    mockSignUp.mockResolvedValue({
      error: { message: 'Email already registered' },
    });

    const formData = buildFormData({
      email: 'taken@example.com',
      password: 'password123',
    });

    const result = await register({}, formData);

    expect(result).toEqual({ error: 'Email already registered' });
  });

  it('redirects to /dashboard on successful registration', async () => {
    mockSignUp.mockResolvedValue({ error: null });

    const formData = buildFormData({
      email: 'new@example.com',
      password: 'strongpassword',
      firstName: 'Yousef',
      lastName: 'Eltobji',
    });

    await register({}, formData);

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'new@example.com',
      password: 'strongpassword',
      options: {
        data: {
          first_name: 'Yousef',
          last_name: 'Eltobji',
        },
      },
    });
    expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
  });

  it('passes undefined for optional name fields when omitted', async () => {
    mockSignUp.mockResolvedValue({ error: null });

    const formData = buildFormData({
      email: 'minimal@example.com',
      password: 'password123',
    });

    await register({}, formData);

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'minimal@example.com',
      password: 'password123',
      options: {
        data: {
          first_name: undefined,
          last_name: undefined,
        },
      },
    });
    expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
  });
});


// signOut

describe('signOut', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('signs out and revalidates the root path on success', async () => {
    mockSignOut.mockResolvedValue({ error: null });

    await signOut();

    expect(mockSignOut).toHaveBeenCalled();
    expect(mockRevalidatePath).toHaveBeenCalledWith('/');
  });

  it('throws the Supabase error when sign-out fails', async () => {
    const supabaseError = new Error('Network error');
    mockSignOut.mockResolvedValue({ error: supabaseError });

    await expect(signOut()).rejects.toThrow('Network error');
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});
