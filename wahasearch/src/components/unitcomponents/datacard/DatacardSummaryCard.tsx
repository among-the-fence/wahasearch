import { DataCard } from "@/lib/models/datacard/datacard";
import { BaseCard } from "../BaseCard";
import { stringifywithoutraw } from "@/lib/util";


export interface DatacardSummaryCardProps {
    entry: DataCard;
}

export const DatacardSummaryCard = ({entry}: DatacardSummaryCardProps) => {
    const headerclass = `text-md font-semibold ${entry.isLegends ? "text-slate-500" : ""}`;
    return (
        <BaseCard itemId={entry.id}>
            <div onClick={() => {console.log(entry);}}>
                <h1 className={headerclass} >{entry.name}</h1>
                {<p>{stringifywithoutraw(entry.getDisplayedProfile())}</p>}
            </div>
        </BaseCard>
    );
};