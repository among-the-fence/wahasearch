import { EntryLink } from "../gameData";

export class DataCard {
    name: string;
    id: string;
    isLegends: boolean;
    entrylink: EntryLink;
    linkedItem: any;
    profiles: UnitProfile[];
    cost: number[];

    constructor(link: EntryLink) {
        this.name = link.name.replace(" [Legends]", "");
        this.id = link.id;
        this.isLegends = link.name.includes("[Legends]");
        this.entrylink = link;
        this.linkedItem = null;
        this.profiles = []; 
        this.cost = [0];
    }

    setLinkedItem(item: any) {
        this.linkedItem = item;
        this.profiles = item?.profiles?.filter((p: { typeId: string; }) => p.typeId === "c547-1836-d8a-ff4f").map((p: any) => new UnitProfile(p)) || [];
        this.cost = [item?.costs?.find((c: { typeId: string; }) => c.typeId === "51b2-306e-1021-d207")?.value];
    }

    getDisplayedProfile() {
        return this.profiles;
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