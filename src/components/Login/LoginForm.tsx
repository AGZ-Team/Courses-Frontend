'use client';

import React, {useState} from 'react';
import {Link} from '@/i18n/routing';
import {FaFacebook, FaGooglePlusG} from 'react-icons/fa';
import {login} from '@/lib/auth';
import {useRouter} from 'next/navigation';

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

export default function LoginForm({isAr, translations: t}: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({
        username: formData.username,
        password: formData.password,
      });

      // Redirect to home page or dashboard after successful login
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
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

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
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
          <div className="relative">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500"
              placeholder={isAr ? 'الاسم' : 'Username'}
              dir={isAr ? 'rtl' : 'ltr'}
              disabled={loading}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {t.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500"
            placeholder="••••••••"
            dir={isAr ? 'rtl' : 'ltr'}
            disabled={loading}
          />
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

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-xs uppercase tracking-wide text-gray-400">
              {t.orUsing}
            </span>
          </div>
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#2563EB] bg-white px-4 py-2.5 text-sm font-medium text-[#2563EB] transition hover:bg-blue-50"
          >
            <FaFacebook className="text-3xl" />
            {t.facebook}
          </button>
          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#EF4444] bg-white px-4 py-2.5 text-sm font-medium text-[#EF4444] transition hover:bg-red-50"
          >
            <FaGooglePlusG className="text-3xl" />
            {t.google}
          </button>
        </div>
      </form>
    </div>
  );
}
