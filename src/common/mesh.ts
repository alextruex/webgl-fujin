class Mesh{
    model:number;
    texture:number;
    x:number;
    y:number;
    z:number;
    scaleX:number;
    scaleY:number;
    scaleZ:number;
    rotX:number;
    rotY:number;
    rotZ:number;
    u:number;
    v:number;
    scaleU:number;
    scaleV:number;
    visible:boolean;
    wireframe:number;
    colorR:number;
    colorG:number;
    colorB:number;
    ortho:boolean;

    constructor(x:number,y:number,model:number,texture:number){
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
        this.u = 0;
        this.v = 0;
        this.scaleU = 1;
        this.scaleV = 1;
        this.visible = true;
        this.wireframe = 0;
        this.colorR = 1;
        this.colorG = 0;
        this.colorB = 0;
        this.ortho = true;
    }
}

export default Mesh;