
import { math } from 'mage-engine';
import TileMap from '../../map/TileMap';
import { HUMAN_TILES, TILES_TYPES } from '../../map/constants';
import Player from '../Player';

const MAX_BUILDERS = 2;

class Humans extends Player {

    constructor() {
        super("human");
    }

    start(initialPosition) {
        super.start(initialPosition);

        TileMap.changeTile(initialPosition, TILES_TYPES.HUMAN, { startingTile: true });
        this.initialPosition = initialPosition;

        setInterval(this.expand, 1000);
        // this.sendWarriorToTile(TileMap.getTileAt({ x: 7, z: 7 }));
    }

    getUnitScriptName = () => 'HumanBehaviour';

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

        //  TODO: needs to decide which tile to build based on algo?
        // this.sendBuilderToTile(nextTile, HUMAN_TILES.HUMAN_BUILDERS_HUT);
        this.buildBaseTile(nextTile.getIndex());
    }

}

export default new Humans();