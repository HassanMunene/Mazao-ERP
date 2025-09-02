import type { User } from "./index"

export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    location?: string;
    contactInfo?: string;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    user?: User;
    token?: string;
}

export interface ValidationError {
    field: string;
    message: string;
}