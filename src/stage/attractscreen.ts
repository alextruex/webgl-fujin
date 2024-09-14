import Stage from './stage';
import Game from '../game';
import Mesh from '../common/mesh';

class AttractScreen implements Stage{
    meshes:Record<string,Mesh>;

    constructor(game:Game){
        let v = game.video;
        this.meshes = {
            'ship':v.addSprite(100,220,24,24,48,0,2),
            'ship2':v.addSprite(140,240,24,24,168,0,2),
            'shipS':v.addSprite(102,222,24,24,48,24,2),
            'ship2S':v.addSprite(142,242,24,24,48,24,2),
            'carrier':v.addMesh(120,54,6,3),
            'carrier2':v.addMesh(120,54,6,0)
        };
        let m = this.meshes;
        m.carrier.z = -.001;
        m.carrier.ortho = false;
        m.carrier2.wireframe = 1;
        m.carrier2.ortho = false;
    }

    update(game:Game){
        let v = game.video;
        let i = game.input;
        let m = this.meshes;
        let load = v.getProgress()[0]*32 + v.getProgress()[1]*32;

        if(i.poll('ArrowUp')){
            this.meshes.carrier.y += 1;
            this.meshes.carrier2.y += 1;
            this.meshes.ship.y -= 1;
            this.meshes.shipS.y -= 1;
            this.meshes.ship2.y -= .5;
            this.meshes.ship2S.y -= .5;
        }
    }
}

export default AttractScreen;