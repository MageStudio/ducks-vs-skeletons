import { BaseScript } from "mage-engine";

export default class SlowRotation extends BaseScript {

    constructor() {
        super('SlowRotation');
    }

    start(element, { position, offset }) {
        this.element = element;
        this.element.setPosition(position);

        this.offset = offset;
        this.angle = 0;
    }

    update(dt) {
        this.angle += 1 * dt;

        this.element.setRotation({ y: this.angle });
        this.element.setPosition({ y: Math.sin(this.angle * 2) / 10 + this.offset });
    }
}