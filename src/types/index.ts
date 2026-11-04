export type ServiceCategoryType = 'electrician' | 'plumber';

export interface ServiceItem {
  id: string;
  category: ServiceCategoryType;
  title: string;
  hindiTitle?: string;
  description: string;
  startingPrice: number;
  durationMinutes: number;
  rating: number;
  reviewsCount: number;
  warrantyDays: number;
  badge?: string;
  included: string[];
}

export type BookingStatus = 
  | 'requested'
  | 'assigned'
  | 'technician_en_route'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cash';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  category: ServiceCategoryType;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  city: string;
  pincode: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  notes?: string;
  status: BookingStatus;
  technicianId?: string;
  technicianName?: string;
  technicianPhone?: string;
  technicianRating?: number;
  technicianAvatar?: string;
  technicianEtaMinutes?: number;
  technicianCurrentLocation?: { lat: number; lng: number };
  startOtp: string;
  price: number;
  visitingCharges: number;
  discount: number;
  taxes: number; // GST 18%
  totalAmount: number;
  commissionRate: number; // e.g. 15%
  adminCommission: number;
  technicianPayout: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionRef?: string;
  paidAt?: string;
  createdAt: string;
  review?: {
    rating: number;
    comment: string;
    tags: string[];
    createdAt: string;
    adminReply?: string;
  };
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
  trades: ServiceCategoryType[];
  experienceYears: number;
  city: string;
  rating: number;
  totalJobsCompleted: number;
  avatar: string;
  isOnline: boolean;
  isVerified: boolean;
  isSuspended?: boolean;
  kycDocType: 'Aadhaar' | 'PAN' | 'Skill India Certificate';
  kycDocNumber: string;
  bankAccount: {
    accountNumber: string;
    ifsc: string;
    upiId: string;
  };
  todayEarnings: number;
  totalEarnings: number;
  pendingPayout: number;
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  status?: 'active' | 'suspended';
  totalBookings?: number;
  totalSpent?: number;
  addresses: {
    id: string;
    label: 'Home' | 'Work' | 'Other';
    addressLine: string;
    city: string;
    pincode: string;
  }[];
}

export interface CommissionSettings {
  electricianCommissionPct: number; // e.g. 12%
  plumberCommissionPct: number;     // e.g. 15%
  platformConvenienceFee: number;   // e.g. ₹29
  gstPct: number;                   // 18%
  minPayoutThreshold: number;       // e.g. ₹500
}

export interface PayoutRecord {
  id: string;
  technicianId: string;
  technicianName: string;
  amount: number;
  upiId: string;
  status: 'processing' | 'settled' | 'failed';
  requestedAt: string;
  settledAt?: string;
  referenceNumber: string;
}

export type ActiveRole = 'customer' | 'technician' | 'admin';
export type UserRole = 'customer' | 'technician' | 'admin';

export interface AppUser {
  uid: string;
  phoneNumber: string;
  displayName: string;
  email: string;
  role: UserRole;
  address?: string;
  city: string;
  pincode?: string;
  // Partner specific fields
  trades?: ServiceCategoryType[];
  experienceYears?: number;
  kycDocType?: 'Aadhaar' | 'PAN' | 'Skill India Certificate';
  kycDocNumber?: string;
  isVerified?: boolean;
  upiId?: string;
  createdAt: string;
}

export interface AuthSession {
  currentUser: AppUser | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
}
