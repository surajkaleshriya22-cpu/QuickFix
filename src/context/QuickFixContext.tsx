import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Booking,
  BookingStatus,
  CommissionSettings,
  CustomerUser,
  PayoutRecord,
  PaymentMethod,
  PaymentStatus,
  ServiceCategoryType,
  ServiceItem,
  Technician,
  ActiveRole,
  AppUser,
  UserRole
} from '../types';
import {
  CURRENT_CUSTOMER,
  INITIAL_BOOKINGS,
  INITIAL_COMMISSION_SETTINGS,
  INITIAL_PAYOUTS,
  INITIAL_SERVICES,
  INITIAL_TECHNICIANS,
  INITIAL_CUSTOMERS
} from '../data/mockData';

interface QuickFixContextType {
  // Role & View Mode
  activeRole: ActiveRole;
  setActiveRole: (role: ActiveRole) => void;
  viewMode: 'phone' | 'fullscreen';
  setViewMode: (mode: 'phone' | 'fullscreen') => void;
  showCodeInspector: boolean;
  setShowCodeInspector: (show: boolean) => void;
  showFirebaseConfig: boolean;
  setShowFirebaseConfig: (show: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showProfileDrawer: boolean;
  setShowProfileDrawer: (show: boolean) => void;

  // Authentication & Profile
  currentUser: AppUser | null;
  isAuthenticated: boolean;
  authenticateUser: (params: {
    displayName: string;
    phoneNumber: string;
    email: string;
    role: UserRole;
    address?: string;
    city: string;
    trades?: ServiceCategoryType[];
    rememberMe: boolean;
  }) => void;
  registerNewPartner: (params: {
    displayName: string;
    phoneNumber: string;
    email: string;
    trades: ServiceCategoryType[];
    experienceYears: number;
    kycDocType: 'Aadhaar' | 'PAN' | 'Skill India Certificate';
    kycDocNumber: string;
    upiId: string;
    city: string;
    address?: string;
    rememberMe: boolean;
  }) => void;
  logoutUser: () => void;
  updateCustomerAddress: (newAddr: {
    label: 'Home' | 'Work' | 'Other';
    addressLine: string;
    city: string;
    pincode: string;
  }) => void;

  // City & Services
  currentCity: string;
  setCurrentCity: (city: string) => void;
  services: ServiceItem[];
  selectedCategory: 'all' | ServiceCategoryType;
  setSelectedCategory: (cat: 'all' | ServiceCategoryType) => void;

  // Customer State & Backward Compatibility
  customer: CustomerUser;
  isCustomerLoggedIn: boolean;
  loginCustomer: (phone: string, name?: string) => void;
  registerCustomer: (name: string, phone: string, email: string, address: string) => void;
  logoutCustomer: () => void;

  // Bookings
  bookings: Booking[];
  activeBookingId: string | null;
  setActiveBookingId: (id: string | null) => void;
  createBooking: (params: {
    serviceId: string;
    scheduledDate: string;
    scheduledTimeSlot: string;
    address: string;
    notes?: string;
    paymentMethod: PaymentMethod;
  }) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus, otpProvided?: string) => { success: boolean; message?: string };
  addReview: (bookingId: string, rating: number, comment: string, tags: string[]) => void;

  // Technicians & Partner App
  technicians: Technician[];
  currentTechnician: Technician;
  isTechnicianLoggedIn: boolean;
  loginTechnician: (phone: string) => boolean;
  registerTechnician: (data: {
    name: string;
    phone: string;
    email: string;
    trades: ServiceCategoryType[];
    experienceYears: number;
    city: string;
    kycDocType: 'Aadhaar' | 'PAN' | 'Skill India Certificate';
    kycDocNumber: string;
    upiId: string;
  }) => void;
  logoutTechnician: () => void;
  toggleTechnicianOnline: (techId: string) => void;
  approveTechnicianKyc: (techId: string) => void;
  rejectTechnicianKyc: (techId: string) => void;

  // Admin & Commissions
  commissionSettings: CommissionSettings;
  updateCommissionSettings: (settings: Partial<CommissionSettings>) => void;
  payouts: PayoutRecord[];
  requestPayout: (technicianId: string, amount: number) => void;
  processPayout: (payoutId: string) => void;
  disbursePayout: (payoutId: string) => void;

  // Admin Extended Management
  customers: CustomerUser[];
  deleteCustomer: (customerId: string) => void;
  toggleCustomerStatus: (customerId: string) => void;
  reassignBookingTechnician: (bookingId: string, technicianId: string) => void;
  deleteBooking: (bookingId: string) => void;
  toggleTechnicianSuspension: (techId: string) => void;
  updateTechnicianRating: (techId: string, newRating: number) => void;
  addCustomerReviewReply: (bookingId: string, reply: string) => void;
  deleteReview: (bookingId: string) => void;
  updateBookingPaymentStatus: (bookingId: string, status: PaymentStatus, transactionRef?: string) => void;
  firestoreSyncStatus: { isConnected: boolean; lastSynced: string; latencyMs: number };
  triggerFirestoreSync: () => Promise<void>;
}

const QuickFixContext = createContext<QuickFixContextType | undefined>(undefined);

const LOCAL_STORAGE_AUTH_KEY = 'quickfix_auth_session';

export const QuickFixProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Role State
  const [activeRole, setActiveRole] = useState<ActiveRole>('customer');
  const [viewMode, setViewMode] = useState<'phone' | 'fullscreen'>('phone');
  const [showCodeInspector, setShowCodeInspector] = useState(false);
  const [showFirebaseConfig, setShowFirebaseConfig] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  // Localization & Services
  const [currentCity, setCurrentCity] = useState('Bengaluru');
  const [services] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [selectedCategory, setSelectedCategory] = useState<'all' | ServiceCategoryType>('all');

  // Unified Firebase Auth Session state
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      uid: 'user-default-101',
      phoneNumber: '+91 98451 99221',
      displayName: 'Ananya Deshmukh',
      email: 'ananya.deshmukh@gmail.com',
      role: 'customer',
      address: 'Flat 402, Sai Silver Woods, 5th Cross, Koramangala 4th Block',
      city: 'Bengaluru',
      pincode: '560034',
      createdAt: '2026-11-03T08:00:00Z'
    };
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Customer State
  const [customer, setCustomer] = useState<CustomerUser>(CURRENT_CUSTOMER);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState(true);

  // Technicians State
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [currentTechnician, setCurrentTechnician] = useState<Technician>(INITIAL_TECHNICIANS[0]);
  const [isTechnicianLoggedIn, setIsTechnicianLoggedIn] = useState(true);

  // Commissions & Payouts
  const [commissionSettings, setCommissionSettings] = useState<CommissionSettings>(INITIAL_COMMISSION_SETTINGS);
  const [payouts, setPayouts] = useState<PayoutRecord[]>(INITIAL_PAYOUTS);

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [activeBookingId, setActiveBookingId] = useState<string | null>('QF-7049');

  // Sync customer details when currentUser changes
  useEffect(() => {
    if (currentUser && currentUser.role === 'customer') {
      setCustomer(prev => ({
        ...prev,
        name: currentUser.displayName,
        phone: currentUser.phoneNumber,
        email: currentUser.email,
        addresses: currentUser.address
          ? [
              {
                id: 'addr-main',
                label: 'Home',
                addressLine: currentUser.address,
                city: currentUser.city,
                pincode: currentUser.pincode || '560034'
              },
              ...prev.addresses.filter(a => a.label !== 'Home')
            ]
          : prev.addresses
      }));
    }
  }, [currentUser]);

  // Authentication Methods
  const authenticateUser = ({
    displayName,
    phoneNumber,
    email,
    role,
    address,
    city,
    trades,
    rememberMe
  }: {
    displayName: string;
    phoneNumber: string;
    email: string;
    role: UserRole;
    address?: string;
    city: string;
    trades?: ServiceCategoryType[];
    rememberMe: boolean;
  }) => {
    const userObj: AppUser = {
      uid: `uid-${Date.now()}`,
      phoneNumber,
      displayName,
      email,
      role,
      address,
      city,
      trades,
      createdAt: new Date().toISOString()
    };

    setCurrentUser(userObj);
    setIsAuthenticated(true);

    if (rememberMe) {
      try {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(userObj));
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
      } catch {
        // ignore
      }
    }

    if (role === 'customer') {
      setIsCustomerLoggedIn(true);
      setCustomer({
        id: userObj.uid,
        name: displayName,
        phone: phoneNumber,
        email,
        addresses: address
          ? [
              {
                id: `addr-${Date.now()}`,
                label: 'Home',
                addressLine: address,
                city,
                pincode: '560034'
              }
            ]
          : customer.addresses
      });
    } else if (role === 'technician') {
      setIsTechnicianLoggedIn(true);
      const match = technicians.find(t => t.phone.replace(/\s+/g, '') === phoneNumber.replace(/\s+/g, ''));
      if (match) {
        setCurrentTechnician(match);
      }
    }
  };

  const registerNewPartner = (params: {
    displayName: string;
    phoneNumber: string;
    email: string;
    trades: ServiceCategoryType[];
    experienceYears: number;
    kycDocType: 'Aadhaar' | 'PAN' | 'Skill India Certificate';
    kycDocNumber: string;
    upiId: string;
    city: string;
    address?: string;
    rememberMe: boolean;
  }) => {
    const newTech: Technician = {
      id: `tech-${Date.now()}`,
      name: params.displayName,
      phone: params.phoneNumber,
      email: params.email,
      trades: params.trades,
      experienceYears: params.experienceYears,
      city: params.city,
      rating: 5.0,
      totalJobsCompleted: 0,
      avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
      isOnline: true,
      isVerified: false,
      kycDocType: params.kycDocType,
      kycDocNumber: params.kycDocNumber,
      bankAccount: {
        accountNumber: '•••• •••• 9921',
        ifsc: 'HDFC0001200',
        upiId: params.upiId
      },
      todayEarnings: 0,
      totalEarnings: 0,
      pendingPayout: 0
    };

    setTechnicians(prev => [newTech, ...prev]);
    setCurrentTechnician(newTech);
    setIsTechnicianLoggedIn(true);

    const userObj: AppUser = {
      uid: newTech.id,
      phoneNumber: params.phoneNumber,
      displayName: params.displayName,
      email: params.email,
      role: 'technician',
      trades: params.trades,
      experienceYears: params.experienceYears,
      kycDocType: params.kycDocType,
      kycDocNumber: params.kycDocNumber,
      isVerified: false,
      upiId: params.upiId,
      city: params.city,
      address: params.address,
      createdAt: new Date().toISOString()
    };

    setCurrentUser(userObj);
    setIsAuthenticated(true);

    if (params.rememberMe) {
      try {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(userObj));
      } catch {
        // ignore
      }
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsCustomerLoggedIn(false);
    setIsTechnicianLoggedIn(false);
    try {
      localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    } catch {
      // ignore
    }
  };

  const updateCustomerAddress = (newAddr: {
    label: 'Home' | 'Work' | 'Other';
    addressLine: string;
    city: string;
    pincode: string;
  }) => {
    const item = {
      id: `addr-${Date.now()}`,
      ...newAddr
    };
    setCustomer(prev => ({
      ...prev,
      addresses: [item, ...prev.addresses]
    }));
    if (currentUser) {
      const updated = { ...currentUser, address: newAddr.addressLine };
      setCurrentUser(updated);
      try {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  };

  // Backward-compatible Customer Auth
  const loginCustomer = (phone: string, name?: string) => {
    setIsCustomerLoggedIn(true);
    setCustomer(prev => ({
      ...prev,
      phone,
      name: name || prev.name
    }));
  };

  const registerCustomer = (name: string, phone: string, email: string, address: string) => {
    setIsCustomerLoggedIn(true);
    const newCust: CustomerUser = {
      id: `cust-${Date.now()}`,
      name,
      phone,
      email,
      addresses: [
        {
          id: `addr-${Date.now()}`,
          label: 'Home',
          addressLine: address,
          city: currentCity,
          pincode: '560034'
        }
      ]
    };
    setCustomer(newCust);
  };

  const logoutCustomer = () => {
    setIsCustomerLoggedIn(false);
  };

  // Technician Auth
  const loginTechnician = (phone: string) => {
    const match = technicians.find(t => t.phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));
    if (match) {
      setCurrentTechnician(match);
      setIsTechnicianLoggedIn(true);
      return true;
    }
    setCurrentTechnician(technicians[0]);
    setIsTechnicianLoggedIn(true);
    return true;
  };

  const registerTechnician = (data: {
    name: string;
    phone: string;
    email: string;
    trades: ServiceCategoryType[];
    experienceYears: number;
    city: string;
    kycDocType: 'Aadhaar' | 'PAN' | 'Skill India Certificate';
    kycDocNumber: string;
    upiId: string;
  }) => {
    registerNewPartner({
      displayName: data.name,
      phoneNumber: data.phone,
      email: data.email,
      trades: data.trades,
      experienceYears: data.experienceYears,
      kycDocType: data.kycDocType,
      kycDocNumber: data.kycDocNumber,
      upiId: data.upiId,
      city: data.city,
      rememberMe: true
    });
  };

  const logoutTechnician = () => {
    setIsTechnicianLoggedIn(false);
  };

  const toggleTechnicianOnline = (techId: string) => {
    setTechnicians(prev =>
      prev.map(t => (t.id === techId ? { ...t, isOnline: !t.isOnline } : t))
    );
    if (currentTechnician.id === techId) {
      setCurrentTechnician(prev => ({ ...prev, isOnline: !prev.isOnline }));
    }
  };

  const approveTechnicianKyc = (techId: string) => {
    setTechnicians(prev =>
      prev.map(t => (t.id === techId ? { ...t, isVerified: true } : t))
    );
    if (currentTechnician.id === techId) {
      setCurrentTechnician(prev => ({ ...prev, isVerified: true }));
    }
  };

  const rejectTechnicianKyc = (techId: string) => {
    setTechnicians(prev => prev.filter(t => t.id !== techId));
  };

  // Commission & Payouts
  const updateCommissionSettings = (newSettings: Partial<CommissionSettings>) => {
    setCommissionSettings(prev => ({ ...prev, ...newSettings }));
  };

  const requestPayout = (technicianId: string, amount: number) => {
    const tech = technicians.find(t => t.id === technicianId);
    if (!tech) return;

    const newPayout: PayoutRecord = {
      id: `PAY-${Date.now().toString().slice(-4)}`,
      technicianId,
      technicianName: tech.name,
      amount,
      upiId: tech.bankAccount.upiId,
      status: 'settled',
      requestedAt: new Date().toISOString(),
      settledAt: new Date().toISOString(),
      referenceNumber: `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`
    };

    setPayouts(prev => [newPayout, ...prev]);
    setTechnicians(prev =>
      prev.map(t =>
        t.id === technicianId
          ? { ...t, pendingPayout: Math.max(0, t.pendingPayout - amount) }
          : t
      )
    );
    if (currentTechnician.id === technicianId) {
      setCurrentTechnician(prev => ({
        ...prev,
        pendingPayout: Math.max(0, prev.pendingPayout - amount)
      }));
    }
  };

  const processPayout = (payoutId: string) => {
    setPayouts(prev =>
      prev.map(p =>
        p.id === payoutId
          ? {
              ...p,
              status: 'settled',
              settledAt: new Date().toISOString(),
              referenceNumber: `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`
            }
          : p
      )
    );
  };

  // Create Booking
  const createBooking = ({
    serviceId,
    scheduledDate,
    scheduledTimeSlot,
    address,
    notes,
    paymentMethod
  }: {
    serviceId: string;
    scheduledDate: string;
    scheduledTimeSlot: string;
    address: string;
    notes?: string;
    paymentMethod: PaymentMethod;
  }): Booking => {
    const service = services.find(s => s.id === serviceId) || services[0];
    
    const cityPincodes: Record<string, string> = {
      'Indore': '452001',
      'Bhopal': '462016',
      'Ujjain': '456010',
      'Dewas': '455001',
      'Bengaluru': '560034',
      'Mumbai': '400053',
      'Delhi-NCR': '110048',
      'Hyderabad': '500033'
    };

    const availableTech = technicians.find(
      t => t.city.toLowerCase() === currentCity.toLowerCase() && t.isOnline && t.isVerified && t.trades.includes(service.category)
    ) || technicians.find(
      t => t.city.toLowerCase() === currentCity.toLowerCase() && t.trades.includes(service.category)
    ) || technicians.find(
      t => t.isOnline && t.isVerified && t.trades.includes(service.category)
    ) || technicians[0];

    const visitingCharges = commissionSettings.platformConvenienceFee;
    const price = service.startingPrice;
    const discount = 20;
    const taxableSubtotal = price + visitingCharges - discount;
    const taxes = Math.round((taxableSubtotal * commissionSettings.gstPct) / 100);
    const totalAmount = taxableSubtotal + taxes;

    const commissionPct =
      service.category === 'electrician'
        ? commissionSettings.electricianCommissionPct
        : commissionSettings.plumberCommissionPct;
    
    const adminCommission = Math.round((price * commissionPct) / 100) + visitingCharges;
    const technicianPayout = totalAmount - adminCommission;

    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const newBookingId = `QF-${Math.floor(7050 + Math.random() * 900)}`;

    const newBooking: Booking = {
      id: newBookingId,
      serviceId: service.id,
      serviceTitle: service.title,
      category: service.category,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAddress: address,
      city: currentCity,
      pincode: cityPincodes[currentCity] || '452001',
      scheduledDate,
      scheduledTimeSlot,
      notes,
      status: 'assigned',
      technicianId: availableTech.id,
      technicianName: availableTech.name,
      technicianPhone: availableTech.phone,
      technicianRating: availableTech.rating,
      technicianAvatar: availableTech.avatar,
      technicianEtaMinutes: 20,
      technicianCurrentLocation: { lat: 12.9352, lng: 77.6245 },
      startOtp: randomOtp,
      price,
      visitingCharges,
      discount,
      taxes,
      totalAmount,
      commissionRate: commissionPct,
      adminCommission,
      technicianPayout,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    setActiveBookingId(newBooking.id);
    return newBooking;
  };

  // Update Booking Status
  const updateBookingStatus = (
    bookingId: string,
    newStatus: BookingStatus,
    otpProvided?: string
  ): { success: boolean; message?: string } => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found' };

    if (newStatus === 'in_progress' && otpProvided) {
      if (otpProvided.trim() !== booking.startOtp) {
        return { success: false, message: 'Invalid start OTP. Please ask the customer for the 4-digit code.' };
      }
    }

    setBookings(prev =>
      prev.map(b => {
        if (b.id !== bookingId) return b;
        const updated = { ...b, status: newStatus };
        if (newStatus === 'completed') {
          updated.paymentStatus = 'paid';
        }
        return updated;
      })
    );

    if (newStatus === 'completed' && booking.technicianId) {
      setTechnicians(prev =>
        prev.map(t => {
          if (t.id !== booking.technicianId) return t;
          return {
            ...t,
            totalJobsCompleted: t.totalJobsCompleted + 1,
            todayEarnings: t.todayEarnings + booking.technicianPayout,
            totalEarnings: t.totalEarnings + booking.technicianPayout,
            pendingPayout: t.pendingPayout + booking.technicianPayout
          };
        })
      );
    }

    return { success: true };
  };

  // Customer Management
  const [customers, setCustomers] = useState<CustomerUser[]>(INITIAL_CUSTOMERS);
  const [firestoreSyncStatus, setFirestoreSyncStatus] = useState({
    isConnected: true,
    lastSynced: 'Just now',
    latencyMs: 38
  });

  const deleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };

  const toggleCustomerStatus = (customerId: string) => {
    setCustomers(prev =>
      prev.map(c =>
        c.id === customerId
          ? { ...c, status: c.status === 'suspended' ? 'active' : 'suspended' }
          : c
      )
    );
  };

  const reassignBookingTechnician = (bookingId: string, technicianId: string) => {
    const tech = technicians.find(t => t.id === technicianId);
    if (!tech) return;
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId
          ? {
              ...b,
              technicianId: tech.id,
              technicianName: tech.name,
              technicianPhone: tech.phone,
              technicianRating: tech.rating,
              technicianAvatar: tech.avatar
            }
          : b
      )
    );
  };

  const deleteBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const toggleTechnicianSuspension = (techId: string) => {
    setTechnicians(prev =>
      prev.map(t =>
        t.id === techId ? { ...t, isSuspended: !t.isSuspended } : t
      )
    );
  };

  const updateTechnicianRating = (techId: string, newRating: number) => {
    setTechnicians(prev =>
      prev.map(t => (t.id === techId ? { ...t, rating: newRating } : t))
    );
  };

  const disbursePayout = (payoutId: string) => {
    setPayouts(prev =>
      prev.map(p =>
        p.id === payoutId
          ? {
              ...p,
              status: 'settled',
              settledAt: new Date().toISOString(),
              referenceNumber: `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`
            }
          : p
      )
    );
  };

  const addCustomerReviewReply = (bookingId: string, reply: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId && b.review
          ? {
              ...b,
              review: { ...b.review, adminReply: reply }
            }
          : b
      )
    );
  };

  const deleteReview = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, review: undefined } : b))
    );
  };

  const triggerFirestoreSync = async () => {
    setFirestoreSyncStatus(prev => ({ ...prev, latencyMs: 24, lastSynced: 'Syncing...' }));
    await new Promise(r => setTimeout(r, 600));
    setFirestoreSyncStatus({
      isConnected: true,
      lastSynced: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      latencyMs: Math.floor(25 + Math.random() * 20)
    });
  };

  // Add Review
  const addReview = (bookingId: string, rating: number, comment: string, tags: string[]) => {
    const rev = {
      rating,
      comment,
      tags,
      createdAt: new Date().toISOString()
    };

    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, review: rev } : b))
    );
  };

  const updateBookingPaymentStatus = (bookingId: string, status: PaymentStatus, transactionRef?: string) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          const now = new Date().toISOString();
          return {
            ...b,
            paymentStatus: status,
            paidAt: status === 'paid' ? (b.paidAt || now) : undefined,
            transactionRef: transactionRef || b.transactionRef || (status === 'paid' ? `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}` : b.transactionRef)
          };
        }
        return b;
      })
    );
  };

  return (
    <QuickFixContext.Provider
      value={{
        activeRole,
        setActiveRole,
        viewMode,
        setViewMode,
        showCodeInspector,
        setShowCodeInspector,
        showFirebaseConfig,
        setShowFirebaseConfig,
        showAuthModal,
        setShowAuthModal,
        showProfileDrawer,
        setShowProfileDrawer,
        currentUser,
        isAuthenticated,
        authenticateUser,
        registerNewPartner,
        logoutUser,
        updateCustomerAddress,
        currentCity,
        setCurrentCity,
        services,
        selectedCategory,
        setSelectedCategory,
        customer,
        isCustomerLoggedIn,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        bookings,
        activeBookingId,
        setActiveBookingId,
        createBooking,
        updateBookingStatus,
        addReview,
        technicians,
        currentTechnician,
        isTechnicianLoggedIn,
        loginTechnician,
        registerTechnician,
        logoutTechnician,
        toggleTechnicianOnline,
        approveTechnicianKyc,
        rejectTechnicianKyc,
        commissionSettings,
        updateCommissionSettings,
        payouts,
        requestPayout,
        processPayout,
        disbursePayout,
        customers,
        deleteCustomer,
        toggleCustomerStatus,
        reassignBookingTechnician,
        deleteBooking,
        toggleTechnicianSuspension,
        updateTechnicianRating,
        addCustomerReviewReply,
        deleteReview,
        updateBookingPaymentStatus,
        firestoreSyncStatus,
        triggerFirestoreSync
      }}
    >
      {children}
    </QuickFixContext.Provider>
  );
};

export const useQuickFix = () => {
  const context = useContext(QuickFixContext);
  if (!context) {
    throw new Error('useQuickFix must be used within a QuickFixProvider');
  }
  return context;
};
