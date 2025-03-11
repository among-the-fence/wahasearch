import { SelectionEntry } from "@/lib/models/gameData";

export interface SummaryCardProps {
    entry: SelectionEntry;
    openDetails: (entry: SelectionEntry) => void;
}

export const SummaryCard = ({entry, openDetails}: SummaryCardProps) => {
    return (
        <div key={entry.id} className="bg-white rounded-lg shadow-lg p-4" onClick={() => openDetails(entry)}>
            <h1>{entry.name}</h1>
            {/* {unitprofiles.length == 0 && <p>{JSON.stringify(entry)}</p>} */}
        </div>
    );
};