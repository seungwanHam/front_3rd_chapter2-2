import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = ({ children, label, ...props }: SelectProps) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select
        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};