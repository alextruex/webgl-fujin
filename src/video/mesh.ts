class Mesh{
    model:string;
    texture:string;
    x:number;
    y:number;
    z:number;
    scaleX:number;
    scaleY:number;
    scaleZ:number;
    rotX:number;
    rotY:number;
    rotZ:number;
    uOffset:number;
    vOffset:number;
    ortho:boolean;

    constructor(x:number,y:number,model:string,texture:string){
        this.model = model;
        this.texture = texture;
        this.x = x;
        this.y = y;
        this.z = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;
        this.rotX = 0;
        this.rotY = 0;
        this.rotZ = 0;

        this.uOffset = 0;
        this.vOffset = 0;
        this.ortho = true;
    }
}

export default Mesh;