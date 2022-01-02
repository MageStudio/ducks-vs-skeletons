import { INPUT_EVENTS } from "mage-engine";
import { Input, Models } from "mage-engine";
import { NATURE_STARTING_POSITION, TILES_TYPES } from "../map/constants";
import TileMap from "../map/TileMap";
class Nature {

    constructor() {
        this.builders = [];
        this.currentTile = null;
        this.selector = null;
    }

    start() {
        Input.enable();
        Input.addEventListener(INPUT_EVENTS.MOUSE_DOWN, this.handleMouseClick);
        TileMap.changeTile(NATURE_STARTING_POSITION.x, NATURE_STARTING_POSITION.z, TILES_TYPES.FOREST, true);
        setInterval(this.handleMouseIntersection, 250)

        this.selector = Models.getModel('selector');
        this.selector.addScript('Selector', { position: NATURE_STARTING_POSITION });
    }

    handleMouseClick = () => {
        const isIntersecting = this.selector.getScript('Selector').script.visible;

        if (isIntersecting) {
            const { x, z } = this.selector.getScript('Selector').script.destination;
            TileMap.changeTile(x, z, TILES_TYPES.FOREST);
        }
    }

    handleMouseIntersection = () => {
        const intersections = Input.mouse.getIntersections(true, 'tile');

        if (intersections.length) {
            this.selector.getScript('Selector').script.appearAt(intersections[0].element.getPosition());
        } else {
            this.selector.getScript('Selector').script.disappear();
        }
    }
}

export default new Nature();