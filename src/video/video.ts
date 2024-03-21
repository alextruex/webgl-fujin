import MeshRenderer from './meshrenderer';
import RetroRenderer from './retrorenderer';
import textureIndex from '../assets/textureindex';
import Mesh from './mesh';

import ModelCache from './modelcache';

class Video {
    canvas:HTMLCanvasElement;
    gl:WebGLRenderingContext;

    width:number;
    height:number;
    textureSize:number;

    meshRn:MeshRenderer;
    retroRn:RetroRenderer;

    meshes:Array<Array<Mesh>>;
    textures:Array<WebGLTexture>;

    fb:WebGLFramebuffer;
    fbColor:WebGLTexture;
    fbDepth:WebGLRenderbuffer;
    retro:boolean;

    constructor() {
        // Set internal resolution
        this.width = 420;
        this.height = 240;
        this.textureSize = 256;

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
        this.gl.enable(this.gl.DEPTH_TEST);

        // Load renderers
        this.meshes = [];
        this.meshRn = new MeshRenderer(this.width, this.height, this.textureSize, this.gl);
        this.retroRn = new RetroRenderer(this.canvas.width, this.canvas.height, this.gl);

        // Load textures
        this.textures = [];
        for(let i = 0; i < textureIndex.length; i++){
            this.meshes[i] = [];
            let image = new Image();
            image.src = 'img/' + textureIndex[i];
            image.addEventListener('load', () => {
                let tex = this.gl.createTexture();
                this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
                this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,this.gl.UNSIGNED_BYTE, image);
                this.gl.generateMipmap(this.gl.TEXTURE_2D);
                this.textures[i] = <WebGLTexture>tex;
            });
        }

        // Enable retro renderer
        this.retro = true;

        // Set fb color
        this.fbColor = <WebGLTexture>this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbColor);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        // Set fb depth
        this.fbDepth = <WebGLRenderbuffer>this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.fbDepth);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.width, this.height);

        // Set framebuffer
        this.fb = <WebGLFramebuffer>this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.fbColor, 0);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.fbDepth);      
    }

    addMesh(x:number, y:number, model:string, texture:number) {
        let mesh = new Mesh(x,y,model,texture);
        this.meshes[texture].push(mesh);
        return mesh;
    }

    addSprite(x:number, y:number, width:number, height:number, u:number, v:number, texture:number){
        let mesh = new Mesh(x,y,'sprite',texture);
        mesh.scaleX = width;
        mesh.scaleY = height;
        mesh.scaleU = width/this.textureSize;
        mesh.scaleV = height/this.textureSize;
        mesh.u = u;
        mesh.v = v;
        this.meshes[texture].push(mesh);
        return mesh;
    }

    render() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);
        this.gl.viewport(0,0,this.width,this.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.meshRn.setProg(this.gl);
        for(let i = 0; i < this.textures.length; i++){
            // if HUD layer, then clear depth buffer
            this.gl.bindTexture(this.gl.TEXTURE_2D,this.textures[i]);
            this.meshRn.render(this.gl, this.meshes[i]);
        }

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0,0,this.canvas.width,this.canvas.height);

        this.retroRn.setProg(this.gl);
        this.gl.bindTexture(this.gl.TEXTURE_2D,this.fbColor);
        this.retroRn.render(this.gl);
    }
}

export default Video;