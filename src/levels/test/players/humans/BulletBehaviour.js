import {
    BaseScript,
    PARTICLES,
    Particles,
    THREE
} from "mage-engine";

const { Vector3 } = THREE;
const BULLET_HEIGHT = 0.4;
const BULLET_SPEED = 5;
const BULLET_DAMAGE = 10;
export default class BulletBehaviour extends BaseScript {

    constructor() {
        super('BulletBehaviour');
    }

    start(bullet, { target, position }) {
        this.bullet = bullet;
        this.target = target;

        bullet.setPosition({
            ...position,
            y: BULLET_HEIGHT
        });

        this.addTrail();
    }

    addTrail() {
        const trail = Particles.add(PARTICLES.TRAIL, { texture: 'fire', size: 0.1 });
        trail.emit(Infinity);
        this.bullet.add(trail);
    }

    handleBulletCollision = () => {
        this.target
            .getScript('TargetBehaviour')
            .processHit(BULLET_DAMAGE);
        this.bullet.dispose();
    }

    shoot = () => {
        const { x, z } = this.target.getPosition();
        const targetPosition = new Vector3(x, BULLET_HEIGHT, z);
        const time = this.bullet.getPosition().distanceTo(targetPosition) / BULLET_SPEED * 1000;

        this.bullet
            .goTo(targetPosition, time)
            .then(this.handleBulletCollision);
    }
}