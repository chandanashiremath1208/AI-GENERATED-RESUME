import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Onboarding from '@/components/Onboarding';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return <Onboarding />;
}
