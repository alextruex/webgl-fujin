import Stage from '../stage/stage';
import Game from '../game';
import Mesh from '../common/mesh';
import AttractScreen from './attractscreen';

class LoadingScreen implements Stage{
    meshes:Record<string,Mesh>;

    constructor(game:Game){
        let v = game.video;
        this.meshes = {
            'frametop':v.addSprite(120,200,1,1,0,0,0),
            'framebottom':v.addSprite(120,220,1,1,0,0,0),
            'framebar':v.addSprite(120,210,1,1,0,0,0),
        };
        let m = this.meshes;

        m.frametop.scaleX = 64;
        m.frametop.scaleY = 1;
        m.framebottom.scaleX = 64;
        m.framebottom.scaleY = 1;
        m.framebar.scaleY = 8;
    }

    update(game:Game){
        let v = game.video;
        let m = this.meshes;
        let load = v.getProgress()[0]*32 + v.getProgress()[1]*32;
        m.framebar.x = 56 + load;
        m.framebar.scaleX = load;

        if(v.getProgress()[0] == 1 && v.getProgress()[1] == 1){
            v.clear();
            game.stage == new AttractScreen(game);
        }
    }
}

export default LoadingScreen;