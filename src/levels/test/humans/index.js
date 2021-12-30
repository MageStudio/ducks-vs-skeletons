
import { Models } from 'mage-engine';
import TileMap from '../map/TileMap';
import { TILES_TYPES } from '../map/constants';
class Humans {

    constructor() {
        this.humans = [];
    }

    start() {
        TileMap.changeTile(10, 10, TILES_TYPES.HUMAN);
    }

    spawnHuman() {
        const human = Models.getModel('human');
        human.addScript('HumanBehaviour');

        this.humans.push(human);

        return human;
    }
}

export default new Humans();