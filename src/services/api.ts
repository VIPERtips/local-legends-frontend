
import { User, Business, Review, BusinessClaim, PaginatedResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Auth endpoints
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });
    return this.handleResponse(response);
  }

  // Business endpoints
  async getBusinesses(page = 0, size = 10): Promise<PaginatedResponse<Business>> {
    const response = await fetch(
      `${API_BASE_URL}/businesses?page=${page}&size=${size}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  async getBusiness(id: number): Promise<Business> {
    const response = await fetch(`${API_BASE_URL}/businesses/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async searchBusinesses(params: {
    category?: string;
    location?: string;
    name?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Business>> {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.location) queryParams.append('location', params.location);
    if (params.name) queryParams.append('name', params.name);
    queryParams.append('page', (params.page || 0).toString());
    queryParams.append('size', (params.size || 10).toString());

    const response = await fetch(
      `${API_BASE_URL}/businesses/search?${queryParams}`,
      {
        headers: this.getAuthHeaders(),
      }
    );
    return this.handleResponse(response);
  }

  async createBusiness(businessData: Omit<Business, 'id' | 'averageRating' | 'reviewCount' | 'createdAt' | 'updatedAt'>): Promise<Business> {
    const response = await fetch(`${API_BASE_URL}/businesses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(businessData),
    });
    return this.handleResponse(response);
  }

  async getTopRatedBusinesses(category?: string): Promise<Business[]> {
    const url = category 
      ? `${API_BASE_URL}/businesses/top-rated?category=${category}`
      : `${API_BASE_URL}/businesses/top-rated`;
    
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Review endpoints
  async getBusinessReviews(businessId: number): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/reviews`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async addReview(businessId: number, reviewData: {
    rating: number;
    comment?: string;
  }): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/reviews`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    return this.handleResponse(response);
  }

  // Business claim endpoints
  async submitClaim(businessId: number, evidence: string): Promise<BusinessClaim> {
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}/claim`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ evidence }),
    });
    return this.handleResponse(response);
  }

  async getClaims(): Promise<BusinessClaim[]> {
    const response = await fetch(`${API_BASE_URL}/admin/claims`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateClaimStatus(claimId: number, status: 'APPROVED' | 'REJECTED'): Promise<BusinessClaim> {
    const response = await fetch(`${API_BASE_URL}/admin/claims/${claimId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
