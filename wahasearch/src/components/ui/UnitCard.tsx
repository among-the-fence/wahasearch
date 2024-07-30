
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

interface UnitCardProps {
    unit: any
}

function compileStats(unit: any) {
    let out = ""
    console.log(unit.stats);
    for (let i in unit.stats) {
        const statblock = unit.stats[i];
        if (statblock.hasOwnProperty('m'))
            out += "M:" + statblock.m + " "
        if (statblock.hasOwnProperty('t'))
            out += "T:" + statblock.t + " "
        // if (statblock.hasOwnProperty('m'))
        //     out += f"SV:{statblock
        //     out += f"SV:{statblock['sv']}"['sv']}"
        // if self.abilities and 'invul' in self.abilities and 'value' in self.abilities['invul']:
        //     out += f"/{self.abilities['invul']['value']}+"
        // if self.abilities and 'core' in self.abilities:
        //     fnp_list = list(filter(fnp_reg.match, self.abilities["core"]))
        //     if fnp_list and len(fnp_list) > 0:
        //         out += f"/{','.join(fnp_list).replace('Feel No Pain ', '')}++"
        // out += " "
        // if 'w' in statblock:
        //     out += f"W:{statblock['w']} "
        // if 'oc' in statblock:
        //     out += f"OC:{statblock['oc']} "
        // if 'ld' in statblock:
        //     out += f"LD:{statblock['ld']}"
    }
    return out;
}

export const UnitCard = ({unit}: UnitCardProps) => {
    
    return (
    <Card key={unit.id}>
        <CardHeader>
            <CardTitle>{unit.name}</CardTitle>
            <CardDescription>{compileStats(unit)}</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Card Content</p>
        </CardContent>
        <CardFooter>
            <p>Card Footer</p>
        </CardFooter>
    </Card>);
}
