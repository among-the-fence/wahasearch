import { FILTERS_KEYWORDS, FILTERS_FACTION, FILTERS_POINTS, FILTERS_TOUGHNESS, CURRENT_DATASHEETS, KOTC_DATASHEETS, LEGENDS_DATASHEETS } from "@/lib/constants";

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
        cleared.set(CURRENT_DATASHEETS, "true");
        cleared.set(LEGENDS_DATASHEETS, "false");
        cleared.set(KOTC_DATASHEETS, "false");
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

    const handleLegendSwitch = (selected: string) => {
        const updated = new Map(localFormState.formData);
        if (selected === SearchFormData.LEGENDS_GROUP_CURRENT) {
            updated.set(CURRENT_DATASHEETS, "true");
            updated.set(LEGENDS_DATASHEETS, "false");
        } else if (selected === SearchFormData.LEGENDS_GROUP_ALL) {
            updated.set(CURRENT_DATASHEETS, "true");
            updated.set(LEGENDS_DATASHEETS, "true");
        } else if (selected === SearchFormData.LEGENDS_GROUP_LEGENDS) {
            updated.set(CURRENT_DATASHEETS, "false");
            updated.set(LEGENDS_DATASHEETS, "true");
        }
        setLocalFormState(new SearchFormData(updated));
        applyFunction(new SearchFormData(updated));
    };

    const handleClear = () => {
        const cleared = new Map<string, string>();
        cleared.set(CURRENT_DATASHEETS, "true");
        cleared.set(LEGENDS_DATASHEETS, "false");
        cleared.set(KOTC_DATASHEETS, "false");
        setLocalFormState(new SearchFormData(cleared));
        applyFunction(new SearchFormData(cleared));
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ marginBottom: '1rem', color: '#1d4ed8' }}>Search</h2>
                <label style={{ display: 'flex', alignItems: 'center', marginRight: '1em' }}>
                    <input
                        type="checkbox"
                        checked={localFormState.get(KOTC_DATASHEETS) === "true"}
                        onChange={e => {
                            const updated = new Map(localFormState.formData);
                            updated.set(KOTC_DATASHEETS, e.target.checked ? "true" : "false");
                            setLocalFormState(new SearchFormData(updated));
                            applyFunction(new SearchFormData(updated));
                        }}
                        style={{ marginRight: 6 }}
                    /> KotC
                </label>
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
                        marginLeft: '0.5em',
                    }}
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
                <h2>Toughness</h2>
                <input
                    type="text"
                    placeholder="2, <=1, >5, ==7"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    value={localFormState.get(FILTERS_TOUGHNESS)?.toString() || ""}
                    onChange={e => updateLocalFormState(FILTERS_TOUGHNESS, e)} />
            </div>

            <div style={{ marginTop: '1em', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    display: 'inline-flex',
                    overflow: 'hidden',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    background: '#fff',
                }}>
                    <label style={{ cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="datasheetType"
                            id="current"
                            className="sr-only"
                            checked={localFormState.legendsGroupSelected() === SearchFormData.LEGENDS_GROUP_CURRENT}
                            onChange={() => handleLegendSwitch(SearchFormData.LEGENDS_GROUP_CURRENT)}
                        />
                        <span style={{
                            position: 'relative',
                            display: 'inline-flex',
                            alignItems: 'center',
                            height: '100%',
                            padding: '0.5em 1.5em 0.5em 2.2em',
                            fontSize: '1rem',
                            background: localFormState.legendsGroupSelected() === SearchFormData.LEGENDS_GROUP_CURRENT ? '#bfdbfe' : 'transparent',
                            transition: 'background 0.15s',
                        }}>
                            <span style={{
                                width: 8,
                                height: 8,
                                background: '#3b82f6',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '50%',
                                left: 12,
                                transform: 'translateY(-50%)',
                                display: localFormState.legendsGroupSelected() === SearchFormData.LEGENDS_GROUP_CURRENT ? 'inline-block' : 'none',
                            }}></span>
                            Current
                        </span>
                    </label>
                    <label style={{ cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="datasheetType"
                            id="all"
                            className="sr-only"
                            checked={localFormState.legendsGroupSelected() === SearchFormData.LEGENDS_GROUP_ALL}
                            onChange={() => handleLegendSwitch(SearchFormData.LEGENDS_GROUP_ALL)}
                        />
                        <span style={{
                            position: 'relative',
                            display: 'inline-flex',
                            alignItems: 'center',
                            height: '100%',
                            padding: '0.5em 1.5em 0.5em 2.2em',
                            fontSize: '1rem',
                            background: localFormState.legendsGroupSelected() === SearchFormData.LEGENDS_GROUP_ALL ? '#bbf7d0' : 'transparent',
                            transition: 'background 0.15s',
                        }}>
                            <span style={{
                                width: 8,
                                height: 8,
                                background: '#22c55e',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '50%',
                                left: 12,
                                transform: 'translateY(-50%)',
                                display: localFormState.legendsGroupSelected() === SearchFormData.LEGENDS_GROUP_ALL ? 'inline-block' : 'none',
                            }}></span>
                            All
                        </span>
                    </label>
                    <label style={{ cursor: 'pointer' }}>
                        <input
                            type="radio"
                            name="datasheetType"
                            id="legends"
                            className="sr-only"
                            checked={localFormState.legendsGroupSelected() === SearchFormData.LEGENDS_GROUP_LEGENDS}
                            onChange={() => handleLegendSwitch(SearchFormData.LEGENDS_GROUP_LEGENDS)}
                        />
                        <span style={{
                            position: 'relative',
                            display: 'inline-flex',
                            alignItems: 'center',
                            height: '100%',
                            padding: '0.5em 1.5em 0.5em 2.2em',
                            fontSize: '1rem',
                            background: localFormState.legendsGroupSelected() === SearchFormData.LEGENDS_GROUP_LEGENDS ? '#ddd6fe' : 'transparent',
                            transition: 'background 0.15s',
                        }}>
                            <span style={{
                                width: 8,
                                height: 8,
                                background: '#8b5cf6',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '50%',
                                left: 12,
                                transform: 'translateY(-50%)',
                                display: localFormState.legendsGroupSelected() === SearchFormData.LEGENDS_GROUP_LEGENDS ? 'inline-block' : 'none',
                            }}></span>
                            Legends
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
}