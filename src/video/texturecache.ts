const TEX_COUNT = 3;
const TEX_SIZE = 512;

class TextureCache {
    textures:Array<WebGLTexture>;
    textureSize:number;
    in:number;
    out:number;

    constructor(gl: WebGLRenderingContext) {
        this.textures = [];
        this.textureSize = TEX_SIZE;
        this.in = TEX_COUNT;
        this.out = 0;

        // Fallback
        let fallback = <WebGLTexture>gl.createTexture();
        let pixels:Array<number> = [];
        for(let i = 0; i < 256; i+=1){
            pixels.push(255);
        }
        
        gl.bindTexture(gl.TEXTURE_2D, fallback)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 16, 16, 0,
            gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array(pixels));
        gl.generateMipmap(gl.TEXTURE_2D);

        for (let i = 0; i < TEX_COUNT+1; i++) {
            this.textures[i] = fallback;            
        }

        // Load textures
        for (let i = 1; i < TEX_COUNT+1; i++) {
            let image = new Image();
            image.src = 'tex/tex_' + i + '.png';
            image.addEventListener('load', () => {
                this.textures[i] = <WebGLTexture>gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, this.textures[i]);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
                this.out++;
            });
        }
    }
}

export default TextureCache;