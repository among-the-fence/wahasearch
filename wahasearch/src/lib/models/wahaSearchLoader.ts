import aeldari from "@/lib/data/wh40k-10eAeldari - Aeldari Library.cat.json"
import alldata from "@/lib/data/wh40k-10e.json"

export class WahaSearchLoader {
    static debugdata() {
        return aeldari;
    }
    static data() {
        return alldata;
    }
}

