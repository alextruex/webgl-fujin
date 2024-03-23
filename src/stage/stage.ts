import Game from '../game'
import Mesh from '../video/mesh';
import Enemies from './enemies';

class Stage{
    game:Game;

    mesh1:Mesh;

    constructor(game:Game){
        this.game = game;

        this.mesh1 = this.game.video.addMesh(120,120,4,0);
        this.mesh1.ortho = false;

    }

    update(){
        this.mesh1.rotX += 1;
        this.mesh1.rotY += 1;
        //this.mesh1.rotX += 1;
    }
}

export default Stage;