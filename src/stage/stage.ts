import Game from '../game'
import Player from './player';
import Mesh from '../video/mesh';
import Enemies from './enemies';

class Stage{
    //player:Player;
    plane:Mesh;
    game:Game;
    monkey:Mesh;

    constructor(game:Game){
        this.game = game;
        this.plane = game.video.addSprite(96,96,24,24,48,0,1);
        this.monkey = game.video.addMesh(120,160,'monkey',0);
    }

    update(){

        if(this.game.input.poll('ArrowLeft')){
            this.plane.x -= 2;
        }
        if(this.game.input.poll('ArrowRight')){
            this.plane.x += 2;
        }
        if(this.game.input.poll('ArrowUp')){
            this.plane.y -= 2;
        }
        if(this.game.input.poll('ArrowDown')){
            this.plane.y += 2;
        }
        if(this.game.input.poll('C')){
            this.plane.z -= 1;
        }
        if(this.game.input.poll('Z')){
            this.plane.z += 1;
        }
        if(this.game.input.poll('W')){
            this.monkey.rotX -= 2;
        }
        if(this.game.input.poll('S')){
            this.monkey.rotX += 2;
        }
        if(this.game.input.poll('Q')){
            this.monkey.rotZ -= 2;
        }
        if(this.game.input.poll('E')){
            this.monkey.rotZ += 2;
        }
        if(this.game.input.poll('A')){
            this.monkey.rotY -= 2;
        }
        if(this.game.input.poll('D')){
            this.monkey.rotY += 2;
        }
    }
}

export default Stage;