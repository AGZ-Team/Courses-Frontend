'use client';

import {usePathname} from 'next/navigation';
import Footer from '@/components/Footer/Footer';

const ConditionalFooter = () => {
  const pathname = usePathname();
  
  // Hide footer on login, signup, and dashboard pages
  const hideFooter = pathname?.endsWith('/login') || pathname?.endsWith('/signup') || pathname?.includes('/dashboard');
  
  if (hideFooter) {
    return null;
  }
  
  return <Footer />;
};

export default ConditionalFooter;
