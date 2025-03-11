import { EntryLink } from "../gameData";

export class DataCard {
    name: string;
    id: string;
    isLegends: boolean;
    entrylink: EntryLink;
    linkedItem: any;

    constructor(link: EntryLink) {
        this.name = link.name.replace(" [Legends]", "");
        this.id = link.id;
        this.isLegends = link.name.includes("[Legends]");
        this.entrylink = link;
        this.linkedItem = null;
    }

    getDisplayedProfile() {
        return this.linkedItem?.profiles?.filter((p: { typeId: string; }) => p.typeId === "c547-1836-d8a-ff4f");
    }
}