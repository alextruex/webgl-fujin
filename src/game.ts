import Audio from './audio/audio';
import Input from './input/input';
import Video from './video/video';
import Stage from './stage/stage';
import LoadingScreen from './stage/loadingscreen';

class Game{
    audio:Audio;
    input:Input;
    video:Video;
    stage:Stage;
    state:Record<string,string>;
    
    constructor(){
        this.audio = new Audio();
        this.video = new Video();
        this.input = new Input(this.video.canvas);
        this.stage = new LoadingScreen(this);
        this.state = {screen:'loading'};
        requestAnimationFrame(() => this.main());
    }

    main(){
        this.stage.update(this);
        this.video.render();
        requestAnimationFrame(() => this.main());
    }
}

export default Game;