import repl from 'repl';

import { WahaSearchLoader } from './lib/models/wahaSearchLoader';

async function main() {
    const result = WahaSearchLoader.debugdata();
    repl.start('> ').context.result = result;
}

main()