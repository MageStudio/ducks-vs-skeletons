import {
    BaseScript,
    constants,
    THREE,
    math,
    Sphere,
    ENTITY_EVENTS,
    PALETTES,
    Models,
    GameRunner
} from "mage-engine";
import { TILES_TYPES } from "../map/constants";
import TileMap from "../map/TileMap";
import { TARGET_DEAD_EVENT_TYPE } from "../TargetBehaviour";

const { MATERIALS } = constants;
const { LoopOnce, Vector3 } = THREE;

const UNIT_MATERIAL_PROPERTIES = {
    metalness: 0.2,
    roughness: 1.0
};

const DEFAULT_UNIT_SCALE = {
    x: 0.002,
    y: 0.002,
    z: 0.002
};

const UNIT_ANIMATIONS = {
    IDLE: 'Root|Idle',
    RUN: 'Root|Run',
    SHOOT: 'Root|Shoot',
    THROW: 'Root|Throw',
    DEATH: 'Root|Defeat',
    BUILD: 'Root|Interact'
};

export const UNIT_TYPES = {
    WARRIOR: 'WARRIOR',
    BUILDER: 'BUILDER'
};

const MINIMUM_HEIGHT = .2;
const SPEEDS = {
    BUILDER: 0.5,
    WARRIOR: 0.8
}
const MAXIMUM_SHOOTING_DISTANCE = 10;
const BULLET_INTERVAL = 100;
const BULLET_SIZE = 0.01;
const TARGETS_SCAN_INTERVAL = 3000;


export default class UnitBehaviour extends BaseScript {

    constructor(name) {
        super(name);
    }

    start(unit, { position = {}, unitType, builder = false, warrior = false }) {
        this.unit = unit;
        this.position = {
            ...position,
            y: MINIMUM_HEIGHT
        };

        this.unitType = unitType;
        this.builder = builder;
        this.warrior = warrior;

        this.targetsScanTimeoutId = null;

        this.unit.setMaterialFromName(MATERIALS.STANDARD, UNIT_MATERIAL_PROPERTIES);
        this.unit.setScale(this.getUnitScale());
        this.unit.playAnimation(UNIT_ANIMATIONS.IDLE);
        this.unit.setPosition(this.position);
    }

    getUnitScale() {
        return DEFAULT_UNIT_SCALE;
    }

    getUnitMinimumHeight() {
        return MINIMUM_HEIGHT;
    }

    getUnitWeaponRelativePosition() {
        return {
            x: -.3,
            y: .3,
            z: .3
        };
    }

    getUnitWeaponRelativeRotation() {
        return {
            y: Math.PI
        };
    }

    getUnitWeaponScale() {
        return {
            x: 15,
            y: 15,
            z: 15
        }
    }
    
    // addWeapon() {
    //     if (this.isWarrior()) {
    //         const weapon = Models.get('shotgun');
    //         weapon.setMaterialFromName(MATERIALS.STANDARD, UNIT_MATERIAL_PROPERTIES);
    //         this.unit.add(weapon);
    //         weapon.setPosition(this.getUnitWeaponRelativePosition());
    //         weapon.setScale(this.getUnitWeaponScale());
    //         weapon.setScale(this.getUnitWeaponRelativeRotation());
    //     }
    // }

    hasTarget() { return !!this.target }

    isBuilder() { return this.unitType === UNIT_TYPES.BUILDER; }
    isWarrior() { return this.unitType === UNIT_TYPES.WARRIOR; }
    getSpeed() { return this.isBuilder() ? SPEEDS.BUILDER : SPEEDS.WARRIOR; }

    disappear() {
        this.unit.fadeTo(0, 1000)
            .then(() => this.unit.dispose());
    }

    die() {
        this.unit.playAnimation(UNIT_ANIMATIONS.DEATH, { loop: LoopOnce });
        this.disappear();
    }

    lookAtTarget(target) {
        const { x, z } = target.getPosition();
        this.unit.lookAt({
            x,
            y: MINIMUM_HEIGHT,
            z
        });
    }

    getEnemyTileType() {
        return TILES_TYPES.FOREST;
    }

    isTargetWithinShootingDistance = (target) => (
        this.unit.getPosition().distanceTo(target.getPosition()) <= MAXIMUM_SHOOTING_DISTANCE
    )

    getRandomEnemyUnit = () => (
        math.pickRandom(
            GameRunner
                .getCurrentLevel()
                .getUnitsByType(this.getEnemyTileType())
                .filter(this.isTargetWithinShootingDistance) || []
        )
    )

    getRandomEnemyTile = () => {
        const tile = math.pickRandom(
            TileMap 
                .getTilesByType(this.getEnemyTileType())
                .filter(this.isTargetWithinShootingDistance) || []
        );

        if (tile) {
            return tile.getTile();
        }
    }

    scanForTargets = () => {
        if (this.hasTarget()) return;

        const target = math.pickRandom([
            this.getRandomEnemyTile(),
            this.getRandomEnemyUnit()
        ]);

        if (target) {
            this.startShootingAt(target);
        } else {
            this.targetsScanTimeoutId = setTimeout(this.scanForTargets, TARGETS_SCAN_INTERVAL);
        }
    }

    spawnBullet = () => (
        new Sphere(BULLET_SIZE, PALETTES.BASE.BLACK)
            .addScript('BulletBehaviour', { position: this.unit.getPosition(), target: this.target })
            .shoot()
    )

    startShootingAt(target) {
        if (!this.isWarrior()) return;

        this.target = target;
        this.lookAtTarget(target);

        this.target.addEventListener(TARGET_DEAD_EVENT_TYPE, () => this.stopShooting());
        
        if (this.unit.getPosition().distanceTo(target.getPosition()) <= MAXIMUM_SHOOTING_DISTANCE) {
            this.unit.playAnimation(UNIT_ANIMATIONS.THROW);
            this.unit.addEventListener(ENTITY_EVENTS.ANIMATION.LOOP, this.spawnBullet)
            this.spawnBullet();
        }
    }

    stopShooting() {
        this.unit.removeEventListener(ENTITY_EVENTS.ANIMATION.LOOP, this.spawnBullet);
        this.unit.playAnimation(UNIT_ANIMATIONS.IDLE);
        this.target = null;
        this.scanForTargets();
    }

    onDispose() {
        this.unit.removeEventListener(ENTITY_EVENTS.ANIMATION.LOOP, this.spawnBullet);
        clearTimeout(this.targetsScanTimeoutId);
    }

    isFriendlyTile(tile) {
        return tile.isHuman();
    }

    getFriendlyTileType() {
        return TILES_TYPES.HUMAN;
    }

    buildAtPosition(tile, variation) {
        if (!this.isBuilder()) return Promise.resolve();

        return new Promise(resolve => {
            this.unit.playAnimation(UNIT_ANIMATIONS.BUILD);
            setTimeout(() => {
                this.unit.playAnimation(UNIT_ANIMATIONS.IDLE);
                if (!this.isFriendlyTile(tile)) {
                    TileMap.changeTile(tile.getIndex(), this.getFriendlyTileType(), { variation });
                    this.disappear();
                }
                resolve();
            }, 3000) // BUILDING TIME SHOULD CHANGE DEPENDING ON TYPE OF BUILD
        })
    }

    goTo(startingPosition, destinationTile) {
        return new Promise(resolve => {
            const startingTile = TileMap.getTileAt(startingPosition);
            const path = TileMap.getPathToTile(startingTile, destinationTile);
            const moveTowardsTarget = () => {
                if (!path.length) {
                    this.unit.playAnimation(UNIT_ANIMATIONS.IDLE);
                    return resolve();
                }

                const tile = path.shift();

                const { x, z } = tile.getPosition();
                const targetPosition = new Vector3(x, MINIMUM_HEIGHT, z);
                const time = this.unit.getPosition().distanceTo(targetPosition) / this.getSpeed() * 1000;

                this.unit.lookAt(targetPosition);
                this.unit.playAnimation(UNIT_ANIMATIONS.RUN);
                this.unit
                    .goTo(targetPosition, time)
                    .then(moveTowardsTarget);
            }

            moveTowardsTarget();
        });
    }

    update() {
        if (this.target && this.isWarrior()) {
            this.lookAtTarget(this.target);
        }
    }
}