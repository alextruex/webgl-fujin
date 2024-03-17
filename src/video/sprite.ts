class Sprite{
    x:number;
    y:number;
    width:number;
    height:number;
    u:number;
    v:number;
    texture:number;

    constructor(x:number,y:number,width:number,height:number,u:number,v:number,texture:number){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.u = u;
        this.v = v;
        this.texture = texture;
    }
}

export default Sprite;