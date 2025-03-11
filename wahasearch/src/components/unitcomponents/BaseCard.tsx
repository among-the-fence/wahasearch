import * as React from 'react';

export interface BaseCardProps {
    itemId: string;
    children?: React.ReactNode;
};

export const BaseCard: React.FC<BaseCardProps> = ({ itemId, children }) => {
    return (
        <div key={itemId} className="bg-white rounded-lg shadow-lg p-4">
            {children}
        </div>
    );
}
