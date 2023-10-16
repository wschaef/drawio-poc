import { DrawioParser } from './DrawioParser';  // Adjust the path as needed
import { Transformer } from './Transformer';


const inputFilename = "./data/1.drawio"
const outputFilename = "./data/2.drawio"

const main = async () => {
    const parser = new DrawioParser();
    try {
        const model = await parser.parse(inputFilename);
        const transformer = new Transformer();
        transformer.transformMxCell(model);
        parser.exportToFile(outputFilename, model)
    } catch (error) {
        console.error(error);
    }
};

main();
