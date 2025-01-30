// src/components/molecules/RadioBoxGroup.tsx

import React from 'react';
import RadioBox from '../atoms/RadioBox';

interface RadioBoxGroupProps {
    name: string;
    options: { label: string; value: string }[];
    selectedValue: string;
    onChange: (value: string) => void;
}

const RadioBoxGroup: React.FC<RadioBoxGroupProps> = ({ name, options, selectedValue, onChange }) => {
    return (
        <div>
            {options.map((option) => (
                <RadioBox
                    key={option.value}
                    name={name}
                    value={option.value}
                    checked={selectedValue === option.value}
                    onChange={onChange}
                    label={option.label}
                />
            ))}
        </div>
    );
};

export default RadioBoxGroup;
