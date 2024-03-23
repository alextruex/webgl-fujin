const MDL = [
    '00_sprite.obj',
    '01_cube.obj',
    '02_torus.obj',
    '03_icosahedron.obj',
    '04_monkey.obj'
];

class VertexCache{
    buffer:WebGLBuffer;
    verts:Array<Array<number>>;
    start:Array<number>;
    count:Array<number>;
    mdIn:number;
    mdOut:number;

    constructor(gl:WebGLRenderingContext){
        this.buffer = <WebGLBuffer>gl.createBuffer();
        this.verts = [];
        this.start = [];
        this.count = [];
        this.mdIn = MDL.length;
        this.mdOut = 0;

        // Fallback
        for(let i = 0; i < MDL.length; i++){
            this.verts.push([
                32.0,-32.0,0.0,1.0,0.0,
                -32.0,32.0,0.0,0.0,1.0,
                -32.0,-32.0,0.0,0.0,0.0,
                32.0,-32.0,0.0,1.0,0.0,
                32.0,32.0,0.0,1.0,1.0,
                -32.0,32.0,0.0,0.0,1.0,
                ]);
            this.start.push(0);
        }
        this.compileBuffer(gl);
    
        // Load Textures
        for(let i = 0; i < MDL.length; i++){
            let req = new XMLHttpRequest();
            req.open('GET','mdl/' + MDL[i]);
            req.send();
            req.onreadystatechange = (e) => {
                if(req.readyState == 4){
                    let data:Array<number> = [];
                    let verts:Array<Array<number>> = [];
                    let uv:Array<Array<number>> = [];
                    let faces:Array<Array<string>> = [];
        
                    let rows = req.responseText.split('\n');
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
                    
                    this.verts[i] = data;
                    this.mdOut++;

                    if(this.mdIn == this.mdOut){
                        this.compileBuffer(gl);
                    }
                }
            }
        }
    }
    

    compileBuffer(gl:WebGLRenderingContext){
        let data:Array<number> = [];
        for(let i = 0; i < MDL.length; i++){
            this.start[i] = data.length / 5;
            data = data.concat(this.verts[i]);
            this.count[i] = this.verts[i].length / 5;
        }
        console.log(data.length);
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    }
}

export default VertexCache;