import MeshRenderer from './meshrenderer';
import RetroRenderer from './retrorenderer';
import Mesh from './mesh';

import tex from '../assets/tex';
import mdl from '../assets/mdl';

import VertexCache from './vertexcache';
import TextureCache from './texturecache';

class Video {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    width: number;
    height: number;

    meshRn: MeshRenderer;
    retroRn: RetroRenderer;
    textureCache: TextureCache;
    vertexCache: VertexCache;
    meshes: Array<Array<Mesh>>;

    fb: WebGLFramebuffer;
    fbColor: WebGLTexture;
    fbDepth: WebGLRenderbuffer;
    retro: boolean;

    constructor() {
        // Set internal resolution
        this.width = 240;
        this.height = 320;

        // Load canvas
        this.canvas = <HTMLCanvasElement>document.createElement('canvas');
        this.canvas.id = 'glCanvas';
        this.canvas.width = this.width * 2;
        this.canvas.height = this.height * 2;
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
        this.gl = <WebGLRenderingContext>this.canvas.getContext('experimental-webgl', { alpha: false });
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.BLEND);
        this.gl.enable(this.gl.DEPTH_TEST);

        // Load renderers
        this.meshRn = new MeshRenderer(this.width, this.height, this.gl);
        this.retroRn = new RetroRenderer(this.canvas.width, this.canvas.height, this.gl);

        // Enable retro renderer
        this.retro = true;

        // Load resources
        this.vertexCache = new VertexCache(this.gl);
        this.textureCache = new TextureCache(this.gl);

        this.meshes = [[]];
        for(let i = 0; i < tex.length; i++){
            this.meshes[i] = [];
        }

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

        // Prepare to render
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.vertexCache.buffer);
        this.meshRn.setAttr(this.gl);
    }

    addMesh(x:number, y:number, model:number, texture:number) {
        let mesh = new Mesh(x,y,model,texture);
        this.meshes[texture].push(mesh);
        return mesh;
    }

    addSprite(x:number, y:number, width:number, height:number, u:number, v:number, texture:number){
        let mesh = new Mesh(x,y,0,texture);
        mesh.scaleX = width;
        mesh.scaleY = height;
        mesh.scaleU = width/this.textureCache.textureSize;
        mesh.scaleV = height/this.textureCache.textureSize;
        mesh.u = u;
        mesh.v = v;
        this.meshes[texture].push(mesh);
        return mesh;
    }

    render() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null);
        this.gl.viewport(0, 0, this.width*2, this.height*2);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.meshRn.setProg(this.gl);
        for(let i = 0; i < this.meshes.length; i++){
            this.gl.bindTexture(this.gl.TEXTURE_2D,this.textureCache.textures[0])
            for(let j = 0; j < this.meshes[i].length; j++){
                let m = this.meshes[i][j];
                let start = this.vertexCache.buffIndex[m.model];
                let count = this.vertexCache.buffData[m.model].length/5;
                this.meshRn.render(this.gl,m,start,count);
            }
        }
        /*
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbColor);
        this.retroRn.setProg(this.gl);
        this.retroRn.render(this.gl,0,6);
        */
        
    }
}

export default Video;