'use client';

import React, {useState} from 'react';
import {MdCloudUpload} from 'react-icons/md';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';
import {Loader} from 'lucide-react';
import {Link} from '@/i18n/routing';
import {signup} from '@/services/authService';
import {useRouter} from 'next/navigation';
import {parseSignupErrors, getUserFriendlyErrorMessage} from '@/lib/errorMessages';
import {validateSignupForm} from '@/lib/validation';

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

type FieldErrors = Record<string, string>;

export default function SignupForm({isAr, translations: t}: SignupFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'student' | 'instructor'>('student');
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+966'); // Default to Saudi Arabia
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    expertise: '',
  });

  // Country list with flags and codes
  const countries = [
    { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia', label: 'SA' },
    { code: '+971', flag: '🇦🇪', name: 'UAE', label: 'AE' },
    { code: '+974', flag: '🇶🇦', name: 'Qatar', label: 'QA' },
    { code: '+968', flag: '🇴🇲', name: 'Oman', label: 'OM' },
    { code: '+965', flag: '🇰🇼', name: 'Kuwait', label: 'KW' },
    { code: '+973', flag: '🇧🇭', name: 'Bahrain', label: 'BH' },
    { code: '+966', flag: '🇯🇴', name: 'Jordan', label: 'JO' },
    { code: '+20', flag: '🇪🇬', name: 'Egypt', label: 'EG' },
    { code: '+966', flag: '🇦🇪', name: 'UAE', label: 'AE' },
    { code: '+1', flag: '🇺🇸', name: 'United States', label: 'US' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom', label: 'UK' },
  ];

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'front' | 'back'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'front') {
        setIdFrontFile(file);
      } else {
        setIdBackFile(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});
    setSuccess(false);

    // Validate all fields with regex patterns
    const validationErrors = validateSignupForm(
      {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        expertise: formData.expertise,
      },
      idFrontFile,
      idBackFile,
      activeTab === 'instructor',
      isAr ? 'ar' : 'en'
    );

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: `${countryCode}${formData.phone}`,
        expertise: activeTab === 'instructor' ? formData.expertise : undefined,
        id_front: activeTab === 'instructor' ? idFrontFile || undefined : undefined,
        id_back: activeTab === 'instructor' ? idBackFile || undefined : undefined,
        is_instructor: activeTab === 'instructor',
      });

      setSuccess(true);
      
      // Store email in localStorage for resend verification if needed
      if (typeof window !== 'undefined') {
        localStorage.setItem('signup_email', formData.email);
      }
      
      // Redirect to verification instructions page after 2 seconds
      // User will receive verification email and click the link to verify
      setTimeout(() => {
        router.push('/auth/verify-email');
      }, 2000);
    } catch (err) {
      // Parse error and show field-specific or general message
      let errorMessage: string = getUserFriendlyErrorMessage(
        err,
        'signup',
        isAr ? 'ar' : 'en'
      );
      
      // Try to extract field-specific errors
      if (err instanceof Error) {
        try {
          const errorData = JSON.parse(err.message);
          if (typeof errorData === 'object') {
            const parsed = parseSignupErrors(errorData, isAr ? 'ar' : 'en');
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

  // Helper function to get field error
  const getFieldError = (fieldName: string): string | null => {
    return fieldErrors[fieldName] || null;
  };

  return (
    <div className="w-full max-w-7xl rounded-3xl mb-auto mt-10 md:mt-[12vw] lg:mt-[8vw] mx-auto bg-white p-6 shadow-[0_10px_40px_rgba(13,13,18,0.08)] ring-1 ring-black/5 md:p-8">
      <div className={`${isAr ? 'text-right' : ''}`}>
        <h1 className="mb-2 text-[26px] font-bold leading-tight text-[#0b0b2b]">
          {t.title}
        </h1>
        <p className="mb-4 text-[14px] text-gray-500">
          {t.subtitlePrefix}
          {/* depends on the language iam on ar or en */}
          <Link
            href="/login"
            className="ms-2 font-semibold text-primary hover:text-primary"
          >
            {t.loginCta}
          </Link>
        </p>
      </div>

      {generalError && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {generalError}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl bg-green-50 p-4 text-sm text-green-600">
          {isAr
            ? 'تم التسجيل بنجاح! جارٍ التحويل إلى صفحة التحقق من البريد الإلكتروني...'
            : 'Signup successful! Redirecting to email verification...'}
        </div>
      )}

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

      <form className="space-y-3.5" onSubmit={handleSubmit}>
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
              maxLength={150}
              value={formData.username}
              onChange={handleChange}
              className={`block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition ${
                getFieldError('username')
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:border-[#0ABAB5]'
              }`}
              placeholder={isAr ? 'اسم المستخدم' : 'Username'}
              dir={isAr ? 'rtl' : 'ltr'}
              disabled={loading}
            />
            {getFieldError('username') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('username')}</p>
            )}
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
              value={formData.email}
              onChange={handleChange}
              className={`block w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition ${
                getFieldError('email')
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-200 focus:border-[#0ABAB5]'
              }`}
              placeholder={isAr ? 'البريد الإلكتروني' : 'Email'}
              dir={isAr ? 'rtl' : 'ltr'}
              disabled={loading}
            />
            {getFieldError('email') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('email')}</p>
            )}
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
              value={formData.firstName}
              onChange={handleChange}
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-[#0ABAB5]"
              placeholder={isAr ? 'الاسم الأول' : 'First Name'}
              dir={isAr ? 'rtl' : 'ltr'}
              disabled={loading}
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
              value={formData.lastName}
              onChange={handleChange}
              className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition focus:border-[#0ABAB5]"
              placeholder={isAr ? 'اسم العائلة' : 'Last Name'}
              dir={isAr ? 'rtl' : 'ltr'}
              disabled={loading}
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
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                maxLength={128}
                value={formData.password}
                onChange={handleChange}
                className={`block w-full rounded-xl border bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition ${
                  getFieldError('password')
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#0ABAB5]'
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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {t.confirmPassword} *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                maxLength={128}
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`block w-full rounded-xl border bg-white px-4 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition ${
                  getFieldError('confirmPassword')
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#0ABAB5]'
                }`}
                placeholder="••••••••"
                dir={isAr ? 'rtl' : 'ltr'}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition ${
                  isAr ? 'left-3' : 'right-3'
                }`}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible className="text-lg" />
                ) : (
                  <AiOutlineEye className="text-lg" />
                )}
              </button>
            </div>
            {getFieldError('confirmPassword') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('confirmPassword')}</p>
            )}
          </div>
        </div>

        {/* Phone Number - Required for all users, but only show for students */}
        {activeTab === 'student' && (
          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              {t.phoneNumber} *
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Country Code Selector */}
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className={`w-full sm:w-auto rounded-xl border bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none ring-0 transition ${
                  getFieldError('phone')
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#0ABAB5]'
                }`}
                disabled={loading}
              >
                {countries.map((country) => (
                  <option key={`${country.code}-${country.label}`} value={country.code}>
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              
              {/* Phone Number Input */}
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className={`block w-full flex-1 rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition ${
                  getFieldError('phone')
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:border-[#0ABAB5]'
                }`}
                placeholder={isAr ? 'رقم الهاتف' : 'Phone Number'}
                dir={isAr ? 'rtl' : 'ltr'}
                disabled={loading}
              />
            </div>
            {getFieldError('phone') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('phone')}</p>
            )}
          </div>
        )}

        {/* Instructor-specific fields */}
        {activeTab === 'instructor' && (
          <>
            {/* Phone Number and Expertise on same line */}
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {/* Phone Number */}
              <div>
                <label
                  htmlFor="instructor-phone"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  {t.phoneNumber} *
                </label>
                <div className="flex flex-col sm:flex-row gap-1.5">
                  {/* Country Code Selector */}
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className={`w-full sm:w-auto rounded-xl border bg-white px-2.5 py-2 text-xs text-gray-900 shadow-sm outline-none ring-0 transition ${
                      getFieldError('phone')
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#0ABAB5]'
                    }`}
                    disabled={loading}
                  >
                    {countries.map((country) => (
                      <option key={`${country.code}-${country.label}`} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  
                  {/* Phone Number Input */}
                  <input
                    id="instructor-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full flex-1 rounded-xl border bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition ${
                      getFieldError('phone')
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-[#0ABAB5]'
                    }`}
                    placeholder={isAr ? 'رقم الهاتف' : 'Phone Number'}
                    dir={isAr ? 'rtl' : 'ltr'}
                    disabled={loading}
                  />
                </div>
                {getFieldError('phone') && (
                  <p className="mt-1 text-xs text-red-600">{getFieldError('phone')}</p>
                )}
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
                  maxLength={255}
                  value={formData.expertise}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none ring-0 transition ${
                    getFieldError('expertise')
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:border-[#0ABAB5]'
                  }`}
                  placeholder={isAr ? 'مجال التخصص' : 'e.g., Web Development'}
                  dir={isAr ? 'rtl' : 'ltr'}
                  disabled={loading}
                />
                {getFieldError('expertise') && (
                  <p className="mt-1 text-xs text-red-600">{getFieldError('expertise')}</p>
                )}
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
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-3 transition ${
                    getFieldError('id_front')
                      ? 'border-red-500 bg-red-50 hover:border-red-600 hover:bg-red-100'
                      : 'border-gray-300 bg-gray-50 hover:border-[#0ABAB5] hover:bg-indigo-50'
                  }`}
                >
                  <MdCloudUpload className="mb-1 text-xl text-gray-400" />
                  <span className="text-xs text-gray-600 truncate max-w-full px-2">
                    {idFrontFile?.name || t.uploadIdFront}
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
                {getFieldError('id_front') && (
                  <p className="mt-1 text-xs text-red-600">{getFieldError('id_front')}</p>
                )}
              </div>

              {/* ID Back */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {t.idBack} *
                </label>
                <label
                  htmlFor="idBack"
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-3 transition ${
                    getFieldError('id_back')
                      ? 'border-red-500 bg-red-50 hover:border-red-600 hover:bg-red-100'
                      : 'border-gray-300 bg-gray-50 hover:border-[#0ABAB5] hover:bg-indigo-50'
                  }`}
                >
                  <MdCloudUpload className="mb-1 text-xl text-gray-400" />
                  <span className="text-xs text-gray-600 truncate max-w-full px-2">
                    {idBackFile?.name || t.uploadIdBack}
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
                {getFieldError('id_back') && (
                  <p className="mt-1 text-xs text-red-600">{getFieldError('id_back')}</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || success}
          className="inline-flex w-full items-center justify-center rounded-xl bg-[#00FF91] px-4 py-3 text-center text-base font-semibold text-black shadow-sm transition hover:brightness-95 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              {isAr ? 'جارٍ التسجيل...' : 'Signing up...'}
            </>
          ) : (
            t.submit
          )}
        </button>

        {/* Divider and Social buttons - only for students */}
        {activeTab === 'student' && (
          <>
            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
