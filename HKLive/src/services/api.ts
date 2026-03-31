// API Configuration
// Backend API URL - replace with your actual backend URL when deployed

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://YOUR_BACKEND_URL/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

// Simple API client
export const apiClient = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { method = 'GET', body, headers = {} } = options;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Request failed' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: 'Network error' };
  }
};

// API Endpoints
export const api = {
  // Incidents
  getIncidents: (lat: number, lng: number, radius: number = 5) =>
    apiClient(`/incidents?lat=${lat}&lng=${lng}&radius=${radius}`),
  reportIncident: (data: any) => apiClient('/incidents', { method: 'POST', body: data }),
  upvoteIncident: (id: string) => apiClient(`/incidents/${id}/upvote`, { method: 'POST' }),

  // Deals
  getDeals: (lat: number, lng: number) =>
    apiClient(`/deals?lat=${lat}&lng=${lng}`),
  getDeal: (id: string) => apiClient(`/deals/${id}`),

  // Events
  getEvents: (lat: number, lng: number, date?: string) =>
    apiClient(`/events?lat=${lat}&lng=${lng}${date ? `&date=${date}` : ''}`),
  getEvent: (id: string) => apiClient(`/events/${id}`),
  markInterested: (id: string) => apiClient(`/events/${id}/interested`, { method: 'POST' }),

  // Discussions
  getDiscussions: (district?: string, sort: 'distance' | 'time' = 'distance') =>
    apiClient(`/discussions?district=${district || ''}&sort=${sort}`),
  createDiscussion: (data: any) => apiClient('/discussions', { method: 'POST', body: data }),
  getDiscussion: (id: string) => apiClient(`/discussions/${id}`),
  addComment: (discussionId: string, content: string) =>
    apiClient(`/discussions/${discussionId}/comments`, { method: 'POST', body: { content } }),

  // Transport
  getMtrStatus: () => apiClient('/transport/mtr-status'),
  getBusArrival: (stopId: string) => apiClient(`/transport/bus-arrival?stop_id=${stopId}`),

  // Weather
  getAqhi: () => apiClient('/weather/aqhi'),
  getForecast: () => apiClient('/weather/forecast'),
};

// For development - use mock data when API is not available
export const useMockData = !isFirebaseConfigured();
