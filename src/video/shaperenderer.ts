import Shape from './shape';
import geometry from '../geometry/geometry';
import { m3Multiply, m4Multiply } from '../math/matrix';

class ShapeRenderer {
    width: number;
    height: number;
    textureSize: number;
    perspective: number;

    prog: WebGLProgram;
    buffer: WebGLBuffer;
    buffStart: Record<string, number>;
    buffLength: Record<string, number>;

    a_pos: number;
    a_tex: number;
    u_pos: WebGLUniformLocation;
    u_tex: WebGLUniformLocation;
    u_foc: WebGLUniformLocation;

    constructor(width: number, height: number, textureSize: number, gl: WebGLRenderingContext) {
        // Set renderer resolution
        this.width = width;
        this.height = height;
        this.textureSize = textureSize;
        this.perspective = 0.5;

        // Load vertex shader
        let vShader = <WebGLShader>gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vShader, '' +
            'uniform mat4 u_pos;' +
            'uniform mat3 u_tex;' +
            'uniform float u_foc;' +
            'attribute vec4 a_pos;' +
            'attribute vec2 a_tex;' +
            'varying vec2 v_tex;' +
            'varying vec2 v_uv;' +
            'void main(){' +
            'vec4 pos = u_pos * a_pos;' +
            'float focZ = 1.0 + pos.z * u_foc;' +
            'gl_Position = vec4(pos.xy / focZ, pos.zw);' +
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
            'vec4 color = texture2D(u_texture, vec2(v_tex.x, v_tex.y));' +
            'gl_FragColor = color;' +
            '}');
        gl.compileShader(fShader);

        // Load program
        this.prog = <WebGLProgram>gl.createProgram();
        gl.attachShader(this.prog, vShader);
        gl.attachShader(this.prog, fShader);
        gl.linkProgram(this.prog);
        this.a_pos = gl.getAttribLocation(this.prog, 'a_pos');
        this.a_tex = gl.getAttribLocation(this.prog, 'a_tex');
        gl.enableVertexAttribArray(this.a_pos);
        gl.enableVertexAttribArray(this.a_tex);
        this.u_pos = <WebGLUniformLocation>gl.getUniformLocation(this.prog, 'u_pos');
        this.u_tex = <WebGLUniformLocation>gl.getUniformLocation(this.prog, 'u_tex');
        this.u_foc = <WebGLUniformLocation>gl.getUniformLocation(this.prog, 'u_foc');

        // Load vertex buffer
        let data: Array<number> = [];
        let index = 0;
        this.buffStart = {};
        this.buffLength = {};
        for (let i in geometry) {
            data = data.concat(geometry[i]);
            this.buffStart[i] = index;
            this.buffLength[i] = geometry[i].length;
            index += geometry[i].length;
        }
        this.buffer = <WebGLBuffer>gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    }

    setProg(gl: WebGLRenderingContext) {
        // Set program
        gl.useProgram(this.prog)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(this.a_pos, 3, gl.FLOAT, false, 20, 0);
        gl.vertexAttribPointer(this.a_tex, 2, gl.FLOAT, false, 20, 12);
    }

    render(gl: WebGLRenderingContext, shapees: Array<Shape>) {
        // Render shapees
        for (let i = 0; i < shapees.length; i++) {
            let m = shapees[i];
            if (m.visible) {
                let s = 0;
                let c = 0;

                // Projection
                let matrix = [
                    2 / this.width, 0, 0, 0,
                    0, 2 / this.height, 0, 0,
                    0, 0, -2 / this.height, 0,
                    -1, 1, 0, 1
                ];

                // Translation
                if (m.x || m.y || m.z) {
                    matrix = m4Multiply(matrix, [
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        m.x, -m.y, m.z, 1
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

                // UV Matrix
                let uvMatrix = [
                    1, 0, 0,
                    0, 1, 0,
                    0, 0, 1
                ];

                // UV Offset
                uvMatrix = m3Multiply(uvMatrix, [
                    1, 0, 0,
                    0, 1, 0,
                    m.u / this.textureSize, m.v / this.textureSize, 1
                ]);

                // UV Scale
                uvMatrix = m3Multiply(uvMatrix, [
                    m.scaleU, 0, 0,
                    0, m.scaleV, 0,
                    0, 0, 1
                ]);

                // Set perspective
                if(m.ortho) gl.uniform1f(this.u_foc, this.perspective);
                else gl.uniform1f(this.u_foc, 0);

                // Set matrix
                gl.uniformMatrix4fv(this.u_pos, false, matrix);
                gl.uniformMatrix3fv(this.u_tex, false, uvMatrix);

                // Draw
                gl.drawArrays(gl.TRIANGLES, this.buffStart[m.model] / 5, this.buffLength[m.model] / 5);
            }
        }


    }
}

export default ShapeRenderer;