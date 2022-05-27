import { BaseScript, math } from "mage-engine";
import { TILES_VARIATIONS_TYPES } from "./map/constants";

export const TARGET_DEAD_EVENT_TYPE = 'TARGET.DEAD';
export const TARGET_HIT_EVENT_TYPE = 'TARGET.HIT';
export const TARGET_HEALTH_MAP = {
    TILES: {
        [TILES_VARIATIONS_TYPES.BASE]: 30,
        [TILES_VARIATIONS_TYPES.BUILDERS]: 50,
        [TILES_VARIATIONS_TYPES.WARRIORS]: 70,
        [TILES_VARIATIONS_TYPES.TOWER]: 40
    },
    UNITS: {
        WARRIORS: 20,
        BUILDERS: 10
    }
};

const TARGET_DEAD_EVENT = { type: TARGET_DEAD_EVENT_TYPE };
const TARGET_HIT_EVENT = { type: TARGET_HIT_EVENT_TYPE };

export default class TargetBehaviour extends BaseScript {
    constructor() {
        super('TargetBehaviour');
    }

    start(target, { health }) {
        this.target = target;
        this.health = health;
        this.maxHealth = health;
    }

    processHit(damage) {
        this.health = math.clamp(this.health - damage, 0, this.maxHealth);
        this.target.dispatchEvent(TARGET_HIT_EVENT);

        if (this.isDead()) {
            this.target.dispatchEvent(TARGET_DEAD_EVENT);
        }
    }

    repair() {

    }

    isDead() {
        return this.health === 0;
    }
}