
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export interface Business {
  id: number;
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  businessId: number;
  userId: number;
  userFirstName: string;
  userLastName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface BusinessClaim {
  id: number;
  businessId: number;
  userId: number;
  userEmail: string;
  evidence: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  business: Business;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
