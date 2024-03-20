import Game from '../game'
import Player from './player';
import Shape from '../video/shape';
import Enemies from './enemies';

class Stage{
    //player:Player;
    shape:Shape;
    game:Game;
    //enemies:Enemies;

    constructor(game:Game){
        this.game = game;
        this.shape = game.video.addShape(120,160,'monkey',0);
    }

    update(){

        this.shape.ortho = false;

        if(this.game.input.poll('ArrowLeft')){
            this.shape.x -= 1;
        }
        if(this.game.input.poll('ArrowRight')){
            this.shape.x += 1;
        }
        if(this.game.input.poll('ArrowUp')){
            this.shape.y -= 1;
        }
        if(this.game.input.poll('ArrowDown')){
            this.shape.y += 1;
        }
        if(this.game.input.poll('C')){
            this.shape.z -= 1;
        }
        if(this.game.input.poll('Z')){
            this.shape.z += 1;
        }
        if(this.game.input.poll('W')){
            this.shape.rotX -= 1;
        }
        if(this.game.input.poll('S')){
            this.shape.rotX += 1;
        }
        if(this.game.input.poll('Q')){
            this.shape.rotZ -= 1;
        }
        if(this.game.input.poll('E')){
            this.shape.rotZ += 1;
        }
        if(this.game.input.poll('A')){
            this.shape.rotY -= 1;
        }
        if(this.game.input.poll('D')){
            this.shape.rotY += 1;
        }
    }
}

export default Stage;