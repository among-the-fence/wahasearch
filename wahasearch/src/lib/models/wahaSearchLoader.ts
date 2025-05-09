import aeldari from "@/lib/data/wh40k-10eAeldari - Aeldari Library.cat.json"
import alldata from "@/lib/data/wh40k-10e.json"
import { Catalogue } from "./catalogue";

export class WahaSearchLoader {
    static debugdata() {
        return WahaSearchLoader.extract(aeldari);
    }
    static data() {
        return WahaSearchLoader.extract(alldata);
    }

    static extract(x: any) {
        const fullcatalogueList: Catalogue[] = [];
        (x as Array<any>).forEach((catalogueparent: any) => {
            fullcatalogueList.push(new Catalogue(catalogueparent));
        });
        return fullcatalogueList;
    }
}

