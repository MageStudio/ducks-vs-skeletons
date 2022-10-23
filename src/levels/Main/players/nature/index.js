import { Input, INPUT_EVENTS, store, PostProcessing, constants, Element, THREE } from "mage-engine";
import { FOREST_OPTIONS, TILES_TYPES, TILES_VARIATIONS_TYPES, TILE_MATERIAL_PROPERTIES } from "../../map/constants";
import TileMap from "../../map/TileMap";
import Player from "../Player";
import {
    updateEnergyLevel,
    changeSelection,
    changeSelectionOption
} from '../../../../ui/actions/player';
import { SELECTABLE_TAG } from "../../constants";
import { UNIT_TYPES } from "../UnitBehaviour";
import { distance } from "../../utils";

const MAX_ATTACK_TARGET_DISTANCE = 3;
const MAX_UNIT_MOVEMENT_DISTANCE = MAX_ATTACK_TARGET_DISTANCE / 2;

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

        this.initialTilePosition = initialTile.getPosition();

        this.outline = PostProcessing.add(constants.EFFECTS.SELECTIVE_OUTLINE);
        this.outline.setSelectedObjects([TileMap.getTileAt(position).getTile()]);

        this.selector = new Element({ body: new THREE.Object3D() });
        this.selector.addScript('Selector', { position });
        this.selector.getScript('Selector').disappear();
    }

    getBuildableTiles() {
        return TileMap
            .getTilesByType(TILES_TYPES.DESERT)
            .filter(this.canBuildOnTile)
    }

    showAllowedTilesForOption(option) {
        const { selection: { type, index, uuid } } = this.getSelectionType();
        let tile;
        if (type !== UNIT_TYPES.WARRIOR) {
            tile = TileMap.getTileAt(index)
        }

        switch(type) {
            case TILES_VARIATIONS_TYPES.BASE:
            case TILES_VARIATIONS_TYPES.BUILDERS:
                this.getBuildableTiles()
                    .forEach(t => t.showOverlay());
                break;
            case TILES_VARIATIONS_TYPES.TOWER:
                break;
            case TILES_VARIATIONS_TYPES.WARRIORS:
                TileMap
                    .getTilesWithinRadius(tile, MAX_ATTACK_TARGET_DISTANCE)
                    .filter(t => !t.isForest())
                    .forEach(t => t.showOverlay());
                break;
            case UNIT_TYPES.WARRIOR:
                TileMap
                    .getTilesWithinRadiusFromPosition(this.getUnit(uuid).getPosition(), MAX_UNIT_MOVEMENT_DISTANCE)
                    .filter(t => !t.isForest())
                    .forEach(t => t.showOverlay());
                break;
        }
    }

    isFriendly() { return true; } // we are friendly

    getUnitScriptName = () => 'DuckBehaviour';
    getBaseTileType = () => TILES_TYPES.FOREST;
    getEnemyType = () => TILES_TYPES.HUMAN;
    
    buildBaseTile(tile, startingPosition) {
        super.buildBaseTile(tile, startingPosition)
            .then(this.dispatchCurrentEnergyLevel)
            .then(() => TileMap.addEnergyParticlesToTile(tile))
    }

    updateEnergy() {
        super.updateEnergy();
        this.dispatchCurrentEnergyLevel();
    }

    dispatchCurrentEnergyLevel = () => {
        store.dispatch(updateEnergyLevel(this.energy));
    }

    build(option, startingPosition, destination) {
        const tile = TileMap.getTileAt(destination);
        switch(option) {
            case FOREST_OPTIONS.BASE_TILE:
                this.buildBaseTile(tile, startingPosition);
                break;
            case FOREST_OPTIONS.BUILDERS_HUT_TILE:
                this.buildBuildersHut(tile, startingPosition)
                    .then(this.dispatchCurrentEnergyLevel)
                break;
            case FOREST_OPTIONS.WARRIORS_HUT_TILE:
                this.buildWarriorsHut(tile, startingPosition)
                    .then(this.dispatchCurrentEnergyLevel)
                break;
            case FOREST_OPTIONS.TOWER_TILE:
                this.buildTower(tile, startingPosition)
                    .then(this.dispatchCurrentEnergyLevel)
                break;
        }
    }

    handleMouseMove = () => {
        const intersection = this.getIntersectingData();
        const { option } = this.getSelectionType();
        const selectorScript = this.selector.getScript('Selector');
        const {
            index: destination,
            position
        } = intersection;

        if (destination && position) {
            selectorScript.appearAt(position, destination);
            if (option) {
                selectorScript.showPreview(option);
                selectorScript.markEnabled(this.canMouseInteract(intersection));
            } else {
                selectorScript.removePreview();
            }
        }
    }

    handleMouseClick = () => {
        const intersection = this.getIntersectingData();
        const { selection: { type, index, uuid: selectionUuid }, option } = this.getSelectionType();
        const selectorScript = this.selector.getScript('Selector');
        const { index: destination, target, uuid } = intersection;

        if (this.canMouseInteract(intersection)) {
            if (!option) {
                const selection = target === 'unit' ?
                    this.getUnit(uuid) :
                    TileMap.getTileAt(destination);

                this.select(selection, target);
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
                    case UNIT_TYPES.WARRIOR:
                        const unit = this.getUnit(selectionUuid);
                        this.sendUnitToTile(destination, unit);
                        break;
                }
            }
        }

        selectorScript.removePreview();
        selectorScript.disappear();
        this.clearSelection();
    }

    clearSelection = () => {
        TileMap.removeOverlays();
        store.dispatch(changeSelectionOption(false));
    }

    select(selection, target) {
        const isTile = target === 'tile';
        this.outline.setSelectedObjects([isTile ? selection.getTile() : selection]);

        store.dispatch(changeSelection({
            type: isTile ? selection.getVariation() : UNIT_TYPES.WARRIOR,
            index: isTile && selection.getIndex(),
            uuid: selection.uuid()
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

    canMoveUnitToTile(tile, unit) {
        return distance(tile.getIndex(), unit.getPosition()) < MAX_UNIT_MOVEMENT_DISTANCE;
    }

    checkTileInteraction({ index: destination }) {
        if (!TileMap.isValidTile(destination)) return false;

        const destinationTile = TileMap.getTileAt(destination);
        const { selection, option } = this.getSelectionType();
        const { type, uuid } = selection;

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
            case UNIT_TYPES.WARRIOR:
                return this.canMoveUnitToTile(destinationTile, this.getUnit(uuid));
        }
    }

    checkUnitInteraction() {
        // we can always select a unit
        return true;
    }

    canMouseInteract = (intersection) => intersection.target === 'unit' ? 
        this.checkUnitInteraction() :
        this.checkTileInteraction(intersection);

    getIntersectingData() {
        const intersections = Input.mouse.getIntersections(true, SELECTABLE_TAG);

        if (intersections.length) {
            const { element } = intersections[0];
            const index = element.getData('index');
            const target = element.getData('target');
            const position = element.getPosition();
            const uuid = element.uuid();

            return { index, position, target, uuid };
        }

        return { };
    }
}

export default new Nature();