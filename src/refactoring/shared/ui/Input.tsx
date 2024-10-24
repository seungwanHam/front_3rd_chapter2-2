import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
}

export const Input = ({ label, id, ...props }: InputProps) => {
  return (
    <div className="mb-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1" >{label}</label>
      )}
      <input
        id={id}
        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
        {...props}
      />
    </div>
  );
};
