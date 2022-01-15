
import { Models, math, ENTITY_EVENTS } from 'mage-engine';
import TileMap from '../map/TileMap';
import { HUMAN_TILES, TILES_STATES, TILES_TYPES } from '../map/constants';
import { DEATH_REASONS } from '../constants';

const MAX_BUILDERS = 2;

class Humans {

    constructor() {
        this.builders = {};
        this.warriors = {};
    }

    start(initialPosition) {
        TileMap.changeTile(initialPosition, TILES_TYPES.HUMAN, { startingTile: true });
        this.initialPosition = initialPosition;

        setInterval(this.expand, 1000);
        // this.sendWarriorToTile(TileMap.getTileAt({ x: 7, z: 7 }));
    }

    hasTooManyBuildersOnMap = () => Object.keys(this.builders).length >= MAX_BUILDERS;

    isValidTile = tile => !tile.isBuilding() && !tile.isType(TILES_TYPES.HUMAN) && !tile.isObstacle();

    expand = () => {
        if (this.hasTooManyBuildersOnMap()) return;

        const nextTile = math.pickRandom(
            TileMap
                .getTilesByType(TILES_TYPES.HUMAN)
                .map(tile => (
                    TileMap
                        .getAdjacentTiles(tile.getIndex())
                        .filter(this.isValidTile)
                ))
                .filter(adjacents => adjacents.length)
                .sort()
                .pop()
        );

        console.log('next tile,', nextTile);

        this.sendBuilderToTile(nextTile, HUMAN_TILES.HUMAN_BUILDERS_HUT);
    }

    handleHumanDeath = (reason) => ({ target }) => {
        if (reason === DEATH_REASONS.BUILDING) {
            delete this.builders[target.uuid()];
        }

        if (reason === DEATH_REASONS.KILLED) {
            delete this.warriors[target.uuid()]
        }
    }

    sendBuilderToTile = (tile, variation) => {
        const human = Models.getModel('human', { name: `human_builder_${Math.random()}`});
        const behaviour = human.addScript('HumanBehaviour', { position: this.initialPosition, builder: true });

        console.log('sending human to tile', tile);

        behaviour
            .goTo(tile)
            .then(() => behaviour.buildAtPosition(tile, variation));

        TileMap.setTileState(tile, TILES_STATES.BUILDING);
        human.addEventListener(ENTITY_EVENTS.DISPOSE, this.handleHumanDeath(DEATH_REASONS.BUILDING));

        this.builders[human.uuid()] = human;

        return human;
    }

    sendWarriorToTile = tile => {
        const human = Models.getModel('human', { name: `human_warrior_${Math.random()}`});
        const behaviour = human.addScript('HumanBehaviour', { position: this.initialPosition, warrior: true });

        behaviour
            .goTo(tile)
            .then(() => behaviour.scanForTargets(tile));

        // TileMap.setTileState(tile, TILES_STATES.FIGHTING);
        human.addEventListener(ENTITY_EVENTS.DISPOSE, this.handleHumanDeath(DEATH_REASONS.KILLED));

        this.warriors[human.uuid()] = human;

        return human;
    }
}

export default new Humans();