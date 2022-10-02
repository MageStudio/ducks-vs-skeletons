import { SELECTABLE_TAG } from "../../constants";
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

        if (this.isWarrior()) {
            this.unit.addTag(SELECTABLE_TAG);
            this.unit.setData('index', this.unit.uuid());
            this.unit.setData('target', 'unit');
        }
    }

    isFriendly() {
        return true;
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