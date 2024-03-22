import mdl from "../assets/mdl";

class VertexCache{
    buffer:WebGLBuffer;
    buffData:Array<Array<number>>;
    buffIndex:Array<number>;
    modelsIn:number;
    modelsOut:number;
    ready:boolean;

    constructor(gl:WebGLRenderingContext){
        this.buffer = <WebGLBuffer>gl.createBuffer();
        this.buffData = [[]];
        this.buffIndex = [];
        this.modelsIn = mdl.length;
        this.modelsOut = 0;
        this.ready = false;

        // Fallback
        for(let i = 0; i < mdl.length; i++){
            this.buffData[i] = [
                1.0,-1.0,0.0,1.0,0.0,
                -1.0,1.0,0.0,0.0,1.0,
                -1.0,-1.0,0.0,0.0,0.0,
                1.0,-1.0,0.0,1.0,0.0,
                1.0,1.0,0.0,1.0,1.0,
                -1.0,1.0,0.0,0.0,1.0,
                ];;
            this.buffIndex[i] = 0;
        }
        this.loadBuffer(gl);
        

        // Load Textures
        for(let i = 0; i < mdl.length; i++){
            let req = new XMLHttpRequest();
            req.open('GET','mdl/' + mdl[i]);
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
                    
                    this.buffData[i] = data;
                    this.modelsOut++;

                    if(this.modelsIn == this.modelsOut){
                        this.loadBuffer(gl);
                    }
                }
            }
        }
    }

    loadBuffer(gl:WebGLRenderingContext){
        let data:Array<number> = [];
        for(let i = 0; i < this.buffData.length; i++){
            data = data.concat(this.buffData[i]);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    }
}

export default VertexCache;