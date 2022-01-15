import {
    BaseScript,
    constants,
    THREE,
    math,
    Sphere,
    ENTITY_EVENTS,
    PALETTES,
    Models
} from "mage-engine";
import { TILES_TYPES } from "../map/constants";
import TileMap from "../map/TileMap";

const { MATERIALS } = constants;
const { LoopOnce, Vector3 } = THREE;

const UNIT_MATERIAL_PROPERTIES = {
    metalness: 0.2,
    roughness: 1.0
};

const DEFAULT_UNIT_SCALE = {
    x: 0.0008,
    y: 0.0008,
    z: 0.0008
};

const UNIT_ANIMATIONS = {
    IDLE: 'Root|Idle',
    RUN: 'Root|Run',
    SHOOT: 'Root|Shoot',
    DEATH: 'Root|Death',
    BUILD: 'Root|CrouchIdle'
};

const MINIMUM_HEIGHT = .2;
const SPEEDS = {
    BUILDER: 0.5,
    WARRIOR: 0.8
}
const MAXIMUM_SHOOTING_DISTANCE = 4;
const BULLET_INTERVAL = 250;
const BULLET_SIZE = 0.01;

export default class UnitBehaviour extends BaseScript {

    constructor(name) {
        super(name);
    }

    start(unit, { position = {}, builder = false, warrior = false }) {
        this.unit = unit;
        this.position = {
            ...position,
            y: MINIMUM_HEIGHT
        };

        console.log('setting unit at', this.position);

        this.builder = builder;
        this.warrior = warrior;

        window.unit = unit;

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
    
    addWeapon() {
        if (this.isWarrior()) {
            const weapon = Models.getModel('shotgun')
            weapon.setMaterialFromName(MATERIALS.STANDARD, UNIT_MATERIAL_PROPERTIES);
            this.unit.add(weapon);
            weapon.setPosition(this.getUnitWeaponRelativePosition());
            weapon.setScale(this.getUnitWeaponScale());
            weapon.setScale(this.getUnitWeaponRelativeRotation());
        }
    }

    isBuilder() { return this.builder; }
    isWarrior() { return this.warrior; }
    getSpeed() { return this.isBuilder() ? SPEEDS.BUILDER : SPEEDS.WARRIOR; }

    die() {
        this.unit.playAnimation(UNIT_ANIMATIONS.DEATH, { loop: LoopOnce });
        this.unit.fadeTo(0, 1000)
            .then(() => this.unit.dispose());
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

    scanForTargets = () => {
        this.unit.playAnimation(UNIT_ANIMATIONS.IDLE);
        // get all enemy tiles
        const { tile } = math.pickRandom(
                TileMap.getTilesByType(this.getEnemyTileType())
                    .map(tile => ({ tile, distance: this.unit.getPosition().distanceTo(tile.getPosition()) }))
                    .filter(({ distance }) => distance <= MAXIMUM_SHOOTING_DISTANCE)
        )

        if (tile) {
            this.shootAt(tile);
        }
    }

    spawnBullet = () => {
        setTimeout(() => {
            new Sphere(BULLET_SIZE, PALETTES.BASE.BLACK)
                .addScript('BulletBehaviour', { position: this.unit.getPosition(), target: this.target })
                .shoot()
        }, BULLET_INTERVAL);
    }

    shootAt(target) {
        if (!this.isWarrior()) return;

        this.target = target;
        this.lookAtTarget(target);
        
        if (this.unit.getPosition().distanceTo(target.getPosition()) <= MAXIMUM_SHOOTING_DISTANCE) {
            this.unit.playAnimation(UNIT_ANIMATIONS.SHOOT);
            this.unit.addEventListener(ENTITY_EVENTS.ANIMATION.LOOP, this.spawnBullet)
            this.spawnBullet();
        }
    }

    isFriendlyTile(tile) {
        return tile.isHuman();
    }

    getFriendlyTileType() {
        return TILES_TYPES.HUMAN;
    }

    buildAtPosition(tile, variation) {
        if (!this.isBuilder()) return;

        console.log('building here');

        this.unit.playAnimation(UNIT_ANIMATIONS.BUILD);
        setTimeout(() => {
            this.unit.playAnimation(UNIT_ANIMATIONS.IDLE);
            if (!this.isFriendlyTile(tile)) {
                TileMap.changeTile(tile.getIndex(), this.getFriendlyTileType(), { variation });
                this.die();
            }
        }, 3000)
    }

    goTo(tile) {
        console.log('going to ', tile);
        const { x, z } = tile.getPosition();
        const targetPosition = new Vector3(x, MINIMUM_HEIGHT, z);
        const time = this.unit.getPosition().distanceTo(targetPosition) / this.getSpeed() * 1000;

        this.unit.lookAt(targetPosition);
        this.unit.playAnimation(UNIT_ANIMATIONS.RUN);
        return this.unit.goTo(targetPosition, time);
    }

    update() {
        if (this.target && this.isWarrior()) {
            this.lookAtTarget(this.target);
        }
    }
}