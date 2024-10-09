import { Datasheet } from "@/models/faction";
import { SearchParams } from "./SearchParams";
import { factions } from "./loadData";


const faction_nickname_map = {
    "astra militarum": ["am", "ig", "guard", "imperial guard"],
    "adepta sororitas": ["mommy", "senoritas", "sisters", "sob", "ben"],
    "adeptus custodes": ["custodes"],
    "adeptus mechanicus": ["admech"],
    "aeldari": ["elves", "elf", "eldar", "legalos and friends", "bill"],
    "agents of the imperium": ["ia", "imperial agents", "imperial"],
    "blood angels": ["ba", "angles"],
    "dark angels": ["da", "angles"],
    "chaos knights": ["ck"],
    "legiones daemonica": ["daemons", "demons", "jason", "shannon"],
    "chaos space marines": ["csm", "chaos marines"],
    "death guard": ["dg"],
    "deathwatch": ["dw", "death watch", "watch"],
    "drukhari": ["dark elves", "dark eldar", "bad elves", "dark elf", "bad elf"],
    "black templars": ["bt"],
    "grey knights": ["gk"],
    "genestealer cults": ["gsc", "genestealers"],
    "imperial knights": ["ik"],
    "space marines": ["sm", "marines"],
    "space wolves": ["wolves", "sw"],
    "leagues of votann": ["dwarves", "gimli", "lov", "jason"],
    "world eaters": ["we", "eaters", "ben"],
    "orks": ["orcs", "ork", "orc", "mushrooms", "henry"],
    "tyranids": ["nids", "bugs", "henry"],
    "tau empire": ["tau", "fish", "t'au", "henry"],
    "thousand sons": ["tsons", "ksons", "1ksons", "dustyboiz", "dustyboys", "jason"],
    "necrons": ["necrons", "crons", "zombies", "ben"]
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
    const superMatches = []
    for (const [k,v] of Object.entries(faction_nickname_map)) {
        if (text == k || v.includes(text))
            superMatches.push(k)
        else if (k.includes(text) || v.some(vv => vv.includes(text))) {
            patialMatchKeys.push(k)
        }
    }
    if (superMatches.length > 0)
        return superMatches;
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
    flatDatasheets = search.filter(flatDatasheets.filter(x => search.apply(x)));

    return flatDatasheets;
}

export function findDatasheetByName(name: string|null) 
{
    if (!name)
        return null;
    const cleanName = name.replace(/\+/g, " ").toLowerCase();
    const flatDatasheets = factions.flatMap((f) => f.datasheets).sort((a,b) => (a.name < b.name ? -1 : 1));
    const found = flatDatasheets.find(d => d.name.toLowerCase() == cleanName);
    return found || flatDatasheets[0];
}
