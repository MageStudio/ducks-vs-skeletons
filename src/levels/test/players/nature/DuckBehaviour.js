import { TILES_TYPES } from "../../map/constants";
import UnitBehaviour from "../UnitBehaviour";

const DUCK_SCALE = {
    x: 0.2,
    y: 0.2,
    z: 0.2
};

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

    getUnitScale() {
        return DUCK_SCALE;
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

    update(dt) {
        super.update(dt);

        this.angle += this.angleIncrement * dt;
        this.unit.setPosition({ y: Math.sin(this.angle * 2) / this.angleDampening + this.getUnitMinimumHeight() });
    }
}