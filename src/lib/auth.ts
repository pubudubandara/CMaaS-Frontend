import api from './axios';

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

export const registerCompany = async (data: RegisterData): Promise<void> => {
  try {
    const response = await api.post('/Auth/register-company', data);
    // Assuming successful registration, maybe auto-login or just return
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/Auth/login', data);
    const token = response.data.token; // Assuming response is { token: "..." }
    if (token) {
      localStorage.setItem('token', token);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};