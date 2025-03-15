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

    constructor(link: EntryLink) {
        this.name = link.name.replace(" [Legends]", "");
        this.id = link.id;
        this.isLegends = link.name.includes("[Legends]");
        this.entrylink = link;
        this.linkedItem = null;
        this.profiles = []; 
        this.cost = new Set();
        this.subProfiles = [];
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


    renderSummaryCard() {
            const headerclass = `inline text-md font-semibold ${this.isLegends ? "text-slate-500" : ""}`;
            const oneProfile = this.profiles.length == 1;
            return (
                <BaseCard itemId={this.id}>
                    <div onClick={() => {console.log(this);}}>
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