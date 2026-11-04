import React, { useState } from 'react';
import {
  X,
  Phone,
  User,
  Mail,
  MapPin,
  Shield,
  ShieldCheck,
  Wrench,
  Zap,
  Lock,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useQuickFix } from '../../context/QuickFixContext';
import { ServiceCategoryType, UserRole } from '../../types';
import { INDIAN_CITIES } from '../../data/mockData';

interface AuthModalProps {
  onClose: () => void;
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, initialRole = 'customer' }) => {
  const {
    authenticateUser,
    registerNewPartner,
    currentCity,
    setCurrentCity,
    setActiveRole
  } = useQuickFix();

  // Selected Auth Tab: 'customer' | 'partner' | 'admin'
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>(initialRole);
  const [isSignupMode, setIsSignupMode] = useState(false);

  // Form Fields
  const [phone, setPhone] = useState('9845199221');
  const [displayName, setDisplayName] = useState('Ananya Deshmukh');
  const [email, setEmail] = useState('ananya.deshmukh@gmail.com');
  const [address, setAddress] = useState('Flat 402, Sai Silver Woods, 5th Cross, Koramangala 4th Block');
  const [rememberMe, setRememberMe] = useState(true);

  // Partner Specific Fields
  const [partnerTrades, setPartnerTrades] = useState<ServiceCategoryType[]>(['electrician']);
  const [experienceYears, setExperienceYears] = useState(7);
  const [kycType, setKycType] = useState<'Aadhaar' | 'PAN' | 'Skill India Certificate'>('Skill India Certificate');
  const [kycNumber, setKycNumber] = useState('SIC-EL-2019-8812');
  const [upiId, setUpiId] = useState('ramesh.partner@okaxis');

  // Admin Specific Fields
  const [adminPasscode, setAdminPasscode] = useState('ADMIN2026');
  const [adminPhone, setAdminPhone] = useState('9800012345');
  const [adminError, setAdminError] = useState('');

  // OTP Verification Step
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('4821');
  const [countdown, setCountdown] = useState(30);
  const [formError, setFormError] = useState('');

  const toggleTrade = (trade: ServiceCategoryType) => {
    if (partnerTrades.includes(trade)) {
      if (partnerTrades.length > 1) {
        setPartnerTrades(partnerTrades.filter(t => t !== trade));
      }
    } else {
      setPartnerTrades([...partnerTrades, trade]);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const targetPhone = selectedRoleTab === 'admin' ? adminPhone : phone;
    if (!targetPhone || targetPhone.replace(/\D/g, '').length < 10) {
      setFormError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    if (selectedRoleTab === 'admin') {
      if (adminPasscode.trim() !== 'ADMIN2026') {
        setAdminError('Invalid Admin Passcode. Default demo security key is: ADMIN2026');
        return;
      }
    }

    setIsOtpStep(true);
    setCountdown(30);
  };

  const handleVerifyAndComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp || enteredOtp.trim().length < 4) {
      setFormError('Please enter the 4-digit verification OTP');
      return;
    }

    if (selectedRoleTab === 'customer') {
      authenticateUser({
        displayName,
        phoneNumber: `+91 ${phone}`,
        email,
        role: 'customer',
        address,
        city: currentCity,
        rememberMe
      });
      setActiveRole('customer');
    } else if (selectedRoleTab === 'technician') {
      if (isSignupMode) {
        registerNewPartner({
          displayName,
          phoneNumber: `+91 ${phone}`,
          email,
          trades: partnerTrades,
          experienceYears,
          kycDocType: kycType,
          kycDocNumber: kycNumber,
          upiId,
          city: currentCity,
          address,
          rememberMe
        });
      } else {
        authenticateUser({
          displayName: displayName || 'Ramesh Kumar',
          phoneNumber: `+91 ${phone}`,
          email: email || 'partner@quickfix.in',
          role: 'technician',
          trades: partnerTrades,
          city: currentCity,
          rememberMe
        });
      }
      setActiveRole('technician');
    } else if (selectedRoleTab === 'admin') {
      authenticateUser({
        displayName: 'QuickFix HQ Admin',
        phoneNumber: `+91 ${adminPhone}`,
        email: 'ops.admin@quickfix.in',
        role: 'admin',
        city: currentCity,
        rememberMe
      });
      setActiveRole('admin');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with QuickFix Branding */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white text-blue-600 flex items-center justify-center font-black text-lg shadow-sm">
              Q
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white text-sm">QuickFix</span>
              <span className="text-[10px] text-blue-200 ml-1.5 uppercase tracking-wider font-semibold">India</span>
            </div>
          </div>

          <h3 className="text-base font-bold">
            {isOtpStep
              ? 'Verify Mobile OTP'
              : selectedRoleTab === 'customer'
              ? isSignupMode ? 'Create Customer Account' : 'Customer Sign In'
              : selectedRoleTab === 'technician'
              ? isSignupMode ? 'Register as Service Partner' : 'Technician Partner Sign In'
              : 'Admin Operations Login'}
          </h3>
          <p className="text-xs text-blue-100 mt-0.5">
            {isOtpStep
              ? `Verification OTP sent to +91 ${selectedRoleTab === 'admin' ? adminPhone : phone}`
              : 'Secured via Firebase Authentication & Firestore DB'}
          </p>
        </div>

        {/* Role Segmented Tabs (only before OTP step) */}
        {!isOtpStep && (
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold p-1 gap-1">
            <button
              type="button"
              onClick={() => {
                setSelectedRoleTab('customer');
                setFormError('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                selectedRoleTab === 'customer'
                  ? 'bg-white text-blue-700 shadow-xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRoleTab('technician');
                setFormError('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                selectedRoleTab === 'technician'
                  ? 'bg-white text-blue-700 shadow-xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Partner</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRoleTab('admin');
                setFormError('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                selectedRoleTab === 'admin'
                  ? 'bg-white text-blue-700 shadow-xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin</span>
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {formError && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {!isOtpStep ? (
            /* STEP 1: Phone / Registration Form */
            <form onSubmit={handleSendOtp} className="space-y-3.5 text-xs">
              {/* City selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Service City
                </label>
                <select
                  value={currentCity}
                  onChange={e => setCurrentCity(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {INDIAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* CUSTOMER FORM */}
              {selectedRoleTab === 'customer' && (
                <>
                  {isSignupMode && (
                    <>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            required
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            placeholder="Ananya Deshmukh"
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="ananya@example.com"
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                          Default Service Address
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="Flat/House No, Building, Landmark, Pin code"
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      Mobile Number (+91)
                    </label>
                    <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                      <span className="bg-slate-100 px-3 py-2 font-bold text-slate-700 flex items-center border-r border-slate-300 text-xs">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98451 99221"
                        className="flex-1 px-3 py-2 font-mono text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* PARTNER FORM */}
              {selectedRoleTab === 'technician' && (
                <>
                  {isSignupMode ? (
                    <>
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                          Technician Name
                        </label>
                        <input
                          type="text"
                          required
                          value={displayName}
                          onChange={e => setDisplayName(e.target.value)}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                          Select Trades & Specialties
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => toggleTrade('electrician')}
                            className={`p-2 rounded-xl border flex items-center gap-1.5 font-bold ${
                              partnerTrades.includes('electrician')
                                ? 'bg-amber-50 text-amber-900 border-amber-400'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-600" />
                            <span>Electrician</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleTrade('plumber')}
                            className={`p-2 rounded-xl border flex items-center gap-1.5 font-bold ${
                              partnerTrades.includes('plumber')
                                ? 'bg-cyan-50 text-cyan-900 border-cyan-400'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            <Wrench className="w-3.5 h-3.5 text-cyan-600" />
                            <span>Plumber</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                            Experience
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="35"
                            value={experienceYears}
                            onChange={e => setExperienceYears(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                            KYC Doc
                          </label>
                          <select
                            value={kycType}
                            onChange={e => setKycType(e.target.value as any)}
                            className="w-full px-2 py-2 rounded-xl border border-slate-300 bg-white"
                          >
                            <option value="Skill India Certificate">Skill India</option>
                            <option value="Aadhaar">Aadhaar</option>
                            <option value="PAN">PAN</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                          Document Number
                        </label>
                        <input
                          type="text"
                          required
                          value={kycNumber}
                          onChange={e => setKycNumber(e.target.value)}
                          placeholder="e.g. SIC-EL-9941"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                          UPI ID for Direct Payouts
                        </label>
                        <input
                          type="text"
                          required
                          value={upiId}
                          onChange={e => setUpiId(e.target.value)}
                          placeholder="name@okaxis or paytm"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-mono"
                        />
                      </div>
                    </>
                  ) : null}

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      Partner Mobile Number (+91)
                    </label>
                    <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                      <span className="bg-slate-100 px-3 py-2 font-bold text-slate-700 flex items-center border-r border-slate-300 text-xs">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98450 12345"
                        className="flex-1 px-3 py-2 font-mono text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ADMIN FORM */}
              {selectedRoleTab === 'admin' && (
                <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Admin Security Passcode
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={adminPasscode}
                        onChange={e => setAdminPasscode(e.target.value)}
                        placeholder="Enter master passcode"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {adminError && (
                      <p className="text-[10px] text-red-600 font-semibold mt-1">{adminError}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      HQ Authorized Mobile Number
                    </label>
                    <div className="flex rounded-xl border border-slate-300 overflow-hidden bg-white">
                      <span className="bg-slate-100 px-3 py-2 font-bold text-slate-700 text-xs">🇮🇳 +91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={adminPhone}
                        onChange={e => setAdminPhone(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 px-3 py-2 font-mono text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-600 select-none cursor-pointer">
                  Remember this device for seamless login
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 active:scale-98 transition-all"
              >
                <span>Request Verification OTP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Switch between Sign In / Sign Up (Customer & Partner) */}
              {selectedRoleTab !== 'admin' && (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignupMode(!isSignupMode);
                      setFormError('');
                    }}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    {isSignupMode
                      ? 'Already registered? Sign In'
                      : selectedRoleTab === 'technician'
                      ? 'New Service Technician? Register Trade & KYC'
                      : 'New to QuickFix? Create Account'}
                  </button>
                </div>
              )}
            </form>
          ) : (
            /* STEP 2: OTP Verification */
            <form onSubmit={handleVerifyAndComplete} className="space-y-4 text-xs">
              <div className="text-center py-2 space-y-1">
                <p className="text-slate-600">
                  Enter the 4-digit code sent via Firebase SMS Gateway:
                </p>
                <div className="py-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredOtp}
                    onChange={e => setEnteredOtp(e.target.value)}
                    className="w-36 mx-auto text-center font-mono tracking-widest text-2xl font-extrabold py-2 border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Demonstration verification OTP: <strong className="text-blue-600 font-mono">4821</strong>
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-blue-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify OTP & Enter QuickFix</span>
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => setIsOtpStep(false)}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Change Number
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEnteredOtp('4821');
                    setCountdown(30);
                  }}
                  className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resend OTP</span>
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Firebase Auth · Firestore Sync · Encrypted Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
