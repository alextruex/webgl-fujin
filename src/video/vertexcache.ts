const MODEL_COUNT = 4;

class VertexCache{
    buffer:WebGLBuffer;
    verts:Array<Array<number>>;
    start:Array<number>;
    count:Array<number>;
    in:number;
    out:number;

    constructor(gl:WebGLRenderingContext){
        this.buffer = <WebGLBuffer>gl.createBuffer();
        this.verts = [];
        this.start = [];
        this.count = [];
        this.in = MODEL_COUNT;
        this.out = 0;

        // Fallback
        this.verts[0] = [
            32.0,-32.0,0.0,1.0,0.0,
            -32.0,32.0,0.0,0.0,1.0,
            -32.0,-32.0,0.0,0.0,0.0,
            32.0,-32.0,0.0,1.0,0.0,
            32.0,32.0,0.0,1.0,1.0,
            -32.0,32.0,0.0,0.0,1.0
        ]
        for(let i = 0; i < MODEL_COUNT+1; i++){
            this.start[i] = 0;
            this.count[i] = 6;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.verts[0]), gl.STATIC_DRAW);
    
        // Load Textures
        for(let i = 1; i < MODEL_COUNT+1; i++){
            let req = new XMLHttpRequest();
            req.open('GET','mdl/mdl_' + i + '.obj');
            req.send();
            req.onreadystatechange = (e) => {
                if(req.readyState == 4){
                    let data = [0];
                    try{
                        data = this.parseObj(req.responseText);
                    }
                    catch{
                        data = this.verts[0];
                        console.log('Error parsing model');
                    }
                    this.verts[i] = data;
                    this.out++;
                    if(this.in == this.out){
                        this.compileBuffer(gl);
                    }
                }
            }
        }
    }

    parseObj(text:string){
        let data:Array<number> = [];
        let verts:Array<Array<number>> = [];
        let uv:Array<Array<number>> = [];
        let faces:Array<Array<string>> = [];

        let rows = text.split('\n');
        for(let r in rows){
            let row = rows[r].split(' ');
            if (row[0] == 'v') verts.push([+row[1],+row[2],+row[3]]);
            if (row[0] == 'vt') uv.push([+row[1],+row[2]]);
            if (row[0] == 'f') faces.push([row[1],row[2],row[3]]);
        }

        for(let f in faces){ 
            let face = faces[f]; // Each face
            for(let vrt in face){
                let vertex = face[vrt].split('/'); // Each vertex
                let pos = +vertex[0]-1;
                let tex = +vertex[1]-1;
                data.push(verts[pos][0]);
                data.push(verts[pos][1]);
                data.push(verts[pos][2]);
                data.push(uv[tex][0]);
                data.push(uv[tex][1]);
            }
        }

        return data;
    }
    
    compileBuffer(gl:WebGLRenderingContext){
        let data:Array<number> = [];
        for(let i = 0; i < MODEL_COUNT+1; i++){
            this.start[i] = data.length / 5;
            data = data.concat(this.verts[i]);
            this.count[i] = this.verts[i].length / 5;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    }
}

export default VertexCache;