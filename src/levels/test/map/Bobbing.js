import { BaseScript } from "mage-engine";

export default class Bobbing extends BaseScript {
    constructor() {
        super('Bobbing');
    }

    start(element, { angleOffset = 0, offset = 0 }) {
        this.angleOffset = angleOffset;
        this.element = element;

        this.offset = offset;
        this.angle = 0 + this.angleOffset;
    }

    update(dt) {
        this.angle += 1 * dt;
        this.element.setPosition({ y: Math.sin(this.angle * 2) / 30 + this.offset });
    }
}