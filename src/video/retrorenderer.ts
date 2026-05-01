import VertexCache from "./vertexcache";

class RetroRenderer {
    width:number;
    height:number;

    prog:WebGLProgram;
    a_pos:number;
    u_res:WebGLUniformLocation;

    constructor(width, height, gl:WebGLRenderingContext) {
        // Set renderer resolution
        this.width = width;
        this.height = height;
        console.log('height: 0.0015625' + this.height);

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
            'vec3 color = vec3(0.0,0.0,0.0);'+
            //'float col = floor(mod(gl_FragCoord.x,6.0));' +
            //'float row = floor(mod(gl_FragCoord.y,6.0));' +


            // y shift
            'float yOffset = floor(floor(mod(gl_FragCoord.x,6.0))/3.0);' +
            'float yShift = yOffset*' + 1/width + ';' +

            // color shift
            'float colorShift = (mod(gl_FragCoord.x,3.0))*(mod(gl_FragCoord.y + yOffset,3.0))*0.2+0.3;'+

            'color += texture2D(u_image,vec2(v_tex.x,v_tex.y+yShift)).xyz * colorShift;' +

            // color bleed
            'color += texture2D(u_image,vec2(v_tex.x+0.003,v_tex.y)).xyz*0.2;' +
            'color += texture2D(u_image,vec2(v_tex.x-0.003,v_tex.y)).xyz*0.2;' +


            

             //'color += texture2D(u_image, v_tex).xyz;'+

            //y offset by two for rows 5 6 7 8
            //r color only for rows 1
            // g for row 2
            // b for row 3
            // black for row 4, and 

            //'if(rowShift <= 2.0){' +
            //'if(col == 0.0) color += texture2D(u_image, v_tex).xyz*1.25;' +
            //'if(col == 1.0) color += texture2D(u_image, v_tex).xyz*1.0;' +
            //'if(col == 2.0) color += texture2D(u_image, v_tex).xyz*0.55;' +
            //'if(col == 3.0) color += texture2D(u_image,vec2(v_tex.x,v_tex.y+0.0015625)).xyz*1.0;' +
            //'if(col == 4.0) color += texture2D(u_image,vec2(v_tex.x,v_tex.y+0.0015625)).xyz*1.25;' +
            //'if(col == 5.0) color += texture2D(u_image,vec2(v_tex.x,v_tex.y+0.0015625)).xyz*0.55;' +
            //'if(col == 3.0) color += texture2D(u_image,vec2(v_tex.x,v_tex.y+0.0015625)).xyz*0.55;' +
            //'if(col == 3.0) color.z += texture2D(u_image, v_tex).z;' +
            //'color += texture2D(u_image,vec2(v_tex.x,v_tex.y)).xyz;' +

            //'}else{' +
            //'if(col == 0.0) color += texture2D(u_image,vec2(v_tex.x,v_tex.y+0.02)).xyz' +
            
            //'color += texture2D(u_image,vec2(v_tex.x,v_tex.y)).xyz;' +
            //'}'+


            //'color += texture2D(u_image, v_tex).xyz * 0.1;' +
            //'if(row == 0.0) color += texture2D(u_image, v_tex).xyz * 1.0;' +
            //'if(col == 0.0) color += texture2D(u_image, v_tex).xyz * 1.0;' +

            // position offset

            // color offset
            

            //'color += texture2D(u_image, vec2(v_tex.x + 0.005,v_tex.y)).xyz * 0.25;' +
            //'color += texture2D(u_image, vec2(v_tex.x + 0.005,v_tex.y)).xyz * 0.15;' +
            /*
            'if(row == 0.0 && col == 0.0) color *= 0.5;' +
            'if(row == 0.0 && col == 1.0) color *= 0.5;' +
            'if(row == 0.0 && col == 2.0) color *= 0.5;' +
            'if(row == 0.0 && col == 3.0) color *= 0.5;' +
            'if(row == 1.0 && col == 0.0) color *= 0.5;' +
            'if(row == 1.0 && col == 1.0) color *= 1.0;' +
            'if(row == 1.0 && col == 2.0) color *= 1.0;' +
            'if(row == 1.0 && col == 3.0) color *= 1.0;' +
            'if(row == 2.0 && col == 0.0) color *= 0.5;' +
            'if(row == 2.0 && col == 1.0) color *= 1.0;' +
            'if(row == 2.0 && col == 2.0) color *= 1.0;' +
            'if(row == 2.0 && col == 3.0) color *= 1.0;' +
            'if(row == 3.0 && col == 0.0) color *= 0.5;' +
            'if(row == 3.0 && col == 1.0) color *= 1.0;' +
            'if(row == 3.0 && col == 2.0) color *= 1.0;' +
            'if(row == 3.0 && col == 3.0) color *= 1.0;' +
            */


            

            'gl_FragColor = vec4(color,1.0);' +
            '}');
        gl.compileShader(fShader);
        
        // Load program
        this.prog = <WebGLProgram>gl.createProgram();
        gl.attachShader(this.prog, vShader);
        gl.attachShader(this.prog, fShader);
        gl.linkProgram(this.prog);
        
        // Load vertex buffer
        this.a_pos = gl.getAttribLocation(this.prog,'a_pos');
        gl.enableVertexAttribArray(this.a_pos);
        gl.vertexAttribPointer(this.a_pos, 2, gl.FLOAT, false, 20, 0);

        this.u_res = <WebGLUniformLocation>gl.getUniformLocation(this.prog, 'u_res');
    }

    setProg(gl:WebGLRenderingContext){
        gl.useProgram(this.prog);
    }

    setAttr(gl:WebGLRenderingContext){
        gl.vertexAttribPointer(this.a_pos, 2, gl.FLOAT, false, 0, 0);
    }
    
    render(gl:WebGLRenderingContext,vertexCache:VertexCache){
        // Set uniforms
        gl.uniform2f(this.u_res, this.width, this.height)

        // Draw
        gl.drawArrays(gl.TRIANGLES, vertexCache.start[0], vertexCache.count[0]);
    }
}

export default RetroRenderer;