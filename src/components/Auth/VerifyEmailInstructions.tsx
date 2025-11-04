'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface VerifyEmailInstructionsProps {
  locale: string;
}

export default function VerifyEmailInstructions({
  locale,
}: VerifyEmailInstructionsProps) {
  const t = useTranslations('verifyEmail');
  const isAr = locale === 'ar';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError(
        isAr
          ? 'يرجى إدخال بريدك الإلكتروني'
          : 'Please enter your email address'
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || data.message || data.detail || t('error');
        throw new Error(errorMsg);
      }

      setSuccess(true);
      setEmail('');

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t('error');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-900">
          {isAr
            ? 'تحقق من بريدك الإلكتروني وانقر على رابط التحقق'
            : 'Check your email and click the verification link'}
        </p>
      </div>

      <div className="rounded-lg bg-green-50 p-4">
        <p className="text-sm text-green-900">
          {isAr
            ? 'سيتم إعادة توجيهك تلقائياً بعد التحقق من البريد الإلكتروني'
            : 'You will be automatically redirected after email verification'}
        </p>
      </div>

      <Link
        href="/login"
        className="inline-flex w-full items-center justify-center rounded-xl bg-[#00FF91] px-4 py-3 text-center text-[15px] font-semibold text-black shadow-sm transition hover:brightness-95 focus-visible:outline-none"
      >
        {isAr ? 'العودة إلى تسجيل الدخول' : 'Back to Login'}
      </Link>

      {/* Resend Section */}
      <div className="border-t pt-5">
        <p className="text-sm text-gray-600 mb-4">
          {isAr
            ? 'لم تستقبل البريد الإلكتروني؟'
            : "Didn't receive the email?"}
        </p>

        {success && (
          <div className="mb-4 flex items-start gap-3 rounded-lg bg-green-50 p-4">
            <CheckCircle className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">
                {isAr
                  ? 'تم إرسال رابط التحقق إلى بريدك الإلكتروني'
                  : 'Verification link sent to your email'}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-lg bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">{error}</p>
            </div>
          </div>
        )}

        <form className="space-y-3" onSubmit={handleResend}>
          <div>
            <label
              htmlFor="resendEmail"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {isAr ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input
              id="resendEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isAr ? 'البريد الإلكتروني' : 'Enter your email'}
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500"
              dir={isAr ? 'rtl' : 'ltr'}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl border border-indigo-600 bg-white px-4 py-3 text-center text-[15px] font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                {isAr ? 'جارٍ الإرسال...' : 'Sending...'}
              </>
            ) : (
              (isAr ? 'إرسال رابط التحقق مرة أخرى' : 'Resend Verification Link')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
