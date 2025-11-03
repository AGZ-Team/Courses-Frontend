'use client';

import React, {useState} from 'react';
import {FaFacebook, FaGooglePlusG} from 'react-icons/fa';
import {MdCloudUpload} from 'react-icons/md';
import {Link} from '@/i18n/routing';

type Translations = {
  title: string;
  subtitlePrefix: string;
  loginCta: string;
  studentTab: string;
  instructorTab: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  expertise: string;
  idFront: string;
  idBack: string;
  uploadIdFront: string;
  uploadIdBack: string;
  submit: string;
  orUsing: string;
  facebook: string;
  google: string;
};

type SignupFormProps = {
  isAr: boolean;
  translations: Translations;
};

export default function SignupForm({isAr, translations: t}: SignupFormProps) {
  const [activeTab, setActiveTab] = useState<'student' | 'instructor'>('student');
  const [idFrontFile, setIdFrontFile] = useState<string>('');
  const [idBackFile, setIdBackFile] = useState<string>('');

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'front' | 'back'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'front') {
        setIdFrontFile(file.name);
      } else {
        setIdBackFile(file.name);
      }
    }
  };

  return (
    <div className="w-full max-w-7xl rounded-3xl mb-auto mt-[18vw]  lg:mt-[8vw] mx-auto  bg-white p-6 shadow-[0_10px_40px_rgba(13,13,18,0.08)] ring-1 ring-black/5 md:p-8">
      <div className={`${isAr ? 'text-right' : ''}`}>
        <h1 className="mb-2 text-[26px] font-bold leading-tight text-[#0b0b2b]">
          {t.title}
        </h1>
        <p className="mb-4 text-[14px] text-gray-500">
          {t.subtitlePrefix}
          {/* depends on the language iam on ar or en */}
          <Link
            href="/login"
            className="ms-2 font-semibold text-indigo-600 hover:text-indigo-500"
          >
            {t.loginCta}
          </Link>
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2 rounded-xl bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('student')}
          className={`flex-1 rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
            activeTab === 'student'
              ? 'bg-white text-[#0b0b2b] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t.studentTab}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('instructor')}
          className={`flex-1 rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
            activeTab === 'instructor'
              ? 'bg-white text-[#0b0b2b] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t.instructorTab}
        </button>
      </div>

      <form className="space-y-3.5" action="#" method="post">
        {/* Row 1: Username and Email */}
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {t.username} *
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500"
              placeholder={isAr ? 'اسم المستخدم' : 'Username'}
              dir={isAr ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {t.email} *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500"
              placeholder={isAr ? 'البريد الإلكتروني' : 'Email'}
              dir={isAr ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {/* Row 2: First Name and Last Name */}
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {t.firstName} *
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500"
              placeholder={isAr ? 'الاسم الأول' : 'First Name'}
              dir={isAr ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {t.lastName} *
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500"
              placeholder={isAr ? 'اسم العائلة' : 'Last Name'}
              dir={isAr ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {t.password} *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500"
              placeholder="••••••••"
              dir={isAr ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {t.confirmPassword} *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500"
              placeholder="••••••••"
              dir={isAr ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {/* Instructor-specific fields */}
        {activeTab === 'instructor' && (
          <>
            <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  {t.phoneNumber} *
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500"
                  placeholder={isAr ? 'رقم الهاتف' : 'Phone Number'}
                  dir={isAr ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Expertise */}
              <div>
                <label
                  htmlFor="expertise"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  {t.expertise} *
                </label>
                <input
                  id="expertise"
                  name="expertise"
                  type="text"
                  required
                  className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-indigo-500"
                  placeholder={isAr ? 'مجال التخصص' : 'e.g., Web Development'}
                  dir={isAr ? 'rtl' : 'ltr'}
                />
              </div>
            </div>

            {/* ID Upload Section */}
            <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
              {/* ID Front */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t.idFront} *
                </label>
                <label
                  htmlFor="idFront"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 transition hover:border-indigo-500 hover:bg-indigo-50"
                >
                  <MdCloudUpload className="mb-1 text-xl text-gray-400" />
                  <span className="text-xs text-gray-600 truncate max-w-full px-2">
                    {idFrontFile || t.uploadIdFront}
                  </span>
                  <input
                    id="idFront"
                    name="idFront"
                    type="file"
                    accept="image/*"
                    required
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'front')}
                  />
                </label>
              </div>

              {/* ID Back */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t.idBack} *
                </label>
                <label
                  htmlFor="idBack"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 transition hover:border-indigo-500 hover:bg-indigo-50"
                >
                  <MdCloudUpload className="mb-1 text-xl text-gray-400" />
                  <span className="text-xs text-gray-600 truncate max-w-full px-2">
                    {idBackFile || t.uploadIdBack}
                  </span>
                  <input
                    id="idBack"
                    name="idBack"
                    type="file"
                    accept="image/*"
                    required
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'back')}
                  />
                </label>
              </div>
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#00FF91] px-4 py-3 text-center text-base font-semibold text-black shadow-sm transition hover:brightness-95 focus-visible:outline-none"
        >
          {t.submit}
        </button>

        {/* Divider and Social buttons - only for students */}
        {activeTab === 'student' && (
          <>
            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-[10px] uppercase tracking-wide text-gray-400">
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
                <FaFacebook className="text-xl" />
                {t.facebook}
              </button>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#EF4444] bg-white px-4 py-2.5 text-sm font-medium text-[#EF4444] transition hover:bg-red-50"
              >
                <FaGooglePlusG className="text-xl" />
                {t.google}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
