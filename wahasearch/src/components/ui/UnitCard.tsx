
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Datasheet } from "@/models/faction";
import { compileStats } from "@/lib/unitformatter";
import { StarFilled, StarOpen } from "./starIcons";

interface UnitCardProps {
    unit: Datasheet
    onclick: (unit:Datasheet|null) => void
    updateFavorites: (e: MouseEvent, unitName: string) => void
    isFavorite: boolean
}

export const UnitCard = ({unit, onclick, updateFavorites, isFavorite}: UnitCardProps) => {

    const clicktrigger = () => {
        onclick(unit);
    }
    const headerStyle = ((unit.legends && "text-slate-500") || "text-black-50")

    return (
    <Card key={unit.uuid} onClick={clicktrigger} className="relative cursor-pointer">
        <button
            type="button"
            onClick={e => updateFavorites(e, unit.name)}
            className="absolute top-1 left-1 rounded-md text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
            <span className="absolute -inset-2.5" />
            <span className="sr-only">Close panel</span>
            {isFavorite && <StarFilled aria-hidden="true" /> }
            {!isFavorite && <StarOpen aria-hidden="true" /> }
        </button>
        <CardHeader >
            <CardTitle className={headerStyle} style={{color: unit.colours?.header}}>
                {unit.name}
            </CardTitle>

        </CardHeader>
        <CardContent>
            {unit.stats.map(sb => <CardDescription key={sb.uuid}>{compileStats(unit, sb)}</CardDescription>)}
            {/* {unit.leads && (<p>{unit.leads.units.join(", ")}</p>)} */}
        </CardContent>
    </Card>);
}
