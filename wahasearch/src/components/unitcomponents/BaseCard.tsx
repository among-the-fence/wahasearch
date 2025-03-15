import * as React from 'react';

export interface BaseCardProps {
    itemId: string;
    children?: React.ReactNode;
    handleClick?: () => void;
};

export const BaseCard: React.FC<BaseCardProps> = ({ itemId, children, handleClick }) => {
    return (
        <div key={itemId} onClick={handleClick} className="bg-white rounded-lg shadow-lg p-4">
            {children}
        </div>
    );
}
