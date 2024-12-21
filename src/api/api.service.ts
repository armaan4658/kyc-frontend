import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter()


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

apiClient.interceptors.response.use(
  (response) => {
      return response;
  },
  (error) => {
      if (error.response) {
          if (error.status === 401 && error.response.data.message === "Invalid or expired token") {
              ElMessage.error('Session expired, please log in again.');
              localStorage.clear()
              router.push({path: '/login'}); 
          } 
      }
      return Promise.reject(error);
  }
);

export default class ApiService {

  static createUser(data: any): Promise<AxiosResponse> {
    return apiClient.post('/users/create', data);
  }

  static getAllUsers(page: number = 1, limit: number = 5): Promise<AxiosResponse> {
    return apiClient.get(`/users/list?page=${page}&limit=${limit}`);
  }

  static getUserById(userId: string): Promise<AxiosResponse> {
    return apiClient.get(`/users/profile/${userId}`);
  }

  static updateUser(userId: string, data: any): Promise<AxiosResponse> {
    return apiClient.patch(`/users/${userId}`, data);
  }

  static deleteUser(userId: string): Promise<AxiosResponse> {
    return apiClient.delete(`/users/${userId}`);
  }

  static createAdmin(): Promise<AxiosResponse> {
    return apiClient.post('/users/createAdmin');
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

  static getAllKycSubmissions(page: number = 1, limit: number = 5): Promise<AxiosResponse> {
    return apiClient.get(`/kyc/submissions?page=${page}&limit=${limit}`);
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