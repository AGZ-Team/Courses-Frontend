/**
 * Comprehensive error message mapping for both signup and login forms
 * Supports Arabic and English with field-specific messages
 */

export type Language = 'en' | 'ar';

export interface ErrorMessages {
  [field: string]: {
    en: string;
    ar: string;
  };
}

// Signup Form Error Messages
export const signupErrors: ErrorMessages = {
  username: {
    en: 'Username must be unique, contain only letters, numbers, and underscores, and be 1-150 characters long',
    ar: 'اسم المستخدم يجب أن يكون فريداً، ويحتوي على أحرف أو أرقام أو علامات سفلية فقط، بطول 1-150 حرف',
  },
  email: {
    en: 'Email must be unique and in valid email format (e.g., user@example.com)',
    ar: 'البريد الإلكتروني يجب أن يكون فريداً وبتنسيق صحيح (مثال: user@example.com)',
  },
  password: {
    en: 'Password must be at least 8 characters and not too similar to your username or personal information',
    ar: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل وليست مشابهة لاسم المستخدم أو المعلومات الشخصية',
  },
  password_confirmation: {
    en: 'Passwords do not match. Please ensure both password fields are identical',
    ar: 'كلمات المرور غير متطابقة. يرجى التأكد من أن كلا حقلي كلمة المرور متطابقان',
  },
  first_name: {
    en: 'First name is required and must contain only letters and spaces',
    ar: 'الاسم الأول مطلوب ويجب أن يحتوي على أحرف وفراغات فقط',
  },
  last_name: {
    en: 'Last name is required and must contain only letters and spaces',
    ar: 'اسم العائلة مطلوب ويجب أن يحتوي على أحرف وفراغات فقط',
  },
  phone: {
    en: 'Phone number must be valid (international format with country code)',
    ar: 'رقم الهاتف يجب أن يكون صحيحاً (بصيغة دولية مع رمز الدولة)',
  },
  expertise: {
    en: 'Expertise field is required and must be 1-255 characters',
    ar: 'حقل التخصص مطلوب ويجب أن يكون بطول 1-255 حرف',
  },
  id_front: {
    en: 'Front ID image is required and must be in valid image format',
    ar: 'صورة الهوية الأمامية مطلوبة وتجب أن تكون بصيغة صورة صحيحة',
  },
  id_back: {
    en: 'Back ID image is required and must be in valid image format',
    ar: 'صورة الهوية الخلفية مطلوبة وتجب أن تكون بصيغة صورة صحيحة',
  },
  non_field_errors: {
    en: 'An error occurred during signup. Please check your information and try again',
    ar: 'حدث خطأ أثناء التسجيل. يرجى التحقق من المعلومات والمحاولة مرة أخرى',
  },
};

// Login Form Error Messages
export const loginErrors: ErrorMessages = {
  username: {
    en: 'Username or email is required',
    ar: 'اسم المستخدم أو البريد الإلكتروني مطلوب',
  },
  password: {
    en: 'Password is required',
    ar: 'كلمة المرور مطلوبة',
  },
  invalid_credentials: {
    en: 'Invalid username/email or password. Please check your credentials and try again',
    ar: 'اسم المستخدم أو البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق والمحاولة مرة أخرى',
  },
  no_active_account: {
    en: 'This account is not active. It may not be verified yet or has been disabled. Please verify your email or contact support.',
    ar: 'هذا الحساب غير نشط. قد لا يكون البريد الإلكتروني مُفعّلاً بعد أو تم تعطيل الحساب. يرجى تفعيل بريدك الإلكتروني أو التواصل مع الدعم.',
  },
  account_disabled: {
    en: 'This account has been disabled. Please contact support',
    ar: 'تم تعطيل هذا الحساب. يرجى الاتصال بالدعم',
  },
  email_not_verified: {
    en: 'Account not found or email not verified. Please check your email or verify your account.',
    ar: 'الحساب غير موجود أو البريد الإلكتروني غير مُتحقق منه. يرجى التحقق من البريد الإلكتروني أو تفعيل حسابك.',
  },
  non_field_errors: {
    en: 'Login failed. Please check your credentials and try again',
    ar: 'فشل تسجيل الدخول. يرجى التحقق من بياناتك والمحاولة مرة أخرى',
  },
};

/**
 * Parse backend error response and return user-friendly message
 * Handles both field-specific and general errors
 */
export function getErrorMessageForField(
  fieldName: string,
  backendError: unknown,
  errorMap: ErrorMessages,
  language: Language
): string | null {
  // If the error is a string, check if we need to map it
  if (typeof backendError === 'string') {
    // Check if the string contains keywords to identify the error type
    if (
      backendError.toLowerCase().includes('credential') ||
      backendError.toLowerCase().includes('invalid')
    ) {
      return errorMap['invalid_credentials']?.[language] || backendError;
    }
    if (backendError.toLowerCase().includes('active')) {
      return errorMap['no_active_account']?.[language] || backendError;
    }
    if (backendError.toLowerCase().includes('disabled')) {
      return errorMap['account_disabled']?.[language] || backendError;
    }
    return backendError;
  }

  // If it's an array of errors, return the first one
  if (Array.isArray(backendError)) {
    const firstError = backendError[0];
    if (typeof firstError === 'string') {
      // Check for password similarity/validation errors
      if (
        firstError.toLowerCase().includes('similar') ||
        firstError.toLowerCase().includes('password') ||
        firstError.toLowerCase().includes('match')
      ) {
        return errorMap['password']?.[language] || firstError;
      }
      return firstError;
    }
  }

  // Return the default message for this field
  return errorMap[fieldName]?.[language] || null;
}

/**
 * Parse full error response and create field-specific error object
 */
export function parseSignupErrors(
  errorResponse: unknown,
  language: Language
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (typeof errorResponse === 'object' && errorResponse !== null) {
    for (const [field, messages] of Object.entries(errorResponse)) {
      const message = getErrorMessageForField(
        field,
        messages,
        signupErrors,
        language
      );
      if (message) {
        errors[field] = message;
      }
    }
  }

  // If no specific errors were found, return a generic one
  if (Object.keys(errors).length === 0) {
    errors['non_field_errors'] = signupErrors['non_field_errors'][language];
  }

  return errors;
}

/**
 * Parse login error response
 */
export function parseLoginErrors(
  errorResponse: unknown,
  language: Language
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (typeof errorResponse === 'string') {
    // Handle string error responses
    const lowerError = errorResponse.toLowerCase();
    
    if (
      lowerError.includes('credential') ||
      lowerError.includes('invalid')
    ) {
      errors['credentials'] = loginErrors['invalid_credentials'][language];
    } else if (lowerError.includes('no active account')) {
      // "No active account" messages map to inactive account / wrong credentials
      errors['credentials'] = loginErrors['no_active_account'][language];
    } else if (lowerError.includes('disabled')) {
      errors['credentials'] = loginErrors['account_disabled'][language];
    } else {
      errors['general'] = errorResponse;
    }
  } else if (typeof errorResponse === 'object' && errorResponse !== null) {
    // Handle object error responses
    if ('detail' in errorResponse && typeof errorResponse.detail === 'string') {
      const detail = errorResponse.detail;
      const lowerDetail = detail.toLowerCase();
      
      if (
        lowerDetail.includes('credential') ||
        lowerDetail.includes('invalid')
      ) {
        errors['credentials'] = loginErrors['invalid_credentials'][language];
      } else if (lowerDetail.includes('no active account')) {
        // "No active account" messages map to inactive account / wrong credentials
        errors['credentials'] = loginErrors['no_active_account'][language];
      } else if (lowerDetail.includes('disabled')) {
        errors['credentials'] = loginErrors['account_disabled'][language];
      } else {
        errors['general'] = detail;
      }
    } else {
      // Handle field-specific errors
      for (const [field, messages] of Object.entries(errorResponse)) {
        const message = getErrorMessageForField(
          field,
          messages,
          loginErrors,
          language
        );
        if (message) {
          errors[field] = message;
        }
      }
    }
  }

  // If no specific errors were found, return a generic one
  if (Object.keys(errors).length === 0) {
    errors['general'] = loginErrors['non_field_errors'][language];
  }

  return errors;
}

/**
 * Get a user-friendly error message from a raw error
 */
export function getUserFriendlyErrorMessage(
  error: unknown,
  context: 'signup' | 'login',
  language: Language
): string {
  const errorMap = context === 'signup' ? signupErrors : loginErrors;

  if (error instanceof Error) {
    const message = error.message;
    
    // Try to parse JSON error response from message
    try {
      const parsed = JSON.parse(message);
      if (typeof parsed === 'object') {
        const errors =
          context === 'signup'
            ? parseSignupErrors(parsed, language)
            : parseLoginErrors(parsed, language);
        
        // Return the first error message
        const firstError = Object.values(errors)[0];
        if (firstError) return firstError;
      }
    } catch {
      // Not JSON, treat as string
    }

    // Check for common error patterns in login context
    const lowerMessage = message.toLowerCase();
    
    if (context === 'login') {
      // For now, treat "No active account" as email-not-verified so the verification CTA appears
      if (lowerMessage.includes('no active account')) {
        return loginErrors['email_not_verified'][language];
      }

      // Check for invalid credentials
      if (lowerMessage.includes('credential') || lowerMessage.includes('invalid')) {
        return loginErrors['invalid_credentials'][language];
      }
      
      // Check for email verification issues
      if (
        (lowerMessage.includes('email') && lowerMessage.includes('not verified')) ||
        lowerMessage.includes('e-mail is not verified') ||
        lowerMessage.includes('account is not activated')
      ) {
        return loginErrors['email_not_verified'][language];
      }
    }
    
    // Common patterns for both signup and login
    if (lowerMessage.includes('duplicate')) {
      return language === 'ar'
        ? 'هذا الحساب موجود بالفعل'
        : 'This account already exists';
    }
    if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
      return language === 'ar'
        ? 'خطأ في الاتصال. يرجى التحقق من الإنترنت'
        : 'Network error. Please check your internet connection';
    }

    return message;
  }

  // Generic fallback
  return errorMap['non_field_errors'][language];
}
