// API Service for HKLive App
// Connects to backend API

const API_BASE = 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Fetch with timeout
const fetchApi = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.log('API not available, using mock data');
    return { success: false, error: 'API not connected' };
  }
};

// Incidents API
export const getIncidents = () => fetchApi('/incidents');
export const reportIncident = (data: any) => fetchApi('/incidents');
export const upvoteIncident = (id: string) => fetchApi(`/incidents/${id}/upvote`);

// Deals API
export const getDeals = () => fetchApi('/deals');

// Events API
export const getEvents = () => fetchApi('/events');
export const markInterested = (id: string) => fetchApi(`/events/${id}/interested`);

// Discussions API
export const getDiscussions = () => fetchApi('/discussions');
export const createDiscussion = (data: any) => fetchApi('/discussions');

// Transport API
export const getMtrStatus = () => fetchApi('/transport/mtr-status');
export const getBusArrival = (stopId: string) => fetchApi(`/transport/bus-arrival?stop_id=${stopId}`);

// Weather API
export const getAqhi = () => fetchApi('/weather/aqhi');
export const getForecast = () => fetchApi('/weather/forecast');

// Auth API
export const login = (email: string, password: string) => 
  fetchApi('/auth/login');
export const register = (email: string, password: string, name: string) => 
  fetchApi('/auth/register');
export const getProfile = () => fetchApi('/auth/me');

// Use mock data when API is not available
export const USE_MOCK_DATA = true;
