
import a from "@/lib/data/datasources/10th/json/adeptasororitas.json"
import b from "@/lib/data/datasources/10th/json/adeptuscustodes.json"
import c from "@/lib/data/datasources/10th/json/adeptusmechanicus.json"
import d from "@/lib/data/datasources/10th/json/aeldari.json"
import e from "@/lib/data/datasources/10th/json/agents.json"
import f from "@/lib/data/datasources/10th/json/astramilitarum.json"
import g from "@/lib/data/datasources/10th/json/blacktemplar.json"
import h from "@/lib/data/datasources/10th/json/bloodangels.json"
import i from "@/lib/data/datasources/10th/json/chaosdaemons.json"
import j from "@/lib/data/datasources/10th/json/chaosknights.json"
import k from "@/lib/data/datasources/10th/json/chaos_spacemarines.json"
// import l from "@/lib/data/datasources/10th/json/core.json"
import m from "@/lib/data/datasources/10th/json/darkangels.json"
import n from "@/lib/data/datasources/10th/json/deathguard.json"
import o from "@/lib/data/datasources/10th/json/deathwatch.json"
import p from "@/lib/data/datasources/10th/json/drukhari.json"
import q from "@/lib/data/datasources/10th/json/emperors_children.json"
// import r from "@/lib/data/datasources/10th/json/enhancements.json"
import s from "@/lib/data/datasources/10th/json/greyknights.json"
import t from "@/lib/data/datasources/10th/json/gsc.json"
import u from "@/lib/data/datasources/10th/json/imperialknights.json"
// import v from "@/lib/data/datasources/10th/json/marines_leviathan.json"
import w from "@/lib/data/datasources/10th/json/necrons.json"
import x from "@/lib/data/datasources/10th/json/orks.json"
import y from "@/lib/data/datasources/10th/json/space_marines.json"
import z from "@/lib/data/datasources/10th/json/spacewolves.json"
import aa from "@/lib/data/datasources/10th/json/tau.json"
import ab from "@/lib/data/datasources/10th/json/thousandsons.json"
import ac from "@/lib/data/datasources/10th/json/titan.json"
import ad from "@/lib/data/datasources/10th/json/tyranids.json"
// import ae from "@/lib/data/datasources/10th/json/unaligned.json"
import af from "@/lib/data/datasources/10th/json/votann.json"
import ag from "@/lib/data/datasources/10th/json/worldeaters.json"
import { FactionRoot, IndexedFields, Profile, Stat } from "@/models/faction"

function createRandomHash() {
    const x = Math.random().toString(36).substring(2, 25)+Math.random().toString(36).substring(2, 25);
    // console.log(x);
    return x;
}

function compileFactions() {
    console.log("DOING THE BIG WORK");
    const factionNames: any[] = [];
    const factionList: FactionRoot[] = [a,b,c,d,e,f,g,h,i,j,k,m,n,o,p,q,s,t,u,w,x,y,z,aa,ab,ac,ad,af,ag];
    factionList.map((f) => (f.datasheets.forEach((d) => {
        // console.log(d.name);
        d.colours = f.colours;
        d.uuid = createRandomHash();
        d.stats.forEach(s => s.uuid = createRandomHash());
        d.indexedFields = {} as IndexedFields;
        let compiledWords = [];
        compiledWords.push(d.name);
        compiledWords = compiledWords.concat(d.stats.flatMap((s) => s.name));
        compiledWords = compiledWords.concat(d.factions.map(f => f));
        compiledWords = compiledWords.concat(d.keywords.map(f => f));
        compiledWords = compiledWords.concat(d.meleeWeapons.flatMap(w => w.profiles.flatMap(wp => (
            [...wp.keywords.flatMap(x => x), wp.name]
        ))));
        if (d.rangedWeapons)
            compiledWords = compiledWords.concat(d.rangedWeapons.flatMap(w => w.profiles.flatMap(wp => (
                [...wp.keywords.flatMap(x => x), wp.name]
            ))));
        if (d.leads?.units && d.leads?.units?.length > 0) {
            compiledWords = compiledWords.concat(d.leads?.units);
        }
        if (d.leadBy && d.leadBy?.length > 0) {
            compiledWords = compiledWords.concat(d.leadBy);
        }
        
        compiledWords = compiledWords.map(x=>x.toLowerCase().trim()).filter(x => x.length > 0);

        if (d.abilities.primarch?.length > 0) {
            compiledWords.push("primarch");
            d.abilities.primarch.map(p => compiledWords.push(p.name));
        }
        if (d.abilities.damaged.description.length > 0) {
            compiledWords.push("damaged");
            compiledWords.push("damage");
        }
        d.indexedFields.factions = d.factions.map(f => f.toLowerCase().replace(/[^0-9a-z ]/gi, ''))

        if (d.indexedFields.factions.length == 1){
            factionNames.push(d.indexedFields.factions[0]);
        }
        else {
            factionNames.push(d.indexedFields.factions);
        }
        d.indexedFields.compiledKeywords = [...new Set(compiledWords)];
        d.indexedFields.stats = new Array<Stat>();
        d.indexedFields.weaponProfiles = new Array<Profile>();
        d.stats.forEach(s => d.indexedFields?.stats.push({
            ld: s.ld.replace("+", ""),
            m: s.m.replace("\"", ""),
            name: s.name,
            oc: s.oc.replace("+", ""),
            sv: s.sv.replace("+", ""),
            t: s.t.replace("\"", ""),
            w: s.w.replace("\"", "")
        }));
        d.meleeWeapons.forEach(m => {
            m.profiles.forEach(pp => {
                d.indexedFields?.weaponProfiles.push({
                    ...pp,
                    ap: pp.ap.replace("-", "")
                });
            })
        });
        d.rangedWeapons.forEach(m => {
            m.profiles.forEach(pp => {
                d.indexedFields?.weaponProfiles.push({
                    ...pp,
                    range: pp.range.replace("\"", "")
                });
            })
        });
    }))
    );
    console.log(new Set(factionNames));
    return factionList;
}

export function calculateVariableStats(stat:string) {
    const s = stat.toLowerCase();
    if (s.includes("d")) {
        const x = s.split("d");
        let diceCount = 1;
        if (x[0] !== '') {
            diceCount = parseInt(x[0].trim());
        }
        let minRoll = diceCount;
        const modSplit = x[1].split("+");
        const diceSize = parseInt(modSplit[0].trim());
        let maxRoll = diceCount * diceSize;
        if (modSplit.length > 1) {
            const modifier = parseInt(modSplit[1].trim());
            minRoll += modifier;
            maxRoll += modifier;
        }
        return [s.replace(" ", "")];//.concat(Array.from({ length: maxRoll - minRoll + 1 }, (_, i) => minRoll + i));
    } else if (s === "n/a") {
        return [0];
    }
    if (stat) {
        return [parseInt(stat.replace("+", "").replace("-", ""))];
    }
    return [];
}

export const factions: FactionRoot[] = compileFactions();