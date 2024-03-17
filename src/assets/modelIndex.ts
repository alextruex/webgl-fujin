import cube from './models/cube';
import plane from './models/plane';
import sprite from './models/sprite';

let modelIndex:Record<string,Array<number>> = {
    'plane':plane,
    'cube':cube,
    'sprite':sprite
}

export default modelIndex;