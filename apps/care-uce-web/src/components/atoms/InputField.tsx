import React from 'react';
export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}
export const InputField = ({ label, error, ...props }: InputFieldProps) => (
  <div className="flex flex-col w-full mb-4">
    <label className="mb-1 text-sm font-semibold text-gray-700">{label}</label>
    <input
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);
