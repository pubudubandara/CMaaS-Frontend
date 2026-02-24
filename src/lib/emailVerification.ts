import axios from './axios';

export interface VerifyEmailRequest {
  email: string;
  token: string;
}

export interface ResendVerificationEmailRequest {
  email: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data?: {
    emailVerified: boolean;
    userId: string;
  };
}

/**
 * Verify user email with token
 */
export async function verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
  try {
    const response = await axios.post<VerifyEmailResponse>(
      '/api/Auth/verify-email',
      data
    );
    return response.data;
  } catch (error: any) {
    // Send error message directly
    throw new Error(error.response?.data?.message || 'Failed to verify email');
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(data: ResendVerificationEmailRequest): Promise<VerifyEmailResponse> {
  try {
    const response = await axios.post<VerifyEmailResponse>(
      '/api/Auth/resend-verification-email',
      data
    );
    return response.data;
  } catch (error: any) {
    // Send error message directly
    throw new Error(error.response?.data?.message || 'Failed to resend verification email');
  }
}