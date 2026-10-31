export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// 1. Normalize API and Socket URLs in one place
const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim();
// Strip any trailing slashes
const sanitizedUrl = rawApiUrl.replace(/\/+$/, '');
// Ensure API_BASE_URL always includes the /api prefix
export const API_BASE_URL = sanitizedUrl.endsWith('/api') ? sanitizedUrl : `${sanitizedUrl}/api`;
// Derive plain Socket.IO backend origin by stripping trailing /api and trailing slashes
export const SOCKET_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const BASE_URL = API_BASE_URL;

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;

  let url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const config: RequestInit = {
    method: customConfig.method || 'GET',
    credentials: 'include', // Automatically send and receive httpOnly JWT cookies
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...customConfig,
  };

  try {
    const response = await fetch(url, config);

    let result: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        (typeof result === 'object' && (result?.error || result?.message)) ||
        `Request failed with status ${response.status}`;

      // Handle 401 Unauthorized by notifying the auth context or redirecting if on a protected route
      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register') && !endpoint.includes('/auth/me')) {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }

      throw new ApiError(errorMessage, response.status, result);
    }

    return result as T;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network link failed. Is the server online?', 0);
  }
}
