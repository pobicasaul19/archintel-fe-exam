import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import router from "@/router";
import { useAuthStore } from "@/stores/useAuthStore";


export interface ApiError {
  message: string;
  status?: number | null;
  details?: any;
}

interface ErrorResponse<T> {
  data?: T;
  metadata?: {
    message: string;
  };
}

export type RequestParam = Record<string, any>;
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

const authStore = useAuthStore();
const apiUrl = 'http://localhost:5000/api/'

export class HttpClient {
  protected axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: apiUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      timeout: 20000,
    });
  }

  private static handleResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return response.data;
  }

  private static translateAxiosError(error: AxiosError): ApiError {
    const statusCode = error.response?.status;
    const errorMessage = (error.response?.data as ErrorResponse<unknown>)?.metadata?.message
                         || 'An error occurred while processing your request.';
    const errorDetails = (error.response?.data as ErrorResponse<unknown>)?.data;

    if (statusCode === 401) {
      router.push({ name: 'Login' });
    }

    return {
      message: errorMessage,
      status: statusCode,
      details: errorDetails,
    };
  }

  private async request<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.request<T>({
        method,
        url: path,
        data,
        ...config,
      });
      return HttpClient.handleResponse(response);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw HttpClient.translateAxiosError(err);
      }
      throw err;
    }
  }

  public get<T>(path: string, params?: RequestParam): Promise<ApiResponse<T>> {
    return this.request('get', path, undefined, { params });
  }

  public post<T, P>(path: string, payload: P, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request('post', path, payload, config);
  }

  public put<T, P>(path: string, payload: P, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request('put', path, payload, config);
  }

  public delete<T>(path: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request('delete', path, undefined, config);
  }
}

const tokenInjector = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = authStore.token;
  config.headers = config.headers || {} as AxiosRequestHeaders;
  if (token) {
    (config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${token}`;
  }
  return config;
};


const authorizedClientError = (error: AxiosError): Promise<never> => {
  if (error.response?.status === 403) {
    router.push({ name: 'Unauthorized' });
  }
  return Promise.reject(error);
};

class AuthorizedHttpClient extends HttpClient {
  constructor() {
    super();
    this.axiosInstance.interceptors.request.use(tokenInjector);
    this.axiosInstance.interceptors.response.use(undefined, authorizedClientError);
  }
}

export const authorizedHttpClient = new AuthorizedHttpClient();
export const httpClient = new HttpClient();

