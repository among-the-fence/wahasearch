import aeldari from "@/lib/data/wh40k-10eAeldari - Aeldari Library.cat.json"
import alldata from "@/lib/data/wh40k-10e.json"
import { Catalogue } from "./catalogue";
import { DataCard } from "./datacard";

export class WahaSearchLoader {
    static debugdata() {
        return WahaSearchLoader.extract(aeldari);
    }
    static data() {
        const data: any = []
        const extracted = WahaSearchLoader.extract(alldata);
        extracted.forEach((library) => {
            data.push(...library.datacards);
        })
        data.sort(DataCard.datacardCompare);
        return data;
    }

    static extract(x: any) {
        const fullcatalogueList: Catalogue[] = [];
        (x as Array<any>).forEach((catalogueparent: any) => {
            fullcatalogueList.push(new Catalogue(catalogueparent));
        });
        return fullcatalogueList;
    }
}

