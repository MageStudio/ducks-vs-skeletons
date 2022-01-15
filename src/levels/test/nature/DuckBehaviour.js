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
const { Vector3 } = THREE;

const DUCK_MATERIAL_PROPERTIES = {
    metalness: 0.2,
    roughness: 1.0
};

const DUCK_SCALE = {
    x: 0.2,
    y: 0.2,
    z: 0.2
};

const WEAPON_RELATIVE_POSITION = {
    x: -.3,
    y: .3,
    z: .3
};

const WEAPON_RELATIVE_ROTATION = {
    y: Math.PI
};

const WEAPON_SCALE = {
    x: 15,
    y: 15,
    z: 15
}

const MINIMUM_HEIGHT = .2;
const SPEEDS = {
    BUILDER: 0.5,
    WARRIOR: 0.8
}
const MAXIMUM_SHOOTING_DISTANCE = 4;
const BULLET_INTERVAL = 250;
const BULLET_SIZE = 0.01;

export default class DuckBehaviour extends BaseScript {

    constructor() {
        super('DuckBehaviour');
    }

    start(duck, { position = {}, builder = false, warrior = false }) {
        this.duck = duck;
        this.position = {
            ...position,
            y: MINIMUM_HEIGHT
        };

        this.builder = builder;
        this.warrior = warrior;

        this.angle = 0;
        this.angleIncrement = 7;
        this.angleDampening = 150;

        console.log('setting duck here');
        window.duck = duck;
        
        this.duck.setMaterialFromName(MATERIALS.STANDARD, DUCK_MATERIAL_PROPERTIES);
        this.duck.setScale(DUCK_SCALE);
        this.duck.setPosition(this.position);
    }
    
    addWeapon() {
        if (this.isWarrior()) {
            const weapon = Models.getModel('shotgun')
            weapon.setMaterialFromName(MATERIALS.STANDARD, DUCK_MATERIAL_PROPERTIES);
            this.duck.add(weapon);
            weapon.setPosition(WEAPON_RELATIVE_POSITION);
            weapon.setScale(WEAPON_SCALE);
            weapon.setScale(WEAPON_RELATIVE_ROTATION);
        }
    }

    isBuilder = () => this.builder;
    isWarrior = () => this.warrior;
    getSpeed = () => this.isBuilder() ? SPEEDS.BUILDER : SPEEDS.WARRIOR;

    die() {
        this.duck.fadeTo(0, 1000)
            .then(() => this.duck.dispose());
    }

    lookAtTarget(target) {
        const { x, z } = target.getPosition();
        this.duck.lookAt({
            x,
            y: MINIMUM_HEIGHT,
            z
        });
    }

    scanForTargets = () => {
        // get all enemy tiles
        const { tile } = math.pickRandom(
                TileMap.getTilesByType(TILES_TYPES.HUMAN)
                    .map(tile => ({ tile, distance: this.duck.getPosition().distanceTo(tile.getPosition()) }))
                    .filter(({ distance }) => distance <= MAXIMUM_SHOOTING_DISTANCE)
        )

        if (tile) {
            this.shootAt(tile);
        }
    }

    spawnBullet = () => {
        setTimeout(() => {
            new Sphere(BULLET_SIZE, PALETTES.BASE.BLACK)
                .addScript('BulletBehaviour', { position: this.duck.getPosition(), target: this.target })
                .shoot()
        }, BULLET_INTERVAL);
    }

    shootAt(target) {
        if (!this.isWarrior()) return;

        this.target = target;
        this.lookAtTarget(target);
        
        if (this.duck.getPosition().distanceTo(target.getPosition()) <= MAXIMUM_SHOOTING_DISTANCE) {
            this.duck.addEventListener(ENTITY_EVENTS.ANIMATION.LOOP, this.spawnBullet)
            this.spawnBullet();
        }
    }

    buildAtPosition(tile, variation) {
        if (!this.isBuilder()) return;

        setTimeout(() => {
            if (!tile.isForest()) {
                TileMap.changeTile(tile.getIndex(), TILES_TYPES.FOREST, { variation });
                this.die();
            }
        }, 3000)
    }

    goTo(tile) {
        const { x, z } = tile.getPosition();
        const targetPosition = new Vector3(x, MINIMUM_HEIGHT, z);
        const time = this.duck.getPosition().distanceTo(targetPosition) / this.getSpeed() * 1000;

        this.duck.lookAt(targetPosition);
        return this.duck.goTo(targetPosition, time);
    }

    update(dt) {
        if (this.target && this.isWarrior()) {
            this.lookAtTarget(this.target);
        }

        this.angle += this.angleIncrement * dt;
        this.duck.setPosition({ y: Math.sin(this.angle * 2) / this.angleDampening + MINIMUM_HEIGHT });
    }
}