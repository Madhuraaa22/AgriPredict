
export interface User {
  username: string;
  email: string;
  region: {
    state: string;
    city: string;
  };
}

export enum Page {
  Login = 'login',
  Register = 'register',
  CropDiseaseDetection = 'crop-disease-detection',
  Marketplace = 'marketplace',
  GovernmentSchemes = 'government-schemes',
  WaterLevelMonitor = 'water-level-monitor',
}

export enum Language {
  EN = 'en',
  HI = 'hi',
  MR = 'mr',
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isTyping?: boolean;
}

export enum MarketplaceCategory {
    Crops = 'crops',
    Machineries = 'machineries',
    Chemicals = 'chemicals',
    Fertilizers = 'fertilizers'
}

export interface Product {
    id: string;
    category: MarketplaceCategory;
    name: string;
    image: string;
    price: number;
    unit: string;
    quantity?: number;
    expiryDate?: string;
    sellOrRent?: 'sell' | 'rent';
}

export interface GovernmentScheme {
    id: string;
    title: { [key in Language]: string };
    description: { [key in Language]: string };
    eligibility: { [key in Language]: string };
    benefits: { [key in Language]: string };
    link: string;
}

export interface DiseaseDetectionResult {
    diseaseName: string;
    solution: string;
}

export interface NotificationState {
  id: number;
  message: string;
  type: 'success' | 'error';
}
