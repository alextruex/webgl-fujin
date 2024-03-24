import Video from '../video/video';
import Input from '../input/input';
import Mesh from '../common/mesh';
import Enemies from './enemies';

interface Stage{
    
}

class Stage{
    meshes:Record<string,Mesh>;

    constructor(video:Video,input:Input){
        this.meshes = {
            'frametop':video.addSprite(120,200,1,1,0,0,0),
            'framebottom':video.addSprite(120,220,1,1,0,0,0),
            'framebar':video.addSprite(120,210,1,1,0,0,0),
            'ship':video.addSprite(12,12,24,24,0,0,2),
            'testmesh':video.addMesh(64,64,5,1)
        };
        let m = this.meshes;

        m.frametop.scaleX = 64;
        m.frametop.scaleY = 1;
        m.framebottom.scaleX = 64;
        m.framebottom.scaleY = 1;
        m.framebar.scaleY = 8;
        m.ship.v = 0;
        m.ship.u += 48;
        m.testmesh.rotX += 8;

        
    }

    update(video:Video,input:Input){
        let load = video.getProgress()[0]*32 + video.getProgress()[1]*32;
        this.meshes.framebar.x = 56 + load;
        this.meshes.framebar.scaleX = load;
        this.meshes.testmesh.rotY += 1;

        if(input.poll('ArrowDown')){
            this.meshes.testmesh.v += 1;
            this.meshes.ship.v += 1;
        }

        if(input.poll('ArrowRight')){
            this.meshes.testmesh.u += 1;
            this.meshes.ship.u += 1;
        }
    }
}

export default Stage;