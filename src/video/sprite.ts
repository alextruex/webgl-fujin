class Sprite{
    x:number;
    y:number;
    width:number;
    height:number;
    clipX:number;
    clipY:number;
    clipW:number;
    clipH:number;
    img:string;
    constructor(x:number,y:number,width:number,height:number,clipX:number,clipY:number,clipW:number,clipH:number,img:string){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.clipX = clipX;
        this.clipY = clipY;
        this.clipW = clipW;
        this.clipH = clipH;
        this.img = img;
    }
}

export default Sprite;