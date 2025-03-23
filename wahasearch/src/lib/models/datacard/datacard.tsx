import { EntryLink } from "../gameData";
import { BaseCard } from "@/components/unitcomponents/BaseCard";
import { gameSystem } from "../gst";
import { Renderable } from "../renderable";
import { Section } from "@/components/ui/section";

const DEBUG_SHEET = [""];

const LINKED_WEAPON_TYPE_NAMES = ["Melee Weapon", "Ranged Weapon", "upgrade"];



export class DataCard implements Renderable {
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

        this.rangedProfiles.push(...this.buildWeaponProfiles(combinedWeapson, "Ranged Weapons"));
        this.meleeProfiles.push(...this.buildWeaponProfiles(combinedWeapson, "Melee Weapons"));

        this.abilities = this.linkedItem?.profiles?.filter((p: any) => p.typeName == "Abilities");
     //
    }

    buildWeaponProfiles(profile: any, type: string): WeaponProfile[] {
        const weaponList: WeaponProfile[] = []
        profile.filter((p: any) => p.profiles?.find((x: any) => x.typeName == type)).forEach((p: any) => {
            p.profiles
                .map((subProfile: any) => {
                    if (DEBUG_SHEET.includes(this.name)) console.log(subProfile);
                    return new WeaponProfile(p, subProfile)})
                .forEach((newWep: WeaponProfile) => {
                    if (!weaponList.find((wp: WeaponProfile) => {
                        return wp.name == newWep.name && wp.range == newWep.range && wp.attacks == newWep.attacks && wp.skill == newWep.skill && wp.strength == newWep.strength && wp.armorPen == newWep.armorPen && wp.damage == newWep.damage;
                    })) {
                        weaponList.push(newWep);
                    }
                });
            });
        return weaponList;
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

    renderDetailsTitle() {
        const cats = "• " + this.linkedItem?.categoryLinks?.map((c: any) => c.name).join(" • ") + " •";
        return (
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold">{this.name}</h1>
                    <div className="text-sm text-gray-600">{(this.cost)} points</div>
                </div>
                <div className="text-xs text-gray-500">
                    {cats}
                </div>
                {this.isLegends && (
                    <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        Legends
                    </div>
                )}
            </div>
        );
    }

    renderDetailsSheet() {
        console.log(this);
        return (
            <div className="space-y-4 p-2">
                <div className="space-y-4">
                    <Section title="Unit Profiles" defaultVisible={true}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">M</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">W</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LD</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OC</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SV</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {this.profiles.map((p: any) => (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 whitespace-nowrap font-medium">{p.name}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.m}"</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.t}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.w}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.ld}+</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.oc}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.sv}+</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Section>

                    <Section title="Ranged Weapons" defaultVisible={true}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Range</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">A</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BS</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AP</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {this.rangedProfiles.map((p: any) => (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 whitespace-nowrap font-medium">{p.name}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.range}"</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.attacks}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.skill}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.strength}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.armorPen}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.damage}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Section>

                    <Section title="Melee Weapons" defaultVisible={true}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">A</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WS</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AP</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {this.meleeProfiles.map((p: any) => (
                                        <tr key={p.id} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 whitespace-nowrap font-medium">{p.name}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.attacks}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.skill}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.strength}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.armorPen}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{p.damage}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Section>

                    <Section title="Abilities" defaultVisible={true}>
                        <div className="space-y-2">
                            {this.abilities.map((p: any) => (
                                <div key={p.id} className="bg-white p-2 rounded shadow-sm">
                                    <h3 className="text-sm font-semibold text-gray-900">{p.name}</h3>
                                    <p className="mt-1 text-xs text-gray-600">{p.characteristics[0].value}</p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Raw Data" defaultVisible={false}>
                        <div className="bg-gray-50 p-2 rounded overflow-x-auto">
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                {JSON.stringify(this.linkedItem._raw, (key, value) => {
                                    if (key === '_raw') {
                                        return undefined;
                                    }
                                    return value;
                                }, 2)}
                            </pre>
                        </div>
                    </Section>
                </div>
            </div>
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

    constructor(profile: any, subProfile?: any) {
        this.name = subProfile?.name || profile.name;
        this.type = profile.type;
        this.id = profile.id + subProfile.id;
        
        this.range = this.extractCharacteristic(subProfile, ["Range"]);
        this.attacks = this.extractCharacteristic(subProfile, ["A"]);
        this.skill = this.extractCharacteristic(subProfile, ["BS", "WS"]);
        this.strength = this.extractCharacteristic(subProfile, ["S"]);
        this.armorPen = this.extractCharacteristic(subProfile, ["AP"]);
        this.damage = this.extractCharacteristic(subProfile, ["D"]);
        this.keywords = subProfile?.keywords;
        this._raw = profile;
    }

    extractCharacteristic = (profile: any, name: string[]) => {
        return profile?.characteristics?.find((c: { name: string; }) => name.includes(c.name))?.value;
    };
}
