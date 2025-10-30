'use client';

import {usePathname} from 'next/navigation';
import Footer from '@/components/Footer';

const ConditionalFooter = () => {
  const pathname = usePathname();
  
  // Hide footer on login and signup pages
  const hideFooter = pathname?.endsWith('/login') || pathname?.endsWith('/signup');
  
  if (hideFooter) {
    return null;
  }
  
  return <Footer />;
};

export default ConditionalFooter;
