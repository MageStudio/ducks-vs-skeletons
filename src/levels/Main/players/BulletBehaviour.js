import {
    BaseScript,
    PARTICLES,
    Particles,
    THREE
} from "mage-engine";
import { TARGET_DEAD_EVENT_TYPE } from "./TargetBehaviour";

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

        this.target.addEventListener(TARGET_DEAD_EVENT_TYPE, this.destroyBullet);
    }

    destroyBullet = () => {
        this.bullet.dispose();
    }

    handleBulletCollision = () => {
        this.target
            .getScript('TargetBehaviour')
            .processHit(BULLET_DAMAGE);

        this.destroyBullet();
    }

    onDispose() {
        this.target.removeEventListener(TARGET_DEAD_EVENT_TYPE, this.destroyBullet);
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