import { Models, ENTITY_EVENTS, math, Scripts, GameRunner } from "mage-engine";
import { TILES_STATES, TILES_TYPES, TILES_VARIATIONS_TYPES } from "../map/constants";
import TileMap from "../map/TileMap";
import { DEATH_REASONS } from '../constants';
import { ENERGY_UNIT_REQUIREMENTS, getEnergyRequirementForTileVariation } from "./energy";
import { UNIT_ANIMATIONS, UNIT_TYPES } from "./UnitBehaviour";
import { TARGET_DEAD_EVENT_TYPE, TARGET_HEALTH_MAP } from "./TargetBehaviour";
import { playBuildingPlacedSound, VOLUMES } from "../../../sounds";

export const BASE_TILE_ENERGY_INCREASE = .2;
const MIN_ENERGY = 0;
const MAX_ENERGY = 100;

export default class Player {

    constructor(type) {
        this.builders = {};
        this.warriors = {};

        this.buildings = {
            [TILES_VARIATIONS_TYPES.BASE]: [],
            [TILES_VARIATIONS_TYPES.TOWER]: [],
            [TILES_VARIATIONS_TYPES.BUILDERS]: [],
            [TILES_VARIATIONS_TYPES.WARRIORS]: []
        };

        this.energy = 100;
        this.underAttack = false;

        this.type = type;
    }

    isUnderAttack() {
        return this.underAttack;
    }

    setUnderAttack(flag) {
        this.underAttack = flag;
    }

    saveTile(targetTile) {
        if (this.buildings[targetTile.getVariation()]) {
            this.buildings[targetTile.getVariation()].push(targetTile);
        }
    }

    removeTile(targetTile, variation) {
        const index = (this.buildings[variation] || []).findIndex(tile => tile.getIndex() === targetTile.getIndex());

        if (index) {
            this.buildings[variation].splice(index, 1);
        }
    }

    isGameOver = () => TileMap
        .getTileAt(this.initialPosition)
        .getTile()
        .getScript('TargetBehaviour')
        .isDead();

    getUnits() {
        return [
            ...Object.values(this.builders),
            ...Object.values(this.warriors)
        ]
    }

    getEnemyPlayer() {
        return GameRunner
            .getCurrentLevel()
            .getPlayerByType(this.getEnemyType())
    }

    updateEnergy() {
        const increase =  (TileMap
            .getTilesByType(this.getBaseTileType())
            .filter(t => t.isBaseTile())
            .length || 0) * BASE_TILE_ENERGY_INCREASE;

        this.energy = math.clamp(this.energy + increase, MIN_ENERGY, MAX_ENERGY);
    }

    removeEnergyForVariationBuild(variation) {
        this.energy -= getEnergyRequirementForTileVariation(variation);
    }

    start(position) {
        this.initialPosition = position;
        this.energyUpdateTimer = setInterval(this.updateEnergy.bind(this), 2000);
    }

    handleUnitDeath = (reason) => ({ target }) => {
        if (reason === DEATH_REASONS.BUILDING) {
            delete this.builders[target.uuid()];
        }

        if (reason === DEATH_REASONS.KILLED) {
            delete this.warriors[target.uuid()]
        }
    }

    handleTileDeath = (tile) => () => {
        this.removeTile(tile, tile.getVariation());
    };

    getBaseTileType = () => TILES_TYPES.HUMAN;
    getWarriorsHutVariation = () => TILES_VARIATIONS_TYPES.WARRIORS;
    getBuildersHutVariation = () => TILES_VARIATIONS_TYPES.BUILDERS;
    getTowerVariation = () => TILES_VARIATIONS_TYPES.TOWER;

    getEnemyType = () => TILES_TYPES.FOREST;

    getUnitScriptName = () => 'UnitBehaviour';

    getTowersTiles = () => this.buildings[this.getTowerVariation()];
    getBuildersTiles = () => this.buildings[this.getBuildersHutVariation()];
    getWarriorsTiles = () => this.buildings[this.getWarriorsHutVariation()];
    getBaseTiles = () => this.buildings[this.getBaseTileType()];

    canBuildVariation(variation) {
        return this.energy >= getEnergyRequirementForTileVariation(variation);
    }

    canSendWarrior = () => (
        this.energy >= ENERGY_UNIT_REQUIREMENTS[UNIT_TYPES.WARRIOR] &&
        this.buildings[TILES_VARIATIONS_TYPES.WARRIORS].length > 0
    )

    buildBaseTile(tile, startingPosition) {
        this.updateEnergy();
        playBuildingPlacedSound(tile.getPosition());
        return this.sendBuilderToTile(tile, TILES_VARIATIONS_TYPES.BASE, startingPosition);
    };

    buildWarriorsHut = (tile, startingPosition) => {
        playBuildingPlacedSound(tile.getPosition());
        return this.canBuildVariation(TILES_VARIATIONS_TYPES.WARRIORS) ?
            this.sendBuilderToTile(tile, TILES_VARIATIONS_TYPES.WARRIORS, startingPosition) :
            Promise.resolve(false);
    }

    buildBuildersHut = (tile, startingPosition) => {
        playBuildingPlacedSound(tile.getPosition());
        return this.canBuildVariation(TILES_VARIATIONS_TYPES.BUILDERS) ?
            this.sendBuilderToTile(tile, TILES_VARIATIONS_TYPES.BUILDERS, startingPosition) :
            Promise.resolve(false);
    }

    buildTower = (tile, startingPosition) => {
        playBuildingPlacedSound(tile.getPosition());
        return this.canBuildVariation(TILES_VARIATIONS_TYPES.TOWER) ?
            this.sendBuilderToTile(tile, TILES_VARIATIONS_TYPES.TOWER, startingPosition) :
            Promise.resolve(false)
    };

    sendBuilderToTile(tile, variation, position = this.initialPosition) {
        const unit = Models.get(this.type, { name: `${this.type}_builder_${Math.random()}`});
        const behaviour = unit.addScript(this.getUnitScriptName(), { position, unitType: UNIT_TYPES.BUILDER });

        TileMap.setTileState(tile, TILES_STATES.BUILDING);
        const targetBehaviour = this.setUpUnitTargetBehaviour(unit, TARGET_HEALTH_MAP.UNITS.BUILDERS);
        unit.addEventListener(ENTITY_EVENTS.DISPOSE, this.handleUnitDeath(DEATH_REASONS.BUILDING));

        this.builders[unit.uuid()] = unit;

        this.removeEnergyForVariationBuild(variation);

        return new Promise(resolve => {
            behaviour
                .goTo(position, tile)
                .then(() => !targetBehaviour.isDead() && behaviour.buildAtPosition(tile, variation))
                .then(tile => {
                    if (tile) {
                        this.saveTile(tile);
                        tile
                            .getTile()
                            .addEventListener(TARGET_DEAD_EVENT_TYPE, this.handleTileDeath);
                    }
                })
                .then(resolve);
        });
    }

    setUpUnitTargetBehaviour(unit, health) {
        const targetBehaviour = unit.addScript('TargetBehaviour', { health });
        unit.addEventListener(TARGET_DEAD_EVENT_TYPE, () => {
            unit.playAnimation(UNIT_ANIMATIONS.DEATH);
            setTimeout(() => unit.dispose(), 250);
        });

        return targetBehaviour;
    }

    sendWarriorToTile = (destination, position = this.initialPosition) => {
        const script = this.getUnitScriptName();
        const unit = Models.get(this.type, { name: `${this.type}_warrior_${Math.random()}`});
        const behaviour = unit.addScript(script, { position, unitType: UNIT_TYPES.WARRIOR, script });
        const tile = TileMap.getTileAt(destination);
        const targetBehaviour = this.setUpUnitTargetBehaviour(unit, TARGET_HEALTH_MAP.UNITS.WARRIORS);

        // window.unit = unit;
        // window.label = warriorLabel;
        
        unit.addEventListener(ENTITY_EVENTS.DISPOSE, this.handleUnitDeath(DEATH_REASONS.KILLED));
        
        this.warriors[unit.uuid()] = unit;
        
        return new Promise(resolve => {
            behaviour
                .goTo(position, tile)
                .then(() => !targetBehaviour.isDead() && behaviour.scanForTargets(tile))
                .then(resolve);
        });
    }
}