/*
 * AddNewStaff Component
 * 
 * Usage: <AddNewStaff onClose={() => setShowModal(false)} onSuccess={(user) => console.log(user)} />
 */

import React, { useState, useRef, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';


interface AddNewStaffProps {
  onClose: () => void;
  onSuccess?: (user: any) => void;
  token?: string;
}

interface FormState {
  name: string;
  email: string;
  password: string;
  role: 'staff' | 'manager' | 'admin';
  profileImage: File | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  profileImage?: string;
  submit?: string;
}

type PasswordStrength = 'weak' | 'ok' | 'strong';

const AddNewStaff: React.FC<AddNewStaffProps> = ({ onClose, onSuccess, token }) => {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    role: 'staff',
    profileImage: null,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdPassword, setCreatedPassword] = useState<string>('');
  const [accessDenied, setAccessDenied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Enter' && e.ctrlKey) {
        handleSubmit(e as any);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password: string): PasswordStrength => {
    if (password.length < 8) return 'weak';
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    if (score >= 3 && password.length >= 12) return 'strong';
    if (score >= 2 && password.length >= 8) return 'ok';
    return 'weak';
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!form.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid image file (JPG, JPEG, or PNG)';
    }

    if (file.size > maxSize) {
      return 'Image size must be less than 2MB';
    }

    return null;
  };

  const handleInputChange = (field: keyof FormState, value: string | File | null) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined, submit: undefined }));
    }
  };

  const handleFileChange = (file: File | null) => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }

    if (file) {
      const fileError = validateFile(file);
      if (fileError) {
        setErrors(prev => ({ ...prev, profileImage: fileError }));
        return;
      }

      setErrors(prev => ({ ...prev, profileImage: undefined }));
      handleInputChange('profileImage', file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      handleInputChange('profileImage', null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const authToken = token || localStorage.getItem('token');
    if (!authToken) {
      setAccessDenied(true);
      return;
    }

    setLoading(true);
    setErrors({});
    
    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const API_URL = process.env.VITE_API_URL ?? 'http://localhost:4000';
      const formData = new FormData();
      
      formData.append('name', form.name.trim());
      formData.append('email', form.email.trim());
      formData.append('password', form.password);
      formData.append('role', form.role);
      
      if (form.profileImage) {
        formData.append('profileImage', form.profileImage);
      }

      const response = await fetch(`${API_URL}/api/auth/add-staff`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      if (response.status === 201) {
        setSuccess(true);
        setCreatedPassword(form.password);
        
        // Clear sensitive form data
        setForm({
          name: '',
          email: '',
          password: '',
          role: 'staff',
          profileImage: null,
        });
        
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
          setImagePreview(null);
        }

        if (onSuccess && data.user) {
          onSuccess(data.user);
        }

        // Auto-close after 1.5 seconds
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        // Handle error responses
        if (response.status === 403) {
          setAccessDenied(true);
        } else {
          setErrors({ submit: data.message || 'Server error - please try again' });
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was aborted, don't show error
        return;
      }
      setErrors({ submit: 'Server error - please try again' });
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(createdPassword);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = createdPassword;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const passwordStrength = getPasswordStrength(form.password);
  const isFormValid = form.name.trim().length >= 2 && 
                     form.email.trim() && 
                     validateEmail(form.email) && 
                     form.password.length >= 8 && 
                     form.role;

  if (accessDenied) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Access Required</h3>
          <p className="text-sm text-gray-500 mb-4">You need administrator privileges to add new staff members.</p>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Staff Member Added Successfully!</h3>
          <p className="text-sm text-gray-500 mb-4">The new staff account has been created.</p>
          {createdPassword && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Temporary password (save this now):</p>
              <div className="flex items-center justify-center gap-2">
                <code className="px-3 py-1 bg-white border rounded text-sm font-mono">{createdPassword}</code>
                <button
                  onClick={copyPassword}
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm transition-colors"
                  title="Copy password"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
          <div aria-live="polite" className="sr-only">Staff member added successfully</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Add New Staff Member</h2>
        <p className="text-sm text-gray-500">Create a new staff account and send credentials later.</p>
      </div>

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={form.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter full name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={form.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter email address"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Temporary Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={form.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter temporary password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : 'password-help'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Password strength meter */}
          {form.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      passwordStrength === 'strong' ? 'w-full bg-green-500' :
                      passwordStrength === 'ok' ? 'w-2/3 bg-yellow-500' :
                      'w-1/3 bg-red-500'
                    }`}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  passwordStrength === 'strong' ? 'text-green-600' :
                  passwordStrength === 'ok' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                </span>
              </div>
            </div>
          )}
          
          {errors.password && (
            <p id="password-error" className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          {!errors.password && (
            <p id="password-help" className="mt-1 text-sm text-gray-500">Minimum 8 characters</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Role *
          </label>
          <select
            id="role"
            value={form.role}
            onChange={(e) => handleInputChange('role', e.target.value as 'staff' | 'manager' | 'admin')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.role ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            aria-invalid={!!errors.role}
          >
            <option value="doctor">doctor</option>
            <option value="nurse">nurse</option>
            <option value="reception">reception</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
          )}
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Image (optional)
          </label>
          <div
            ref={dragRef}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              errors.profileImage ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {imagePreview ? (
              <div className="space-y-4">
                <div className="mx-auto w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                  <img 
                    src={imagePreview} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {form.profileImage?.name}
                  </p>
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFileChange(null)}
                      className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop an image here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="hidden"
              aria-describedby={errors.profileImage ? 'image-error' : undefined}
            />
          </div>
          {errors.profileImage && (
            <p id="image-error" className="mt-1 text-sm text-red-600">{errors.profileImage}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all ${
              isFormValid && !loading
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                <span className="ml-2">Creating Account...</span>
              </>
            ) : (
              'Create Staff Account'
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

// Loading spinner component
const LoadingSpinner: React.FC = () => (
  <svg 
    className="animate-spin h-4 w-4 text-white" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default AddNewStaff;