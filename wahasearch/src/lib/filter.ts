import { factions } from "./loadData";


const faction_nickname_map = {
    "astra militarum": ["am", "ig", "guard", "imperial guard"],
    "adepta sororitas": ["mommy", "sororitas", "senoritas", "sisters", "sob"],
    "blood angels": ["ba", "angels", "blood angles"],
    "dark angels": ["da", "angles", "dark angles"],
    "chaos knights": ["ck"],
    "chaos deamons": ["daemons", "demons"],
    "chaos space marines": ["csm", "chaos marines"],
    "death guard": ["dg"],
    "death watch": ["dw"],
    "drukhari": ["dark elves", "dark eldar", "bad elves", "dark elf", "bad elf"],
    "black templars": ["bt"],
    "adepta custodes": ["custodes"],
    "adepta mechanicus": ["admech"],
    "aeldari": ["elves", "elf", "eldar", "aeldar", "eldari", "aeldar", "legalos and friends"],
    "grey knights": ["gk"],
    "genestealer cults": ["gsc", "genestealer", "genestealers"],
    "imperial agents": ["ia"],
    "imperial knights": ["ik"],
    "space marines": ["sm", "marines"],
    "space wolves": ["wolves", "sw"],
    "votann": ["dwarves", "votan", "votann", "lov"],
    "world eaters": ["we", "eaters"],
    "orks": ["orcs", "ork", "orc"],
    "tyranids": ["nids", "bugs"],
    "tau empire": ["tau", "fish"],
    "thousand sons": ["tsons", "ksons", "1ksons", "dustyboiz", "dustyboys"],
    "necrons": ["necrons", "crons", "zombies"]
}

function findFactionName(text: string) {
    for (const [k,v] of Object.entries(faction_nickname_map)) {
        if (text == k|| v.includes(text))
            return k
    }
    return text
}

export function applyFilters(filters: Map<String, String>) {
    let flatDatasheets = factions.flatMap((f) => f.datasheets).sort((a,b) => (a.name < b.name ? -1 : 1));

    for (const [k,v] of filters.entries()) {
        if (v.length == 0 || v == " '")
            continue;
        console.log(`Filtering on '${k}': '${v}'`);
        if (k == "unit" && v.trim() != "") {
            const lv = v.toLowerCase().split(",").map(x => x.trim());
            flatDatasheets = flatDatasheets
                .filter((a) => lv.every(ilv => a.compiledKeywords?.some(ks => ks.includes(ilv))))
        }
        else if (k == "faction") {
            const lv = v.toLowerCase().split(",")
                .map(x => findFactionName(x.trim())).filter(x => x.length > 0);
            console.log(lv);
            const res = flatDatasheets
                .filter((a) => a.factions.some(ks => lv.includes(ks.toLowerCase())))
            if (res.length > 0)
                flatDatasheets = res;
        }
    }

    return flatDatasheets;
}