import React, { useState } from 'react';
import {
  Shield,
  Lock,
  KeyRound,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Building2,
  Check
} from 'lucide-react';
import { useQuickFix } from '../../context/QuickFixContext';

interface AdminLoginScreenProps {
  onBackToApp?: () => void;
}

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onBackToApp }) => {
  const { authenticateUser, setActiveRole, setShowAuthModal } = useQuickFix();

  const [adminEmail, setAdminEmail] = useState('ops.admin@quickfix.in');
  const [adminPhone, setAdminPhone] = useState('+91 98000 12345');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (adminPasscode.trim() !== 'ADMIN2026') {
      setErrorMessage('Invalid Admin Security Passcode. Use demonstration passcode: ADMIN2026');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      authenticateUser({
        displayName: 'QuickFix HQ Admin (Ops Dispatch)',
        phoneNumber: adminPhone,
        email: adminEmail,
        role: 'admin',
        city: 'Bengaluru',
        address: 'QuickFix Operations Hub, HSR Layout, Bengaluru - 560102',
        rememberMe: rememberMe
      });
      setIsLoading(false);
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setAdminPasscode('ADMIN2026');
    setErrorMessage('');
    setIsLoading(true);
    setTimeout(() => {
      authenticateUser({
        displayName: 'QuickFix HQ Admin (Ops Dispatch)',
        phoneNumber: '+91 98000 12345',
        email: 'ops.admin@quickfix.in',
        role: 'admin',
        city: 'Bengaluru',
        address: 'QuickFix Operations Hub, HSR Layout, Bengaluru - 560102',
        rememberMe: true
      });
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto font-sans">
      {/* Top Header / Back Button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <button
          onClick={() => {
            if (onBackToApp) onBackToApp();
            else setActiveRole('customer');
          }}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customer App</span>
        </button>

        <span className="text-[10px] font-mono bg-blue-950/80 text-blue-400 border border-blue-800/60 px-2 py-0.5 rounded-full">
          RBAC · Super Admin
        </span>
      </div>

      {/* Main Login Card */}
      <div className="my-auto py-6 max-w-sm w-full mx-auto space-y-5">
        {/* Logo & Heading */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30 text-white">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">QuickFix HQ Admin</h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Operational command center for Customer Management, Booking Dispatch, Technicians, and Payments.
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="bg-blue-950/40 border border-blue-800/50 rounded-xl p-3 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-blue-300 font-semibold text-[11px]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Demo Admin Credentials
            </span>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold underline"
            >
              1-Click Instant Login
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono pt-1">
            <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[9px] uppercase">Email:</span>
              <span className="truncate block">ops.admin@quickfix.in</span>
            </div>
            <div className="bg-slate-900/80 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[9px] uppercase">Passcode:</span>
              <span className="font-bold text-blue-400">ADMIN2026</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-3.5 text-xs">
          {/* Admin Email */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Admin Identity / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                placeholder="ops.admin@quickfix.in"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
            </div>
          </div>

          {/* Admin Phone */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Registered Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={adminPhone}
                onChange={e => setAdminPhone(e.target.value)}
                placeholder="+91 98000 12345"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
            </div>
          </div>

          {/* Passcode Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-300">
                Security Passcode
              </label>
              <span className="text-[10px] text-blue-400 font-mono">Default: ADMIN2026</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type={showPasscode ? 'text' : 'password'}
                required
                value={adminPasscode}
                onChange={e => setAdminPasscode(e.target.value)}
                placeholder="Enter ADMIN2026"
                className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span className="text-slate-300 text-[11px]">Remember Admin Session</span>
            </label>
            <button
              type="button"
              onClick={() => setAdminPasscode('ADMIN2026')}
              className="text-[11px] text-blue-400 hover:underline"
            >
              Fill Passcode
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span>Verifying Administrative Credentials...</span>
            ) : (
              <>
                <span>Access Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Alternate Login Option */}
        <div className="pt-2 text-center">
          <p className="text-[11px] text-slate-400">
            Need to authenticate via Firebase SMS OTP?{' '}
            <button
              type="button"
              onClick={() => setShowAuthModal(true)}
              className="text-blue-400 hover:underline font-semibold"
            >
              Open Firebase OTP Modal
            </button>
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[10px] text-slate-500 pt-4 border-t border-slate-800">
        QuickFix Operations Platform · India Home Services · ISO 27001 & Firestore RBAC Compliant
      </div>
    </div>
  );
};
