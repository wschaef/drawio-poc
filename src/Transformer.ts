export class Transformer {
    public transformMxCell(model: any): void {
        // Assuming the model is an object that contains the mxCell data
        const mxCells = model?.mxfile?.diagram[0]?.mxGraphModel[0]?.root[0]?.mxCell;

        if (!mxCells) {
            console.error('No mxCells found.');
            return;
        }

        // Find the mxCell with id="2" and change its width to 320
        for (const mxCell of mxCells) {
            if (mxCell.$.id === '2') {
                mxCell.mxGeometry[0].$.width = '320';
                console.log('Transformed mxCell with id=2');
                break;
            }
        }
    }
}
