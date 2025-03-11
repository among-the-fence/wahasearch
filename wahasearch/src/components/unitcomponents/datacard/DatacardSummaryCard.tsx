import { DataCard } from "@/lib/models/datacard/datacard";
import { BaseCard } from "../BaseCard";


export interface DatacardSummaryCardProps {
    entry: DataCard;
}

export const DatacardSummaryCard = ({entry}: DatacardSummaryCardProps) => {
    const headerclass = `text-md font-semibold ${entry.isLegends ? "text-slate-500" : ""}`;
    return (
        <BaseCard itemId={entry.id}>
            <h1 className={headerclass} >{entry.name}</h1>
            {/* {unitprofiles.length == 0 && <p>{JSON.stringify(entry)}</p>} */}
        </BaseCard>
    );
};