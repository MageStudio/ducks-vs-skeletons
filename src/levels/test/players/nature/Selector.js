import { BaseScript, constants, PALETTES } from 'mage-engine';

const CURSOR_HEIGHT = .25;
const CURSOR_SCALE = {
    x: .5,
    y: .3,
    z: .62
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

    appearAt({ x, z }, destination) {
        this.destination = destination;
        this.selector.goTo({ x, y: CURSOR_HEIGHT, z }, 150);
        this.selector.setVisible(true);
        this.selector.fadeTo(1, 250);
        this.visible = true;
    }

    markEnabled = flag => {
        const color = flag ? this.initialColor : PALETTES.FRENCH_PALETTE.MANDARIN_RED;

        this.selector.setColor(color);
    }

    disappear() {
        this.selector.fadeTo(0, 250)
            .then(() => this.selector.setVisible(false));
        this.visible = false;
        this.destination = CURSOR_DEFAULT_DESTINATION;
    }
}