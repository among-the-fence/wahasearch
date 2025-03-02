import { SelectionEntry } from "@/lib/models/gameData";

export interface SummaryCardProps {
    entry: SelectionEntry;
    openDetails: (entry: SelectionEntry) => void;
}

export const SummaryCard = ({entry, openDetails}: SummaryCardProps) => {

    const unitprofiles = entry.profiles.filter(p => p.typeName == "Unit"); 
    const multiProfiles = entry.selectionEntryGroups?.[0]?.selectionEntries?.filter(p => p.type == "model");

    if (entry.name == "Corsair Voidscarred") {
        console.log(entry);
        console.log(multiProfiles);
    }

    return (
        <div key={entry.id} className="bg-white rounded-lg shadow-lg p-4" onClick={() => openDetails(entry)}>
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