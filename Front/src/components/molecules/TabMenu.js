// src/components/molecules/TabMenu.js
import React from 'react';
import NavItem from '../atoms/NavItem';

const TabMenu = ({ tabs }) => (
    <div className="d-flex">
        {tabs.map((tab) => (
            <NavItem key={tab.path} path={tab.path} label={tab.label} />
        ))}
    </div>
);

export default TabMenu;
