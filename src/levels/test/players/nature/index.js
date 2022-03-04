import { Input, functions, INPUT_EVENTS, store, Models } from "mage-engine";
import { FOREST_OPTIONS, FOREST_TILES, TILES_TYPES } from "../../map/constants";
import TileMap from "../../map/TileMap";
import Player from "../Player";
import {
    updateEnergyLevel,
    changeSelection,
    changeSelectionOption
} from '../../../../ui/actions/player';

class Nature extends Player {

    constructor() {
        super('nature');
        this.selector = null;
    }

    start(position) {
        super.start(position);

        Input.enable();
        Input.addEventListener(INPUT_EVENTS.MOUSE_DOWN, this.handleMouseClick);
        Input.addEventListener(INPUT_EVENTS.MOUSE_MOVE, this.handleMouseMove);
        TileMap.changeTile(this.initialPosition, TILES_TYPES.FOREST, { startingTile: true });

        this.selector = Models.getModel('selector');
        this.selector.addScript('Selector', { position });
        this.selector.getScript('Selector').disappear();
    }

    getUnitScriptName = () => 'DuckBehaviour';
    getBaseTileType = () => TILES_TYPES.FOREST;
    getWarriorsHutVariation = () => FOREST_TILES.FOREST_WARRIORS_HUT;
    getBuildersHutVariation = () => FOREST_TILES.FOREST_BUILDERS_HUT;
    getTowerVariation = () => FOREST_TILES.FOREST_TOWER;
    
    buildBaseTile(destination, startingPosition) {
        super.buildBaseTile(destination, startingPosition)
            .then(this.dispatchCurrentEnergyLevel);
    }

    updateEnergy() {
        super.updateEnergy();
        this.dispatchCurrentEnergyLevel();
    }

    dispatchCurrentEnergyLevel = () => {
        store.dispatch(updateEnergyLevel(this.energy));
    }

    build(option, startingPosition, destination) {
        switch(option) {
            case FOREST_OPTIONS.BASE_TILE:
                this.buildBaseTile(destination, startingPosition);
                break;
            case FOREST_OPTIONS.BUILDERS_HUT_TILE:
                this.buildBuildersHut(destination, startingPosition)
                    .then(this.dispatchCurrentEnergyLevel)
                break;
            case FOREST_OPTIONS.WARRIORS_HUT_TILE:
                this.buildWarriorsHut(destination, startingPosition)
                    .then(this.dispatchCurrentEnergyLevel)
                break;
            case FOREST_OPTIONS.TOWER_TILE:
                this.buildTower(destination, startingPosition)
                    .then(this.dispatchCurrentEnergyLevel)
                break;
        }
    }

    handleMouseMove = () => {
        const { index: destination, position } = this.getInterectingTileData();
        const { selection: { type, index }, option } = this.getSelectionType();
        const selectorScript = this.selector.getScript('Selector');

        if (destination && position) {
            selectorScript.appearAt(position, destination);
            if (option) {
                selectorScript.showPreview(option);
            } else {
                selectorScript.removePreview();
            }
            selectorScript.markEnabled(this.canMouseInteract(destination));
        }
    }

    handleMouseClick = () => {
        const { index: destination } = this.getInterectingTileData();
        const { selection: { type, index }, option } = this.getSelectionType();
        const selectorScript = this.selector.getScript('Selector');

        if (this.canMouseInteract(destination)) {
            if (selectorScript.visible && !option) {
                this.selectTile(TileMap.getTileAt(destination));
            } else if (option) {
                switch(type) {
                    case TILES_TYPES.FOREST:
                    case FOREST_TILES.FOREST_BUILDERS_HUT:
                        this.build(option, index, destination);
                        break;
                    case FOREST_TILES.FOREST_TOWER:
                        // select target? 
                        break;
                    case FOREST_TILES.FOREST_WARRIORS_HUT:
                        this.sendWarriorToTile(destination);
                        break;
                }
            }
        }

        selectorScript.removePreview();
        selectorScript.disappear();
        store.dispatch(changeSelectionOption(false));
    }

    clearSelection = () => {
        store.dispatch(changeSelectionOption(false));
    }

    selectTile(tile) {
        store.dispatch(changeSelection({
            type: tile.isStartingTile() ? tile.getType() : tile.getVariation(),
            index: tile.getIndex()
        }));
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

    canSelectTile = (tile) => (
        !tile.isObstacle() && (
            tile.isWarriorsHut() ||
            tile.isTower() ||
            tile.isBuildersHut() ||
            tile.isStartingTile()
        )
    ) 

    canAttackTile(tile) {
        return true;
    }

    canMouseInteract(destination) {
        const destinationTile = TileMap.getTileAt(destination);
        const { selection, option } = this.getSelectionType();
        const { type } = selection;

        if (!option) {
            return this.canSelectTile(destinationTile);
        }

        switch(type) {
            case TILES_TYPES.FOREST:
            case FOREST_TILES.FOREST_BUILDERS_HUT:
                return this.canBuildOnTile(destinationTile);
            case FOREST_TILES.FOREST_TOWER:
                // select target? 
                break;
            case FOREST_TILES.FOREST_WARRIORS_HUT:
                return this.canAttackTile(destinationTile);
        }
    }

    getInterectingTileData() {
        const intersections = Input.mouse.getIntersections(true, 'tile');

        if (intersections.length) {
            const { element } = intersections[0];
            const index = element.getData('index');
            const position = element.getPosition();

            return { index, position };
        }

        return { };
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