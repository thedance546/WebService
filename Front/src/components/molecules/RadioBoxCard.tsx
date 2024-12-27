// src/components/molecules/RadioBoxCard.tsx

import React from 'react';
import Grid from '../atoms/Grid';
import RadioBox from '../atoms/RadioBox';

interface RadioBoxCardProps {
    title: string;
    name: string;
    options: { label: string; value: string }[];
    selectedValue: string;
    onChange: (value: string) => void;
    columns: number;
    columnsMd?: number;
}

const RadioBoxCard: React.FC<RadioBoxCardProps> = ({
    title,
    name,
    options,
    selectedValue,
    onChange,
    columns,
    columnsMd,
}) => {
    return (
        <div className="card mb-3">
            <div className="card-header">{title}</div>
            <div className="card-body">
                <Grid columns={columns} columnsMd={columnsMd}>
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
                </Grid>
            </div>
        </div>
    );
};

export default RadioBoxCard;

