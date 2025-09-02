export interface DashboardStats {
  totalFarmers: number;
  totalCrops: number;
  totalYield: number;
  activeRegions: number;
  farmersGrowth: number;
  cropsGrowth: number;
  yieldGrowth: number;
}

export interface CropDistribution {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RecentActivity {
  id: string;
  type: 'farmer_registered' | 'crop_added' | 'harvest_completed' | 'system_alert';
  title: string;
  description: string;
  timestamp: string;
  farmerName?: string;
  cropType?: string;
}

export interface FarmerRegionDistribution {
  region: string;
  farmerCount: number;
  cropCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}