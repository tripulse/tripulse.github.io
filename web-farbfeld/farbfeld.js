function dataViewEquality(a, b) {
    a = new Uint8Array(a);
    b = new Uint8Array(b);

    if(a.length != b.length)
        return false;
    
    for([idx, elem] in a.keys())
        if(elem != b[idx])
            return false;
    return true;
}

class Farbfeld {
    /**
     * @description Decodes a `ImageData` out of raw Farbfeld data.
     * @param data raw Farbfeld bytestream.
     * @returns an `ImageData` object if successful. 
     */
    static decode(data) {        
        data = new DataView(data);
        
        if(dataViewEquality([70,97,114,98,102,101,108,100], data.buffer.slice(0, 8)))
            throw new SyntaxError("Farbfeld signature mismatch");
        
        const [width, height] = [data.getUint32(8, false), 
                                 data.getUint32(12, false)];
        
        let output = new ImageData(width, height);
        let pixelPosition = 0;
        let pixelData = 0;

        for(let y = 0; y < height; ++y) {
            for(let x = 0; x < width; ++x) {
                for(let c = 0; c < 4; ++c) {
                    pixelPosition = 4*width*y + 4*x;
                    pixelData = data.getUint16(2*pixelPosition, false);

                    output.data[pixelPosition] = (pixelData << 8) + pixelData;
                }
            }
        }

        return output;
    }
}