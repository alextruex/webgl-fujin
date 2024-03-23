import Game from '../game'
import Mesh from '../common/mesh';
import Enemies from './enemies';

class Stage{
    game:Game;

    meshes:Array<Mesh>;

    constructor(game:Game){
        this.game = game;

        this.meshes = [];
        for(let i = 0; i < 256; i++){
            this.meshes.push(game.video.addMesh(Math.random()*240,Math.random()*320,2,0));
            this.meshes[i].rotY = Math.random()*360;
            this.meshes[i].scaleX = .3;
            this.meshes[i].scaleY = .3;
            this.meshes[i].scaleZ = .3;
            this.meshes[i].ortho = false;
        }
    }

    update(){
        for(let i = 0; i < 256; i++){
            this.meshes[i].rotZ += 1;
            this.meshes[i].rotY += 1;
        }
    }
}

export default Stage;