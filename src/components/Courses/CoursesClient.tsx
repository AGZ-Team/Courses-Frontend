"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { LuFilter } from 'react-icons/lu';
import { FilterSection } from './FilterSection';
import { FilterList, FilterOption } from './FilterList';
import { RatingList, RatingFilter } from './RatingList';
import { CourseCardItem, CourseCard } from './CourseCard';
import { Pagination } from './Pagination';
import { SortDropdown } from './SortDropdown';

export type FilterGroup = {
  title: string;
  options: FilterOption[];
  footerLabel?: string;
  isExpanded?: boolean;
};

type CoursesClientProps = {
  courses: CourseCard[];
  filterGroups: FilterGroup[];
  ratingFilters: RatingFilter[];
  sortOptions: string[];
};

export function CoursesClient({
  courses,
  filterGroups: initialFilterGroups,
  ratingFilters,
  sortOptions
}: CoursesClientProps) {
  const t = useTranslations('coursesPage');
  
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>(() =>
    initialFilterGroups.map((group) => ({
      ...group,
      isExpanded: true,
      options: group.options.map((option, index) => ({
        ...option,
        id: `${group.title}-${index}`
      }))
    }))
  );
  
  const [isRatingsExpanded, setIsRatingsExpanded] = useState(true);
  const [gridColumns, setGridColumns] = useState(1);
  const [hoveredCourseId, setHoveredCourseId] = useState<number | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setGridColumns(3);
      } else if (width >= 640) {
        setGridColumns(2);
      } else {
        setGridColumns(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = (groupIndex: number, optionIndex: number) => {
    setFilterGroups((prev) =>
      prev.map((group, gIdx) => {
        if (gIdx !== groupIndex) {
          return group;
        }

        const clickedOption = group.options[optionIndex];
        if (!clickedOption) {
          return group;
        }

        if (clickedOption.type === 'radio') {
          const updatedRadioOptions = group.options.map((option, oIdx) => ({
            ...option,
            isActive: oIdx === optionIndex
          }));
          return { ...group, options: updatedRadioOptions };
        }

        let updatedOptions = group.options.map((option, oIdx) => {
          if (oIdx === optionIndex) {
            const nextActive = !Boolean(option.isActive);
            return { ...option, isActive: nextActive };
          }
          return option;
        });

        if (updatedOptions.length > 0) {
          if (optionIndex === 0) {
            if (updatedOptions[0]?.isActive) {
              updatedOptions = updatedOptions.map((option, idx) =>
                idx === 0 ? option : { ...option, isActive: false }
              );
            }
          } else {
            const selectedNonAllCount = updatedOptions.filter(
              (option, idx) => idx !== 0 && option.isActive
            ).length;
            updatedOptions[0] = {
              ...updatedOptions[0],
              isActive: selectedNonAllCount === 0
            };
          }
        }

        return { ...group, options: updatedOptions };
      })
    );
  };

  const handleSectionToggle = (groupIndex: number) => {
    setFilterGroups((prev) =>
      prev.map((group, idx) => {
        if (idx !== groupIndex) {
          return group;
        }
        return { ...group, isExpanded: !group.isExpanded };
      })
    );
  };

  const [primaryGroup, ...additionalGroups] = filterGroups;

  return (
    <section className="mx-auto mt-16 w-full max-w-[1480px] px-4 sm:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-[#6e6b8f]">
          {t('summary.showing')} <span className="text-[#120a5d]">43</span>{' '}
          {t('summary.totalResults')}
        </p>

        <div className="flex w-full items-center gap-3 text-sm text-[#433f74] md:w-auto">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#d9d7f0] bg-white px-4 font-semibold text-[#433f74] shadow-[0_12px_30px_rgba(12,10,78,0.08)] transition hover:border-primary lg:hidden"
          >
            <LuFilter size={18} />
            {t('filters.filterButton')}
          </button>

          <span className="hidden font-medium md:inline">{t('summary.sortBy')}</span>
          <SortDropdown options={sortOptions} className="flex-1 md:w-48" />
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute inset-y-0 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out ltr:right-0 rtl:left-0">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-[#e6e4f5] px-6 py-5">
                <h2 className="text-lg font-bold text-[#120a5d]">{t('filters.title')}</h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#433f74] transition hover:bg-primary/10 hover:text-primary"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
                {primaryGroup ? (
                  <FilterSection
                    key={primaryGroup.title}
                    title={t(`filters.${primaryGroup.title.toLowerCase()}.title`)}
                    footerLabel={primaryGroup.footerLabel}
                  >
                    <FilterList
                      options={primaryGroup.options}
                      onOptionToggle={(optionIndex) => handleToggle(0, optionIndex)}
                      filterKey={primaryGroup.title.toLowerCase()}
                    />
                  </FilterSection>
                ) : null}

                <FilterSection
                  title={t('filters.ratings.title')}
                  isCollapsible
                  isOpen={isRatingsExpanded}
                  onToggle={() => setIsRatingsExpanded((prev) => !prev)}
                >
                  <RatingList ratings={ratingFilters} />
                </FilterSection>

                {additionalGroups.map((group, groupIndex) => (
                  <FilterSection
                    key={group.title}
                    title={t(`filters.${group.title.toLowerCase()}.title`)}
                    footerLabel={group.footerLabel}
                    isCollapsible
                    isOpen={group.isExpanded}
                    onToggle={() => handleSectionToggle(groupIndex + 1)}
                  >
                    <FilterList
                      options={group.options}
                      onOptionToggle={(optionIndex) => handleToggle(groupIndex + 1, optionIndex)}
                      filterKey={group.title.toLowerCase()}
                    />
                  </FilterSection>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,300px)_1fr]">
        <aside className="hidden space-y-6 lg:block">
          {primaryGroup ? (
            <FilterSection
              key={primaryGroup.title}
              title={t(`filters.${primaryGroup.title.toLowerCase()}.title`)}
              footerLabel={primaryGroup.footerLabel}
            >
              <FilterList
                options={primaryGroup.options}
                onOptionToggle={(optionIndex) => handleToggle(0, optionIndex)}
                filterKey={primaryGroup.title.toLowerCase()}
              />
            </FilterSection>
          ) : null}

          <FilterSection
            title={t('filters.ratings.title')}
            isCollapsible
            isOpen={isRatingsExpanded}
            onToggle={() => setIsRatingsExpanded((prev) => !prev)}
          >
            <RatingList ratings={ratingFilters} />
          </FilterSection>

          {additionalGroups.map((group, groupIndex) => (
            <FilterSection
              key={group.title}
              title={t(`filters.${group.title.toLowerCase()}.title`)}
              footerLabel={group.footerLabel}
              isCollapsible
              isOpen={group.isExpanded}
              onToggle={() => handleSectionToggle(groupIndex + 1)}
            >
              <FilterList
                options={group.options}
                onOptionToggle={(optionIndex) => handleToggle(groupIndex + 1, optionIndex)}
                filterKey={group.title.toLowerCase()}
              />
            </FilterSection>
          ))}
        </aside>

        <div className="space-y-10">
          <div className="grid auto-rows-[1fr] items-start gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
            {courses.map((course, index) => (
              <CourseCardItem
                key={course.id}
                course={course}
                index={index}
                columns={gridColumns}
                hoveredCourseId={hoveredCourseId}
                onHoverChange={setHoveredCourseId}
              />
            ))}
          </div>

          <Pagination />
        </div>
      </div>
    </section>
  );
}
