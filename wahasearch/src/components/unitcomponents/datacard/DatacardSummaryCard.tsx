import { DataCard } from "@/lib/models/datacard/datacard";
import { BaseCard } from "../BaseCard";


export interface DatacardSummaryCardProps {
    entry: DataCard;
}

export const DatacardSummaryCard = ({entry}: DatacardSummaryCardProps) => {
    const headerclass = `inline text-md font-semibold ${entry.isLegends ? "text-slate-500" : ""}`;
    const oneProfile = entry.profiles.length == 1;
    return (
        <BaseCard itemId={entry.id}>
            <div onClick={() => {console.log(entry);}}>
                <div>
                    <h1 className={headerclass} >{entry.name}</h1>
                    <h4 className="inline"> ({entry.cost})</h4>
                </div>
                {entry.profiles.map(p => {
                    return (
                        <div className="inline" key={p.id}>
                            {!oneProfile && <h2 >{p.name} </h2>}
                            <p className="inline">M:{p.m}" </p>
                            <p className="inline">T:{p.t} </p>
                            <p className="inline">W:{p.w} </p>
                            <p className="inline">LD:{p.ld}+ </p>
                            <p className="inline">OC:{p.oc} </p>
                            <p className="inline">SV:{p.sv}+ </p>
                        </div>
                    );
                })}
            </div>
        </BaseCard>
    );
};