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
        };
        let m = this.meshes;

        m.frametop.scaleX = 64;
        m.frametop.scaleY = 1;
        m.framebottom.scaleX = 64;
        m.framebottom.scaleY = 1;
        m.framebar.scaleY = 8;
    }

    update(video:Video,input:Input){
        let load = video.getProgress()[0]*32 + video.getProgress()[1]*32;
        this.meshes.framebar.x = 56 + load;
        this.meshes.framebar.scaleX = load;
    }
}

export default Stage;