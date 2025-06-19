import { useState } from "react";

export interface SearchFormProps {
    applyFunction: (form: Map<String, String>) => void;
}

export const SearchForm = ({applyFunction}: SearchFormProps) => {
    const updateKeywords = (x: String) => {
        console.log(x);
        const y = new Map<String, String>();
        y.set("keywords", x);
        applyFunction(y);
    }

    return (
        <div>
            <h2 style={{ marginBottom: '1rem', color: '#1d4ed8' }}>Search</h2>
            <div>
                <h2>Keywords</h2>
                <input
                    type="keyword"
                    placeholder="dw, lethal, chaos"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    autoFocus
                    onChange={e => updateKeywords(e.target.value)} />
            </div>
        </div>
    );
}