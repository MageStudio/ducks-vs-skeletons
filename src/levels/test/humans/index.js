
import { Models, math, ENTITY_EVENTS } from 'mage-engine';
import TileMap from '../map/TileMap';
import { TILES_STATES, TILES_TYPES } from '../map/constants';

const DEATH_REASONS = {
    KILLED: 'KILLED',
    BUILDING: 'BUILDING'
};

const MAX_BUILDERS = 3;

class Humans {

    constructor() {
        this.builders = {};
    }

    startExpanding() {
        TileMap.changeTile(9, 9, TILES_TYPES.HUMAN);

        setInterval(this.expand, 1000);
    }

    hasTooManyBuildersOnMap = () => Object.keys(this.builders).length > MAX_BUILDERS;

    expand = () => {
        if (this.hasTooManyBuildersOnMap()) return;

        const nextTile = math.pickRandom(
            TileMap
                .getTilesByType(TILES_TYPES.HUMAN)
                .map(tile => (
                    TileMap
                        .getAdjacentTiles(tile.getPosition(), TILES_TYPES.HUMAN)
                        .filter(tile => !tile.isBuilding())
                ))
                .filter(adjacents => adjacents.length)
                .sort()
                .pop()
        );

        this.sendBuilderToTile(nextTile);
    }

    handleHumanDeath = (reason) => ({ target }) => {
        if (reason === DEATH_REASONS.BUILDING) {
            delete this.builders[target.uuid()];
        }
    }

    sendBuilderToTile = (tile) => {
        const human = Models.getModel('human');
        human.addScript('HumanBehaviour', { position: { x: 9, z: 9 }});
        human.getScript('HumanBehaviour').script.goTo(tile);

        TileMap.setTileState(tile, TILES_STATES.BUILDING);
        human.addEventListener(ENTITY_EVENTS.DISPOSE, this.handleHumanDeath(DEATH_REASONS.BUILDING));

        this.builders[human.uuid()] = human;

        return human;
    }
}

export default new Humans();