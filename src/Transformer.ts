import { parseString, Builder } from 'xml2js';
export class Transformer {
    public DEFAULT_HEIGHT = -30
    public async transformMxCell(model: any): Promise<void> {

        const mxCells = model?.mxfile?.diagram[0]?.mxGraphModel[0]?.root[0]?.mxCell;

        if (!mxCells) {
            console.error('No mxCells found.');
            return;
        }

        for (const mxCell of mxCells) {
            // if (mxCell.$.id > '1') {
            if (mxCell.$.style?.startsWith("rounded=")) {

                let x = parseInt(mxCell.mxGeometry[0].$.x) || 0
                let y = parseInt(mxCell.mxGeometry[0].$.y) || 0
                let width = parseInt(mxCell.mxGeometry[0].$.width) || 1
                let height = parseInt(mxCell.mxGeometry[0].$.height) || 1

                let newPolyCoords = [
                    this.toIso([0, height]),
                    this.toIso([0, 0]),
                    this.add3dHeight(this.toIso([0, 0])),
                    this.add3dHeight(this.toIso([width, 0])),
                    this.add3dHeight(this.toIso([width, height])),
                    this.toIso([width, height]),
                    this.toIso([0, height]),
                    this.add3dHeight(this.toIso([0, height])),
                    this.add3dHeight(this.toIso([0, 0])),
                    this.add3dHeight(this.toIso([0, height])),
                    this.add3dHeight(this.toIso([width, height])),
                ];

                // make geometry more centralized
                newPolyCoords = newPolyCoords.map(c => [c[0] - width / 2, c[1] + height / 2 - this.DEFAULT_HEIGHT])

                // scale shape to be relative to the geometry
                newPolyCoords = newPolyCoords.map(c => [c[0] / width, c[1] / height])

                // const template = await this.getXmlObject(templateQuader)
                // let style = template.mxCell.$.style;
                let style = `shape=mxgraph.basic.polygon;polyCoords=${JSON.stringify(newPolyCoords)};polyline=1;`

                // Update the style string
                mxCell.$.style = mxCell.$.style + style
                mxCell.mxGeometry[0].$.width = width
                mxCell.mxGeometry[0].$.height = height
                const shift = this.toIso([x, y]) // move the geometry according the isometric
                mxCell.mxGeometry[0].$.x = shift[0]
                mxCell.mxGeometry[0].$.y = shift[1]

            }
        }
        new Builder().buildObject(model)

    }
    public add3dHeight([x, y]: [number, number]): [number, number] {
        return [x, y + this.DEFAULT_HEIGHT]
    }

    public toIso([x, y]: [number, number]): [number, number] {
        let newCoordinates = [Math.cos(30 * (Math.PI / 180)) * (x + y), 0.5 * (y - x)];
        return newCoordinates.map(c => parseFloat(c.toFixed(2))) as [number, number]
    }

    public async getXmlObject(template: string): Promise<any> {
        return new Promise((resolve, reject) => {
            parseString(template, (err, result) => {
                if (err) {
                    console.error('Failed to parse XML:', err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}


const templateText = `
<mxCell id="15" value="Text" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;rotation=330;fontColor=#FF3333;" vertex="1" parent="1">
    <mxGeometry x="-470" y="315" width="149" height="78" as="geometry"/>
</mxCell>
`;
