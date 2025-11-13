"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";

const CARD_WIDTH = 320;
const SCROLL_STEP = CARD_WIDTH + 20;

interface CreatorsCarouselProps {
  activeCategory: string;
}

function CreatorsCarouselComponent({ activeCategory }: CreatorsCarouselProps) {
  const t = useTranslations("instructorCarousel");
  const locale = useLocale();
  const isAr = locale === "ar";
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const instructorsRaw = t.raw("instructors");
  const instructors = Array.isArray(instructorsRaw)
    ? (instructorsRaw as Array<{ name: string; role: string }>)
    : [];

  const CATEGORY_KEYS = [
    "design",
    "marketing",
    "development",
    "photography",
    "art",
    "animation",
    "writing",
  ] as const;

  const items = useMemo(() => {
    const TOTAL = 8;
    const base = instructors.length > 0 ? instructors : [{ name: '', role: '' }];
    return Array.from({ length: TOTAL }, (_, i) => {
      const src = base[i % base.length];
      const categoryKey = CATEGORY_KEYS[i % CATEGORY_KEYS.length];
      return {
        id: i + 1,
        name: src.name,
        role: src.role,
        image: `/instructors/${i + 1}.png`,
        category: categoryKey,
      };
    });
  }, [instructors]);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((it) => it.category === activeCategory);
  }, [items, activeCategory]);

  const syncScrollState = useCallback(() => {
    const node = trackRef.current;
    if (!node) return;
    const { scrollLeft, scrollWidth, clientWidth } = node;
    const tolerance = 4;
    setCanScrollPrev(scrollLeft > tolerance);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - tolerance);
  }, []);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;
    syncScrollState();
    const handle = () => syncScrollState();
    node.addEventListener("scroll", handle, { passive: true });
    return () => node.removeEventListener("scroll", handle);
  }, [syncScrollState]);

  const handleScroll = (direction: "prev" | "next") => {
    const node = trackRef.current;
    if (!node) return;
    const delta = direction === "next" ? SCROLL_STEP : -SCROLL_STEP;
    const adjustedDelta = isAr ? -delta : delta;
    node.scrollTo({ left: node.scrollLeft + adjustedDelta, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-white py-1">
      <div className="mx-auto flex w-full max-w-[1380px] flex-col items-center px-4 text-center sm:px-6">
        <div className="relative w-full">
          <div
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth py-4 px-4"
            dir="ltr"
            aria-label={t("title")}
          >
            {filteredItems.map((item, index) => (
              <article
                key={item.id}
                className="group relative snap-always snap-center shrink-0"
                style={{ width: CARD_WIDTH }}
                data-aos="fade-left"
                data-aos-duration="600"
                data-aos-delay={index * 120}
              >
                <div className="relative overflow-hidden rounded-[18px] bg-[#f3eefc]">
                  <div className="relative aspect-[.99] w-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="320px"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      priority={index === 0}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[#0ABAB5cc] opacity-0 transition duration-300 group-hover:opacity-100" />
                  </div>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-[18px] font-semibold text-[#131022] transition duration-300 group-hover:text-[#0ABAB5]">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-[14px] text-[#6b6a82] transition duration-300 group-hover:text-[#0ABAB5]">
                    {item.role}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
            <button
              type="button"
              onClick={() => handleScroll("prev")}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#d5d6e6] bg-white text-[#0ABAB5] shadow-[0_12px_24px_rgba(45,27,153,0.08)] transition hover:border-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e6f3] disabled:bg-white disabled:text-[#b3b8d2]"
              aria-label={t("aria.prev", { defaultValue: "Previous" })}
              disabled={!canScrollPrev}
            >
              <svg
                width="16"
                height="13"
                viewBox="0 0 16 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.5 12.5L0 6.5L5.5 0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0.75 6.5H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => handleScroll("next")}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-[#d5d6e6] bg-white text-[#0ABAB5] shadow-[0_12px_24px_rgba(45,27,153,0.08)] transition hover:border-[#0ABAB5] hover:bg-[#0ABAB5] hover:text-white disabled:cursor-not-allowed disabled:border-[#e5e6f3] disabled:bg-white disabled:text-[#b3b8d2]"
              aria-label={t("aria.next", { defaultValue: "Next" })}
              disabled={!canScrollNext}
            >
              <svg
                width="16"
                height="13"
                viewBox="0 0 16 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.5 0.5L16 6.5L10.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.25 6.5H0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(CreatorsCarouselComponent);
