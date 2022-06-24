import { Input, functions, INPUT_EVENTS, store, Models, Scripts, PostProcessing, constants, Element, THREE } from "mage-engine";
import { FOREST_OPTIONS, TILES_TYPES, TILES_VARIATIONS_TYPES, TILE_SCALE } from "../../map/constants";
import TileMap from "../../map/TileMap";
import Player from "../Player";
import {
    updateEnergyLevel,
    changeSelection,
    changeSelectionOption
} from '../../../../ui/actions/player';

const MAX_ATTACK_TARGET_DISTANCE = 20;

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
        const initialTile = TileMap.changeTile(this.initialPosition, TILES_TYPES.FOREST, { startingTile: true });

        this.saveTile(initialTile);

        this.outline = PostProcessing.add(constants.EFFECTS.SELECTIVE_OUTLINE);
        this.outline.setSelectedObjects([TileMap.getTileAt(position).getTile()]);

        this.selector = new Element({ body: new THREE.Object3D() });
        this.selector.addScript('Selector', { position });
        this.selector.getScript('Selector').disappear();
    }

    getUnitScriptName = () => 'DuckBehaviour';
    getBaseTileType = () => TILES_TYPES.FOREST;
    getEnemyType = () => TILES_TYPES.HUMAN;
    
    buildBaseTile(destination, startingPosition) {
        super.buildBaseTile(destination, startingPosition)
            .then(this.dispatchCurrentEnergyLevel)
            .then(() => TileMap.addEnergyParticlesToTile(destination))
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
                selectorScript.markEnabled(this.canMouseInteract(destination));
            } else {
                selectorScript.removePreview();
            }
        }
    }

    handleMouseClick = () => {
        const { index: destination } = this.getInterectingTileData();
        const { selection: { type, index }, option } = this.getSelectionType();
        const selectorScript = this.selector.getScript('Selector');

        if (this.canMouseInteract(destination)) {
            if (!option) {
                this.selectTile(TileMap.getTileAt(destination));
            } else if (option) {
                switch(type) {
                    case TILES_VARIATIONS_TYPES.BASE:
                    case TILES_VARIATIONS_TYPES.BUILDERS:
                        this.build(option, index, destination);
                        break;
                    case TILES_VARIATIONS_TYPES.TOWER:
                        // select target? 
                        break;
                    case TILES_VARIATIONS_TYPES.WARRIORS:
                        this.sendWarriorToTile(destination, index);
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
        this.outline.setSelectedObjects([tile.getTile()]);
        store.dispatch(changeSelection({
            type: tile.getVariation(),//tile.isStartingTile() ? tile.getType() : tile.getVariation(),
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
        tile.isForest() &&
        !tile.isObstacle()
    ) ;

    canAttackTile = tile => {
        const { selection: { index } } = this.getSelectionType();
        const currentTile = TileMap.getTileAt(index);

        return (
            !tile.isForest() &&
            !tile.isObstacle() &&
            !(currentTile.distanceToTile(tile) > MAX_ATTACK_TARGET_DISTANCE)
        )
    }

    canMouseInteract(destination) {
        if (!TileMap.isValidTile(destination)) return false;

        const destinationTile = TileMap.getTileAt(destination);
        const { selection, option } = this.getSelectionType();
        const { type } = selection;

        if (!option) {
            return this.canSelectTile(destinationTile);
        }

        switch(type) {
            case TILES_VARIATIONS_TYPES.BASE:
            case TILES_VARIATIONS_TYPES.BUILDERS:
                return this.canBuildOnTile(destinationTile);
            case TILES_VARIATIONS_TYPES.TOWER:
                // select target? 
                break;
            case TILES_VARIATIONS_TYPES.WARRIORS:
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
}

export default new Nature();