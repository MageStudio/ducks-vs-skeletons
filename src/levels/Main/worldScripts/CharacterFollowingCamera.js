// TODO: this is for the character in the dialogue following the camera position

import { BaseScript, Config, THREE } from "mage-engine";
import { UNIT_ANIMATIONS } from "../players/UnitBehaviour";

export default class CharacterFollowingCamera extends BaseScript {

    start(element, { initialAnimation = UNIT_ANIMATIONS.JUMP } = {}) {
        this.element = element;
        const offset = this.calculateOffset();
        this.element.setRotation({ y: 3 + offset, x: -.1 });
        this.element.playAnimation(initialAnimation);

        this.positionVector = new THREE.Vector3();
        this.rotationVector = new THREE.Vector3();
    }

    calculateOffset() {
        const { w } = Config.screen();
        const offset = w * 0.0006;

        return offset;
    }

    update(dt) {
        const offset = this.calculateOffset();
        this.positionVector.set(offset, -.8, 1.2);
        this.rotationVector.set(-.1, 3 + offset, 0);

        this.element.setPosition(this.positionVector);
        this.element.setRotation(this.rotationVector);
    }
}