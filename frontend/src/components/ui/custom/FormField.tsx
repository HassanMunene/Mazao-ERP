import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
    label: string;
    type?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    error,
    placeholder,
    required = false,
    disabled = false
}) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative">
                <Input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`pr-10 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                />
                {error && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                )}
            </div>
            {error && (
                <p id={`${name}-error`} className="text-sm text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};