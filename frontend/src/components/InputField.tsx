/**
 * @file InputField.tsx
 * @description Reusable input component for forms.
 */

import React from 'react';

type Props = {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Reusable input field with label.
 */
const InputField = ({ label, type, name, value, onChange }: Props) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
    />
  </div>
);

export default InputField;
