import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const FormField = ({ label, error, children }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-400">{label}</label>
      )}
      {children}
      {error && <p className="mt-0.5 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export const FormInput = React.forwardRef(({ className = '', error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none text-sm ${className}`}
      {...props}
    />
  );
});

FormInput.displayName = 'FormInput';

export const FormSelect = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});

FormSelect.displayName = 'FormSelect';

export default function Form({
  schema,
  defaultValues,
  onSubmit,
  children,
  className = '',
  style,
}) {
  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  const handleSubmit = (data) => {
    if (onSubmit) onSubmit(data, form);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={className} style={style}>
      {typeof children === 'function' ? children(form) : children}
    </form>
  );
}

export const FormActions = ({ children, className = '' }) => {
  return (
    <div className={`flex gap-3 mt-4 ${className}`}>
      {children}
    </div>
  );
};

export const FormButton = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/25',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      className={`flex-1 px-3 py-2 rounded-lg transition-all duration-200 font-semibold text-sm ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};