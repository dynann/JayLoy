"use client";

import { useState, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: any;
}

export function TextInput({ type, placeholder, value, onChange }: InputProps) {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="input description-small"
    />
  );
}

export function PasswordInput({ placeholder, value, onChange }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input description-small"
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

// input box for transaction/add page
export function TransactionInput({
  type,
  placeholder,
  desc,
  value,
  onChange,
  maxLength,
  required = false, // Make it optional with a default value
}: {
  type: string;
  placeholder: string;
  desc: string;
  value?: string | number; // Optional value
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Optional onChange for controlled input
  required?: boolean; // Make this optional
  maxLength?: number;
}) {
  const [internalValue, setInternalValue] = useState<string | number>("");

  return (
    <div className="relative z-0 w-full m-2">
      <input
        type={type}
        placeholder={placeholder}
        value={value !== undefined ? value : internalValue} // Use value if provided, otherwise use internal state
        onChange={(e) => {
          if (onChange) {
            onChange(e); // Controlled mode
          } else {
            setInternalValue(e.target.value); // Uncontrolled mode
          }
        }}
        className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray-200"
        required={required} // Use the required prop
        maxLength={maxLength}
      />
      <label className="absolute duration-300 top-3 -z-1 origin-0 text-gray"></label>
    </div>
  );
}

export function TransparentInput({
  type,
  value,
  onChange,
  required = false, // Make it optional with a default value
}: {
  type: string;
  value?: string | number; // Optional value
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Optional onChange for controlled input
  required?: boolean; // Make this optional
  className?: any | undefined
}) {
  const [internalValue, setInternalValue] = useState<string | number>("");

  return (
    <div className="relative z-0 w-full m-2">
      <input
        type={type}
        value={value !== undefined ? value : internalValue} // Use value if provided, otherwise use internal state
        onChange={(e) => {
          if (onChange) {
            onChange(e); // Controlled mode
          } else {
            setInternalValue(e.target.value); // Uncontrolled mode
          }
        }}
        // className= {className}
        className="pt-3 pb-2 block w-full px-0 mt-0 bg-transparent border-0 border-b-1 appearance-none focus:outline-none focus:ring-0 focus:border-black border-gray text-right"
        required={required} // Use the required prop
      />
      <label className="absolute duration-300 top-3 -z-1 origin-0 text-gray"></label>
    </div>
  );
}

 