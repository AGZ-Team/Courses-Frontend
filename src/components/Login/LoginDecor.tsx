'use client';

import React, {useEffect, useRef} from 'react';

type Props = {
  /** Which side of the screen to pin the icons on */
  side?: 'left' | 'right';
};

/**
 * Decorative floating icons with pointer parallax.
 * No interactivity; pointer-events disabled.
 */
export default function LoginDecor({side = 'right'}: Props) {
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

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      {/* top small avatar (outer edge) */}
      <img
        src="/assets/2.png"
        alt=""
        className={`absolute ${outerEdge} top-[18%] w-24 md:w-28 translate-x-[calc(var(--parallax-x,0)*6px)] translate-y-[calc(var(--parallax-y,0)*6px)] animate-float-slower`}
      />

      {/* big center avatar (exact middle) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <img
          src="/assets/1.png"
          alt=""
          className="w-[360px] md:w-[420px] lg:w-[460px] translate-x-[calc(var(--parallax-x,0)*4px)] translate-y-[calc(var(--parallax-y,0)*4px)] animate-float-slower"
        />
      </div>

      {/* bottom small avatar (inner edge) */}
      <img
        src="/assets/3.png"
        alt=""
        className={`absolute ${innerEdge} bottom-[12%] w-24 md:w-28 translate-x-[calc(var(--parallax-x,0)*8px)] translate-y-[calc(var(--parallax-y,0)*8px)] animate-float-slower`}
      />
    </div>
  );
}
