import { SelectionEntry } from "@/lib/gameData";

export interface SummaryCardProps {
    entry: SelectionEntry;
}

export const SummaryCard = ({entry}: SummaryCardProps) => {

    const unitprofiles = entry.profiles.filter(p => p.typeName == "Unit"); 
    const multiProfiles = entry.selectionEntryGroups?.[0]?.selectionEntries;

    return (
        <div key={entry.id} className="bg-white rounded-lg shadow-lg p-4">
            <h1>{entry.name}</h1>
            <p>{entry.type}</p>
            {unitprofiles.map(p => (
                <div key={p.id}>
                    {p.characteristics.map(c => `${c.name}: ${c.value}`).join(", ")}
                </div>
            ))}
            {multiProfiles && multiProfiles.map(p => (
                <div key={p.id}>
                    <h2>{p.name}</h2>
                    {p.profiles.map(p => (
                        <div key={p.id}>
                            {p.characteristics.map(c => `${c.name}: ${c.value}`).join(", ")}
                        </div>
                    ))}
                </div>
            ))}
            {/* {unitprofiles.length == 0 && <p>{JSON.stringify(entry)}</p>} */}
        </div>
    );
};