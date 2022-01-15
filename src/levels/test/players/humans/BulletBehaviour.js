import { BaseScript, THREE, BUILTIN } from "mage-engine";


const { Vector3 } = THREE;
const BULLET_HEIGHT = 0.7;
const BULLET_TRAIL_SIZE = 0.1;
const BULLET_SPEED = 5;
const BULLET_DAMAGE = 2;
export default class BulletBehaviour extends BaseScript {

    constructor() {
        super('BulletBehaviour');
    }

    start(bullet, { target, position }) {
        this.bullet = bullet;
        this.target = target;

        bullet.addScript(BUILTIN.TRAILS, { size: BULLET_TRAIL_SIZE })
        bullet.setPosition({
            ...position,
            y: BULLET_HEIGHT
        });
    }

    shoot = () => {
        const { x, z } = this.target.getPosition();
        const targetPosition = new Vector3(x, BULLET_HEIGHT, z);
        const time = this.bullet.getPosition().distanceTo(targetPosition) / BULLET_SPEED * 1000;

        this.bullet.goTo(targetPosition, time).then(() => {
            this.bullet.getScript(BUILTIN.TRAILS).stop();
            this.bullet.dispose();
            // this is where tile is hit
            this.target.processHit(BULLET_DAMAGE);
        });
    }
}