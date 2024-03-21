import Game from '../game'
import Player from './player';
import Mesh from '../video/mesh';
import Enemies from './enemies';

class Stage{
    game:Game;
    player:Player;

    constructor(game:Game){
        this.game = game;
        this.player = new Player(game);

    }

    update(){
        this.player.update();
    }
}

export default Stage;