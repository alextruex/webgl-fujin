import Game from '../game'
import Mesh from '../video/mesh';

class Stage{
    mesh:Mesh;
    mesh2:Mesh;
    game:Game;

    constructor(game:Game){
        this.game = game;
        this.mesh = new Mesh(96,96,'cube','test1.png');
        this.mesh2 = new Mesh(128,128,'plane','test2.png');
        game.video.addMesh(this.mesh,'meshA');
        game.video.addMesh(this.mesh2,'meshB');
    }

    update(){
        this.mesh2.rotX += 0;
        this.mesh2.rotY += 0;
        this.mesh2.rotZ += 0;
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
        if(this.game.input.poll('C'))this.mesh.u += .1;
        if(this.game.input.poll('X'))this.mesh.v -= .1;
    }
}

export default Stage;