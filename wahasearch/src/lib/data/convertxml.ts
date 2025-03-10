import { XMLParser } from 'fast-xml-parser';
import { readFile, writeFile, readdir } from 'fs/promises';

const outputFile = 'wahasearch/src/lib/data/wh40k-10e';
const inputDir = 'data/wh40k-10e/';

async function processFile() {
    try {
        const catfiles = await readdir(inputDir);
        const out: any[] = [];
        let gstData: any = {};
        const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

        for (const file of catfiles) {
            if (file.endsWith('.cat')) {
                console.log(`Processing: ${file}`);

                const data = await readFile(inputDir + file, 'utf8');
                const jsonifiedXmlData = parser.parse(data);
                out.push(jsonifiedXmlData);
                if (file.includes("Aeldari Library") || file.includes("Craftworld")) {
                    await writeFile(outputFile + file + ".json", JSON.stringify(jsonifiedXmlData, null, 2), 'utf8');
                }
            }
            else if (file.endsWith('.gst')) {
                console.log(`Processing: ${file}`);

                const data = await readFile(inputDir + file, 'utf8');
                gstData = parser.parse(data);
            }
            else {
                console.log(`Skipping: ${file}`);
            }
        }

        console.log("DONE");
        await writeFile(outputFile + ".gst.json", JSON.stringify(gstData, null, 2), 'utf8');
        await writeFile(outputFile + ".json", JSON.stringify(out, null, 2), 'utf8');
        console.log(`Data written to ${outputFile}`);
    } catch (error) {
        console.error("Error:", error);
    }
}

processFile();