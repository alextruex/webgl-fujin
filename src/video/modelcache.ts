import mdl from "../assets/mdl";

class ModelCache{
    buffers:Record<string,WebGLBuffer>;
    modelsIn:number;
    modelsOut:number;

    constructor(gl:WebGLRenderingContext){
        this.buffers = {};
        this.modelsIn = mdl.length;
        this.modelsOut = 0;

        for(let m in mdl){
            let req = new XMLHttpRequest();
            req.open('GET','mdl/' + mdl[m]);
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
                    this.buffers[mdl[m]] = <WebGLBuffer> gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER,this.buffers[mdl[m]]);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
                    this.modelsOut++;
                    console.log(mdl[m]);
                    console.log(this.modelsOut);
                }
  
            }
        }
    }
}

export default ModelCache;