import { Input, Models, INPUT_EVENTS, store } from "mage-engine";
import { FOREST_TILES, TILES_TYPES } from "../../map/constants";
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

    getUnitScriptName = () => 'DuckBehaviour';
    getBaseTileType = () => TILES_TYPES.FOREST;
    getWarriorsHutVariation = () => FOREST_TILES.FOREST_WARRIORS_HUT;
    getBuildersHutVariation = () => FOREST_TILES.FOREST_BUILDERS_HUT;
    getTowerVariation = () => FOREST_TILES.FOREST_TOWER;
    
    buildBaseTile(destination) {
        super.buildBaseTile(destination);
        console.log('energy', this.energy);
        store.dispatch(updateEnergyLevel(this.energy));
    }

    handleMouseClick = () => {
        const { visible, destination } = this.selector.getScript('Selector');

        if (visible && this.canMouseInteract(destination)) {
            this.buildBaseTile(destination);
        }
    }

    getSelectionType() {
        const { player: { selection, option } } = store.getState();
        return { selection, option };
    }

    canBuildOnTile(tile) {
        return TileMap.isTileAdjacentToType(tile.getIndex(), TILES_TYPES.FOREST) &&
            !tile.isForest() &&
            !tile.isObstacle();
    }

    canMouseInteract(destination) {
        const destinationTile = TileMap.getTileAt(destination);
        const { selection, option } = this.getSelectionType();

        if (selection === TILES_TYPES.FOREST) {
            return this.canBuildOnTile(destinationTile);
        }
    }

    handleMouseIntersection = () => {
        const intersections = Input.mouse.getIntersections(true, 'tile');
        const selectorScript = this.selector.getScript('Selector');

        if (intersections.length) {
            const { element } = intersections[0];
            const destinationIndex = element.getData('index');
            const position = element.getPosition();

            selectorScript.appearAt(position, destinationIndex);
            selectorScript.markEnabled(this.canMouseInteract(destinationIndex))
        } else {
            selectorScript.disappear();
        }
    }
}

export default new Nature();