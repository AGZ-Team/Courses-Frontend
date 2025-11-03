"use client";

import { useTranslations } from 'next-intl';

export type FilterOption = {
  id?: string;
  labelKey: string;
  count?: number;
  type?: 'checkbox' | 'radio';
  isActive?: boolean;
};

type FilterListProps = {
  options: FilterOption[];
  onOptionToggle: (optionIndex: number) => void;
  filterKey?: string;
};

export function FilterList({ options, onOptionToggle, filterKey }: FilterListProps) {
  const t = useTranslations('coursesPage.filters');

  const getTranslatedLabel = (labelKey: string) => {
    if (!filterKey) return labelKey;

    try {
      const translationKey = `${filterKey}.options.${labelKey}`;
      const translated = t(translationKey);
      // If translation returns the key itself, return original labelKey
      return translated === translationKey ? labelKey : translated;
    } catch {
      return labelKey;
    }
  };

  return (
    <ul className="space-y-3">
      {options.map((option, index) => (
        <li key={option.id ?? option.labelKey}>
          <button
            type="button"
            onClick={() => onOptionToggle(index)}
            className="flex w-full items-center justify-between gap-3 rounded-[10px] px-2 py-1.5 text-left transition hover:bg-[#f4f3ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7c5cff] focus-visible:ring-offset-2"
            aria-pressed={Boolean(option.isActive)}
          >
            <span className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-[18px] w-[18px] items-center justify-center border ${
                  option.type === 'radio' ? 'rounded-full' : 'rounded-md'
                } ${
                  option.isActive
                    ? 'border-[#6440fb] bg-[#6440fb] text-white'
                    : 'border-[#c9c7e6] bg-white text-transparent'
                }`}
              >
                {option.type === 'radio' ? (
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="currentColor"
                    className="rounded-full"
                  >
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                ) : (
                  <svg
                    width="10"
                    height="8"
                    viewBox="0 0 10 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="1 4 3.5 6.5 9 1" />
                  </svg>
                )}
              </span>
              <span>{getTranslatedLabel(option.labelKey)}</span>
            </span>
            {typeof option.count === 'number' ? (
              <span className="text-xs font-medium text-[#8e8aa9]">({option.count})</span>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );
}
