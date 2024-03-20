import Game from '../game'
import Player from './player';
import Shape from '../video/shape';
import Enemies from './enemies';

class Stage{
    player:Player;
    shape:Shape;
    game:Game;
    enemies:Enemies;

    constructor(game:Game){
        this.game = game;
        this.enemies = new Enemies(game);

        this.player = new Player(game);

        this.shape = game.video.addShape(120,64,'cube',0);
        this.shape.scaleX = .5;
        this.shape.scaleY = .5;
        this.shape.scaleZ = .5;
        //this.shape.scaleU = 64/256;
        //this.shape.scaleV = 64/256;

    }

    update(){
        this.player.update();
        this.enemies.update();

        this.shape.rotX += 2;
        this.shape.rotY += 2;
    }
}

export default Stage;