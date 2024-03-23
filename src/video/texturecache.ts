const TEX = [
    '00_test.png',
    '01_player.png',
    '02_enemies.png'
]

const TEX_SIZE = 256;

class TextureCache {
    textures: Array<WebGLTexture>;
    txSize: number;
    txIn: number;
    txOut: number;

    constructor(gl: WebGLRenderingContext) {
        this.textures = [];
        this.txSize = TEX_SIZE;
        this.txIn = TEX.length;
        this.txOut = 0;

        // Fallback
        for (let i = 0; i < TEX.length; i++) {
            this.textures[i] = <WebGLTexture>gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.textures[i])
            let pixels:Array<number> = [];
            let color = 0;
            for(let i = 0; i < 256; i+=3){
                pixels.push(240);
                pixels.push(128);
                pixels.push(32);
            }
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 16, 16, 0,
            gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array(pixels));
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
            
        }
        
        for (let i = 0; i < TEX.length; i++) {
            let image = new Image();
            image.src = 'tex/' + TEX[i];
            image.addEventListener('load', () => {
                gl.bindTexture(gl.TEXTURE_2D, this.textures[i]);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.generateMipmap(gl.TEXTURE_2D);
                this.txOut++;
            });
        }
    }
}

export default TextureCache;