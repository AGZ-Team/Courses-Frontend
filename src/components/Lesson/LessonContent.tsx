import { CheckCircle, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LessonContentProps {
  description: string;
  additionalDescription?: string;
  whatYouLearn: string[];
  requirements: string[];
}

export function LessonContent({ 
  description, 
  additionalDescription,
  whatYouLearn,
  requirements 
}: LessonContentProps) {
  const t = useTranslations('lessonPage');

  return (
    <div className="space-y-8">
      {/* Description Section */}
      <div className="p-6 bg-white rounded-xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">{t('description.title')}</h3>
        <p className="text-slate-600 leading-relaxed mb-4">{description}</p>
        {additionalDescription && (
          <p className="text-slate-600 leading-relaxed">{additionalDescription}</p>
        )}
      </div>

      {/* What you'll learn */}
      <div className="p-6 bg-white rounded-xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">{t('whatYouLearn.title')}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {whatYouLearn.map((item: string, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-300">
                <CheckCircle className="h-3.5 w-3.5 text-slate-600" />
              </span>
              <span className="text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="p-6 bg-white rounded-xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">{t('requirements.title')}</h3>
        <ul className="space-y-3">
          {requirements.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-3 text-slate-700">
              <span className="mt-1 text-primary">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Reviews */}
      <div className="p-6 bg-white rounded-xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6">{t('reviews.title')}</h3>
        {[1, 2].map((r) => (
          <div key={r} className="border-b border-slate-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-700">
                A.T
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">{t('reviews.reviewerName')}</h4>
                    <p className="text-sm text-slate-500">3 {t('reviews.daysAgo')}</p>
                  </div>
                  <div className="flex gap-1 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <h5 className="font-medium text-slate-900 mt-3">{t('reviews.reviewTitle')}</h5>
                <p className="text-slate-600 mt-2">{t('reviews.reviewText')}</p>
                <div className="flex gap-2 mt-4 items-center">
                  <span className="text-sm text-primary">{t('reviews.wasHelpful')}</span>
                  <button className="px-3 py-1 rounded bg-primary text-white text-sm hover:bg-primary/90">
                    {t('reviews.yes')}
                  </button>
                  <button className="px-3 py-1 rounded bg-slate-200 text-slate-700 text-sm hover:bg-slate-300">
                    {t('reviews.no')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write a Review */}
      <div className="p-6 bg-white rounded-xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6">{t('writeReview.title')}</h3>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              {t('writeReview.reviewTitle')}
            </label>
            <input
              type="text"
              placeholder={t('writeReview.reviewTitlePlaceholder')}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              {t('writeReview.reviewContent')}
            </label>
            <textarea
              rows={6}
              placeholder={t('writeReview.reviewContentPlaceholder')}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-4 rounded-lg border-2 border-primary bg-primary text-white font-semibold hover:bg-transparent hover:text-primary transition-colors hover:cursor-pointer"
          >
            {t('writeReview.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
