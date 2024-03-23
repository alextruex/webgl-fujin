import tex from '../assets/tex';

class TextureCache {
    textures: Array<WebGLTexture>;
    textureSize: number;
    texturesIn: number;
    texturesOut: number;

    constructor(gl: WebGLRenderingContext) {
        this.textures = [];
        this.textureSize = 256;
        this.texturesIn = tex.length;
        this.texturesOut = 0;

        // Fallback
        for (let i = 0; i < tex.length; i++) {
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
        
        /*
        for (let i = 0; i < tex.length; i++) {
            let image = new Image();
            image.src = 'img/' + tex[i];
            image.addEventListener('load', () => {
                gl.bindTexture(gl.TEXTURE_2D, this.textures[i]);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.generateMipmap(gl.TEXTURE_2D);
                this.texturesOut++;
            });
        }
        */
        
    }

    setTexture(gl:WebGL2RenderingContext,texIndex:number){
        gl.bindTexture(gl.TEXTURE_2D,this.textures[texIndex]);
    }
}

export default TextureCache;