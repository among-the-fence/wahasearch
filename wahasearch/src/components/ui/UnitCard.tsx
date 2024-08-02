
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Datasheet, Stat } from "@/models/faction";
import { compileStats } from "@/lib/unitformatter";

interface UnitCardProps {
    unit: Datasheet
    onclick: (unit:Datasheet) => void
}

export const UnitCard = ({unit, onclick}: UnitCardProps) => {
    const clicktrigger = () => {
        onclick(unit);
    }
    const headerStyle = (unit.legends && "text-slate-500") || "text-black-50"
    return (
    <Card key={unit.uuid}>
        <CardHeader>
            <CardTitle className={headerStyle} onClick={clicktrigger} style={{color: unit.colours?.header}}>{unit.name}</CardTitle>
            {unit.stats.map(sb => <CardDescription key={sb.uuid}>{compileStats(unit, sb)}</CardDescription>)}
            {unit.leads && (<p>{unit.leads.units.join(", ")}</p>)}
            {unit.compiledKeywords && (<p>{unit.compiledKeywords.join(", ")}</p>)}
        </CardHeader>
    </Card>);
}
