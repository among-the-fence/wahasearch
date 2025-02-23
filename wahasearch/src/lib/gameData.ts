import { XMLParser } from 'fast-xml-parser';
import { GameSystem } from './models/gst';
import { ensureArray } from './util';
import { Dispatch, SetStateAction } from 'react';
import { Base, Named, mapBase, mapName } from './models/baseModels';


// Define interfaces for Warhammer 40K game system
export class GameData {
    gameSystem: GameSystem;
    catalogues: Catalogue[];
    constructor(gameSystem: GameSystem) {
        this.gameSystem = gameSystem;
        this.catalogues = [];
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

export interface SelectionEntry extends Base, Named {
    costs: Cost[];
    profiles: Profile[];
    categoryLinks: CategoryEntry[];
    selectionEntries?: SelectionEntry[];
    selectionEntryGroups?: SelectionEntryGroup[];
    sharedSelectionEntries?: SelectionEntry[];
    sharedSelectionEntryGroups?: SelectionEntryGroup[];
    // infoLinks: InfoLinks[];
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
        const catfiles = import.meta.glob('/src/lib/data/wh40k-10e/*.cat', { as: 'raw' });
        const gstfiles = import.meta.glob('/src/lib/data/wh40k-10e/*.gst', { as: 'raw' });
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

        const gstfilepath = Object.keys(gstfiles)[0]; // Get the first file path
        const gstFileContent = await gstfiles[gstfilepath]();

        const x = new GameData(new GameSystem(gstFileContent, parser));
        // Call the function and parse XML
        for (const path in catfiles) {
            if (path.endsWith('.gst') || path.startsWith('.')) {
                messageUpdater('What the hell');
                console.log("what the hell: ", path);
                continue;
            }
            messageUpdater(path);
            const content = await catfiles[path]();
            const jsonifiedXmlData = parser.parse(content);
            const catalogue = this.mapCatalogue(jsonifiedXmlData.catalogue);

            x.catalogues.push(catalogue);
        }
        console.log("DONE");

        console.log(x)
        
        return x;
    }


    private mapCatalogue(data: any): Catalogue {
        const categoryEntries = data.categoryEntries ? ensureArray(data.categoryEntries.categoryEntry).map((c: any) => this.mapCategoryEntry(c)) : []
        const sharedProfiles = new Map<String, Profile>();
        if (data.sharedProfiles?.profile?.length > 0){
            data.sharedProfiles?.profile?.forEach((p: any) => {
                console.log(p);
                const x = this.mapProfile(p);
                if (x) {
                    sharedProfiles.set(x.id, x);
                }
            });
        }
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
            categoryEntries: categoryEntries
        };
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

        return {
            ...mapBase(data),
            ...mapName(data),
            costs: costs ? ensureArray(costs)?.map(c => this.mapCost(c)) : [],
            profiles: profiles ? ensureArray(profiles)?.map(p => this.mapProfile(p)) : [],
            categoryLinks: categoryLinks ? ensureArray(categoryLinks)?.map(c => this.mapCategoryEntry(c)) : [],
            selectionEntries: subselections ? ensureArray(subselections).map(e => this.mapSelectionEntry(e)) : [],
            selectionEntryGroups: selectionEntryGroups ? ensureArray(selectionEntryGroups).map(g => this.mapSelectionEntryGroup(g)) : []
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

