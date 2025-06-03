import { Card } from "@/components/ui/card";
import { DataCard } from "@/lib/models/datacard";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export interface DataCardCardProps {
    datacard: DataCard
}

export const DataCardCard = ({ datacard }: DataCardCardProps) => {
    const [open, setOpen] = useState(false);
    const headingStyle = datacard.legends ? { color: "red" } : { color: "black" };
    const modelProfiles = datacard.profiles.filter((p) => {
        return p.characteristicKeys.includes("M")
    })
    const charOrder = ["M", "T", "W", "OC", "SV"];


    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Card onClick={() => setOpen(true)} style={{ cursor: 'pointer' }}>
                    <div style={{ padding: '1rem' }}>
                        <div style={{
                            ...headingStyle,
                            fontWeight: 'bold',
                            fontSize: '1.3em',
                            textAlign: 'center',
                            marginBottom: '0.5em',
                        }}>{datacard.name}</div>
                        {modelProfiles.length > 1 && (
                            <div style={{ textAlign: "center" }}>
                                {modelProfiles.map((p, idx) => {
                                    // Prepare characteristic values, fallback to empty string if missing
                                    const getText = (key: string) => p.characteristics.get(key)?.["#text"] ?? "";
                                    const charString = charOrder.map(key => `${key}:${getText(key)}`).join(",");
                                    return (
                                        <div key={idx} style={{ marginBottom: 4 }}>
                                            <strong>{p.name}:</strong>{charString}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {modelProfiles.length === 1 && (
                            <div style={{ textAlign: "center" }}>
                                {modelProfiles.map((p, idx) => {
                                    const charString = charOrder.map(key => `${key}: ${p.characteristics.get(key)?.["#text"] ?? ""}`).join(", ");
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
            </SheetTrigger>
            <SheetContent side="right" style={{ maxWidth: "100%", width: '800px' }}>
                <SheetHeader>
                    <SheetTitle>Profiles for {datacard.name}</SheetTitle>
                </SheetHeader>
                <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '1em 0' }}>
                    {(() => {
                        // Group 1: profiles with 'M' characteristic
                        const group1 = datacard.profiles.filter(p => p.characteristics.has('M'));
                        // Group 2: profiles with 'Range' not "Melee"
                        const group2 = datacard.profiles.filter(p => !p.characteristics.has('M') && typeof p.characteristics.get('Range')?.['#text'] === 'string' && p.characteristics.get('Range')['#text'].toLowerCase() !== 'melee');
                        // Group 3: profiles with 'Range' === "Melee"
                        const group3 = datacard.profiles.filter(p => !p.characteristics.has('M') && typeof p.characteristics.get('Range')?.['#text'] === 'string' && p.characteristics.get('Range')['#text'].toLowerCase() === 'melee');
                        // Group 4: the rest
                        const group4 = datacard.profiles.filter(p => !p.characteristics.has('M') && (!p.characteristics.has('Range') || typeof p.characteristics.get('Range')?.['#text'] !== 'string'));

                        // Sort each group alphabetically by profile name
                        const byName = (a: any, b: any) => a.name.localeCompare(b.name);
                        group1.sort(byName);
                        group2.sort(byName);
                        group3.sort(byName);
                        group4.sort(byName);

                        // Concatenate all groups
                        const orderedProfiles = [...group1, ...group2, ...group3, ...group4];

                        return orderedProfiles.map((profile, idx) => (
                            <div key={idx} style={{ marginBottom: '1em', borderBottom: '1px solid #eee', paddingBottom: '0.5em' }}>
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
                            </div>
                        ));
                    })()}
                </div>
            </SheetContent>
        </Sheet>
    );
};
