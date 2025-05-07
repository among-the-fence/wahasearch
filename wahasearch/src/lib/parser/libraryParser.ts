import { Dispatch, SetStateAction } from "react";
import { Renderable, Basic } from "@/lib/models/renderable";
import { ensureArray } from "@/lib/util"

class LibraryParser {
    constructor() { }

    public async parseLibrary(messageUpdater: Dispatch<SetStateAction<string>>, rawJson: any): Promise<Map<string, Renderable>> {
        const x = new Map<string, Renderable>();
        const sharedProfiles = [];

        rawJson?.forEach((library: any) => {
            ensureArray(library.catalogue)?.forEach((catalogue: any) => {
                console.log(catalogue);
                ensureArray(catalogue.sharedSelectionEntries)?.forEach((c: any) => {
                    console.log(c);
                    sharedProfiles[c.id] = new Basic();
                });
                ensureArray(catalogue.sharedSelectionEntryGroups)?.forEach((c: any) => {
                    console.log(c);
                    x.set(c.id, new Basic());
                });
                ensureArray(catalogue.catalogueLinks)?.forEach((c: any) => {
                    console.log(c);
                    x.set(c.id, new Basic());
                });
            });
        });

        rawJson?.forEach((library: any) => {
            ensureArray(library.catalogue)?.forEach((catalogue: any) => {
                ensureArray(catalogue.sharedProfiles)?.forEach((c: any) => {
                    console.log(c);
                    x.set(c.id, new Basic());
                });

            });
        });
        return x;
    }

}



export default LibraryParser;
