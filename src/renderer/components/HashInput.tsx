import React, { useState } from 'react';

type HashInputProps = {
  value: string;
  name: string;
  placeholder?: string;
  onChange: (newValue: string) => void;
};

export const HashInput = ({
  value,
  name,
  placeholder,
  onChange,
}: HashInputProps) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  let displayValue = inputValue;
  if (inputValue) {
    displayValue = inputValue.slice(0, 6) + '...' + inputValue.slice(-4);
  }

  return (
    <div className="relative">
      <input
        type="text"
        name={name}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="input input-sm w-full font-mono"
      />
    </div>
  );
};
