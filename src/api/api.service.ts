import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

// Set up Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token'); 
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default class ApiService {

  static createUser(data: any): Promise<AxiosResponse> {
    return apiClient.post('/user/create', data);
  }

  static getAllUsers(): Promise<AxiosResponse> {
    return apiClient.get('/user/list');
  }

  static getUserById(userId: string): Promise<AxiosResponse> {
    return apiClient.get(`/user/profile/${userId}`);
  }

  static updateUser(userId: string, data: any): Promise<AxiosResponse> {
    return apiClient.patch(`/user/${userId}`, data);
  }

  static deleteUser(userId: string): Promise<AxiosResponse> {
    return apiClient.delete(`/user/${userId}`);
  }

  static createAdmin(): Promise<AxiosResponse> {
    return apiClient.post('/user/createAdmin');
  }

  // KYC APIs
  static submitKyc(data: FormData): Promise<AxiosResponse> {
    return apiClient.post('/kyc/submit', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static getKycStatus(): Promise<AxiosResponse> {
    return apiClient.get('/kyc/status');
  }

  static updateKycStatus(userId: string, status: string): Promise<AxiosResponse> {
    return apiClient.patch(`/kyc/status/${userId}`, { status });
  }

  static getAllKycSubmissions(): Promise<AxiosResponse> {
    return apiClient.get('/kyc/submissions');
  }

  static getKpiStats(): Promise<AxiosResponse> {
    return apiClient.get('/kyc/kpis');
  }

  static login(email: string, password: string): Promise<AxiosResponse> {
    return apiClient.post('/auth/login', { email, password });
  }

  
  static resetPassword(email: string, password: string): Promise<AxiosResponse> {
    return apiClient.post('/auth/reset', { email, password });
  }

 
  static signup(userData:any): Promise<AxiosResponse> {
    return apiClient.post('/auth/signup', userData);
  }
}