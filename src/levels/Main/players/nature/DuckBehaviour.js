import { store } from "mage-engine";
import { removeUnit } from "../../../../ui/actions/player";
import {
    NATURE_REMOVE_UNIT_BUILDERS,
    NATURE_REMOVE_UNIT_WARRIORS,
} from "../../../../ui/actions/types";
import { SELECTABLE_TAG } from "../../constants";
import { TILES_TYPES } from "../../map/constants";
import UnitBehaviour from "../UnitBehaviour";

export default class DuckBehaviour extends UnitBehaviour {
    constructor() {
        super("DuckBehaviour");
    }

    start(unit, options) {
        super.start(unit, options);

        this.angle = 0;
        this.angleIncrement = 7;
        this.angleDampening = 150;

        if (this.isWarrior()) {
            this.unit.addTag(SELECTABLE_TAG);
            this.unit.setData("index", this.unit.uuid());
            this.unit.setData("target", "unit");
        }
    }

    goBackHome() {
        super.goBackHome();
        store.dispatch(
            removeUnit(
                this.isBuilder() ? NATURE_REMOVE_UNIT_BUILDERS : NATURE_REMOVE_UNIT_WARRIORS,
            ),
        );
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
