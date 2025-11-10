'use client';

import {useEffect, useState} from 'react';
import {LuArrowUp} from 'react-icons/lu';

const SCROLL_TRIGGER = 240;

const ArrowBtn = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_TRIGGER);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#c5fcfa] text-[#0ABAB5] shadow-[0_10px_20px_rgba(10,186,181,0.25)] transition hover:scale-105 focus-visible:outline-2 cursor-pointer focus-visible:outline-offset-2 focus-visible:outline-[#0ABAB5]"
      aria-label="Scroll to top"
    >
      <LuArrowUp className="h-5 w-5" />
    </button>
  );
};

export default ArrowBtn;
