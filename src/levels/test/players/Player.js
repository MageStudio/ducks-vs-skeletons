import { Models, ENTITY_EVENTS, math } from "mage-engine";
import { HUMAN_TILES, TILES_STATES, TILES_TYPES, TILES_VARIATIONS_TYPES } from "../map/constants";
import TileMap from "../map/TileMap";
import { DEATH_REASONS } from '../constants';

export const BASE_TILE_ENERGY_INCREASE = 5;
const MIN_ENERGY = 0;
const MAX_ENERGY = 100;

export default class Player {

    constructor(type) {
        this.builders = [];
        this.warriors = [];

        this.energy = 0;

        this.type = type;
    }

    updateEnergy() {
        const energy = (TileMap
            .getTilesByType(this.getBaseTileType())
            .filter(t => t.isBaseTile())
            .length || 0) * BASE_TILE_ENERGY_INCREASE;

        this.energy = math.clamp(energy, MIN_ENERGY, MAX_ENERGY);

        return this.energy;
    }

    start(position) {
        this.initialPosition = position;
    }

    handleUnitDeath = (reason) => ({ target }) => {
        if (reason === DEATH_REASONS.BUILDING) {
            delete this.builders[target.uuid()];
        }

        if (reason === DEATH_REASONS.KILLED) {
            delete this.warriors[target.uuid()]
        }
    }

    getBaseTileType = () => TILES_TYPES.HUMAN;
    getWarriorsHutVariation = () => HUMAN_TILES.HUMAN_WARRIORS_HUT;
    getBuildersHutVariation = () => HUMAN_TILES.HUMAN_BUILDERS_HUT;
    getTowerVariation = () => HUMAN_TILES.HUMAN_TOWER;
    
    getUnitScriptName = () =>'UnitBehaviour';

    buildBaseTile(destination, startingPosition) {
        this.updateEnergy();
        return this.sendBuilderToTile(TileMap.getTileAt(destination), TILES_VARIATIONS_TYPES.BASE, startingPosition);
    }
    buildWarriorsHut = (destination, startingPosition) => this.sendBuilderToTile(TileMap.getTileAt(destination), TILES_VARIATIONS_TYPES.WARRIORS, startingPosition);
    buildBuildersHut = (destination, startingPosition) => this.sendBuilderToTile(TileMap.getTileAt(destination), TILES_VARIATIONS_TYPES.BUILDERS, startingPosition);
    buildTower = (destination, startingPosition) => this.sendBuilderToTile(TileMap.getTileAt(destination), TILES_VARIATIONS_TYPES.TOWER, startingPosition);

    sendBuilderToTile(tile, variation, position = this.initialPosition) {
        const unit = Models.getModel(this.type, { name: `${this.type}_builder_${Math.random()}`});
        const behaviour = unit.addScript(this.getUnitScriptName(), { position, builder: true });

        TileMap.setTileState(tile, TILES_STATES.BUILDING);
        unit.addEventListener(ENTITY_EVENTS.DISPOSE, this.handleUnitDeath(DEATH_REASONS.BUILDING));

        this.builders[unit.uuid()] = unit;

        return new Promise(resolve => {
            behaviour
                .goTo(position, tile)
                .then(() => behaviour.buildAtPosition(tile, variation))
                .then(resolve);
        });
    }

    sendWarriorToTile = tile => {
        const unit = Models.getModel(this.type, { name: `${this.type}_warrior_${Math.random()}`});
        const behaviour = unit.addScript(this.getUnitScriptName(), { position: this.initialPosition, warrior: true });

        behaviour
            .goTo(start, tile)
            .then(() => behaviour.scanForTargets(tile));

        // TileMap.setTileState(tile, TILES_STATES.FIGHTING);
        unit.addEventListener(ENTITY_EVENTS.DISPOSE, this.handleUnitDeath(DEATH_REASONS.KILLED));

        this.warriors[unit.uuid()] = unit;

        return unit;
    }
}