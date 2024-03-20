import Game from '../game';
import Shape from '../video/shape';

class enemies{
    //enemy1:Shape;
    game:Game;
    constructor(game:Game){
        //this.enemy1 = game.video.addShape(64,64,'arch',0);
        this.game = game;
    }

    update(){
        /*
        this.enemy1.ortho = false;

        if(this.game.input.poll('ArrowLeft')){
            this.enemy1.x -= 1;
        }
        if(this.game.input.poll('ArrowRight')){
            this.enemy1.x += 1;
        }
        if(this.game.input.poll('ArrowUp')){
            this.enemy1.y -= 1;
        }
        if(this.game.input.poll('ArrowDown')){
            this.enemy1.y += 1;
        }
        if(this.game.input.poll('C')){
            this.enemy1.z -= 1;
        }
        if(this.game.input.poll('Z')){
            this.enemy1.z += 1;
        }
        if(this.game.input.poll('W')){
            this.enemy1.rotX -= 1;
        }
        if(this.game.input.poll('S')){
            this.enemy1.rotX += 1;
        }
        if(this.game.input.poll('Q')){
            this.enemy1.rotZ -= 1;
        }
        if(this.game.input.poll('E')){
            this.enemy1.rotZ += 1;
        }
        if(this.game.input.poll('A')){
            this.enemy1.rotY -= 1;
        }
        if(this.game.input.poll('D')){
            this.enemy1.rotY += 1;
        }
        */
    }
}

export default enemies;