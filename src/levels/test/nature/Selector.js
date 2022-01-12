import { BaseScript, constants } from 'mage-engine';

const CURSOR_HEIGHT = .5;
const CURSOR_SCALE = {
    x: .5,
    y: .5,
    z: .5
};

const CURSOR_DEFAULT_DESTINATION = {
    x: Infinity,
    z: Infinity
}

const CURSOR_MATERIAL_PROPERTIES = {
    metalness: 0.2,
    roughness: 1.0
};

const { MATERIALS } = constants;
export default class Selector extends BaseScript {

    constructor() {
        super('Selector');
    }

    start(selector, { position }) {
        this.selector = selector;
        this.visible = false;
        this.destination = CURSOR_DEFAULT_DESTINATION;

        this.initialColor = this.selector.getColor();

        this.selector.setPosition({
            ...position,
            y: CURSOR_HEIGHT
        });
        this.selector.setMaterialFromName(MATERIALS.STANDARD, CURSOR_MATERIAL_PROPERTIES);
        this.selector.setScale(CURSOR_SCALE);
        this.selector.setOpacity(0);
    }

    appearAt({ x, z }) {
        this.destination = { x, z };
        this.selector.goTo({ x, y: CURSOR_HEIGHT, z }, 150);
        this.selector.fadeTo(1, 250);
        this.visible = true;
    }

    markEnabled = flag => {
        const color = flag ? this.initialColor : 0xff0000;

        this.selector.setColor(color);
    }

    disappear() {
        this.selector.fadeTo(0, 250);
        this.visible = false;
        this.destination = CURSOR_DEFAULT_DESTINATION;
    }
}