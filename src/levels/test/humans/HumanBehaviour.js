import { BaseScript, constants, THREE } from "mage-engine";

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
};

const MINIMUM_HEIGHT = .5;

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

        this.speed = 0.5;
        this.maximumShootingDistance = 4;

        this.human.setMaterialFromName(MATERIALS.STANDARD, HUMAN_MATERIAL_PROPERTIES);
        this.human.setScale(HUMAN_SCALE);
        this.human.playAnimation(HUMAN_ANIMATIONS.IDLE);
        this.human.setPosition(this.position);
    }

    // 5375 9000 4799 6431  10/24 067

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
        
        if (this.human.getPosition().distanceTo(position) <= this.maximumShootingDistance) {
            this.human.playAnimation(HUMAN_ANIMATIONS.SHOOT);
            // shoot bullet
        }
    }

    goTo({ x, y = MINIMUM_HEIGHT, z }) {
        const targetPosition = new Vector3({ x, y, z });
        const time = this.human.getPosition().distanceTo(targetPosition) / this.speed * 1000;

        this.human.lookAt(targetPosition);
        this.human.playAnimation(HUMAN_ANIMATIONS.RUN);
        this.human.goTo(targetPosition, time).then(() => {
            this.human.playAnimation(HUMAN_ANIMATIONS.IDLE);
        });
    }

    update() {
        if (this.target) {
            this.lookAtTarget();
        }
    }
}