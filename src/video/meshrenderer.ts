import Mesh from '../common/mesh';
import TextureCache from './texturecache';
import VertexCache from './vertexcache';
import { m3Multiply, m4Multiply } from '../common/matrix';

class MeshRenderer {
    width: number;
    height: number;
    depth: number;
    focalLength: number;

    prog: WebGLProgram;

    a_pos: number;
    a_tex: number;
    u_pos: WebGLUniformLocation;
    u_tex: WebGLUniformLocation;

    constructor(width: number, height: number, gl: WebGLRenderingContext) {
        // Set renderer resolution
        this.width = width;
        this.height = height;
        this.depth = height;
        this.focalLength = .001;

        // Load vertex shader
        let vShader = <WebGLShader>gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vShader, '' +
            'uniform mat4 u_pos;' +
            'uniform mat3 u_tex;' +
            'attribute vec4 a_pos;' +
            'attribute vec2 a_tex;' +
            'varying vec2 v_tex;' +
            'void main(){' +
            'gl_Position = u_pos * a_pos;' +
            'v_tex = (u_tex * vec3(a_tex,1.0)).xy;' +
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
            'if(color.w == 0.0) discard;'+
            'gl_FragColor = color;' +
            '}');
        gl.compileShader(fShader);

        // Load program
        this.prog = <WebGLProgram>gl.createProgram();
        gl.attachShader(this.prog, vShader);
        gl.attachShader(this.prog, fShader);
        gl.linkProgram(this.prog);

        // Set attributes
        this.a_pos = gl.getAttribLocation(this.prog, 'a_pos');
        this.a_tex = gl.getAttribLocation(this.prog, 'a_tex');
        gl.enableVertexAttribArray(this.a_pos);
        gl.enableVertexAttribArray(this.a_tex);
        this.u_pos = <WebGLUniformLocation>gl.getUniformLocation(this.prog, 'u_pos');
        this.u_tex = <WebGLUniformLocation>gl.getUniformLocation(this.prog, 'u_tex');
    }

    setProg(gl: WebGLRenderingContext) {
        gl.useProgram(this.prog);
    }

    setAttr(gl: WebGLRenderingContext) {
        gl.vertexAttribPointer(this.a_pos, 3, gl.FLOAT, false, 20, 0);
        gl.vertexAttribPointer(this.a_tex, 2, gl.FLOAT, false, 20, 12);
    }

    render(gl: WebGLRenderingContext, meshes: Array<Array<Mesh>>, tCache: TextureCache, vCache: VertexCache) {
        for (let i = 0; i < meshes.length; i++) {
            gl.bindTexture(gl.TEXTURE_2D, tCache.textures[i]);
            for (let j = 0; j < meshes[i].length; j++) {
                let m = meshes[i][j];
                if (m.visible) {
                    let s = 0;
                    let c = 0;
                    //let foc = this.focalLength;
                    let foc = this.focalLength;
                    if (m.ortho) foc = 0;

                    // Projection
                    let matrix = [
                        2 / this.width, 0, 0, 0,
                        0, 2 / this.height, 0, 0,
                        0, 0, -2 / this.depth, -foc,
                        -1, 1, 0, 1
                    ];

                    // Translation
                    if (m.x || m.y || m.z) {
                        matrix = m4Multiply(matrix, [
                            1, 0, 0, 0,
                            0, 1, 0, 0,
                            0, 0, 1, 0,
                            Math.round(m.x), Math.round(-m.y), Math.round(m.z), 1
                        ]);
                    }

                    // X Rotation
                    if (m.rotX) {
                        c = Math.cos(m.rotX * Math.PI / 180);
                        s = Math.sin(m.rotX * Math.PI / 180);
                        matrix = m4Multiply(matrix, [
                            1, 0, 0, 0,
                            0, c, s, 0,
                            0, -s, c, 0,
                            0, 0, 0, 1
                        ]);
                    }

                    // Y Rotation
                    if (m.rotY) {
                        c = Math.cos(m.rotY * Math.PI / 180);
                        s = Math.sin(m.rotY * Math.PI / 180);
                        matrix = m4Multiply(matrix, [
                            c, 0, -s, 0,
                            0, 1, 0, 0,
                            s, 0, c, 0,
                            0, 0, 0, 1
                        ]);
                    }

                    // Z Rotation
                    if (m.rotZ) {
                        c = Math.cos(m.rotZ * Math.PI / 180);
                        s = Math.sin(m.rotZ * Math.PI / 180);
                        matrix = m4Multiply(matrix, [
                            c, s, 0, 0,
                            -s, c, 0, 0,
                            0, 0, 1, 0,
                            0, 0, 0, 1
                        ]);
                    }

                    // Scale
                    if (m.scaleX != 1 || m.scaleY != 1 || m.scaleZ != 1) {
                        matrix = m4Multiply(matrix, [
                            m.scaleX, 0, 0, 0,
                            0, m.scaleY, 0, 0,
                            0, 0, m.scaleZ, 0,
                            0, 0, 0, 1,
                        ])
                    }

                    // UV
                    let uvMatrix = [
                        m.scaleU, 0, 0,
                        0, -m.scaleV, 0,
                        m.u / tCache.textureSize, m.v / tCache.textureSize, 1
                    ];

                    // Set matrix
                    gl.uniformMatrix4fv(this.u_pos, false, matrix);
                    gl.uniformMatrix3fv(this.u_tex, false, uvMatrix);

                    // Draw
                    gl.drawArrays(gl.TRIANGLES, vCache.start[m.model], vCache.count[m.model]);
                }
            }
        }
    }
}

export default MeshRenderer;