import Game from '../game'
import Mesh from '../video/mesh';

class Stage{
    mesh:Mesh;

    game:Game;

    constructor(game:Game){
        this.game = game;

        this.mesh = game.video.addMesh(64,64,'cube',0);
        this.mesh.scaleU = 128/256;
        this.mesh.scaleV = 128/256;

        let plane = game.video.addMesh(144,144,'sprite',1);

        plane.scaleX = 24;
        plane.scaleY = 24;
        plane.scaleU = 24/256;
        plane.scaleV = 24/256;
        plane.v = 256 - 24;
    }

    update(){
        if(this.game.input.poll('ArrowLeft'))this.mesh.x -= 4;
        if(this.game.input.poll('ArrowRight'))this.mesh.x += 4;
        if(this.game.input.poll('ArrowUp'))this.mesh.y -= 4;
        if(this.game.input.poll('ArrowDown'))this.mesh.y += 4;
        if(this.game.input.poll('S'))this.mesh.z -= 2;
        if(this.game.input.poll('W'))this.mesh.z += 2;
        if(this.game.input.poll('A'))this.mesh.rotX -= 2;
        if(this.game.input.poll('D'))this.mesh.rotX += 2;
        if(this.game.input.poll('Q'))this.mesh.rotY -= 2;
        if(this.game.input.poll('E'))this.mesh.rotY += 2;
        if(this.game.input.poll('Z'))this.mesh.rotZ -= 2;
        if(this.game.input.poll('X'))this.mesh.u += .01;
        if(this.game.input.poll('C'))this.mesh.v += .01;
    }
}

export default Stage;