// src/components/molecules/CheckBoxGroupCard.tsx

import React from 'react';
import Grid from '../atoms/Grid';
import CheckBox from '../atoms/CheckBox';

interface CheckBoxGroupCardProps {
    title: string;
    options: { label: string; value: string }[];
    selectedValues: string[];
    onChange: (value: string) => void;
    columns: number;
    columnsMd?: number;
}

const CheckBoxGroupCard: React.FC<CheckBoxGroupCardProps> = ({
    title,
    options,
    selectedValues,
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
                        <CheckBox
                            key={option.value}
                            value={option.value}
                            checked={selectedValues.includes(option.value)}
                            onChange={onChange}
                            label={option.label}
                        />
                    ))}
                </Grid>
            </div>
        </div>
    );
};

export default CheckBoxGroupCard;
