'use client';

import {usePathname} from 'next/navigation';
import MainNavbar from '@/components/Navbar/MainNavbar';

const ConditionalNavbar = () => {
  const pathname = usePathname();
  
  // Hide navbar on dashboard pages
  const hideNavbar = pathname?.includes('/dashboard');
  
  if (hideNavbar) {
    return null;
  }
  
  return <MainNavbar />;
};

export default ConditionalNavbar;
