// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_URL}/api/auth/login`,
    signup: `${API_URL}/api/auth/signup`,
  },
  user: {
    profile: `${API_URL}/api/user/profile`,
    account: `${API_URL}/api/user/account`,
    organizations: `${API_URL}/api/user/organizations`,
  },
  organizations: `${API_URL}/api/organizations`,
  jobs: `${API_URL}/api/jobs`,
};
