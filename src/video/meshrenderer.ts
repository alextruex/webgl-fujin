import Mesh from './mesh';
import Sprite from './sprite'
import models from '../assets/models';
import images from '../assets/images';
import {m4Multiply} from '../math/matrix';

class MeshRenderer {
    meshes:Record<string,Mesh>;
    sprites:Record<string,Sprite>;

    prog:WebGLProgram;
    buffer:WebGLBuffer;
    buffStart:Record<string,number>;
    buffLength:Record<string,number>;
    textures:Record<string,WebGLTexture>;

    a_pos:number;
    a_tex:number;
    u_pos:WebGLUniformLocation;
    u_tex:WebGLUniformLocation;

    constructor(gl:WebGLRenderingContext, meshes:Record<string,Mesh>, sprites:Record<string,Sprite>) {
        // Load objects to draw
        this.meshes = meshes;
        this.sprites = sprites;

        // Load vertex shader
        let vShader = <WebGLShader>gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vShader, '' +
            'uniform mat4 u_pos;' +
            'uniform vec2 u_tex;' +
            'attribute vec4 a_pos;' +
            'attribute vec2 a_tex;' +
            'varying vec2 v_tex;' +
            'varying vec2 v_uv;' +
            'void main(){' +
            'gl_Position = u_pos * a_pos;' +
            'v_tex = a_tex;' +
            'v_uv = u_tex;' +
            '}');
        gl.compileShader(vShader);

        // Load fragment shader
        let fShader = <WebGLShader>gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fShader, '' +
            'precision mediump float;' +
            'varying vec2 v_tex;' +
            'varying vec2 v_uv;' +
            'uniform sampler2D u_texture;' +
            'void main() {' +
            'vec4 color = texture2D(u_texture, vec2(v_tex.x + v_uv.x, v_tex.y + v_uv.y));' +
            'gl_FragColor = color;' +
            '}');
        gl.compileShader(fShader);

        // Load program
        this.prog = <WebGLProgram>gl.createProgram();
        gl.attachShader(this.prog, vShader);
        gl.attachShader(this.prog, fShader);
        gl.linkProgram(this.prog);
        this.a_pos = gl.getAttribLocation(this.prog,'a_pos');
        this.a_tex = gl.getAttribLocation(this.prog,'a_tex');
        gl.enableVertexAttribArray(this.a_pos);
        gl.enableVertexAttribArray(this.a_tex);
        this.u_pos = <WebGLUniformLocation>gl.getUniformLocation(this.prog, 'u_pos');
        this.u_tex = <WebGLUniformLocation>gl.getUniformLocation(this.prog, 'u_tex');
        
        // Load vertex buffer
        let data:Array<number> = [];
        let index = 0;
        this.buffStart = {};
        this.buffLength = {};
        for(let i in models){
            data = data.concat(models[i]);
            this.buffStart[i] = index;
            this.buffLength[i] = models[i].length;
            index += models[i].length;
        }
        this.buffer = <WebGLBuffer>gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

        // Load textures
        this.textures = {};
        for(let i in images){
            let image = new Image();
            image.src = 'img/' + images[i];
            image.addEventListener('load', () => {
                let tex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                this.textures[images[i]] = <WebGLTexture>tex;
            });
        }
    }

    render(width:number, height:number, gl:WebGLRenderingContext){
        // Clear
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Set program
        gl.useProgram(this.prog)
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.vertexAttribPointer(this.a_pos, 3, gl.FLOAT, false, 20, 0);
        gl.vertexAttribPointer(this.a_tex, 2, gl.FLOAT, false, 20, 12);

        // Draw each mesh
        for(let i in this.meshes){
            let m = this.meshes[i];
            let s = 0;
            let c = 0;

            // Projection
            let matrix = [
                1/width, 0, 0, 0,
                0, 1 / height, 0, 0,
                0, 0, -1 / height, 0,
                -1, 1, 0, 1
            ];

            // Translation
            if(m.x || m.y || m.z){
                matrix = m4Multiply(matrix, [
                    1,0,0,0,
                    0,1,0,0,
                    0,0,1,0,
                    m.x,-m.y,m.z,1
                ]);
            }

            // X Rotation
            if(m.rotX){
                c = Math.cos(m.rotX*Math.PI/180);
                s = Math.sin(m.rotX*Math.PI/180);
                matrix = m4Multiply(matrix, [
                    1,0,0,0,
                    0,c,s,0,
                    0,-s,c,0,
                    0,0,0,1
                ]);
            }

            // Y Rotation
            if(m.rotY){
                c = Math.cos(m.rotY*Math.PI/180);
                s = Math.sin(m.rotY*Math.PI/180);
                matrix = m4Multiply(matrix, [
                    c,0,-s,0,
                    0,1,0,0,
                    s,0,c,0,
                    0,0,0,1
                ]);
            }
            
            // Z Rotation
            if(m.rotZ){
                c = Math.cos(m.rotZ*Math.PI/180);
                s = Math.sin(m.rotZ*Math.PI/180);
                matrix = m4Multiply(matrix, [
                    c,s,0,0,
                    -s,c,0,0,
                    0,0,1,0,
                    0,0,0,1
                ]);
            }

            // Scale
            if(m.scaleX != 1 || m.scaleY != 1 || m.scaleZ != 1){
                matrix = m4Multiply(matrix,[
                    m.scaleX, 0,  0,  0,
                    0, m.scaleY,  0,  0,
                    0,  0, m.scaleZ,  0,
                    0,  0,  0,  1,
                ])
            }

            // Perpective

            // Set matrix
            gl.uniformMatrix4fv(this.u_pos, false, matrix);
            gl.uniform2fv(this.u_tex, [m.uOffset,m.vOffset]);
            
            // Set texture
            gl.bindTexture(gl.TEXTURE_2D,this.textures[m.texture]);

            // Draw
            gl.drawArrays(gl.TRIANGLES,this.buffStart[m.model]/5,this.buffLength[m.model]/5);
        }

        
    }
}

export default MeshRenderer;