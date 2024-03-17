import Sprite from './sprite';
import images from '../assets/images';

class SpriteRenderer{
    width:number;
    height:number;

    prog:WebGLProgram;
    buffer:WebGLBuffer;
    a_pos:number;
    
    constructor(width:number, height:number, gl:WebGLRenderingContext){
        // Set renderer resolution
        this.width = width;
        this.height = height;
        
        // Load vertex shader
        let vShader = <WebGLShader>gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vShader, '' +
            'attribute vec2 a_pos;' +
            'varying vec2 v_tex;' +
            'void main(){' +
            'gl_Position = vec4(a_pos, 0, 1);' +
            'v_tex = a_pos / vec2(2.0,2.0) + vec2(0.5,0.5);' +
            '}');
        gl.compileShader(vShader);

        // Load fragment shader
        let fShader = <WebGLShader>gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fShader, '' +
            'precision mediump float;' +
            'varying vec2 v_tex;' +
            'uniform sampler2D u_texture;' +
            'void main() {' +
            'vec4 color = texture2D(u_texture, v_tex);' +
            'gl_FragColor = color;' +
            '}');
        gl.compileShader(fShader);

        // Load program
        this.prog = <WebGLProgram>gl.createProgram();
        gl.attachShader(this.prog, vShader);
        gl.attachShader(this.prog, fShader);
        gl.linkProgram(this.prog);

        // Load vertex buffer
        this.buffer = <WebGLBuffer>gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);
        this.a_pos = gl.getAttribLocation(this.prog,'a_pos');
        gl.enableVertexAttribArray(this.a_pos);
        gl.vertexAttribPointer(this.a_pos, 2, gl.FLOAT, false, 0, 0);

    }

    render(width:number, height:number, gl:WebGLRenderingContext){
        gl.useProgram(this.prog);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

export default SpriteRenderer;