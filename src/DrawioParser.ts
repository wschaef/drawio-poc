import * as fs from 'fs';
import * as xml2js from 'xml2js';

export class DrawioParser {
    private parser: xml2js.Parser;
    private builder: xml2js.Builder;

    constructor() {
        this.parser = new xml2js.Parser();
        this.builder = new xml2js.Builder();
    }

    public async parse(filePath: string): Promise<any> {
        let model
        try {
            // Read the .drawio file
            const xmlData = fs.readFileSync(filePath, 'utf8');

            // Parse the XML content
            this.parser.parseString(xmlData, (err, result) => {
                if (err) {
                    console.error('Error parsing XML:', err);
                    return;
                }

                model = result;
            });
        } catch (error) {
            console.error('Error:', error);
        }
        return model
    }

    public exportToFile(outputPath: string, model: any): void {
        if (!model) {
            console.error('No data to export. Please parse a file first.');
            return;
        }

        // Convert JavaScript object back to XML
        const xml = this.builder.buildObject(model);

        // Write to a new .drawio file
        fs.writeFileSync(outputPath, xml, 'utf8');
        console.log(`Data exported to ${outputPath}`);
    }
}

