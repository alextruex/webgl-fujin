class FrameRenderer {
    prog:WebGLProgram;
    buffer:WebGLBuffer;

    constructor(width, height, gl:WebGLRenderingContext) {
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
        gl.useProgram(this.prog);
        
        // Set vertex buffer
        this.buffer = <WebGLBuffer>gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0]), gl.STATIC_DRAW);
        let a_pos = gl.getAttribLocation(this.prog,'a_pos');
        gl.enableVertexAttribArray(a_pos);
        gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);

        // Set texture
        let tex = <WebGLTexture>gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,tex);
    }

    setRenderer(width:number, height:number, gl:WebGLRenderingContext){
        gl.useProgram(this.prog);
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        let a_pos = gl.getAttribLocation(this.prog,'a_pos');
        gl.enableVertexAttribArray(a_pos);
        gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);
    }

    setTexture(gl:WebGLRenderingContext, tex:WebGLTexture){
        gl.bindTexture(gl.TEXTURE_2D,tex);
    }

    render(gl:WebGLRenderingContext){
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

export default FrameRenderer;