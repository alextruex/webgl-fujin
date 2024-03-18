import Game from '../game';
import Shape from '../video/shape';

class enemies{
    enemy1:Shape;
    game:Game;
    constructor(game:Game){
        this.enemy1 = game.video.addShape(64,64,'enemy1',2);
        this.game = game;
    }

    update(){
        //this.enemy1.rotX += 2;
        //this.enemy1.rotY += 8;
        this.enemy1.y += 1;
        this.enemy1.ortho = true;

        if(this.game.input.poll('ArrowLeft')){
           this.enemy1.x += 1;
        }
        if(this.game.input.poll('ArrowRight')){
           this.enemy1.x -= 1;
        }
    }
}

export default enemies;