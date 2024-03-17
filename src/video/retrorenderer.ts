class RetroRenderer {
    width:number;
    height:number;

    prog:WebGLProgram;
    buffer:WebGLBuffer;
    a_pos:number;
    u_res:WebGLUniformLocation;

    constructor(width, height, gl:WebGLRenderingContext) {
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
        'uniform sampler2D u_image;' +
        'varying vec2 v_tex;' +
        'void main() {' +
            'vec3 color = texture2D(u_image, v_tex).xyz * 2.0;' +
            'float offsetY = mod(v_tex.y*'+height+'.0,2.0);' +
            'float offsetX = mod(v_tex.x*'+width+'.0,2.0);' +
            'if(offsetY >= 0.0 && offsetY < 1.0) color *= 0.5;' +
            'if(offsetX >= 0.0 && offsetX < 1.0) color *= 0.5;' +
            'gl_FragColor = vec4(color,1.0);' +
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

        this.u_res = <WebGLUniformLocation>gl.getUniformLocation(this.prog, 'u_res');

    }

    setProg(gl:WebGLRenderingContext){
        gl.useProgram(this.prog);
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.vertexAttribPointer(this.a_pos, 2, gl.FLOAT, false, 0, 0);
    }
    
    render(gl:WebGLRenderingContext){
        // Set uniforms
        gl.uniform2f(this.u_res, this.width, this.height)

        // Draw
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
}

export default RetroRenderer;