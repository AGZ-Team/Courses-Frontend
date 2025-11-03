'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface VerifyEmailFormProps {
  locale: string;
}

export default function VerifyEmailForm({
  locale,
}: VerifyEmailFormProps) {
  const t = useTranslations('verifyEmail');
  const router = useRouter();
  const isAr = locale === 'ar';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Call our secure API route instead of Djoser directly
        // The API route will read uid/token from the secure HttpOnly cookie
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in the request
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || t('error'));
        }

        setSuccess(true);

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : t('error');
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [t, router]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3 rounded-lg bg-blue-50 p-6">
          <Loader className="h-5 w-5 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-blue-900">{t('verifying')}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4">
          <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900">{t('success')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#00FF91] px-4 py-3 text-center text-[15px] font-semibold text-black shadow-sm transition hover:brightness-95 focus-visible:outline-none"
        >
          {t('resendEmail')}
        </button>
      </div>
    );
  }

  return null;
}
