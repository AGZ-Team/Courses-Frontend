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
      className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#6d61ff] via-[#5d4bff] to-[#4a3fff] text-white shadow-[0_18px_35px_rgba(76,57,255,0.35)] transition hover:scale-105 focus-visible:outline focus-visible:outline-2 cursor-pointer focus-visible:outline-offset-2 focus-visible:outline-[#6d61ff]"
      aria-label="Scroll to top"
    >
      <LuArrowUp className="h-5 w-5" />
    </button>
  );
};

export default ArrowBtn;
