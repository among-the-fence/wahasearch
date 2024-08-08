import { Datasheet } from "@/models/faction";
import { SearchParams } from "./SearchParams";
import { factions } from "./loadData";


const faction_nickname_map = {
    "astra militarum": ["am", "ig", "guard", "imperial guard"],
    "adepta sororitas": ["mommy", "senoritas", "sisters", "sob"],
    "adeptus custodes": ["custodes"],
    "adeptus mechanicus": ["admech"],
    "aeldari": ["elves", "elf", "eldar", "legalos and friends"],
    "agents of the imperium": ["ia", "imperial agents", "imperial"],
    "blood angels": ["ba", "angles"],
    "dark angels": ["da", "angles"],
    "chaos knights": ["ck"],
    "legiones daemonica": ["daemons", "demon", "demons", "daemon"],
    "chaos space marines": ["csm", "chaos marines"],
    "death guard": ["dg"],
    "deathwatch": ["dw", "death watch", "watch"],
    "drukhari": ["dark elves", "dark eldar", "bad elves", "dark elf", "bad elf"],
    "black templars": ["bt"],
    "grey knights": ["gk"],
    "genestealer cults": ["gsc", "genestealer", "genestealers"],
    "imperial knights": ["ik"],
    "space marines": ["sm", "marines"],
    "space wolves": ["wolves", "sw"],
    "leagues of votann": ["dwarves", "gimli", "lov"],
    "world eaters": ["we", "eaters"],
    "orks": ["orcs", "ork", "orc", "mushrooms"],
    "tyranids": ["nids", "bugs", "bug"],
    "tau empire": ["tau", "fish", "t'au"],
    "thousand sons": ["tsons", "ksons", "1ksons", "dustyboiz", "dustyboys", "sons", "1kson", "tson", "kson"],
    "necrons": ["necrons", "crons", "zombies"]
}


/*
"black templars"
"heretic astartes"
"emperors children"
"adeptus astartes"
"ultramarines"
"adeptus titanicus"
*/


function findFactionName(text: string) {
    const patialMatchKeys = []
    for (const [k,v] of Object.entries(faction_nickname_map)) {
        if (text == k || v.includes(text))
            return k
        else if (k.includes(text)) {
            patialMatchKeys.push(k)
        }
    }
    return (patialMatchKeys.length > 0) ? patialMatchKeys : text;
}

export function compareUnits(favorites: string[], a: Datasheet, b: Datasheet) {
    const favA = favorites.indexOf(a.name);
    const favB = favorites.indexOf(b.name);
    if (favA >= 0) {
        if (favB >= 0) {
            return favA - favB;
        }
        return -1;
    }
    if (favB >= 0) {
        return 1;
    }
    return (a.name < b.name ? -1 : 1)
}

export function applyFilters(filters: Map<string, string>, favorites: string[]) {
    let flatDatasheets = factions.flatMap((f) => f.datasheets).sort((a,b) => compareUnits(favorites, a, b));
    const leegnds = filters.get("legends");
    if (leegnds == null || leegnds == "current") {
        flatDatasheets = flatDatasheets.filter(d => d.legends == undefined || d.legends == false)
    } else if (leegnds == "legends") {
        flatDatasheets = flatDatasheets.filter(d => d.legends)
    }

    const faction = filters.get("faction");
    if (faction && faction.length > 0 && faction.trim() != "") {
        const lv = faction.toLowerCase().split(",")
            .flatMap(x => findFactionName(x.trim())).filter(x => x.length > 0);
        const res = flatDatasheets
            .filter((a) => a.indexedFields?.factions.some(ks => lv.includes(ks.toLowerCase())))
        if (res.length > 0)
            flatDatasheets = res;
    }
    const keywords = filters.get("compiledKeywords");
    if (keywords && keywords.trim() != "") {
        const lv = keywords.toLowerCase().split(",").map(x => x.trim());
        flatDatasheets = flatDatasheets
            .filter((a) => lv.every(ilv => a.indexedFields?.compiledKeywords?.some(ks => ks.includes(ilv))))
    }

    const search = new SearchParams(filters);
    flatDatasheets = flatDatasheets.filter(x => search.apply(x));

    return flatDatasheets;
}

export function findDatasheetByName(name: string) {
    let flatDatasheets = factions.flatMap((f) => f.datasheets).sort((a,b) => (a.name < b.name ? -1 : 1));
    return flatDatasheets.find(d => d.name == name) || flatDatasheets[0];
}
