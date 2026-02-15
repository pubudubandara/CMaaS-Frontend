import { jwtDecode } from 'jwt-decode';
import api from './axios';

// --- 1. Interfaces for API Calls ---
export interface RegisterData {
  organizationName: string;
  adminName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

// --- 2. Interfaces for User Data (Frontend Use) ---

// Backend Token 
interface DecodedToken {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string; // User ID
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string; // Email
  "FullName": string; // Simple Key
  "TenantId": string; // Simple Key
  "TenantName": string; // Organization Name
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string; // Role
  exp: number; // Expiry
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  tenantId: number;
  tenantName: string;
  role: string;
}

// --- 3. Auth Functions ---

export const registerCompany = async (data: RegisterData): Promise<any> => {
  try {
    const response = await api.post('/Auth/register-company', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/Auth/login', data);
    const token = response.data.token || response.data; // Sometimes just returns string

    if (token) {
      localStorage.setItem('token', token);
    }
    return { token };
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

// --- 4. Token Decoding Function (The Magic Part) ✨ ---
export const getUser = (): User | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem('token'); // Just remove expired token
      return null;
    }

    // Map the messy token keys to clean user properties
    return {
      id: parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]),
      email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      fullName: decoded.FullName, 
      tenantId: parseInt(decoded.TenantId),
      tenantName: decoded.TenantName,
      role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    };
  } catch (error) {
    console.error("Failed to decode token", error);
    return null;
  }
};

// Helper to check if logged in
export const isAuthenticated = (): boolean => {
  return !!getUser();
};