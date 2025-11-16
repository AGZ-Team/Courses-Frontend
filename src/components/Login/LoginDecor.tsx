'use client';

import Image from 'next/image';
import React, {useEffect, useRef} from 'react';

type Props = {
  /** Which side of the screen to pin the icons on */
  side?: 'left' | 'right';
  /** Locale to use for swapping artwork */
  locale?: string;
};

/**
 * Decorative floating icons with pointer parallax.
 * No interactivity; pointer-events disabled.
 */
export default function LoginDecor({side = 'right', locale = 'en'}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0..1
      const y = (e.clientY - rect.top) / rect.height; // 0..1
      targetX = (x - 0.5) * 2; // -1..1
      targetY = (y - 0.5) * 2; // -1..1
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const apply = () => {
      raf = 0;
      el.style.setProperty('--parallax-x', String(targetX));
      el.style.setProperty('--parallax-y', String(targetY));
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Anchor helpers to mirror layout when side switches
  const outerEdge = side === 'right' ? 'right-[8%]' : 'left-[8%]'; // near panel outer edge
  const innerEdge = side === 'right' ? 'left-[12%]' : 'right-[12%]'; // near panel inner edge
  const centerImageSrc = locale === 'ar' ? '/login/LoginAR.png' : '/login/LoginEN.png';

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      {/* top small avatar (outer edge) */}
      <Image
        src="/login/4.png"
        alt=""
        width={500}
        height={500}
        className={`absolute ${outerEdge} top-[18%] w-24 md:w-58 translate-x-[calc(var(--parallax-x,0)*6px)] translate-y-[calc(var(--parallax-y,0)*6px)] animate-float-slower`}
      />

      {/* big center avatar (exact middle) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-full h-full flex items-center justify-center">
        <Image
          src={centerImageSrc}
          alt=""
          width={1200}
          height={700}
          className="w-[85%] h-auto translate-x-[calc(var(--parallax-x,0)*4px)] translate-y-[calc(var(--parallax-y,0)*4px)] animate-float-slower"
        />
      </div>

      {/* bottom small avatar (inner edge) */}
      <Image
        src="/login/2.png"
        alt=""
        width={500}
        height={500}
        className={`absolute bg-[#09c5bf] rounded-full ${innerEdge} bottom-[12%] w-24 md:w-32 translate-x-[calc(var(--parallax-x,0)*8px)] translate-y-[calc(var(--parallax-y,0)*8px)] animate-float-slower`}
      />
    </div>
  );
}
