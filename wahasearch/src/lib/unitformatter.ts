import { Datasheet, Stat } from "@/models/faction"

export function compileStats(unit: Datasheet, statblock: Stat) {
    let out = ""
    if (unit.stats.length > 1){
        out += `${statblock.name}: `
    }
    if (statblock.m != null) {
        out += `M:${statblock.m} `
    }
    if (statblock.t != null) {
        out += `T:${statblock.t} `
    }
    if (statblock.sv != null) {
        out += `SV:${statblock.sv}`
    }
    if (unit.abilities?.invul?.value?.length > 0) {
        out += `/${unit.abilities?.invul?.value}+`
    }
    if (unit.abilities?.core?.length > 0) {
        const fnp_entries = unit.abilities.core.filter(i => i.includes("Feel No Pain"));
        if (fnp_entries.length > 0) {
            out += `/${fnp_entries.join(',').replace('Feel No Pain ', '')}++`;
        }
    }

    out += " "
    if (statblock.w != null) {
        out += `W:${statblock.w} `
    }
    if (statblock.oc != null) {
        out += `OC:${statblock.oc} `
    }
    if (statblock.ld != null) {
        out += `LD:${statblock.ld} `
    }
    return out;
}
