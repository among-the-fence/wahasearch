'use client'

import * as React from 'react';

export interface BaseCardProps {
    itemId: string;
    itemName: string;
    children?: React.ReactNode;
};

// export const BaseCard = ({itemId, itemName, children}: BaseCardProps) => {
//     return (
//         <div key={itemId} className="bg-white rounded-lg shadow-lg p-4">
//             <h1>{itemName}</h1>
//             <div>
//                 {children}
//             </div>
//         </div>);
// };

export const BaseCard: React.FC<BaseCardProps> = ({ itemId, itemName, children }) => {
    return (
        <div key={itemId} className="bg-white rounded-lg shadow-lg p-4">
            <h1>{itemName}</h1>
            <div>
                {children}
            </div>
        </div>
    );
}
