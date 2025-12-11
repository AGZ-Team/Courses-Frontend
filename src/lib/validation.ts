/**
 * Comprehensive validation utilities with regex patterns
 * Supports both signup and login forms with Arabic/English error messages
 */

export type Language = 'en' | 'ar';

// Regex patterns for validation
export const REGEX_PATTERNS = {
  // Username: 1-150 chars, letters, numbers, underscores, hyphens
  username: /^[a-zA-Z0-9_-]{1,150}$/,
  
  // Email: standard email format
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Password: at least 8 chars, must include lowercase, uppercase, number, and special char
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/,
  
  // Name: letters, spaces, hyphens, apostrophes only
  name: /^[a-zA-Z\s\-']{1,150}$/,
  
  // Phone: digits and optional +, -, (), spaces
  phone: /^[\d\s\-()+]{7,20}$/,
  
  // Expertise: alphanumeric, spaces, common punctuation
  expertise: /^[a-zA-Z0-9\s\-,.']{1,255}$/,
};

// Validation error messages
export const validationMessages = {
  en: {
    username: {
      required: 'Username is required',
      invalid: 'Username must be 1-150 characters and contain only letters, numbers, underscores, or hyphens',
      taken: 'This username is already taken',
    },
    email: {
      required: 'Email is required',
      invalid: 'Please enter a valid email address (e.g., user@example.com)',
      taken: 'This email is already registered',
    },
    password: {
      required: 'Password is required',
      invalid: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
      tooShort: 'Password must be at least 8 characters',
      noLowercase: 'Password must include at least one lowercase letter',
      noUppercase: 'Password must include at least one uppercase letter',
      noNumber: 'Password must include at least one number',
      noSpecialChar: 'Password must include at least one special character (!@#$%^&*)',
    },
    confirmPassword: {
      required: 'Please confirm your password',
      mismatch: 'Passwords do not match',
    },
    firstName: {
      required: 'First name is required',
      invalid: 'First name must contain only letters, spaces, hyphens, or apostrophes',
    },
    lastName: {
      required: 'Last name is required',
      invalid: 'Last name must contain only letters, spaces, hyphens, or apostrophes',
    },
    phone: {
      required: 'Phone number is required',
      invalid: 'Please enter a valid phone number',
    },
    expertise: {
      required: 'Expertise is required for instructors',
      invalid: 'Expertise must be 1-255 characters',
    },
    idFront: {
      required: 'Front ID photo is required for instructors',
      invalid: 'Please upload a valid image file',
    },
    idBack: {
      required: 'Back ID photo is required for instructors',
      invalid: 'Please upload a valid image file',
    },
  },
  ar: {
    username: {
      required: 'اسم المستخدم مطلوب',
      invalid: 'يجب أن يكون اسم المستخدم 1-150 حرف ويحتوي على أحرف وأرقام وشرطات سفلية فقط',
      taken: 'هذا اسم المستخدم مأخوذ بالفعل',
    },
    email: {
      required: 'البريد الإلكتروني مطلوب',
      invalid: 'يرجى إدخال بريد إلكتروني صحيح (مثال: user@example.com)',
      taken: 'هذا البريد الإلكتروني مسجل بالفعل',
    },
    password: {
      required: 'كلمة المرور مطلوبة',
      invalid: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل وتتضمن أحرف كبيرة وصغيرة ورقم وحرف خاص',
      tooShort: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
      noLowercase: 'يجب أن تتضمن كلمة المرور حرف صغير واحد على الأقل',
      noUppercase: 'يجب أن تتضمن كلمة المرور حرف كبير واحد على الأقل',
      noNumber: 'يجب أن تتضمن كلمة المرور رقم واحد على الأقل',
      noSpecialChar: 'يجب أن تتضمن كلمة المرور حرف خاص واحد على الأقل (!@#$%^&*)',
    },
    confirmPassword: {
      required: 'يرجى تأكيد كلمة المرور',
      mismatch: 'كلمات المرور غير متطابقة',
    },
    firstName: {
      required: 'الاسم الأول مطلوب',
      invalid: 'يجب أن يحتوي الاسم الأول على أحرف وفراغات وشرطات وعلامات اقتباس فقط',
    },
    lastName: {
      required: 'اسم العائلة مطلوب',
      invalid: 'يجب أن يحتوي اسم العائلة على أحرف وفراغات وشرطات وعلامات اقتباس فقط',
    },
    phone: {
      required: 'رقم الهاتف مطلوب',
      invalid: 'يرجى إدخال رقم هاتف صحيح',
    },
    expertise: {
      required: 'التخصص مطلوب للمدربين',
      invalid: 'يجب أن يكون التخصص 1-255 حرف',
    },
    idFront: {
      required: 'صورة الهوية الأمامية مطلوبة للمدربين',
      invalid: 'يرجى تحميل ملف صورة صحيح',
    },
    idBack: {
      required: 'صورة الهوية الخلفية مطلوبة للمدربين',
      invalid: 'يرجى تحميل ملف صورة صحيح',
    },
  },
};

/**
 * Validate username
 */
export function validateUsername(username: string, language: Language = 'en'): string | null {
  if (!username || !username.trim()) {
    return validationMessages[language].username.required;
  }
  if (!REGEX_PATTERNS.username.test(username)) {
    return validationMessages[language].username.invalid;
  }
  return null;
}

/**
 * Validate email
 */
export function validateEmail(email: string, language: Language = 'en'): string | null {
  if (!email || !email.trim()) {
    return validationMessages[language].email.required;
  }
  if (!REGEX_PATTERNS.email.test(email)) {
    return validationMessages[language].email.invalid;
  }
  return null;
}

/**
 * Validate password with detailed feedback
 */
export function validatePassword(password: string, language: Language = 'en'): string | null {
  if (!password) {
    return validationMessages[language].password.required;
  }
  
  const msgs = validationMessages[language].password;
  
  if (password.length < 8) {
    return msgs.tooShort;
  }
  if (!/[a-z]/.test(password)) {
    return msgs.noLowercase;
  }
  if (!/[A-Z]/.test(password)) {
    return msgs.noUppercase;
  }
  if (!/\d/.test(password)) {
    return msgs.noNumber;
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return msgs.noSpecialChar;
  }
  
  return null;
}

/**
 * Validate password confirmation
 */
export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
  language: Language = 'en'
): string | null {
  if (!confirmPassword) {
    return validationMessages[language].confirmPassword.required;
  }
  if (password !== confirmPassword) {
    return validationMessages[language].confirmPassword.mismatch;
  }
  return null;
}

/**
 * Validate name (first or last)
 */
export function validateName(name: string, fieldName: 'firstName' | 'lastName', language: Language = 'en'): string | null {
  if (!name || !name.trim()) {
    return validationMessages[language][fieldName].required;
  }
  if (!REGEX_PATTERNS.name.test(name)) {
    return validationMessages[language][fieldName].invalid;
  }
  return null;
}

/**
 * Country code to phone length mapping
 * Maps country codes to expected phone number lengths (without country code)
 */
const COUNTRY_PHONE_LENGTHS: Record<string, number> = {
  '+966': 9,  // Saudi Arabia
  '+971': 9,  // UAE
  '+974': 8,  // Qatar
  '+968': 8,  // Oman
  '+965': 8,  // Kuwait
  '+973': 8,  // Bahrain
  '+962': 9,  // Jordan
  '+20': 10,  // Egypt
  '+1': 10,   // USA/Canada
  '+44': 10,  // UK
};

/**
 * Validate phone number
 */
export function validatePhone(phone: string, language: Language = 'en'): string | null {
  if (!phone || !phone.trim()) {
    return validationMessages[language].phone.required;
  }
  // Remove country code for validation
  const phoneOnly = phone.replace(/^\+\d{1,3}/, '').trim();
  if (!REGEX_PATTERNS.phone.test(phoneOnly)) {
    return validationMessages[language].phone.invalid;
  }
  return null;
}

/**
 * Validate phone number by country code
 * Ensures phone number has correct length for the selected country
 */
export function validatePhoneByCountry(
  phone: string,
  countryCode: string,
  language: Language = 'en'
): string | null {
  // First validate general phone format
  const generalError = validatePhone(phone, language);
  if (generalError) {
    return generalError;
  }

  // Extract only digits from the phone number (removing all non-digit characters)
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Get expected length for this country
  const expectedLength = COUNTRY_PHONE_LENGTHS[countryCode];
  
  if (!expectedLength) {
    // Country code not in our mapping, accept any valid format
    return null;
  }
  
  // Validate exact length
  if (digitsOnly.length !== expectedLength) {
    const msg = language === 'ar'
      ? `رقم الهاتف يجب أن يكون ${expectedLength} أرقام`
      : `Phone number must be ${expectedLength} digits`;
    return msg;
  }
  
  return null;
}

/**
 * Validate expertise
 */
export function validateExpertise(expertise: string, language: Language = 'en'): string | null {
  if (!expertise || !expertise.trim()) {
    return validationMessages[language].expertise.required;
  }
  if (!REGEX_PATTERNS.expertise.test(expertise)) {
    return validationMessages[language].expertise.invalid;
  }
  return null;
}

/**
 * Validate file upload (image only)
 */
export function validateImageFile(file: File | null, fieldName: 'idFront' | 'idBack', language: Language = 'en'): string | null {
  if (!file) {
    return validationMessages[language][fieldName].required;
  }
  
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validImageTypes.includes(file.type)) {
    return validationMessages[language][fieldName].invalid;
  }
  
  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return language === 'ar' ? 'حجم الملف كبير جداً (الحد الأقصى 5MB)' : 'File size is too large (max 5MB)';
  }
  
  return null;
}

/**
 * Validate login form
 */
export function validateLoginForm(
  username: string,
  password: string,
  language: Language = 'en'
): Record<string, string> {
  const errors: Record<string, string> = {};
  
  if (!username || !username.trim()) {
    errors.username = language === 'ar' ? 'اسم المستخدم مطلوب' : 'Username is required';
  }
  
  if (!password) {
    errors.password = language === 'ar' ? 'كلمة المرور مطلوبة' : 'Password is required';
  }
  
  return errors;
}

/**
 * Validate signup form
 */
export function validateSignupForm(
  formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    expertise?: string;
  },
  idFrontFile: File | null,
  idBackFile: File | null,
  isInstructor: boolean,
  language: Language = 'en'
): Record<string, string> {
  const errors: Record<string, string> = {};
  
  // Validate username
  const usernameError = validateUsername(formData.username, language);
  if (usernameError) errors.username = usernameError;
  
  // Validate email
  const emailError = validateEmail(formData.email, language);
  if (emailError) errors.email = emailError;
  
  // Validate password
  const passwordError = validatePassword(formData.password, language);
  if (passwordError) errors.password = passwordError;
  
  // Validate confirm password
  const confirmError = validateConfirmPassword(formData.password, formData.confirmPassword, language);
  if (confirmError) errors.confirmPassword = confirmError;
  
  // Validate names
  const firstNameError = validateName(formData.firstName, 'firstName', language);
  if (firstNameError) errors.first_name = firstNameError;
  
  const lastNameError = validateName(formData.lastName, 'lastName', language);
  if (lastNameError) errors.last_name = lastNameError;
  
  // Validate phone
  const phoneError = validatePhone(formData.phone, language);
  if (phoneError) errors.phone = phoneError;
  
  // Validate instructor-specific fields
  if (isInstructor) {
    const expertiseError = validateExpertise(formData.expertise || '', language);
    if (expertiseError) errors.expertise = expertiseError;
    
    const idFrontError = validateImageFile(idFrontFile, 'idFront', language);
    if (idFrontError) errors.id_front = idFrontError;
    
    const idBackError = validateImageFile(idBackFile, 'idBack', language);
    if (idBackError) errors.id_back = idBackError;
  }
  
  return errors;
}
