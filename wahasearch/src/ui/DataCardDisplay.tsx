import { Card } from "@/components/ui/card";
import { DataCard } from "@/lib/models/datacard";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import JsonRenderer from "./jsonRenderer";
import { Collapsible } from "@radix-ui/react-collapsible";
import { CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface DataCardDisplayProps {
    datacard: DataCard
}

const unitCharacteristicOrder = ["M", "T", "W", "OC", "SV"];
const weaponProfileOrder = ["A", "WS", "S", "AP", "D"]

export const DataCardDisplay = ({ datacard }: DataCardDisplayProps) => {
    const [open, setOpen] = useState(false);


    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <DataCardCard datacard={datacard} cardClick={async () => setOpen(true)} />
            </SheetTrigger>
            <SheetContent side="right" style={{ maxWidth: "100%", width: '800px', zIndex: 1200 }}>
                <SheetHeader>
                    <SheetTitle>
                        <div>
                            <div>
                                <div>{datacard.name} {datacard.legends ? "[Legends]" : ""}</div>
                                {datacard.costs.length > 0 && (
                                    <div>({datacard.costString})</div>
                                )}
                            </div>
                            {datacard.factions.length > 0 &&
                                (<div>
                                    {datacard.factions.join(", ")}
                                </div>)}
                        </div>
                    </SheetTitle>
                </SheetHeader>
                <DataCardSheet datacard={datacard} cardClick={async () => setOpen(false)} />
                <SheetFooter>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => {
                                const faction = datacard.factions.length > 0 ? datacard.factions[0] : '';
                                const query = encodeURIComponent(`Warhammer 40k ${faction} ${datacard.name}`);
                                window.open(`https://www.google.com/search?tbm=isch&q=${query}`, '_blank');
                            }}
                            style={{
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '8px 14px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                            }}
                            title="Search Google Images for this unit"
                        >
                            📷
                        </button>
                        <button
                            onClick={() => {
                                const faction = datacard.factions.length > 0 ? datacard.factions[0] : '';
                                window.open(`https://www.google.com/search?q=Wahapedia ${faction} ${datacard.name}&btnI=1`, '_blank');
                            }}
                            style={{
                                borderRadius: '4px',
                                padding: '8px 10px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="Wahapedia"
                        >
                            <img src="/wahasearch/wahapediaicon.png" alt="Wahapedia" style={{ height: 20, width: 20, display: 'block' }} />
                        </button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export interface DataCardCardProps {
    datacard: DataCard
    cardClick: () => {}
}
import React from "react";

const DataCardCard = React.forwardRef<HTMLDivElement, DataCardCardProps>(
    ({ datacard, cardClick }, ref) => {
        const modelProfiles = datacard.profiles.filter((p) => {
            return p.characteristicKeys.includes("M")
        })

        const headingStyle = datacard.legends ? { color: "grey" } : { color: "black" };
        return (
            <Card ref={ref} onClick={cardClick} style={{ cursor: 'pointer' }}>
                <div style={{ padding: '1rem' }}>
                    <div style={{
                        ...headingStyle,
                        fontWeight: 'bold',
                        fontSize: '1.3em',
                        textAlign: 'center',
                        marginBottom: '0.2em',
                    }}>{datacard.name}</div>
                    {datacard.costs.length > 0 && (
                        <div style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: '#0ea5e9', // Tailwind's sky-500
                            fontSize: '0.8em',
                            letterSpacing: '0.04em',
                            marginBottom: '0.5em',
                        }}>
                            ({datacard.costString})
                        </div>
                    )}

                    {modelProfiles.length > 1 && (
                        <div style={{ textAlign: "center" }}>
                            {modelProfiles.map((p, idx) => {
                                // Prepare characteristic values, fallback to empty string if missing
                                const getText = (key: string) => p.characteristics.get(key)?.["#text"] ?? "";
                                const charString = unitCharacteristicOrder.map(key => `${key}:${getText(key)}`).join(",");
                                return (
                                    <div key={idx} style={{ marginBottom: 4 }}>
                                        <strong>{p.name}</strong>
                                        <p>{charString}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {modelProfiles.length === 1 && (
                        <div style={{ textAlign: "center" }}>
                            {modelProfiles.map((p, idx) => {
                                const charString = unitCharacteristicOrder.map(key => `${key}: ${p.characteristics.get(key)?.["#text"] ?? ""}`).join(", ");
                                return (
                                    <div key={idx} style={{ marginBottom: 4 }}>
                                        {charString}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Card>
        );
    }
);
DataCardCard.displayName = "DataCardCard";

const DataCardSheet = ({ datacard, cardClick }: DataCardCardProps) => {
    const byName = (a: any, b: any) => a.name.localeCompare(b.name);
    const modelProfiles = datacard.profiles.filter(p => p.characteristics.has('M')).sort(byName);
    const rangedProfiles = datacard.profiles.filter(p => !p.characteristics.has('M') && typeof p.characteristics.get('Range')?.['#text'] === 'string' && p.characteristics.get('Range')['#text'].toLowerCase() !== 'melee').sort(byName);
    const meleeProfiles = datacard.profiles.filter(p => !p.characteristics.has('M') && typeof p.characteristics.get('Range')?.['#text'] === 'string' && p.characteristics.get('Range')['#text'].toLowerCase() === 'melee').sort(byName);
    const abilityProfiles = datacard.profiles.filter(p => !p.characteristics.has('M') && (!p.characteristics.has('Range') || typeof p.characteristics.get('Range')?.['#text'] !== 'string')).sort(byName);

    return (
        <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '1em 0' }}>
            <div>

                {datacard.keywords.length > 0 &&
                    (<div>
                        {datacard.keywords.join(", ")}
                    </div>)}
                {modelProfiles.length > 1 && (
                    modelProfiles.map((p, idx) => {
                        // Prepare characteristic values, fallback to empty string if missing
                        const getText = (key: string) => p.characteristics.get(key)?.["#text"] ?? "";
                        const charString = unitCharacteristicOrder.map(key => `${key}:${getText(key)}`).join(", ");
                        return (
                            <div key={idx} style={{ marginBottom: 4 }}>
                                <strong>{p.name}</strong>
                                <p>{charString}</p>
                            </div>
                        );
                    })
                )}
                {modelProfiles.length === 1 && (
                    modelProfiles.map((p, idx) => {
                        const charString = unitCharacteristicOrder.map(key => `${key}: ${p.characteristics.get(key)?.["#text"] ?? ""}`).join(", ");
                        return (
                            <div key={idx} style={{ marginBottom: 4 }}>
                                {charString}
                            </div>
                        );
                    })
                )}
            </div>
            {rangedProfiles.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1em' }}>
                    <thead>
                        <tr>
                            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Name</th>
                            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Range</th>
                            {weaponProfileOrder.map((char) => (
                                <th key={char} style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>{char}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rangedProfiles.map((profile, idx) => {
                            const range = profile.characteristics.get('Range')?.['#text'] ?? '';
                            const rowValues = weaponProfileOrder.map((key) => profile.characteristics.get(key)?.['#text'] ?? '');
                            const keywords = profile.characteristics.get('Keywords')?.['#text'] ?? '';
                            return (
                                <>
                                    <tr key={profile.name + '-main'}>
                                        <td rowSpan={2} style={{ fontWeight: 'bold', verticalAlign: 'top', borderBottom: '1px solid #eee' }}>{profile.name}</td>
                                        <td style={{ borderBottom: '1px solid #eee' }}>{range}</td>
                                        {rowValues.map((val, i) => (
                                            <td key={i} style={{ borderBottom: '1px solid #eee' }}>{val}</td>
                                        ))}
                                    </tr>
                                    <tr key={profile.name + '-keywords'}>
                                        <td colSpan={weaponProfileOrder.length + 1} style={{ fontStyle: 'italic', color: '#666', borderBottom: '1px solid #eee' }}>
                                            {keywords}
                                        </td>
                                    </tr>
                                </>
                            );
                        })}
                    </tbody>
                </table>
            )}
            {meleeProfiles.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1em' }}>
                    <thead>
                        <tr>
                            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Name</th>
                            {weaponProfileOrder.map((char) => (
                                <th key={char} style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>{char}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {meleeProfiles.map((profile, idx) => {
                            const rowValues = weaponProfileOrder.map((key) => profile.characteristics.get(key)?.['#text'] ?? '');
                            const keywords = profile.characteristics.get('Keywords')?.['#text'] ?? '';
                            return (
                                <>
                                    <tr key={profile.name + '-main'}>
                                        <td rowSpan={2} style={{ fontWeight: 'bold', verticalAlign: 'top', borderBottom: '1px solid #eee' }}>{profile.name}</td>
                                        {rowValues.map((val, i) => (
                                            <td key={i} style={{ borderBottom: '1px solid #eee' }}>{val}</td>
                                        ))}
                                    </tr>
                                    <tr key={profile.name + '-keywords'}>
                                        <td colSpan={weaponProfileOrder.length + 1} style={{ fontStyle: 'italic', color: '#666', borderBottom: '1px solid #eee' }}>
                                            {keywords}
                                        </td>
                                    </tr>
                                </>
                            );
                        })}
                    </tbody>
                </table>
            )}
            {abilityProfiles.map((profile, idx) => {
                return (<div key={idx} style={{ marginBottom: '1em', borderBottom: '1px solid #eee', paddingBottom: '0.5em' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25em' }}>{profile.name}</div>
                    <div style={{ marginBottom: 0 }}>
                        {Array.from(profile.characteristics.entries())
                            .filter(([key, value]) => {
                                if (key !== 'Range') return true;
                                const text = value["#text"];
                                return !(typeof text === 'string' && text.trim().toLowerCase() === 'melee');
                            })
                            .map(([key, value]) => `${key}: ${value["#text"] ?? JSON.stringify(value)}`)
                            .join(", ")}
                    </div>
                </div>);
            })}
            <Collapsible >
                <CollapsibleTrigger>Debug</CollapsibleTrigger>
                <CollapsibleContent>
                    <div style={{ background: 'black' }}>
                        <JsonRenderer data={datacard} />
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>);

};