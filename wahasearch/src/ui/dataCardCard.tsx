import { Card } from "@/components/ui/card";
import { DataCard } from "@/lib/models/datacard";
import { ReactNode } from "react";

export interface DataCardCardProps {
    datacard: DataCard
}

export const DataCardCard = ({ datacard }: DataCardCardProps) => {
    const headingStyle = datacard.legends ? { color: "red" } : { color: "black" };
    const modelProfiles = datacard.profiles.filter((p) => {
        return p.characteristicKeys.includes("M")
    })
    const charOrder = ["M", "T", "W", "OC", "SV"];

    return (
        <Card >
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
    );
};