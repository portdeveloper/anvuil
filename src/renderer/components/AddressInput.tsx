import React, { useState } from 'react';
import Blockies from 'react-blockies';
import { isAddress } from 'viem';
import { Address } from 'viem';

type CommonInputProps = {
  value: Address | string;
  name: string;
  placeholder?: string;
  onChange: (newValue: Address | string) => void;
};

export const AddressInput = ({
  value,
  name,
  placeholder,
  onChange,
}: CommonInputProps) => {
  const [inputValue, setInputValue] = useState(value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="relative">
      <input
        type="text"
        name={name}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="input input-sm pl-8 w-full font-mono" // add padding to the input to make space for the blockie
      />
      {isAddress(inputValue) && (
        <div className="absolute top-0 left-0 h-full flex items-center">
          <Blockies
            className="!rounded-md ml-1"
            seed={value?.toLowerCase() as string}
            size={8}
            scale={3}
          />
        </div>
      )}
    </div>
  );
};
