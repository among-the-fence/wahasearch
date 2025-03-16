import React from "react";
import { EntryLink } from "../gameData";
import { BaseCard } from "@/components/unitcomponents/BaseCard";
import { gameSystem } from "../gst";

const DEBUG_SHEET = [""];

const LINKED_WEAPON_TYPE_NAMES = ["Melee Weapon", "Ranged Weapon", "upgrade"];

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
    abilities: any[];

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
        this.abilities = [];
    }

    setLinkedItem(item: any, sharedItems: Map<string, any>) {
        this.linkedItem = item;
        this.profiles = item?.profiles?.filter((p: { typeId: string; }) => p.typeId === gameSystem.profileTypes.get("Unit")?.id).map((p: any) => new UnitProfile(p)) || [];
        this.cost = new Set([item?.costs?.find((c: { typeId: string; }) => c.typeId === gameSystem.costTypeId)?.value]);

        this.subProfiles = this.extractNextedProfiles(item);
        // if (DEBUG_SHEET.includes(this.name)) console.log(this.subProfiles);

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

        const linkedSubWeapon = [
                [...new Set(this.subProfiles.filter((p:any) => p.targetId).map((p:any) => p.targetId))].map((id: string) => sharedItems.get(id)).filter((p: any) => LINKED_WEAPON_TYPE_NAMES.includes(p?.type)),
                this.subProfiles.filter((p:any) => LINKED_WEAPON_TYPE_NAMES.includes(p?.type))
            ].flat();
        if (DEBUG_SHEET.includes(this.name))   console.log(linkedSubWeapon);
        
        const combinedWeapson = [...new Set([...linkedSubWeapon, ...this.subProfiles])];
        this.profiles = newList;
        this.meleeProfiles =combinedWeapson.filter((p: any) => p.profiles?.find((x: any) => x.typeName == "Melee Weapons")).map((p: any) => new WeaponProfile(p));
        this.rangedProfiles = combinedWeapson.filter((p: any) => p.profiles?.find((x: any) => x.typeName == "Ranged Weapons")).map((p: any) => new WeaponProfile(p));
        this.abilities = this.linkedItem?.profiles?.filter((p: any) => p.typeName == "Abilities");
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
            // if (DEBUG_SHEET.includes(this.name)) console.log(data);
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
        allData.push(data.entryLinks);
        allData.push(data.infoLinks);
        allData.push(data.profiles);
        allData.push(data.profile);
        // if (DEBUG_SHEET.includes(this.name)) console.log(data.entryLinks);
        
        return allData.filter((d: any) => !this.profileFilter(d)).flatMap((d:any) => {
            return this.extractNextedProfiles(d)
        }).flat();
    }

    profileFilter(profile: any): boolean {
        return profile && ( profile.targetId || profile.type == "profile" || profile.typeName == "Abilities" || profile.type == "upgrade" || profile.typeName == "Unit" || profile.typeName == "Melee Weapon" || profile.typeName == "Ranged Weapon");
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
        console.log(this);
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
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>M</th>
                            <th>T</th>
                            <th>W</th>
                            <th>LD</th>
                            <th>OC</th>
                            <th>SV</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.profiles.map((p: any) => {
                            return (
                                <tr key={p.id}>
                                    <td className="font-semibold">{p.name}</td>
                                    <td>{p.m}"</td>
                                    <td>{p.t}</td>
                                    <td>{p.w}</td>
                                    <td>{p.ld}+</td>
                                    <td>{p.oc}</td>
                                    <td>{p.sv}+</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div>
                <div>
                    <h2 className="font-bold">Ranged Weapons</h2>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Range</th>
                                    <th>A</th>
                                    <th>BS</th>
                                    <th>S</th>
                                    <th>AP</th>
                                    <th>D</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.rangedProfiles.map((p: any) => {
                                    return (
                                        <tr key={p.id}>
                                            <td>{p.name}</td>
                                            <td>{p.range}"</td>
                                            <td>{p.attacks}</td>
                                            <td>{p.skill}</td>
                                            <td>{p.strength}</td>
                                            <td>{p.armorPen}</td>
                                            <td>{p.damage}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>


                <div>
                    <h2 className="font-bold">Melee Weapons</h2>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>A</th>
                                    <th>BS</th>
                                    <th>S</th>
                                    <th>AP</th>
                                    <th>D</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.meleeProfiles.map((p: any) => {
                                    return (
                                        <tr key={p.id}>
                                            <td>{p.name}</td>
                                            <td>{p.attacks}</td>
                                            <td>{p.skill}</td>
                                            <td>{p.strength}</td>
                                            <td>{p.armorPen}</td>
                                            <td>{p.damage}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    
                    </div>

                    <div>
                        <h2 className="font-bold">Abilities</h2>
                        <div>
                            <ul>
                                {this.abilities.map((p: any) => {
                                    return (
                                        <li key={p.id}>
                                            <h3 className="font-semibold">{p.name}</h3>
                                            <p>{p.characteristics[0].value}</p>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

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
    range: string;
    attacks: string;
    skill: string;
    strength: string;
    armorPen: string;
    damage: string;
    keywords: any;

    constructor(profile: any) {
        this.name = profile.name;
        this.type = profile.type;
        this.id = profile.id;
        const profileData = profile.profiles[0];
        
        this.range = this.extractCharacteristic(profileData, "Range");
        this.attacks = this.extractCharacteristic(profileData, "A");
        this.skill = this.extractCharacteristic(profileData, "BS");
        this.strength = this.extractCharacteristic(profileData,"S");
        this.armorPen = this.extractCharacteristic(profileData, "AP");
        this.damage = this.extractCharacteristic(profileData, "D");
        this.keywords = profileData.keywords;
        this._raw = profile;
    }

    extractCharacteristic = (profile: any, name: string) => {
        return profile.characteristics?.find((c: { name: string; }) => c.name === name)?.value;
    };
}
