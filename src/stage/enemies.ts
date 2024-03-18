import Game from '../game';
import Shape from '../video/shape';

class enemies{
    enemy1:Shape;
    constructor(game:Game){
        this.enemy1 = game.video.addShape(64,64,'enemy1',2);
    }

    update(){
        this.enemy1.rotX += 2;
        this.enemy1.rotY += 8;
    }
}

export default enemies;