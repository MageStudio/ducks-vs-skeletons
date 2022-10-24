import { easing, Label } from "mage-engine";
import {
    BaseScript,
    constants,
    THREE,
    math,
    Sphere,
    ENTITY_EVENTS,
    PALETTES,
    Models,
    GameRunner,
    rxjs
} from "mage-engine";
import { getUnitAttackSound, playBuildingSound, VOLUMES } from "../../../sounds";
import WarriorLabel from "../../../ui/labels/WarriorLabel";
import { TILES_TYPES } from "../map/constants";
import TileMap from "../map/TileMap";
import { TARGET_DEAD_EVENT_TYPE } from "../players/TargetBehaviour";

const { BehaviorSubject } = rxjs;

const { MATERIALS } = constants;
const { LoopOnce, Vector3 } = THREE;

const UNIT_MATERIAL_PROPERTIES = {
    metalness: 0.2,
    roughness: 1.0
};

const DEFAULT_UNIT_SCALE = {
    x: 0.005,
    y: 0.005,
    z: 0.005
};

export const UNIT_ANIMATIONS = {
    IDLE: 'Root|Idle',
    RUN: 'Root|Run',
    SHOOT: 'Root|Shoot',
    THROW: 'Root|Throw',
    DEATH: 'Root|LayingDown',//'Root|Defeat',
    BUILD: 'Root|Interact'
};

export const UNIT_TYPES = {
    WARRIOR: 'WARRIOR',
    BUILDER: 'BUILDER'
};

const MINIMUM_HEIGHT = .2;
const SPEEDS = {
    BUILDER: 2.5,
    WARRIOR: 4
}
const MAXIMUM_SHOOTING_DISTANCE = 3;
const BULLET_INTERVAL = 100;
const BULLET_SIZE = 0.05;
const TARGETS_SCAN_INTERVAL = 3000;


export default class UnitBehaviour extends BaseScript {

    constructor(name) {
        super(name);
    }

    start(unit, { position = {}, unitType, builder = false, warrior = false, script }) {
        this.unit = unit;
        this.position = {
            ...position,
            y: MINIMUM_HEIGHT
        };

        this.unitType = unitType;
        this.builder = builder;
        this.warrior = warrior;

        this._ammo = 3;
        this.ammo = new BehaviorSubject(this._ammo);
        this.initialPosition = position;

        this.targetsScanTimeoutId = null;

        if (this.isWarrior()) {
            const warriorLabel = new Label({ Component: WarriorLabel, width: 1, height: 1.1, unit, script });
            window.warriorLabel = warriorLabel;
            this.unit.add(warriorLabel, unit.getBodyByName('Head'), { waitForBody: 200, waitForBodyMaxRetries: 5 })
                    .then(() => warriorLabel.setPosition({ x: -1, y: 1.5 }));
        }

        this.unit.setMaterialFromName(MATERIALS.STANDARD, UNIT_MATERIAL_PROPERTIES);
        this.unit.setScale(this.getUnitScale());
        this.unit.playAnimation(UNIT_ANIMATIONS.IDLE);
        this.unit.setPosition(this.position);

        this.attackSound = getUnitAttackSound();
        this.unit.add(this.attackSound);
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

    isFriendly() { return false; }

    isBuilder() { return this.unitType === UNIT_TYPES.BUILDER; }
    isWarrior() { return this.unitType === UNIT_TYPES.WARRIOR; }
    getSpeed() { return this.isBuilder() ? SPEEDS.BUILDER : SPEEDS.WARRIOR; }

    disappear() {
        this.unit.fadeTo(0, 1000)
            .then(() => this.unit.dispose());
    }

    die() {
        this.unit.playAnimation(UNIT_ANIMATIONS.DEATH, { loop: LoopOnce });
        // setTimeout(() => this.unit.dispose(), 10000);
        
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
            this.target = target;
            GameRunner
                .getCurrentLevel()
                .getPlayerByType(this.getEnemyTileType())
                .setUnderAttack(true);
            this.startShootingAt(target);
        } else {
            this.targetsScanTimeoutId = setTimeout(this.scanForTargets, TARGETS_SCAN_INTERVAL);
        }
    }

    goBackHome() {
        this.goTo(this.destinationTile.getIndex(), TileMap.getTileAt(this.initialPosition))
            .then(() => this.unit.dispose())
    }

    handleNoAmmo() {
        this.stopShooting(false);
        this.goBackHome();
    }

    spawnBullet = () => {
        this._ammo = this._ammo - 1;
        if (this._ammo < 0) {
            this.handleNoAmmo();
        } else {
            this.attackSound.play(VOLUMES.UNIT.ATTACK);
            this.ammo.next(this._ammo);
            return new Sphere(BULLET_SIZE, PALETTES.BASE.BLACK)
                .addScript('BulletBehaviour', { position: this.unit.getPosition(), target: this.target })
                .shoot()
        }
    }

    startShootingAt(target) {
        if (!this.isWarrior()) return;

        this.lookAtTarget(target);

        this.target.addEventListener(TARGET_DEAD_EVENT_TYPE, () => this.stopShooting());
        
        if (this.unit.getPosition().distanceTo(target.getPosition()) <= MAXIMUM_SHOOTING_DISTANCE) {
            this.unit.playAnimation(UNIT_ANIMATIONS.THROW);
            this.unit.addEventListener(ENTITY_EVENTS.ANIMATION.LOOP, this.spawnBullet);
            this.spawnBullet();
        }
    }

    stopShooting(shouldScan = true) {
        this.unit.removeEventListener(ENTITY_EVENTS.ANIMATION.LOOP, this.spawnBullet);
        this.unit.playAnimation(UNIT_ANIMATIONS.IDLE);
        this.target = null;
        if (shouldScan) {
            this.scanForTargets();
        }
    }

    onDispose() {
        this.unit.removeEventListener(ENTITY_EVENTS.ANIMATION.LOOP, this.spawnBullet);
        clearTimeout(this.targetsScanTimeoutId);
    }

    canIBuildOnTile(tile) {
        return tile.isDesert();
    }

    isFriendlyTile(tile) {
        return tile.isHuman();
    }

    getFriendlyTileType() {
        return TILES_TYPES.HUMAN;
    }

    buildAtPosition(tile, variation) {
        if (!this.isBuilder()) return Promise.resolve();
        if (!this.canIBuildOnTile(tile)) {
            this.goBackHome();
            return Promise.resolve(null);
        }

        const buildingTime = 3000; // needs calculation for right amount of time.
        const newTile = TileMap.changeTile(tile.getIndex(), this.getFriendlyTileType(), { variation });

        newTile.startBuilding(buildingTime, this.isFriendly());

        return new Promise(resolve => {
            this.unit.playAnimation(UNIT_ANIMATIONS.BUILD);
            setTimeout(() => {
                this.unit.playAnimation(UNIT_ANIMATIONS.IDLE);
                if (!this.unit.isDisposed()) {
                    newTile.stopBuilding();
                    resolve(newTile);
                }
                this.goBackHome();
            }, buildingTime);
        });
    }

    jumpTo({ x, z }, time) {
        const { x: _x, z: _z } = this.unit.getPosition();

        easing.tweenTo(0, .5, {
            onUpdate: (v) => this.unit.getBody().position.setY(v),
            time: time/2,
            loop: easing.LOOPING.BOUNCE,
            easing: easing.FUNCTIONS.Quadratic.InOut,
            repeat: 2,
        });

        return easing.tweenTo({ x: _x, z: _z }, { x, z }, {
            onUpdate: ({ x, z }) => {
                this.unit.getBody().position.setX(x);
                this.unit.getBody().position.setZ(z);
            },
            time,
            easing: easing.FUNCTIONS.Quadratic.InOut
        })
    }

    goTo(startingPosition, destinationTile) {
        this.destinationTile = destinationTile;
        // storing this for future movements
        this.unit.setData('tile:start:index', destinationTile.getIndex());

        return new Promise(resolve => {
            const startingTile = TileMap.getTileAt(startingPosition);
            const path = TileMap.getPathToTile(startingTile, destinationTile);

            const moveTowardsTarget = (currentPath) => {
                if (!currentPath.length) {
                    return resolve();
                }

                const tile = currentPath.shift();

                const { x, z } = tile.getPosition();
                const targetPosition = new Vector3(x, MINIMUM_HEIGHT, z);
                const time = this.unit.getPosition().distanceTo(targetPosition) / this.getSpeed() * 1000;

                this.unit.lookAt(targetPosition);

                this.jumpTo(targetPosition, time)
                    .then(() => moveTowardsTarget(currentPath));
            }

            moveTowardsTarget(path);
        });
    }

    update() {
        if (this.target && this.isWarrior()) {
            this.lookAtTarget(this.target);
        }
    }
}