import { BaseScript, constants, THREE } from "mage-engine";
import { TILES_TYPES } from "../map/constants";
import TileMap from "../map/TileMap";

const { MATERIALS } = constants;
const { LoopOnce, Vector3 } = THREE;

const HUMAN_MATERIAL_PROPERTIES = {
    metalness: 0.2,
    roughness: 1.0
};

const HUMAN_SCALE = {
    x: 0.001,
    y: 0.001,
    z: 0.001
};

const HUMAN_ANIMATIONS = {
    IDLE: 'Root|Idle',
    RUN: 'Root|Run',
    SHOOT: 'Root|Shoot',
    DEATH: 'Root|Death',
    BUILD: 'Root|CrouchIdle'
};

const MINIMUM_HEIGHT = .5;
const SPEED = 0.5;
const MAXIMUM_SHOOTING_DISTANCE = 4;

export default class HumanBehaviour extends BaseScript {

    constructor() {
        super('HumanBehaviour');
    }

    start(human, { position = {} }) {
        this.human = human;
        this.position = {
            ...position,
            y: MINIMUM_HEIGHT
        }

        this.human.setMaterialFromName(MATERIALS.STANDARD, HUMAN_MATERIAL_PROPERTIES);
        this.human.setScale(HUMAN_SCALE);
        this.human.playAnimation(HUMAN_ANIMATIONS.IDLE);
        this.human.setName(`human_${Math.random()}`)
        this.human.setPosition(this.position);
    }

    die() {
        this.human.playAnimation(HUMAN_ANIMATIONS.DEATH, { loop: LoopOnce });
        this.human.fadeTo(0, 1000)
            .then(() => this.human.dispose());
    }

    lookAtTarget() {
        const targetPosition = this.target.getPosition();
        this.human.lookAt({
            x: targetPosition.x,
            y: MINIMUM_HEIGHT,
            z: targetPosition.z
        });

        return targetPosition;
    }

    shootAt(target) {
        this.target = target;
        const position = this.lookAtTarget();
        
        if (this.human.getPosition().distanceTo(position) <= MAXIMUM_SHOOTING_DISTANCE) {
            this.human.playAnimation(HUMAN_ANIMATIONS.SHOOT);
            // shoot bullet
        }
    }

    buildAtPosition(tile) {
        const { x, z } = tile.getPosition();
        this.human.playAnimation(HUMAN_ANIMATIONS.BUILD);
        setTimeout(() => {
            this.human.playAnimation(HUMAN_ANIMATIONS.IDLE);
            if (!tile.isHuman()) {
                TileMap.changeTile(x, z, TILES_TYPES.HUMAN);
                this.die();
            }
        }, 3000)
    }

    goTo(tile) {
        const { x, z } = tile.getPosition();
        const targetPosition = new Vector3(x, MINIMUM_HEIGHT, z);
        const time = this.human.getPosition().distanceTo(targetPosition) / SPEED * 1000;

        this.human.lookAt(targetPosition);
        this.human.playAnimation(HUMAN_ANIMATIONS.RUN);
        this.human.goTo(targetPosition, time).then(() => {
            this.buildAtPosition(tile);
        });
    }

    update() {
        if (this.target) {
            this.lookAtTarget();
        }
    }
}