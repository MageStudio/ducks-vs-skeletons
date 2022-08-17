import { TILES_TYPES } from "../../map/constants";
import UnitBehaviour from "../UnitBehaviour";


export default class DuckBehaviour extends UnitBehaviour {

    constructor() {
        super('DuckBehaviour');
    }

    start(unit, options) {
        super.start(unit, options);

        this.angle = 0;
        this.angleIncrement = 7;
        this.angleDampening = 150;
    }

    getEnemyTileType() {
        return TILES_TYPES.HUMAN;
    }

    isFriendlyTile(tile) {
        return tile.isForest();
    }

    getFriendlyTileType() {
        return TILES_TYPES.FOREST;
    }
}