import { BaseScript, THREE } from "mage-engine";

export default class CameraShake extends BaseScript {
    start(camera, { duration = 0.5, shakeAmount = 0.1 }) {
        this.camera = camera;
        this.duration = duration;
        this.shakeAmount = shakeAmount;
        this.shakeTimer = this.duration;

        this.canShake = false;
    }

    reset() {
        this.canShake = false;
        this.shakeTimer = this.duration;
        this.camera.goTo(this.originalPosition, 100);
    }

    startShaking({ duration = this.duration, shakeAmount = this.shakeAmount } = {}) {
        this.duration = duration;
        this.shakeAmount = shakeAmount;
        this.originalPosition = this.camera.getPosition().clone();

        this.canShake = true;
    }

    shake(dt) {
        if (this.shakeTimer > 0) {
            const vector = new THREE.Vector3();
            const newPosition = this.originalPosition
                .clone()
                .add(vector.random().multiplyScalar(this.shakeAmount));

            this.camera.setPosition(newPosition);
            this.shakeTimer -= dt;
        } else {
            this.reset();
        }
    }

    update(dt) {
        if (this.canShake) {
            this.shake(dt);
        }
    }
}
