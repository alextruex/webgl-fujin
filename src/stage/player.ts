import Game from '../game';
import Mesh from '../video/mesh';

class Player{
    game:Game;
    mesh:Mesh;
    v:number = 0;
    h:number = 0;
    x:number = 0;
    y:number = 0;

    constructor(game:Game){
        this.game = game;
        this.x = 120;
        this.y = 240;
        this.mesh = game.video.addMesh(this.x,this.y,'sprite',1);
        game.video.sprite(this.mesh,72,0,24,24);
    }

    update(){
        let m = this.mesh;
        let t = this;

        if(t.h > 0) t.h -= .25;
        if(t.h < 0) t.h += .25;
        if(t.v > 0) t.v -= .25;
        if(t.v < 0) t.v += .25;


        if(this.game.input.poll('ArrowLeft')){
            if(t.v > -2) t.v -= .5;
        }
        if(this.game.input.poll('ArrowRight')){
            if(t.v < 2) t.v += .5;
        }
        if(this.game.input.poll('ArrowUp')){
            if(t.h > -2) t.h -= .5;
        }
        if(this.game.input.poll('ArrowDown')){
            if(t.h < 2) t.h += .5;
        }

        this.game.video.sprite(m,Math.round(this.v)*24+72,0,24,24);

        t.x += t.v;
        t.y += t.h;

        m.x = Math.round(t.x);
        m.y = Math.round(t.y);
    }
}

export default Player;