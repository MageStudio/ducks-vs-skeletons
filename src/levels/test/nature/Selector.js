import { BaseScript } from 'mage-engine';

const CURSOR_HEIGHT = .5;
const CURSOR_SCALE = {
    x: .5,
    y: .5,
    z: .5
};

export default class Selector extends BaseScript {

    constructor() {
        super('Selector');
    }

    start(selector, { position }) {
        this.selector = selector;

        this.selector.setPosition({
            ...position,
            y: CURSOR_HEIGHT
        });
        this.selector.setScale(CURSOR_SCALE);
        this.selector.setOpacity(0);
    }

    appearAt({ x, z }) {
        this.selector.goTo({ x, y: CURSOR_HEIGHT, z }, 250);
        this.selector.fadeTo(1, 250);
    }

    disappear() {
        this.selector.fadeTo(0, 250);
    }
}