'use client';

import React, {useState} from 'react';
import {Link} from '@/i18n/routing';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';
import {login} from '@/lib/auth';
import {useRouter} from 'next/navigation';
import {parseLoginErrors, getUserFriendlyErrorMessage} from '@/lib/errorMessages';

type Translations = {
  title: string;
  subtitlePrefix: string;
  signupCta: string;
  usernameOrEmail: string;
  password: string;
  rememberMe: string;
  forgotPassword: string;
  submit: string;
  orUsing: string;
  facebook: string;
  google: string;
};

type LoginFormProps = {
  isAr: boolean;
  translations: Translations;
};

type FieldErrors = Record<string, string>;

export default function LoginForm({isAr, translations: t}: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  // Helper function to get field error
  const getFieldError = (fieldName: string): string | null => {
    return fieldErrors[fieldName] || null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    // Frontend validation
    const errors: FieldErrors = {};
    
    if (!formData.username) {
      errors.username = isAr
        ? 'اسم المستخدم أو البريد الإلكتروني مطلوب'
        : 'Username or email is required';
    }

    if (!formData.password) {
      errors.password = isAr
        ? 'كلمة المرور مطلوبة'
        : 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await login({
        username: formData.username,
        password: formData.password,
      });

      // Store remember me preference
      if (formData.rememberMe && typeof window !== 'undefined') {
        localStorage.setItem('rememberMe', formData.username);
      }

      // Redirect to home page or dashboard after successful login
      router.push('/');
    } catch (err) {
      // Parse error and show field-specific or general message
      let errorMessage: string = getUserFriendlyErrorMessage(
        err,
        'login',
        isAr ? 'ar' : 'en'
      );
      
      // Try to extract field-specific errors
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message);
          if (typeof errorData === 'object') {
            const parsed = parseLoginErrors(errorData, isAr ? 'ar' : 'en');
            if (Object.keys(parsed).length > 0) {
              setFieldErrors(parsed);
              return;
            }
          }
        } catch {
          // Not JSON, treat as general error
        }
      }
      
      setGeneralError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, type, checked} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(13,13,18,0.08)] ring-1 ring-black/5 md:p-8"
    >
      <div className={`${isAr ? 'text-right' : ''}`}>
        <h1 className="mb-2 text-[32px] font-bold leading-tight text-[#0b0b2b]">
          {t.title}
        </h1>
        <p className="mb-6 text-[15px] text-gray-500">
          {t.subtitlePrefix}
          <Link
            href="/signup"
            className="ms-2 font-semibold text-indigo-600 hover:text-indigo-500"
          >
            {t.signupCta}
          </Link>
        </p>
      </div>

      {generalError && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {generalError}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Username / Email */}
        <div>
          <label
            htmlFor="username"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {t.usernameOrEmail}
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={formData.username}
            onChange={handleChange}
            className={`block w-full rounded-xl border bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition ${
              getFieldError('username')
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-indigo-500'
            }`}
            placeholder={isAr ? 'الاسم أو البريد الإلكتروني' : 'Username or Email'}
            dir={isAr ? 'rtl' : 'ltr'}
            disabled={loading}
          />
          {getFieldError('username') && (
            <p className="mt-1 text-xs text-red-600">{getFieldError('username')}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {t.password}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`block w-full rounded-xl border bg-white px-4 py-3 pr-10 text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition ${
                getFieldError('password')
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:border-indigo-500'
              }`}
              placeholder="••••••••"
              dir={isAr ? 'rtl' : 'ltr'}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition ${
                isAr ? 'left-3' : 'right-3'
              }`}
              tabIndex={-1}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible className="text-lg" />
              ) : (
                <AiOutlineEye className="text-lg" />
              )}
            </button>
          </div>
          {getFieldError('password') && (
            <p className="mt-1 text-xs text-red-600">{getFieldError('password')}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <label
            className={`flex items-center gap-2 text-sm text-gray-600 ${
              isAr ? 'flex-row-reverse' : ''
            }`}
          >
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 bg-white accent-indigo-600 focus:ring-indigo-500"
              disabled={loading}
            />
            <span>{t.rememberMe}</span>
          </label>
          <Link
            href="/auth/reset-password?uid=test&token=test"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            {t.forgotPassword}
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#00FF91] px-4 py-3 text-center text-[15px] font-semibold text-black shadow-sm transition hover:brightness-95 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (isAr ? 'جارٍ تسجيل الدخول...' : 'Logging in...') : t.submit}
        </button>
      </form>
    </div>
  );
}
