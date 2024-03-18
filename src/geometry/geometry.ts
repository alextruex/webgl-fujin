import cube from './cube';
import plane from './plane';
import sprite from './sprite';
import enemy1 from './enemy1';

let geometry:Record<string,Array<number>> = {
    'plane':plane,
    'cube':cube,
    'sprite':sprite,
    'enemy1':enemy1,
}

export default geometry;