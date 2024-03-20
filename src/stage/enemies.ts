import Game from '../game';
import Shape from '../video/shape';

class enemies{
    enemy1:Shape;
    game:Game;
    constructor(game:Game){
        this.enemy1 = game.video.addShape(64,64,'icosahedron',2);
        this.game = game;
    }

    update(){
        //this.enemy1.rotX += 2;
        //this.enemy1.rotY += 8;
        this.enemy1.y += 1;
        this.enemy1.ortho = false;

        if(this.game.input.poll('X')){
           
        }
        if(this.game.input.poll('ArrowRight')){
            
        }
    }
}

export default enemies;