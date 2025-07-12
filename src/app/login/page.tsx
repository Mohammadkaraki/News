'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast.success('Login successful!');
        router.push('/admin');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-20 bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-800 font-cairo relative overflow-hidden" dir="rtl">
      {/* Animated Orbs */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      <div className="relative max-w-md w-full space-y-8 z-10">
        <div className="flex flex-col items-center justify-center">
          <Link href="/" className="flex items-center justify-center mb-2">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-500 to-blue-800 p-1 rounded-xl shadow-lg">
              <div className="bg-white rounded-lg px-4 py-2 flex items-center gap-2">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-blue-600 to-secondary bg-clip-text text-transparent leading-tight">DeepNews</h1>
              </div>
            </div>
          </Link>
          <h2 className="mt-4 text-center text-2xl font-bold text-white drop-shadow-lg">تسجيل الدخول إلى حسابك</h2>
          <p className="mt-2 text-center text-sm text-blue-100">
            أو
            <Link href="/register" className="font-medium text-blue-200 hover:text-white transition-colors ml-1">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-blue-100 shadow-2xl p-8" onSubmit={handleSubmit}>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-700 rounded-full mx-auto mb-6"></div>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-blue-200 placeholder-blue-400 text-blue-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:z-10 sm:text-sm bg-white/80"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-blue-200 placeholder-blue-400 text-blue-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:z-10 sm:text-sm bg-white/80"
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-primary hover:text-primary-700">
                هل نسيت كلمة المرور؟
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 hover:from-blue-800 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all"
            >
              {loading ? (
                <FiLoader className="w-5 h-5 animate-spin" />
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </div>

          {/* Test Credentials Helper */}
          <div className="mt-6 p-4 bg-blue-50/80 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">بيانات تجريبية:</h3>
            <div className="text-xs text-blue-600 space-y-1">
              <p><strong>مدير:</strong> admin@newswebsite.com / Admin123!</p>
              <p><strong>محرر:</strong> editor@newswebsite.com / Editor123!</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 