import { parseString, Builder } from 'xml2js';
export class Transformer {
    public DEFAULT_HEIGHT = -100
    public async transformMxCell(model: any): Promise<void> {

        const mxCells = model?.mxfile?.diagram[0]?.mxGraphModel[0]?.root[0]?.mxCell;

        if (!mxCells) {
            console.error('No mxCells found.');
            return;
        }

        for (const mxCell of mxCells) {
            if (mxCell.$.id === '2') {
                // mxCell.mxGeometry[0].$.width = '320';
                // console.log('Transformed mxCell with id=2');
                let x = parseInt(mxCell.mxGeometry[0].$.x) || 0
                let y = parseInt(mxCell.mxGeometry[0].$.y) || 0
                let width = parseInt(mxCell.mxGeometry[0].$.width) || 1
                let height = parseInt(mxCell.mxGeometry[0].$.height) || 1

                console.log(mxCell.mxGeometry)

                let newPolyCoords = [
                    this.toIso([x, y + height]),
                    this.toIso([x, y]),
                    this.add3dHeight(this.toIso([x, y])),
                    this.add3dHeight(this.toIso([x + width, y])),
                    this.add3dHeight(this.toIso([x + width, y + height])),
                    this.toIso([x + width, y + height]),
                    this.toIso([x, y + height]),
                    this.add3dHeight(this.toIso([x, y + height])),
                    this.add3dHeight(this.toIso([x, y])),
                    this.add3dHeight(this.toIso([x, y + height])),
                    this.add3dHeight(this.toIso([x + width, y + height])),
                ]
                newPolyCoords.forEach(c => [c[0] / width, c[1] / height])

                console.log(newPolyCoords)
                const template = await this.getXmlObject(templateQuader)
                let style = template.mxCell.$.style;
                style = style.replace("{{polyCoords}}", JSON.stringify(newPolyCoords));

                // Update the style string
                mxCell.$.style = style;
                // mxCell.mxGeometry[0].$.width = 400

                break;
            }
        }
        new Builder().buildObject(model)

    }
    public add3dHeight([x, y]: [number, number]): [number, number] {
        return [x, y + this.DEFAULT_HEIGHT]
    }

    public toIso([x, y]: [number, number]): [number, number] {
        // x = parseInt(x)
        // y = parseInt(y)
        // sin(30) = 0,5
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


const templateQuader = `
<mxCell id="5" value="" style="verticalLabelPosition=bottom;verticalAlign=top;html=1;shape=mxgraph.basic.polygon;polyCoords={{polyCoords}};polyline=1;fillColor=none;" vertex="1" parent="1">
  <mxGeometry x="-31" y="98" width="10" height="10" as="geometry"/>
</mxCell>
`;
