import MeshRenderer from './meshrenderer';
import RetroRenderer from './retrorenderer';
import ScaleRenderer from './scalerenderer';

import Mesh from '../common/mesh';

import VertexCache from './vertexcache';
import TextureCache from './texturecache';

const WIDTH = 240;
const HEIGHT = 320;

class Video {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;

    meshRn: MeshRenderer;
    retroRn: RetroRenderer;
    scaleRn: ScaleRenderer;

    tCache: TextureCache;
    vCache: VertexCache;
    meshes: Array<Array<Mesh>>;

    meshFB: WebGLFramebuffer;
    meshFBColor: WebGLTexture;
    meshFBDepth: WebGLRenderbuffer;

    retroFB: WebGLFramebuffer;
    retroFBColor: WebGLTexture;
    retroFBDepth: WebGLRenderbuffer;



    constructor() {
        // Load canvas
        this.canvas = <HTMLCanvasElement>document.createElement('canvas');
        this.canvas.id = 'glCanvas';

        document.body.appendChild(this.canvas);
        this.canvas.width = WIDTH * 3;
        this.canvas.height = HEIGHT * 3;
        this.canvas.style.margin = 'auto';
        this.canvas.style.width = '' + this.canvas.width + 'px';
        this.canvas.style.display = 'block';
        document.body.style.backgroundColor = '#333333';

        /*
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
        */

        this.canvas.style.imageRendering = 'optimizeSpeed';



        console.log(this.canvas.width);

        // Set context
        this.gl = <WebGLRenderingContext>this.canvas.getContext('webgl2', { alpha: false });
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);

        // Load extensions
        const ext =
            this.gl.getExtension("EXT_texture_filter_anisotropic") ||
            this.gl.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
            this.gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        if (ext) {
            const max = this.gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            
            //this.gl.texParameterf(this.gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
        }

        console.log(typeof ext);

        // Load renderers
        this.meshRn = new MeshRenderer(WIDTH, HEIGHT, this.gl);
        this.retroRn = new RetroRenderer(WIDTH * 2, HEIGHT * 2, this.gl);
        this.scaleRn = new ScaleRenderer(this.canvas.width, this.canvas.height, this.gl);

        // Load resources
        this.vCache = new VertexCache(this.gl);
        this.tCache = new TextureCache(this.gl);

        this.meshes = [];
        for (let i = 0; i < this.tCache.textures.length; i++) {
            this.meshes.push([]);
        }

        // Set mesh fb color
        this.meshFBColor = <WebGLTexture>this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.meshFBColor);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, WIDTH, HEIGHT, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        // Set mesh fb depth
        this.meshFBDepth = <WebGLRenderbuffer>this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.meshFBDepth);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, WIDTH, HEIGHT);

        // Set mesh framebuffer
        this.meshFB = <WebGLFramebuffer>this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.meshFB);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.meshFBColor, 0);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.meshFBDepth);

        // Set retro fb color
        this.retroFBColor = <WebGLTexture>this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.retroFBColor);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, WIDTH * 2, HEIGHT * 2, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameterf(this.gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, 4);


        // Set retro fb depth
        this.retroFBDepth = <WebGLRenderbuffer>this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.retroFBDepth);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, WIDTH * 2, HEIGHT * 2);

        // Set retro framebuffer
        this.retroFB = <WebGLFramebuffer>this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.retroFB);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.retroFBColor, 0);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.retroFBDepth);

        // Prepare to render
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vCache.buffer);
        this.meshRn.setAttr(this.gl);
    }

    getProgress() {
        return ([this.vCache.out / this.vCache.in, this.tCache.out / this.tCache.in]);
    }

    addMesh(x: number, y: number, model: number, texture: number) {
        let mesh = new Mesh(x, y, model, texture);
        this.meshes[texture].push(mesh);
        return mesh;
    }

    addSprite(x: number, y: number, width: number, height: number, u: number, v: number, texture: number) {
        let mesh = new Mesh(x, y, 0, texture);
        mesh.scaleX = width / 2;
        mesh.scaleY = height / 2;
        mesh.scaleU = width / this.tCache.textureSize;
        mesh.scaleV = -height / this.tCache.textureSize;
        mesh.u = u;
        mesh.v = v;
        this.meshes[texture].push(mesh);
        return mesh;
    }

    clear() {
        this.meshes = [];
        for (let i = 0; i < this.tCache.textures.length; i++) {
            this.meshes.push([]);
        }
    }

    render() {
        // Mesh renderer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.meshFB);
        this.gl.viewport(0, 0, WIDTH, HEIGHT);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.meshRn.setProg(this.gl);
        this.meshRn.render(this.gl, this.meshes, this.tCache, this.vCache);

        // Retro renderer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.retroFB);
        this.gl.viewport(0, 0, WIDTH * 2, HEIGHT * 2);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.meshFBColor);
        this.retroRn.setProg(this.gl);
        this.retroRn.render(this.gl, this.vCache);

        // Upscale renderer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.retroFBColor);
        this.scaleRn.setProg(this.gl);
        this.scaleRn.render(this.gl, this.vCache);
    }
}

export default Video;