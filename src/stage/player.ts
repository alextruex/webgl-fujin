import Game from '../game';
import Shape from '../video/shape';

class Player{
    game:Game;
    shape:Shape;
    exhaust:Shape;
    exhaust2:Shape;
    v:number = 0;
    h:number = 0;
    x:number = 0;
    y:number = 0;
    frame = 0;
    bullets:Array<Shape>;
    bullet = 0;
    cooldown = 0;
    cooldownShape:Shape;

    constructor(game:Game){
        this.game = game;
        this.x = 120;
        this.y = 240;
        this.bullets = [];
        this.shape = game.video.addShape(this.x,this.y,'sprite',1);
        this.exhaust = game.video.addShape(this.x-16,this.y+24,'sprite',1);
        this.exhaust2 = game.video.addShape(this.x+16,this.y+24,'sprite',1);
        this.cooldownShape = game.video.addShape(this.x,this.y-8,'sprite',1);
        game.video.sprite(this.shape,48,0,24,24);
        game.video.sprite(this.exhaust,48,24,24,24);
        game.video.sprite(this.cooldownShape,0,48,24,8);
        for(let i = 0; i < 8; i++){
            this.bullets.push(game.video.addShape(this.x,this.y,'sprite',1));
            game.video.sprite(this.bullets[i],0,24,24,8);
            //this.bullets[i].visible = false;
        }
    }

    update(){
        let m = this.shape;
        let t = this;
        let e = this.exhaust;
        let e2 = this.exhaust2;
        this.frame += .5;
        if (this.frame > 7) this.frame = 0;

        if(t.h > 0) t.h -= .25;
        if(t.h < 0) t.h += .25;
        if(t.v > 0) t.v -= .25;
        if(t.v < 0) t.v += .25;


        if(this.game.input.poll('ArrowLeft')){
            if(t.h > -2) t.h -= .5;
        }
        if(this.game.input.poll('ArrowRight')){
            if(t.h < 2) t.h += .5;
        }
        if(this.game.input.poll('ArrowUp')){
            if(t.v > -2) t.v -= .5;
        }
        if(this.game.input.poll('ArrowDown')){
            if(t.v < 2) t.v += .5;
        }
        if(this.game.input.poll('X')){
            if(this.cooldown == 0){
                this.bullets[this.bullet].y = m.y-4;
                this.bullets[this.bullet].x = m.x;
                this.bullet += 1;
                if(this.bullet > 7) this.bullet = 0;
                this.cooldown = 6;
            }
        }
        if(this.cooldown > 0)this.cooldown -=1;

        for(let i = 0; i < this.bullets.length; i++){
            this.bullets[i].y -= 6;
        }

        this.game.video.sprite(m,Math.round(this.h)*24+48,0,24,24);
        this.game.video.sprite(this.exhaust,Math.round(this.frame)*8+48,24,8,24);
        this.game.video.sprite(this.exhaust2,Math.round(7 - this.frame)*8+48,24,8,24);

        this.game.video.sprite(this.cooldownShape,0,24+(6-this.cooldown)*8,24,8);

        t.x += t.h;
        t.y += t.v;

        m.x = Math.round(t.x);
        m.y = Math.round(t.y);
        e.x = Math.round(t.x-4 + Math.abs(t.h));
        e.y = Math.round(t.y+24);
        e2.x = Math.round(t.x+4 - Math.abs(t.h));
        e2.y = Math.round(t.y+24);
        this.cooldownShape.x = t.x;
        this.cooldownShape.y = t.y-10;
    }
}

export default Player;