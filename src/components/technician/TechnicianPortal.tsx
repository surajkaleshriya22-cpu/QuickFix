import React, { useState } from 'react';
import {
  Wrench,
  Zap,
  Power,
  IndianRupee,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  Award,
  AlertCircle,
  FileCheck,
  UserPlus,
  LogIn,
  ArrowRight
} from 'lucide-react';
import { useQuickFix } from '../../context/QuickFixContext';
import { Booking, BookingStatus, ServiceCategoryType } from '../../types';
import { INDIAN_CITIES } from '../../data/mockData';

export const TechnicianPortal: React.FC = () => {
  const {
    currentTechnician,
    isTechnicianLoggedIn,
    loginTechnician,
    registerTechnician,
    logoutTechnician,
    toggleTechnicianOnline,
    bookings,
    updateBookingStatus,
    requestPayout,
    setShowAuthModal
  } = useQuickFix();

  // Auth toggle
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [loginPhone, setLoginPhone] = useState('9845012345');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [payoutSuccess, setPayoutSuccess] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTrades, setRegTrades] = useState<ServiceCategoryType[]>(['electrician']);
  const [regExp, setRegExp] = useState(5);
  const [regCity, setRegCity] = useState('Bengaluru');
  const [regKycType, setRegKycType] = useState<'Aadhaar' | 'PAN' | 'Skill India Certificate'>('Skill India Certificate');
  const [regKycDoc, setRegKycDoc] = useState('');
  const [regUpi, setRegUpi] = useState('');

  // Find active job assigned to this technician
  const assignedJobs = bookings.filter(
    b => b.technicianId === currentTechnician.id || b.status === 'requested'
  );
  const currentActiveJob = assignedJobs.find(
    b => b.status === 'assigned' || b.status === 'technician_en_route' || b.status === 'in_progress'
  );

  const handleStartJobWithOtp = (bookingId: string) => {
    if (!otpInput || otpInput.trim().length !== 4) {
      setOtpError('Please enter the 4-digit OTP provided by customer');
      return;
    }
    const result = updateBookingStatus(bookingId, 'in_progress', otpInput);
    if (!result.success) {
      setOtpError(result.message || 'Invalid OTP');
    } else {
      setOtpError('');
      setOtpInput('');
    }
  };

  const handleCompleteJob = (bookingId: string) => {
    updateBookingStatus(bookingId, 'completed');
  };

  const handleWithdrawPayout = () => {
    if (currentTechnician.pendingPayout <= 0) return;
    requestPayout(currentTechnician.id, currentTechnician.pendingPayout);
    setPayoutSuccess(`₹${currentTechnician.pendingPayout} transferred to ${currentTechnician.bankAccount.upiId}`);
    setTimeout(() => setPayoutSuccess(''), 4000);
  };

  // If not logged in
  if (!isTechnicianLoggedIn) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col justify-center p-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4 max-w-sm mx-auto w-full">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">QuickFix Partner Portal</h2>
            <p className="text-xs text-slate-500">Sign in to manage service jobs and withdraw instant earnings.</p>
          </div>

          {!showRegisterForm ? (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Registered Mobile Number</label>
                <div className="flex rounded-xl border border-slate-300 overflow-hidden">
                  <span className="bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-600">🇮🇳 +91</span>
                  <input
                    type="tel"
                    value={loginPhone}
                    onChange={e => setLoginPhone(e.target.value)}
                    placeholder="98450 12345"
                    className="flex-1 px-3 py-2.5 text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In via Firebase Mobile OTP</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="w-full text-xs text-blue-600 hover:underline font-semibold text-center block pt-1"
              >
                New Service Technician? Register Trade & KYC
              </button>
            </div>
          ) : (
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  placeholder="+91 98450..."
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Trade</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRegTrades(['electrician'])}
                    className={`flex-1 py-1.5 rounded-lg border text-center font-bold ${regTrades.includes('electrician') ? 'bg-amber-100 text-amber-900 border-amber-400' : 'bg-slate-50'}`}
                  >
                    Electrician
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegTrades(['plumber'])}
                    className={`flex-1 py-1.5 rounded-lg border text-center font-bold ${regTrades.includes('plumber') ? 'bg-cyan-100 text-cyan-900 border-cyan-400' : 'bg-slate-50'}`}
                  >
                    Plumber
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Operating City (शहर)</label>
                <select
                  value={regCity}
                  onChange={e => setRegCity(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  {INDIAN_CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">KYC Proof Type</label>
                <select
                  value={regKycType}
                  onChange={e => setRegKycType(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Skill India Certificate">Skill India Certificate</option>
                  <option value="Aadhaar">Aadhaar Card</option>
                  <option value="PAN">PAN Card</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Number</label>
                <input
                  type="text"
                  value={regKycDoc}
                  onChange={e => setRegKycDoc(e.target.value)}
                  placeholder="e.g. SIC-EL-9921"
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">UPI ID for Payouts</label>
                <input
                  type="text"
                  value={regUpi}
                  onChange={e => setRegUpi(e.target.value)}
                  placeholder="name@okaxis / paytm"
                  className="w-full p-2 rounded-lg border border-slate-300"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  registerTechnician({
                    name: regName || 'Sunil Verma',
                    phone: regPhone || '+91 98450 99881',
                    email: regEmail || 'sunil.partner@quickfix.in',
                    trades: regTrades,
                    experienceYears: regExp,
                    city: regCity,
                    kycDocType: regKycType,
                    kycDocNumber: regKycDoc || 'KYC-88123-IN',
                    upiId: regUpi || 'sunil.partner@upi'
                  });
                }}
                className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl mt-2"
              >
                Submit Partner KYC Application
              </button>

              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="w-full text-center text-slate-500 hover:underline pt-1"
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-0">
      {/* Top Bar with Online Switch & Profile */}
      <header className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between z-20 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-sm">
            {currentTechnician.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-xs">{currentTechnician.name}</span>
              {currentTechnician.isVerified && (
                <span title="KYC Verified">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="capitalize">{currentTechnician.trades.join(', ')}</span>
              <span>· {currentTechnician.rating} ★</span>
            </div>
          </div>
        </div>

        {/* Online / Offline Status Button */}
        <button
          onClick={() => toggleTechnicianOnline(currentTechnician.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
            currentTechnician.isOnline
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-200'
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{currentTechnician.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Earnings Card */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-4 shadow-md border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] text-blue-300 font-semibold uppercase tracking-wider">
                Today's Net Earnings
              </span>
              <div className="text-2xl font-extrabold font-mono mt-0.5 text-white">
                ₹{currentTechnician.todayEarnings}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Pending Payout</span>
              <span className="text-base font-bold font-mono text-emerald-400">
                ₹{currentTechnician.pendingPayout}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
            <div>
              <span className="text-slate-400 text-[10px] block">Lifetime Jobs</span>
              <span className="font-bold text-white font-mono">{currentTechnician.totalJobsCompleted} Completed</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Settlement UPI</span>
              <span className="font-bold text-white font-mono truncate block text-[11px]">
                {currentTechnician.bankAccount.upiId}
              </span>
            </div>
          </div>

          {/* Instant Payout Action */}
          {currentTechnician.pendingPayout > 0 && (
            <button
              onClick={handleWithdrawPayout}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-all"
            >
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Withdraw ₹{currentTechnician.pendingPayout} Instantly</span>
            </button>
          )}

          {payoutSuccess && (
            <div className="bg-emerald-950 border border-emerald-500/50 p-2 rounded-xl text-emerald-300 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{payoutSuccess}</span>
            </div>
          )}
        </div>

        {/* Verification Alert if not verified */}
        {!currentTechnician.isVerified && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">KYC Pending Admin Review:</span> Your trade documentation ({currentTechnician.kycDocType}) is queued for verification by the QuickFix operations team.
            </div>
          </div>
        )}

        {/* Current Active Job Section */}
        {currentActiveJob ? (
          <div className="bg-white border-2 border-blue-500 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Active Dispatch · {currentActiveJob.id}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Payout: ₹{currentActiveJob.technicianPayout}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">{currentActiveJob.serviceTitle}</h3>
              <p className="text-xs text-slate-600 mt-1 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{currentActiveJob.customerAddress}</span>
              </p>
              {currentActiveJob.notes && (
                <div className="mt-2 bg-slate-50 p-2 rounded-lg text-[11px] text-slate-700 italic border border-slate-100">
                  Customer Note: "{currentActiveJob.notes}"
                </div>
              )}
            </div>

            {/* Customer Details & Call Action */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Customer</span>
                <span className="text-xs font-bold text-slate-900">{currentActiveJob.customerName}</span>
              </div>
              <a
                href={`tel:${currentActiveJob.customerPhone}`}
                className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Client</span>
              </a>
            </div>

            {/* Step Actions for the Technician */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              {currentActiveJob.status === 'assigned' && (
                <button
                  onClick={() => updateBookingStatus(currentActiveJob.id, 'technician_en_route')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Accept & Start Riding to Client</span>
                </button>
              )}

              {currentActiveJob.status === 'technician_en_route' && (
                <div className="space-y-2">
                  <div className="text-xs text-slate-600 font-medium">
                    Ask customer for the 4-digit start OTP to begin repair:
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={otpInput}
                      onChange={e => setOtpInput(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="flex-1 px-3 py-2 text-xs font-mono font-bold tracking-widest border border-slate-300 rounded-xl text-center focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleStartJobWithOtp(currentActiveJob.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Verify & Start</span>
                    </button>
                  </div>
                  {otpError && (
                    <div className="text-[11px] text-red-600 font-semibold">{otpError}</div>
                  )}
                </div>
              )}

              {currentActiveJob.status === 'in_progress' && (
                <button
                  onClick={() => handleCompleteJob(currentActiveJob.id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Work Done · Finish Job & Collect Payout</span>
                </button>
              )}
            </div>

            {/* Commission Transparency Split */}
            <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 flex justify-between">
              <span>Customer Total: ₹{currentActiveJob.totalAmount}</span>
              <span>Platform Fee: ₹{currentActiveJob.adminCommission}</span>
              <span className="font-bold text-emerald-700">Net You Get: ₹{currentActiveJob.technicianPayout}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-2 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Ready for Orders</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {currentTechnician.isOnline
                ? `You are online in ${currentTechnician.city || 'your area'}. Incoming electrician/plumber requests will ring here instantly.`
                : 'Turn your status ONLINE above to receive nearby customer bookings.'}
            </p>
          </div>
        )}

        {/* Completed Jobs History */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Job History</span>
            <span className="text-[11px] text-slate-500">{assignedJobs.filter(b => b.status === 'completed').length} completed</span>
          </div>

          <div className="space-y-2">
            {assignedJobs.filter(b => b.status === 'completed').map(b => (
              <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{b.serviceTitle}</div>
                  <div className="text-[11px] text-slate-500">{b.customerName} · {b.scheduledDate}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-600">+₹{b.technicianPayout}</div>
                  <div className="text-[10px] text-slate-400">Settled</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
