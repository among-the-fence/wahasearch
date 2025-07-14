import { FILTERS_KEYWORDS, FILTERS_LEGENDS, FILTERS_FACTION, FILTERS_POINTS, LEGENDS_ALL, LEGENDS_NONE, LEGENDS_ONLY } from "@/lib/constants";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChangeEvent, useEffect, useState } from "react";
import { formData, SearchFormData } from "@/lib/models/searchFormData";

export interface SearchFormProps {
    applyFunction: (form: SearchFormData) => void;
}

export const SearchBar = ({ applyFunction }: SearchFormProps) => {
    const [localFormState, setLocalFormState] = useState(formData);

    useEffect(() => {
        setLocalFormState(formData);
    }, []);

    useEffect(() => {
        const timeOutId = setTimeout(() => applyFunction(localFormState), 500);
        return () => clearTimeout(timeOutId);
    }, [localFormState]);

    const updateLocalFormState = (field: string, e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length == 0) {
            localFormState.formData.delete(field)
            setLocalFormState(new SearchFormData(localFormState.formData));
        }
        else {
            localFormState.formData.set(field, e.target.value);
            setLocalFormState(new SearchFormData(localFormState.formData));
        }
    }

    const handleClear = () => {
        const cleared = new Map<string, string>();
        cleared.set(FILTERS_LEGENDS, LEGENDS_NONE);
        setLocalFormState(new SearchFormData(cleared));
        applyFunction(new SearchFormData(cleared));
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '80%' }}>
            <input
                type="keyword"
                placeholder="bugs, dw, infantry, grenade, fly, transport"
                style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd' }}
                autoFocus
                value={localFormState.get(FILTERS_KEYWORDS)?.toString() || ""}
                onChange={e => updateLocalFormState(FILTERS_KEYWORDS, e)} />
            <button
                style={{
                    padding: '12px 16px',
                    background: '#7B8FA1',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
                onClick={handleClear}
            >
                x
            </button>
        </div>
    );
}

export const SearchForm = ({ applyFunction }: SearchFormProps) => {
    const [localFormState, setLocalFormState] = useState(formData);

    useEffect(() => {
        setLocalFormState(formData);
    }, []);

    useEffect(() => {
        const timeOutId = setTimeout(() => applyFunction(localFormState), 500);
        return () => clearTimeout(timeOutId);
    }, [localFormState]);

    const updateLocalFormState = (field: string, e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length == 0) {
            localFormState.formData.delete(field)
            setLocalFormState(new SearchFormData(localFormState.formData));
        }
        else {
            localFormState.formData.set(field, e.target.value);
            setLocalFormState(new SearchFormData(localFormState.formData));
        }
    }

    const updateLegendsState = (value: string[]) => {
        console.log(value);
        if (value.length >= 2) {
            localFormState.set(FILTERS_LEGENDS, LEGENDS_ALL);
        }
        else if (value.length == 0 || value.includes("current")) {
            localFormState.set(FILTERS_LEGENDS, LEGENDS_NONE);
        }
        else {
            localFormState.set(FILTERS_LEGENDS, LEGENDS_ONLY);
        }
        setLocalFormState(new SearchFormData(localFormState.formData));
        applyFunction(localFormState);
    }

    const handleClear = () => {
        const cleared = new Map<string, string>();
        cleared.set(FILTERS_LEGENDS, LEGENDS_NONE);
        setLocalFormState(new SearchFormData(cleared));
        applyFunction(new SearchFormData(cleared));
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ marginBottom: '1rem', color: '#1d4ed8' }}>Search</h2>
                <button
                    type="button"
                    onClick={handleClear}
                    style={{
                        background: 'transparent',
                        border: '1px solid #e5e7eb', // lighter border
                        borderRadius: '4px',
                        padding: '0.15em 0.7em',
                        color: '#6b7280', // subtle gray
                        fontWeight: 400,
                        fontSize: '0.95em',
                        cursor: 'pointer',
                        marginLeft: '0.5em',
                        marginBottom: 0,
                        transition: 'background 0.15s',
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = '#f3f4f6')}
                    onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
                >
                    Clear
                </button>
            </div>
            <div>
                <h2>Keywords</h2>
                <input
                    type="keyword"
                    placeholder="dw, lethal, chaos"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    autoFocus
                    value={localFormState.get(FILTERS_KEYWORDS)?.toString() || ""}
                    onChange={e => updateLocalFormState(FILTERS_KEYWORDS, e)} />
            </div>

            <div style={{ marginTop: '1em' }}>
                <h2>Faction</h2>
                <input
                    type="text"
                    placeholder="Space Marines, Orks, etc."
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    value={localFormState.get(FILTERS_FACTION)?.toString() || ""}
                    onChange={e => updateLocalFormState(FILTERS_FACTION, e)} />
            </div>

            <div style={{ marginTop: '1em' }}>
                <h2>Points</h2>
                <input
                    type="text"
                    placeholder="200, <=100, >50, ==75"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    value={localFormState.get(FILTERS_POINTS)?.toString() || ""}
                    onChange={e => updateLocalFormState(FILTERS_POINTS, e)} />
            </div>

            <div style={{ marginTop: '1em' }}>
                <ToggleGroup defaultValue={["current"]} className="col-span-3" type="multiple" onValueChange={e => updateLegendsState(e)}>
                    <ToggleGroupItem className="border-2" defaultChecked={true} value="current" aria-label="Toggle current">
                        Current
                    </ToggleGroupItem>
                    <ToggleGroupItem className="border-2" value="legends" aria-label="Toggle legends">
                        Legends
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
    );
}