class Shape{
    model:string;
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
    ortho:boolean;

    constructor(x:number,y:number,model:string,texture:number){
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
        this.ortho = false;
    }
}

export default Shape;