import repl from 'repl';

import testJsonContent from "@/lib/data/wh40k-10eAeldari - Aeldari Library.cat.json"

async function main() {
    const result = testJsonContent;
    repl.start('> ').context.result = result;
}

main()