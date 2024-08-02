
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
import l from "@/lib/data/datasources/10th/json/core.json"
import m from "@/lib/data/datasources/10th/json/darkangels.json"
import n from "@/lib/data/datasources/10th/json/deathguard.json"
import o from "@/lib/data/datasources/10th/json/deathwatch.json"
import p from "@/lib/data/datasources/10th/json/drukhari.json"
import q from "@/lib/data/datasources/10th/json/emperors_children.json"
import r from "@/lib/data/datasources/10th/json/enhancements.json"
import s from "@/lib/data/datasources/10th/json/greyknights.json"
import t from "@/lib/data/datasources/10th/json/gsc.json"
import u from "@/lib/data/datasources/10th/json/imperialknights.json"
import v from "@/lib/data/datasources/10th/json/marines_leviathan.json"
import w from "@/lib/data/datasources/10th/json/necrons.json"
import x from "@/lib/data/datasources/10th/json/orks.json"
import y from "@/lib/data/datasources/10th/json/space_marines.json"
import z from "@/lib/data/datasources/10th/json/spacewolves.json"
import aa from "@/lib/data/datasources/10th/json/tau.json"
import ab from "@/lib/data/datasources/10th/json/thousandsons.json"
import ac from "@/lib/data/datasources/10th/json/titan.json"
import ad from "@/lib/data/datasources/10th/json/tyranids.json"
import ae from "@/lib/data/datasources/10th/json/unaligned.json"
import af from "@/lib/data/datasources/10th/json/votann.json"
import ag from "@/lib/data/datasources/10th/json/worldeaters.json"
import { FactionRoot } from "@/models/faction"
import {v4 as uuidv4} from 'uuid';


function compileFactions() {
    console.log("DOING THE BIG WORK");
    const factionList: FactionRoot[] = [a,b,c,d,e,f,g,h,i,j,k,m,n,o,p,q,s,t,u,w,x,y,z,aa,ab,ac,ad,af,ag];
    factionList.map((f) => (f.datasheets.forEach((d) => {
        d.colours = f.colours;
        d.uuid = uuidv4();
        d.stats.forEach(s => s.uuid = uuidv4());
        let compiledWords = [];
        compiledWords.push(d.name.toLowerCase());
        compiledWords = compiledWords.concat(d.stats.flatMap((s) => s.name.toLowerCase()));
        compiledWords = compiledWords.concat(d.factions.map(f => f.toLowerCase()));
        compiledWords = compiledWords.concat(d.meleeWeapons.flatMap(w => w.profiles.flatMap(wp => (
            [...wp.keywords.flatMap(x => x.toLowerCase()), wp.name.toLowerCase()]
        ))));
        if (d.rangedWeapons)
            compiledWords = compiledWords.concat(d.rangedWeapons.flatMap(w => w.profiles.flatMap(wp => (
                [...wp.keywords.flatMap(x => x.toLowerCase()), wp.name.toLowerCase()]
            ))));
        compiledWords = compiledWords.map(x=>x.trim()).filter(x => x.length > 0);
        d.compiledKeywords = compiledWords;
    })));
    return factionList;
}

export const factions: FactionRoot[] = compileFactions();