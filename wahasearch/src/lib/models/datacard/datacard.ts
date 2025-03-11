import { EntryLink } from "../gameData";

export class DataCard {
    name: string;
    id: string;
    isLegends: boolean;

    constructor(link: EntryLink) {
        this.name = link.name.replace("[Legends]", "");
        this.id = link.id;
        this.isLegends = link.name.includes("[Legends]");
    }
}