import { Models, ENTITY_EVENTS } from "mage-engine";
import { TILES_STATES } from "../map/constants";
import TileMap from "../map/TileMap";
import { DEATH_REASONS } from '../constants';

export default class Player {

    constructor(type) {
        this.builders = [];
        this.warriors = [];

        this.energy = 0;

        this.type = type;
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

    getUnitScriptName() {
        return 'UnitBehaviour';
    }

    sendBuilderToTile(tile, variation) {
        const unit = Models.getModel(this.type, { name: `${this.type}_builder_${Math.random()}`});
        const start = this.initialPosition;
        const behaviour = unit.addScript(this.getUnitScriptName(), { position: start, builder: true });

        behaviour
            .goTo(start, tile)
            .then(() => behaviour.buildAtPosition(tile, variation));

        TileMap.setTileState(tile, TILES_STATES.BUILDING);
        unit.addEventListener(ENTITY_EVENTS.DISPOSE, this.handleUnitDeath(DEATH_REASONS.BUILDING));

        this.builders[unit.uuid()] = unit;

        return unit;
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