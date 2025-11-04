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
    en: 'Invalid username/email or password. Please check and try again',
    ar: 'اسم المستخدم أو البريد الإلكتروني أو كلمة المرور غير صحيحة',
  },
  no_active_account: {
    en: 'No active account found with these credentials. Please sign up first',
    ar: 'لم يتم العثور على حساب نشط بهذه البيانات. يرجى التسجيل أولاً',
  },
  account_disabled: {
    en: 'This account has been disabled. Please contact support',
    ar: 'تم تعطيل هذا الحساب. يرجى الاتصال بالدعم',
  },
  non_field_errors: {
    en: 'Login failed. Please try again',
    ar: 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى',
  },
};

/**
 * Parse backend error response and return user-friendly message
 * Handles both field-specific and general errors
 */
export function getErrorMessageForField(
  fieldName: string,
  backendError: any,
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
  errorResponse: any,
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
  errorResponse: any,
  language: Language
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (typeof errorResponse === 'string') {
    // Handle string error responses
    if (
      errorResponse.toLowerCase().includes('credential') ||
      errorResponse.toLowerCase().includes('invalid')
    ) {
      errors['credentials'] = loginErrors['invalid_credentials'][language];
    } else if (errorResponse.toLowerCase().includes('active')) {
      errors['credentials'] = loginErrors['no_active_account'][language];
    } else if (errorResponse.toLowerCase().includes('disabled')) {
      errors['credentials'] = loginErrors['account_disabled'][language];
    } else {
      errors['general'] = errorResponse;
    }
  } else if (typeof errorResponse === 'object' && errorResponse !== null) {
    // Handle object error responses
    if (errorResponse.detail) {
      const detail = errorResponse.detail;
      if (
        detail.toLowerCase().includes('credential') ||
        detail.toLowerCase().includes('invalid')
      ) {
        errors['credentials'] = loginErrors['invalid_credentials'][language];
      } else if (detail.toLowerCase().includes('active')) {
        errors['credentials'] = loginErrors['no_active_account'][language];
      } else if (detail.toLowerCase().includes('disabled')) {
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
  error: any,
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

    // Check for common error patterns
    if (
      message.toLowerCase().includes('credential') ||
      message.toLowerCase().includes('invalid')
    ) {
      return errorMap['invalid_credentials']?.[language] ||
        loginErrors['invalid_credentials'][language];
    }
    if (message.toLowerCase().includes('duplicate')) {
      return language === 'ar'
        ? 'هذا الحساب موجود بالفعل'
        : 'This account already exists';
    }
    if (message.toLowerCase().includes('network')) {
      return language === 'ar'
        ? 'خطأ في الاتصال. يرجى التحقق من الإنترنت'
        : 'Network error. Please check your internet connection';
    }

    return message;
  }

  // Generic fallback
  return errorMap['non_field_errors'][language];
}
