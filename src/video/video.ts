import MeshRenderer from './meshrenderer';
import FrameRenderer from './framerenderer';
import RetroRenderer from './retrorenderer';
import SpriteRenderer from './spriterenderer';

import Mesh from './mesh';
import Sprite from './sprite';
import images from '../assets/images';

class Video {
    canvas:HTMLCanvasElement;
    width:number;
    height:number;
    gl:WebGLRenderingContext;

    meshRn:MeshRenderer;
    frameRn:FrameRenderer;
    retroRn:RetroRenderer;
    spriteRn:SpriteRenderer;

    meshes:Array<Array<Mesh>>;
    sprites:Record<string,Sprite>;
    textures:Array<WebGLTexture>;

    fbTex1:WebGLTexture;
    fb1:WebGLFramebuffer;
    retro:boolean;

    constructor() {
        // Set internal resolution
        this.width = 240;
        this.height = 320;

        // Load canvas
        this.canvas = <HTMLCanvasElement>document.createElement('canvas');
        this.canvas.id = 'glCanvas';
        this.canvas.width = this.width*2;
        this.canvas.height = this.height*2;
        document.body.appendChild(this.canvas);
        this.canvas.style.position = 'absolute';
        this.canvas.style.margin = 'auto';
        this.canvas.style.left = '0px';
        this.canvas.style.right = '0px';
        this.canvas.style.top = '0px';
        this.canvas.style.bottom = '0px';
        this.canvas.style.width = this.width / this.height * 100 + 'vh';
        this.canvas.style.height = '100vh';
        this.canvas.style.maxHeight = this.height / this.width * 100 + 'vw';
        this.canvas.style.maxWidth = '100vw';
        this.canvas.style.imageRendering = 'optimizeLegibility';
        document.body.style.margin = '0px';
        document.body.style.backgroundColor = '#333333';        

        // Set context
        this.gl = <WebGLRenderingContext>this.canvas.getContext('experimental-webgl',{alpha:false});
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.BLEND);
        this.gl.enable(this.gl.CULL_FACE);
 
        // Load renderers
        this.meshes = [];
        this.sprites = {};
        this.meshRn = new MeshRenderer(this.width, this.height, this.gl);
        this.frameRn = new FrameRenderer(this.canvas.width, this.canvas.height, this.gl);
        this.retroRn = new RetroRenderer(this.canvas.width, this.canvas.height, this.gl);
        this.spriteRn = new SpriteRenderer(this.canvas.width, this.canvas.height, this.gl);

        // Load textures
        this.textures = [];
        for(let i = 0; i < images.length; i++){
            this.meshes[i] = [];
            let image = new Image();
            image.src = 'img/' + images[i];
            image.addEventListener('load', () => {
                let tex = this.gl.createTexture();
                this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
                this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,this.gl.UNSIGNED_BYTE, image);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                this.textures[i] = <WebGLTexture>tex;
            });
        }

        // Enable retro renderer
        this.retro = true;

        // Set framebuffers
        this.fbTex1 = <WebGLTexture>this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbTex1);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.fb1 = <WebGLFramebuffer>this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb1);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.fbTex1, 0);
    }

    addMesh(mesh:Mesh, texture:number) {
        this.meshes[texture].push(mesh);
    }

    delMesh(index:string){
        delete this.meshes[index];
    }

    render() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb1);
        this.gl.viewport(0,0,this.width,this.height);
        this.gl.bindTexture(this.gl.TEXTURE_2D,this.textures[0]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.meshRn.render(this.gl, this.meshes[0]);
        //this.spriteRn.render(this.width,this.height,this.gl);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0,0,this.canvas.width,this.canvas.height);
        this.gl.bindTexture(this.gl.TEXTURE_2D,this.fbTex1);
        this.retroRn.render(this.gl);
    }
}

export default Video;