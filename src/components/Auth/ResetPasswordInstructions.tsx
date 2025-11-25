'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

interface ResetPasswordInstructionsProps {
  locale: string;
}

export default function ResetPasswordInstructions({
  locale,
}: ResetPasswordInstructionsProps) {
  const t = useTranslations('resetPassword');
  const isAr = locale === 'ar';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const response = await fetch(
        `${API_BASE_URL}/auth/users/reset_password/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      // Handle both JSON and non-JSON responses
      let data = {};
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (e) {
          console.error('Failed to parse JSON response:', e);
        }
      }

      if (!response.ok) {
        let errorMsg = isAr ? 'فشل إرسال رابط إعادة تعيين كلمة المرور' : 'Failed to send reset link';
        if (typeof data === 'object' && data !== null) {
          if ('detail' in data && typeof data.detail === 'string') errorMsg = data.detail;
          else if ('message' in data && typeof data.message === 'string') errorMsg = data.message;
        }
        throw new Error(errorMsg);
      }

      setSuccess(true);
      setEmail('');

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 
        (isAr ? 'حدث خطأ. يرجى المحاولة مرة أخرى' : 'An error occurred. Please try again');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-primary/10 p-4">
        <p className="text-sm font-medium text-primary">
          {isAr
            ? 'أدخل بريدك الإلكتروني لتلقي رابط إعادة تعيين كلمة المرور'
            : 'Enter your email to receive a password reset link'}
        </p>
      </div>

      <div className="rounded-2xl bg-primary/8 p-4">
        <p className="text-sm text-slate-700">
          {isAr
            ? 'سيتم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني'
            : 'A reset link will be sent to your email'}
        </p>
      </div>

      {success && (
        <div className="flex items-start gap-3 rounded-2xl bg-primary/10 p-4">
          <CheckCircle className="h-5 w-5 shrink-0 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-primary">
              {isAr
                ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
                : 'Password reset link sent to your email'}
            </p>
            <p className="text-xs text-primary/80 mt-2">
              {isAr
                ? 'تحقق من بريدك الإلكتروني وانقر على الرابط'
                : 'Check your email and click the link'}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {isAr ? 'البريد الإلكتروني' : 'Email Address'}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isAr ? 'البريد الإلكتروني' : 'Enter your email'}
            className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-primary focus:ring-2 focus:ring-primary/40"
            dir={isAr ? 'rtl' : 'ltr'}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-center text-[15px] font-semibold text-white shadow-sm transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              {isAr ? 'جارٍ الإرسال...' : 'Sending...'}
            </>
          ) : (
            (isAr ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link')
          )}
        </button>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm font-medium text-primary hover:text-primary/80"
        >
          {isAr ? 'العودة إلى تسجيل الدخول' : 'Back to Login'}
        </Link>
      </div>
    </div>
  );
}
