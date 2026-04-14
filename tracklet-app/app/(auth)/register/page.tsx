'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { register, type AuthActionState } from '@/app/actions/auth';

const initialState: AuthActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
    >
      {pending ? 'Creating account...' : 'Create Account'}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(register, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md p-8 glass rounded-3xl shadow-2xl border border-white/30">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Get Started
          </h1>
          <p className="text-gray-600 text-sm">Create your account</p>
        </div>
        
        {state.error && (
          <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-700 rounded-xl">
            <p className="text-sm font-medium">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                className="w-full text-gray-600 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/70 transition-all"
                placeholder="John"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                className="w-full text-gray-600 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/70 transition-all"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="w-full text-gray-600 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/70 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full text-gray-600 px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/70 transition-all"
              placeholder="At least 6 characters"
            />
          </div>

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-purple-600 hover:text-pink-600 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}