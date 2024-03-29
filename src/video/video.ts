import MeshRenderer from './meshrenderer';
import RetroRenderer from './retrorenderer';

import Mesh from '../common/mesh';

import VertexCache from './vertexcache';
import TextureCache from './texturecache';

const WIDTH = 180;
const HEIGHT = 320;

class Video {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;

    meshRn: MeshRenderer;
    retroRn: RetroRenderer;
    tCache: TextureCache;
    vCache: VertexCache;
    meshes: Array<Array<Mesh>>;

    fb: WebGLFramebuffer;
    fbColor: WebGLTexture;
    fbDepth: WebGLRenderbuffer;
    retro: boolean;

    constructor() {
        // Load canvas
        this.canvas = <HTMLCanvasElement>document.createElement('canvas');
        this.canvas.id = 'glCanvas';
        this.canvas.width = WIDTH*2;
        this.canvas.height = HEIGHT*2;
        document.body.appendChild(this.canvas);
        this.canvas.style.position = 'absolute';
        this.canvas.style.margin = 'auto';
        this.canvas.style.left = '0px';
        this.canvas.style.right = '0px';
        this.canvas.style.top = '0px';
        this.canvas.style.bottom = '0px';
        this.canvas.style.width = WIDTH / HEIGHT * 100 + 'vh';
        this.canvas.style.height = '100vh';
        this.canvas.style.maxHeight = HEIGHT / WIDTH * 100 + 'vw';
        this.canvas.style.maxWidth = '100vw';
        //this.canvas.style.imageRendering = 'optimizeLegibility';
        document.body.style.margin = '0px';
        document.body.style.backgroundColor = '#333333';

        // Set context
        this.gl = <WebGLRenderingContext>this.canvas.getContext('experimental-webgl', { alpha: false });
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);

        // Load renderers
        this.meshRn = new MeshRenderer(WIDTH, HEIGHT, this.gl);
        this.retroRn = new RetroRenderer(WIDTH*2, HEIGHT*2, this.gl);

        // Enable retro renderer
        this.retro = true;

        // Load resources
        this.vCache = new VertexCache(this.gl);
        this.tCache = new TextureCache(this.gl);

        this.meshes = [];
        for(let i = 0; i < this.tCache.textures.length; i++){
            this.meshes.push([]);
        }

        // Set fb color
        this.fbColor = <WebGLTexture>this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbColor);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, WIDTH, HEIGHT, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        // Set fb depth
        this.fbDepth = <WebGLRenderbuffer>this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.fbDepth);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, WIDTH, HEIGHT);

        // Set framebuffer
        this.fb = <WebGLFramebuffer>this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.fbColor, 0);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.fbDepth);

        // Prepare to render
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.vCache.buffer);
        this.meshRn.setAttr(this.gl);
    }

    getProgress(){
        return ([this.vCache.out/this.vCache.in,this.tCache.out/this.tCache.in]);
    }

    addMesh(x:number, y:number, model:number, texture:number) {
        let mesh = new Mesh(x,y,model,texture);
        this.meshes[texture].push(mesh);
        return mesh;
    }

    addSprite(x:number, y:number, width:number, height:number, u:number, v:number, texture:number){
        let mesh = new Mesh(x,y,0,texture);
        mesh.scaleX = width/2;
        mesh.scaleY = height/2;
        mesh.scaleU = width/this.tCache.textureSize;
        mesh.scaleV = -height/this.tCache.textureSize;
        mesh.u = u;
        mesh.v = v;
        this.meshes[texture].push(mesh);
        return mesh;
    }

    clear(){
        this.meshes = [];
        for(let i = 0; i < this.tCache.textures.length; i++){
            this.meshes.push([]);
        }
    }

    render() {
        // Mesh renderer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.fb);
        this.gl.viewport(0, 0, WIDTH, HEIGHT);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.meshRn.setProg(this.gl);
        this.meshRn.render(this.gl,this.meshes,this.tCache,this.vCache);

        // Retro filter
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbColor);
        this.retroRn.setProg(this.gl);
        this.retroRn.render(this.gl,this.vCache);
    }
}

export default Video;