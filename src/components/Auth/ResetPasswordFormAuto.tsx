'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

interface ResetPasswordFormAutoProps {
  locale: string;
  uid: string;
  token: string;
}

export default function ResetPasswordFormAuto({
  locale,
  uid,
  token,
}: ResetPasswordFormAutoProps) {
  const t = useTranslations('resetPassword');
  const router = useRouter();
  const isAr = locale === 'ar';

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return t('passwordRequirements');
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validation
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    setLoading(true);

    try {
      // Call backend directly with uid, token, and new password
      const response = await fetch(
        `${API_BASE_URL}/auth/users/reset_password_confirm/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid,
            token,
            new_password: formData.newPassword,
            re_new_password: formData.confirmPassword,
          }),
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
        const errorMsg = 
          (data as any)?.detail || 
          (data as any)?.message || 
          t('error');
        throw new Error(errorMsg);
      }

      setSuccess(true);
      setFormData({ newPassword: '', confirmPassword: '' });

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

  if (success) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4">
          <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900">{t('success')}</p>
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Alert */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        </div>
      )}

      {/* New Password */}
      <div>
        <label
          htmlFor="newPassword"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {t('newPassword')}
        </label>
        <div className="relative">
          <input
            id="newPassword"
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500"
            placeholder={t('newPasswordPlaceholder')}
            dir={isAr ? 'rtl' : 'ltr'}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {t('confirmPassword')}
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500"
            placeholder={t('confirmPasswordPlaceholder')}
            dir={isAr ? 'rtl' : 'ltr'}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-[#00FF91] px-4 py-3 text-center text-[15px] font-semibold text-black shadow-sm transition hover:brightness-95 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader className="h-4 w-4 animate-spin mr-2" />
            {t('submit')}
          </>
        ) : (
          t('submit')
        )}
      </button>
    </form>
  );
}
