import Audio from './audio/audio';
import Input from './input/input';
import Video from './video/video';
import Stage from './stage/stage';

class Game{
    audio:Audio;
    input:Input;
    video:Video;
    stage:Stage;
    
    constructor(){
        this.audio = new Audio();
        this.video = new Video();
        this.input = new Input(this.video.canvas);
        this.stage = new Stage(this);
        requestAnimationFrame(() => this.main());
    }

    main(){
        this.stage.update();
        this.video.render();
        requestAnimationFrame(() => this.main());
    }
}

export default Game;