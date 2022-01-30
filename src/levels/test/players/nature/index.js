import { Input, Models, INPUT_EVENTS, store } from "mage-engine";
import { TILES_TYPES } from "../../map/constants";
import TileMap from "../../map/TileMap";
import Player from "../Player";
import { updateEnergyLevel } from '../../../../ui/actions/player';

class Nature extends Player {

    constructor() {
        super('nature');
        this.selector = null;
    }

    start(position) {
        super.start(position);

        Input.enable();
        Input.addEventListener(INPUT_EVENTS.MOUSE_DOWN, this.handleMouseClick);
        TileMap.changeTile(this.initialPosition, TILES_TYPES.FOREST, { startingTile: true });
        setInterval(this.handleMouseIntersection, 250)

        this.selector = Models.getModel('selector');
        this.selector.addScript('Selector', { position });

        // this.sendBuilderToTile(TileMap.getTileAt({ x: 8, z: 8 }));
    }

    getUnitScriptName() { return 'DuckBehaviour'; }

    getBaseTiles() {
        return TileMap
            .getTilesByType(TILES_TYPES.FOREST)
            .filter(t => t.isBaseTile())
    }

    handleMouseClick = () => {
        const { visible, destination } = this.selector.getScript('Selector');

        if (visible && this.canMouseInteract(destination)) {
            this.sendBuilderToTile(TileMap.getTileAt(destination, TILES_TYPES.FOREST));
            store.dispatch(updateEnergyLevel(this.getBaseTiles().length));
        }
    }

    canMouseInteract(destination) {
        const destinationTile = TileMap.getTileAt(destination);

        return TileMap.isTileAdjacentToType(destination, TILES_TYPES.FOREST) &&
            !destinationTile.isForest() &&
            !destinationTile.isObstacle();
    }

    handleMouseIntersection = () => {
        const intersections = Input.mouse.getIntersections(true, 'tile');

        if (intersections.length) {
            const destinationIndex = intersections[0].element.getData('index');
            const position = intersections[0].element.getPosition();

            this.selector.getScript('Selector').appearAt(position, destinationIndex);
            this.selector.getScript('Selector').markEnabled(this.canMouseInteract(destinationIndex))
        } else {
            this.selector.getScript('Selector').disappear();
        }
    }
}

export default new Nature();