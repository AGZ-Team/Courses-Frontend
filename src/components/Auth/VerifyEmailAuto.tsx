'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface VerifyEmailAutoProps {
  locale: string;
  uid: string;
  token: string;
}

export default function VerifyEmailAuto({
  locale,
  uid,
  token,
}: VerifyEmailAutoProps) {
  const t = useTranslations('verifyEmail');
  const router = useRouter();
  const isAr = locale === 'ar';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (typeof window === 'undefined') return;

        // Call verification endpoint with uid and token from URL
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid,
            token,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMsg = data.message || data.detail || t('error');
          throw new Error(errorMsg);
        }

        setSuccess(true);

        // Mark email as verified in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('email_verified', 'true');
        }

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : t('error');
        setError(errorMessage);
        setLoading(false);
      }
    };

    verifyEmail();
  }, [uid, token, t, router]);

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
          <CheckCircle className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900">
              {isAr
                ? 'تم التحقق من بريدك الإلكتروني بنجاح'
                : 'Email verified successfully'}
            </p>
            <p className="text-xs text-green-700 mt-2">
              {isAr
                ? 'جارٍ إعادة التوجيه إلى صفحة تسجيل الدخول...'
                : 'Redirecting to login page...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#00FF91] px-4 py-3 text-center text-[15px] font-semibold text-black shadow-sm transition hover:brightness-95 focus-visible:outline-none"
        >
          {isAr ? 'حاول مرة أخرى' : 'Try Again'}
        </button>
      </div>
    );
  }

  return null;
}
