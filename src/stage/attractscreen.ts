import Stage from './stage';
import Game from '../game';
import Mesh from '../common/mesh';

class AttractScreen implements Stage{
    meshes:Record<string,Mesh>;

    constructor(game:Game){
        let v = game.video;
        this.meshes = {
            'ship':v.addSprite(100,380,24,24,0,0,2),
            'ship2':v.addSprite(140,380,24,24,168,0,2),
            'testmesh':v.addMesh(64,64,5,1),
            'carrier':v.addMesh(120,180,6,3)
        };
        let m = this.meshes;
        m.ship.z = 50;
        m.ship.v = 0;
        m.ship.u += 48;
        m.testmesh.rotX += 8;
        m.carrier.z = -2;
    }

    update(game:Game){
        let v = game.video;
        let i = game.input;
        let m = this.meshes;
        let load = v.getProgress()[0]*32 + v.getProgress()[1]*32;
        this.meshes.testmesh.rotY += 1;

        if(i.poll('ArrowDown')){
            this.meshes.testmesh.v += 1;
            this.meshes.ship.y += 1;
        }

        if(i.poll('ArrowRight')){

            this.meshes.ship.x += 1;
        }
    }
}

export default AttractScreen;