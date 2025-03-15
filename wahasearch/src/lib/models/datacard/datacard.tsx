import React from "react";
import { EntryLink } from "../gameData";
import { BaseCard } from "@/components/unitcomponents/BaseCard";
import { gameSystem } from "../gst";

const DEBUG_SHEET = ["Vypers"];

export class DataCard {
    name: string;
    id: string;
    isLegends: boolean;
    entrylink: EntryLink;
    linkedItem: any;
    profiles: UnitProfile[];
    cost: Set<number>;
    subProfiles: UnitProfile[];
    meleeProfiles: WeaponProfile[];
    rangedProfiles: WeaponProfile[];

    constructor(link: EntryLink) {
        this.name = link.name.replace(" [Legends]", "");
        this.id = link.id;
        this.isLegends = link.name.includes("[Legends]");
        this.entrylink = link;
        this.linkedItem = null;
        this.profiles = []; 
        this.cost = new Set();
        this.subProfiles = [];
        this.meleeProfiles = [];
        this.rangedProfiles = [];
    }

    setLinkedItem(item: any, sharedItems: Map<string, any>) {
        this.linkedItem = item;
        this.profiles = item?.profiles?.filter((p: { typeId: string; }) => p.typeId === gameSystem.profileTypes.get("Unit")?.id).map((p: any) => new UnitProfile(p)) || [];
        this.cost = new Set([item?.costs?.find((c: { typeId: string; }) => c.typeId === gameSystem.costTypeId)?.value]);

        this.subProfiles = this.extractNextedProfiles(item);
        const linkedSubProfiles = [
                [...new Set(this.subProfiles.filter((p:any) => p.targetId).map((p:any) => p.targetId))].map((id: string) => sharedItems.get(id)).filter((p: any) => p?.typeName == "Unit"),
                this.subProfiles.filter((p:any) => p.typeName == "Unit")
        ].flat();
        const newList: UnitProfile[] = [];
        linkedSubProfiles.forEach((p: any) => {
            const prof = new UnitProfile(p)
            // make sure no profiles wth matching characteristics are added
            if (!newList.find((np: UnitProfile) => {
                return np.m == prof.m && np.t == prof.t && np.w == prof.w && np.ld == prof.ld && np.oc == prof.oc && np.sv == prof.sv;
            }
            )) {
                // if (DEBUG_SHEET.includes(this.name)) console.log(prof, newList);
                newList.push(prof);
            }
        });
        
        this.profiles = newList;
        this.meleeProfiles = this.subProfiles.filter((p: any) => p.profiles?.find((x: any) => x.typeName == "Melee Weapons")).map((p: any) => new WeaponProfile(p));
        this.rangedProfiles = this.subProfiles.filter((p: any) => p.profiles?.find((x: any) => x.typeName == "Ranged Weapons")).map((p: any) => new WeaponProfile(p));
        // if (DEBUG_SHEET.includes(this.name))   console.log(this.subProfiles);
        //
    }

    extractNextedProfiles(data: any): any[] {

        // if (DEBUG_SHEET.includes(this.name)) console.log(data);
        if (!data)            // if (DEBUG_SHEET.includes(this.name)) console.log(data);

            return [];
        if (Array.isArray(data)) {
            // if (DEBUG_SHEET.includes(this.name)) console.log(data);
            return data.map((d: any) => this.extractNextedProfiles(d));
        }
        if (data?.costs) {
            if (DEBUG_SHEET.includes(this.name)) console.log(data);
            const profilCosts = data.costs.find((c: { typeId: string; }) => c.typeId === gameSystem.costTypeId)?.value
            if (profilCosts) {
                this.cost.add(profilCosts);
            }
        }
        if (this.profileFilter(data)) {
            return [data];
        }
        const allData = [data.selectionEntryGroups];
        allData.push(data.selectionEntry);
        allData.push(data.selectionEntries);
        allData.push(data.sharedProfiles);
        allData.push(data.infoLinks);
        allData.push(data.profiles);
        allData.push(data.profile);
        // if (DEBUG_SHEET.includes(this.name)) console.log(allData);
        
        return allData.filter((d: any) => !this.profileFilter(d)).flatMap((d:any) => {
            return this.extractNextedProfiles(d)
        }).flat();
    }

    profileFilter(profile: any): boolean {
        return profile && (profile.type == "profile" || profile.typeName == "Abilities" || profile.type == "upgrade" || profile.typeName == "Unit" || profile.typeName == "Melee Weapon" || profile.typeName == "Ranged Weapon");
     }


    getDisplayedProfile() {
        return this.profiles;
    }


    renderSummaryCard(setSelected: (card: DataCard) => void) {
        const headerclass = `inline text-md font-semibold ${this.isLegends ? "text-slate-500" : ""}`;
        const oneProfile = this.profiles.length == 1;
        return (
            <BaseCard handleClick={() => setSelected(this)} itemId={this.id}>
                <div>
                    <div>
                        <h1 className={headerclass} >{this.name}</h1>
                        <h4 className="inline"> ({(this.cost)})</h4>
                    </div>
                    {this.profiles.map(p => {
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
    }

    renderDetailsSheet() {
        const cats = "• " + this.linkedItem?.categoryLinks?.map((c: any) => c.name).join(" • ") + " •";
        return (<div>
            <div>
                <h1 className="inline">{this.name}</h1>
                <h4 className="inline"> ({(this.cost)})</h4>
            </div>
            <div>
                <div>
                    {cats}
                </div>
            </div>
            <div>
                {this.profiles.map(p => {
                    return (
                        <div key={p.id}>
                            <h2 className="inline" >{p.name} </h2>
                            <p className="inline" >M:{p.m}" </p>
                            <p className="inline" >T:{p.t} </p>
                            <p className="inline" >W:{p.w} </p>
                            <p className="inline" >LD:{p.ld}+ </p>
                            <p className="inline" >OC:{p.oc} </p>
                            <p className="inline" >SV:{p.sv}+ </p>
                        </div>
                    );
                })}
            </div>
          {/*  <div>
                <div>
                    <h2>Ranged Weapons</h2>
                    <div>
                        {this.rangedProfiles.map((p: any) => {
                            return (
                                <div key={p.id}>
                                    <h3>{p.name}</h3>
                                    <p>{p.description}</p>
                                    <p>Range: {p.range}"</p>
                                    <p>Attacks: {p.attacks}</p>
                                    <p>Strength: {p.strength}</p>
                                    <p>AP: {p.armorPen}</p>
                                    <p>Damage: {p.damage}</p>
                                    <p>Keywords: {p.keywords}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <h2>Melee Weapons</h2>
                    <div>
                        {this.meleeProfiles.map((p: any) => {
                            return (
                                <div key={p.id}>
                                    <h3>{p.name}</h3>
                                    <p>{p.description}</p>
                                    <p>Attacks: {p.attacks}</p>
                                    <p>Strength: {p.strength}</p>
                                    <p>AP: {p.armorPen}</p>
                                    <p>Damage: {p.damage}</p>
                                    <p>Keywords: {p.keywords}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
*/}
            <div className="width-full">
                <pre>{JSON.stringify(this.subProfiles, (key, value) => {
                    if (key === '_raw') {
                        return undefined;
                    }
                    return value;
                    }, 2)}</pre>
            </div>
        </div>);
    }

}

export class UnitProfile {
    name: string;
    type: string;
    id: string;
    m: number;
    t: number;
    w: number;
    ld: number;
    oc: number;
    sv: number;
    _raw: any;

    constructor(profile: any) {
        this.name = profile.name;
        this.type = profile.type;
        this.id = profile.id;
        this.m = this.parseCharacteristic(profile.characteristics.find((c: { name: string; }) => c.name === "M"));
        this.t = this.parseCharacteristic(profile.characteristics.find((c: { name: string; }) => c.name === "T"));
        this.w = this.parseCharacteristic(profile.characteristics.find((c: { name: string; }) => c.name === "W"));
        this.ld = this.parseCharacteristic(profile.characteristics.find((c: { name: string; }) => c.name === "LD"));
        this.oc = this.parseCharacteristic(profile.characteristics.find((c: { name: string; }) => c.name === "OC"));
        this.sv = this.parseCharacteristic(profile.characteristics.find((c: { name: string; }) => c.name === "SV"));
        this._raw = null;
    }

    parseCharacteristic = (characteristic: any) => {
        return parseInt(`${characteristic.value}`.replace('\\\"', '').replace('+', ''));
    }
    
}

export class WeaponProfile {
    name: string;
    type: string;
    id: string;
    _raw: any;
    range: number;
    attacks: string;
    skill: number;
    strength: number;
    armorPen: number;
    damage: string;
    keywords: any;

    constructor(profile: any) {
        this.name = profile.name;
        this.type = profile.type;
        this.id = profile.id;
        const profileData = profile.profiles[0];
        
        this.range = this.parseCharacteristic(profileData.characteristics?.find((c: { name: string; }) => c.name === "Range"));
        this.attacks = profileData.characteristics?.find((c: { name: string; }) => c.name === "A");
        this.skill = this.parseCharacteristic(profileData.characteristics?.find((c: { name: string; }) => c.name === "BS" || c.name === "WS"));
        this.strength = this.parseCharacteristic(profileData.characteristics?.find((c: { name: string; }) => c.name === "S"));
        this.armorPen = this.parseCharacteristic(profileData.characteristics?.find((c: { name: string; }) => c.name === "AP"));
        this.damage = profileData.characteristics?.find((c: { name: string; }) => c.name === "D");
        this.keywords = profileData.keywords;
        this._raw = profile;
    }

    parseCharacteristic = (characteristic: any) => {
        if (!characteristic) return 0;
        return parseInt(`${characteristic.value}`.replace('\\\"', '').replace('+', ''));
    }
}
