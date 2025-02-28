import { useState } from "react";

export function TransactionInput({
  type,
  placeholder,
  desc,
  value,
  onChange,
  required = false, // Make it optional with a default value
}: {
  type: string;
  placeholder: string;
  desc: string;
  value?: string | number; // Optional value
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Optional onChange for controlled input
  required?: boolean; // Make this optional
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
      />
      <label className="absolute duration-300 top-3 -z-1 origin-0 text-gray"></label>
    </div>
  );
}