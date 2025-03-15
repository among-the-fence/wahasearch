import { GameSystem } from './gst';
import { ensureArray } from '../util';
import { Dispatch, SetStateAction } from 'react';
import { Base, Named, mapBase, mapName } from './baseModels';
import jsonContent from "@/lib/data/wh40k-10e.json"
import { DataCard } from './datacard/datacard';


// Define interfaces for Warhammer 40K game system
export class GameData {
    catalogues: Catalogue[];
    datacards: any[];

    constructor() {
        this.catalogues = [];
        this.datacards = [];
    }
}

export interface Catalogue extends Base, Named{
    gameSystemId: string;
    gameSystemRevision: number;
    revision: number;
    authorName: string;
    authorContact: string;
    selectionEntries?: SelectionEntry[];
    sharedRules?: Rule[];
    selectionEntryGroups?: SelectionEntryGroup[];
    sharedProfiles: Map<String, Profile>;
    categoryEntries?: CategoryEntry[];
    entryLinks?: EntryLink[];
    infoLinks?: InfoLink[];
}

export interface Rule extends Named {
    id: string;
    description: string;
}

export interface Profile extends Base, Named {
    characteristics: Characteristic[];
}

export interface Characteristic extends Base, Named {
    value: string;
}

export interface CategoryEntry extends Base, Named {
    hidden: boolean;
}

export interface EntryLink extends Base, Named {
    targetId: string;
    shouldImport: boolean;
    collective: boolean;
    hidden: boolean;
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

export interface SelectionEntryGroup extends Base, Named {
    selectionEntries: SelectionEntry[];
}

export interface Cost {
    typeId: string;
    value: number;
}

export class WBSDataGameSystemParser {
    
    public async parseGameSystem(messageUpdater: Dispatch<SetStateAction<string>>): Promise<GameData> {
       
        console.log("Parsing Game System");
        const x = new GameData();
        const everythingInAMap = new Map<string, any>();
        (jsonContent as any[]).forEach((entry: any) => {
            messageUpdater(entry?.catalogue['@_name']);
            const catalogue = this.mapCatalogue(entry.catalogue);
            if (catalogue.entryLinks) {
                catalogue.entryLinks.forEach((link: EntryLink) => {
                    x.datacards.push(new DataCard(link));
                });
            }
            catalogue.selectionEntries?.forEach((entry) => {
                everythingInAMap.set(entry.id, entry);
            });
            catalogue.selectionEntryGroups?.forEach((entry) => {
                everythingInAMap.set(entry.id, entry);
            });
            catalogue.sharedProfiles?.forEach((entry) => {
                everythingInAMap.set(entry.id, entry);
            });

            x.catalogues.push(catalogue);
        });
        console.log("DONE");
        x.datacards.forEach((dc: DataCard) => {
            dc.setLinkedItem(everythingInAMap.get(dc.entrylink.targetId), everythingInAMap);
        });
        console.log(everythingInAMap);
        console.log(x);
        
        return x;
    }


    private mapCatalogue(data: any): Catalogue {
        const categoryEntries = data.categoryEntries ? ensureArray(data.categoryEntries.categoryEntry).map((c: any) => this.mapCategoryEntry(c)) : []
        const sharedProfiles = new Map<String, Profile>();
        if (data.sharedProfiles?.profile?.length > 0){
            data.sharedProfiles?.profile?.forEach((p: any) => {
                const x = this.mapProfile(p);
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

    private mapEntryLink(data: any): any {
        return {
            ...mapBase(data),
            ...mapName(data),
            targetId: data["@_targetId"],
            shouldImport: data["@_shouldImport"] === "true",
            collective: data["@_collective"] === "true",
            hidden: data["@_hidden"] === "true",
        }
    }

    private mapRule(data: any): Rule {
        return {
            ...mapName(data),
            description: data.description || "",
        };
    }

    private mapSelectionEntry(data: any): SelectionEntry {
        const subselections = data?.selectionEntries?.selectionEntry;
        const selectionEntryGroups = data?.selectionEntryGroups?.selectionEntryGroup;
        const profiles = data?.profiles?.profile;
        const categoryLinks = data?.categoryLinks?.categoryLink;
        const costs = data?.costs?.cost;
        const links = data.infoLinks?.infoLink;

        return {
            ...mapBase(data),
            ...mapName(data),
            costs: costs ? ensureArray(costs)?.map(c => this.mapCost(c)) : [],
            profiles: profiles ? ensureArray(profiles)?.map(p => this.mapProfile(p)) : [],
            categoryLinks: categoryLinks ? ensureArray(categoryLinks)?.map(c => this.mapCategoryEntry(c)) : [],
            selectionEntries: subselections ? ensureArray(subselections).map(e => this.mapSelectionEntry(e)) : [],
            selectionEntryGroups: selectionEntryGroups ? ensureArray(selectionEntryGroups).map(g => this.mapSelectionEntryGroup(g)) : [],
            infoLinks: links ? ensureArray(links).map((i: any) => this.mapInfoLink(i)) : [],
            entryLinks: data.entryLinks ? ensureArray(data.entryLinks.entryLink).map((e: any) => this.mapEntryLink(e)) : [],
        };
    }

    private mapSelectionEntryGroup(data: any): SelectionEntryGroup {
        const subselection = data.selectionEntries?.selectionEntry
        return {
            ...mapBase(data),
            ...mapName(data),
            selectionEntries: subselection ? ensureArray(subselection)?.map(e => this.mapSelectionEntry(e)) : []
        };
    }

    private mapInfoLink(data: any): InfoLink {
        return {
            ...mapBase(data),
            ...mapName(data),
            targetId: data["@_targetId"],
            type: data["@_type"],
        };
    }
    

    private mapProfile(data: any): Profile {
        if (!data) { return { _raw: data, id: "", name: "", typeId: "", typeName: "", type: "", characteristics: [] }; }
        return {
            ...mapBase(data),
            ...mapName(data),
            characteristics: ensureArray(data.characteristics?.characteristic)?.map(c => this.mapCharacteristic(c)) || [],
        };
    }

    private mapCharacteristic(data: any): Characteristic {
        if (!data) { return { _raw: data, id: "", typeId: "", typeName: "", type: "", name: "", value: "" }; }
        return {
            ...mapBase(data),
            ...mapName(data),
            value: data["#text"],

        };
    }

    private mapCategoryEntry(data: any): CategoryEntry {
        if (!data) { return { _raw: data, id: "", name: "", hidden: false, typeId: "", typeName: "", type: "" }; }
        return {
            ...mapBase(data),
            ...mapName(data),
            hidden: data["@_hidden"] === "true",
        };
    }

    private mapCost(data: any): Cost {
        if (!data) { return { typeId: "", value: 0 }; }
        return {
            typeId: data["@_typeId"],
            value: parseFloat(data["@_value"]),
        };
    }

}

export const gamedata = new GameData();

