import { Incident, Deal, Discussion, Weather, AQHI, MTRStatus, BusArrival } from '../types';

export interface GeoLocated {
  lat: number;
  lng: number;
  distance?: number;
}

export type IncidentType = 'accident' | 'event' | 'weather' | 'traffic' | 'other';

export interface Incident extends GeoLocated {
  id: string;
  type: IncidentType;
  title: string;
  description: string;
  image?: string;
  createdAt: Date;
  userId: string;
  upvotes: number;
}

export type DealCategory = 'food' | 'shopping' | 'entertainment';

export interface Deal extends GeoLocated {
  id: string;
  merchantId: string;
  merchantName: string;
  title: string;
  description: string;
  discount: string;
  expiry: Date;
  category: DealCategory;
}

export interface Discussion extends GeoLocated {
  id: string;
  district: string;
  title: string;
  content: string;
  image?: string;
  authorId: string;
  authorName: string;
  isAnonymous: boolean;
  createdAt: Date;
  commentCount: number;
}

export interface Comment {
  id: string;
  discussionId: string;
  content: string;
  authorId: string;
  authorName: string;
  isAnonymous: boolean;
  createdAt: Date;
}

export interface Weather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  uvIndex: number;
  description: string;
  icon: string;
}

export interface AQHI {
  district: string;
  value: number;
  level: 'low' | 'medium' | 'high' | 'very-high';
}

export interface MTRStatus {
  line: string;
  status: 'normal' | 'delayed' | 'partial';
  message?: string;
}

export interface BusArrival extends GeoLocated {
  stopId: string;
  route: string;
  destination: string;
  eta: number;
  capacity: 'high' | 'medium' | 'low';
}

export type EventType = 'concert' | 'exhibition' | 'festival' | 'sports';

export interface Event extends GeoLocated {
  id: string;
  type: EventType;
  title: string;
  venue: string;
  date: string;
  time: string;
  price: string;
  image?: string;
  attendees: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  language: 'zh-TW' | 'zh-CN' | 'en';
  district: string;
  favorites: string[];
}

export type RootTabParamList = {
  Map: undefined;
  Info: undefined;
  Profile: undefined;
};
