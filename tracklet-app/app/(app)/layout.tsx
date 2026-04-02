import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Sidebar from '../components/Sidebar';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const metadata = (user?.user_metadata ?? {}) as {
    first_name?: string;
    last_name?: string;
  };
  const firstName = metadata.first_name || '';
  const lastName = metadata.last_name || '';
  const fullName =
    [firstName, lastName].filter(Boolean).join(' ') || user.email || 'User';
  const displayName = firstName || user.email || 'User';

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <Sidebar displayName={displayName} fullName={fullName} />

      <main className="relative ml-16 px-6 sm:px-10 lg:px-14 py-10 space-y-10">
        {children}
      </main>
    </div>
  );
}
