import { Input } from "mage-engine";
import { TILES_TYPES } from "../map/constants";
import TileMap from "../map/TileMap";

class Nature {

    constructor() {
        this.builders = [];
        this.currentTile = null;
    }

    start() {
        Input.enable();
        TileMap.changeTile(9, 9, TILES_TYPES.FOREST, true);
        // setInterval(this.handleMouseIntersection, 1000)
    }

    handleMouseIntersection = () => {
        const intersections = Input.mouse.getIntersections(true, 'tile');

        if (intersections.length) {
            console.log(intersections[0].element.getName());
        } else {

        }
    }
}

export default new Nature();