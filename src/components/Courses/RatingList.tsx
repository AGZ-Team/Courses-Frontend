"use client";

import { FaStar } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export type RatingFilter = {
  labelKey: string;
  count: number;
  threshold: number;
};

type RatingListProps = {
  ratings: RatingFilter[];
};

function StarRow({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-1 text-[#f6c160]">
      {Array.from({ length: 5 }).map((_, index) => (
        <FaStar
          key={index}
          size={14}
          className={
            index + 1 <= Math.floor(value) ? 'fill-current' : 'fill-[#e0e0f4] text-[#e0e0f4]'
          }
        />
      ))}
    </span>
  );
}

export function RatingList({ ratings }: RatingListProps) {
  const t = useTranslations('coursesPage');
  return (
    <ul className="space-y-3">
      <li className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <StarRow value={5} />
          {t('filters.ratings.all')}
        </div>
        <span className="text-xs font-medium text-[#8e8aa9]">(43)</span>
      </li>
      {ratings.map((rating) => (
        <li key={rating.labelKey} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <StarRow value={rating.threshold} />
            {t(`filters.ratings.${rating.labelKey}`)}
          </div>
          <span className="text-xs font-medium text-[#8e8aa9]">({rating.count})</span>
        </li>
      ))}
    </ul>
  );
}
