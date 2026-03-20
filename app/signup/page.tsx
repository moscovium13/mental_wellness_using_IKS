'use client'
import { signup } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const handleSignup = async () => {
  try {
    setIsLoading(true);
    await signup(email, password);
    alert("Signup successful");
    router.push("/home");
  } catch (err: any) {
    alert(err.message);
  } finally {
    setIsLoading(false);
  }
};
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
    terms?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: {
      fullName?: string
      email?: string
      password?: string
      confirmPassword?: string
      terms?: string
    } = {}

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters'
    }

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms and conditions'
    }

    return newErrors
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log('Signup attempted with:', { fullName, email, password })
      setIsLoading(false)
      // Redirect to verification or home
      router.push('/home')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white flex items-center justify-center px-4 py-8">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10" />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Start Your Journey</h1>
          <p className="text-slate-600">Create an account to access mental wellness support</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8 sm:p-10">
            <form onSubmit={handleSignup} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-emerald-500" />
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      if (errors.fullName) setErrors({ ...errors, fullName: undefined })
                    }}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all focus:outline-none ${
                      errors.fullName
                        ? 'border-red-300 focus:border-red-500 bg-red-50'
                        : 'border-emerald-100 focus:border-emerald-500 bg-emerald-50/30'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="text-red-500 text-sm mt-1.5">{errors.fullName}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-emerald-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: undefined })
                    }}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all focus:outline-none ${
                      errors.email
                        ? 'border-red-300 focus:border-red-500 bg-red-50'
                        : 'border-emerald-100 focus:border-emerald-500 bg-emerald-50/30'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-emerald-500" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({ ...errors, password: undefined })
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 transition-all focus:outline-none ${
                      errors.password
                        ? 'border-red-300 focus:border-red-500 bg-red-50'
                        : 'border-emerald-100 focus:border-emerald-500 bg-emerald-50/30'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">At least 8 characters</p>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-emerald-500" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined })
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 transition-all focus:outline-none ${
                      errors.confirmPassword
                        ? 'border-red-300 focus:border-red-500 bg-red-50'
                        : 'border-emerald-100 focus:border-emerald-500 bg-emerald-50/30'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1.5">{errors.confirmPassword}</p>}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3 pt-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked)
                    if (errors.terms) setErrors({ ...errors, terms: undefined })
                  }}
                  className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="text-emerald-600 font-medium hover:text-emerald-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-emerald-600 font-medium hover:text-emerald-700">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

              {/* Signup Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-6"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">or sign up with</span>
              </div>
            </div>

            {/* Social Signup Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center py-3 border-2 border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all font-medium text-slate-700">
                Google
              </button>
              <button className="flex items-center justify-center py-3 border-2 border-slate-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all font-medium text-slate-700">
                Apple
              </button>
            </div>
          </div>

          {/* Login Link */}
          <div className="px-8 sm:px-10 py-6 bg-emerald-50/30 border-t border-slate-100 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-slate-500 text-sm mt-6">
          We never share your information. Your mental health journey is private.
        </p>
      </div>
    </div>
  )
}
