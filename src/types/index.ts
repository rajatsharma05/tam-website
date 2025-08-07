export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registeredCount: number;
  image?: string;
  posterUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  teamType?: 'individual' | 'team';
  minTeamSize?: number;
  maxTeamSize?: number;
  price?: number; // Price in INR
}

export interface Registration {
  id: string;
  eventId: string;
  eventName: string;
  registrantName: string;
  rollNumber: string;
  departmentSection: string;
  email: string;
  phone: string;
  qrCode: string;
  checkInTime?: Date | { seconds: number } | string;
  isCheckedIn: boolean;
  createdAt: Date | { seconds: number } | string;
  // Team event support
  teamName?: string;
  teamLeaderEmail?: string;
  teamMembers?: Array<{
    name: string;
    rollNumber: string;
    departmentSection: string;
    phone: string;
  }>;
  // Payment support
  paymentMethod?: 'online' | 'cash';
  paymentStatus?: 'pending' | 'approved' | 'rejected';
  paymentAmount?: number;
  paymentApprovedAt?: Date | { seconds: number } | string;
  paymentApprovedBy?: string;
  // Referral tracking
  referralCode?: string;
}

export interface Checkin {
  id: string;
  eventId: string;
  eventName: string;
  registrantName: string;
  rollNumber: string;
  departmentSection: string;
  email: string;
  phone: string;
  qrCode: string;
  checkInTime: Date | { seconds: number } | string;
  isCheckedIn: boolean;
  // Team event support
  memberName?: string;
  teamName?: string;
  teamLeaderEmail?: string;
  // Payment support
  paymentMethod?: 'online' | 'cash' | 'N/A';
  paymentStatus?: 'pending' | 'approved' | 'rejected' | 'N/A';
  paymentAmount?: number;
  // Referral tracking
  referralCode?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  isAdmin: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CheckinResult {
  success: boolean;
  message: string;
  registration?: {
    eventName: string;
    registrantName: string;
    email: string;
    rollNumber: string;
    departmentSection: string;
    phone: string;
    checkInTime: Date | { seconds: number } | string;
  };
  error?: string;
  excelData?: string;
}

 