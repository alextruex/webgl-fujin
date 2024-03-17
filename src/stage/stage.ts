import Game from '../game'
import Player from './player';
import Mesh from '../video/mesh';

class Stage{
    player:Player;
    mesh:Mesh;
    game:Game;

    constructor(game:Game){
        this.game = game;

        this.player = new Player(game);

        this.mesh = game.video.addMesh(120,64,'cube',0);
        this.mesh.scaleX = .5;
        this.mesh.scaleY = .5;
        this.mesh.scaleZ = .5;
        this.mesh.scaleU = 64/256;
        this.mesh.scaleV = 64/256;

    }

    update(){
        this.player.update();

        this.mesh.rotX += 2;
        this.mesh.rotY += 2;
    }
}

export default Stage;