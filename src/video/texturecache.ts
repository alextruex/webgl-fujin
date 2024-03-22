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
        for (let i = 0; i < this.textures.length; i++) {
            this.textures[i] = <WebGLTexture>gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.textures[i])
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 3, 2, 0,
                gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8Array([128,64,128,0,192,0]));
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        }

        for (let i = 0; i < tex.length; i++) {
            let image = new Image();
            image.src = 'img/' + tex[i];
            image.addEventListener('load', () => {
                let texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
                this.textures[i] = <WebGLTexture>texture;
                this.texturesOut++;
            });
        }
    }

    bindTexture(tex:number){

    }
}

export default TextureCache;