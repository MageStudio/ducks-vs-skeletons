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
        TileMap.changeTile(NATURE_STARTING_POSITION, TILES_TYPES.FOREST, true);
        setInterval(this.handleMouseIntersection, 250)

        this.selector = Models.getModel('selector');
        this.selector.addScript('Selector', { position: NATURE_STARTING_POSITION });
    }

    handleMouseClick = () => {
        const { visible, destination } = this.selector.getScript('Selector').script;
        console.log(visible, destination);

        if (visible && this.canMouseInteract(destination)) {
            TileMap.changeTile(destination, TILES_TYPES.FOREST);
        }
    }

    canMouseInteract(destination) {
        return TileMap.isTileAdjacentToType(destination, TILES_TYPES.FOREST) && !TileMap.isTileType(destination, TILES_TYPES.FOREST)
    }

    handleMouseIntersection = () => {
        const intersections = Input.mouse.getIntersections(true, 'tile');

        if (intersections.length) {
            const destination = intersections[0].element.getPosition();

            this.selector.getScript('Selector').script.appearAt(destination);
            this.selector.getScript('Selector').script.markEnabled(this.canMouseInteract(destination))
        } else {
            this.selector.getScript('Selector').script.disappear();
        }
    }
}

export default new Nature();