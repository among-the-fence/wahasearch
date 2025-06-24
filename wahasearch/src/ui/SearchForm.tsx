import { FILTERS_KEYWORDS, FILTERS_LEGENDS, FILTERS_FACTION, FILTERS_POINTS, LEGENDS_ALL, LEGENDS_NONE, LEGENDS_ONLY } from "@/lib/constants";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChangeEvent, useEffect, useState } from "react";

export interface SearchFormProps {
    applyFunction: (form: Map<String, String>) => void;
    initialFormState: Map<String, String>;
}

export const SearchForm = ({ applyFunction, initialFormState }: SearchFormProps) => {
    const [localFormState, setLocalFormState] = useState(initialFormState);

    useEffect(() => {
        const timeOutId = setTimeout(() => applyFunction(localFormState), 500);
        return () => clearTimeout(timeOutId);
    }, [localFormState]);

    const updateLocalFormState = (field: string, e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length == 0) {
            localFormState.delete(field)
            setLocalFormState(new Map(localFormState));
        }
        else {
            setLocalFormState(new Map(localFormState).set(field, e.target.value));
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
        setLocalFormState(new Map(localFormState));
        applyFunction(localFormState);
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
                    onChange={e => updateLocalFormState(FILTERS_KEYWORDS, e)} />
            </div>

            <div style={{ marginTop: '1em' }}>
                <h2>Faction</h2>
                <input
                    type="text"
                    placeholder="Space Marines, Orks, etc."
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd' }}
                    onChange={e => updateLocalFormState(FILTERS_FACTION, e)} />
            </div>

            <div style={{ marginTop: '1em' }}>
                <h2>Points</h2>
                <input
                    type="text"
                    placeholder="200, <=100, >50, ==75"
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ddd' }}
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