'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ProfileInfo from '@/components/dashboard/ProfileInfo';
import RegisteredEvents from '@/components/dashboard/RegisteredEvents';
import MembershipStatus from '@/components/dashboard/MembershipStatus';
import Loader from '@/components/ui/Loader';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) return <Loader />;
  if (!user) return null;

  return (
    <div className="container-narrow py-24">
      <h1 className="text-4xl font-serif mb-8">{t('dashboard')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProfileInfo user={user} />
          <RegisteredEvents />
        </div>
        <div>
          <MembershipStatus profile={user} />
        </div>
      </div>
    </div>
  );
}