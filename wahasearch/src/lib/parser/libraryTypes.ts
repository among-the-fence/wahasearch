import { Base, mapBase, mapName, Named } from "../models/baseModels";
import { ensureArray } from "../util";


export interface Catalogue extends Base, Named{
    gameSystemId: string;
    gameSystemRevision: number;
    revision: number;
    authorName: string;
    authorContact: string;
    selectionEntries?: SelectionEntry[];
    sharedRules?: Rule[];
    selectionEntryGroups?: SelectionEntryGroup[];
    sharedProfiles: Map<string, Profile>;
    categoryEntries?: CategoryEntry[];
    entryLinks?: EntryLink[];
    infoLinks?: InfoLink[];
}
export function mapCatalogue(data: any): Catalogue {
        const categoryEntries = data.categoryEntries ? ensureArray(data.categoryEntries.categoryEntry).map((c: any) => this.mapCategoryEntry(c)) : []
        const sharedProfiles = new Map<string, Profile>();
        if (data.sharedProfiles?.profile?.length > 0){
            data.sharedProfiles?.profile?.forEach((p: any) => {
                const x = mapProfile(p);
                if (x) {
                    sharedProfiles.set(x.id, x);
                }
            });
        }
        const entryLinks = data.entryLinks ? ensureArray(data.entryLinks.entryLink).map((e: any) => this.mapEntryLink(e)) : [];
        const infoLinks = data.infolinks? ensureArray(data.infoLinks.infoLink).map((e:any) => this.mapEntryLink(e)) : [];
        return {
            ...mapBase(data),
            ...mapName(data),
            gameSystemId: data["@_gameSystemId"],
            gameSystemRevision: parseInt(data["@_gameSystemRevision"]),
            revision: parseInt(data["@_revision"]),
            authorName: data["@_authorName"],
            authorContact: data["@_authorContact"],
            selectionEntries: data.sharedSelectionEntries ? ensureArray(data.sharedSelectionEntries.selectionEntry).map((e: any) => this.mapSelectionEntry(e)) : [],
            selectionEntryGroups: data.sharedSelectionEntryGroups ? ensureArray(data.sharedSelectionEntryGroups.selectionEntryGroup).map((g: any) => this.mapSelectionEntryGroup(g)) : [],
            sharedRules: data.sharedRules ? ensureArray(data.sharedRules.rule).map((r: any) => this.mapRule(r)) : [],
            sharedProfiles: sharedProfiles,
            categoryEntries: categoryEntries,
            entryLinks: entryLinks,
            infoLinks: infoLinks,
        };
    }

export interface Rule extends Named {
    id: string;
    description: string;
}
export function mapRule(data: any): Rule {
        return {
            ...mapName(data),
            description: data.description || "",
        };
    }

export interface Profile extends Base, Named {
    characteristics: Characteristic[];
}
export function mapProfile(data: any): Profile {
        if (!data) { return { _raw: data, id: "", name: "", typeId: "", typeName: "", type: "", characteristics: [] }; }
        return {
            ...mapBase(data),
            ...mapName(data),
            characteristics: ensureArray(data.characteristics?.characteristic)?.map(c => this.mapCharacteristic(c)) || [],
        };
    }

export interface Characteristic extends Base, Named {
    value: string;
    description: string;
}
export function mapCharacteristic(data: any): Characteristic {
        if (!data) { return { _raw: data, id: "", typeId: "", typeName: "", type: "", name: "", value: "", description: "" }; }
        return {
            ...mapBase(data),
            ...mapName(data),
            value: data["#text"],
            description: data["@_description"],
        };
    }

export interface CategoryEntry extends Base, Named {
    hidden: boolean;
}
export function mapCategoryEntry(data: any): CategoryEntry {
        if (!data) { return { _raw: data, id: "", name: "", hidden: false, typeId: "", typeName: "", type: "" }; }
        return {
            ...mapBase(data),
            ...mapName(data),
            hidden: data["@_hidden"] === "true",
        };
    }

export interface EntryLink extends Base, Named {
    targetId: string;
    shouldImport: boolean;
    collective: boolean;
    hidden: boolean;
}
export function mapEntryLink(data: any): EntryLink {
        return {
            ...mapBase(data),
            ...mapName(data),
            targetId: data["@_targetId"],
            shouldImport: data["@_shouldImport"] === "true",
            collective: data["@_collective"] === "true",
            hidden: data["@_hidden"] === "true",
        }
    }
export interface SelectionEntry extends Base, Named {
    costs: Cost[];
    profiles: Profile[];
    categoryLinks: CategoryEntry[];
    entryLinks: EntryLink[];
    selectionEntries?: SelectionEntry[];
    selectionEntryGroups?: SelectionEntryGroup[];
    sharedSelectionEntries?: SelectionEntry[];
    sharedSelectionEntryGroups?: SelectionEntryGroup[];
    infoLinks: InfoLink[];
}

export interface InfoLink extends Base, Named{
    targetId: string;
}
export function mapInfoLink(data: any): InfoLink {
        return {
            ...mapBase(data),
            ...mapName(data),
            targetId: data["@_targetId"],
            type: data["@_type"],
        };
}

export interface SelectionEntryGroup extends Base, Named {
    selectionEntries: SelectionEntry[];
}
export function mapSelectionEntryGroup(data: any): SelectionEntryGroup {
        const subselection = data.selectionEntries?.selectionEntry
        return {
            ...mapBase(data),
            ...mapName(data),
            selectionEntries: subselection ? ensureArray(subselection)?.map(e => this.mapSelectionEntry(e)) : []
        };
    }

export interface Cost {
    typeId: string;
    value: number;
}
export function mapCost(data: any): Cost {
        if (!data) { return { typeId: "", value: 0 }; }
        return {
            typeId: data["@_typeId"],
            value: parseFloat(data["@_value"]),
        };
    }
