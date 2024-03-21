import Game from '../game';
import Shape from '../video/mesh';

class Player{
    game:Game;
    shape:Shape;

    v:number = 0;
    h:number = 0;
    x:number = 0;
    y:number = 0;
    frame = 0;
    bullets:Array<Shape>;
    bullet = 0;
    cooldown = 0;

    constructor(game:Game){
        this.game = game;
        this.x = 120;
        this.y = 240;
        this.bullets = [];
        this.shape = game.video.addMesh(this.x,this.y,'plane',1);
    }

    update(){
        let m = this.shape;
        let t = this;

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


    }
}

export default Player;