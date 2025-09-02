import React from 'react';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SelectFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    options: readonly string[];
    error?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    name,
    value,
    onChange,
    options,
    error,
    placeholder = "Select an option",
    required = false,
    disabled = false
}) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative">
                <Select
                    value={value}
                    onValueChange={onChange}
                    disabled={disabled}
                >
                    <SelectTrigger
                        id={name}
                        className={`w-full ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${name}-error` : undefined}
                    >
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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