export interface User {
    id: string;
    email: string;
    role: 'ADMIN' | 'FARMER';
    createdAt: string;
    profile?: Profile;
}

export interface Profile {
    id: string;
    fullName: string;
    location?: string;
    contactInfo?: string;
    avatar?: string;
}

export interface Crop {
    id: string;
    name: string;
    type: string;
    quantity: number;
    plantingDate: string;
    harvestDate?: string;
    status: string;
    description?: string;
    farmerId: string;
    farmer?: User;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
}